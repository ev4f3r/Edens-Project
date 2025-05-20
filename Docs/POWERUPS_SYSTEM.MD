# Sistema de Power-ups: Apocalypse AI Shooter

## 1. Classe PowerUp (`powerup.js`)

*   **Propriedades:**
    *   `x`, `y`: Posição no mapa.
    *   `size`: Diâmetro para colisão e renderização.
    *   `type`: String identificando o power-up ('heal', 'shot_speed_boost', 'shield').
    *   `sprite`: Referência ao sprite pixel art do power-up (ex: `healImg`, `shotSpeedImg`, `shieldImg` carregados no `preload()`).
    *   `isActive`: Booleano, principalmente para gerenciar power-ups surgidos (geralmente `true` ao ser criado, `false` após coleta).
*   **Métodos:**
    *   `constructor(x, y, type)`: Inicializa as propriedades do power-up.
    *   `display()`: Renderiza o sprite do power-up.
    *   `collect(player)`: Chamado quando o jogador colide. Aplica o efeito ao jogador.
        *   Define `isActive` como `false` para marcar para remoção.
        *   Chama métodos relevantes no objeto `player` (ex: `player.heal()`, `player.applyPowerUp('shield')`).

## 2. Tipos de Power-ups e Efeitos

### Tipo 1: Kit de Saúde
*   **`type = 'heal'`**
*   **Sprite:** `powerup_heal.png` (Ícone de medkit ou cruz verde em pixel art).
*   **Efeito:**
    *   Restaura instantaneamente uma quantidade fixa de HP ao jogador (ex: 25 HP).
    *   O HP do jogador não deve exceder `player.maxHp`.
*   **Duração:** Instantâneo.

### Tipo 2: Aumento de Velocidade de Tiro
*   **`type = 'shot_speed_boost'`**
*   **Sprite:** `powerup_shot_speed.png` (Ícone sugerindo balas mais rápidas: flecha, raio em uma bala).
*   **Efeito:**
    *   Temporariamente aumenta a `player.projectileSpeed` OU reduz `player.shotCooldownBase`.
    *   Se velocidade do projétil: `player.projectileSpeed = player.projectileSpeedBase * 1.5;` (guardar original para reverter).
    *   Se cooldown de tiro: `player.shotCooldownBase = player.shotCooldownOriginal / 1.5;` (guardar original para reverter).
    *   O jogador precisará de um timer para este efeito e um método para reverter ao estado original.
*   **Duração:** Dura por um período fixo (ex: 10 segundos). Requer um timer no jogador para reverter o efeito.

### Tipo 3: Escudo
*   **`type = 'shield'`**
*   **Sprite:** `powerup_shield.png` (Ícone de escudo ou gráfico de bolha de energia).
*   **Efeito:**
    *   Jogador se torna invulnerável a dano inimigo (projéteis e colisão direta) por um curto período.
    *   `player.hasShield = true;`
    *   `player.shieldTimer = DURATION_FRAMES;` (ex: 7 segundos convertidos para frames ou `millis()`). O loop de atualização do jogador decrementará este timer.
*   **Duração:** Dura por um período fixo (ex: 7 segundos).

## 3. Lógica de Surgimento (Spawn) (`spawner.js` ou dentro de `gameManager.js`)

*   **Mecanismo:**
    *   Surgir power-ups aleatoriamente no mapa em intervalos.
    *   Baseado em timer (ex: a cada 15-25 segundos, um novo power-up aparece).
*   **Posição:**
    *   Coordenadas `x`, `y` aleatórias dentro da área de jogo jogável.
    *   Evitar surgir diretamente em cima do jogador ou de power-ups existentes.
*   **Quantidade:**
    *   Limitar o número de power-ups ativos na tela a qualquer momento (ex: máx 1-2) para manter gerenciável e valioso.
*   **Aleatoriedade:**
    *   Quando um power-up deve surgir, selecionar aleatoriamente um dos três tipos.

## 4. Coleta

*   **Mecanismo:** Jogador colide com um power-up.
*   **Detecção:** Usar detecção de colisão baseada em círculo entre jogador e power-up.
    *   `dist(player.x, player.y, powerup.x, powerup.y) < (player.size / 2 + powerup.size / 2)`
*   **Ação:**
    *   O método `powerup.collect(player)` é chamado.
    *   O power-up é removido do jogo (ex: de um array de power-ups ativos).

## 5. Visuais

*   Sprites pixel art distintos para cada um dos três tipos de power-ups (`powerup_heal.png`, `powerup_shot_speed.png`, `powerup_shield.png` - placeholders iniciais).
*   Considerar uma animação sutil (ex: pulsar ou flutuar) para power-ups surgidos para torná-los mais perceptíveis.
*   Indicação visual no jogador para escudo ativo (já mencionado em `PLAYER_MECHANICS.MD`).
*   (Opcional) Breve sinal visual/sonoro quando um power-up é coletado. 