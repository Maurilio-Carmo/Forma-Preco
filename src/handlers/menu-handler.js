// handlers/menu-handler.js

import { STORAGE_KEYS } from '../config/constants.js';

/**
 * Inicializa o menu sanduíche e modal de perfil
 */
export function initializeMenu() {
  const menuToggle = document.getElementById('menuToggle');
  const menuClose = document.getElementById('menuClose');
  const sideMenu = document.getElementById('sideMenu');
  const menuOverlay = document.getElementById('menuOverlay');
  const menuPerfil = document.getElementById('menuPerfil');
  const menuTema = document.getElementById('menuTema');
  const toggleTheme = document.getElementById('toggleTheme');

  // Abrir menu
  if (menuToggle) {
    menuToggle.addEventListener('click', () => {
      sideMenu.classList.add('active');
      menuOverlay.classList.add('active');
      document.body.style.overflow = 'hidden';
    });
  }

  // Fechar menu
  const closeMenu = () => {
    sideMenu.classList.remove('active');
    menuOverlay.classList.remove('active');
    document.body.style.overflow = '';
  };

  if (menuClose) {
    menuClose.addEventListener('click', closeMenu);
  }

  if (menuOverlay) {
    menuOverlay.addEventListener('click', closeMenu);
  }

  // Abrir modal de perfil
  if (menuPerfil) {
    menuPerfil.addEventListener('click', () => {
      closeMenu();
      setTimeout(() => {
        openPerfilModal();
      }, 300);
    });
  }

  // Alterar tema pelo menu
  if (menuTema) {
    menuTema.addEventListener('click', () => {
      closeMenu();
      if (toggleTheme) {
        toggleTheme.click();
      }
    });
  }

  // ESC fecha o menu
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && sideMenu.classList.contains('active')) {
      closeMenu();
    }
  });
}

/**
 * Abre o modal de perfil
 */
function openPerfilModal() {
  const modal = document.getElementById('perfilModal');
  if (modal) {
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
    loadPerfilData();
  }
}

/**
 * Fecha o modal de perfil
 */
function closePerfilModal() {
  const modal = document.getElementById('perfilModal');
  if (modal) {
    modal.classList.remove('active');
    document.body.style.overflow = '';
  }
}

/**
 * Carrega dados do perfil do localStorage
 */
function loadPerfilData() {
  const perfilData = localStorage.getItem(STORAGE_KEYS.PERFIL);
  
  if (perfilData) {
    try {
      const data = JSON.parse(perfilData);
      
      document.getElementById('cnpj').value = data.cnpj || '';
      document.getElementById('razaoSocial').value = data.razao_social || '';
      document.getElementById('nomeFantasia').value = data.nome_fantasia || '';
      document.getElementById('cep').value = data.cep || '';
      document.getElementById('uf').value = data.uf || '';
      document.getElementById('municipio').value = data.municipio || '';
      document.getElementById('bairro').value = data.bairro || '';
      document.getElementById('logradouro').value = data.logradouro || '';
      document.getElementById('numero').value = data.numero || '';
      document.getElementById('complemento').value = data.complemento || '';
    } catch (error) {
      console.error('Erro ao carregar dados do perfil:', error);
    }
  }
}

/**
 * Salva dados do perfil no localStorage
 */
function savePerfilData(data) {
  try {
    localStorage.setItem(STORAGE_KEYS.PERFIL, JSON.stringify(data));
    return true;
  } catch (error) {
    console.error('Erro ao salvar dados do perfil:', error);
    return false;
  }
}

/**
 * Formata CNPJ
 */
function formatCNPJ(value) {
  const numbers = value.replace(/\D/g, '');
  
  if (numbers.length <= 14) {
    return numbers
      .replace(/^(\d{2})(\d)/, '$1.$2')
      .replace(/^(\d{2})\.(\d{3})(\d)/, '$1.$2.$3')
      .replace(/\.(\d{3})(\d)/, '.$1/$2')
      .replace(/(\d{4})(\d)/, '$1-$2');
  }
  
  return value;
}

/**
 * Formata CEP
 */
function formatCEP(value) {
  const numbers = value.replace(/\D/g, '');
  
  if (numbers.length <= 8) {
    return numbers.replace(/^(\d{5})(\d)/, '$1-$2');
  }
  
  return value;
}

/**
 * Consulta CNPJ na API BrasilAPI
 */
