# Roadmap de Implementação: Apocalypse AI Shooter

## 1. Introdução

Este roadmap descreve as fases de desenvolvimento, objetivos principais e entregáveis chave para a criação do protótipo do jogo 2D mobile-first top-down arena shooter "Apocalypse AI" em p5.js. O objetivo é ter um protótipo funcional, leve, legível e pronto para deploy na Vercel.

## 2. Fases do Roadmap

As estimativas de tempo são simbólicas e servem para organizar o fluxo de desenvolvimento. Cada fase representa um conjunto de funcionalidades interconectadas.

### Fase 1: Fundação e Mecânicas Essenciais do Jogador
*   **Objetivo Principal:** Estabelecer a estrutura básica do projeto e implementar as mecânicas centrais de controle e ação do jogador.
*   **Estimativa de Tempo (Simbólica):** Sprint 1 (ex: 1-2 semanas)
*   **Principais Entregáveis/Marcos:**
    *   [X] Estrutura de pastas do projeto definida.
    *   [X] Arquivo `index.html`, `style.css` e `sketch.js` básicos configurados.
    *   [X] Carregamento dos assets placeholder fornecidos (`background.png`, `player.png`, `enemy_type1.png`, etc.) via `preload()`.
    *   [X] **Classe `Player` (`player.js`) implementada:**
        *   [X] Renderização do sprite do jogador.
        *   [X] Movimentação funcional via joystick virtual (metade esquerda da tela).
        *   [X] Restrição de movimento do jogador aos limites da tela.
    *   [X] **Classe `Projectile` (`projectile.js`) (versão inicial para o jogador):**
        *   [X] Renderização e movimento básico do projétil.
    *   [X] **Mecânica de Tiro do Jogador:**
        *   [X] Botão virtual de tiro (metade direita da tela) funcional.
        *   [X] Disparo de projéteis na direção do toque no botão.
        *   [X] Cooldown básico para os tiros.
    *   [X] Canvas do jogo responsivo ao tamanho da tela (mobile-first).

### Fase 2: Inimigos, Combate e Lógica Principal do Jogo
*   **Objetivo Principal:** Introduzir o primeiro tipo de inimigo, implementar o ciclo de combate (atirar e ser atingido) e os sistemas de feedback como vida e pontuação.
*   **Estimativa de Tempo (Simbólica):** Sprint 2 (ex: 1-2 semanas)
*   **Principais Entregáveis/Marcos:**
    *   [X] **Classe `Enemy` (`enemy.js`) implementada (para Tipo 1 - Normal):**
        *   [X] Renderização do sprite do Inimigo Tipo 1.
        *   [X] Movimento básico (ex: em direção ao jogador).
        *   [X] Capacidade de atirar projéteis (usando a classe `Projectile` com `owner`='enemy').
    *   [X] **Lógica de Spawn de Inimigos (`spawner.js` ou integrado):**
        *   [X] Surgimento contínuo de Inimigos Tipo 1 nas bordas da tela, baseado em timer.
    *   [X] **Detecção de Colisão (Circular) (`collision.js` ou integrado):**
        *   [X] Colisão: Projéteis do Jogador vs. Inimigos (inimigo toma dano/é destruído).
        *   [X] Colisão: Projéteis Inimigos vs. Jogador (jogador toma dano).
    *   [X] **Sistemas de Jogo Fundamentais:**
        *   [X] Sistema de HP para jogador e inimigos.
        *   [X] Sistema de Pontuação (aumenta ao destruir inimigo).
    *   [X] **HUD (Heads-Up Display) Básico:**
        *   [X] Exibição da pontuação atual.
        *   [X] Exibição do HP do jogador (texto ou barra simples).

