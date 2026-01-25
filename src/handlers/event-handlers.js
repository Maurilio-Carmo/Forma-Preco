// handlers/event-handlers.js

import { ELEMENTS } from '../config/constants.js';
import { updatePisCofins, updateICMS, updateSimplesNacional} from './tax-handlers.js';

/**
 * Configura listeners para cálculos em tempo real
 */
export function setupCalculationListeners(processCalculation) {
  document.querySelectorAll('input, select').forEach(field => {
    field.addEventListener('input', processCalculation);
    field.addEventListener('change', processCalculation);
  });
}

/**
 * Configura listeners para atualização de impostos
 */
export function setupTaxUpdateListeners(tributacaoData, impostosFederaisData, faixasSimplesNacionalData, processCalculation) {
  // Listener para regime e imposto federal
  document.getElementById(ELEMENTS.REGIME)
    .addEventListener('change', () => {
      updatePisCofins(impostosFederaisData, processCalculation);
    });
  
  document.getElementById(ELEMENTS.IMP_FEDERAL)
    .addEventListener('change', () => {
      updatePisCofins(impostosFederaisData, processCalculation);
    });
  
  // Listener para tributação
  document.getElementById(ELEMENTS.TRIBUTACAO)
    .addEventListener('change', () => {
      updateICMS(tributacaoData, processCalculation);
    });

  // Listener para faixa do Simples Nacional
  document.getElementById(ELEMENTS.FAIXA_SIMPLES)
    .addEventListener('change', () => {
      updateSimplesNacional(faixasSimplesNacionalData, processCalculation);
    });
}