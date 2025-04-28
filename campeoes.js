// Obter a URL atual
const urlParams = new URLSearchParams(window.location.search);

// Resgatar o valor do parâmetro 'id' na URL
const id = urlParams.get('id');
const region = urlParams.get('region');
const key = urlParams.get('key')

const backgroundImageUrl = `https://raw.githubusercontent.com/Roonyx43/LOL-API/refs/heads/main/assets/regions/${region}/${region}_bg_0.jpg`

// Definir o background do body
document.body.style.backgroundImage = `url(${backgroundImageUrl})`;
document.body.style.backgroundSize = 'cover'; // Faz a imagem cobrir todo o fundo
document.body.style.backgroundAttachment = 'fixed'; // Faz a imagem não rolar com a página

window.addEventListener('DOMContentLoaded', () => {
    const audioUrl = `https://raw.communitydragon.org/latest/plugins/rcp-be-lol-game-data/global/pt_br/v1/champion-choose-vo/${key}.ogg`

    const audio = new Audio(audioUrl)
    
    audio.volume = 0.0

    audio.play(audio)
})


//informações do campeão
const championContainer = document.getElementById('championContainer')



championContainer.innerHTML = `

        <div class="background-container">
            <img src="https://ddragon.leagueoflegends.com/cdn/img/champion/splash/${id}_0.jpg" class="background-img rounded-2">
            <div class="content">
                <div class="row">
                    <div clas="col-2">
                        <img src="https://raw.githubusercontent.com/Roonyx43/LOL-API/refs/heads/main/assets/regions/${region}/${region}_icon.png" style="width: 6%; filter: drop-shadow(2px 0px 1px rgba(0, 0, 0, 1));">
                    </div>
                </div>
                    <div class="row">
                        <hr class="border border-warning-subtle mt-5 mb-5 border-1 opacity-100">
                    </div>
                </div>
        </div>`
    
