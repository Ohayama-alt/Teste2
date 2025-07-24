const canvas = document.getElementById("meuCanvas");
const ctx = canvas.getContext("2d");

const modo = document.getElementById("modo");
const cor = document.getElementById("cor");
const espessura = document.getElementById("espessura");
const limpar = document.getElementById("limpar");
const desfazer = document.getElementById("desfazer");
const salvar = document.getElementById("salvar");
const preencher = document.getElementById("preencher");

let desenhando = false;
let xInicio = 0, yInicio = 0;
let historico = [];

function salvarEstado() {
  const estado = ctx.getImageData(0, 0, canvas.width, canvas.height);
  historico.push(estado);
  if (historico.length > 20) historico.shift();
}

canvas.addEventListener("mousedown", (e) => {
  desenhando = true;
  xInicio = e.offsetX;
  yInicio = e.offsetY;

  salvarEstado();

  if (modo.value === "livre" || modo.value === "borracha") {
    ctx.beginPath();
    ctx.moveTo(xInicio, yInicio);
  }
});

canvas.addEventListener("mousemove", (e) => {
  if (!desenhando) return;

  const xAtual = e.offsetX;
  const yAtual = e.offsetY;

  if (modo.value === "livre" || modo.value === "borracha") {
    ctx.strokeStyle = modo.value === "borracha" ? "white" : cor.value;
    ctx.lineWidth = espessura.value;
    ctx.lineTo(xAtual, yAtual);
    ctx.stroke();
  } else {
    if (historico.length > 0) {
      ctx.putImageData(historico[historico.length - 1], 0, 0);
    } else {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
    }

    const largura = xAtual - xInicio;
    const altura = yAtual - yInicio;

    ctx.strokeStyle = cor.value;
    ctx.fillStyle = cor.value;
    ctx.lineWidth = espessura.value;

    switch (modo.value) {
      case "circulo":
        const raio = Math.hypot(largura, altura);
        ctx.beginPath();
        ctx.arc(xInicio, yInicio, raio, 0, 2 * Math.PI);
        preencher.checked ? ctx.fill() : ctx.stroke();
        break;
      case "quadrado":
        preencher.checked ? ctx.fillRect(xInicio, yInicio, largura, altura)
                          : ctx.strokeRect(xInicio, yInicio, largura, altura);
        break;
      case "linha":
        ctx.beginPath();
        ctx.moveTo(xInicio, yInicio);
        ctx.lineTo(xAtual, yAtual);
        ctx.stroke();
        break;
      case "x":
        ctx.beginPath();
        ctx.moveTo(xInicio, yInicio);
        ctx.lineTo(xAtual, yAtual);
        ctx.stroke();

        ctx.beginPath();
        ctx.moveTo(xInicio, yAtual);
        ctx.lineTo(xAtual, yInicio);
        ctx.stroke();
        break;
    }
  }
});

canvas.addEventListener("mouseup", (e) => {
  if (!desenhando) return;
  desenhando = false;

  if (modo.value === "livre" || modo.value === "borracha") return;

  const xFim = e.offsetX, yFim = e.offsetY;
  const largura = xFim - xInicio;
  const altura = yFim - yInicio;

  ctx.strokeStyle = cor.value;
  ctx.fillStyle = cor.value;
  ctx.lineWidth = espessura.value;

  if (historico.length > 0) ctx.putImageData(historico[historico.length - 1], 0, 0);

  switch (modo.value) {
    case "circulo":
      const raio = M
