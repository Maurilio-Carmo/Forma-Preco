// views/tooltip-handler.js

/**
 * Definições dos tooltips
 */
const TOOLTIP_CONTENT = {
  margem: {
    title: 'O que é Margem?',
    description: 'A margem de lucro indica o percentual de lucro em relação ao preço de venda. É calculada dividindo o lucro bruto pelo preço de venda e multiplicando por 100. Exemplo: Se você vende por R$ 100 e tem R$ 30 de lucro, sua margem é de 30%.'
  },
  cmv: {
    title: 'O que é CMV?',
    description: 'CMV (Custo de Mercadoria Vendida) é o custo efetivo do produto após aplicar os créditos tributários e adicionar os impostos sobre a compra. Representa quanto você realmente gastou para ter o produto disponível para venda.'
  },
  markup: {
    title: 'O que é Mark UP?',
    description: 'Índice aplicado sobre o custo de um produto ou serviço para a formação do preço de venda. É calculado dividindo o preço de venda pelo preço de compra e subtraindo 1, depois multiplicando por 100. Exemplo: Se compra por R$ 100 e vende por R$ 150, o markup é de 50%.'
  }
};

/**
 * Inicializa os tooltips
 */
export function initializeTooltips() {
  const modal = document.getElementById('tooltipModal');
  const titleElement = document.getElementById('tooltipTitle');
  const descriptionElement = document.getElementById('tooltipDescription');
  const closeButton = document.querySelector('.tooltip-close');
  
  // Adiciona listeners às caixas de tooltip
  document.querySelectorAll('.tooltip-trigger').forEach(element => {
    element.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      
      const tooltipType = element.getAttribute('data-tooltip');
      const content = TOOLTIP_CONTENT[tooltipType];
      
      if (content) {
        titleElement.textContent = content.title;
        descriptionElement.textContent = content.description;
        modal.classList.add('active');
      }
    });
  });
  
  // Fecha ao clicar no botão de fechar
  closeButton.addEventListener('click', () => {
    modal.classList.remove('active');
  });
  
  // Fecha ao clicar fora do conteúdo
  modal.addEventListener('click', (e) => {
    if (e.target === modal) {
      modal.classList.remove('active');
    }
  });
  
  // Fecha com a tecla ESC
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.classList.contains('active')) {
      modal.classList.remove('active');
    }
  });
}

/**
 * Adiciona um novo tooltip dinamicamente
 */
export function addTooltip(key, title, description) {
  TOOLTIP_CONTENT[key] = { title, description };
}