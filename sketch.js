// Variáveis globais para imagens
let backgroundImg, playerImg, enemy1Img, enemy2Img, enemy3Img, projectilePlayerImg, projectileEnemyImg;
let powerUpHealImg, powerUpShotSpeedImg, powerUpShieldImg; // << NOVO: Sprites para power-ups

// Placeholder para objetos do jogo
let player;
let projectiles = [];
let enemies = [];
let score = 0;
let powerUps = []; // << NOVO: Array para power-ups no chão
let activePlayerEffects = []; // << NOVO: Array para power-ups com duração ativos no jogador

// Variáveis de controle do Joystick e Botão
let joystickSize = 100;
let joystickKnobSize = 50;
let joystickDeadZone = 10; // Zona morta para evitar movimento acidental
let joystickBaseX, joystickBaseY, joystickKnobX, joystickKnobY;
let isJoystickActive = false;

let shootButtonX, shootButtonY, shootButtonSize = 80;
let shootButtonPressed = false;
let shootTargetPos = { x: 0, y: 0 }; // << NOVO: Para armazenar o alvo do tiro

// Variáveis para controle de spawn de inimigos
let enemySpawnInterval = 180; // Intervalo em frames (ex: 180 frames = 3s a 60FPS)
let enemySpawnTimer = enemySpawnInterval;
let enemySpriteSheet = {};

// Variáveis para controle de spawn de power-ups
let powerUpSpawnInterval = 600; // Intervalo em frames (ex: 600 frames = 10s a 60FPS)
let powerUpSpawnTimer = powerUpSpawnInterval;
let powerUpTypes = ['heal', 'shot_speed', 'shield'];
let powerUpSprites = {}; // << NOVO: Para agrupar sprites de power-ups

function preload() {
  console.log("Iniciando preload()...");
  // Carrega os assets que você fornecerá
  backgroundImg = loadImage('assets/images/background.png', () => console.log("background.png carregado"), (e) => console.error("Erro carregando background.png:", e));
  playerImg = loadImage('assets/images/player.png', () => console.log("player.png carregado"), (e) => console.error("Erro carregando player.png:", e));
  enemy1Img = loadImage('assets/images/enemy_type1.png', () => console.log("enemy_type1.png carregado"), (e) => console.error("Erro carregando enemy_type1.png:", e));
  enemy2Img = loadImage('assets/images/enemy_type2.png', () => console.log("enemy_type2.png carregado"), (e) => console.error("Erro carregando enemy_type2.png:", e));
  enemy3Img = loadImage('assets/images/enemy_type3.png', () => console.log("enemy_type3.png carregado"), (e) => console.error("Erro carregando enemy_type3.png:", e));

  // Placeholder para o projétil do jogador - Crie um PNG simples ou use formas básicas por enquanto
  // Se você não tiver projectile_player.png, o jogo pode não iniciar corretamente ou mostrar erros.
  // Considere criar um placeholder 10x10px branco/vermelho chamado projectile_player.png em assets/images/
  projectilePlayerImg = loadImage('assets/images/projectile_player.png', () => console.log("projectile_player.png carregado"), (e) => console.error("Erro carregando projectile_player.png. Crie um placeholder se necessário.", e));
  projectileEnemyImg = loadImage('assets/images/projectile_enemy.png', () => console.log("projectile_enemy.png carregado"), (e) => console.error("Erro carregando projectile_enemy.png. Crie um placeholder se necessário.", e));

  // Carrega sprites dos power-ups
  powerUpHealImg = loadImage('assets/images/powerup_heal.png', () => { console.log("powerup_heal.png carregado"); powerUpSprites.heal = powerUpHealImg; }, (e) => console.error("Erro carregando powerup_heal.png.", e));
  powerUpShotSpeedImg = loadImage('assets/images/powerup_shot_speed.png', () => { console.log("powerup_shot_speed.png carregado"); powerUpSprites.shot_speed = powerUpShotSpeedImg; }, (e) => console.error("Erro carregando powerup_shot_speed.png.", e));
  powerUpShieldImg = loadImage('assets/images/powerup_shield.png', () => { console.log("powerup_shield.png carregado"); powerUpSprites.shield = powerUpShieldImg; }, (e) => console.error("Erro carregando powerup_shield.png.", e));
  
  // Preenche o enemySpriteSheet após carregar as imagens
  if (enemy1Img) enemySpriteSheet.normal = enemy1Img;
  if (enemy2Img) enemySpriteSheet.fast = enemy2Img;
  if (enemy3Img) enemySpriteSheet.strong = enemy3Img; // << NOVO: Adiciona sprite do inimigo forte

  console.log("preload() finalizado.");
}

