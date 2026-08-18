/**
 * RPG Turnos - Script Principal
 * Sistema de batalha por turnos com habilidades e efeitos especiais
 */

// ============================================
// Game State
// ============================================
const GameState = {
    telaAtual: 'inicio',
    turno: 'jogador',
    fase: 1,
    jogador: null,
    inimigo: null,
    efeitos: {
        jogador: {
            escudo: { ativo: false, turnos: 0 },
            aparo: { ativo: false, turnos: 0 },
            dodge: { ativo: false, turnos: 0 }
        },
        inimigo: {
            sangramento: { ativo: false, turnos: 0 },
            queimadura: { ativo: false, turnos: 0 },
            atordoado: { ativo: false, turnos: 0 }
        }
    }
};

// ============================================
// Character Definitions
// ============================================
const Characters = {
    guerreiro: {
        nome: "Guerreiro",
        vida: 120,
        vidaMax: 120,
        ataque: 12,
        img: "imagens/guerreiro.png",
        habilidades: [
            { nome: "Golpe Dilacerante", usada: false, descricao: "Causa dano elevado e aplica sangramento no inimigo durante 3 turnos" },
            { nome: "Dança Ágil", usada: false, descricao: "Ganha chance de se esquivar de golpes durante 3 turnos" }
        ],
        skillBonus: { nome: "Posição de Aparo", usada: false, descricao: "Reflete metade do dano recebido durante 3 turnos" }
    },
    mago: {
        nome: "Mago",
        vida: 80,
        vidaMax: 80,
        ataque: 18,
        img: "imagens/mago.png",
        habilidades: [
            { nome: "Bola de Fogo", usada: false, descricao: "Causa dano elevado e aplica queimadura no inimigo durante 3 turnos" },
            { nome: "Escudo Mágico", usada: false, descricao: "Ignora o próximo dano que você receber" }
        ],
        skillBonus: { nome: "Raio Eletrizante", usada: false, descricao: "Causa dano elevado e aplica atordoamento no inimigo" }
    }
};

const Enemies = {
    goblin: {
        nome: "Goblin",
        vida: 100,
        vidaMax: 100,
        ataque: 10,
        img: "imagens/goblin.png"
    },
    boss: {
        nome: "Chefe Goblin",
        vida: 140,
        vidaMax: 140,
        ataque: 16,
        img: "imagens/boss.png"
    }
};

// ============================================
// Audio System (Web Audio API)
// ============================================
const AudioManager = {
    context: null,
    
    init() {
        try {
            this.context = new (window.AudioContext || window.webkitAudioContext)();
        } catch (e) {
            console.log('Audio não suportado');
        }
    },
    
    play(tipo) {
        if (!this.context) return;
        
        const oscilador = this.context.createOscillator();
        const ganho = this.context.createGain();
        
        oscilador.connect(ganho);
        ganho.connect(this.context.destination);
        
        switch(tipo) {
            case 'ataque':
                oscilador.frequency.setValueAtTime(150, this.context.currentTime);
                oscilador.frequency.exponentialRampToValueAtTime(50, this.context.currentTime + 0.1);
                ganho.gain.setValueAtTime(0.3, this.context.currentTime);
                ganho.gain.exponentialRampToValueAtTime(0.01, this.context.currentTime + 0.1);
                oscilador.start();
                oscilador.stop(this.context.currentTime + 0.1);
                break;
            case 'cura':
                oscilador.frequency.setValueAtTime(400, this.context.currentTime);
                oscilador.frequency.exponentialRampToValueAtTime(800, this.context.currentTime + 0.2);
                ganho.gain.setValueAtTime(0.2, this.context.currentTime);
                ganho.gain.exponentialRampToValueAtTime(0.01, this.context.currentTime + 0.2);
                oscilador.start();
                oscilador.stop(this.context.currentTime + 0.2);
                break;
            case 'habilidade':
                oscilador.frequency.setValueAtTime(300, this.context.currentTime);
                oscilador.frequency.exponentialRampToValueAtTime(600, this.context.currentTime + 0.15);
                ganho.gain.setValueAtTime(0.25, this.context.currentTime);
                ganho.gain.exponentialRampToValueAtTime(0.01, this.context.currentTime + 0.15);
                oscilador.start();
                oscilador.stop(this.context.currentTime + 0.15);
                break;
            case 'dano':
                oscilador.frequency.setValueAtTime(100, this.context.currentTime);
                oscilador.frequency.exponentialRampToValueAtTime(30, this.context.currentTime + 0.15);
                ganho.gain.setValueAtTime(0.4, this.context.currentTime);
                ganho.gain.exponentialRampToValueAtTime(0.01, this.context.currentTime + 0.15);
                oscilador.start();
                oscilador.stop(this.context.currentTime + 0.15);
                break;
            case 'vitoria':
                oscilador.frequency.setValueAtTime(523, this.context.currentTime);
                oscilador.frequency.setValueAtTime(659, this.context.currentTime + 0.1);
                oscilador.frequency.setValueAtTime(784, this.context.currentTime + 0.2);
                ganho.gain.setValueAtTime(0.3, this.context.currentTime);
                ganho.gain.exponentialRampToValueAtTime(0.01, this.context.currentTime + 0.4);
                oscilador.start();
                oscilador.stop(this.context.currentTime + 0.4);
                break;
            case 'derrota':
                oscilador.frequency.setValueAtTime(400, this.context.currentTime);
                oscilador.frequency.exponentialRampToValueAtTime(100, this.context.currentTime + 0.5);
                ganho.gain.setValueAtTime(0.3, this.context.currentTime);
                ganho.gain.exponentialRampToValueAtTime(0.01, this.context.currentTime + 0.5);
                oscilador.start();
                oscilador.stop(this.context.currentTime + 0.5);
                break;
        }
    }
};

