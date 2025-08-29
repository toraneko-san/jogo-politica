import { LUGARES } from "./const.js";

const controlesMovimento = document.querySelectorAll(
  ".controle-movimento > div"
);
const controlesAcao = document.querySelectorAll(".controle-acao > div");

const jogo = document.querySelector(".jogo");
const mapa = document.querySelector(".jogo-mapa");
const lugares = document.querySelector(".jogo-lugares");
const jogador = document.querySelector(".jogo-jogador");
const descricao = document.querySelector(".jogo-descricao");
const ordem = document.querySelector(".jogo-ordem");
const inicio = document.querySelector(".jogo-inicio")

const controle = {
  w: { estaPressionado: false },
  a: { estaPressionado: false },
  s: { estaPressionado: false },
  d: { estaPressionado: false },
  enter: { estaPressionado: false },
  shift: { estaPressionado: false },
};

const mapaPos = { x: 0, y: 0 };
let minX, maxX, minY, maxY;

let animacaoAtiva = false;
let idMapaAnimacao;

let temInicio = true;

document.addEventListener("keydown", pressionarControle);
controlesMovimento.forEach((controleMov) => {
  controleMov.addEventListener("mousedown", pressionarControle);
  controleMov.addEventListener("touchstart", pressionarControle);
});
controlesAcao.forEach((controleMov) => {
  controleMov.addEventListener("mousedown", pressionarControle);
  controleMov.addEventListener("touchstart", pressionarControle);
});

document.addEventListener("keyup", soltarControle);
controlesMovimento.forEach((controleMov) => {
  controleMov.addEventListener("mouseleave", soltarControle);
  controleMov.addEventListener("touchend", soltarControle);
});
controlesAcao.forEach((controleMov) => {
  controleMov.addEventListener("mouseleave", soltarControle);
  controleMov.addEventListener("touchend", soltarControle);
});

function pressionarControle(event) {
  // verificar qual tecla está sendo pressionada
  let teclaPressionada;
  if (event.type == "keydown") {
    // acessar a tecla pressionada
    teclaPressionada = event.key.toLowerCase();
  } else if (event.type == "mousedown" || event.type == "touchstart") {
    teclaPressionada = event.target.classList[0].replace("controle-", "");
  }

  const existeTecla = Object.keys(controle).includes(teclaPressionada);
  if (!existeTecla) return;

  const existeTeclaMov = Object.keys(controle)
    .slice(0, 4)
    .includes(teclaPressionada);

  const existeTeclaAcao = Object.keys(controle)
    .slice(4, 6)
    .includes(teclaPressionada);

  if (existeTeclaMov || existeTeclaAcao) {
    // não permitir que o jogador aperte mais de duas teclas de movimento
    controle[teclaPressionada].estaPressionado = true;
  }

  mudarEstiloControle();

  if (temInicio) {
    if (controle.enter.estaPressionado) {
      inicio.classList.add("escondido")
      temInicio = false;
    }
    return;
  }

  // ativar animacao se tiver movimento
  if (!animacaoAtiva && existeTeclaMov) {
    animacaoAtiva = true;
    movimentarMapa();
  }

  mostrarDescricaoLugar();
  rotacionarJogador();
}

function soltarControle(event) {
  // verificar qual tecla está sendo solta
  if (event.type == "keyup") {
    const teclaSolta = event.key.toLowerCase();

    const existeTecla = Object.keys(controle).includes(teclaSolta);
    if (!existeTecla) return;

    controle[teclaSolta].estaPressionado = false;
  } else if (event.type == "mouseleave" || event.type == "touchend") {
    const teclaSolta = event.target.classList[0].replace("controle-", "");
    controle[teclaSolta].estaPressionado = false;
  }

  // desativar animacao se nao tiver movimento
  const semMovimento = Object.values(controle).every(
    (tecla) => !tecla.estaPressionado
  );

  if (semMovimento) {
    animacaoAtiva = false;
    cancelAnimationFrame(idMapaAnimacao);
  }

  rotacionarJogador();
  mudarEstiloControle();
}

function rotacionarJogador() {
  if (controle["w"].estaPressionado && controle["d"].estaPressionado) {
    jogador.style.transform = "rotate(45deg)";
  } else if (controle["d"].estaPressionado && controle["s"].estaPressionado) {
    jogador.style.transform = "rotate(135deg)";
  } else if (controle["s"].estaPressionado && controle["a"].estaPressionado) {
    jogador.style.transform = "rotate(225deg)";
  } else if (controle["a"].estaPressionado && controle["w"].estaPressionado) {
    jogador.style.transform = "rotate(315deg)";
  } else if (controle["w"].estaPressionado) {
    jogador.style.transform = "rotate(0)";
  } else if (controle["a"].estaPressionado) {
    jogador.style.transform = "rotate(270deg)";
  } else if (controle["s"].estaPressionado) {
    jogador.style.transform = "rotate(180deg)";
  } else if (controle["d"].estaPressionado) {
    jogador.style.transform = "rotate(90deg)";
  }
}

function mudarEstiloControle() {
  const keys = Object.keys(controle);
  const values = Object.values(controle);

  for (let i = 0; i < values.length; i++) {
    const tecla = values[i];
    const controle = document.querySelector(`.controle-${keys[i]}`);

    if (tecla.estaPressionado == true) {
      controle.classList.add("controle-pressionado");
    } else {
      controle.classList.remove("controle-pressionado");
    }
  }
}

