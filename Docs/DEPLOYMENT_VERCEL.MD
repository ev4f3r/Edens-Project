# Deploy na Vercel: Apocalypse AI Shooter

A Vercel é uma plataforma excelente para implantar projetos web estáticos e aplicações Node.js, tornando-a ideal para jogos p5.js.

## 1. Configuração do Projeto para Vercel

Seu projeto p5.js é essencialmente uma coleção de arquivos estáticos (`index.html`, `sketch.js`, outros arquivos `.js`, CSS, assets). A Vercel lida com isso muito bem.

*   **Garantir que todos os caminhos sejam relativos:**
    *   Em `index.html`, links para arquivos CSS, JS (`sketch.js`, `js/player.js`, etc.) devem ser caminhos relativos.
        ```html
        <link rel="stylesheet" href="style.css">
        <script src="libraries/p5.min.js"></script> <!-- Se estiver usando uma cópia local do p5.js -->
        <script src="sketch.js"></script>
        <script src="js/player.js"></script>
        <!-- Outros scripts -->
        ```
    *   Em seu JavaScript (`sketch.js`, etc.), caminhos para assets (imagens, fontes) em `loadImage()` ou `loadFont()` também devem ser relativos.
        ```javascript
        playerImg = loadImage('assets/images/player.png');
        ```
*   **`index.html` como ponto de entrada:** A Vercel detectará automaticamente `index.html` como o arquivo principal a ser servido.

## 2. Passos para o Deploy

Existem duas maneiras principais de fazer deploy para a Vercel:

### A. Usando a Vercel CLI (Interface de Linha de Comando)

1.  **Instalar Node.js e npm/yarn:** Se você não os tiver, baixe de [nodejs.org](https://nodejs.org/).
2.  **Instalar a Vercel CLI:**
    ```bash
    npm install -g vercel
    ```
    ou
    ```bash
    yarn global add vercel
    ```
3.  **Login na Vercel (se ainda não fez):**
    ```bash
    vercel login
    ```
    (Isso abrirá uma janela do navegador para autenticação).
4.  **Deploy:**
    *   Navegue até o diretório raiz do seu projeto no terminal.
    *   Execute o comando:
        ```bash
        vercel
        ```
    *   A CLI fará algumas perguntas:
        *   **Scope:** Escolha sua conta ou time Vercel.
        *   **Link to existing project?** Responda "N" (Não) para o primeiro deploy.
        *   **What's your project's name?** Sugerirá um nome baseado no seu diretório; você pode mudar.
        *   **In which directory is your code located?** Pressione Enter para o diretório atual (`./`).
        *   Ele deve detectar automaticamente como um site estático ou perguntar pelo framework (selecione "Other" se perguntar).
    *   A Vercel fará o build e deploy do seu projeto. Ela fornecerá uma URL (ex: `seu-projeto.vercel.app`).

### B. Usando Integração Git (Recomendado para deploy contínuo)

1.  **Envie seu projeto para um repositório Git:**
    *   Crie um novo repositório no GitHub, GitLab ou Bitbucket.
    *   Inicialize um repositório Git na pasta do seu projeto:
        ```bash
        git init
        git add .
        git commit -m "Commit inicial do jogo"
        git remote add origin <url-do-seu-repo-git>
        git push -u origin main # ou master
        ```
2.  **Conecte a Vercel ao seu provedor Git:**
    *   Vá para o seu painel Vercel ([vercel.com](https://vercel.com/dashboard)).
    *   Clique em "New Project" (Novo Projeto).
    *   Importe seu repositório Git selecionando seu provedor Git e depois o repositório específico.
3.  **Configure as Configurações do Projeto (geralmente auto-detectadas para sites estáticos):**
    *   **Framework Preset:** A Vercel deve detectar como "Other" ou um deploy estático. Se não, você pode especificar "Other".
    *   **Root Directory:** Deve ser a raiz do seu repositório, a menos que seu `index.html` esteja em um subdiretório (o que não é comum para projetos p5.js simples).
4.  **Deploy:**
    *   Clique em "Deploy".
    *   A Vercel clonará seu repositório, fará o build (desnecessário para arquivos estáticos puros) e fará o deploy.
    *   Você receberá uma URL.
    *   **Vantagem:** Toda vez que você fizer `git push` para sua branch principal, a Vercel fará o deploy automaticamente das mudanças.

## 3. Domínios Customizados

*   Uma vez implantado, você pode adicionar um domínio customizado através do painel da Vercel nas configurações do seu projeto.

## 4. Coisas a Verificar Antes/Depois do Deploy

*   **Todos os Assets Incluídos:** Certifique-se de que todas as imagens, fontes, CSS e arquivos JS estão commitados no seu repositório Git (se usar integração Git) ou estão presentes na pasta (se usar CLI).
*   **Erros de Console:** Abra o console de desenvolvedor do navegador no seu site implantado para verificar quaisquer erros (ex: 404 Not Found para assets, erros de JavaScript).
*   **Teste Mobile:** Acesse a URL implantada em vários dispositivos móveis e navegadores para garantir que funcione como esperado. Controles de toque são particularmente importantes para testar.
*   **HTTPS:** A Vercel fornece HTTPS automaticamente para seus sites implantados.

## 5. `vercel.json` (Configuração Opcional)

Para deploys estáticos simples, você geralmente não precisa de um arquivo `vercel.json`. No entanto, ele pode ser usado para configurações mais avançadas como redirecionamentos, cabeçalhos, etc. Para este projeto, provavelmente não será necessário inicialmente.

Exemplo básico de `vercel.json` se você quisesse declarar explicitamente que é estático (embora a Vercel seja boa em detectar isso):
```json
{
  "version": 2,
  "builds": [
    { "src": "*.*", "use": "@vercel/static" }
  ],
  "routes": [
    { "src": "/(.*)", "dest": "/$1" }
  ]
}
```
Coloque este arquivo na raiz do seu projeto. Mas, novamente, tente implantar sem ele primeiro.

Com isso, seu jogo p5.js estará online e acessível! 