// ============================================
// Save/Load System
// ============================================
const SaveSystem = {
    save() {
        const dados = {
            jogador: GameState.jogador,
            inimigo: GameState.inimigo,
            fase: GameState.fase,
            efeitos: GameState.efeitos,
            turno: GameState.turno
        };
        localStorage.setItem('rpgSave', JSON.stringify(dados));
    },
    
    load() {
        const dados = localStorage.getItem('rpgSave');
        if (dados) {
            return JSON.parse(dados);
        }
        return null;
    },
    
    clear() {
        localStorage.removeItem('rpgSave');
    },
    
    hasSave() {
        return localStorage.getItem('rpgSave') !== null;
    }
};

// ============================================
// UI Helper Functions
// ============================================
function mostrarTela(tela) {
    document.getElementById('telaescolha').style.display = 'none';
    document.getElementById('telacombate').style.display = 'none';
    document.getElementById('telarecompensa').style.display = 'none';
    document.getElementById('resultado').style.display = 'none';
    
    switch(tela) {
        case 'escolha':
            document.getElementById('telaescolha').style.display = 'flex';
            break;
        case 'combate':
            document.getElementById('telacombate').style.display = 'block';
            break;
        case 'recompensa':
            document.getElementById('telarecompensa').style.display = 'flex';
            break;
    }
    
    GameState.telaAtual = tela;
}

function mostrarmsg(texto) {
    const msg = document.getElementById('turnoacao');
    msg.textContent = texto;
    msg.classList.remove('animarturnoacao');
    void msg.offsetWidth;
    msg.classList.add('animarturnoacao');
    
    setTimeout(() => {
        msg.textContent = '';
    }, 1400);
}

function mostrarFim(texto, cor) {
    const tela = document.getElementById('resultado');
    tela.style.display = 'flex';
    tela.style.color = cor;
    tela.textContent = texto;
}

function atualizarVida() {
    const pJogador = (GameState.jogador.vida / GameState.jogador.vidaMax) * 100;
    document.getElementById('barravidajogador').style.width = pJogador + '%';
    
    const pInimigo = (GameState.inimigo.vida / GameState.inimigo.vidaMax) * 100;
    document.getElementById('barravidainimigo').style.width = pInimigo + '%';
    
    document.getElementById('vidanumerojogador').textContent = Math.max(0, GameState.jogador.vida);
    document.getElementById('vidanumeroinimigo').textContent = Math.max(0, GameState.inimigo.vida);
}

function animarElemento(elementoId, classeAnimacao, duracao = 300) {
    const elemento = document.getElementById(elementoId);
    elemento.classList.add(classeAnimacao);
    setTimeout(() => {
        elemento.classList.remove(classeAnimacao);
    }, duracao);
}

