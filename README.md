# ACCO Caixas - Engenharia em Fachadas



<p align="center">
  <img src="https://img.shields.io/badge/HTML5-E34F26?style=for-the-badge&logo=html5&logoColor=white" alt="HTML5" />
  <img src="https://img.shields.io/badge/CSS3-1572B6?style=for-the-badge&logo=css3&logoColor=white" alt="CSS3" />
  <img src="https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black" alt="JavaScript" />
  <img src="https://img.shields.io/badge/Three.js-000000?style=for-the-badge&logo=threedotjs&logoColor=white" alt="Three.js" />
  <img src="https://img.shields.io/badge/GSAP-88CE02?style=for-the-badge&logo=greensock&logoColor=white" alt="GSAP" />
  <img src="https://img.shields.io/badge/Swiper-6332F6?style=for-the-badge&logo=swiper&logoColor=white" alt="Swiper" />
</p>

Landing Page premium e imersiva para a **Acco Caixas**, especializada em soluções em alumínio para proteção de aparelhos de ar-condicionado em fachadas prediais.

## 🌟 Destaques do Projeto

*   **Visualizador 3D Interativo**: Uma experiência Apple-like permitindo que o usuário interaja com o produto em 3D realista (gire, aplique zoom) e personalize com cores pré-definidas (Branco, Bege, Cinza, Terracota, Bronze, Preto). A iluminação do modelo se ajusta de forma inteligente de acordo com o brilho/tom da cor selecionada.
*   **Animações e Scroll Suave**: Integrações fluídas revelando as seções da página, com um carrossel infinito 3D (Coverflow) detalhando o público-alvo (Construtoras, Engenheiros, Arquitetos, Moradores, etc).
*   **Design Minimalista e Profissional**: Esquema de cores sofisticado (Escuro / Cinza) substituindo um estilo datado, oferecendo apelo de alto padrão.

## 🛠️ Tecnologias Utilizadas

*   **[Three.js](https://threejs.org/)**: Renderização do modelo tridimensional de alumínio em tempo real no navegador web e ajuste dinâmico da iluminação (HDR/Soft lights baseados na cor).
*   **[GSAP (GreenSock)](https://gsap.com/)**: Motor principal de animação, interpolando as transições de cores no 3D, propriedades emissivas e toda a orquestração do scroll reveal.
*   **[ScrollTrigger (GSAP)](https://gsap.com/docs/v3/Plugins/ScrollTrigger/)**: Animação de background faders, contadores estatísticos e fade-ins coordenados com a rolagem do usuário.
*   **[Lenis](https://lenis.studiofreight.com/)**: Biblioteca de scroll suave que transforma a roda do mouse em uma experiência absurdamente fluída.
*   **[Swiper.js](https://swiperjs.com/)**: Motor por trás do carrossel "infinito" de Público Alvo utilizando o efeito 3D Coverflow.
*   **HTML5 & Vanilla CSS3**: Base semântica, responsividade nativa, CSS custom properties e filtros sofisticados de imagem (grayscale / drop effects).
*   **Vanilla JavaScript (ES6)**: Scripts otimizados controlando o DOM, lógicas modulares, loaders rápidos e interações customizadas.

## 📁 Estrutura de Arquivos Principais

*   `index.html`: A Landing page principal do produto (Hero, 3D, História, Comparações).
*   `viewer.html`: O visualizador 3D dedicado em modo Fullscreen.
*   `styles.css`: Todos os estilos e ajustes responsivos, variáveis (design system minimalista).
*   `animations.js`: Configurações globais do GSAP, Swiper e Lenis Scroll.
*   `viewer3d.js` e `model3d.js`: Configuração minuciosa do carregador 3D (OBJLoader), câmera, luz dinâmicas e o material físicamente correto (PBR).

## 🚀 Como Visualizar
Você pode abrir o arquivo `index.html` via **Live Server** numa IDE, ou rodar rapidamente no terminal usando Node:
```bash
npx http-server . -p 8080
```
Acesse `http://127.0.0.1:8080`, aproveite a simulação 3D instantânea e confira as funcionalidades em sua totalidade.
