class Enemy {
  constructor(x, y, playerReference, sprite, projectileSprite) {
    this.x = x;
    this.y = y;
    this.playerReference = playerReference; // Referência ao objeto do jogador
    this.sprite = sprite; // p5.Image para o inimigo
    this.projectileSprite = projectileSprite; // p5.Image para o projétil inimigo

    // Especificações do Inimigo Tipo 1: Drone IA Normal
    this.type = 1;
    this.width = 50; // Tamanho placeholder
    this.height = 50; // Tamanho placeholder
    this.hp = 30;
    this.maxHp = 30;
    this.speed = 1.5;
    this.damageOnCollision = 5; // Dano baixo em colisão direta
    this.shotCooldownTime = 120; // Cooldown em frames (ex: 120 frames = 2s a 60FPS)
    this.currentShotCooldown = this.shotCooldownTime; // Começa com cooldown para não atirar imediatamente
    this.projectileSpeed = 4;
    this.scoreValue = 100;
  }

  update(projectilesArray) {
    // Movimento básico: seguir o jogador
    if (this.playerReference) {
      let angle = atan2(this.playerReference.y - this.y, this.playerReference.x - this.x);
      this.x += cos(angle) * this.speed;
      this.y += sin(angle) * this.speed;
    }

    // Lógica de tiro
    this.currentShotCooldown--;
    if (this.currentShotCooldown <= 0) {
      this.shoot(projectilesArray);
      this.currentShotCooldown = this.shotCooldownTime;
    }
  }

  shoot(projectilesArray) {
    if (this.playerReference) {
      // Cria um projétil mirando no jogador
      let newProjectile = new Projectile(
        this.x,
        this.y,
        this.playerReference.x, // Alvo X
        this.playerReference.y, // Alvo Y
        this.projectileSpeed,
        'enemy_type_1', // owner
        this.projectileSprite // sprite do projétil inimigo
      );
      projectilesArray.push(newProjectile);
    }
  }

  display() {
    if (this.sprite) {
      image(this.sprite, this.x, this.y, this.width, this.height);
    } else {
      // Fallback se o sprite não carregar
      fill(255, 0, 0); // Vermelho para inimigo
      ellipse(this.x, this.y, this.width, this.height);
    }
  }

  takeDamage(amount) {
    this.hp -= amount;
    if (this.hp <= 0) {
      return true; // Inimigo destruído
    }
    return false; // Inimigo ainda vivo
  }

  // Método para verificar se está fora da tela (pode ser útil depois)
  isOffScreen() {
    return (this.x < -this.width || this.x > width + this.width ||
            this.y < -this.height || this.y > height + this.height);
  }
} 