function setup() {
  console.log("Iniciando setup()...");
  let canvas = createCanvas(windowWidth, windowHeight);

  // Tenta anexar ao elemento 'main'. Se não encontrar, p5.js anexa ao body por padrão.
  let mainElement = document.getElementById('main'); // Ou querySelector('main')
  if (mainElement) {
    canvas.parent(mainElement);
    console.log("Canvas anexado ao elemento <main>.");
  } else {
    console.warn("Elemento <main> não encontrado no DOM durante o setup. O canvas será anexado ao body.");
  }

  imageMode(CENTER);
  // rectMode(CENTER); // Pode ser útil para algumas entidades

  // Inicializa o jogador (exemplo, será mais robusto depois)
  if (playerImg) {
    player = new Player(width / 2, height - 100, playerImg);
  } else {
    // Fallback se a imagem do jogador não carregar
    console.error("Imagem do jogador não carregada, Player não pode ser inicializado com sprite.");
    player = new Player(width / 2, height - 100, null); // Ou crie um player com desenho básico
  }
  
  // Configurações do Joystick e Botão de Tiro
  joystickBaseX = joystickSize / 2 + 50;
  joystickBaseY = height - joystickSize / 2 - 50;
  joystickKnobX = joystickBaseX;
  joystickKnobY = joystickBaseY;

  shootButtonX = width - shootButtonSize / 2 - 50;
  shootButtonY = height - shootButtonSize / 2 - 50;

  console.log("setup() finalizado.");
  // noLoop(); // Descomente para testar setup e preload sem iniciar o draw loop
}

