// controllers/calculation-controller.js

import * as TaxInput from '../models/tax-input.js';
import * as TaxOutput from '../models/tax-output.js';
import * as Results from '../models/results.js';
import { updateUI } from '../views/ui-updater.js';
import { notify } from '../utils/notifications.js';
import { readFormValues } from '../utils/form-reader.js';

/**
 * Retorna objeto com todos os valores zerados (exceto precoCompra) para exibição de erro
 * @param {number} precoCompra
 * @returns {Object}
 */
function getZeroValues(precoCompra) {
  return {
    precoCompra,
    margemDesejada: 0,
    vCreditoPisCofins: 0,
    vCreditoICMS: 0,
    vST: 0,
    vIPI: 0,
    cmv: 0,
    precoVenda: 0,
    vPisCofinsVenda: 0,
    vICMSVenda: 0,
    vSimplesVenda: 0,
    vCBSVenda: 0,
    vIBSUFVenda: 0,
    vIBSMunVenda: 0,
    pisCofinsPagar: 0,
    icmsPagar: 0,
    simplesPagar: 0,
    fornecedorPagar: precoCompra,
    lucroBruto: 0,
    margem: 0,
    markup: 0
  };
}

/**
 * Processa todos os cálculos e atualiza a interface
 */
export function processCalculation() {
  const form = readFormValues();

  const { precoCompra, margemDesejada } = form;
  const { percPisCofins, percICMS, percReducaoICMS, percICMSST, percReducaoICMSST, percIPI } = form.entrada;
  const { percVendaPisCofins, percVendaICMS, percReducaoICMSSaida, percSimples,
          percCBS, percReducaoCBS, percIBSUF, percReducaoIBSUF, percIBSMun } = form.saida;

  // Calcula valores de entrada
  const vCreditoICMS = TaxInput.calcCreditoICMS(precoCompra, percICMS, percReducaoICMS, percICMSST);
  const vCreditoPisCofins = TaxInput.calcCreditoPisCofins(precoCompra, percPisCofins, vCreditoICMS);
  const vST = TaxInput.calcICMSST(precoCompra, percICMSST, percReducaoICMSST);
  const vIPI = TaxInput.calcIPI(precoCompra, percIPI);
  const cmv = TaxInput.calcCMV(precoCompra, vCreditoPisCofins, vCreditoICMS, vST, vIPI);

  // Calcula preço de venda
  const precoVenda = Results.calcPrecoVenda(
    cmv, margemDesejada, percVendaPisCofins, percVendaICMS,
    percReducaoICMSSaida, percSimples,
    percCBS, percReducaoCBS, percIBSUF, percReducaoIBSUF, percIBSMun
  );

  // Valida combinação de margem + tributos
  if (!isFinite(precoVenda) || precoVenda < 0) {
    notify.warning(
      'Carga Tributária Inviável',
      'A soma da margem e tributos ultrapassa 100%. Ajuste os percentuais.'
    );
    updateUI(getZeroValues(precoCompra));
    return;
  }

  // Calcula valores de saída
  const vICMSVenda = TaxOutput.calcICMSVenda(precoVenda, percVendaICMS, percReducaoICMSSaida);
  const vPisCofinsVenda = TaxOutput.calcPisCofinsVenda(precoVenda, percVendaPisCofins, vICMSVenda);
  const vSimplesVenda = TaxOutput.calcSimplesVenda(precoVenda, percSimples);
  const vCBSVenda = TaxOutput.calcCBSVenda(precoVenda, percCBS, percReducaoCBS);
  const vIBSUFVenda = TaxOutput.calcIBSUFVenda(precoVenda, percIBSUF, percReducaoIBSUF);
  const vIBSMunVenda = TaxOutput.calcIBSMunVenda(precoVenda, percIBSMun);

  // Calcula resultados finais
  const pisCofinsPagar = Results.calcPisCofinsPagar(vPisCofinsVenda, vCreditoPisCofins);
  const icmsPagar = Results.calcICMSPagar(vICMSVenda, vCreditoICMS);
  const simplesPagar = Results.calcSimplesPagar(vSimplesVenda);
  const fornecedorPagar = Results.calcFornecedorPagar(precoCompra, vST, vIPI);
  const lucroBruto = Results.calcLucroBruto(
    precoVenda, cmv, vPisCofinsVenda, vICMSVenda, vSimplesVenda, vCBSVenda, vIBSUFVenda, vIBSMunVenda
  );
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
    vSimplesVenda,
    vCBSVenda,
    vIBSUFVenda,
    vIBSMunVenda,
    pisCofinsPagar,
    icmsPagar,
    simplesPagar,
    fornecedorPagar,
    lucroBruto,
    margem,
    markup
  };

  // Atualiza interface
  updateUI(values);

  return values;
}
