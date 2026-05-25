var numero1 = "";
var numero2 = "";
var operador = "";
var escribiendo2 = false;

function actualizarPantalla(valor) {
  document.getElementById("display").value = valor;
}

function actualizarExpresion(texto) {
  document.getElementById("display-expr").textContent = texto;
}

function appendNum(digito) {
  if (escribiendo2) {
    numero2 = numero2 + digito;
    actualizarPantalla(numero2);
  } else {
    numero1 = numero1 + digito;
    actualizarPantalla(numero1);
  }
}

function handleOp(op) {
  if (numero1 === "") return;

  operador = op;
  escribiendo2 = true;

  var simbolo = op;
  if (op === "+") simbolo = "+";
  if (op === "-") simbolo = "−";
  if (op === "*") simbolo = "×";
  if (op === "/") simbolo = "÷";

  actualizarExpresion(numero1 + " " + simbolo);
}

function handleEquals() {
  if (numero1 === "" || numero2 === "" || operador === "") return;

  var n1 = parseFloat(numero1);
  var n2 = parseFloat(numero2);
  var resultado = 0;

  if (operador === "+") resultado = n1 + n2;
  if (operador === "-") resultado = n1 - n2;
  if (operador === "*") resultado = n1 * n2;
  if (operador === "/") {
    if (n2 === 0) {
      actualizarPantalla("Error");
      actualizarExpresion("No se puede dividir entre 0");
      reiniciar();
      return;
    }
    resultado = n1 / n2;
  }

  actualizarExpresion(numero1 + " " + operador + " " + numero2 + " =");
  actualizarPantalla(resultado);

  numero1 = String(resultado);
  numero2 = "";
  operador = "";
  escribiendo2 = false;
}

function handlePercent() {
  if (numero1 === "") return;
  var resultado = parseFloat(numero1) / 100;
  actualizarExpresion(numero1 + "% =");
  actualizarPantalla(resultado);
  numero1 = String(resultado);
}

function appendDot() {
  if (escribiendo2) {
    if (numero2.indexOf(".") === -1) {
      if (numero2 === "") numero2 = "0";
      numero2 = numero2 + ".";
      actualizarPantalla(numero2);
    }
  } else {
    if (numero1.indexOf(".") === -1) {
      if (numero1 === "") numero1 = "0";
      numero1 = numero1 + ".";
      actualizarPantalla(numero1);
    }
  }
}

function handlePlusMinus() {
  if (escribiendo2 && numero2 !== "") {
    if (numero2[0] === "-") {
      numero2 = numero2.slice(1);
    } else {
      numero2 = "-" + numero2;
    }
    actualizarPantalla(numero2);
  } else if (numero1 !== "") {
    if (numero1[0] === "-") {
      numero1 = numero1.slice(1);
    } else {
      numero1 = "-" + numero1;
    }
    actualizarPantalla(numero1);
  }
}

function handleBackspace() {
  if (escribiendo2) {
    numero2 = numero2.slice(0, -1);
    actualizarPantalla(numero2 === "" ? "0" : numero2);
  } else {
    numero1 = numero1.slice(0, -1);
    actualizarPantalla(numero1 === "" ? "0" : numero1);
  }
}

function handleCE() {
  if (escribiendo2) {
    numero2 = "";
    actualizarPantalla("0");
  } else {
    numero1 = "";
    actualizarPantalla("0");
  }
}

function handleClear() {
  reiniciar();
  actualizarPantalla("0");
  actualizarExpresion(" ");
}

function handleSqrt() {
  if (numero1 === "") return;
  var n = parseFloat(numero1);
  if (n < 0) {
    actualizarPantalla("Error");
    return;
  }
  var resultado = Math.sqrt(n);
  actualizarExpresion("√(" + numero1 + ") =");
  actualizarPantalla(resultado);
  numero1 = String(resultado);
}

function handleReciprocal() {
  if (numero1 === "" || parseFloat(numero1) === 0) return;
  var resultado = 1 / parseFloat(numero1);
  actualizarExpresion("1/(" + numero1 + ") =");
  actualizarPantalla(resultado);
  numero1 = String(resultado);
}

function closeCalc() {
  document.getElementById("calc-window").style.display = "none";
}

function reiniciar() {
  numero1 = "";
  numero2 = "";
  operador = "";
  escribiendo2 = false;
}

function mostrarHora() {
  var ahora = new Date();
  var horas = ahora.getHours();
  var minutos = ahora.getMinutes();
  if (horas < 10) horas = "0" + horas;
  if (minutos < 10) minutos = "0" + minutos;
  document.getElementById("clock").textContent = horas + ":" + minutos;
}

mostrarHora();
setInterval(mostrarHora, 10000);
