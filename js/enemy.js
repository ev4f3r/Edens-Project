class Enemy {
  constructor(x, y, enemyType, playerReference, spriteSheet, projectileSprite) {
    this.x = x;
    this.y = y;
    this.type = enemyType;
    this.playerReference = playerReference;
    this.projectileSprite = projectileSprite;

    // Configurações baseadas no tipo de inimigo
    switch (this.type) {
      case 1: // Drone IA Normal
        this.sprite = spriteSheet.normal; // Supondo que spriteSheet.normal é enemy1Img
        this.width = 50;
        this.height = 50;
        this.hp = 30;
        this.maxHp = 30;
        this.speed = 1.5;
        this.shotCooldownTime = 120; // 2s a 60FPS
        this.projectileSpeed = 4;
        this.projectileDamage = 10;
        this.scoreValue = 100;
        break;
      case 2: // Scout IA Rápido
        this.sprite = spriteSheet.fast; // Supondo que spriteSheet.fast é enemy2Img
        this.width = 45; // Um pouco menor/mais ágil
        this.height = 45;
        this.hp = 20; // HP Baixo
        this.maxHp = 20;
        this.speed = 2.5; // Speed Alto
        this.shotCooldownTime = 90; // 1.5s a 60FPS (um pouco menor)
        this.projectileSpeed = 5; // Projéteis mais rápidos
        this.projectileDamage = 7; // Dano menor
        this.scoreValue = 150;
        break;
      case 3: // Cavaleiro IA do Apocalipse
        this.sprite = spriteSheet.strong; // Supondo que spriteSheet.strong é enemy3Img
        this.width = 70; // Maior
        this.height = 70;
        this.hp = 50; // HP Moderado-Alto
        this.maxHp = 50;
        this.speed = 1.2; // Speed Moderada
        this.shotCooldownTime = 180; // 3s (mais lento, mas mais forte)
        this.projectileSpeed = 3; // Projétil pode ser mais lento, mas poderoso
        this.projectileDamage = 25; // Dano Alto
        this.scoreValue = 350;
        break;
      default:
        console.error("Tipo de inimigo desconhecido:", this.type);
        // Fallback para tipo 1 se desconhecido
        this.sprite = spriteSheet.normal;
        this.width = 50; this.height = 50; this.hp = 30; this.maxHp = 30; this.speed = 1.5;
        this.shotCooldownTime = 120; this.projectileSpeed = 4; this.projectileDamage = 10; this.scoreValue = 100;
    }
    
    this.currentShotCooldown = this.shotCooldownTime; // Começa com cooldown
    this.damageOnCollision = 5; // Dano genérico em colisão direta
  }

  update(projectilesArray) {
    // Movimento básico: seguir o jogador (comportamento pode ser diferenciado por tipo depois)
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
      let proj = new Projectile(
        this.x,
        this.y,
        this.playerReference.x,
        this.playerReference.y,
        this.projectileSpeed,
        `enemy_type_${this.type}`, // Owner dinâmico
        this.projectileSprite
      );
      proj.damage = this.projectileDamage; // Define o dano do projétil específico deste inimigo
      projectilesArray.push(proj);
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