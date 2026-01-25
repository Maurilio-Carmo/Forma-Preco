// handlers/regime-handler.js

/**
 * Gerencia a visibilidade dos campos baseado no regime tributário selecionado
 * @param {Function} recalculateCallback - Função de callback para recalcular após mudanças
 */
export function setupRegimeVisibilityHandler(recalculateCallback) {
  const regimeSelect = document.getElementById('regime');
  
  // IDs dos campos que devem ser ocultados no Simples Nacional
  const camposParaOcultar = [
    'creditoPisCofins',
    'creditoICMS',
    'reducaoBCICMS',
    'vendaPisCofins',
    'vendaICMS',
    'reducaoBCSaida'
  ];
  
  // IDs dos campos que devem ser mostrados APENAS no Simples Nacional
  const camposApenasSimples = [
    'simplesAPagar'
  ];
  
  // IDs dos result-items que devem ser ocultados no Simples Nacional
  const resultItemsParaOcultar = [
    'pisCofinsPagarDetalhe',
    'icmsPagarDetalhe'
  ];
  
  // IDs dos result-items que devem ser mostrados no Simples Nacional
  const resultItemsApenasSimples = [
    'simplesPagarDetalhe'
  ];
  
  // IDs dos selects que devem ser desabilitados no Simples Nacional
  const selectsParaDesabilitar = [
    'tributacao',
    'impFederal'
  ];
  
  // Containers que devem ser ocultados no Simples
  const containersParaOcultar = [
    { id: 'tributacao', tipo: 'select-container' },
    { id: 'impFederal', tipo: 'select-container' }
  ];
  
  // Container que deve ser mostrado apenas no Simples
  const containersApenasSimples = [
    { id: 'faixaSimples', tipo: 'select-container' }
  ];
  
  /**
   * Atualiza a visibilidade dos campos baseado no regime
   */
  function atualizarVisibilidadeCampos() {
    const regime = regimeSelect.value;
    const isSimplesNacional = regime === 'Simples';
    
    // Oculta/mostra campos de tributos
    camposParaOcultar.forEach(campoId => {
      const input = document.getElementById(campoId);
      const linha = input?.closest('.linha');
      
      if (linha) {
        if (isSimplesNacional) {
          // Adiciona classe para ocultar
          linha.classList.add('hidden-regime');
          if (input) input.value = '';
          
          const valorId = `valor${campoId.charAt(0).toUpperCase() + campoId.slice(1)}`;
          const valorElement = document.getElementById(valorId);
          if (valorElement) valorElement.textContent = 'R$ 0,00';
        } else {
          // Remove classe para mostrar novamente
          linha.classList.remove('hidden-regime');
        }
      }
    });
    
    // Mostra campos apenas para Simples Nacional
    camposApenasSimples.forEach(campoId => {
      const input = document.getElementById(campoId);
      const linha = input?.closest('.linha');
      
      if (linha) {
        if (isSimplesNacional) {
          linha.classList.remove('hidden-regime');
        } else {
          linha.classList.add('hidden-regime');
          if (input) input.value = '';
          
          const valorId = `valor${campoId.charAt(0).toUpperCase() + campoId.slice(1)}`;
          const valorElement = document.getElementById(valorId);
          if (valorElement) valorElement.textContent = 'R$ 0,00';
        }
      }
    });
    
    // Gerencia containers dos selects principais
    containersParaOcultar.forEach(({ id }) => {
      const select = document.getElementById(id);
      const container = select?.parentElement;
      
      if (container) {
        if (isSimplesNacional) {
          container.style.display = 'none';
          if (select) {
            select.disabled = true;
            select.value = '';
          }
        } else {
          container.style.display = 'flex';
          if (select) select.disabled = false;
        }
      }
    });
    
    // Gerencia container da faixa do Simples
    containersApenasSimples.forEach(({ id }) => {
      const select = document.getElementById(id);
      const container = select?.parentElement;
      
      if (container) {
        if (isSimplesNacional) {
          container.style.display = 'flex';
        } else {
          container.style.display = 'none';
          if (select) select.value = '';
        }
      }
    });
    
    // Oculta/mostra result-items nos resultados
    resultItemsParaOcultar.forEach(itemId => {
      const elemento = document.getElementById(itemId);
      const resultItem = elemento?.closest('.result-item');
      
      if (resultItem) {
        if (isSimplesNacional) {
          // Adiciona classe para ocultar
          resultItem.classList.add('hidden-regime');
          
          // Limpa o valor
          if (elemento) {
            elemento.textContent = 'R$ 0,00';
          }
        } else {
          // Remove classe para mostrar novamente
          resultItem.classList.remove('hidden-regime');
        }
      }
    });
    
    // Mostra result-items apenas para Simples Nacional
    resultItemsApenasSimples.forEach(itemId => {
      const elemento = document.getElementById(itemId);
      const resultItem = elemento?.closest('.result-item');
      
      if (resultItem) {
        if (isSimplesNacional) {
          resultItem.classList.remove('hidden-regime');
        } else {
          resultItem.classList.add('hidden-regime');
          if (elemento) elemento.textContent = 'R$ 0,00';
        }
      }
    });
    
    // Recalcula os valores após ocultar/mostrar campos
    if (recalculateCallback && typeof recalculateCallback === 'function') {
      recalculateCallback();
    }
  }
  
  // Adiciona listener para mudanças no regime
  regimeSelect.addEventListener('change', atualizarVisibilidadeCampos);
  
  // Executa uma vez na inicialização para aplicar o estado correto
  atualizarVisibilidadeCampos();
}

/**
 * Remove os listeners do regime (útil para limpeza)
 */
export function cleanupRegimeVisibilityHandler() {
  const regimeSelect = document.getElementById('regime');
  const newRegimeSelect = regimeSelect.cloneNode(true);
  regimeSelect.parentNode.replaceChild(newRegimeSelect, regimeSelect);
}