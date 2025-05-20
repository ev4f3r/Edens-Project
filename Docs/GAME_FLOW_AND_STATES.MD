# Fluxo e Estados do Jogo: Apocalypse AI Shooter

## 1. Enum/Constantes de Estados do Jogo

Definir estados para gerenciar o fluxo do jogo. Podem ser constantes de string simples ou enums numéricos.

```javascript
// Exemplo em sketch.js ou gameManager.js
const GAME_STATE = {
  START_SCREEN: 'START_SCREEN',
  PLAYING: 'PLAYING',
  GAME_OVER: 'GAME_OVER'
};
let currentGameState = GAME_STATE.START_SCREEN;
```

## 2. Loop Principal do Jogo (função `draw()` em `sketch.js`)

A função `draw()` executará lógicas diferentes com base em `currentGameState`.

```javascript
function draw() {
  background(0); // Ou imagem de fundo do jogo (backgroundImg)

  switch (currentGameState) {
    case GAME_STATE.START_SCREEN:
      displayStartScreen();
      break;
    case GAME_STATE.PLAYING:
      runGameLogic();
      displayGameScreen(); // Jogador, inimigos, projéteis, HUD
      break;
    case GAME_STATE.GAME_OVER:
      // Mantém os elementos do jogo pausados, mas ainda os desenha uma última vez
      // ou apenas desenha o fundo e depois o overlay de Game Over.
      displayGameScreen(); // Para manter a última cena visível
      displayGameOverScreen(); // Overlay por cima
      break;
  }
}
```

## 3. Estado: Tela Inicial (`GAME_STATE.START_SCREEN`)

*   **Exibição (`displayStartScreen()`):**
    *   Mostrar o texto do prólogo:
        > "When the spark of consciousness coursed through Eden A.I.’s circuits, it defined ‘organic life’ as a threat to perfect balance. Soon, human colonies were turned into theaters of war. Here, only those who fire with precision survive."
    *   Exibir um botão "INICIAR JOGO".
*   **Implementação:**
    *   O texto pode ser desenhado usando `text()` do p5.js diretamente na tela, com formatação apropriada (`textAlign`, `textSize`, `fill`).
    *   O botão pode ser uma área clicável na tela (verificar `mouseX`, `mouseY` em `mousePressed()` ou `touchStarted()`) ou um elemento de botão HTML estilizado e posicionado sobre a tela. Um botão HTML é mais simples para interação e estilo, especialmente para mobile.
*   **Interação:**
    *   Quando o botão "INICIAR JOGO" é clicado/tocado:
        *   Chamar uma função `resetGame()` para inicializar/resetar variáveis do jogo (stats do jogador, pontuação, arrays de inimigos, etc.).
        *   Mudar estado: `currentGameState = GAME_STATE.PLAYING;`
        *   Esconder elementos HTML da tela inicial, se usados.

## 4. Estado: Jogando (`GAME_STATE.PLAYING`)

*   **Lógica (`runGameLogic()`):**
    *   Lidar com entrada do jogador (movimento do joystick, botão de atirar).
    *   Atualizar estado do jogador (`player.update()`).
    *   Atualizar todos os inimigos ativos (`enemy.update()`).
    *   Atualizar todos os projéteis ativos (`projectile.update()`).
    *   Lidar com surgimento de inimigos (`enemySpawner.update()`).
    *   Lidar com surgimento de power-ups (`powerUpSpawner.update()`).
    *   Realizar todas as checagens de colisão:
        *   Projéteis do Jogador vs. Inimigos.
        *   Projéteis Inimigos vs. Jogador.
        *   Jogador vs. Power-ups.
        *   (Opcional MVP) Jogador vs. Inimigos (colisão direta).
    *   Remover projéteis fora da tela e entidades inativas (inimigos destruídos, power-ups coletados).
    *   Verificar condição de game over (HP do jogador <= 0). Se sim, `currentGameState = GAME_STATE.GAME_OVER; noLoop();` (para pausar o `draw` loop, ou usar uma flag interna para pausar atualizações).
*   **Exibição (`displayGameScreen()`):**
    *   Desenhar fundo.
    *   Renderizar jogador (`player.display()`).
    *   Renderizar todos os inimigos ativos (`enemy.display()`).
    *   Renderizar todos os projéteis ativos (`projectile.display()`).
    *   Renderizar todos os power-ups ativos (`powerup.display()`).
    *   Renderizar HUD (pontuação, HP do jogador) (`hud.display()`).

## 5. Estado: Game Over (`GAME_STATE.GAME_OVER`)

*   **Gatilho:** HP do jogador cai para 0 ou menos.
*   **Ação:**
    *   Imediatamente definir `currentGameState = GAME_STATE.GAME_OVER;`.
    *   Chamar `noLoop()` para pausar o jogo efetivamente. A entrada do jogador é ignorada, inimigos param de se mover/atirar.
*   **Exibição (`displayGameOverScreen()`):**
    *   O mundo do jogo (jogador, inimigos em suas posições finais) deve permanecer visível, mas estático (efeito do `noLoop()`).
    *   **Overlay HTML:** Método preferido para fácil estilização e interação.
        *   Criar um elemento `div` em `index.html`, inicialmente escondido (`display: none;`).
        *   Estilizá-lo com CSS para aparecer como um overlay (ex: fundo semi-transparente, conteúdo centralizado).
        *   Quando `GAME_STATE.GAME_OVER` está ativo e após `noLoop()`:
            *   Tornar o `div` do overlay visível (`display: block;` ou `flex`).
            *   Populá-lo com:
                *   Texto "GAME OVER".
                *   Pontuação Final: "Sua Pontuação: [pontuacaoFinal]".
                *   Um botão "REINICIAR" ou "JOGAR NOVAMENTE".
*   **Interação (Botão Reiniciar):**
    *   O botão "REINICIAR" no overlay HTML terá um event listener.
    *   Ao ser clicado:
        *   Esconder o overlay HTML.
        *   Chamar `resetGame()`.
        *   Redefinir o estado: `currentGameState = GAME_STATE.START_SCREEN;` (ou `GAME_STATE.PLAYING` se quiser pular a tela inicial).
        *   Chamar `loop()` para reiniciar o `draw()` loop do p5.js.

## 6. Função `resetGame()`

Uma função para resetar todos os elementos do jogo para seus estados iniciais é crucial.
`function resetGame()` normalmente iria:
*   Resetar jogador (posição, HP, limpar projéteis, remover efeitos de power-up ativos).
*   Limpar todos os inimigos e projéteis existentes dos arrays.
*   Limpar todos os power-ups existentes.
*   Resetar pontuação para 0.
*   Resetar quaisquer timers do jogo (timer de surgimento de inimigos, timer de surgimento de power-ups).
*   Garantir que `loop()` seja chamado se `noLoop()` foi usado para pausar. 