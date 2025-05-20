class Projectile {
  constructor(x, y, targetX, targetY, speed, owner, sprite) {
    this.x = x;
    this.y = y;
    this.speed = speed;
    this.owner = owner; // 'player' ou 'enemy_type_X'
    this.sprite = sprite; // p5.Image
    this.size = this.sprite ? max(this.sprite.width, this.sprite.height) : 10; // Tamanho baseado no sprite ou padrão
    this.damage = 10; // Dano padrão, pode ser ajustado

    // Calcular direção para o alvo
    let angle = atan2(targetY - this.y, targetX - this.x);
    this.vx = cos(angle) * this.speed;
    this.vy = sin(angle) * this.speed;
  }

  update() {
    this.x += this.vx;
    this.y += this.vy;
  }

  display() {
    if (this.sprite) {
      push(); // Salva o estado de desenho atual
      translate(this.x, this.y);
      // Rotacionar o sprite para alinhar com a direção do movimento
      // Isso é opcional e pode depender da arte do seu projétil
      // let angle = atan2(this.vy, this.vx);
      // rotate(angle + HALF_PI); // Adiciona HALF_PI se o sprite estiver "apontando para cima" por padrão
      image(this.sprite, 0, 0, this.size, this.size); // Desenha o sprite na origem transladada
      pop(); // Restaura o estado de desenho
    } else {
      // Desenho fallback se não houver sprite
      if (this.owner === 'player') {
        fill(100, 200, 255); // Azul claro para projéteis do jogador
      } else {
        fill(255, 100, 100); // Vermelho claro para projéteis inimigos
      }
      ellipse(this.x, this.y, this.size, this.size);
    }
  }

  isOffScreen(screenWidth, screenHeight) {
    // Verifica se o projétil saiu completamente da tela
    let halfSize = this.size / 2;
    if (this.x < -halfSize || this.x > screenWidth + halfSize || 
        this.y < -halfSize || this.y > screenHeight + halfSize) {
      return true;
    }
    return false;
  }
  
  // Método para colisões (será usado na Fase 2)
  // collidesWith(other) { ... }
} 