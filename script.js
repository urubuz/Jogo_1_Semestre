//mudar de telas
function irjogo() {
  window.location.href = "jogo.html"
}
function irdevs() {
  window.location.href = "quemsomos.html"
}
function irinicio() {
  window.location.href = "index.html"
}

let sangramentoativo = false;
let turnossangramento = 0;
let dodgeativo = false;
let turnosdodge = 0;
let queimaduraativa = false;
let turnosqueimadura = 0;
let escudoativo = false;
let aparoativo = false;
let turnosaparo = 0;
let atordoadoativo = false;
let turnosatordoado = 0;

document.getElementById("telacombate").style.display = "none"
document.getElementById("skill").style.display = "none"
document.getElementById("skill3").style.display = "none";

let jogador;
let turno = "jogador";

//criação de inimigo
let inimigo = {
  nome: "Goblin",
  vida: 100,
  vidaMax: 100,
  ataque: 10,
  img: "imagens/goblin.png"
};
let boss = {
  nome: "Chefe goblin",
  vida: 120,
  vidaMax: 140,
  ataque: 16,
  img: "imagens/boss.png"
};

let fase = 1;

//escolher personagem
function escolher(tipo) {

  if (tipo === "guerreiro") {
    jogador = {
      nome: "Guerreiro",
      vida: 120,
      vidaMax: 120,
      ataque: 12,
      img: "imagens/guerreiro.png",
      habilidades: [
      {
        nome: "Golpe Dilacerante",
        usada: false
      },

      {
        nome: "Dança ágil",
        usada: false
      }
    ],

    skillBonus: {
      nome: "Posição de aparo",
      usada: false
    }

    };
    document.getElementById("skill1").textContent = jogador.habilidades[0].nome;
    document.getElementById("skill2").textContent = jogador.habilidades[1].nome;

  } else if (tipo === "mago") {
    jogador = {
      nome: "Mago",
      vida: 80,
      vidaMax: 80,
      ataque: 18,
      img: "imagens/mago.png",
      habilidades: [
      {
        nome: "Bola de Fogo",
        usada: false
      },

      {
        nome: "Escudo Mágico",
        usada: false
      }
    ],
    
    skillBonus: {
      nome: "Raio Eletrizante",
      usada: false
    }

    };
    document.getElementById("skill1").textContent = jogador.habilidades[0].nome;
    document.getElementById("skill2").textContent = jogador.habilidades[1].nome;
  }

  document.getElementById("imgjogador").src = jogador.img;
  document.getElementById("imginimigo").src = inimigo.img;

  atualizarVida();

document.getElementById("vidanumerojogador").textContent = jogador.vida
document.getElementById("vidanumeroinimigo").textContent = inimigo.vida

  document.getElementById("telaescolha").style.display = "none";
  document.getElementById("telacombate").style.display = "block";

}

//transforma a % da vida em % do width
function atualizarVida() {

  let pJogador = (jogador.vida / jogador.vidaMax) * 100;
  document.getElementById("barravidajogador").style.width = pJogador + "%";

  let pInimigo = (inimigo.vida / inimigo.vidaMax) * 100;
  document.getElementById("barravidainimigo").style.width = pInimigo + "%";
}

//jogador ataca
function atacar() {

  if (turno !== "jogador") return;
  
  mostrarmsg("Você atacou");

  inimigo.vida -= jogador.ataque;
  if (inimigo.vida < 0) inimigo.vida = 0;

  //efeito de tremer
  document.getElementById("imginimigo").classList.add("dano");

setTimeout(() => {
  document.getElementById("imginimigo").classList.remove("dano");
}, 300);

  atualizarVida();
  document.getElementById("vidanumerojogador").textContent = jogador.vida
  document.getElementById("vidanumeroinimigo").textContent = inimigo.vida

  if (checarFim()) return;

  turno = "inimigo";

  setTimeout(turnoInimigo, 3000);
}

//jogador se cura
function curar() {

  if (turno !== "jogador") return;

  mostrarmsg("Você se curou");

  jogador.vida += 10;

  if (jogador.vida > jogador.vidaMax) {
    jogador.vida = jogador.vidaMax;
  }

  //efeito de curar
  document.getElementById("imgjogador").classList.add("cura");

setTimeout(() => {
  document.getElementById("imgjogador").classList.remove("cura");
}, 500);

  atualizarVida();
  document.getElementById("vidanumerojogador").textContent = jogador.vida
  document.getElementById("vidanumeroinimigo").textContent = inimigo.vida

  if (checarFim()) return;

  turno = "inimigo";

  setTimeout(turnoInimigo, 3000);
}

