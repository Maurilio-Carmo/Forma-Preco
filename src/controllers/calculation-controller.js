// controllers/calculation-controller.js

import { ELEMENTS } from '../config/constants.js';
import { toNumber } from '../utils/formatters.js';
import * as TaxInput from '../models/tax-input.js';
import * as TaxOutput from '../models/tax-output.js';
import * as Results from '../models/results.js';
import { updateUI } from '../views/ui-updater.js';

/**
 * Processa todos os cálculos e atualiza a interface
 */
export function processCalculation() {
  // Coleta valores de entrada principais
  const precoCompra = toNumber(document.getElementById(ELEMENTS.PRECO_COMPRA).value);
  const margemDesejada = toNumber(document.getElementById(ELEMENTS.MARGEM_DESEJADA).value);
  
  // Coleta percentuais de entrada
  const percPisCofins = toNumber(document.getElementById(ELEMENTS.CREDITO_PIS_COFINS).value);
  const percICMS = toNumber(document.getElementById(ELEMENTS.CREDITO_ICMS).value);
  const percReducaoICMS = toNumber(document.getElementById(ELEMENTS.REDUCAO_BC_ICMS).value);
  const percICMSST = toNumber(document.getElementById(ELEMENTS.ICMS_ST).value);
  const percReducaoICMSST = toNumber(document.getElementById(ELEMENTS.REDUCAO_BC_ST).value);
  const percIPI = toNumber(document.getElementById(ELEMENTS.IPI).value);
  
  // Calcula valores de entrada
  const vCreditoICMS = TaxInput.calcCreditoICMS(precoCompra, percICMS, percReducaoICMS, percICMSST);
  const vCreditoPisCofins = TaxInput.calcCreditoPisCofins(precoCompra, percPisCofins, vCreditoICMS);
  const vST = TaxInput.calcICMSST(precoCompra, percICMSST, percReducaoICMSST);
  const vIPI = TaxInput.calcIPI(precoCompra, percIPI);
  const cmv = TaxInput.calcCMV(precoCompra, vCreditoPisCofins, vCreditoICMS, vST, vIPI);
  
  // Coleta percentuais de saída
  const percVendaPisCofins = toNumber(document.getElementById(ELEMENTS.VENDA_PIS_COFINS).value);
  const percVendaICMS = toNumber(document.getElementById(ELEMENTS.VENDA_ICMS).value);
  const percReducaoICMSSaida = toNumber(document.getElementById(ELEMENTS.REDUCAO_BC_SAIDA).value);
  const percCBS = toNumber(document.getElementById(ELEMENTS.ALIQUOTA_CBS).value);
  const percReducaoCBS = toNumber(document.getElementById(ELEMENTS.ALIQUOTA_REDUCAO_CBS).value);
  const percIBSUF = toNumber(document.getElementById(ELEMENTS.ALIQUOTA_IBS_UF).value);
  const percReducaoIBSUF = toNumber(document.getElementById(ELEMENTS.ALIQUOTA_REDUCAO_IBS_UF).value);
  const percIBSMun = toNumber(document.getElementById(ELEMENTS.IBS_MUN).value);
  
  // Calcula preço de venda
  const precoVenda = Results.calcPrecoVenda(
    cmv,
    margemDesejada,
    percVendaPisCofins,
    percVendaICMS,
    percReducaoICMSSaida
  );
  
  // Calcula valores de saída
  const vICMSVenda = TaxOutput.calcICMSVenda(precoVenda, percVendaICMS, percReducaoICMSSaida);
  const vPisCofinsVenda = TaxOutput.calcPisCofinsVenda(precoVenda, percVendaPisCofins, vICMSVenda);
  const vCBSVenda = TaxOutput.calcCBSVenda(precoVenda, percCBS, percReducaoCBS);
  const vIBSUFVenda = TaxOutput.calcIBSUFVenda(precoVenda, percIBSUF, percReducaoIBSUF);
  const vIBSMunVenda = TaxOutput.calcIBSMunVenda(precoVenda, percIBSMun);
  
  // Calcula resultados finais
  const pisCofinsPagar = Results.calcPisCofinsPagar(vPisCofinsVenda, vCreditoPisCofins);
  const icmsPagar = Results.calcICMSPagar(vICMSVenda, vCreditoICMS);
  const lucroBruto = Results.calcLucroBruto(precoVenda, cmv, vPisCofinsVenda, vICMSVenda);
  const margem = Results.calcMargem(lucroBruto, precoVenda);
  const markup = Results.calcMarkup(precoVenda, precoCompra);
  
  // Monta objeto com todos os valores
  const values = {
    precoCompra,
    margemDesejada,
    vCreditoPisCofins,
    vCreditoICMS,
    vST,
    vIPI,
    cmv,
    precoVenda,
    vPisCofinsVenda,
    vICMSVenda,
    vCBSVenda,
    vIBSUFVenda,
    vIBSMunVenda,
    pisCofinsPagar,
    icmsPagar,
    lucroBruto,
    margem,
    markup
  };
  
  // Atualiza interface
  updateUI(values);
  
  return values;
}