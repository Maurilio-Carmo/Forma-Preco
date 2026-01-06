// models/tax-input.js

import { toPercent } from '../utils/formatters.js';

/**
 * Calcula crédito de PIS/COFINS na entrada
 */
export function calcCreditoPisCofins(precoCompra, percPisCofins, vCreditoICMS) {
  return toPercent(percPisCofins) * (precoCompra - vCreditoICMS);
}

/**
 * Calcula crédito de ICMS na entrada
 */
export function calcCreditoICMS(precoCompra, percICMS, percReducaoICMS, percICMSST) {
  if (percICMSST > 0) return 0;
  return precoCompra * (toPercent(percICMS) * (1 - toPercent(percReducaoICMS)));
}

/**
 * Calcula ICMS ST
 */
export function calcICMSST(precoCompra, percICMSST, percReducaoST) {
  return precoCompra * (toPercent(percICMSST) * (1 - toPercent(percReducaoST)));
}

/**
 * Calcula IPI
 */
export function calcIPI(precoCompra, percIPI) {
  return precoCompra * toPercent(percIPI);
}

/**
 * Calcula CMV (Custo da Mercadoria Vendida)
 */
export function calcCMV(precoCompra, vCreditoPisCofins, vCreditoICMS, vST, vIPI) {
  return precoCompra - (vCreditoPisCofins + vCreditoICMS) + (vST + vIPI);
}