async function consultarCNPJ() {
  const cnpjInput = document.getElementById('cnpj');
  const statusElement = document.getElementById('cnpjStatus');
  const consultarBtn = document.getElementById('consultarCNPJ');
  
  const cnpj = cnpjInput.value.replace(/\D/g, '');
  
  if (cnpj.length !== 14) {
    statusElement.textContent = 'CNPJ deve ter 14 dígitos';
    statusElement.className = 'form-helper error';
    return;
  }
  
  statusElement.textContent = 'Consultando...';
  statusElement.className = 'form-helper';
  consultarBtn.disabled = true;
  
  try {
    const response = await fetch(`https://brasilapi.com.br/api/cnpj/v1/${cnpj}`);
    
    if (!response.ok) {
      throw new Error('CNPJ não encontrado');
    }
    
    const data = await response.json();
    
    // Preenche os campos com os dados da API
    document.getElementById('razaoSocial').value = data.razao_social || '';
    document.getElementById('nomeFantasia').value = data.nome_fantasia || '';
    document.getElementById('cep').value = formatCEP(data.cep || '');
    document.getElementById('uf').value = data.uf || '';
    document.getElementById('municipio').value = data.municipio || '';
    document.getElementById('bairro').value = data.bairro || '';
    
    // Monta o logradouro completo
    const logradouroCompleto = [
      data.descricao_tipo_de_logradouro,
      data.logradouro
    ].filter(Boolean).join(' ');
    
    document.getElementById('logradouro').value = logradouroCompleto || '';
    document.getElementById('numero').value = data.numero || '';
    document.getElementById('complemento').value = data.complemento || '';
    
    statusElement.textContent = 'Dados carregados com sucesso!';
    statusElement.className = 'form-helper success';
    
  } catch (error) {
    console.error('Erro ao consultar CNPJ:', error);
    statusElement.textContent = 'Erro ao consultar CNPJ. Verifique o número e tente novamente.';
    statusElement.className = 'form-helper error';
  } finally {
    consultarBtn.disabled = false;
  }
}

/**
 * Inicializa eventos do modal de perfil
 */
export function initializePerfilModal() {
  const modal = document.getElementById('perfilModal');
  const perfilClose = document.getElementById('perfilClose');
  const perfilCancel = document.getElementById('perfilCancel');
  const perfilForm = document.getElementById('perfilForm');
  const cnpjInput = document.getElementById('cnpj');
  const cepInput = document.getElementById('cep');
  const consultarBtn = document.getElementById('consultarCNPJ');

  // Fechar modal
  if (perfilClose) {
    perfilClose.addEventListener('click', closePerfilModal);
  }

  if (perfilCancel) {
    perfilCancel.addEventListener('click', closePerfilModal);
  }

  if (modal) {
    modal.addEventListener('click', (e) => {
      if (e.target === modal) {
        closePerfilModal();
      }
    });
  }

  // ESC fecha o modal
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal?.classList.contains('active')) {
      closePerfilModal();
    }
  });

  // Formatar CNPJ
  if (cnpjInput) {
    cnpjInput.addEventListener('input', (e) => {
      e.target.value = formatCNPJ(e.target.value);
    });
  }

  // Formatar CEP
  if (cepInput) {
    cepInput.addEventListener('input', (e) => {
      e.target.value = formatCEP(e.target.value);
    });
  }

  // Consultar CNPJ
  if (consultarBtn) {
    consultarBtn.addEventListener('click', consultarCNPJ);
  }

  // Salvar formulário
  if (perfilForm) {
    perfilForm.addEventListener('submit', (e) => {
      e.preventDefault();
      
      const formData = {
        cnpj: document.getElementById('cnpj').value,
        razao_social: document.getElementById('razaoSocial').value,
        nome_fantasia: document.getElementById('nomeFantasia').value,
        cep: document.getElementById('cep').value,
        uf: document.getElementById('uf').value,
        municipio: document.getElementById('municipio').value,
        bairro: document.getElementById('bairro').value,
        logradouro: document.getElementById('logradouro').value,
        numero: document.getElementById('numero').value,
        complemento: document.getElementById('complemento').value
      };
      
      if (savePerfilData(formData)) {
        // Exibe mensagem de sucesso
        const statusElement = document.getElementById('cnpjStatus');
        statusElement.textContent = 'Dados salvos com sucesso!';
        statusElement.className = 'form-helper success';
        
        // Fecha o modal após 1 segundo
        setTimeout(() => {
          closePerfilModal();
          statusElement.textContent = '';
        }, 1000);
      } else {
        alert('Erro ao salvar os dados. Tente novamente.');
      }
    });
  }
}
