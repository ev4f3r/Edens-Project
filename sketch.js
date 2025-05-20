// Variáveis globais para imagens
let backgroundImg, playerImg, enemy1Img, enemy2Img, enemy3Img, projectilePlayerImg; // Adicione outras conforme necessário

// Placeholder para objetos do jogo
let player;
let projectiles = [];
// let enemies = [];
// let powerups = [];

// Variáveis de controle do Joystick e Botão
let joystickSize = 100;
let joystickKnobSize = 50;
let joystickDeadZone = 10; // Zona morta para evitar movimento acidental
let joystickBaseX, joystickBaseY, joystickKnobX, joystickKnobY;
let isJoystickActive = false;

let shootButtonX, shootButtonY, shootButtonSize = 80;
let shootButtonPressed = false;
let shootTargetPos = { x: 0, y: 0 }; // << NOVO: Para armazenar o alvo do tiro

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
    if (projectiles[i].isOffScreen(width, height)) {
      projectiles.splice(i, 1);
    }
  }

  // Desenha UI (Joystick e Botão de Tiro)
  drawVirtualControls();
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

// Adicione as classes Player e Projectile em seus respectivos arquivos (js/player.js, js/projectile.js)
// Exemplo de como seriam chamadas (o código delas vai nos arquivos separados):
// class Player { constructor(...) {...} update() {...} display() {...} move() {...} shoot() {...} }
// class Projectile { constructor(...) {...} update() {...} display() {...} isOffScreen() {...} } 