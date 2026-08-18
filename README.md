# RPG Turnos

Um jogo RPG de turnos desenvolvido com HTML, CSS e JavaScript puro.

## Visão Geral

Este é um jogo de batalha por turnos onde o jogador escolhe entre dois personagens (Guerreiro ou Mago) e deve derrotar inimigos usando estratégias e habilidades especiais.

## Funcionalidades

### Personagens

- **Guerreiro**: Alta vida, força baixa. Habilidades focadas em sobrevivência e dano contínuo.
  - Golpe Dilacerante: Dano elevado + sangramento
  - Dança Ágil: Chance de esquiva
  - Posição de Aparo: Reflete dano

- **Mago**: Vida baixa, alta força. Habilidades mágicas poderosas.
  - Bola de Fogo: Dano elevado + queimadura
  - Escudo Mágico: Bloqueia próximo dano
  - Raio Eletrizante: Dano massivo + atordoamento

### Sistema de Efeitos

- **Sangramento**: Dano contínuo por 3 turnos
- **Queimadura**: Dano contínuo por 3 turnos
- **Atordoamento**: Inimigo perde turno
- **Escudo**: Bloqueia próximo ataque
- **Aparo**: Reflete metade do dano
- **Esquiva**: 35% de chance de evitar ataque

### Fases

1. **Fase 1**: Batalhe contra um Goblin
2. **Recompensa**: Escolha entre: +4 ataque, +40 vida, ou habilidade nova
3. **Fase 2**: Batalhe contra o Chefe Goblin

## Controles

- **Atacar**: Ataque básico
- **Curar**: Recupera 15 HP
- **Skills**: Acessa habilidades especiais
- **Mouse/Touch**: Interaja com elementos

## Recursos Novos

- **Sons**: Efeitos sonoros via Web Audio API
- **Save/Load**: Progresso salvo automaticamente
- **Acessibilidade**: Suporte a leitores de tela
- **Responsivo**: Funciona em desktop e mobile

## Como Jogar

1. Acesse o site
2. Clique em "Iniciar sua jornada"
3. Escolha seu personagem
4. Use Atacar, Curar ou Skills para derrotar o inimigo
5. Após vencer, escolha uma recompensa
6. Enfrente o Chefe Goblin

## Tecnologias

- HTML5
- CSS3 (com variáveis e flexbox)
- JavaScript ES6+
- Web Audio API (sons)
- LocalStorage (save/load)

## Estrutura do Projeto

```
├── index.html      # Página inicial
├── jogo.html       # Tela do jogo
├── quemsomos.html  # Página sobre o desenvolvedor
├── style.css       # Estilos
├── script.js       # Lógica do jogo
└── imagens/        # Assets do jogo
```

## Autor

Rafael Magalhães Barreto

## Licença

Projeto educacional - FECAP