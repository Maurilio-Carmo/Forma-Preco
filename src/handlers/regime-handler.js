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
  
  // IDs dos selects que devem ser desabilitados no Simples Nacional
  const selectsParaDesabilitar = [
    'tributacao',
    'impFederal'
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
          // Oculta a linha completa
          linha.style.display = 'none';
          
          // Limpa o valor do campo
          if (input) {
            input.value = '';
          }
          
          // Atualiza os valores calculados relacionados
          const valorId = `valor${campoId.charAt(0).toUpperCase() + campoId.slice(1)}`;
          const valorElement = document.getElementById(valorId);
          if (valorElement) {
            valorElement.textContent = 'R$ 0,00';
          }
        } else {
          // Mostra a linha novamente
          linha.style.display = 'flex';
        }
      }
    });
    
    // Desabilita/habilita selects de impostos
    selectsParaDesabilitar.forEach(selectId => {
      const select = document.getElementById(selectId);
      
      if (select) {
        if (isSimplesNacional) {
          // Desabilita o select
          select.disabled = true;
          // Opcional: reseta para valor padrão
          select.value = '';
        } else {
          // Habilita o select novamente
          select.disabled = false;
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
  // Clone e substitui para remover todos os listeners
  const newRegimeSelect = regimeSelect.cloneNode(true);
  regimeSelect.parentNode.replaceChild(newRegimeSelect, regimeSelect);
}