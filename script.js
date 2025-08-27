const jogador = document.querySelector(".jogo-jogador");
const controlesMovimento = document.querySelectorAll(
  ".controle-movimento > div"
);
const controlesAcao = document.querySelectorAll(".controle-acao > div");

const controle = {
  w: { estaPressionado: false },
  a: { estaPressionado: false },
  s: { estaPressionado: false },
  d: { estaPressionado: false },
  enter: { estaPressionado: false },
  shift: { estaPressionado: false },
};

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

  rotacionarJogador();
  mudarEstiloControle();
}

function soltarControle(event) {
  if (event.type == "keyup") {
    const teclaSolta = event.key.toLowerCase();

    const existeTecla = Object.keys(controle).includes(teclaSolta);
    if (!existeTecla) return;

    controle[teclaSolta].estaPressionado = false;
  } else if (event.type == "mouseleave" || event.type == "touchend") {
    const teclaSolta = event.target.classList[0].replace("controle-", "");
    controle[teclaSolta].estaPressionado = false;
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
