const API_URL = "https://shuttlelike-ungated-oralee.ngrok-free.dev";

let selectedGame = "";

function openModal(game) {
  selectedGame = game;
  document.getElementById("gameTitle").innerText = game;
  document.getElementById("reviewModal").style.display = "block";
}

function closeModal() {
  document.getElementById("reviewModal").style.display = "none";
}

document.getElementById("reviewForm").addEventListener("submit", async (e) => {
  e.preventDefault();

  const data = {
    username: document.getElementById("username").value,
    email: document.getElementById("email").value,
    age: document.getElementById("age").value,
    game: selectedGame,
    platform: document.getElementById("platform").value,
    hours_played: document.getElementById("hours").value,
    rating_gameplay: document.getElementById("gameplay").value,
    rating_graphic: document.getElementById("graphic").value,
    rating_story: document.getElementById("story").value,
    kritik: document.getElementById("kritik").value,
    saran: document.getElementById("saran").value,
    recommend: document.getElementById("recommend").value
  };

  await fetch(`${API_URL}/api/reviews`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data)
  });

  alert("Review submitted!");
  closeModal();
  loadRanking();
});

async function loadRanking() {
  const res = await fetch(`${API_URL}/api/stats/ranking`);
  const data = await res.json();

  const container = document.getElementById("ranking");
  container.innerHTML = "";

  data.forEach(game => {
    container.innerHTML += `
      <div>
        ${game.game} - ⭐ ${Number(game.average_rating).toFixed(2)}
      </div>
    `;
  });
}

loadRanking();