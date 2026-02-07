// config/constants.js

export const ELEMENTS = {
  // Inputs principais
  REGIME: 'regime',
  TRIBUTACAO: 'tributacao',
  IMP_FEDERAL: 'impFederal',
  FAIXA_SIMPLES: 'faixaSimples',
  PRECO_COMPRA: 'precoCompra',
  MARGEM_DESEJADA: 'margemDesejada',
  
  // Tributos de entrada
  CREDITO_PIS_COFINS: 'creditoPisCofins',
  CREDITO_ICMS: 'creditoICMS',
  REDUCAO_BC_ICMS: 'reducaoBCICMS',
  ICMS_ST: 'ICMSST',
  REDUCAO_BC_ST: 'reducaoBCST',
  IPI: 'IPI',
  
  // Tributos de saída
  VENDA_PIS_COFINS: 'vendaPisCofins',
  VENDA_ICMS: 'vendaICMS',
  REDUCAO_BC_SAIDA: 'reducaoBCSaida',
  ALIQUOTA_SIMPLES_NACIONAL: 'aliquotaSimplesNacional',
  ALIQUOTA_CBS: 'aliquotaCBS',
  ALIQUOTA_REDUCAO_CBS: 'aliquotaReducaoCBS',
  ALIQUOTA_IBS_UF: 'aliquotaIBSUF',
  ALIQUOTA_REDUCAO_IBS_UF: 'aliquotaReducaoIBSUF',
  IBS_MUN: 'IBSmun',
  
  // Valores calculados de entrada
  VALOR_CREDITO_PIS_COFINS: 'valorCreditoPisCofins',
  VALOR_CREDITO_ICMS: 'valorCreditoICMS',
  VALOR_ICMS_ST: 'valorICMSST',
  VALOR_IPI: 'valorIPI',
  
  // Valores calculados de saída
  VALOR_VENDA_PIS_COFINS: 'valorVendaPisCofins',
  VALOR_VENDA_ICMS: 'valorVendaICMS',
  VALOR_SIMPLES_A_PAGAR: 'valorSimplesAPagar',
  
  // Resultados principais
  PRECO_COMPRA_RESULTADO: 'precoCompraResultado',
  PRECO_VENDA_RESULTADO: 'precoVendaResultado',
  LUCRO_BRUTO_RESULTADO: 'lucroBrutoResultado',
  MARGEM_RESULTADO: 'margemResultado',
  CMV_RESULTADO: 'cmvResultado',
  MARKUP_RESULTADO: 'markupResultado',
  
  // Detalhes
  DATA_ATUAL: 'dataAtual',
  PRECO_VENDA_DETALHE: 'precoVendaDetalhe',
  PIS_COFINS_PAGAR_DETALHE: 'pisCofinsPagarDetalhe',
  ICMS_PAGAR_DETALHE: 'icmsPagarDetalhe',
  SIMPLES_PAGAR_DETALHE: 'simplesPagarDetalhe',
  CBS_PAGAR_DETALHE: 'cbsPagarDetalhe',
  IBS_UF_DETALHE: 'ibsUFDetalhe',
  IBS_MUN_DETALHE: 'ibsMunDetalhe',
  FORNECEDOR_DETALHE: 'fornecedorDetalhe',
  LUCRO_BRUTO_DETALHE: 'lucroBrutoDetalhe',
  
  // Tema
  TOGGLE_THEME: 'toggleTheme',
  THEME_ICON: 'themeIcon'
};

export const PATHS = {
  TRIBUTACOES: './data/tributacoes.json',
  IMPOSTOS_FEDERAIS: './data/impostos_federais.json',
  FAIXAS_SIMPLES_NACIONAL: './data/faixas_simples_nacional.json',
  ICON_MOON: 'icons/lua.svg',
  ICON_SUN: 'icons/sol.svg'
};

export const REGIMES = {
  REAL: 'Real',
  PRESUMIDO: 'Presumido',
  SIMPLES: 'Simples'
};

export const STORAGE_KEYS = {
  THEME: 'theme',
  PERFIL: 'perfil_loja'
};

export const THEMES = {
  DARK: 'dark',
  LIGHT: 'light'
};