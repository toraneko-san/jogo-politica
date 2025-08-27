const jogador = document.querySelector(".jogo-jogador");
const controlesMovimento = document.querySelectorAll(
  ".controle-movimento > div"
);

const controle = {
  w: { estaPressionado: false },
  a: { estaPressionado: false },
  s: { estaPressionado: false },
  d: { estaPressionado: false },
  Enter: { estaPressionado: false },
  Shift: { estaPressionado: false },
};

document.addEventListener("keydown", pressionarControle);
controlesMovimento.forEach((controleMov) => {
  controleMov.addEventListener("mouseenter", pressionarControle);
  controleMov.addEventListener("touchstart", pressionarControle);
});

document.addEventListener("keyup", soltarControle);
controlesMovimento.forEach((controleMov) => {
  controleMov.addEventListener("mouseleave", soltarControle);
  controleMov.addEventListener("touchend", soltarControle);
});

function pressionarControle(event) {
  // não permitir que o jogador aperte mais de duas teclas de movimento
  const qtdTeclasMovPress = Object.values(controle)
    .slice(0, 4)
    .filter((tecla) => tecla.estaPressionado == true).length;
  if (qtdTeclasMovPress > 2) return;

  if (event.type == "keydown") {
    // acessar a tecla pressionada
    const teclaPressionada = event.key.toLowerCase();

    // se jogador pressionar uma tecla que não funciona no jogo, não fazer nada
    const existeTecla = Object.keys(controle).includes(teclaPressionada);
    if (!existeTecla) return;

    controle[teclaPressionada].estaPressionado = true;
  } else if (event.type == "mouseenter" || event.type == "touchstart") {
    const teclaPressionada = event.target.classList[0].replace("controle-", "");
    controle[teclaPressionada].estaPressionado = true;
  }

  rotacionarJogador();
  mudarEstiloControle();
}

function soltarControle(event) {
  if (event.type == "keyup") {
    const teclaSolta =  event.key.toLowerCase();

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
