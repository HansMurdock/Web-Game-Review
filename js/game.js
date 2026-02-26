const API = "https://shuttlelike-ungated-oralee.ngrok-free.dev/api";

// Wajib ada untuk bypass ngrok browser warning
const HEADERS = {
  "Content-Type": "application/json",
  "ngrok-skip-browser-warning": "true"
};

const params = new URLSearchParams(location.search);
const game = params.get("game");

if (!game) {
  alert("Game tidak ditemukan!");
  window.location.href = "index.html";
}

document.getElementById("gameTitle").innerText = game;
document.getElementById("gameCover").src = `asset/${game.replaceAll(" ", "")}.jpg`;


/* =========================
   DOWNLOAD BUTTON
========================= */

const links = {
  "Mobile Legends": "https://play.google.com/store/apps/details?id=com.mobile.legends",
  "Minecraft": "https://www.minecraft.net",
  "Valorant": "https://playvalorant.com",
  "Roblox": "https://roblox.com",
  "Delta Force": "https://store.steampowered.com",
  "Honkai Star Rail": "https://hsr.hoyoverse.com",
  "Clash Royale": "https://play.google.com/store/apps/details?id=com.supercell.clashroyale"
};

document.getElementById("downloadBtn").onclick =
  () => window.open(links[game]);


/* =========================
   SHOW REVIEW FORM
========================= */

document.getElementById("reviewBtn").onclick = () => {
  const section = document.getElementById("reviewFormSection");
  section.style.display = "block";
  section.scrollIntoView({ behavior: "smooth" });
};


/* =========================
   SLIDER
========================= */

// Deklarasi slider hanya SEKALI
const slider = document.getElementById("slider");

loadSlider();

function loadSlider() {
  const folderMap = {
    "Mobile Legends": "GameMobileLegends",
    "Minecraft": "GameMinecraft",
    "Roblox": "GameRoblox",
    "Valorant": "GameValorant",
    "Honkai Star Rail": "GameHonkaiStarRail",
    "Delta Force": "GameDeltaForce",
    "Clash Royale": "GameClashRoyale"
  };

  const prefixMap = {
    "Mobile Legends": "ML",
    "Minecraft": "MC",
    "Roblox": "RBX",
    "Valorant": "VALO",
    "Honkai Star Rail": "HSR",
    "Delta Force": "DF",
    "Clash Royale": "CR"
  };

  const folder = folderMap[game];
  const prefix = prefixMap[game];

  for (let i = 1; i <= 5; i++) {
    const img = document.createElement("img");
    img.src = `asset/${folder}/${prefix}${i}.jpg`;
    img.onerror = () => img.remove();
    slider.appendChild(img);
  }
}


/* =========================
   SLIDER BUTTONS
========================= */

document.getElementById("slideLeft").onclick =
  () => slider.scrollBy({ left: -400, behavior: "smooth" });

document.getElementById("slideRight").onclick =
  () => slider.scrollBy({ left: 400, behavior: "smooth" });


/* =========================
   LOAD REVIEWS
========================= */

