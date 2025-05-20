# Assets (Recursos Gráficos) e UI: Apocalypse AI Shooter

## 1. Assets Pixel Art (`/assets/images/`)

*   **Estilo:** Pixel Art 2D consistente. Manter dimensões relativamente pequenas para desempenho e uma sensação clássica (ex: jogador/inimigos 16x16, 24x24, ou 32x32 pixels é um bom ponto de partida, mas ajuste conforme sua arte).
*   **Sprites Requeridos (Nomes de Arquivo Placeholder):**
    *   **Background:** `background.png` (Você fornecerá)
    *   **Jogador:** `player.png` (Você fornecerá)
    *   **Inimigos:**
        *   `enemy_type1.png` (Normal AI Drone - Você fornecerá)
        *   `enemy_type2.png` (Fast AI Scout - Você fornecerá)
        *   `enemy_type3.png` (Cavaleiro IA do Apocalipse: Robô humanoide em cavalo de silício-orgânico com trombeta - Você fornecerá)
    *   **Projéteis:**
        *   `projectile_player.png` (Placeholder inicial)
        *   `projectile_enemy.png` (Placeholder inicial - pode ser o mesmo do jogador com cor diferente via código, ou um sprite distinto)
    *   **Power-ups:**
        *   `powerup_heal.png` (Ex: ícone de medkit - Placeholder inicial)
        *   `powerup_shot_speed.png` (Ex: ícone de bala rápida - Placeholder inicial)
        *   `powerup_shield.png` (Ex: ícone de escudo - Placeholder inicial)
    *   **(Opcional) Explosão:** `explosion_spritesheet.png` (para quando inimigos são destruídos).
    *   **(Opcional) Flash de Disparo (Muzzle Flash):** `muzzle_flash.png` (para tiro do jogador/inimigo).

*   **Carregando Assets em p5.js:**
    *   Usar a função `preload()` em `sketch.js` para carregar todas as imagens antes que `setup()` execute.
    ```javascript
    let playerImg, enemy1Img, enemy2Img, enemy3Img, projectilePlayerImg, projectileEnemyImg, powerupHealImg, powerupShotSpeedImg, powerupShieldImg, backgroundImg;

    function preload() {
      backgroundImg = loadImage('assets/images/background.png');
      playerImg = loadImage('assets/images/player.png');
      enemy1Img = loadImage('assets/images/enemy_type1.png');
      enemy2Img = loadImage('assets/images/enemy_type2.png');
      enemy3Img = loadImage('assets/images/enemy_type3.png');
      projectilePlayerImg = loadImage('assets/images/projectile_player.png');
      projectileEnemyImg = loadImage('assets/images/projectile_enemy.png');
      powerupHealImg = loadImage('assets/images/powerup_heal.png');
      powerupShotSpeedImg = loadImage('assets/images/powerup_shot_speed.png');
      powerupShieldImg = loadImage('assets/images/powerup_shield.png');
      // ... carregar outros assets opcionais se usados
    }
    ```
*   **Renderizando Sprites:**
    *   Usar `image(img, x, y, width, height)` nos métodos `display()` dos seus objetos de jogo.
    *   Considerar usar `imageMode(CENTER)` no `setup()` se as coordenadas `x,y` dos objetos representarem seus centros.

## 2. Elementos de UI (Interface do Usuário)

### 2.1. Joysticks Virtuais e Botões

*   **Joystick de Movimento (Metade Esquerda da Tela):**
    *   **Visuais:** Um círculo base e um botão/alavanca arrastável.
    *   **Interação:**
        *   Detectar `touches` (para mobile) ou `mousePressed` + `mouseDragged` (para teste desktop) na metade esquerda.
        *   O botão do joystick segue o toque/mouse dentro dos limites da base.
        *   Calcular um vetor normalizado `{dx, dy}` com base no deslocamento do botão em relação ao centro do joystick.
    *   **Implementação:** Pode ser customizada desenhando círculos com p5.js e gerenciando eventos de toque. Para simplicidade, um joystick fixo na tela é mais fácil de implementar inicialmente.
