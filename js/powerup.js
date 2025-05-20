class PowerUp {
  constructor(x, y, type, sprite) {
    this.x = x;
    this.y = y;
    this.type = type; // String: 'heal', 'shot_speed', 'shield'
    this.sprite = sprite; // p5.Image
    this.size = 30; // Tamanho padrão para power-ups, pode ser ajustado
    this.collected = false;
    this.duration = 0; // Para power-ups com tempo (ex: shield, shot_speed)
    this.initialTime = 0; // Para rastrear a duração
  }

  display() {
    if (this.sprite && !this.collected) {
      image(this.sprite, this.x, this.y, this.size, this.size);
    } else if (!this.collected) {
      // Fallback se o sprite não carregar
      fill(255, 255, 0); // Amarelo para power-up genérico
      ellipse(this.x, this.y, this.size, this.size);
    }
  }

  // Verifica colisão circular com o jogador
  collidesWith(player) {
    if (this.collected) return false;
    let d = dist(this.x, this.y, player.x, player.y);
    if (d < this.size / 2 + player.width / 2) {
      this.collected = true;
      return true;
    }
    return false;
  }

  applyEffect(player) {
    // A lógica específica do efeito será definida aqui ou em classes/funções separadas
    console.log(`Power-up ${this.type} coletado!`);
    switch (this.type) {
      case 'heal':
        player.hp = min(player.hp + 30, player.maxHp); // Cura 30 HP, não ultrapassa maxHp
        console.log("Jogador curado! HP: " + player.hp);
        break;
      case 'shot_speed':
        // Aumenta a velocidade de tiro do jogador temporariamente
        // Precisaremos de uma forma de reverter isso após a duração
        player.shotCooldownTime = max(10, player.shotCooldownTime / 2); // Reduz cooldown pela metade (mínimo 10)
        this.duration = 300; // 5 segundos a 60FPS
        this.initialTime = frameCount; // Registra quando o efeito começou
        console.log("Velocidade de tiro aumentada! Cooldown: " + player.shotCooldownTime);
        break;
      case 'shield':
        // Torna o jogador invulnerável temporariamente
        // Precisaremos de uma propriedade no jogador como player.isShielded
        player.isShielded = true;
        this.duration = 300; // 5 segundos a 60FPS
        this.initialTime = frameCount; // Registra quando o efeito começou
        console.log("Escudo ativado!");
        break;
    }
  }

  // Método para atualizar power-ups ativos (ex: escudo, shot_speed)
  update(player) {
    if (!this.collected || this.duration <= 0) return;

    if (frameCount > this.initialTime + this.duration) {
      // Efeito terminou, reverte se necessário
      console.log(`Efeito do power-up ${this.type} terminou.`);
      switch (this.type) {
        case 'shot_speed':
          player.resetShotCooldown(); // Usa o método de reset
          console.log("Velocidade de tiro normalizada. Cooldown: " + player.shotCooldownTime);
          break;
        case 'shield':
          player.isShielded = false;
          console.log("Escudo desativado.");
          break;
      }
      this.duration = 0; // Marca como efeito terminado
      // O power-up em si pode ser removido de uma lista de power-ups ativos se necessário
    }
  }
} 