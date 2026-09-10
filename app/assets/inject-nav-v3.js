// PLAN OVERLAY + SIDEBAR LINKS + BANNER + ADS - Todo en uno
(function() {
  const API = 'https://fidelizacion.cloudsolutions.cl/api';
  const getToken = () => localStorage.getItem('token') || localStorage.getItem('loyalty_token');
  const WELCOME_SHOWN_KEY = 'fideliza_welcome_shown';

  // ===== AD INJECTION FOR FREE PLAN =====
  function injectAds(restrictions) {
    if (!restrictions || !restrictions.show_ads) return;
    if (document.getElementById('fideliza-ad-banner')) return;

    // Anuncio superior
    const topAd = document.createElement('div');
    topAd.id = 'fideliza-ad-top';
    topAd.style.cssText = 'background:linear-gradient(135deg,#fbbf24,#f59e0b);padding:8px 16px;text-align:center;font-size:12px;color:#78350f;position:fixed;top:0;left:0;right:0;z-index:9997;';
    topAd.innerHTML = '<div style="display:flex;align-items:center;justify-content:center;gap:8px;"><span style="background:#92400e;color:white;padding:2px 6px;border-radius:4px;font-size:10px;font-weight:700;">PUBLICIDAD</span> <span>🚀 <strong>Plan Starter desde $29.900/mes</strong> - Sin anuncios, más clientes, más funciones</span> <a href="/app/checkout/" style="color:#92400e;text-decoration:underline;font-weight:600;">Mejorar plan</a></div>';
    document.body.insertBefore(topAd, document.body.firstChild);

    // Anuncio lateral derecho (solo en desktop)
    if (window.innerWidth > 1024) {
      const sideAd = document.createElement('div');
      sideAd.id = 'fideliza-ad-side';
      sideAd.style.cssText = 'position:fixed;right:0;top:50%;transform:translateY(-50%);width:80px;background:linear-gradient(180deg,#fef3c7,#fde68a);border-radius:8px 0 0 8px;padding:12px 8px;text-align:center;z-index:9997;box-shadow:-2px 0 8px rgba(0,0,0,0.1);';
      sideAd.innerHTML = '<div style="font-size:20px;margin-bottom:4px;">📢</div><div style="font-size:9px;color:#92400e;font-weight:700;line-height:1.2;">Quita los anuncios con Plan Starter</div><a href="/app/checkout/" style="display:block;margin-top:6px;background:#f59e0b;color:white;padding:4px;border-radius:4px;font-size:9px;text-decoration:none;font-weight:600;">Ver planes</a>';
      document.body.appendChild(sideAd);
    }

    // Anuncio inferior fijo
    const bottomAd = document.createElement('div');
    bottomAd.id = 'fideliza-ad-bottom';
    bottomAd.style.cssText = 'position:fixed;bottom:0;left:0;right:0;background:white;border-top:1px solid #e5e7eb;padding:6px 16px;z-index:9997;display:flex;align-items:center;justify-content:center;gap:12px;font-size:11px;color:#6b7280;';
    bottomAd.innerHTML = '<span style="background:#dbeafe;color:#1d4ed8;padding:1px 6px;border-radius:3px;font-weight:600;">Fideliza</span> Plan Gratuito · <a href="/app/checkout/" style="color:#3b82f6;text-decoration:underline;">Upgrade a Starter para quitar anuncios</a>';
    document.body.appendChild(bottomAd);

    // Empujar contenido
    document.body.style.paddingTop = '36px';
    document.body.style.paddingBottom = '32px';
    if (document.getElementById('fideliza-ad-side')) {
      document.body.style.paddingRight = '90px';
    }
  }

  // ===== OVERLAY DE BIENVENIDA =====
  function showWelcomeOverlay(trialInfo) {
    if (document.getElementById('fideliza-welcome-overlay')) return;

    const daysLeft = trialInfo.daysLeft;
    const plan = trialInfo.plan || 'starter';
    const planName = plan.charAt(0).toUpperCase() + plan.slice(1);
    const isTrial = trialInfo.isTrial;
    const isPaid = trialInfo.isPaid;

    const overlay = document.createElement('div');
    overlay.id = 'fideliza-welcome-overlay';
    overlay.style.cssText = 'position:fixed;top:0;left:0;right:0;bottom:0;background:rgba(0,0,0,0.7);z-index:99999;display:flex;align-items:center;justify-content:center;padding:20px;backdrop-filter:blur(4px);';

    let content = '';

    if (isTrial && daysLeft > 0) {
      const urgent = daysLeft <= 3;
      const progressPct = Math.max(0, Math.min(100, (daysLeft / 14) * 100));
      const progressColor = urgent ? '#ef4444' : daysLeft <= 7 ? '#f59e0b' : '#22c55e';

      content = `
        <div style="background:white;border-radius:24px;max-width:520px;width:100%;overflow:hidden;box-shadow:0 25px 80px rgba(0,0,0,0.3);">
          <div style="background:linear-gradient(135deg,#3b82f6,#8b5cf6);padding:32px;text-align:center;">
            <div style="width:64px;height:64px;background:rgba(255,255,255,0.2);border-radius:16px;display:flex;align-items:center;justify-content:center;margin:0 auto 16px;font-size:28px;">F</div>
            <h1 style="color:white;font-size:24px;font-weight:800;margin:0 0 6px;">¡Bienvenido!</h1>
            <p style="color:rgba(255,255,255,0.8);font-size:14px;margin:0;">Tu prueba gratuita está activa</p>
          </div>
          <div style="padding:28px;">
            <div style="background:${urgent ? '#fef2f2' : '#f0fdf4'};border:1px solid ${urgent ? '#fecaca' : '#bbf7d0'};border-radius:16px;padding:20px;text-align:center;margin-bottom:20px;">
              <div style="font-size:12px;font-weight:700;text-transform:uppercase;letter-spacing:1px;color:${urgent ? '#dc2626' : '#16a34a'};margin-bottom:8px;">
                ${urgent ? '⚠️ PRUEBA POR TERMINAR' : '⏱️ PRUEBA GRATUITA ACTIVA'}
              </div>
              <div style="font-size:42px;font-weight:800;color:${urgent ? '#dc2626' : '#16a34a'};">
                ${daysLeft} <span style="font-size:16px;font-weight:500;">${daysLeft === 1 ? 'día' : 'días'}</span>
              </div>
              <div style="margin-top:12px;background:#e2e8f0;border-radius:4px;height:8px;overflow:hidden;">
                <div style="height:100%;width:${progressPct}%;background:${progressColor};border-radius:4px;transition:width 0.3s;"></div>
              </div>
              <div style="font-size:12px;color:#64748b;margin-top:6px;">Plan ${planName} · ${daysLeft} días restantes</div>
            </div>

            <div style="margin-bottom:20px;">
              <p style="font-size:13px;color:#475569;margin-bottom:12px;text-align:center;">¿Qué puedes hacer ahora?</p>
              <div style="display:grid;grid-template-columns:1fr 1fr;gap:8px;">
                <div style="background:#f8fafc;border-radius:10px;padding:12px;font-size:12px;color:#475569;">
                  <div style="color:#3b82f6;font-weight:700;margin-bottom:4px;">✓ Crear tarjetas</div>
                  Tarjetas de puntos y sellos
                </div>
                <div style="background:#f8fafc;border-radius:10px;padding:12px;font-size:12px;color:#475569;">
                  <div style="color:#3b82f6;font-weight:700;margin-bottom:4px;">✓ Clientes</div>
                  Registrar y fidelizar
                </div>
                <div style="background:#f8fafc;border-radius:10px;padding:12px;font-size:12px;color:#475569;">
                  <div style="color:#3b82f6;font-weight:700;margin-bottom:4px;">✓ QR y escáner</div>
                  Escaneo de clientes
                </div>
                <div style="background:#f8fafc;border-radius:10px;padding:12px;font-size:12px;color:#475569;">
                  <div style="color:#3b82f6;font-weight:700;margin-bottom:4px;">✓ Reportes</div>
                  Estadísticas en tiempo real
                </div>
              </div>
            </div>

            <a href="/app/mi-plan/" style="display:block;text-align:center;background:linear-gradient(135deg,#3b82f6,#8b5cf6);color:white;padding:14px;border-radius:12px;text-decoration:none;font-weight:700;font-size:15px;margin-bottom:10px;">
              Asegurar mi suscripción
            </a>
            <button onclick="document.getElementById('fideliza-welcome-overlay').remove();" style="display:block;width:100%;text-align:center;background:white;color:#64748b;padding:12px;border-radius:12px;border:1px solid #e2e8f0;font-weight:600;font-size:14px;cursor:pointer;">
              Empezar a usar →
            </button>
          </div>
        </div>
      `;
    } else if (isPaid) {
      content = `
        <div style="background:white;border-radius:24px;max-width:480px;width:100%;padding:32px;text-align:center;box-shadow:0 25px 80px rgba(0,0,0,0.3);">
          <div style="width:64px;height:64px;background:linear-gradient(135deg,#3b82f6,#8b5cf6);border-radius:16px;display:flex;align-items:center;justify-content:center;margin:0 auto 16px;font-size:28px;">F</div>
          <h1 style="font-size:22px;font-weight:800;color:#1e293b;margin-bottom:6px;">¡Plan ${planName} activo!</h1>
          <p style="color:#64748b;font-size:14px;margin-bottom:20px;">Tu suscripción está confirmada y activa.</p>
          <a href="/app/business/dashboard" style="display:block;background:linear-gradient(135deg,#3b82f6,#8b5cf6);color:white;padding:14px;border-radius:12px;text-decoration:none;font-weight:700;font-size:15px;">Ir al Dashboard</a>
        </div>
      `;
    } else {
      return;
    }

    overlay.innerHTML = content;
    document.body.appendChild(overlay);

    overlay.addEventListener('click', function(e) {
      if (e.target === overlay) {
        // No cerrar con click fuera
      }
    });
  }

  // ===== CHECK PLAN STATUS =====
  async function checkPlanAndShow() {
    const token = getToken();
    if (!token) return;

    try {
      const res = await fetch(API + '/payments/subscription', {
        headers: { 'Authorization': 'Bearer ' + token }
      });
      const data = await res.json();

      const sub = data.subscription;
      const plan = data.plan || 'free';
      const isTrial = sub && sub.status === 'trial';
      const isPaid = sub && sub.status === 'active' && !isTrial;

      let daysLeft = 0;
      if (isTrial && sub.current_period_end) {
        daysLeft = Math.ceil((new Date(sub.current_period_end) - new Date()) / (1000 * 60 * 60 * 24));
      }

      // Si es trial y tiene días, mostrar overlay (solo primera vez o si no se ha visto)
      const welcomeKey = WELCOME_SHOWN_KEY + '_' + token.substring(0, 20);
      if (isTrial && daysLeft > 0 && !sessionStorage.getItem(welcomeKey)) {
        sessionStorage.setItem(welcomeKey, '1');
        setTimeout(() => {
          showWelcomeOverlay({ daysLeft, plan, isTrial, isPaid: false });
        }, 1500);
      }

      // Si es paid, mostrar overlay la primera vez
      if (isPaid && !sessionStorage.getItem(welcomeKey)) {
        sessionStorage.setItem(welcomeKey, '1');
        setTimeout(() => {
          showWelcomeOverlay({ daysLeft: 0, plan, isTrial: false, isPaid: true });
        }, 1500);
      }

      // Si es plan free, inyectar anuncios
      if (plan === 'free' && !isTrial) {
        setTimeout(() => {
          injectAds({ show_ads: true });
        }, 1000);
      }

      // Crear banner de trial siempre
      createTrialBanner(daysLeft, plan, isTrial);
    } catch(e) {
      console.error('Error checking plan:', e);
    }
  }

  // ===== TRIAL BANNER =====
  function createTrialBanner(daysLeft, plan, isTrial) {
    if (document.getElementById('trial-banner')) return;
    if (!isTrial || daysLeft <= 0) return;

    const urgent = daysLeft <= 3;
    const banner = document.createElement('div');
    banner.id = 'trial-banner';
    banner.style.cssText = 'position:fixed;top:0;left:0;right:0;z-index:9998;padding:8px 20px;display:flex;align-items:center;justify-content:center;gap:10px;font-size:13px;font-weight:600;transition:all 0.3s;' +
      (urgent ? 'background:#fef2f2;border-bottom:2px solid #fecaca;color:#991b1b;' : 'background:#f0fdf4;border-bottom:2px solid #bbf7d0;color:#166534;');

    banner.innerHTML =
      '<span>' + (urgent ? '⚠️' : '⏱️') + ' Tu prueba termina en ' + Math.max(0, daysLeft) + ' día(s)</span>' +
      '<a href="/app/mi-plan/" style="color:inherit;text-decoration:underline;margin-left:4px;">Ver plan</a>' +
      '<a href="/app/mi-plan/" style="background:' + (urgent ? '#dc2626' : '#16a34a') + ';color:white;padding:4px 12px;border-radius:6px;text-decoration:none;font-size:12px;">Asegurar</a>' +
      '<button onclick="this.parentElement.remove()" style="background:none;border:none;color:inherit;cursor:pointer;font-size:16px;margin-left:8px;">✕</button>';

    document.body.insertBefore(banner, document.body.firstChild);

    // Empujar contenido hacia abajo
    document.body.style.paddingTop = '40px';
  }

  // ===== SIDEBAR LINKS =====
  function injectSidebar() {
    if (document.getElementById('mi-plan-nav-link')) return true;

    // Buscar el link "Escanear cliente" - puede ser un <a> o un <div> con onClick
    const allLinks = document.querySelectorAll('a, [role="link"], [class*="sidebar"] div');
    let escanearLink = null;

    for (const el of allLinks) {
      const text = (el.textContent || '').trim().toLowerCase();
      if (text.includes('escanear') && el.closest('nav, aside, [class*="sidebar"], [class*="nav"]')) {
        escanearLink = el;
      }
    }

    // Fallback: buscar cualquier elemento que contenga "escanear"
    if (!escanearLink) {
      for (const el of allLinks) {
        const text = (el.textContent || '').trim().toLowerCase();
        if (text === 'escanear cliente' || text === 'escanear') {
          escanearLink = el;
        }
      }
    }

    if (!escanearLink) return false;

    // Encontrar el contenedor del sidebar
    let container = escanearLink.parentElement;
    while (container && !container.querySelector('a')) {
      container = container.parentElement;
    }
    if (!container) container = escanearLink.parentElement;

    const divider = document.createElement('div');
    divider.id = 'mi-plan-nav-link';
    divider.style.cssText = 'height:1px;background:#e2e8f0;margin:4px 16px;';

    const miPlan = document.createElement('a');
    miPlan.href = '/app/mi-plan/';
    miPlan.style.cssText = 'display:flex;align-items:center;gap:12px;padding:10px 12px;border-radius:10px;color:#3b82f6;text-decoration:none;font-size:14px;font-weight:500;transition:background 0.2s;margin:2px 8px;';
    miPlan.innerHTML = '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="1" y="4" width="22" height="16" rx="2" ry="2"></rect><line x1="1" y1="10" x2="23" y2="10"></line></svg><span>Mi Plan</span>';
    miPlan.onmouseover = () => { miPlan.style.background = '#eff6ff'; };
    miPlan.onmouseout = () => { miPlan.style.background = 'transparent'; };

    const cambiar = document.createElement('a');
    cambiar.href = '/app/checkout/';
    cambiar.style.cssText = 'display:flex;align-items:center;gap:12px;padding:10px 12px;border-radius:10px;color:#10b981;text-decoration:none;font-size:14px;font-weight:500;transition:background 0.2s;margin:2px 8px;';
    cambiar.innerHTML = '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="9" cy="21" r="1"></circle><circle cx="20" cy="21" r="1"></circle><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path></svg><span>Cambiar Plan</span>';
    cambiar.onmouseover = () => { cambiar.style.background = '#f0fdf4'; };
    cambiar.onmouseout = () => { cambiar.style.background = 'transparent'; };

    // Insertar después de Escanear cliente
    if (escanearLink.nextSibling) {
      container.insertBefore(divider, escanearLink.nextSibling);
    } else {
      container.appendChild(divider);
    }
    container.insertBefore(miPlan, divider.nextSibling);
    container.insertBefore(cambiar, miPlan.nextSibling);

    return true;
  }

  // ===== INIT =====
  let attempts = 0;
  const sidInterval = setInterval(() => {
    attempts++;
    injectSidebar();
    if (attempts >= 30) clearInterval(sidInterval);
  }, 400);

  // Verificar plan y mostrar overlay
  checkPlanAndShow();

  // Recargar cada 5 minutos
  setInterval(checkPlanAndShow, 300000);
})();
