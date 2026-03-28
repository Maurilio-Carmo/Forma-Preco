// utils/form-reader.js

import { ELEMENTS } from '../config/constants.js';
import { toNumber } from './formatters.js';

/**
 * Lê todos os valores do formulário e retorna objeto estruturado
 * @returns {{ precoCompra: number, margemDesejada: number, entrada: Object, saida: Object }}
 */
export function readFormValues() {
  const get = (id) => toNumber(document.getElementById(id)?.value);

  return {
    precoCompra: get(ELEMENTS.PRECO_COMPRA),
    margemDesejada: get(ELEMENTS.MARGEM_DESEJADA),
    entrada: {
      percPisCofins:    get(ELEMENTS.CREDITO_PIS_COFINS),
      percICMS:         get(ELEMENTS.CREDITO_ICMS),
      percReducaoICMS:  get(ELEMENTS.REDUCAO_BC_ICMS),
      percICMSST:       get(ELEMENTS.ICMS_ST),
      percReducaoICMSST:get(ELEMENTS.REDUCAO_BC_ST),
      percIPI:          get(ELEMENTS.IPI),
    },
    saida: {
      percVendaPisCofins:    get(ELEMENTS.VENDA_PIS_COFINS),
      percVendaICMS:         get(ELEMENTS.VENDA_ICMS),
      percReducaoICMSSaida:  get(ELEMENTS.REDUCAO_BC_SAIDA),
      percSimples:           get(ELEMENTS.ALIQUOTA_SIMPLES_NACIONAL),
      percCBS:               get(ELEMENTS.ALIQUOTA_CBS),
      percReducaoCBS:        get(ELEMENTS.ALIQUOTA_REDUCAO_CBS),
      percIBSUF:             get(ELEMENTS.ALIQUOTA_IBS_UF),
      percReducaoIBSUF:      get(ELEMENTS.ALIQUOTA_REDUCAO_IBS_UF),
      percIBSMun:            get(ELEMENTS.IBS_MUN),
    }
  };
}
