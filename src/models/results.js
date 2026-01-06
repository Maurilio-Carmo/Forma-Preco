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
  percReducaoICMSSaida
) {
  const carga = toPercent(margemDesejada)
              + toPercent(percVendaPisCofins)
              + (toPercent(percVendaICMS) * (1 - toPercent(percReducaoICMSSaida)));
  
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
 * Calcula o lucro bruto
 */
export function calcLucroBruto(precoVenda, cmv, vPisCofinsVenda, vICMSVenda) {
  return precoVenda - (cmv + vPisCofinsVenda + vICMSVenda);
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