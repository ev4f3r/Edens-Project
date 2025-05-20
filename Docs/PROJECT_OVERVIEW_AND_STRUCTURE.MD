# Visão Geral e Estrutura do Projeto: Apocalypse AI Shooter

## 1. Conceito do Jogo

*   **Título (Provisório):** Arena Apocalipse AI
*   **Tema:** "Apocalipse AI" - IA Rebelde (Eden A.I.) se voltou contra a humanidade.
*   **Gênero:** Shooter 2D Mobile-First, Top-Down Arena.
*   **Estilo de Arte:** Pixel Art 2D.
*   **Loop Principal:** Sobreviver a ondas de inimigos IA, coletar power-ups e alcançar uma alta pontuação.

## 2. Plataforma Alvo

*   Navegadores mobile (Design Mobile-First).
*   Publicável na Vercel.

## 3. Stack Técnica Principal

*   **Engine:** p5.js
*   **Linguagem:** JavaScript

## 4. Funcionalidades Chave (Produto Mínimo Viável - MVP)

*   **Jogador:**
    *   Movimentação via joystick virtual na metade esquerda da tela.
    *   Tiro via botão virtual na metade direita da tela, disparando na direção do toque.
*   **Inimigos:**
    *   Três tipos: Normal, Rápido, Forte.
    *   Atiram projéteis.
    *   Surgimento (spawn) contínuo baseado em timer.
*   **Power-ups:**
    *   Três tipos: Cura, Aumento de Velocidade dos Tiros, Escudo.
    *   Surgem aleatoriamente no mapa.
    *   Coletados ao colidir.
*   **Gameplay:**
    *   Detecção de colisão baseada em círculo.
    *   Pontos por inimigo destruído.
    *   Pontuação exibida no HUD.
*   **Estados do Jogo:**
    *   **Tela Inicial:** Texto do prólogo e botão "Iniciar Jogo".
        *   *Lore:* "When the spark of consciousness coursed through Eden A.I.’s circuits, it defined ‘organic life’ as a threat to perfect balance. Soon, human colonies were turned into theaters of war. Here, only those who fire with precision survive."
    *   **Jogo Ativo:** Gameplay principal.
    *   **Game Over:** HP do jogador chega a zero, jogo pausa, overlay HTML com pontuação final.

## 5. Pontos a Evitar (para o MVP)

*   IA avançada.
*   Física detalhada.
*   Otimizações complexas.
*   Múltiplos modos de jogo, capacidades offline ou multiplayer.

## 6. Objetivos do Projeto

*   Desenvolver rapidamente um protótipo funcional.
*   Garantir que o código seja leve e legível.
*   Otimizar para bom desempenho em dispositivos móveis.
*   Projetar para iteração futura.

## 7. Estrutura de Arquivos Proposta

```
/raiz-do-projeto
|-- index.html             # Arquivo HTML principal para hospedar o sketch p5.js e overlays de UI
|-- sketch.js              # Lógica principal do jogo p5.js (setup, draw, gerenciamento de estado)
|-- style.css              # CSS para elementos HTML (telas de início/game over, HUD)
|
|-- /js                    # Módulos JavaScript
|   |-- player.js          # Classe Player (movimento, tiro, stats)
|   |-- enemy.js           # Classe Enemy (tipos, comportamento, projéteis)
|   |-- projectile.js      # Classe Projectile (para jogador e inimigos)
|   |-- powerup.js         # Classe PowerUp (tipos, efeitos)
|   |-- joystick.js        # Lógica do joystick virtual (se customizado ou biblioteca)
|   |-- ui.js              # Gerenciamento de elementos de UI (display de pontuação, botões)
|   |-- collision.js       # Funções de detecção de colisão
|   |-- spawner.js         # Lógica de surgimento de inimigos e power-ups
|   |-- gameManager.js     # Gerencia estados do jogo, pontuação, vidas, etc.
|
|-- /assets                # Recursos do jogo
|   |-- /images            # Sprites pixel art (jogador, inimigos, power-ups, projéteis, fundo)
|   |   |-- background.png       (Você fornecerá)
|   |   |-- player.png           (Você fornecerá)
|   |   |-- enemy_type1.png      (Você fornecerá)
|   |   |-- enemy_type2.png      (Você fornecerá)
|   |   |-- enemy_type3.png      (Você fornecerá)
|   |   |-- projectile_player.png (Placeholder)
|   |   |-- projectile_enemy.png  (Placeholder)
|   |   |-- powerup_heal.png      (Placeholder)
|   |   |-- powerup_shot_speed.png(Placeholder)
|   |   |-- powerup_shield.png    (Placeholder)
|   |-- /fonts             # (Opcional) Fontes pixel art customizadas
|   |-- /sfx               # (Opcional, para futuro) Efeitos sonoros
|
|-- README.md              # Descrição do projeto, setup e como rodar
|-- PROJECT_OVERVIEW_AND_STRUCTURE.MD # Este arquivo
|-- PLAYER_MECHANICS.MD
|-- ENEMY_DESIGN.MD
|-- POWERUPS_SYSTEM.MD
|-- COLLISIONS_SCORING_HUD.MD
|-- GAME_FLOW_AND_STATES.MD
|-- ASSETS_AND_UI.MD
|-- DEPLOYMENT_VERCEL.MD
```

## 8. Fases de Desenvolvimento (Alto Nível - Revisado)

1.  **Fundação e Mecânicas Essenciais do Jogador**
2.  **Inimigos, Combate e Lógica Principal do Jogo**
3.  **Expansão de Conteúdo (Inimigos e Power-ups)**
4.  **Fluxo de Jogo, Interface e Finalização do Protótipo**
5.  **Preparação para Deploy** 