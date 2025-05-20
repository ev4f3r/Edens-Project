class Player {
  constructor(x, y, sprite) {
    this.x = x;
    this.y = y;
    this.sprite = sprite; // Referência à imagem carregada p5.Image
    this.width = 64; // Largura do jogador definida para 64px
    this.height = 64; // Altura do jogador definida para 64px
    this.speed = 4; // Velocidade de movimento
    this.hp = 100; // Pontos de vida
    this.maxHp = 100;
    this.isShielded = false; // << NOVO: Para o power-up de escudo
    
    // Mecânica de tiro
    this.originalShotCooldownTime = 30; // << NOVO: Guarda o cooldown original
    this.shotCooldownTime = this.originalShotCooldownTime; 
    this.currentShotCooldown = 0;
    this.projectileSpeed = 8;

    // Referência à imagem do projétil (deve ser carregada em sketch.js)
    this.projectileSprite = projectilePlayerImg; 
  }

  move(dx, dy) {
    // Normalizar o vetor de movimento se não for zero para velocidade consistente
    let magnitude = sqrt(dx*dx + dy*dy);
    if (magnitude > 0) {
        dx = (dx / magnitude);
        dy = (dy / magnitude);
    }

    this.x += dx * this.speed;
    this.y += dy * this.speed;

    // Restringir movimento aos limites da tela
    // Considera o tamanho do jogador para que ele não saia parcialmente
    // Usar this.width e this.height para a colisão com as bordas
    let halfWidth = this.width / 2;
    let halfHeight = this.height / 2;
    this.x = constrain(this.x, halfWidth, width - halfWidth);
    this.y = constrain(this.y, halfHeight, height - halfHeight);
  }

  shoot(projectileArray, targetPos) {
    if (this.currentShotCooldown <= 0) {
      let projectileX = this.x;
      let projectileY = this.y; // Por padrão, do centro do jogador

      // Usar targetPos (coordenadas do toque no botão de tiro) como o alvo
      let newProjectile = new Projectile(projectileX, projectileY, targetPos.x, targetPos.y, this.projectileSpeed, 'player', this.projectileSprite);
      projectileArray.push(newProjectile);

      this.currentShotCooldown = this.shotCooldownTime; // Reinicia o cooldown
    }
  }

  update() {
    // Atualiza cooldown do tiro
    if (this.currentShotCooldown > 0) {
      this.currentShotCooldown--;
    }
    // Outras lógicas de atualização do jogador (ex: power-ups) virão aqui
  }

  display() {
    if (this.sprite) {
      image(this.sprite, this.x, this.y, this.width, this.height); 
      // Desenhar escudo visualmente se ativo
      if (this.isShielded) {
        push();
        noFill();
        stroke(0, 150, 255, 200); // Azul claro para o escudo
        strokeWeight(3);
        ellipse(this.x, this.y, this.width * 1.2, this.height * 1.2);
        pop();
      }
    } else {
      // Desenho fallback se não houver sprite
      fill(0, 200, 0); // Verde
      ellipse(this.x, this.y, this.width, this.height);
    }

    // (Opcional) Desenhar barra de HP sobre o jogador ou no HUD
  }
  
  takeDamage(amount) {
    if (this.isShielded) {
      console.log("Jogador com escudo, dano absorvido!");
      return false; // Não tomou dano
    }
    this.hp -= amount;
    console.log("Player HP: " + this.hp);
    if (this.hp <= 0) {
      this.hp = 0;
      console.log("GAME OVER - Player derrotado");
      // Aqui, futuramente, vamos mudar o estado do jogo para GAME_OVER
      // noLoop(); // Pausa o jogo, por exemplo
      return true; // Indica que o jogador foi derrotado
    }
    return false;
  }

  // Método para resetar shotCooldownTime para o valor original
  resetShotCooldown() {
    this.shotCooldownTime = this.originalShotCooldownTime;
  }
  // Outros métodos como heal, applyPowerUp serão adicionados depois
} 