### Fase 3: Expansão de Conteúdo (Mais Inimigos e Power-ups)
*   **Objetivo Principal:** Aumentar a variedade e o desafio do jogo com novos tipos de inimigos e introduzir mecânicas de recompensa através de power-ups.
*   **Estimativa de Tempo (Simbólica):** Sprint 3 (ex: 1 semana)
*   **Principais Entregáveis/Marcos:**
    *   [X] **Novos Tipos de Inimigos (em `enemy.js`):**
        *   [X] Implementação do Inimigo Tipo 2 (Rápido) com stats e comportamento próprios.
        *   [X] Implementação do Inimigo Tipo 3 (Forte) com stats e comportamento próprios.
        *   [X] Atualização da lógica de spawn para incluir gradualmente os novos tipos.
    *   [X] **Classe `PowerUp` (`powerup.js`) implementada:**
        *   [X] Renderização dos sprites placeholder para power-ups.
    *   [X] **Implementação dos 3 Tipos de Power-ups:**
        *   [X] Cura (restaura HP do jogador).
        *   [X] Aumento de Velocidade dos Tiros (do jogador).
        *   [X] Escudo (jogador invulnerável temporariamente).
    *   [X] **Lógica de Spawn de Power-ups:**
        *   [X] Surgimento aleatório de power-ups no mapa em intervalos.
    *   [X] **Coleta e Efeitos de Power-ups:**
        *   [X] Detecção de colisão: Jogador vs. Power-ups.
        *   [X] Aplicação correta dos efeitos dos power-ups (instantâneos e com duração).

### Fase 4: Fluxo de Jogo, Interface Completa e Finalização do Protótipo
*   **Objetivo Principal:** Estruturar a experiência completa do usuário com telas de início e fim de jogo, refinar a interface e garantir que o protótipo esteja coeso e polido.
*   **Estimativa de Tempo (Simbólica):** Sprint 4 (ex: 1 semana)
*   **Principais Entregáveis/Marcos:**
    *   [ ] **Gerenciamento de Estados do Jogo (`gameManager.js` ou `sketch.js`):**
        *   [ ] Implementação da lógica de transição entre `START_SCREEN`, `PLAYING`, `GAME_OVER`.
    *   [ ] **Tela Inicial (`START_SCREEN`):**
        *   [ ] Exibição do texto do prólogo.
        *   [ ] Botão "INICIAR JOGO" funcional (HTML ou p5.js).
    *   [ ] **Tela de Game Over (`GAME_OVER`):**
        *   [ ] Jogo pausa corretamente quando HP do jogador chega a zero.
        *   [ ] Overlay HTML exibido com pontuação final.
        *   [ ] Botão "REINICIAR" funcional no overlay, reiniciando o jogo corretamente.
    *   [ ] **Refinamento da Interface do Usuário (UI/UX):**
        *   [ ] HUD finalizado e bem posicionado.
        *   [ ] Controles responsivos e intuitivos em mobile.
    *   [ ] **Testes Gerais e Balanceamento Inicial:**
        *   [ ] Testes em navegadores desktop e mobile (simuladores/dispositivos).
        *   [ ] Ajustes iniciais de dificuldade, taxas de spawn, stats de jogador/inimigos.
        *   [ ] Correção de bugs identificados.

### Fase 5: Preparação para Deploy e Publicação
*   **Objetivo Principal:** Garantir que o jogo esteja tecnicamente pronto para ser publicado na Vercel e realizar o deploy.
*   **Estimativa de Tempo (Simbólica):** Sprint 5 (ex: alguns dias)
*   **Principais Entregáveis/Marcos:**
    *   [ ] Revisão final do código (legibilidade, modularidade, comentários onde necessário).
    *   [ ] Verificação de todos os caminhos de assets para deploy.
    *   [ ] Teste final completo do protótipo funcional.
    *   [ ] Criação de um `README.md` básico para o projeto.
    *   [ ] **Deploy do jogo na Vercel realizado com sucesso.**
    *   [ ] Jogo acessível publicamente através da URL da Vercel.

## 3. Próximos Passos (Pós-MVP)

Após a conclusão bem-sucedida deste roadmap e a entrega do protótipo MVP, futuras iterações podem incluir:
*   Adição de efeitos sonoros e música.
*   Mais tipos de inimigos e power-ups.
*   Chefes de fase.
*   Sistema de progressão mais elaborado (ondas, níveis de dificuldade).
*   Melhorias visuais e animações.
*   Otimizações de desempenho avançadas.
*   Tabelas de recordes (leaderboards). 