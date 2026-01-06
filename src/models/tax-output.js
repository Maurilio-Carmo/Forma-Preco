// models/tax-output.js

import { toPercent } from '../utils/formatters.js';

/**
 * Calcula PIS/COFINS na venda
 */
export function calcPisCofinsVenda(precoVenda, percVendaPisCofins, vICMSVenda) {
  return toPercent(percVendaPisCofins) * (precoVenda - vICMSVenda);
}

/**
 * Calcula ICMS na venda
 */
export function calcICMSVenda(precoVenda, percVendaICMS, percReducaoICMSSaida) {
  return precoVenda * (toPercent(percVendaICMS) * (1 - toPercent(percReducaoICMSSaida)));
}

/**
 * Calcula CBS na venda
 */
export function calcCBSVenda(precoVenda, percCBS, percReducaoCBS) {
  return precoVenda * (toPercent(percCBS) * (1 - toPercent(percReducaoCBS)));
}

/**
 * Calcula IBS UF na venda
 */
export function calcIBSUFVenda(precoVenda, percIBSUF, percReducaoIBSUF) {
  return precoVenda * (toPercent(percIBSUF) * (1 - toPercent(percReducaoIBSUF)));
}

/**
 * Calcula IBS Municipal na venda
 */
export function calcIBSMunVenda(precoVenda, percIBSMun) {
  return precoVenda * toPercent(percIBSMun);
}