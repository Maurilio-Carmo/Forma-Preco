// handlers/tax-handlers.js

import { ELEMENTS, REGIMES } from '../config/constants.js';
import { formatInputValue } from '../utils/formatters.js';

/**
 * Atualiza campos de PIS/COFINS baseado no regime e imposto federal
 */
export function updatePisCofins(impostosFederaisData, onComplete) {
  const regime = document.getElementById(ELEMENTS.REGIME).value;
  const impFederal = document.getElementById(ELEMENTS.IMP_FEDERAL).value;
  
  let entrada = 0;
  let saida = 0;
  
  if (regime && impFederal) {
    const item = impostosFederaisData.find(i => i.imposto_federal === impFederal);
    
    if (item) {
      switch (regime) {
        case REGIMES.REAL:
          entrada = item.aliq_entrada_real ?? 0;
          saida = item.aliq_saida_real ?? 0;
          break;
        case REGIMES.PRESUMIDO:
          entrada = item.aliq_entrada_presumido ?? 0;
          saida = item.aliq_saida_presumido ?? 0;
          break;
        case REGIMES.SIMPLES:
          entrada = item.aliq_entrada_simples ?? 0;
          saida = item.aliq_saida_simples ?? 0;
          break;
      }
    }
  }
  
  document.getElementById(ELEMENTS.CREDITO_PIS_COFINS).value = formatInputValue(entrada);
  document.getElementById(ELEMENTS.VENDA_PIS_COFINS).value = formatInputValue(saida);
  
  if (onComplete) onComplete();
}

/**
 * Atualiza campos de ICMS baseado na tributação selecionada
 */
export function updateICMS(tributacaoData, onComplete) {
  const tributacao = document.getElementById(ELEMENTS.TRIBUTACAO).value;
  
  let aliquota = 0;
  let reducao = 0;
  
  if (tributacao) {
    const item = tributacaoData.find(x => x.tributacao === tributacao);
    
    if (item) {
      aliquota = item.aliquota ?? 0;
      reducao = item.reducao ?? 0;
    }
  }
  
  document.getElementById(ELEMENTS.CREDITO_ICMS).value = formatInputValue(aliquota);
  document.getElementById(ELEMENTS.REDUCAO_BC_ICMS).value = formatInputValue(reducao);
  document.getElementById(ELEMENTS.VENDA_ICMS).value = formatInputValue(aliquota);
  document.getElementById(ELEMENTS.REDUCAO_BC_SAIDA).value = formatInputValue(reducao);
  
  if (onComplete) onComplete();
}

/**
 * Atualiza campos de alíquotas do Simples Nacional baseado na faixa selecionada
 */
export function updateSimplesNacional(faixasSimplesNacionalData, onComplete) {
  const faixaSimples = document.getElementById(ELEMENTS.FAIXA_SIMPLES).value;

  let aliquota = 0;

  if (faixaSimples) {
    const item = faixasSimplesNacionalData.find(x => x.faixa === faixaSimples);

    if (item) {
      aliquota = item.aliquota ?? 0;
    }
  }

  document.getElementById(ELEMENTS.SIMPLES_A_PAGAR).value = formatInputValue(aliquota);

  if (onComplete) onComplete();
}