const canvas = document.getElementById("wheel");
const ctx = canvas.getContext("2d");

let options = [];
let angle = 0;
let velocity = 0;
let spinning = false;
let lastResultIndex = null;

const OFFSET = -Math.PI / 2;

const textarea = document.getElementById("options");
const resultDiv = document.getElementById("result");
const darkBtn = document.getElementById("dark");

// ============================
// INIT
// ============================
function loadOptions() {
  const saved = localStorage.getItem("roletaOptions");
  textarea.value = saved || "Opção 1\nOpção 2\nOpção 3\nOpção 4";

  const theme = localStorage.getItem("theme");

  if (theme === "dark") {
    document.body.classList.add("dark");
    darkBtn.innerText = "☀️ Light Mode";
  } else {
    darkBtn.innerText = "🌙 Dark Mode";
  }

  updateOptions();
}

// ============================
// ATUALIZAÇÃO DAS OPÇÕES
// ============================
function updateOptions() {
  options = textarea.value.split("\n").filter(o => o.trim());
  draw();
}

// ============================
// DESENHO DA ROLETA
// ============================
function draw() {
  if (!options.length) return;

  const arc = (2 * Math.PI) / options.length;
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  options.forEach((opt, i) => {
    const start = i * arc + angle + OFFSET;

    ctx.beginPath();
    ctx.moveTo(250, 250);
    ctx.arc(250, 250, 250, start, start + arc);
    ctx.fillStyle = `hsl(${i * 360 / options.length}, 70%, 60%)`;
    ctx.fill();

    ctx.save();
    ctx.translate(250, 250);
    ctx.rotate(start + arc / 2);
    ctx.fillStyle = "#000";
    ctx.font = "18px Arial";
    ctx.textAlign = "right";
    ctx.fillText(opt, 220, 5);
    ctx.restore();
  });
}

// ============================
// ANIMAÇÃO
// ============================
function animate() {
  if (!spinning) return;

  angle += velocity;
  velocity *= 0.985;

  if (velocity < 0.002) {
    spinning = false;
    showResult();
  }

  draw();
  requestAnimationFrame(animate);
}

// ============================
// GIRAR
// ============================
function spin() {
  if (spinning || options.length === 0) return;

  velocity = Math.random() * 0.4 + 0.35;
  spinning = true;
  animate();
}

// ============================
// RESULTADO CORRETO
// ============================
function showResult() {
  const arc = (2 * Math.PI) / options.length;

  let normalized = angle % (2 * Math.PI);
  if (normalized < 0) normalized += 2 * Math.PI;

  const index = Math.floor((2 * Math.PI - normalized) / arc) % options.length;

  lastResultIndex = index;
  resultDiv.innerText = "Resultado: " + options[index];
}

// ============================
// REMOVER OPÇÃO
// ============================
function removeSelected() {
  if (lastResultIndex === null) return;

  options.splice(lastResultIndex, 1);
  textarea.value = options.join("\n");

  localStorage.setItem("roletaOptions", textarea.value);
  updateOptions();

  resultDiv.innerText = "Resultado removido";
  lastResultIndex = null;
}

// ============================
// DARK MODE
// ============================
function toggleTheme() {
  document.body.classList.toggle("dark");

  if (document.body.classList.contains("dark")) {
    darkBtn.innerText = "☀️ Light Mode";
    localStorage.setItem("theme", "dark");
  } else {
    darkBtn.innerText = "🌙 Dark Mode";
    localStorage.setItem("theme", "light");
  }
}

// ============================
// EVENTOS
// ============================
document.getElementById("spinCenter").onclick = spin;
document.getElementById("remove").onclick = removeSelected;
darkBtn.onclick = toggleTheme;

// 🔥 ATUALIZA AUTOMATICAMENTE AO DIGITAR
textarea.addEventListener("input", () => {
  localStorage.setItem("roletaOptions", textarea.value);
  updateOptions();
});

// ============================
// START
// ============================
loadOptions();