// ============================================
// Navigation Functions
// ============================================
function irjogo() {
    AudioManager.init();
    if (SaveSystem.hasSave()) {
        if (confirm('Você tem um jogo salvo. Deseja continuar?')) {
            carregarJogo();
        } else {
            SaveSystem.clear();
            mostrarTela('escolha');
        }
    } else {
        mostrarTela('escolha');
    }
}

function irdevs() {
    window.location.href = 'quemsomos.html';
}

function irinicio() {
    window.location.href = 'index.html';
}

// ============================================
// Character Selection
// ============================================
function escolher(tipo) {
    AudioManager.init();
    
    // Clone character to avoid mutation
    GameState.jogador = JSON.parse(JSON.stringify(Characters[tipo]));
    GameState.inimigo = JSON.parse(JSON.stringify(Enemies.goblin));
    GameState.fase = 1;
    GameState.turno = 'jogador';
    
    // Reset effects
    resetarEfeitos();
    
    // Update UI
    document.getElementById('imgjogador').src = GameState.jogador.img;
    document.getElementById('imginimigo').src = GameState.inimigo.img;
    
    // Set skill names
    document.getElementById('skill1').textContent = GameState.jogador.habilidades[0].nome;
    document.getElementById('skill2').textContent = GameState.jogador.habilidades[1].nome;
    document.getElementById('skill3').style.display = 'none';
    
    // Reset skill states
    document.getElementById('skill1').classList.remove('skillusada');
    document.getElementById('skill2').classList.remove('skillusada');
    document.getElementById('skill3').classList.remove('skillusada');
    
    atualizarVida();
    mostrarTela('combate');
    mostrarmsg('A batalha começou!');
}

// ============================================
// Effects System
// ============================================
function resetarEfeitos() {
    GameState.efeitos = {
        jogador: {
            escudo: { ativo: false, turnos: 0 },
            aparo: { ativo: false, turnos: 0 },
            dodge: { ativo: false, turnos: 0 }
        },
        inimigo: {
            sangramento: { ativo: false, turnos: 0 },
            queimadura: { ativo: false, turnos: 0 },
            atordoado: { ativo: false, turnos: 0 }
        }
    };
    
    // Hide all effect icons
    document.getElementById('escudomagico').style.display = 'none';
    document.getElementById('aparo').style.display = 'none';
    document.getElementById('dodge').style.display = 'none';
    document.getElementById('sangue').style.display = 'none';
    document.getElementById('fogo').style.display = 'none';
    document.getElementById('atordoadoinimigo').style.display = 'none';
    
    // Clear duration texts
    document.getElementById('duracaoescudo').textContent = '';
    document.getElementById('duracaoaparo').textContent = '';
    document.getElementById('duracaododge').textContent = '';
    document.getElementById('duracaosangue').textContent = '';
    document.getElementById('duracaofogo').textContent = '';
    document.getElementById('duracaoatordoadoinimigo').textContent = '';
}

function aplicarEfeito(tipo, alvo, duracao) {
    GameState.efeitos[alvo][tipo].ativo = true;
    GameState.efeitos[alvo][tipo].turnos = duracao;
    
    const iconId = tipo === 'sangramento' ? 'sangue' : 
                   tipo === 'queimadura' ? 'fogo' : 
                   tipo === 'atordoado' ? 'atordoadoinimigo' : tipo;
    
    if (alvo === 'jogador') {
        const durationId = `duracao${tipo.charAt(0).toUpperCase() + tipo.slice(1)}`;
        document.getElementById(iconId).style.display = 'block';
        document.getElementById(durationId).textContent = duracao;
    } else {
        document.getElementById(iconId).style.display = 'block';
        document.getElementById(`duracao${tipo}`).textContent = duracao;
    }
}

