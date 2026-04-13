# 🧮 Forma Preço — Documentação Técnica

## 📜 Visão Geral

Aplicação web completa para cálculo de preço de venda considerando margem desejada, tributação e custos incidentes. Sistema desenvolvido para garantir precisão fiscal, conformidade tributária e facilitar a formação de preço em diferentes regimes (Lucro Real, Presumido e Simples Nacional).

**Características principais:**
* Cálculos tributários precisos com créditos de PIS/COFINS e ICMS
* Suporte a ICMS ST, IPI, CBS e IBS
* Gestão de perfil empresarial com consulta CNPJ via BrasilAPI
* Interface responsiva com tema claro/escuro
* Sistema de notificações e tooltips explicativos

---

## ✔️ Acesso Imediato

A solução está publicada no GitHub Pages — sem instalação ou dependências.

**[Visualizar página do Forma Preço](https://maurilio-carmo.github.io/Forma-Preco/)**

Toda a operação é executada no front-end (client-side).

---

## ☕ Apoie o Projeto

Se este app te ajudou a economizar tempo ou dinheiro, considere fazer uma doação!

**[Apoiar / Fazer uma doação](https://maurilio-carmo.github.io/Coffee-Pay/)**

---

## ⚙️ Requisitos Técnicos

* **Navegadores:** Chrome 90+, Edge 90+, Firefox 88+
* **Tecnologias:** HTML5, CSS3, JavaScript ES6+ (Modules)
* **Arquitetura:** Client-side (sem backend)
* **APIs Externas:** BrasilAPI (consulta CNPJ)

---

## 🏗️ Arquitetura do Projeto

### Estrutura de Diretórios

```
├── components/          # Componentes HTML modulares
├── css/
│   ├── base/           # Variáveis e reset
│   ├── components/     # Estilos de componentes
│   ├── layout/         # Grid e estrutura
│   └── utilities/      # Helpers e responsividade
├── data/               # JSONs de tributação
├── icons/              # Ícones SVG/PNG
└── src/
    ├── config/         # Constantes e configurações
    ├── controllers/    # Lógica de cálculos
    ├── handlers/       # Event handlers
    ├── models/         # Modelos de cálculo
    ├── services/       # APIs e persistência
    ├── utils/          # Utilitários e formatadores
    └── views/          # Atualizadores de UI
```

### Padrões Arquiteturais

* **MVC Adaptado:** Separação entre models, views e controllers
* **ES Modules:** Carregamento modular nativo
* **Event-Driven:** Sistema de eventos para reatividade
* **Component-Based:** Componentes HTML reutilizáveis

---

## 🔧 Funcionalidades Principais

### 1. Cálculo de Preço e Margem

**Inputs:**
* Preço de compra
* Margem desejada (%)
* Regime tributário (Real/Presumido/Simples)
* Tributação estadual (ICMS)
* Impostos federais (PIS/COFINS)

**Outputs:**
* Preço de venda calculado
* CMV (Custo de Mercadoria Vendida)
* Markup percentual
* Lucro bruto
* Margem efetiva

### 2. Tributos na Compra

* **Créditos:** PIS/COFINS e ICMS com percentuais configuráveis
* **Redução de BC:** Base de cálculo reduzida para ICMS
* **ICMS ST:** Substituição tributária com redução
* **IPI:** Imposto sobre Produtos Industrializados

### 3. Tributos na Venda

* **PIS/COFINS:** Regime cumulativo e não-cumulativo
* **ICMS:** Com redução de base de cálculo na saída
* **Simples Nacional:** Alíquota por faixa de receita
* **CBS e IBS:** Novos impostos da reforma tributária

### 4. Gestão de Perfil

* **Consulta CNPJ:** Integração com BrasilAPI
* **Dados Empresariais:** Razão social, endereço, regime
* **Persistência:** LocalStorage para dados do perfil
* **Auto-preenchimento:** Formulário com dados da Receita

### 5. Interface e UX

* **Tema Claro/Escuro:** Alternância persistente
* **Tooltips Explicativos:** Margem, CMV e Markup
* **Notificações Toast:** Feedback visual de ações
* **Responsividade:** Desktop, tablet e mobile
* **Menu Lateral:** Navegação contextual

---

## 📊 Fluxo de Cálculos

### Ordem de Processamento

```
1. Entrada de Dados
   ↓
2. Cálculo de Créditos (PIS/COFINS, ICMS)
   ↓
3. Cálculo de Impostos na Compra (ST, IPI)
   ↓
4. Determinação do CMV
   ↓
5. Cálculo do Preço de Venda (baseado em margem e tributos)
   ↓
6. Cálculo de Impostos na Venda
   ↓
7. Apuração Final (Lucro, Margem, Markup)
   ↓
8. Atualização da Interface
```

### Módulos de Cálculo

* **`tax-input.js`:** Créditos e impostos na entrada
* **`tax-output.js`:** Impostos na saída
* **`results.js`:** Preço de venda, margem e lucro
* **`calculation-controller.js`:** Orquestração dos cálculos

---

## 🎨 Sistema de Design

### Componentes Visuais

* **Highlights:** Cards de destaque para valores principais
* **Badges:** Labels coloridos para status
* **Result Box:** Painel detalhado de resultados
* **Tooltips Modais:** Explicações contextuais
* **Notificações:** Sistema toast com 4 tipos (success, error, warning, info)

---

## 🔌 Integrações

### BrasilAPI — Consulta de CNPJ

**Endpoint:** `https://brasilapi.com.br/api/cnpj/v1/{cnpj}`

**Tratamento de Erros:**
* Validação de formato (14 dígitos)
* Timeout de 10 segundos
* Retry automático
* Mensagens amigáveis ao usuário

**Dados Retornados:**
* Razão social e nome fantasia
* Endereço completo
* Opção pelo Simples Nacional
* Regime tributário inferido

---

## 💾 Persistência de Dados

### LocalStorage

**Chaves utilizadas:**
* `theme`: Preferência de tema (light/dark)
* `perfil_loja`: Dados do perfil empresarial

**Validação:**
* Verificação de integridade
* Limpeza de dados corrompidos
* Limite de tamanho (100KB)

---

## 🚀 Como Utilizar

### Fluxo Básico

1. **Configurar Perfil (Opcional)**
   * Menu → Perfil da Loja
   * Consultar CNPJ
   * Salvar dados

2. **Selecionar Regime e Tributação**
   * Regime tributário
   * Tributação estadual
   * Impostos federais

3. **Informar Valores**
   * Preço de compra
   * Margem desejada
   * Percentuais de tributos

4. **Visualizar Resultados**
   * Preço de venda calculado
   * Margem e markup
   * Detalhamento de tributos

### Atalhos e Dicas

* **ESC:** Fecha modais e menus
* **Tema:** Alternância via menu ou botão
* **Tooltips:** Clique nos cards com "?" para explicações
* **Notificações:** Auto-dismiss ou fechamento manual

---

## 🧪 Sistema de Logs

### Logger Centralizado

**Níveis:**
* `INFO`: Informações gerais
* `SUCCESS`: Operações bem-sucedidas
* `WARN`: Avisos não-críticos
* `ERROR`: Erros com stack trace
* `DEBUG`: Detalhes técnicos (modo debug)

**Ativação do Debug:**
* URL: `?debug=true`
* Console: `logger.setDebugMode(true)`

---

## 📱 Responsividade

### Breakpoints

* **Desktop:** > 900px (grid 2 colunas)
* **Tablet:** 481-900px (grid 1 coluna)
* **Mobile:** ≤ 480px (layout vertical otimizado)

### Adaptações Mobile

* Inputs em grid responsivo
* Menu lateral 60% da largura
* Tooltips ajustados
* Notificações full-width

---

## 🔒 Segurança e Validação

* **Inputs Numéricos:** Min/max constraints
* **CNPJ:** Validação de formato e dígitos
* **Sanitização:** Remoção de caracteres especiais
* **Rate Limiting:** Tratamento de 429 na API

---

## 📌 Observações Técnicas

* **Real-time Calculation:** Cálculos ao digitar (debounced)
* **Zero Dependencies:** Sem bibliotecas externas
* **Progressive Enhancement:** Funciona sem JavaScript (estrutura básica)
* **Accessibility:** Labels semânticos e ARIA
* **Performance:** < 2s tempo de carregamento inicial

---

## 📄 Licença

Apache License 2.0 — Veja `LICENSE` para detalhes.
