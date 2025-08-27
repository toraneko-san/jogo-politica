const controlesMovimento = document.querySelectorAll(
  ".controle-movimento > div"
);
const controlesAcao = document.querySelectorAll(".controle-acao > div");

const jogo = document.querySelector(".jogo");
const mapa = document.querySelector(".jogo-mapa");
const jogador = document.querySelector(".jogo-jogador");

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

document.addEventListener("keypress", pressionarControle);
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
  if (event.type == "keypress") {
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

  // ativar animacao se tiver movimento
  if (!animacaoAtiva && existeTeclaMov) {
    animacaoAtiva = true;
    movimentarMapa();
  }

  rotacionarJogador();
  mudarEstiloControle();
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

function movimentarMapa(tempoAgora) {
  const velocidade = 3;

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

  minX = (widthJogo - heightJogador) / 2;
  maxX = widthJogo / 2 + heightJogador - widthMapa;
  minY = (heightJogo - heightJogador) / 2;
  maxY = heightJogo / 2 + heightJogador - heightMapa;
}

window.addEventListener("load", atualizarDimensoes);
window.addEventListener("resize", atualizarDimensoes);