function turnoInimigo() {

    // atordoamento
  if (atordoadoativo) {

    mostrarmsg("O inimigo está atordoado!");

    turnosatordoado--;

    document.getElementById("duracaoatordoadoinimigo").textContent = turnosatordoado;

    if (turnosatordoado <= 0) {

      atordoadoativo = false;

      document.getElementById("atordoadoinimigo").style.display =
      "none";

      document.getElementById("duracaoatordoadoinimigo").textContent =
"";
    }

    turno = "jogador";

    return;
  }

  // sangramento
  if (sangramentoativo) {

    inimigo.vida -= 8;

    turnossangramento--;

    mostrarmsg("Sangramento causou dano!");

    if (inimigo.vida < 0) inimigo.vida = 0;

    document.getElementById("duracaosangue").textContent = turnossangramento;

    atualizarVida();

    document.getElementById("vidanumeroinimigo").textContent = inimigo.vida;

    if (turnossangramento <= 0) {

      sangramentoativo = false;

      document.getElementById("sangue").style.display = "none";

      document.getElementById("duracaosangue").textContent = "";
    }

    if (checarFim()) return;
  }

  // queimadura
  if (queimaduraativa) {

    inimigo.vida -= 8;

    turnosqueimadura--;

    mostrarmsg("Queimadura causou dano!");

    if (inimigo.vida < 0) inimigo.vida = 0;

    document.getElementById("duracaofogo").textContent = turnosqueimadura;

    atualizarVida();

    document.getElementById("vidanumeroinimigo").textContent = inimigo.vida;

    if (turnosqueimadura <= 0) {

      queimaduraativa = false;

      document.getElementById("fogo").style.display = "none";

      document.getElementById("duracaofogo").textContent = "";
    }

    if (checarFim()) return;
  }

  // ação do inimigo
  let escolha = Math.random();

  if (escolha < 0.7) {

    let esquivou = false;

    // chance de dodge caso use skill
    if (dodgeativo) {

      let chance = Math.random();

      if (chance < 0.3) {
        esquivou = true;
      }
    }

    if (esquivou) {

      mostrarmsg("Você esquivou!");

      document.getElementById("imgjogador").classList.add("esquiva");

      setTimeout(() => {
        document.getElementById("imgjogador").classList.remove("esquiva");
      }, 400);

    } else {

      // escudo mágico
      if (escudoativo) {

        mostrarmsg("O escudo bloqueou o ataque!");

        escudoativo = false;

        document.getElementById("escudomagico").style.display = "none";

      } else {

        // toma dano
        jogador.vida -= inimigo.ataque;

        // aparo
        if (aparoativo) {

          let refletido = Math.floor(inimigo.ataque / 2);

          inimigo.vida -= refletido;

          mostrarmsg("Você refletiu dano!");

          document.getElementById("imginimigo").classList.add("dano");

          setTimeout(() => {
            document.getElementById("imginimigo").classList.remove("dano");
          }, 300);

          if (inimigo.vida < 0) inimigo.vida = 0;

        } else {

          mostrarmsg("Inimigo atacou");
        }

        document.getElementById("imgjogador").classList.add("dano");

        setTimeout(() => {
          document.getElementById("imgjogador").classList.remove("dano");
        }, 300);
      }
    }

  } else {

    // cura inimigo
    inimigo.vida += 10;

    mostrarmsg("Inimigo se curou");

    document.getElementById("imginimigo").classList.add("cura");

    setTimeout(() => {
      document.getElementById("imginimigo").classList.remove("cura");
    }, 500);

    if (inimigo.vida > inimigo.vidaMax) {
      inimigo.vida = inimigo.vidaMax;
    }
  }

  if (jogador.vida < 0) jogador.vida = 0;

  atualizarVida();

  document.getElementById("vidanumerojogador").textContent = jogador.vida;

  document.getElementById("vidanumeroinimigo").textContent = inimigo.vida;

  // duração do dodge
  if (dodgeativo) {

    turnosdodge--;

    document.getElementById("duracaododge").textContent = turnosdodge;

    if (turnosdodge <= 0) {

      dodgeativo = false;

      document.getElementById("dodge").style.display = "none";

      document.getElementById("duracaododge").textContent = "";
    }
  }

  // duração do aparo
  if (aparoativo) {

    turnosaparo--;

    document.getElementById("duracaoaparo").textContent = turnosaparo;

    if (turnosaparo <= 0) {

      aparoativo = false;

      document.getElementById("aparo").style.display = "none";

      document.getElementById("duracaoaparo").textContent = "";
    }
  }

  if (checarFim()) return;

  turno = "jogador";
}

