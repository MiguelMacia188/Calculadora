/* ============================================================
   CALCULADORA WINDOWS XP — script.js
   ============================================================ */

/* ── Estado ── */
let currentValue  = "0";   // Número en pantalla
let storedValue   = null;  // Primer operando
let currentOp     = null;  // Operador pendiente (+,-,*,/)
let freshResult   = false; // true cuando se acaba de pulsar =
let expressionStr = "";    // Texto de la expresión para el display secundario

/* ── Refs al DOM ── */
const display     = document.getElementById("display");
const displayExpr = document.getElementById("display-expr");
const statusMsg   = document.getElementById("status-msg");

/* ── Helpers ── */
function updateDisplay() {
  // Limitar dígitos visibles
  let val = currentValue;
  if (val.length > 12) {
    const num = parseFloat(val);
    val = num.toExponential(6);
  }
  display.value = val;
}

function setStatus(msg) {
  statusMsg.textContent = msg;
}

function setExpr(txt) {
  displayExpr.textContent = txt || "\u00a0";
}

/* ── Agregar dígito ── */
function appendNum(digit) {
  if (freshResult) {
    currentValue = digit;
    freshResult = false;
  } else {
    if (currentValue === "0" && digit !== ".") {
      currentValue = digit;
    } else {
      if (currentValue.length >= 12) return;
      currentValue += digit;
    }
  }
  updateDisplay();
  setStatus("Listo");
}

/* ── Agregar punto decimal ── */
function appendDot() {
  if (freshResult) {
    currentValue = "0.";
    freshResult = false;
    updateDisplay();
    return;
  }
  if (!currentValue.includes(".")) {
    currentValue += ".";
    updateDisplay();
  }
}

/* ── Operadores (+,-,*,/) ── */
function handleOp(op) {
  const opSymbols = { "+": "+", "-": "−", "*": "×", "/": "÷" };
  const sym = opSymbols[op] || op;

  if (storedValue !== null && currentOp !== null && !freshResult) {
    // Encadenar operaciones
    calculate();
  }

  storedValue  = parseFloat(currentValue);
  currentOp    = op;
  freshResult  = true;
  expressionStr = `${currentValue} ${sym}`;
  setExpr(expressionStr);
  setStatus(`Operación: ${sym}`);
}

/* ── Calcular resultado ── */
function calculate() {
  if (storedValue === null || currentOp === null) return;

  const a = storedValue;
  const b = parseFloat(currentValue);
  let result;

  switch (currentOp) {
    case "+": result = a + b; break;
    case "-": result = a - b; break;
    case "*": result = a * b; break;
    case "/":
      if (b === 0) {
        currentValue = "0";
        updateDisplay();
        setExpr("\u00a0");
        setStatus("Error: División entre cero");
        storedValue = null; currentOp = null; freshResult = true;
        showError("No se puede dividir entre cero");
        return;
      }
      result = a / b;
      break;
    default: return;
  }

  // Corregir punto flotante
  result = parseFloat(result.toPrecision(12));

  const opSymbols = { "+": "+", "-": "−", "*": "×", "/": "÷" };
  setExpr(`${a} ${opSymbols[currentOp]} ${b} =`);

  currentValue = String(result);
  storedValue  = null;
  currentOp    = null;
  freshResult  = true;
  updateDisplay();
  setStatus("Resultado listo");
}

/* ── Igual ── */
function handleEquals() {
  calculate();
}

/* ── Porcentaje ── */
function handlePercent() {
  let val = parseFloat(currentValue);
  if (storedValue !== null) {
    // % del número almacenado
    val = storedValue * (val / 100);
    setExpr(`${storedValue} × ${parseFloat(currentValue)}% =`);
  } else {
    val = val / 100;
    setExpr(`${currentValue}% =`);
  }
  val = parseFloat(val.toPrecision(12));
  currentValue = String(val);
  freshResult  = true;
  updateDisplay();
  setStatus("Porcentaje calculado");
}

/* ── Raíz cuadrada ── */
function handleSqrt() {
  const val = parseFloat(currentValue);
  if (val < 0) {
    setStatus("Error: raíz de número negativo");
    showError("Entrada no válida");
    return;
  }
  const result = parseFloat(Math.sqrt(val).toPrecision(12));
  setExpr(`√(${currentValue}) =`);
  currentValue = String(result);
  freshResult  = true;
  updateDisplay();
  setStatus("Raíz cuadrada");
}

/* ── Inverso 1/x ── */
function handleReciprocal() {
  const val = parseFloat(currentValue);
  if (val === 0) {
    setStatus("Error: división entre cero");
    showError("No se puede dividir entre cero");
    return;
  }
  const result = parseFloat((1 / val).toPrecision(12));
  setExpr(`1/(${currentValue}) =`);
  currentValue = String(result);
  freshResult  = true;
  updateDisplay();
  setStatus("Inverso calculado");
}

/* ── Cambiar signo ± ── */
function handlePlusMinus() {
  if (currentValue === "0") return;
  if (currentValue.startsWith("-")) {
    currentValue = currentValue.slice(1);
  } else {
    currentValue = "-" + currentValue;
  }
  updateDisplay();
}

/* ── Retroceso ── */
function handleBackspace() {
  if (freshResult) return;
  if (currentValue.length <= 1 || currentValue === "-0") {
    currentValue = "0";
  } else {
    currentValue = currentValue.slice(0, -1);
    if (currentValue === "-") currentValue = "0";
  }
  updateDisplay();
  setStatus("Listo");
}

