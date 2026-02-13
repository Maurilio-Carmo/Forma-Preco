// src/handlers/update-handler.js

(function(window) {
  'use strict';
  
  const STORAGE_KEY = 'installed_version';
  
  /**
   * Obtém versão instalada
   */
  function getInstalledVersion() {
    try {
      return localStorage.getItem(STORAGE_KEY) || '0.0.0';
    } catch {
      return '0.0.0';
    }
  }
  
  /**
   * Salva versão instalada
   */
  function saveInstalledVersion(version) {
    try {
      localStorage.setItem(STORAGE_KEY, version);
      console.log('✅ Versão salva:', version);
    } catch (error) {
      console.error('❌ Erro ao salvar versão:', error);
    }
  }
  
  /**
   * Mostra notificação
   */
  function showUpdateNotification(currentVersion, newVersion) {
    const notification = document.getElementById('updateNotification');
    const currentEl = document.getElementById('currentVersion');
    const newEl = document.getElementById('newVersion');
    
    if (!notification) return;
    
    if (currentEl) currentEl.textContent = 'v' + currentVersion;
    if (newEl) newEl.textContent = 'v' + newVersion;
    
    notification.style.display = 'block';
    setTimeout(function() {
      notification.classList.add('show');
    }, 100);
    
    console.log('🔄 Atualização disponível:', currentVersion, '→', newVersion);
  }
  
  /**
   * Esconde notificação
   */
  function hideUpdateNotification() {
    const notification = document.getElementById('updateNotification');
    if (!notification) return;
    
    notification.classList.remove('show');
    setTimeout(function() {
      notification.style.display = 'none';
    }, 400);
  }
  
  /**
   * Atualiza o app
   */
  function updateApp() {
    const notification = document.getElementById('updateNotification');
    
    try {
      notification?.classList.add('updating');
      
      console.log('🔄 Iniciando atualização...');
      
      // Salva nova versão
      saveInstalledVersion(window.AppVersion.VERSION);
      
      // Limpa cache do service worker se existir
      if ('serviceWorker' in navigator) {
        navigator.serviceWorker.getRegistration().then(function(reg) {
          if (reg) reg.update();
        });
        
        if ('caches' in window) {
          caches.keys().then(function(keys) {
            return Promise.all(keys.map(function(key) {
              return caches.delete(key);
            }));
          }).then(function() {
            console.log('✅ Cache limpo');
          });
        }
      }
      
      // Mostra feedback
      if (window.notify) {
        window.notify.success('Atualizando...', 'O app será recarregado', 1500);
      }
      
      // Recarrega
      setTimeout(function() {
        window.location.reload(true);
      }, 1500);
      
    } catch (error) {
      console.error('❌ Erro ao atualizar:', error);
      notification?.classList.remove('updating');
      
      if (window.notify) {
        window.notify.error('Erro na atualização', 'Tente novamente mais tarde');
      }
    }
  }
  
  /**
   * Ignora atualização
   */
  function dismissUpdate() {
    hideUpdateNotification();
    console.log('⏸️ Atualização adiada');
    
    try {
      sessionStorage.setItem('update_dismissed', 'true');
    } catch {}
  }
  
  /**
   * Verifica atualizações
   */
  function checkForUpdates() {
    const installedVersion = getInstalledVersion();
    const currentVersion = window.AppVersion.VERSION;
    
    console.log('🔍 Verificando atualizações...');
    console.log('   Instalada:', installedVersion);
    console.log('   Atual:', currentVersion);
    
    if (window.AppVersion.isNewerVersion(currentVersion, installedVersion)) {
      const dismissed = sessionStorage.getItem('update_dismissed');
      
      if (!dismissed) {
        showUpdateNotification(installedVersion, currentVersion);
      }
      
      return true;
    }
    
    if (installedVersion !== currentVersion) {
      saveInstalledVersion(currentVersion);
    }
    
    return false;
  }
  
  /**
   * Carrega versão no menu
   */
  function loadAppVersion() {
    const versionElement = document.getElementById('appVersion');
    
    if (versionElement) {
      versionElement.textContent = 'v' + window.AppVersion.VERSION;
      console.log('✅ Versão carregada:', window.AppVersion.VERSION);
    }
  }
  
  /**
   * Inicializa
   */
  function initialize() {
    console.log('🔄 Inicializando Update Handler');
    
    // Carrega versão no menu
    loadAppVersion();
    
    // Configura botões
    const updateBtn = document.getElementById('updateNow');
    const dismissBtn = document.getElementById('updateDismiss');
    
    if (updateBtn) updateBtn.addEventListener('click', updateApp);
    if (dismissBtn) dismissBtn.addEventListener('click', dismissUpdate);
    
    // Verifica atualizações
    checkForUpdates();
    
    // Verifica a cada 30 minutos
    setInterval(checkForUpdates, 30 * 60 * 1000);
    
    // Verifica quando volta para foreground
    document.addEventListener('visibilitychange', function() {
      if (!document.hidden) {
        checkForUpdates();
      }
    });
    
    console.log('✅ Update Handler inicializado');
  }
  
  // Expõe funções
  window.UpdateHandler = {
    initialize: initialize,
    checkForUpdates: checkForUpdates,
    updateApp: updateApp
  };
  
})(window);