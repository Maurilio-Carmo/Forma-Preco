// handlers/event-handlers.js

import { ELEMENTS } from '../config/constants.js';
import { updatePisCofins, updateICMS, updateSimplesNacional} from './tax-handlers.js';
import { debounce } from '../utils/debounce.js';

// Selects gerenciados por handlers próprios — excluídos do listener genérico
const MANAGED_SELECTS = new Set([
  ELEMENTS.REGIME,
  ELEMENTS.IMP_FEDERAL,
  ELEMENTS.TRIBUTACAO,
  ELEMENTS.FAIXA_SIMPLES,
]);

export function setupCalculationListeners(processCalculation) {
  const debouncedCalc = debounce(processCalculation, 150);

  document.querySelectorAll('input, select').forEach(field => {
    if (field.tagName === 'SELECT') {
      if (!MANAGED_SELECTS.has(field.id)) {
        field.addEventListener('change', processCalculation);
      }
    } else {
      field.addEventListener('input', debouncedCalc);
    }
  });
}

/**
 * Configura listeners para atualização de impostos
 */
export function setupTaxUpdateListeners(tributacaoData, impostosFederaisData, faixasSimplesNacionalData, processCalculation) {
  document.getElementById(ELEMENTS.REGIME)
    .addEventListener('change', () => {
      updatePisCofins(impostosFederaisData, null);
    });
  
  document.getElementById(ELEMENTS.IMP_FEDERAL)
    .addEventListener('change', () => {
      updatePisCofins(impostosFederaisData, processCalculation);
    });
  
  document.getElementById(ELEMENTS.TRIBUTACAO)
    .addEventListener('change', () => {
      updateICMS(tributacaoData, processCalculation);
    });

  document.getElementById(ELEMENTS.FAIXA_SIMPLES)
    .addEventListener('change', () => {
      updateSimplesNacional(faixasSimplesNacionalData, processCalculation);
    });
}