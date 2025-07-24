const canvas = document.getElementById ("meuCanvas")
const ctx = canvas.getContext("2d")


const modo = document.getElementById ("modo")
const cor = document.getElementById ("cor")
const espessura = document.getElementById ("espessura")
const limpar = document.getElementById ("limpar")
const desfazer = document.getElementById ("desfazer")
const salvar = document.getElementById ("salvar")

let desenhando = false

let xInicio = 0, yInicio =0

let historico = []

function salvarEstado() {
    const estado = ctx.getImageData(0,0,canvas.width,canvas.height)
    historico.push (estado)

    if (historico.length > 20 ) {
    historico.shift();
    }
}

canvas.addEventListener("mousedown", (e) =>{
    desenhando = true;
    xInicio = e.offsetX;
    yInicio = e.offsetY;

    if (modo.value=="livre" || modo.value =="borracha") {
        ctx.beginPath();
        ctx.moveTo(xInicio, yInicio);
        salvarEstado()
    }
    
})

canvas.addEventListener("mousemove", (e) => {
    if (!desenhando)return
        
    const xAtual = e.offsetX 
    const yAtual = e.offsetY

    if (modo.value === "livre") {
        ctx.strokeStyle = cor.value;
        ctx.lineWidth = espessura.value;
        ctx.lineTo(xAtual,yAtual)
        ctx.stroke()
    }

    if (modo.value === "borracha") {
        ctx.strokeStyle = "white"
        ctx.lineWidth = espessura.value;
        ctx.lineTo(xAtual,yAtual)
        ctx.stroke()
    }
})

canvas.addEventListener("mouseup", (e) => {
    desenhando=false

    const xFim = e.offsetX;
    const yFim = e.offsetY;

    const largura = xFim - xInicio
    const altura = yFim - yInicio

    ctx.strokeStyle = cor.value;
    ctx.fillStyle = cor.value;
    ctx.lineWidth = espessura.value;

    if (modo.value !== "livre" && modo.value !== "borracha" ) {
        salvarEstado()
    }

    switch (modo.value) {
            case "circulo":
            const raio = Math.hypot(largura,altura)
            ctx.beginPath()
            ctx.arc(xInicio,yInicio,raio, 0, 2*Math.PI)
            preencher.checked ? ctx.fill () : ctx.stroke()
            
            break;
            case "quadrado":
            
            if (preencher.checked) {
                ctx.fillRect(xInicio,yInicio,largura,altura)
            } else {
                ctx.strokeRect(xInicio,yInicio,largura,altura)
            }
            break;
            case "linha":
            ctx.beginPath()
            ctx.moveTo(xInicio,yInicio)
            ctx.lineTo(xFim,yFim)
            ctx.stroke()
            break;
            
            case "x":
            ctx.beginPath();
            ctx.moveTo(xInicio, yInicio);
            ctx.lineTo(xFim, yFim);
            ctx.stroke();

            ctx.beginPath();
            ctx.moveTo(xInicio, yFim);
            ctx.lineTo(xFim, yInicio);
            ctx.stroke();
            break;
            
    }


});

limpar.addEventListener("click", ()=> {
    ctx.clearRect(0,0, canvas.width,canvas.height)

})

desfazer.addEventListener("click", ()=>{
    const ultimo = historico.pop();
    if(ultimo) {
        ctx.putImageData(ultimo,0,0)
    }
})

salvar.addEventListener("click", ()=> {
    const link = document.createElement("a")
    link.download = "Meu Desenho.Png"
    link.href = canvas.toDataURL()
    link.click()
})

canvas.addEventListener("touchstart", (e)=> {
    e.preventDefault();
    const touch = e.touches[0];
    const rect = canvas.getBoundingClientRect();
    xInicio = touch.clientX-rect.left
    yInicio = touch.clientY-rect.top
    desenhando=true

    if (modo.value == "livre" || modo.value == "borracha"){
        ctx.beginPath(xInicio,yInicio)
        salvarEstado()
    }
})

canvas.addEventListener("touchmove", (e)=> {
    e.preventDefault();
    if(!desenhando)return

    const touch = e.touches[0]
    const rect = canvas.getBoundingClientRect();
    let xAtual = touch.clientX - rect.left;
    let yAtual = touch.clientY - rect.top;
    

    if (modo.value == "livre") {
        ctx.strokeStyle = cor.value 
        ctx.lineWidth = espessura.value
        ctx.lineTo(xAtual,yAtual)
        ctx.stroke()
    }

    if (modo.value === "borracha") {
        ctx.strokeStyle = "white"
        ctx.lineWidth = espessura.value;
        ctx.lineTo(xAtual,yAtual)
        ctx.stroke()
    }
})

canvas.addEventListener("touchend", (e)=>{
    desenhando = false;

    const rect = canvas.getBoundingClientRect()
    const touch = e.changedTouches[0]
    const xFim = touch.clientX-rect.left
    const yFim = touch.clientY-rect.top

    const largura = xFim - xInicio
    const altura = yFim - yInicio

    ctx.strokeStyle = cor.value
    ctx.fillStyle = cor.value
    ctx.lineWidth = espessura.value;

    if (modo.value !=="livre" && modo.value !== "borracha"){
        salvarEstado()
    }

    switch (modo.value) {
        case "circulo":
        const raio = Math.hypot(largura,altura)
        ctx.beginPath()
        ctx.arc(xInicio,yInicio,raio, 0, 2*Math.PI)
        preencher.checked ? ctx.fill () : ctx.stroke()
        
        break;
        case "quadrado":
        if (preencher.checked) {
        ctx.fillRect (xInicio,yInicio,largura,altura)
        } else {
        ctx.strokeRect (xInicio,yInicio,largura,altura)
        }   
        break;
        case "linha":
        ctx.beginPath()
        ctx.moveTo(xInicio,yInicio)
        ctx.lineTo(xFim,yFim)
        ctx.stroke()

        break;
        case "x":

        ctx.beginPath()
        ctx.moveTo(xInicio,yInicio)
        ctx.lineTo(xFim,yFim)
        ctx.stroke()

        ctx.beginPath()
        ctx.moveTo(xFim,yInicio)
        ctx.lineTo(xInicio,yFim)
        ctx.stroke()

}

})

function ajustarCanvas () {
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width;
    canvas.height = rect.height
}

ajustarCanvas()
window.addEventListener("resize",ajustarCanvas)