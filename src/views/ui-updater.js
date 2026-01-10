// views/ui-updater.js

import { ELEMENTS } from '../config/constants.js';
import { formatCurrency, formatPercent, getCurrentDate } from '../utils/formatters.js';

/**
 * Atualiza todos os elementos da interface com os valores calculados
 */
export function updateUI(values) {
  // Atualiza valores calculados de entrada
  updateElement(ELEMENTS.VALOR_CREDITO_PIS_COFINS, formatCurrency(values.vCreditoPisCofins));
  updateElement(ELEMENTS.VALOR_CREDITO_ICMS, formatCurrency(values.vCreditoICMS));
  updateElement(ELEMENTS.VALOR_ICMS_ST, formatCurrency(values.vST));
  updateElement(ELEMENTS.VALOR_IPI, formatCurrency(values.vIPI));
  
  // Atualiza valores calculados de saída
  updateElement(ELEMENTS.VALOR_VENDA_PIS_COFINS, formatCurrency(values.vPisCofinsVenda));
  updateElement(ELEMENTS.VALOR_VENDA_ICMS, formatCurrency(values.vICMSVenda));
  
  // Atualiza destaques principais
  updateElement(ELEMENTS.PRECO_COMPRA_RESULTADO, formatCurrency(values.precoCompra));
  updateElement(ELEMENTS.PRECO_VENDA_RESULTADO, formatCurrency(values.precoVenda));
  updateElement(ELEMENTS.LUCRO_BRUTO_RESULTADO, formatCurrency(values.lucroBruto));
  
  // Atualiza indicadores secundários
  updateElement(ELEMENTS.MARGEM_RESULTADO, formatPercent(values.margem));
  updateElement(ELEMENTS.CMV_RESULTADO, formatCurrency(values.cmv));
  updateElement(ELEMENTS.MARKUP_RESULTADO, formatPercent(values.markup));
  
  // Atualiza detalhes
  updateInputValue(ELEMENTS.DATA_ATUAL, getCurrentDate());
  updateElement(ELEMENTS.PRECO_VENDA_DETALHE, formatCurrency(values.precoVenda));
  updateElement(ELEMENTS.PIS_COFINS_PAGAR_DETALHE, formatCurrency(values.pisCofinsPagar));
  updateElement(ELEMENTS.ICMS_PAGAR_DETALHE, formatCurrency(values.icmsPagar));
  updateElement(ELEMENTS.CBS_PAGAR_DETALHE, formatCurrency(values.vCBSVenda));
  updateElement(ELEMENTS.IBS_UF_DETALHE, formatCurrency(values.vIBSUFVenda));
  updateElement(ELEMENTS.IBS_MUN_DETALHE, formatCurrency(values.vIBSMunVenda));
  updateElement(ELEMENTS.FORNECEDOR_DETALHE, formatCurrency(values.fornecedorPagar));
  updateElement(ELEMENTS.LUCRO_BRUTO_DETALHE, formatCurrency(values.lucroBruto));
}

/**
 * Atualiza o conteúdo de texto de um elemento
 */
function updateElement(elementId, value) {
  const element = document.getElementById(elementId);
  if (element) {
    element.textContent = value;
  }
}

/**
 * Atualiza o valor de um input
 */
function updateInputValue(elementId, value) {
  const element = document.getElementById(elementId);
  if (element) {
    element.value = value;
  }
}