function draw() {
  // Background
  if (backgroundImg) {
    // Para tile, você precisaria de uma lógica mais complexa ou usar image() repetidamente
    // Por agora, vamos centralizar e cobrir, ou esticar.
    // background(backgroundImg); // Estica a imagem para o canvas
    // Ou desenhe no tamanho original no centro:
    // image(backgroundImg, width/2, height/2, backgroundImg.width, backgroundImg.height);
    // Para um efeito de tile simples:
    for (let x = 0; x < width; x += backgroundImg.width) {
        for (let y = 0; y < height; y += backgroundImg.height) {
            image(backgroundImg, x + backgroundImg.width/2, y + backgroundImg.height/2);
        }
    }
  } else {
    background(50, 50, 80); // Cor de fundo fallback
  }

  // Lógica de Input (Joystick e Botão de Tiro)
  handleInput();

  // Lógica de spawn de inimigos
  enemySpawnTimer--;
  if (enemySpawnTimer <= 0) {
    spawnEnemy();
    enemySpawnTimer = enemySpawnInterval;
  }

  // Lógica de spawn de power-ups
  powerUpSpawnTimer--;
  if (powerUpSpawnTimer <= 0) {
    spawnPowerUp();
    powerUpSpawnTimer = powerUpSpawnInterval;
  }

  // Atualiza jogador
  if (player) {
    let moveVector = { x: 0, y: 0 };
    if(isJoystickActive) {
        let dx = joystickKnobX - joystickBaseX;
        let dy = joystickKnobY - joystickBaseY;
        let distance = dist(joystickBaseX, joystickBaseY, joystickKnobX, joystickKnobY);
        if (distance > joystickDeadZone) { // Só se move se sair da zona morta
            moveVector.x = dx / (joystickSize / 2);
            moveVector.y = dy / (joystickSize / 2);
        }
    }
    player.move(moveVector.x, moveVector.y);
    player.update();
    player.display();
    // Lógica de tiro do jogador
    if (shootButtonPressed) {
      player.shoot(projectiles, shootTargetPos); // Passa shootTargetPos
      shootButtonPressed = false; // Reseta para evitar múltiplos tiros por um toque
    }
  }

  // Atualiza e exibe projéteis
  for (let i = projectiles.length - 1; i >= 0; i--) {
    projectiles[i].update();
    projectiles[i].display();

    let projectileHit = false;

    // Verifica colisões
    if (projectiles[i].owner === 'player') {
      for (let j = enemies.length - 1; j >= 0; j--) {
        let d = dist(projectiles[i].x, projectiles[i].y, enemies[j].x, enemies[j].y);
        // Usando width/2 como raio aproximado para o inimigo e size/2 para o projétil
        if (d < enemies[j].width / 2 + projectiles[i].size / 2) {
          if (enemies[j].takeDamage(projectiles[i].damage)) {
            // Inimigo destruído
            score += enemies[j].scoreValue; // << NOVO: Incrementa pontuação
            console.log("Inimigo destruído! Pontuação: " + score);
            enemies.splice(j, 1); // Remove o inimigo
          }
          projectileHit = true;
          break; // Projétil só pode atingir um inimigo por frame
        }
      }
    } else if (projectiles[i].owner.startsWith('enemy')) {
      if (player) { // Garante que o jogador exista
        let d = dist(projectiles[i].x, projectiles[i].y, player.x, player.y);
        // Usando player.width/2 como raio aproximado para o jogador
        if (d < player.width / 2 + projectiles[i].size / 2) {
          player.takeDamage(projectiles[i].damage); // Agora chama o método do jogador
          projectileHit = true;
        }
      }
    }

    if (projectileHit || projectiles[i].isOffScreen(width, height)) {
      projectiles.splice(i, 1);
    }
  }

  // Atualiza e exibe inimigos
  for (let i = enemies.length - 1; i >= 0; i--) {
    enemies[i].update(projectiles); // Passa o array de projéteis para o update do inimigo
    enemies[i].display();
    // Lógica de remoção de inimigos (ex: se saírem da tela ou HP <= 0) virá aqui
  }

  // Atualiza e exibe power-ups no chão
  for (let i = powerUps.length - 1; i >= 0; i--) {
    powerUps[i].display();
    if (player && powerUps[i].collidesWith(player)) {
      powerUps[i].applyEffect(player);
      if (powerUps[i].duration > 0) { // Se tem duração, move para efeitos ativos
        activePlayerEffects.push(powerUps[i]);
      }
      powerUps.splice(i, 1); // Remove do chão
    }
  }

  // Atualiza efeitos ativos no jogador
  for (let i = activePlayerEffects.length - 1; i >= 0; i--) {
    activePlayerEffects[i].update(player);
    if (activePlayerEffects[i].duration <= 0 && !activePlayerEffects[i].collected) { // 'collected' aqui é um pouco redundante, mas garante que não processe de novo se o status mudar
        // O powerup já deve ter revertido o efeito no seu próprio update.
        // Apenas removemos da lista de efeitos ativos.
        activePlayerEffects.splice(i,1);
    }
  }

  // Desenha UI (Joystick e Botão de Tiro)
  drawVirtualControls();

  // Desenha HUD
  drawHUD();
}