function processarEfeitosInimigo() {
    // Stun
    if (GameState.efeitos.inimigo.atordoado.ativo) {
        mostrarmsg('O inimigo está atordoado!');
        GameState.efeitos.inimigo.atordoado.turnos--;
        
        document.getElementById('duracaoatordoadoinimigo').textContent = 
            GameState.efeitos.inimigo.atordoado.turnos;
        
        if (GameState.efeitos.inimigo.atordoado.turnos <= 0) {
            GameState.efeitos.inimigo.atordoado.ativo = false;
            document.getElementById('atordoadoinimigo').style.display = 'none';
            document.getElementById('duracaoatordoadoinimigo').textContent = '';
        }
        
        return true; // Enemy skipped turn
    }
    
    // Bleed
    if (GameState.efeitos.inimigo.sangramento.ativo) {
        GameState.inimigo.vida -= 8;
        GameState.efeitos.inimigo.sangramento.turnos--;
        mostrarmsg('Sangramento causou dano!');
        
        if (GameState.inimigo.vida < 0) GameState.inimigo.vida = 0;
        
        document.getElementById('duracaosangue').textContent = 
            GameState.efeitos.inimigo.sangramento.turnos;
        
        atualizarVida();
        animarElemento('imginimigo', 'dano');
        
        if (GameState.efeitos.inimigo.sangramento.turnos <= 0) {
            GameState.efeitos.inimigo.sangramento.ativo = false;
            document.getElementById('sangue').style.display = 'none';
            document.getElementById('duracaosangue').textContent = '';
        }
        
        if (checarFim()) return true;
    }
    
    // Burn
    if (GameState.efeitos.inimigo.queimadura.ativo) {
        GameState.inimigo.vida -= 8;
        GameState.efeitos.inimigo.queimadura.turnos--;
        mostrarmsg('Queimadura causou dano!');
        
        if (GameState.inimigo.vida < 0) GameState.inimigo.vida = 0;
        
        document.getElementById('duracaofogo').textContent = 
            GameState.efeitos.inimigo.queimadura.turnos;
        
        atualizarVida();
        animarElemento('imginimigo', 'dano');
        
        if (GameState.efeitos.inimigo.queimadura.turnos <= 0) {
            GameState.efeitos.inimigo.queimadura.ativo = false;
            document.getElementById('fogo').style.display = 'none';
            document.getElementById('duracaofogo').textContent = '';
        }
        
        if (checarFim()) return true;
    }
    
    return false;
}

function processarEfeitosJogador() {
    // Dodge duration
    if (GameState.efeitos.jogador.dodge.ativo) {
        GameState.efeitos.jogador.dodge.turnos--;
        document.getElementById('duracaododge').textContent = 
            GameState.efeitos.jogador.dodge.turnos;
        
        if (GameState.efeitos.jogador.dodge.turnos <= 0) {
            GameState.efeitos.jogador.dodge.ativo = false;
            document.getElementById('dodge').style.display = 'none';
            document.getElementById('duracaododge').textContent = '';
        }
    }
    
    // Parry duration
    if (GameState.efeitos.jogador.aparo.ativo) {
        GameState.efeitos.jogador.aparo.turnos--;
        document.getElementById('duracaoaparo').textContent = 
            GameState.efeitos.jogador.aparo.turnos;
        
        if (GameState.efeitos.jogador.aparo.turnos <= 0) {
            GameState.efeitos.jogador.aparo.ativo = false;
            document.getElementById('aparo').style.display = 'none';
            document.getElementById('duracaoaparo').textContent = '';
        }
    }
}

// ============================================
// Combat Actions
// ============================================
function atacar() {
    if (GameState.turno !== 'jogador') return;
    
    AudioManager.play('ataque');
    mostrarmsg('Você atacou!');
    
    GameState.inimigo.vida -= GameState.jogador.ataque;
    if (GameState.inimigo.vida < 0) GameState.inimigo.vida = 0;
    
    animarElemento('imginimigo', 'dano');
    atualizarVida();
    
    if (checarFim()) return;
    
    GameState.turno = 'inimigo';
    setTimeout(turnoInimigo, 2000);
}

function curar() {
    if (GameState.turno !== 'jogador') return;
    
    AudioManager.play('cura');
    mostrarmsg('Você se curou!');
    
    GameState.jogador.vida += 15;
    if (GameState.jogador.vida > GameState.jogador.vidaMax) {
        GameState.jogador.vida = GameState.jogador.vidaMax;
    }
    
    animarElemento('imgjogador', 'cura', 500);
    atualizarVida();
    
    GameState.turno = 'inimigo';
    setTimeout(turnoInimigo, 2000);
}

