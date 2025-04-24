
const apiKey = 'RGAPI-a68498f7-f474-4db5-9c8c-b5a304fe6189'
let championsName = []

async function getPUUID(nickname, tag) {
    document.getElementById('loadingSpinner').style.display = 'block';
    const resp = await fetch(`https://americas.api.riotgames.com/riot/account/v1/accounts/by-riot-id/${nickname}/${tag}?api_key=${apiKey}`)
    const dados = await resp.json()
    const puuid = dados.puuid
    return puuid;
}

async function getMastery() {
    championsName = []; // limpa o array antes de carregar novos dados

    const gameName = document.getElementById('gameName').value
    const tagName = document.getElementById('tagName').value
    const counter = document.getElementById('counter').value
    const puuid = await getPUUID(gameName, tagName)
    const resp = await fetch(`https://br1.api.riotgames.com/lol/champion-mastery/v4/champion-masteries/by-puuid/${puuid}/top?count=${counter}&api_key=${apiKey}`)
    const dados = await resp.json()
    const dadosLength = dados.length

    let championsIds = []
    for (let i = 0; i < dadosLength; i++) {
        const objMastery = {
            id: dados[i].championId,
            curMastery: dados[i].championPoints,
            wonMastery: dados[i].championPointsSinceLastLevel,
            leftMastery: dados[i].championPointsUntilNextLevel,
            masteryLevel: dados[i].championLevel
        }
        championsIds.push(objMastery)
    }
    return championsIds
}

