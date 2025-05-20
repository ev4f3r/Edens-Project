# Colisões, Pontuação e HUD: Apocalypse AI Shooter

## 1. Detecção de Colisão (`collision.js` ou integrado nas classes relevantes)

*   **Método:** Baseado em Distância (Colisão Circular).
    *   Todas as entidades do jogo (Jogador, Inimigos, Projéteis, Power-ups) serão tratadas como círculos para fins de colisão.
    *   Cada entidade terá `x`, `y` (centro) e `size` (diâmetro).
    *   **Fórmula:** `distancia = dist(obj1.x, obj1.y, obj2.x, obj2.y)` (função `dist()` do p5.js).
    *   **Colisão se:** `distancia < (obj1.size / 2 + obj2.size / 2)`.

*   **Tipos de Colisões a Tratar:**

    1.  **Projéteis do Jogador vs. Inimigos:**
        *   Iterar por todos os projéteis ativos do jogador.
        *   Iterar por todos os inimigos ativos.
        *   Se houver colisão:
            *   Inimigo sofre dano (`enemy.takeDamage(projectile.damage)`).
            *   Se HP do inimigo <= 0:
                *   Remover inimigo do jogo.
                *   Adicionar `enemy.scoreValue` à pontuação do jogador.
                *   (Opcional: surgir um efeito de explosão).
            *   Remover o projétil do jogador.

    2.  **Projéteis Inimigos vs. Jogador:**
        *   Iterar por todos os projéteis inimigos ativos.
        *   Se houver colisão com o jogador:
            *   Se `player.hasShield` for verdadeiro, o projétil é destruído, sem dano ao jogador.
            *   Caso contrário, jogador sofre dano (`player.takeDamage(projectile.damage)`).
            *   Se HP do jogador <= 0, acionar estado de Game Over.
            *   Remover o projétil inimigo.

    3.  **Jogador vs. Inimigos (Colisão Direta):**
        *   Iterar por todos os inimigos ativos.
        *   Se houver colisão com o jogador:
            *   Se `player.hasShield` for verdadeiro, sem dano ao jogador.
            *   Caso contrário, jogador sofre dano (`player.takeDamage(enemy.damageOnCollision)`).
                *   **Nota MVP:** Conforme definido, este dano pode ser baixo ou zero, priorizando dano por projéteis inimigos.
            *   (Opcional: Aplicar um pequeno empurrão ao jogador e/ou inimigo).

    4.  **Jogador vs. Power-ups:**
        *   Iterar por todos os power-ups ativos.
        *   Se houver colisão com o jogador:
            *   `powerup.collect(player)`.
            *   Remover o power-up do jogo.

*   **Nota de Otimização:** Para um grande número de entidades, a detecção de colisão pode se tornar custosa. Para este MVP, a iteração direta deve ser suficiente. Se surgirem problemas de desempenho mais tarde, particionamento espacial (ex: quadtrees) pode ser considerado, mas evitar para a implementação inicial.

## 2. Sistema de Pontuação (`gameManager.js` ou `sketch.js`)

*   Variável `score`: Mantida globalmente ou dentro de um gerenciador de jogo.
*   **Incremento da Pontuação:**
    *   Pontuação aumenta quando um inimigo é destruído.
    *   A quantidade adicionada é determinada pela propriedade `enemy.scoreValue` do inimigo destruído.
*   **Persistência:** Pontuação persiste durante uma única sessão de jogo. Reinicia quando um novo jogo começa.
*   **Pontuação Final:** Exibida na tela de Game Over.

## 3. Heads-Up Display (HUD) (`ui.js` ou `sketch.js`)

*   **Localização:** Área superior da tela (ex: canto superior esquerdo ou centro superior).
*   **Informações a Exibir:**
    *   **Pontuação Atual:**
        *   Texto: "PONTOS: [pontuacaoAtual]"
        *   Claramente visível.
    *   **HP do Jogador:**
        *   Texto: "HP: [hpAtualJogador]" ou uma barra simples.
        *   Representação visual (ex: uma barra de vida) é mais intuitiva.
        *   Mudanças de cor para a barra de vida (verde -> amarelo -> vermelho) são um toque agradável.
*   **Implementação:**
    *   Usar a função `text()` do p5.js para exibir texto.
    *   Usar a função `rect()` do p5.js para barras de vida.
    *   Garantir que os elementos do HUD sejam desenhados *após* todos os elementos do jogo para que apareçam por cima.
    *   Escolha da fonte: Usar uma fonte pixel art clara e legível, se disponível, caso contrário, uma fonte de sistema padrão.
*   **Considerações Mobile:**
    *   Garantir que os elementos do HUD sejam grandes o suficiente para serem legíveis em telas pequenas.
    *   Posicionar o HUD para evitar interferência com joysticks/botões virtuais ou a visibilidade do jogador.

## 4. Classe Projétil (`projectile.js`)
* Este arquivo já foi mencionado em `PLAYER_MECHANICS.MD` e `ENEMY_DESIGN.MD`, mas é crucial para as colisões.
*   **Propriedades:**
    *   `x`, `y`: Posição.
    *   `vx`, `vy`: Componentes do vetor velocidade.
    *   `size`: Diâmetro para colisão e renderização.
    *   `speed`: Velocidade do projétil.
    *   `damage`: Dano causado no impacto.
    *   `owner`: String ('player' ou 'enemy_type_X') para diferenciar projéteis.
    *   `sprite`: Referência ao sprite (`projectile_player.png` ou `projectile_enemy.png`).
*   **Métodos:**
    *   `constructor(startX, startY, targetX, targetY, speed, damage, owner, sprite)`: Calcula `vx`, `vy` com base no início e no alvo.
    *   `update()`: Move o projétil (`x += vx`, `y += vy`).
    *   `display()`: Renderiza o projétil.
    *   `isOffScreen()`: Verifica se o projétil saiu dos limites do jogo para remoção. 