// ============================================
// Enemy Turn
// ============================================
function turnoInimigo() {
    // Process status effects
    if (processarEfeitosInimigo()) {
        GameState.turno = 'jogador';
        return;
    }
    
    // Enemy AI
    const escolha = Math.random();
    
    if (escolha < 0.65) {
        // Attack
        let esquivou = false;
        
        // Dodge check
        if (GameState.efeitos.jogador.dodge.ativo) {
            if (Math.random() < 0.35) {
                esquivou = true;
            }
        }
        
        if (esquivou) {
            mostrarmsg('Você esquivou!');
            animarElemento('imgjogador', 'esquiva', 400);
        } else {
            // Shield check
            if (GameState.efeitos.jogador.escudo.ativo) {
                mostrarmsg('O escudo bloqueou o ataque!');
                GameState.efeitos.jogador.escudo.ativo = false;
                document.getElementById('escudomagico').style.display = 'none';
            } else {
                // Take damage
                GameState.jogador.vida -= GameState.inimigo.ataque;
                
                // Parry check
                if (GameState.efeitos.jogador.aparo.ativo) {
                    const refletido = Math.floor(GameState.inimigo.ataque / 2);
                    GameState.inimigo.vida -= refletido;
                    mostrarmsg('Você refletiu dano!');
                    animarElemento('imginimigo', 'dano');
                    
                    if (GameState.inimigo.vida < 0) GameState.inimigo.vida = 0;
                } else {
                    mostrarmsg('Inimigo atacou!');
                }
                
                AudioManager.play('dano');
                animarElemento('imgjogador', 'dano');
            }
        }
    } else {
        // Enemy heals
        GameState.inimigo.vida += 12;
        if (GameState.inimigo.vida > GameState.inimigo.vidaMax) {
            GameState.inimigo.vida = GameState.inimigo.vidaMax;
        }
        
        mostrarmsg('Inimigo se curou!');
        animarElemento('imginimigo', 'cura', 500);
    }
    
    if (GameState.jogador.vida < 0) GameState.jogador.vida = 0;
    
    atualizarVida();
    processarEfeitosJogador();
    
    if (checarFim()) return;
    
    GameState.turno = 'jogador';
}

// ============================================
// Skills
// ============================================
function toggleSkills() {
    const div = document.getElementById('skill');
    div.style.display = div.style.display === 'block' ? 'none' : 'block';
}

function usarSkill(index) {
    if (GameState.turno !== 'jogador') return;
    
    const habilidades = [...GameState.jogador.habilidades];
    if (GameState.jogador.skillBonus) {
        habilidades.push(GameState.jogador.skillBonus);
    }
    
    if (habilidades[index].usada) return;
    
    habilidades[index].usada = true;
    document.getElementById(`skill${index + 1}`).classList.add('skillusada');
    
    AudioManager.play('habilidade');
    
    // Execute skill based on character
    if (GameState.jogador.nome === 'Guerreiro') {
        executarSkillGuerreiro(index);
    } else if (GameState.jogador.nome === 'Mago') {
        executarSkillMago(index);
    }
}

function executarSkillGuerreiro(index) {
    switch(index) {
        case 0: // Golpe Dilacerante
            mostrarmsg('Você usou Golpe Dilacerante!');
            GameState.inimigo.vida -= 25;
            if (GameState.inimigo.vida < 0) GameState.inimigo.vida = 0;
            
            aplicarEfeito('sangramento', 'inimigo', 3);
            animarElemento('imginimigo', 'dano');
            break;
            
        case 1: // Dança Ágil
            mostrarmsg('Você usou Dança Ágil!');
            aplicarEfeito('dodge', 'jogador', 3);
            break;
            
        case 2: // Posição de Aparo
            mostrarmsg('Você usou Posição de Aparo!');
            aplicarEfeito('aparo', 'jogador', 3);
            break;
    }
    
    atualizarVida();
    
    if (checarFim()) return;
    
    GameState.turno = 'inimigo';
    setTimeout(turnoInimigo, 2000);
}