/* ── CE (borrar entrada actual) ── */
function handleCE() {
  currentValue = "0";
  freshResult  = false;
  updateDisplay();
  setStatus("Entrada borrada");
}

/* ── C (borrar todo) ── */
function handleClear() {
  currentValue  = "0";
  storedValue   = null;
  currentOp     = null;
  freshResult   = false;
  expressionStr = "";
  updateDisplay();
  setExpr("\u00a0");
  setStatus("Listo");
}

/* ── Cerrar ventana ── */
function closeCalc() {
  document.getElementById("calc-window").style.display = "none";
}

/* ── Pequeño diálogo de error XP ── */
function showError(msg) {
  const old = document.getElementById("xp-error");
  if (old) old.remove();

  const dlg = document.createElement("div");
  dlg.id = "xp-error";
  dlg.innerHTML = `
    <div class="xp-err-title">
      <span>Calculadora</span>
      <button onclick="this.closest('#xp-error').remove()">✕</button>
    </div>
    <div class="xp-err-body">
      <span class="xp-err-icon">⚠️</span>
      <span>${msg}</span>
    </div>
    <div class="xp-err-footer">
      <button onclick="this.closest('#xp-error').remove()">Aceptar</button>
    </div>
  `;
  Object.assign(dlg.style, {
    position: "fixed", top: "50%", left: "50%",
    transform: "translate(-50%,-50%)",
    width: "220px",
    background: "#ece9d8",
    border: "2px solid #0a246a",
    borderRadius: "8px 8px 4px 4px",
    boxShadow: "4px 6px 16px rgba(0,0,0,0.5)",
    zIndex: "999",
    fontFamily: "Tahoma, sans-serif",
    fontSize: "11px",
  });

  // Estilos internos via CSS insertado una vez
  if (!document.getElementById("xp-err-style")) {
    const s = document.createElement("style");
    s.id = "xp-err-style";
    s.textContent = `
      #xp-error .xp-err-title {
        display:flex; justify-content:space-between; align-items:center;
        background:linear-gradient(to bottom,#1061c5,#4a8fd8);
        color:#fff; font-weight:bold; font-size:12px;
        padding:4px 6px; border-radius:6px 6px 0 0;
      }
      #xp-error .xp-err-title button {
        background:linear-gradient(to bottom,#e8534a,#b82010);
        color:#fff; border:1px solid #8b1a10;
        border-radius:2px; width:18px; height:16px;
        font-size:9px; cursor:pointer;
      }
      #xp-error .xp-err-body {
        padding:14px 12px; display:flex; align-items:center; gap:10px;
      }
      #xp-error .xp-err-icon { font-size:24px; }
      #xp-error .xp-err-footer {
        text-align:center; padding:6px; border-top:1px solid #b0b0b0;
      }
      #xp-error .xp-err-footer button {
        padding:3px 24px;
        background:linear-gradient(to bottom,#f4f2ec,#d8d4c4);
        border:1px solid #808080; border-radius:3px;
        font-family:Tahoma,sans-serif; font-size:11px;
        cursor:pointer;
      }
      #xp-error .xp-err-footer button:hover { background:#dff0ff; }
    `;
    document.head.appendChild(s);
  }

  document.body.appendChild(dlg);
  setTimeout(() => { if (dlg.parentNode) dlg.remove(); }, 4000);
}

/* ── Teclado ── */
document.addEventListener("keydown", (e) => {
  if (e.key >= "0" && e.key <= "9") appendNum(e.key);
  else if (e.key === ".") appendDot();
  else if (e.key === "+") handleOp("+");
  else if (e.key === "-") handleOp("-");
  else if (e.key === "*") handleOp("*");
  else if (e.key === "/") { e.preventDefault(); handleOp("/"); }
  else if (e.key === "Enter" || e.key === "=") handleEquals();
  else if (e.key === "Backspace") handleBackspace();
  else if (e.key === "Escape") handleClear();
  else if (e.key === "%") handlePercent();
});

/* ── Reloj de la barra de tareas ── */
function updateClock() {
  const now  = new Date();
  const h    = String(now.getHours()).padStart(2, "0");
  const m    = String(now.getMinutes()).padStart(2, "0");
  document.getElementById("clock").textContent = `${h}:${m}`;
}
updateClock();
setInterval(updateClock, 10000);

/* ── Drag & drop de la ventana ── */
(function () {
  const win = document.getElementById("calc-window");
  const bar = document.getElementById("title-bar");
  let dragging = false, ox = 0, oy = 0;

  bar.addEventListener("mousedown", (e) => {
    if (e.target.classList.contains("tb-btn")) return;
    dragging = true;
    const rect = win.getBoundingClientRect();
    ox = e.clientX - rect.left;
    oy = e.clientY - rect.top;
    win.style.transform = "none";
    win.style.left = rect.left + "px";
    win.style.top  = rect.top  + "px";
  });

  document.addEventListener("mousemove", (e) => {
    if (!dragging) return;
    let nx = e.clientX - ox;
    let ny = e.clientY - oy;
    nx = Math.max(0, Math.min(window.innerWidth  - win.offsetWidth,  nx));
    ny = Math.max(0, Math.min(window.innerHeight - win.offsetHeight - 30, ny));
    win.style.left = nx + "px";
    win.style.top  = ny + "px";
  });

  document.addEventListener("mouseup", () => { dragging = false; });
})();
