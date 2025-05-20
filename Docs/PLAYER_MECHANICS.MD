# Mecânicas do Jogador: Apocalypse AI Shooter

## 1. Classe Player (`player.js`)

*   **Propriedades:**
    *   `x`, `y`: Posição (centro do jogador).
    *   `size`: Diâmetro para colisão e renderização.
    *   `speed`: Velocidade de movimento.
    *   `hp`: Pontos de vida.
    *   `maxHp`: Pontos de vida máximos.
    *   `sprite`: Referência ao sprite (ex: `playerImg` carregado no `preload()`).
    *   `projectiles`: Array para armazenar projéteis ativos do jogador.
    *   `shotCooldown`: Timer para controlar a taxa de disparo (baseado em frames ou `millis()`).
    *   `shotCooldownBase`: Valor base para o cooldown, para ser modificado por power-ups.
    *   `projectileSpeed`: Velocidade dos projéteis do jogador.
    *   `projectileSpeedBase`: Valor base para a velocidade do projétil.
    *   `hasShield`: Booleano, `true` se o power-up de escudo estiver ativo.
    *   `shieldTimer`: Duração do escudo (em frames ou `millis()`).
*   **Métodos:**
    *   `constructor(x, y)`: Inicializa as propriedades do jogador.
    *   `update(joystickMovement, shootSignal, shootTargetPos)`: Lida com a entrada de movimento e lógica de tiro.
        *   Atualiza a posição baseada em `joystickMovement`.
        *   Gerencia `shotCooldown`.
        *   Chama `shoot(shootTargetPos)` se `shootSignal` for verdadeiro e o cooldown permitir.
        *   Gerencia `shieldTimer` e desativa o escudo se o tempo acabar.
    *   `display()`: Renderiza o sprite do jogador (e o escudo se ativo) na tela.
    *   `shoot(targetPos)`: Cria uma nova instância de `Projectile` mirada do jogador em direção a `targetPos`. Adiciona ao `player.projectiles`. Reinicia `shotCooldown`.
    *   `takeDamage(amount)`: Reduz HP. Lida com a morte se HP <= 0.
    *   `heal(amount)`: Aumenta HP, limitado por `maxHp`.
    *   `applyPowerUp(type)`: Lida com a lógica para diferentes power-ups (ativa escudo, aumenta `projectileSpeed` ou diminui `shotCooldownBase`).
    *   `reset()`: Restaura o jogador ao estado inicial para um novo jogo.

## 2. Movimento

*   **Entrada:** Joystick Virtual na metade esquerda da tela.
    *   O joystick fornecerá um vetor normalizado `{dx, dy}` representando a direção do movimento.
    *   Pode ser uma implementação customizada simples usando `touchX`, `touchY` do p5.js ou uma biblioteca como `nipplejs` (para simplicidade no MVP, customizado é viável).
*   **Lógica:**
    *   As coordenadas `x` e `y` do jogador são atualizadas com base no vetor do joystick e `player.speed`.
    *   `newX = x + joystickMovement.dx * speed`
    *   `newY = y + joystickMovement.dy * speed`
    *   Restringir o movimento do jogador dentro dos limites da tela.

## 3. Tiro

*   **Entrada:**
    *   Um botão virtual dedicado "ATIRAR" na metade direita da tela.
    *   Quando este botão é tocado/pressionado, aciona a ação de atirar.
    *   **Mira:** O tiro deve ser direcionado para o ponto de toque deste botão "ATIRAR".
*   **Lógica:**
    *   O método `player.shoot(targetPos)` é chamado, onde `targetPos` são as coordenadas do toque no botão de atirar.
    *   Um novo `Projectile` é criado originando-se do centro do jogador, movendo-se em direção a `targetPos`.
    *   Implementar um `shotCooldown` para prevenir disparos contínuos.
    *   O power-up de velocidade de tiro irá temporariamente reduzir este cooldown ou aumentar a velocidade do projétil.

## 4. Saúde e Escudo

*   **Saúde (HP):**
    *   Jogador começa com `maxHp`.
    *   Diminui ao colidir com projéteis inimigos ou inimigos (se dano por colisão direta for implementado).
    *   Game over quando HP chega a 0.
*   **Escudo:**
    *   Ativado por um power-up.
    *   Quando ativo, o jogador não sofre dano.
    *   Indicador visual para o escudo (ex: uma aura brilhante em volta do sprite do jogador).
    *   Dura por um período fixo (`shieldTimer`).

## 5. Visuais

*   Sprite pixel art distinto para o jogador (`player.png`).
*   Feedback visual para o tiro (o projétil aparecendo é o mínimo; um pequeno flash na "arma" do jogador é opcional).
*   Visual para o escudo ativo. 