function checarFim() {

  // jogador perdeu
  if (jogador.vida <= 0) {

    mostrarFim("VOCÊ PERDEU SEU BETINHA", "red");

    return true;
  }

  // inimigo morreu
  if (inimigo.vida <= 0) {

    // primeira fase
    if (fase === 1) {

      fase = 2;

      document.getElementById("telacombate").style.display = "none";

      document.getElementById("telarecompensa").style.display = "flex";

      return true;
    }

    // vitória final
    mostrarFim("VOCÊ VENCEU EBAAAA", "green");

    return true;
  }

  return false;
}

function mostrarFim(texto, cor) {
  let tela = document.getElementById("resultado");

  tela.style.display = "flex";
  tela.style.color = cor;
  tela.textContent = texto;
}

function mostrarmsg(texto) {

  let msg = document.getElementById("turnoacao");

  msg.textContent = texto;

  msg.classList.remove("animarturnoacao");

  void msg.offsetWidth;

  msg.classList.add("animarturnoacao");

  setTimeout(() => {
    msg.textContent = "";
  }, 1400);
}

function escolherRecompensa(tipo) {

  if (tipo === "cura") {

    jogador.vida += 40;

    if (jogador.vida > jogador.vidaMax) {
      jogador.vida = jogador.vidaMax;
    }

  } else if (tipo === "dano") {

    jogador.ataque += 5;
  } else if (tipo === "skill") {

  jogador.habilidades.push(jogador.skillBonus);
  document.getElementById("skill3").textContent = jogador.skillBonus.nome;
  document.getElementById("skill3").style.display = "block";
}

  jogador.habilidades.forEach(skill => {
  skill.usada = false;
  });

  jogador.skillBonus.usada = false;

  // voltar cor normal
  document.getElementById("skill1").classList.remove("skillusada");

  document.getElementById("skill2").classList.remove("skillusada");

  document.getElementById("skill3").classList.remove("skillusada");

  inimigo = boss;

  document.getElementById("imginimigo").src = inimigo.img;
  
  atualizarVida();
  document.getElementById("vidanumeroinimigo").textContent = inimigo.vida

  document.getElementById("telarecompensa").style.display = "none";
  document.getElementById("telacombate").style.display = "block";
}

function toggleSkills() {

  let div = document.getElementById("skill");

  if (div.style.display === "block") {
    div.style.display = "none";
  } else {
    div.style.display = "block";
  }
}

function golpedilacerante() {

  if (turno !== "jogador") return;

  mostrarmsg("Você usou Golpe Dilacerante");

  inimigo.vida -= 25;

  if (inimigo.vida < 0) inimigo.vida = 0;

  sangramentoativo = true;
  turnossangramento = 3;

  document.getElementById("sangue").style.display = "block";

  document.getElementById("duracaosangue").textContent = turnossangramento;

  atualizarVida();

  document.getElementById("vidanumerojogador").textContent = jogador.vida;

  document.getElementById("vidanumeroinimigo").textContent = inimigo.vida;

  if (checarFim()) return;

  turno = "inimigo";

  setTimeout(turnoInimigo, 3000);
}

function dancaagil() {

  if (turno !== "jogador") return;

  mostrarmsg("Você usou Dança Ágil");

  dodgeativo = true;
  turnosdodge = 3;

  // mostra efeito
  document.getElementById("dodge").style.display = "block";

  document.getElementById("duracaododge").textContent = turnosdodge;

  atualizarVida();

  turno = "inimigo";

  setTimeout(turnoInimigo, 3000);
}

function posicaodeaparo() {

  if (turno !== "jogador") return;

  mostrarmsg("Você usou Posição de Aparo");

  aparoativo = true;
  turnosaparo = 3;

  // mostra efeito
  document.getElementById("aparo").style.display = "block";

  document.getElementById("duracaoaparo").textContent = turnosaparo;

  turno = "inimigo";

  setTimeout(turnoInimigo, 3000);
}