function executarSkillMago(index) {
    switch(index) {
        case 0: // Bola de Fogo
            mostrarmsg('Você usou Bola de Fogo!');
            GameState.inimigo.vida -= 25;
            if (GameState.inimigo.vida < 0) GameState.inimigo.vida = 0;
            
            aplicarEfeito('queimadura', 'inimigo', 3);
            animarElemento('imginimigo', 'dano');
            break;
            
        case 1: // Escudo Mágico
            mostrarmsg('Você usou Escudo Mágico!');
            GameState.efeitos.jogador.escudo.ativo = true;
            document.getElementById('escudomagico').style.display = 'block';
            animarElemento('imgjogador', 'cura', 500);
            break;
            
        case 2: // Raio Eletrizante
            mostrarmsg('Você usou Raio Eletrizante!');
            GameState.inimigo.vida -= 30;
            if (GameState.inimigo.vida < 0) GameState.inimigo.vida = 0;
            
            aplicarEfeito('atordoado', 'inimigo', 1);
            animarElemento('imginimigo', 'dano');
            break;
    }
    
    atualizarVida();
    
    if (checarFim()) return;
    
    GameState.turno = 'inimigo';
    setTimeout(turnoInimigo, 2000);
}

// Wrapper functions for HTML onclick
function usarskill1() { usarSkill(0); }
function usarskill2() { usarSkill(1); }
function usarskill3() { usarSkill(2); }

// ============================================
// Skill Descriptions
// ============================================
function mostrardescricao(skill) {
    const descricao = document.getElementById('informacao');
    const index = parseInt(skill.replace('skill', '')) - 1;
    
    if (GameState.jogador && GameState.jogador.habilidades[index]) {
        descricao.textContent = GameState.jogador.habilidades[index].descricao;
    } else if (GameState.jogador && GameState.jogador.skillBonus && index === 2) {
        descricao.textContent = GameState.jogador.skillBonus.descricao;
    }
}

function limpardescricao() {
    document.getElementById('informacao').textContent = '';
}

// ============================================
// Game End Check
// ============================================
function checarFim() {
    // Player lost
    if (GameState.jogador.vida <= 0) {
        AudioManager.play('derrota');
        SaveSystem.clear();
        mostrarFim('VOCÊ PERDEU!', 'var(--color-danger)');
        return true;
    }
    
    // Enemy defeated
    if (GameState.inimigo.vida <= 0) {
        // Phase 1 - Go to rewards
        if (GameState.fase === 1) {
            GameState.fase = 2;
            AudioManager.play('vitoria');
            SaveSystem.clear();
            mostrarTela('recompensa');
            return true;
        }
        
        // Final victory
        AudioManager.play('vitoria');
        SaveSystem.clear();
        mostrarFim('VOCÊ VENCEU! PARABÉNS!', 'var(--color-success)');
        return true;
    }
    
    return false;
}

// ============================================
// Rewards
// ============================================
function escolherRecompensa(tipo) {
    AudioManager.init();
    
    switch(tipo) {
        case 'cura':
            GameState.jogador.vida += 40;
            if (GameState.jogador.vida > GameState.jogador.vidaMax) {
                GameState.jogador.vida = GameState.jogador.vidaMax;
            }
            break;
            
        case 'dano':
            GameState.jogador.ataque += 5;
            break;
            
        case 'skill':
            GameState.jogador.habilidades.push(GameState.jogador.skillBonus);
            document.getElementById('skill3').textContent = GameState.jogador.skillBonus.nome;
            document.getElementById('skill3').style.display = 'block';
            break;
    }
    
    // Reset all skills for new phase
    GameState.jogador.habilidades.forEach(skill => {
        skill.usada = false;
    });
    if (GameState.jogador.skillBonus) {
        GameState.jogador.skillBonus.usada = false;
    }
    
    // Reset skill UI
    document.getElementById('skill1').classList.remove('skillusada');
    document.getElementById('skill2').classList.remove('skillusada');
    document.getElementById('skill3').classList.remove('skillusada');
    
    // Set boss as enemy
    GameState.inimigo = JSON.parse(JSON.stringify(Enemies.boss));
    document.getElementById('imginimigo').src = GameState.inimigo.img;
    
    // Reset effects for new phase
    resetarEfeitos();
    GameState.turno = 'jogador';
    
    atualizarVida();
    SaveSystem.save();
    mostrarTela('combate');
    mostrarmsg('Prepare-se para o próximo inimigo!');
}

// ============================================
// Initialization
// ============================================
document.addEventListener('DOMContentLoaded', function() {
    // Check for existing save
    if (SaveSystem.hasSave()) {
        const savedData = SaveSystem.load();
        if (savedData && savedData.jogador && savedData.inimigo) {
            console.log('Jogo salvo encontrado');
        }
    }
    
    // Add keyboard support
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            document.getElementById('skill').style.display = 'none';
        }
    });
});