*   **Botão de Atirar (Lado Direito da Tela):**
    *   **Visuais:** Um gráfico de botão circular claro.
    *   **Interação:**
        *   Detectar `touches` ou `mousePressed` na área deste botão.
        *   Ao tocar/pressionar, acionar `player.shoot(touchX, touchY)`. `touchX, touchY` são as coordenadas do toque no botão, usadas para mirar o projétil.
    *   **Implementação:** Desenhar um círculo ou uma imagem para o botão usando p5.js. Definir sua área clicável. Verificar `dist(mouseX, mouseY, buttonX, buttonY) < buttonRadius` em `mousePressed` ou `touchStarted`.

### 2.2. HUD (Heads-Up Display)

*   **Localização:** Tipicamente no canto superior esquerdo ou centro superior.
*   **Elementos:**
    *   **Pontuação:** "PONTOS: [valor]"
    *   **HP do Jogador:** Texto "HP: [valor]" e/ou uma barra de vida visual.
*   **Estilização:**
    *   Usar `fill()` para cor do texto e `text()` para renderizar.
    *   Usar `rect()` para barra de vida.
    *   Escolher uma fonte pixel art clara e legível se disponível (carregada em `preload()`) ou uma fonte padrão do sistema.
    *   Garantir bom contraste com o fundo do jogo.
    *   Dimensionar apropriadamente para telas mobile.

### 2.3. UI da Tela Inicial

*   **Texto do Prólogo:** Texto grande e legível. Pode ser desenhado com `text()` do p5.js com `textAlign(CENTER, CENTER)`.
*   **Botão "INICIAR JOGO":**
    *   Pode ser um retângulo desenhado com p5.js com texto, verificando cliques dentro de seus limites.
    *   Alternativamente, um elemento `<button>` HTML posicionado sobre a tela usando CSS. Frequentemente mais fácil para estilização e gerenciamento robusto de eventos de clique.

### 2.4. Overlay de Game Over (HTML)

*   **Estrutura (`index.html`):**
    ```html
    <div id="gameOverOverlay" style="display:none;">
      <h1>GAME OVER</h1>
      <p>Sua Pontuação: <span id="finalScore">0</span></p>
      <button id="restartButton">JOGAR NOVAMENTE</button>
    </div>
    ```
*   **Estilização (`style.css`):**
    *   Posicionar com `position: fixed` ou `absolute` para cobrir a tela.
    *   `text-align: center`, `background-color: rgba(0,0,0,0.7)`, etc.
    *   Estilizar o texto e o botão.
*   **Interação (`sketch.js` ou um `ui.js` dedicado):**
    *   No estado `GAME_STATE.GAME_OVER`:
        *   `document.getElementById('finalScore').innerText = score;`
        *   `document.getElementById('gameOverOverlay').style.display = 'flex'; // ou 'block'`
    *   Adicionar um event listener ao `restartButton`:
        *   `document.getElementById('restartButton').addEventListener('click', () => { /* lógica de reiniciar */ });`

## 3. Fontes (`/assets/fonts/`) - Opcional

*   Se usar uma fonte pixel art customizada:
    *   Garantir que esteja em um formato amigável para web (ex: `.ttf`, `.otf`).
    *   Carregar em `preload()` usando `loadFont('assets/fonts/suafonte.ttf')`.
    *   Definir usando `textFont(minhaFonte)` antes de desenhar texto.

## 4. Considerações Mobile-First

*   **Áreas de Toque:** Garantir que joysticks e botões tenham alvos de toque grandes o suficiente.
*   **Escalabilidade:** Projetar elementos de UI e a visão do jogo para serem claros em vários tamanhos de tela. A tela do p5.js pode ser definida como `windowWidth`, `windowHeight` e elementos de UI podem ser posicionados relativamente.
*   **Desempenho:** Manter sprites e efeitos simples para garantir taxas de quadros suaves.
*   **Evitar Estados de Hover:** Projetar interações para toque/tap, não para hover do mouse. 