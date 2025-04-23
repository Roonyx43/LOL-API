const apiKey = 'RGAPI-f74d2e3a-1cc4-4cc3-a810-ca4e1d66ea79'

async function getPUUID(nickname, tag){
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
    for (let i = 0; i < dadosLength; i++){
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
    const dadosChamp = await resp.json()
    const containerChamps = document.getElementById('cardChampions')
    let championsName = []
    dadosIds.forEach(championId => {
        const resultado = Object.values(dadosChamp.data).filter(item => item.key === String(championId.id))

        const leftMastery = Math.abs(championId.leftMastery)
        console.log(leftMastery)

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
            percMastery: percMastery.toFixed(1)
        }
        championsName.push(objChamps)
    })
    
    containerChamps.innerHTML = ''
    let counter = 1;
;
    championsName.forEach(champ => {
        containerChamps.innerHTML += `
        <div class="col-md-4 mb-4">
            <div class="card shadow-sm animate__animated animate__lightSpeedInRight">
                <div class="card-header" style="height: 50%">
                    <div class="d-flex justify-content-center">
                        <span class="">#${counter}</span>
                        <h5 class="flex-grow-1 text-center">${champ.name}</h5>
                    </div>
                    </div>
                <img class="img-fluid" src="https://ddragon.leagueoflegends.com/cdn/img/champion/splash/${champ.id}_0.jpg" width="100%">
                <div class="card-body">
                    <h5 class="text-center m-1">${champ.title}</h5>
                </div>
                <hr>
                <div class="progress rounded-top-0" role="progressbar" aria-label="Animated striped example" aria-valuenow="75" aria-valuemin="0" aria-valuemax="100">
                    <div class="progress-bar progress-bar-striped progress-bar-animated bg-primary text-bg-primary" style="width: ${champ.percMastery}%">${champ.percMastery}%</div>
                </div>
            </div> 
        </div>
        `;
        counter++
    })
}


document.getElementById('consultar').addEventListener('click', function(){
    getChampionsMastery()
})
