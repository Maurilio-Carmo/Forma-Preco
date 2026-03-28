// models/results.js

import { toPercent } from '../utils/formatters.js';

/**
 * Calcula o preço de venda
 * @param {number} cmv
 * @param {number} margemDesejada
 * @param {number} percVendaPisCofins
 * @param {number} percVendaICMS
 * @param {number} percReducaoICMSSaida
 * @param {number} percSimples
 * @param {number} percCBS
 * @param {number} percReducaoCBS
 * @param {number} percIBSUF
 * @param {number} percReducaoIBSUF
 * @param {number} percIBSMun
 * @returns {number} Preço de venda, ou Infinity se carga >= 100%
 */
export function calcPrecoVenda(
  cmv,
  margemDesejada,
  percVendaPisCofins,
  percVendaICMS,
  percReducaoICMSSaida,
  percSimples,
  percCBS,
  percReducaoCBS,
  percIBSUF,
  percReducaoIBSUF,
  percIBSMun
) {
  const carga = toPercent(margemDesejada)
              + toPercent(percVendaPisCofins)
              + (toPercent(percVendaICMS) * (1 - toPercent(percReducaoICMSSaida)))
              + toPercent(percSimples)
              + (toPercent(percCBS) * (1 - toPercent(percReducaoCBS)))
              + (toPercent(percIBSUF) * (1 - toPercent(percReducaoIBSUF)))
              + toPercent(percIBSMun);

  if (carga >= 1) {
    return Infinity;
  }

  return cmv / (1 - carga);
}

/**
 * Calcula PIS/COFINS a pagar
 */
export function calcPisCofinsPagar(vPisCofinsVenda, vCreditoPisCofins) {
  return vPisCofinsVenda - vCreditoPisCofins;
}

/**
 * Calcula ICMS a pagar
 */
export function calcICMSPagar(vICMSVenda, vIcmsCredito) {
  return vICMSVenda - vIcmsCredito;
}

/**
 * Calcula Simples Nacional a pagar
 */
export function calcSimplesPagar(vSimplesVenda) {
  return vSimplesVenda;
}

/**
 * Calcula o valor total a pagar ao fornecedor
 */
export function calcFornecedorPagar(precoCompra, vST, vIPI) {
  return precoCompra + vST + vIPI;
}

/**
 * Calcula o lucro bruto
 * @param {number} precoVenda
 * @param {number} cmv
 * @param {number} vPisCofinsVenda
 * @param {number} vICMSVenda
 * @param {number} vSimplesVenda
 * @param {number} vCBSVenda
 * @param {number} vIBSUFVenda
 * @param {number} vIBSMunVenda
 * @returns {number}
 */
export function calcLucroBruto(precoVenda, cmv, vPisCofinsVenda, vICMSVenda, vSimplesVenda, vCBSVenda, vIBSUFVenda, vIBSMunVenda) {
  return precoVenda - (cmv + vPisCofinsVenda + vICMSVenda + vSimplesVenda + vCBSVenda + vIBSUFVenda + vIBSMunVenda);
}

/**
 * Calcula a margem de lucro
 */
export function calcMargem(lucroBruto, precoVenda) {
  if (precoVenda === 0) return 0;
  return (lucroBruto / precoVenda) * 100;
}

/**
 * Calcula o markup
 */
export function calcMarkup(precoVenda, precoCompra) {
  if (precoCompra === 0) return 0;
  return ((precoVenda - precoCompra) / precoCompra) * 100;
}