async function loadReviews() {
  try {

    // endpoint benar
    const res = await fetch(`${API}/reviews/${encodeURIComponent(game)}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "ngrok-skip-browser-warning": "true"
      }
    });

    const reviews = await res.json();

    const container = document.getElementById("reviewList");

    // penting: jangan null
    if (!container) return;

    container.innerHTML = "";

    if (!reviews.length) {
      container.innerHTML =
        "<p style='margin-left:30px'>Belum ada review</p>";
      return;
    }

    reviews.forEach(r => {

      const date = new Date(r.created_at);

      const stars =
        "★".repeat(r.rating_gameplay) +
        "☆".repeat(5 - r.rating_gameplay);

      container.innerHTML += `
<div class="review-card">

  <div style="display:flex;justify-content:space-between;align-items:center">

    <div>
      <div style="font-weight:bold;font-size:16px">
        ${r.username}
      </div>

      <div style="color:#aaa;font-size:12px">
        ${date.toLocaleDateString()} • ⏱ ${r.hours_played} hours
      </div>

      <div style="color:gold;margin-top:3px">
        ${stars}
      </div>

      <div style="margin-top:8px">
        <b>Kritik:</b><br>
        ${r.kritik || "-"}
      </div>

      <div style="margin-top:6px">
        <b>Saran:</b><br>
        ${r.saran || "-"}
      </div>

                 </div>

            </div>

        </div>
        `;
    });

  }
  catch(err) {
    console.log("loadReviews error:", err);
  }
}


/* =========================
   POPUP
========================= */

function closePopup() {
  document.getElementById("successPopup").classList.remove("show");
  document.getElementById("reviewList").scrollIntoView({ behavior: "smooth" });
}


/* =========================
   SUBMIT REVIEW
========================= */

document.getElementById("reviewForm").addEventListener("submit", async function (e) {
  e.preventDefault();

  const submitBtn = document.getElementById("submitBtn");
  submitBtn.disabled = true;
  submitBtn.innerText = "Menyimpan...";

  try {
    const res = await fetch(`${API}/reviews`, {
      method: "POST",
      headers: HEADERS,
      body: JSON.stringify({
        username: document.getElementById("username").value,
        email: document.getElementById("email").value,
        age: document.getElementById("age").value,
        game: game,
        platform: document.getElementById("platform").value,
        hours_played: document.getElementById("hours").value,
        rating_gameplay: document.getElementById("ratingGameplay").value,
        rating_graphic: document.getElementById("ratingGraphic").value,
        rating_story: document.getElementById("ratingStory").value,
        kritik: document.getElementById("kritik").value,
        saran: document.getElementById("saran").value,
        recommend: document.getElementById("recommend").value
      })
    });

    const data = await res.json();
    console.log("Response:", data);

    // 1. Sembunyikan form
    document.getElementById("reviewFormSection").style.display = "none";

    // 2. Reset form & bintang
    e.target.reset();
    document.querySelectorAll(".star-rating span").forEach(s => {
      s.classList.remove("active");
      s.innerText = "☆";
    });
    document.getElementById("ratingGameplay").value = "0";
    document.getElementById("ratingGraphic").value = "0";
    document.getElementById("ratingStory").value = "0";

    // 3. Reload reviews (1x saja), lalu tampilkan popup
    await loadReviews();
    document.getElementById("successPopup").classList.add("show");

  } catch (err) {
    alert("Submit gagal: " + err.message);
    console.log("Submit error:", err);
  } finally {
    submitBtn.disabled = false;
    submitBtn.innerText = "Submit Review";
  }
});


/* =========================
   STAR RATING
========================= */

document.querySelectorAll(".star-rating").forEach(container => {
  const spans = container.querySelectorAll("span");
  const type = container.dataset.type;

  spans.forEach(star => {
    star.addEventListener("click", () => {
      const value = star.dataset.value;

      spans.forEach(s => {
        if (s.dataset.value <= value) {
          s.classList.add("active");
          s.innerText = "★";
        } else {
          s.classList.remove("active");
          s.innerText = "☆";
        }
      });

      if (type === "gameplay") document.getElementById("ratingGameplay").value = value;
      if (type === "graphic")  document.getElementById("ratingGraphic").value = value;
      if (type === "story")    document.getElementById("ratingStory").value = value;
    });
  });
});

function getTimeAgo(date){

const seconds =
Math.floor((new Date()-new Date(date))/1000);

const intervals = {

year:31536000,
month:2592000,
day:86400,
hour:3600,
minute:60

};

for(let key in intervals){

const value =
Math.floor(seconds/intervals[key]);

if(value>=1)
return value+" "+key+(value>1?"s":"")+" ago";

}

return "just now";

}

async function loadAverage(){

const res =
await fetch(`${API}/stats/average/${game}`,{
 headers:HEADERS
});

const data = await res.json();

if(data.length){

const avg =
Number(data[0].average_rating).toFixed(1);

document.getElementById("avgRating").innerHTML =
renderStars(avg)+" "+avg;

}

}

function renderStars(rating){

let stars="";

for(let i=1;i<=5;i++){

stars+= i<=rating?"★":"☆";

}

return `<span style="color:gold">${stars}</span>`;

}

/* =========================
   INIT
========================= */
loadReviews();
loadAverage();