async function getChampionsMastery() {

    const dadosMastery = await getMastery();
    const dadosIds = dadosMastery
    document.getElementById('loadingSpinner').style.display = 'none';
    const resp = await fetch(`https://ddragon.leagueoflegends.com/cdn/15.8.1/data/pt_BR/champion.json`)
    const respRegion = await fetch(`https://raw.githubusercontent.com/Roonyx43/LOL-API/refs/heads/main/regions/championRegions.json`)
    const dadosRegion = await respRegion.json()
    const dadosChamp = await resp.json()
    
    const containerChamps = document.getElementById('cardChampions')

    dadosIds.forEach(championId => {
        const resultado = Object.values(dadosChamp.data).filter(item => item.key === String(championId.id))

        const nomeCampeao = resultado[0].id.toLowerCase();

        const regiao = dadosRegion[nomeCampeao] || { region: "", url: "https://raw.communitydragon.org/latest/plugins/rcp-be-lol-game-data/global/default/assets/loadouts/summonerbanners/flags/conqueror/leagueclient/flag_conqueror_3_profile.png" };
       

        const leftMastery = Math.abs(championId.leftMastery)

        const inicioMastery = championId.curMastery - championId.wonMastery

        const fimMastery = championId.curMastery + leftMastery

        const percMastery = ((championId.curMastery - inicioMastery) / (fimMastery - inicioMastery)) * 100

        const objChamps = {
            id: resultado[0].id,
            name: resultado[0].name,
            title: resultado[0].title,
            curMastery: championId.curMastery,
            leftMastery: leftMastery,
            wonMastery: championId.wonMastery,
            inicioMastery: inicioMastery,
            fimMastery: fimMastery,
            percMastery: percMastery.toFixed(1),
            currentLevel: championId.masteryLevel,
            nextLevel: championId.masteryLevel + 1,
            lastLevel: championId.masteryLevel - 1,
            regionId: regiao.region,
            region: formatarRegiao(regiao.region),
            regionUrl: regiao.url,
            lore: regiao.lore
        }
        championsName.push(objChamps)
    })

    containerChamps.innerHTML = '';
    let counter = 1;
    let currentLevel = championsName[0].currentLevel;

    if (currentLevel >= 1 && currentLevel <= 9) {
        currentLevel = `${currentLevel}.png`;
    } else if (currentLevel > 9) {
        currentLevel = '10.png';
    }


    championsName.forEach((champ, index) => {
        let masteryLevel = champ.currentLevel > 9 ? '10.png' : `${champ.currentLevel}.png`
    
        containerChamps.innerHTML += `
            <div class="col-md-3 mb-4" onclick="animateAndRedirect(this, '${champ.id}', '${champ.regionId}')" style="cursor: pointer;">
                <div class="card shadow-sm animate__animated animate__fadeIn">
                    <div class="card-header" style="height: 50%">
                        <div class="d-flex justify-content-center">
                            <span class="">${index + 1}°</span>
                            <h5 class="flex-grow-1 text-center">${champ.name}</h5>
                            <img src="https://raw.communitydragon.org/latest/plugins/rcp-fe-lol-collections/global/default/images/item-element/crest-and-banner-mastery-${masteryLevel}" alt="" width="45px" height="50px" class="position-absolute top-0 end-0 me-0 mt-0" data-bs-toggle="popover" data-bs-content="Maestria ${champ.currentLevel}" role="button" tabindex="0">
                        </div>
                    </div>
                    <img class="img-fluid" src="https://ddragon.leagueoflegends.com/cdn/img/champion/splash/${champ.id}_0.jpg" width="100%">
                    <img src="${champ.regionUrl}" alt="Region" width="40px" height="60px" class="position-absolute top-1 ms-2" style="margin-top: 49px; filter: drop-shadow(3px 0px 1px rgba(0, 0, 0, 1));" data-bs-toggle="popover" data-bs-content="${champ.region}" role="button" tabindex="0">
                    <div class="card-body">
                        <h5 class="text-center m-1">${champ.title}</h5>
                        
                    </div>
                    <hr class="mb-0">
                    <div class="d-flex justify-content-between align-items-center mt-0">
                        <div class="d-flex flex-column align-items-center flex-grow-1">
                            <p class="fs-5 text-warning mb-0">${champ.currentLevel}</p>
                            <h5 class="text-center mb-2">${champ.curMastery.toLocaleString('pt-BR')}</h5>
                            </div>
                    </div>
                    <div class="progress rounded-top-0" role="progressbar" aria-label="Animated striped example" aria-valuenow="${champ.percMastery}" aria-valuemin="0" aria-valuemax="100">
                        <div class="progress-bar progress-bar-striped progress-bar-animated bg-primary text-bg-primary" style="width: ${champ.percMastery}%">${champ.percMastery}%</div>
                    </div>
                </div> 
            </div>
        `;
        counter++;
        const popovers = document.querySelectorAll('[data-bs-toggle="popover"]');
        popovers.forEach(el => {
            new bootstrap.Popover(el, {
                trigger: 'hover', // 👈 aqui tá o segredo!
            });
        });

    });
    
}

function animateAndRedirect(element, champId, region) {
    // Evita múltiplos cliques
    element.style.pointerEvents = 'none';

    // Anima o card
    element.classList.remove('animate__fadeIn');
    element.classList.add('animate__animated', 'animate__hinge');

    // Após a animação do card
    element.addEventListener('animationend', () => {
        const transitionDiv = document.getElementById('page-transition');
        transitionDiv.style.pointerEvents = 'auto'; // bloqueia interações
        transitionDiv.style.opacity = '1';

        setTimeout(() => {
            window.location.href = `campeao.html?id=${champId}&region=${region}`;
        }, 500);
    },  { once: true });
}




document.getElementById('consultar').addEventListener('click', function() {
    getChampionsMastery()
})

function formatarRegiao(regiao) {
    const regioesFormatadas = {
      demacia: "Demacia",
      noxus: "Noxus",
      ionia: "Ionia",
      piltover: "Piltover",
      zaun: "Zaun",
      freljord: "Freljord",
      shurima: "Shurima",
      targon: "Targon",
      bilgewater: "Águas de Sentina",
      shadowisles: "Ilhas das Sombras",
      bandlecity: "Bandópolis",
      ixtal: "Ixtal",
      desconhecida: "Runeterra"
    };
  
    return regioesFormatadas[regiao] || regiao;
  }