function handleInput() {
    // Lógica para mobile (touches)
    if (touches.length > 0) {
        isJoystickActive = false; // Reseta a ativação do joystick a cada frame de toque
        let joystickFound = false;

        for (let i = 0; i < touches.length; i++) {
            let touchX = touches[i].x;
            let touchY = touches[i].y;

            // Lógica do Joystick (Metade Esquerda)
            if (touchX < width / 2) {
                if (!joystickFound) { // Processa apenas o primeiro toque na área do joystick
                    let dJoystick = dist(touchX, touchY, joystickBaseX, joystickBaseY);
                    if (dJoystick < joystickSize * 1.5) { // Área de ativação maior para o joystick
                       isJoystickActive = true;
                       joystickFound = true; // Marca que o joystick está sendo controlado por este toque
                        // Atualiza a posição do knob, restringindo ao limite do joystick
                        let angle = atan2(touchY - joystickBaseY, touchX - joystickBaseX);
                        let knobDist = min(dJoystick, joystickSize / 2 - joystickKnobSize / 2);
                        joystickKnobX = joystickBaseX + cos(angle) * knobDist;
                        joystickKnobY = joystickBaseY + sin(angle) * knobDist;
                    }
                }
            }
            // Lógica do Botão de Tiro (Metade Direita)
            else {
                let dShoot = dist(touchX, touchY, shootButtonX, shootButtonY);
                if (dShoot < shootButtonSize / 2) {
                    shootButtonPressed = true;
                    shootTargetPos.x = touchX; // << NOVO: Captura X do alvo
                    shootTargetPos.y = touchY; // << NOVO: Captura Y do alvo
                }
            }
        }
        // Se nenhum toque estiver controlando o joystick, reseta sua posição
        if (!joystickFound && isJoystickActive) {
            // Mantém a última posição ativa ou reseta gradualmente?
            // Por simplicidade, reseta o knob se o dedo não estiver mais na área do joystick
            // Esta parte pode precisar de ajuste fino para a sensação desejada
        }
    } else {
        // Se não houver toques, reseta o joystick e o botão
        isJoystickActive = false;
        joystickKnobX = joystickBaseX;
        joystickKnobY = joystickBaseY;
        // shootButtonPressed = false; // Já é resetado após o tiro
    }
}

function touchStarted(event) {
  // Prevenir comportamento padrão do navegador em mobile (como zoom ou scroll)
  // if (event.target === canvas) { // Aplica só se o toque for no canvas
    // return false; 
  // }
  // A lógica de input agora está em handleInput() dentro do draw loop
  // para melhor responsividade e gerenciamento de múltiplos toques.
  // No entanto, podemos usar touchStarted para uma ação única como o tiro se preferirmos
  // em vez de verificar continuamente no draw. Por ora, handleInput é mais abrangente.
}

function touchMoved() {
  // Prevenir comportamento padrão
  // return false;
  // Lógica agora em handleInput()
}

function touchEnded() {
  // Reseta o estado do joystick se o dedo que o controlava for levantado
  // Esta lógica pode ser complexa com múltiplos toques. handleInput() tenta lidar com isso.
  // Se o último toque que estava na zona do joystick terminou, resetar.
  // (Simplificação: isJoystickActive é resetado no início de handleInput se touches.length > 0
  // e depois reavaliado. Se touches.length == 0, ele é resetado).
}


function drawVirtualControls() {
  // Desenha base do Joystick
  fill(100, 100, 100, 150); // Cinza semi-transparente
  ellipse(joystickBaseX, joystickBaseY, joystickSize, joystickSize);
  // Desenha knob do Joystick
  fill(150, 150, 150, 200);
  ellipse(joystickKnobX, joystickKnobY, joystickKnobSize, joystickKnobSize);

  // Desenha botão de Tiro
  fill(200, 50, 50, 180); // Vermelho semi-transparente
  ellipse(shootButtonX, shootButtonY, shootButtonSize, shootButtonSize);
  fill(255);
  textAlign(CENTER, CENTER);
  textSize(16);
  text("ATIRAR", shootButtonX, shootButtonY);
}

// Ajusta o canvas quando a janela é redimensionada
function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  // Atualiza posições dos controles se necessário
  joystickBaseX = joystickSize / 2 + 50;
  joystickBaseY = height - joystickSize / 2 - 50;
  if (!isJoystickActive) { // Só reseta o knob se não estiver ativo
      joystickKnobX = joystickBaseX;
      joystickKnobY = joystickBaseY;
  }
  shootButtonX = width - shootButtonSize / 2 - 50;
  shootButtonY = height - shootButtonSize / 2 - 50;
}

