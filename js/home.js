const API_URL = "https://shuttlelike-ungated-oralee.ngrok-free.dev";

// daftar semua game dari asset
const allGames = [
    "Mobile Legends",
    "Clash Royale",
    "Minecraft",
    "Valorant",
    "Roblox",
    "Honkai Star Rail",
    "Delta Force"
];

// mapping asset
const gameAssets = {
    "Mobile Legends": "asset/MobileLegends.jpg",
    "Clash Royale": "asset/ClashRoyale.jpg",
    "Minecraft": "asset/Minecraft.jpg",
    "Valorant": "asset/Valorant.jpg",
    "Roblox": "asset/Roblox.jpg",
    "Honkai Star Rail": "asset/HonkaiStarRail.jpg",
    "Delta Force": "asset/DeltaForce.jpg"
};

async function loadHomeData() {

    try {

        console.log("Fetching API...");

        const res = await fetch(API_URL + "/api/stats/ranking");

        let apiData = [];

        if(res.ok){
            apiData = await res.json();
        }

        renderGames(apiData);
        updateStats(apiData);

    }
    catch(err){

        console.log("API offline, fallback mode");

        renderGames([]);
    }

}


function renderGames(apiData){

    const trending = document.getElementById("trendingGames");
    const topRated = document.getElementById("topRated");
    

    trending.innerHTML="";
    topRated.innerHTML="";

    // convert api data ke object
    const apiMap = {};

    apiData.forEach(g=>{
        apiMap[g.game] = g;
    });


    // tampilkan semua game dari asset
    allGames.forEach(gameName=>{

        const img = gameAssets[gameName];

        const data = apiMap[gameName];

        const rating = data ? parseFloat(data.average_rating).toFixed(1) : "0.0";
        const total = data ? data.total_review : 0;

        const card = `
        <div class="game-card" onclick="openGame('${gameName}')">

            <img src="${img}">

            <h4>${gameName}</h4>

            <div class="rating">
                ⭐ ${rating} (${total})
            </div>

        </div>
        `;

        trending.innerHTML += card;
        topRated.innerHTML += card;

    });

}


function updateStats(apiData){

    let total = 0;

    apiData.forEach(g=>{
        total += g.total_review;
    });

    document.getElementById("totalReviews").innerText = total;

    if(apiData.length>0){
        document.getElementById("highlightGame").innerText = apiData[0].game;
    }

}


function openGame(game){

    window.location.href =
        "game.html?game="+encodeURIComponent(game);

}

document
.getElementById("searchInput")
.addEventListener("input", function(){

const value=this.value.toLowerCase();

document
.querySelectorAll(".game-card")
.forEach(card=>{

const name=
card.innerText.toLowerCase();

card.style.display=
name.includes(value)
?"block":"none";

});

}); 

async function loadTotalReviews(){
  try{
    const res = await fetch(`${API_BASE}/api/reviews`);
    const data = await res.json();

    document.getElementById("totalReviews").innerText = data.length;
  }
  catch(err){
    console.error(err);
  }
}


loadTotalReviews();
loadHomeData();