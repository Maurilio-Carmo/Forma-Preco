// models/results.js

import { toPercent } from '../utils/formatters.js';

/**
 * Calcula o preço de venda
 */
export function calcPrecoVenda(
  cmv, 
  margemDesejada, 
  percVendaPisCofins, 
  percVendaICMS, 
  percReducaoICMSSaida,
  percSimples
) {
  const carga = toPercent(margemDesejada)
              + toPercent(percVendaPisCofins)
              + (toPercent(percVendaICMS) 
              * (1 - toPercent(percReducaoICMSSaida)))
              + toPercent(percSimples);
  
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
 */
export function calcLucroBruto(precoVenda, cmv, vPisCofinsVenda, vICMSVenda, vSimplesVenda) {
  return precoVenda - (cmv + vPisCofinsVenda + vICMSVenda + vSimplesVenda);
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