function movimentarMapa() {
  const velocidade = 2.5;

  if (controle.a.estaPressionado) mapaPos.x += velocidade;
  if (controle.d.estaPressionado) mapaPos.x -= velocidade;
  if (mapaPos.x > minX) mapaPos.x = minX;
  if (mapaPos.x < maxX) mapaPos.x = maxX;

  if (controle.w.estaPressionado) mapaPos.y += velocidade;
  if (controle.s.estaPressionado) mapaPos.y -= velocidade;
  if (mapaPos.y > minY) mapaPos.y = minY;
  if (mapaPos.y < maxY) mapaPos.y = maxY;

  mapa.style.transform = `translate(${mapaPos.x}px, ${mapaPos.y}px)`;

  idMapaAnimacao = requestAnimationFrame(movimentarMapa);
}

// determinar tamanho quando site carregar ou ser redimensionado
function atualizarDimensoes() {
  const [widthJogo, heightJogo] = [jogo.clientWidth, jogo.clientHeight];
  const [widthMapa, heightMapa] = [mapa.clientWidth, mapa.clientHeight];
  const heightJogador = jogador.clientHeight;

  // console.log("jogo", "width", widthJogo, "height", heightJogo);
  // console.log("mapa", "width", widthMapa, "height", heightMapa);
  // console.log("jogador", "height", heightJogador);

  minX = (widthJogo - heightJogador) / 2;
  maxX = widthJogo / 2 + heightJogador - widthMapa;
  minY = (heightJogo - heightJogador) / 2;
  maxY = heightJogo / 2 + heightJogador - heightMapa;

  // console.log("top left", "x", minX, "y", minY);
  // console.log("top right", "x", maxX, "y", minY);
  // console.log("bottom left", "x", minX, "y", maxY);
  // console.log("bottom right", "x", maxX, "y", maxY);
}

window.addEventListener("load", atualizarDimensoes);
window.addEventListener("resize", atualizarDimensoes);

let matrizLugar;

function criarMatrizLugar() {
  const LINHA = 10;
  const COLUNA = 10;
  matrizLugar = Array(LINHA)
    .fill(null)
    .map(() => Array(COLUNA).fill({ temLugar: false, lugarId: null }));

  for (let i = 0; i < LUGARES.length; i++) {
    const lugar = LUGARES[i];

    matrizLugar[lugar.linha - 1][lugar.coluna - 1] = {
      temLugar: true,
      lugarId: i,
    };
    matrizLugar[lugar.linha][lugar.coluna - 1] = { temLugar: true, lugarId: i };
    matrizLugar[lugar.linha - 1][lugar.coluna] = { temLugar: true, lugarId: i };
    matrizLugar[lugar.linha][lugar.coluna] = { temLugar: true, lugarId: i };
  }
}

criarMatrizLugar();

function renderizarLugares() {
  LUGARES.forEach((lugar) => {
    lugares.innerHTML += `
      <img 
        class="jogo-lugar" 
        src="${lugar.imgSrc}" 
        alt="${lugar.nome}"
        style="grid-row: ${lugar.linha} / span 2; grid-column: ${lugar.coluna} / span 2"
      />
    `;
  });
}

renderizarLugares();

const mapaGridPos = { linha: 1, coluna: 1 };
let temDescricao = false;

function mostrarDescricaoLugar() {
  mapaGridPos.linha = Math.ceil(
    Math.abs((mapaPos.y - minY) / (maxY - minY) / 10) * 100
  );
  mapaGridPos.coluna = Math.ceil(
    Math.abs((mapaPos.x - minX) / (maxX - minX) / 10) * 100
  );

  if (mapaGridPos.linha == 0) mapaGridPos.linha = 1;
  if (mapaGridPos.coluna == 0) mapaGridPos.coluna = 1;

  // console.log("mapaPos", mapaPos)
  // console.log("mapaGridPos", mapaGridPos);

  const { temLugar, lugarId } =
    matrizLugar[mapaGridPos.linha - 1][mapaGridPos.coluna - 1];
  if (!temDescricao && temLugar) {
    descricao.innerHTML = `
      <p>
        <u>${LUGARES[lugarId].nome}</u> </br>
        ${LUGARES[lugarId].descricao}
      </p>
    `;
    descricao.classList.remove("escondido");
    temDescricao = true;

    if (controle.enter == true) verificarOrdem();
  }

  if (temLugar) {
    verificarOrdem(lugarId);
  }

  if (temDescricao && !temLugar) {
    descricao.innerHTML = "";
    ordem.innerHTML = "";
    descricao.classList.add("escondido");
    ordem.classList.add("escondido");
    temDescricao = false;
    temOrdem = false;
  }
}

let ordemJogo = 0;
let temOrdem = false;

function verificarOrdem(lugarId) {
  if (lugarId == ordemJogo) {
    ordem.innerHTML = `
      <p>Dica do próximo lugar:<br/>${LUGARES[lugarId].dica}</p>
    `;
    ordem.classList.remove("escondido");
    return;
  }

  if (!temOrdem && !controle.enter.estaPressionado) return;

  if (!temOrdem && controle.enter.estaPressionado) {
    ordem.innerHTML = `
      <p>Selecionar<br/>${LUGARES[lugarId].nome}?</p>
      <div><div class="opcao-enter">A</div>Sim</div>
      <div><div class="opcao-shift">B</div>Não</div>
    `;
    ordem.classList.remove("escondido");
    temOrdem = true;
    return;
  }

  if (controle.shift.estaPressionado) {
    ordem.innerHTML = ``;
    ordem.classList.add("escondido");
    temOrdem = false;
    return;
  }

  if (controle.enter.estaPressionado) {
    if (ordemJogo + 1 == lugarId) {
      ordem.innerHTML = `
      <p>Próxima dica:<br/>${LUGARES[lugarId].dica}</p>
      `;
      ordem.classList.remove("escondido");

      ordemJogo += 1;
    } else {
      ordem.innerHTML = `
        <p>Não é o lugar certo...</p>
      `;
    }
  }
}
