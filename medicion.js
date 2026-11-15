/* Node Legal · Medición con consentimiento previo.
   Mientras los tres identificadores estén vacíos, este archivo no hace nada:
   no muestra aviso, no instala cookies y no carga ningún servicio externo.
   Para activar la medición basta con escribir los identificadores aquí. */
(function () {
  var MEDICION = {
    ga4: '',        // Google Analytics 4, por ejemplo 'G-XXXXXXXXXX'
    googleAds: '',  // Google Ads, por ejemplo 'AW-XXXXXXXXXX'
    metaPixel: ''   // Píxel de Meta, por ejemplo '123456789012345'
  };
  if (!MEDICION.ga4 && !MEDICION.googleAds && !MEDICION.metaPixel) return;

  var CLAVE = 'node_cookies';
  function leer() { try { return localStorage.getItem(CLAVE); } catch (e) { return null; } }
  function guardar(v) { try { localStorage.setItem(CLAVE, v); } catch (e) {} }

  var cargado = false;
  function cargar() {
    if (cargado) return; cargado = true;
    var idG = MEDICION.ga4 || MEDICION.googleAds;
    if (idG) {
      var s = document.createElement('script'); s.async = true;
      s.src = 'https://www.googletagmanager.com/gtag/js?id=' + encodeURIComponent(idG);
      document.head.appendChild(s);
      window.dataLayer = window.dataLayer || [];
      window.gtag = function () { window.dataLayer.push(arguments); };
      window.gtag('js', new Date());
      if (MEDICION.ga4) window.gtag('config', MEDICION.ga4);
      if (MEDICION.googleAds) window.gtag('config', MEDICION.googleAds);
    }
    if (MEDICION.metaPixel) {
      (function (f, b, e, v, n, t, s) {
        if (f.fbq) return; n = f.fbq = function () { n.callMethod ? n.callMethod.apply(n, arguments) : n.queue.push(arguments); };
        if (!f._fbq) f._fbq = n; n.push = n; n.loaded = true; n.version = '2.0'; n.queue = [];
        t = b.createElement(e); t.async = true; t.src = v; s = b.getElementsByTagName(e)[0]; s.parentNode.insertBefore(t, s);
      })(window, document, 'script', 'https://connect.facebook.net/en_US/fbevents.js');
      window.fbq('init', MEDICION.metaPixel); window.fbq('track', 'PageView');
    }
    eventos();
  }

  function evento(nombreGoogle, nombreMeta, datos) {
    if (window.gtag) window.gtag('event', nombreGoogle, datos || {});
    if (window.fbq && nombreMeta) window.fbq('track', nombreMeta);
  }
  function eventos() {
    if (/gracias\.html$/.test(location.pathname)) evento('generate_lead', 'Lead', { canal: 'formulario' });
    document.addEventListener('click', function (e) {
      var a = e.target.closest && e.target.closest('a[href*="wa.me"]');
      if (a) evento('contacto_whatsapp', 'Contact', { origen: a.getAttribute('data-origen') || 'pagina' });
    });
  }

  function aviso() {
    if (document.getElementById('ckAviso')) return;
    var css = '#ckAviso{position:fixed;left:16px;right:16px;bottom:16px;z-index:1000;max-width:720px;margin:0 auto;background:#0F2A23;color:#F4EFE6;border:1px solid rgba(184,151,88,.55);border-radius:6px;box-shadow:0 18px 44px rgba(15,42,35,.35);padding:1.2rem 1.3rem;font-family:Inter,-apple-system,sans-serif;font-size:.92rem;line-height:1.6}' +
      '#ckAviso p{margin:0 0 1rem;color:rgba(244,239,230,.88)}#ckAviso a{color:#D6BC85;text-decoration:underline;text-underline-offset:3px}' +
      '#ckAviso .ck-b{display:flex;gap:.7rem;flex-wrap:wrap;justify-content:flex-end}' +
      '#ckAviso button{min-height:44px;padding:.65rem 1.4rem;border-radius:999px;font:600 .9rem Inter,-apple-system,sans-serif;cursor:pointer}' +
      '#ckNo{background:transparent;color:#F4EFE6;border:1.5px solid rgba(244,239,230,.5)}#ckSi{background:#B89758;color:#0F2A23;border:1.5px solid #B89758}' +
      '#ckAviso button:focus-visible{outline:3px solid #D6BC85;outline-offset:2px}';
    var st = document.createElement('style'); st.textContent = css; document.head.appendChild(st);
    var d = document.createElement('div'); d.id = 'ckAviso'; d.setAttribute('role', 'dialog'); d.setAttribute('aria-label', 'Aviso de cookies');
    d.innerHTML = '<p>Con tu permiso, usamos cookies de medición y de publicidad para saber cómo se usa este sitio y para medir nuestros anuncios; puedes aceptarlas o rechazarlas, y la página funciona igual en ambos casos. <a href="/politica-de-datos.html#cookies">Más información</a></p>' +
      '<div class="ck-b"><button type="button" id="ckNo">Rechazar</button><button type="button" id="ckSi">Aceptar</button></div>';
    document.body.appendChild(d);
    document.getElementById('ckSi').addEventListener('click', function () { guardar('si'); d.remove(); cargar(); });
    document.getElementById('ckNo').addEventListener('click', function () { guardar('no'); d.remove(); });
  }

  // Enlace para cambiar la decisión, visible solo cuando la medición está activa.
  window.nodeCookies = function () { guardar(''); aviso(); };
  function listo() {
    var pie = document.querySelector('.footer-bottom, footer');
    if (pie && !document.getElementById('ckPref')) {
      var b = document.createElement('button'); b.id = 'ckPref'; b.type = 'button'; b.textContent = 'Preferencias de cookies';
      b.style.cssText = 'background:none;border:0;color:inherit;font:inherit;text-decoration:underline;text-underline-offset:3px;cursor:pointer;padding:0';
      b.addEventListener('click', window.nodeCookies); pie.appendChild(b);
    }
    var v = leer();
    if (v === 'si') cargar(); else if (v !== 'no') aviso();
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', listo); else listo();
})();
