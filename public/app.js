const loginForm = document.getElementById("loginForm");
const showRegister = document.getElementById("showRegister");
const dashboard = document.getElementById("dashboard");
const authSection = document.getElementById("auth");
const logoutBtn = document.getElementById("logoutBtn");
const addTargetForm = document.getElementById("addTargetForm");
const targetsList = document.getElementById("targetsList");

const API_URL = "http://localhost:3000"; // backend URL

// check if user is already logged in
if (localStorage.getItem("token")) {
  showDashboard();
}

// LOGIN
loginForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  const res = await fetch(`${API_URL}/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password })
  });

  const data = await res.json();
  if (res.ok) {
    localStorage.setItem("token", data.token);
    showDashboard();
  } else {
    alert(data.message);
  }
});

// LOGOUT
logoutBtn.addEventListener("click", () => {
  localStorage.removeItem("token");
  authSection.style.display = "block";
  dashboard.style.display = "none";
});

// DASHBOARD
async function showDashboard() {
  authSection.style.display = "none";
  dashboard.style.display = "block";
  await loadTargets();
}

// LOAD TARGETS
async function loadTargets() {
  targetsList.innerHTML = "";
  const token = localStorage.getItem("token");
  const res = await fetch(`${API_URL}/dashboard`, {
    headers: { "Authorization": `Bearer ${token}` }
  });
  const data = await res.json();
  if (res.ok) {
    data.targets.forEach(target => {
      const div = document.createElement("div");
      div.className = "target-item";
      div.innerHTML = `
        <span>${target.title} - ${target.week} - ${target.progress}%</span>
        <button onclick="deleteTarget(${target.id})">Hapus</button>
      `;
      targetsList.appendChild(div);
    });
  } else {
    alert(data.message);
  }
}

// ADD TARGET
addTargetForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  const title = document.getElementById("targetTitle").value;
  const week = document.getElementById("targetWeek").value;
  const token = localStorage.getItem("token");

  const res = await fetch(`${API_URL}/targets`, {
    method: "POST",
    headers: { 
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}` 
    },
    body: JSON.stringify({ title, week })
  });

  if (res.ok) {
    addTargetForm.reset();
    await loadTargets();
  } else {
    const data = await res.json();
    alert(data.message);
  }
});

// DELETE TARGET
async function deleteTarget(id) {
  const token = localStorage.getItem("token");
  const res = await fetch(`${API_URL}/targets/${id}`, {
    method: "DELETE",
    headers: { "Authorization": `Bearer ${token}` }
  });
  if (res.ok) {
    await loadTargets();
  } else {
    const data = await res.json();
    alert(data.message);
  }
}

// Simple reminder client-side at 09:00
setInterval(() => {
  const now = new Date();
  if (now.getHours() === 9 && now.getMinutes() === 0) {
    alert("Waktunya cek target belajar mingguanmu!");
  }
}, 60000);
