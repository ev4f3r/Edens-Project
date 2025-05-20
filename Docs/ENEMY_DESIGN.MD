# Design dos Inimigos: Apocalypse AI Shooter

## 1. Classe Enemy (`enemy.js`)

*   **Propriedades Compartilhadas (Base para todos os tipos de inimigos):**
    *   `x`, `y`: Posição.
    *   `size`: Diâmetro para colisão e renderização.
    *   `hp`: Pontos de vida.
    *   `maxHp`: Pontos de vida máximos.
    *   `type`: Inteiro (1, 2, ou 3) para definir comportamento e stats.
    *   `sprite`: Referência ao sprite pixel art para o tipo atual (ex: `enemy1Img`, `enemy2Img`).
    *   `speed`: Velocidade de movimento.
    *   `damageOnCollision`: Dano causado se o jogador colidir diretamente com este inimigo (para MVP, pode ser baixo ou zero, priorizar dano de projétil).
    *   `shotCooldown`: Timer para atirar.
    *   `shotCooldownBase`: Valor base para o cooldown de tiro do inimigo.
    *   `projectileSpeed`: Velocidade dos projéteis deste inimigo.
    *   `scoreValue`: Pontos concedidos quando destruído.
    *   `playerReference`: Uma referência ao objeto do jogador, para mira.
*   **Métodos Compartilhados:**
    *   `constructor(x, y, type, playerReference)`: Inicializa o inimigo com base no tipo. Passa a referência do jogador.
    *   `update()`: Lida com movimento e lógica de tiro.
        *   Chama comportamento de movimento específico baseado no `type`.
        *   Chama `shoot()` se o cooldown permitir.
    *   `display()`: Renderiza o sprite do inimigo.
    *   `takeDamage(amount)`: Reduz HP. Retorna `true` se HP <= 0 (destruído).
    *   `shoot()`: Cria e retorna uma nova instância de `Projectile` mirada no jogador. Usa a classe `Projectile`, mas `owner` será 'enemy_type_X'.
    *   `isOffScreen()`: Verifica se o inimigo se moveu para muito longe da tela (pode ser usado para limpeza se eles não perseguirem ativamente ou se afastarem demais).

## 2. Tipos de Inimigos

### Tipo 1: Drone IA Normal
*   **`type = 1`**
*   **Sprite:** `enemy_type1.png` (Drone com visual padrão).
*   **HP:** Moderado (ex: 30).
*   **Speed:** Normal (ex: 1.5).
*   **Comportamento:**
    *   Move-se geralmente em direção ao jogador, talvez com leve aleatoriedade ou inércia.
    *   Pode parar a uma certa distância do jogador para atirar.
*   **Tiro:**
    *   Dispara projéteis únicos diretamente no jogador.
    *   `shotCooldownBase` moderado (ex: a cada 2 segundos).
    *   Dano de projétil padrão (ex: 10).
*   **`scoreValue`:** 100 pontos.

### Tipo 2: Scout IA Rápido
*   **`type = 2`**
*   **Sprite:** `enemy_type2.png` (Drone mais elegante e rápido).
*   **HP:** Baixo (ex: 20).
*   **Speed:** Alto (ex: 2.5).
*   **Comportamento:**
    *   Move-se rapidamente, possivelmente em padrões mais erráticos ou tentando flanquear/desviar.
    *   Pode tentar se aproximar mais do jogador ou manter uma distância específica.
*   **Tiro:**
    *   Dispara projéteis únicos e mais rápidos.
    *   `shotCooldownBase` um pouco menor (ex: a cada 1.5 segundos).
    *   Dano de projétil menor (ex: 7).
*   **`scoreValue`:** 150 pontos.

### Tipo 3: Cavaleiro IA do Apocalipse
*   **`type = 3`**
*   **Sprite:** `enemy_type3.png` (Robô humanoide em cavalo de silício-orgânico com trombeta do apocalipse).
*   **HP:** Moderado-Alto (ex: 50).
*   **Speed:** Moderada (ex: 1.2).
*   **Comportamento:**
    *   Move-se com propósito em direção ao jogador, talvez com paradas para "tocar" sua trombeta.
    *   O cavalo pode ter um movimento ligeiramente errático ou dar pequenos "saltos".
*   **Tiro:**
    *   A "trombeta do apocalipse" pode disparar um projétil único e poderoso, ou talvez um feixe de curta duração, ou até mesmo um pequeno ataque em área à sua frente.
    *   `shotCooldownBase` pode ser moderado-alto (ex: a cada 2.5 - 3.5 segundos).
    *   Dano de projétil/ataque alto (ex: 25).
*   **`scoreValue`:** 350 pontos.

## 3. Projétil Inimigo

*   Utiliza a mesma classe `Projectile` (`projectile.js`) que o jogador.
*   **Distinção:** A propriedade `owner` será definida como `'enemy_type_1'`, `'enemy_type_2'`, ou `'enemy_type_3'`.
*   Dano, velocidade e estilo visual dos projéteis (`projectile_enemy.png`, possivelmente com variações de cor via código se desejado) podem variar com base no tipo de inimigo que os disparou (embora para MVP um único tipo de projétil inimigo seja suficiente).

## 4. Lógica de Surgimento (Spawn) (`spawner.js` ou dentro de `gameManager.js`)

*   **Mecanismo:** Surgimento contínuo baseado em um timer de frames ou `millis()`.
*   **Taxa de Surgimento Inicial:** Começar com uma taxa de surgimento mais lenta.
*   **Progressão:**
    *   Aumentar gradualmente a taxa de surgimento com o tempo.
    *   Introduzir diferentes tipos de inimigos conforme o tempo passa ou a pontuação aumenta.
    *   Exemplo:
        *   0-30 segundos: Apenas Tipo 1.
        *   30-90 segundos: Mistura de Tipo 1 e Tipo 2.
        *   90+ segundos: Mistura de Tipo 1, Tipo 2 e Tipo 3.
*   **Posição de Surgimento:**
    *   Aleatoriamente nas bordas da tela (fora da área visível).
    *   Garantir que os inimigos surjam longe o suficiente para não atingir o jogador instantaneamente.
*   **Máximo de Inimigos:** Considerar um limite no número total de inimigos ativos para manter o desempenho, especialmente em dispositivos móveis.

## 5. Notas de Comportamento Básico da IA

*   **Movimento:**
    *   Para simplicidade, inimigos podem se mover em linha reta em direção à posição atual do jogador.
    *   `atan2(player.y - this.y, player.x - this.x)` pode calcular o ângulo para o jogador.
    *   `this.x += cos(angle) * this.speed;`
    *   `this.y += sin(angle) * this.speed;`
*   **Tiro:**
    *   Inimigos miram diretamente na posição atual do jogador quando disparam.
    *   Nenhuma previsão complexa necessária para o MVP.

## 6. Visuais

*   Sprites pixel art distintos para cada um dos três tipos de inimigos (você fornecerá `enemy_type1.png`, `enemy_type2.png`, `enemy_type3.png`).
*   Sprite pixel art distinto para projéteis inimigos (`projectile_enemy.png` - placeholder inicial). 