function spawnEnemy() {
  if (!player || !projectileEnemyImg || Object.keys(enemySpriteSheet).length < 3) { // Verifica se todos os 3 tipos de sprites estão carregados
    console.warn("Não é possível spawnar inimigo: assets (sprites de inimigo, projétil) ou jogador não carregados ou sprite sheet incompleta.");
    return;
  }

  let enemyTypeToSpawn;
  let rand = random();
  if (rand < 0.4) { // 40% chance
    enemyTypeToSpawn = 1;
  } else if (rand < 0.7) { // 30% chance (0.4 + 0.3 = 0.7)
    enemyTypeToSpawn = 2;
  } else { // 30% chance
    enemyTypeToSpawn = 3;
  }
  
  // let selectedSprite; // Não é mais necessário aqui, o construtor do Enemy lida com isso

  switch (enemyTypeToSpawn) {
    case 1:
      if (!enemySpriteSheet.normal) {
        console.warn("Sprite para inimigo normal (tipo 1) não carregado.");
        return;
      }
      break;
    case 2:
      if (!enemySpriteSheet.fast) {
        console.warn("Sprite para inimigo rápido (tipo 2) não carregado.");
        return;
      }
      break;
    case 3:
      if (!enemySpriteSheet.strong) {
        console.warn("Sprite para inimigo forte (tipo 3) não carregado.");
        return;
      }
      break;
    default:
      console.warn("Tentativa de spawnar tipo de inimigo desconhecido via spawnEnemy.");
      return;
  }

  let edge = floor(random(4));
  let x, y;
  let buffer = 70; // Aumentar um pouco o buffer para inimigos maiores como o Tipo 3

  switch (edge) {
    case 0: x = random(width); y = -buffer; break;
    case 1: x = width + buffer; y = random(height); break;
    case 2: x = random(width); y = height + buffer; break;
    case 3: x = -buffer; y = random(height); break;
  }
  enemies.push(new Enemy(x, y, enemyTypeToSpawn, player, enemySpriteSheet, projectileEnemyImg));
}

function drawHUD() {
  push(); // Isola o estilo do HUD
  fill(255); // Cor do texto (branco)
  textSize(24);
  textAlign(LEFT, TOP);
  
  // Exibe Pontuação
  text("Pontuação: " + score, 20, 20);
  
  // Exibe HP do Jogador
  if (player) {
    text("HP: " + player.hp + "/" + player.maxHp, 20, 50);
    // Opcional: Barra de HP simples
    let barWidth = 150;
    let barHeight = 15;
    let hpPercentage = player.hp / player.maxHp;
    fill(255,0,0); // Cor da barra de HP (vermelho para fundo/dano)
    rect(20, 80, barWidth, barHeight);
    fill(0,255,0); // Cor da barra de HP (verde para vida atual)
    rect(20, 80, barWidth * hpPercentage, barHeight);
    stroke(255);
    noFill();
    rect(20, 80, barWidth, barHeight); // Borda da barra
  }
  pop(); // Restaura o estilo anterior
}

function spawnPowerUp() {
  if (Object.keys(powerUpSprites).length < powerUpTypes.length) {
    console.warn("Não é possível spawnar power-up: nem todos os sprites de power-up foram carregados.");
    return;
  }
  let typeIndex = floor(random(powerUpTypes.length));
  let type = powerUpTypes[typeIndex];
  let sprite = powerUpSprites[type];

  if (!sprite) {
      console.warn(`Sprite para power-up tipo ${type} não encontrado.`);
      return;
  }

  let x = random(width * 0.1, width * 0.9); // Spawn em área central
  let y = random(height * 0.1, height * 0.9);
  powerUps.push(new PowerUp(x, y, type, sprite));
  console.log(`Spawnou power-up: ${type} em (${x.toFixed(0)}, ${y.toFixed(0)})`);
}

// Adicione as classes Player e Projectile em seus respectivos arquivos (js/player.js, js/projectile.js)
// Exemplo de como seriam chamadas (o código delas vai nos arquivos separados):
// class Player { constructor(...) {...} update() {...} display() {...} move() {...} shoot() {...} }
// class Projectile { constructor(...) {...} update() {...} display() {...} isOffScreen() {...} } 