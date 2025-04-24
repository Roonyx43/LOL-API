const apiKey = 'RGAPI-f74d2e3a-1cc4-4cc3-a810-ca4e1d66ea79'

async function getPUUID(nickname, tag) {
    const resp = await fetch(`https://americas.api.riotgames.com/riot/account/v1/accounts/by-riot-id/${nickname}/${tag}?api_key=${apiKey}`)
    const dados = await resp.json()
    const puuid = dados.puuid
    return puuid;
}

async function getMastery() {

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
    const resp = await fetch(`https://ddragon.leagueoflegends.com/cdn/15.8.1/data/pt_BR/champion.json`)
    const respRegion = await fetch(`https://raw.githubusercontent.com/Roonyx43/LOL-API/refs/heads/main/regions/championRegions.json`)
    const dadosRegion = await respRegion.json()
    const dadosChamp = await resp.json()
    
    const containerChamps = document.getElementById('cardChampions')

    let championsName = []
    dadosIds.forEach(championId => {
        const resultado = Object.values(dadosChamp.data).filter(item => item.key === String(championId.id))

        const nomeCampeao = resultado[0].id.toLowerCase();

        const regiao = dadosRegion[nomeCampeao] || { region: "", url: "https://raw.communitydragon.org/latest/plugins/rcp-be-lol-game-data/global/default/assets/loadouts/summonerbanners/flags/conqueror/leagueclient/flag_conqueror_3_profile.png" };
        console.log(regiao.url)
       

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
            region: regiao.region,
            regionUrl: regiao.url
        }
        championsName.push(objChamps)
    })

    containerChamps.innerHTML = '';
    let counter = 1;
    let masteryPngURL = 'https://raw.communitydragon.org/latest/plugins/rcp-fe-lol-shared-components/global/default/mastery-';
    const currentLevel = championsName[0].currentLevel;

    if (currentLevel >= 1 && currentLevel <= 9) {
        currentLevel = `${currentLevel}.png`;
    } else if (currentLevel > 9) {
        currentLevel = '10.png';
    }
    championsName.forEach((champ, index) => {
        let masteryLevel = champ.currentLevel > 9 ? '10.png' : `${champ.currentLevel}.png`
    
        containerChamps.innerHTML += `
            <div class="col-md-4 mb-4">
                <div class="card shadow-sm animate__animated animate__rollIn">
                    <div class="card-header" style="height: 50%">
                        <div class="d-flex justify-content-center">
                            <span class="">#${index + 1}</span>
                            <h5 class="flex-grow-1 text-center">${champ.name}</h5>
                            <img src="${champ.regionUrl}" alt="${champ.region}" width="30px" height="45px" class="position-absolute top-0 end-0 me-2 mt-0">
                        </div>
                    </div>
                    <img class="img-fluid" src="https://ddragon.leagueoflegends.com/cdn/img/champion/splash/${champ.id}_0.jpg" width="100%">
                    <div class="card-body">
                        <h5 class="text-center m-1">${champ.title}</h5>
                    </div>
                    <hr>
                    <div class="d-flex justify-content-center align-items-end">
                        <div class="d-flex flex-column align-items-center">
                            <p class="fs-5 text-warning mb-0 ms-2">${champ.currentLevel}</p>
                            <h5 class="text-center mb-2">${champ.curMastery.toLocaleString('pt-BR')}</h5>
                        </div>
                        <img src="https://raw.communitydragon.org/latest/plugins/rcp-fe-lol-shared-components/global/default/mastery-${masteryLevel}" alt="Mastery Level" width="50px" height="50px" class="ms-2">
                    </div>
                    <div class="progress rounded-top-0" role="progressbar" aria-label="Animated striped example" aria-valuenow="${champ.percMastery}" aria-valuemin="0" aria-valuemax="100">
                        <div class="progress-bar progress-bar-striped progress-bar-animated bg-primary text-bg-primary" style="width: ${champ.percMastery}%">${champ.percMastery}%</div>
                    </div>
                </div> 
            </div>
        `;
        counter++;
    });
    
}


document.getElementById('consultar').addEventListener('click', function() {
    getChampionsMastery()
})