function boladefogo() {

  if (turno !== "jogador") return;

  mostrarmsg("Você usou Bola de Fogo");

  // dano inicial
  inimigo.vida -= 25;

  if (inimigo.vida < 0) {
    inimigo.vida = 0;
  }

  queimaduraativa = true;
  turnosqueimadura = 3;

  // mostra efeito
  document.getElementById("fogo").style.display = "block";

  document.getElementById("duracaofogo").textContent = turnosqueimadura;

  document.getElementById("imginimigo").classList.add("dano");

  setTimeout(() => {
    document.getElementById("imginimigo").classList.remove("dano");
  }, 300);

  atualizarVida();

  document.getElementById("vidanumerojogador").textContent = jogador.vida;

  document.getElementById("vidanumeroinimigo").textContent = inimigo.vida;

  if (checarFim()) return;

  turno = "inimigo";

  setTimeout(turnoInimigo, 3000);
}

function escudomagico() {

  if (turno !== "jogador") return;

  mostrarmsg("Você usou Escudo Mágico");

  escudoativo = true;

  document.getElementById("escudomagico").style.display = "block";

  document.getElementById("imgjogador").classList.add("cura");

  setTimeout(() => {
    document.getElementById("imgjogador").classList.remove("cura");
  }, 500);

  turno = "inimigo";

  setTimeout(turnoInimigo, 3000);
}

function raioeletrizante() {

  if (turno !== "jogador") return;

  mostrarmsg("Você usou Raio Eletrizante");

  inimigo.vida -= 30;

  if (inimigo.vida < 0) {
    inimigo.vida = 0;
  }

  atordoadoativo = true;
  turnosatordoado = 1;

  document.getElementById("atordoadoinimigo").style.display = "block";

  document.getElementById("duracaoatordoadoinimigo").textContent = turnosatordoado;

  document.getElementById("imginimigo").classList.add("dano");

  setTimeout(() => {
    document.getElementById("imginimigo").classList.remove("dano");
  }, 300);

  atualizarVida();

  document.getElementById("vidanumeroinimigo").textContent = inimigo.vida;

  if (checarFim()) return;

  turno = "inimigo";

  setTimeout(turnoInimigo, 3000);
}

function usarskill1() {

  if (jogador.habilidades[0].usada) return;

  jogador.habilidades[0].usada = true;

  document.getElementById("skill1").classList.add("skillusada");

  if (jogador.nome === "Guerreiro") {

    golpedilacerante();

  } else if (jogador.nome === "Mago") {

    boladefogo();
  }
}

function usarskill2() {

  if (jogador.habilidades[1].usada) return;

  jogador.habilidades[1].usada = true;

  document.getElementById("skill2").classList.add("skillusada");

  if (jogador.nome === "Guerreiro") {

    dancaagil();

  } else if (jogador.nome === "Mago") {

    escudomagico();
  }
}
function usarskill3() {

  if (jogador.skillBonus.usada) return;

  jogador.skillBonus.usada = true;

  document.getElementById("skill3").classList.add("skillusada");

  if (jogador.nome === "Guerreiro") {

    posicaodeaparo();

  } else if (jogador.nome === "Mago") {

    raioeletrizante();
  }
}

function mostrardescricao(skill) {

  let descricao = document.getElementById("informacao");

  // GUERREIRO
  if (jogador.nome === "Guerreiro") {

    if (skill === "skill1") {

      descricao.textContent =
      "Causa dano elevado e aplica sangramento no inimigo durante 3 turnos";

    } else if (skill === "skill2") {

      descricao.textContent =
      "Ganha chance de se esquivar de golpes durante 3 turnos";

    } else if (skill === "skill3") {

      descricao.textContent =
      "Reflete metade do dano recebido durante 2 turnos";
    }
  }

  // MAGO
  else if (jogador.nome === "Mago") {

    if (skill === "skill1") {

      descricao.textContent =
      "Causa dano elevado e aplica queimadura no inimigo durante 3 turnos";

    } else if (skill === "skill2") {

      descricao.textContent =
      "Ignora o próximo dano que você receber";

    } else if (skill === "skill3") {

      descricao.textContent =
      "Causa dano elevado e aplica atordoamento no inimigo";
    }
  }
}

function limpardescricao() {

  document.getElementById("informacao").textContent = "";
}
