// Obter a URL atual
const urlParams = new URLSearchParams(window.location.search);

// Resgatar o valor do parâmetro 'id' na URL
const id = urlParams.get('id');
const region = urlParams.get('region')

const backgroundImageUrl = `https://ddragon.leagueoflegends.com/cdn/img/champion/splash/${id}_0.jpg`

// Definir o background do body
document.body.style.backgroundImage = `url(${backgroundImageUrl})`;
document.body.style.backgroundSize = 'cover'; // Faz a imagem cobrir todo o fundo
document.body.style.backgroundAttachment = 'fixed'; // Faz a imagem não rolar com a página