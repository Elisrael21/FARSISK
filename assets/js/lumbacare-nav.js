// ─────────────────────────────────────────────────────────────
// LumbaCare — Shared Navigation Component
// Incluir en todas las páginas de la app (después del body)
// Uso: LumbaCareNav.init({ role: 'paciente', activePage: 'dashboard' })
// ─────────────────────────────────────────────────────────────

const LumbaCareNav = {

  // Menús por rol
  menus: {
    paciente: [
      { id: 'dashboard',  icon: 'home',          label: 'Inicio',        href: 'dashboard.html' },
      { id: 'ejercicios', icon: 'fitness_center', label: 'Ejercicios',    href: 'ejercicios.html' },
      { id: 'historial',  icon: 'history_edu',   label: 'Mi Historial',  href: 'historial.html' },
      { id: 'reportes',   icon: 'analytics',     label: 'Mis Reportes',  href: 'reportes.html' },
      { id: 'perfil',     icon: 'person',         label: 'Perfil',        href: 'perfil.html' },
    ],
    fisio: [
      { id: 'dashboard',  icon: 'groups',            label: 'Mis Pacientes',  href: 'dashboard.html' },
      { id: 'reportes',   icon: 'analytics',         label: 'Reportes',       href: 'reportes.html' },
      { id: 'alertas',    icon: 'notifications',     label: 'Notificaciones', href: 'alertas.html', badge: true },
      { id: 'perfil',     icon: 'person_apron',      label: 'Perfil',         href: 'perfil.html' },
    ],
    admin: [
      { id: 'dashboard',  icon: 'dashboard',      label: 'Dashboard',            href: 'dashboard.html' },
      { id: 'usuarios',   icon: 'manage_accounts', label: 'Usuarios',            href: 'usuarios.html' },
      { id: 'ejercicios', icon: 'fitness_center',  label: 'Biblioteca Ejercicios',href: 'ejercicios.html' },
      { id: 'sistema',    icon: 'settings',        label: 'Sistema',             href: 'sistema.html' },
    ],
  },

  // Colores por rol
  roleColors: {
    paciente: { bg: 'bg-primary', text: 'text-primary', container: 'bg-primary-container', label: 'Paciente' },
    fisio:    { bg: 'bg-secondary', text: 'text-secondary', container: 'bg-secondary-container', label: 'Fisioterapeuta' },
    admin:    { bg: 'bg-error', text: 'text-error', container: 'bg-error-container', label: 'Administrador' },
  },

  init({ role, activePage }) {
    this.role       = role || localStorage.getItem('lc_role') || 'paciente';
    this.activePage = activePage;
    this.userName   = localStorage.getItem('lc_name')  || 'Usuario';
    this.userEmail  = localStorage.getItem('lc_email') || '';

    this._injectStyles();
    this._renderSidebar();
    this._renderTopnav();
    this._bindLogout();
    this._setActiveLink();
  },

  _injectStyles() {
    if (document.getElementById('lc-nav-styles')) return;
    const s = document.createElement('style');
    s.id = 'lc-nav-styles';
    s.textContent = `
      #lc-sidebar { position:fixed; left:0; top:0; bottom:0; width:256px; background:#ffffff; border-right:1px solid #bec8d2; display:flex; flex-direction:column; padding:24px 16px; z-index:50; overflow-y:auto; }
      #lc-topnav  { position:fixed; top:0; left:256px; right:0; height:64px; background:rgba(255,255,255,.92); backdrop-filter:blur(12px); border-bottom:1px solid #bec8d2; z-index:40; display:flex; align-items:center; justify-content:space-between; padding:0 32px; }
      #lc-main    { margin-left:256px; padding-top:80px; min-height:100vh; }
      .lc-nav-link { display:flex; align-items:center; gap:12px; padding:10px 16px; border-radius:12px; font-size:14px; font-weight:600; color:#3e4850; text-decoration:none; transition:all .15s ease; cursor:pointer; }
      .lc-nav-link:hover  { background:#e5eeff; color:#0b1c30; }
      .lc-nav-link.active { background:#e5eeff; color:#006591; font-weight:700; }
      .lc-nav-link .badge { width:8px; height:8px; background:#ba1a1a; border-radius:50%; margin-left:auto; }
      @media(max-width:768px){ #lc-sidebar{left:-256px;transition:left .25s ease;} #lc-sidebar.open{left:0;} #lc-topnav{left:0;} #lc-main{margin-left:0;} }
    `;
    document.head.appendChild(s);
  },

  _renderSidebar() {
    const menu   = this.menus[this.role] || this.menus.paciente;
    const colors = this.roleColors[this.role];
    const initials = this.userName.split(' ').map(w=>w[0]).join('').slice(0,2).toUpperCase();

    const nav = menu.map(item => `
      <a class="lc-nav-link" data-page="${item.id}" href="${item.href}">
        <span class="material-symbols-outlined" style="font-size:20px;">${item.icon}</span>
        <span>${item.label}</span>
        ${item.badge ? '<span class="badge"></span>' : ''}
      </a>
    `).join('');

    const sidebar = document.createElement('aside');
    sidebar.id = 'lc-sidebar';
    sidebar.innerHTML = `
      <!-- Logo -->
      <a href="../index.html" style="display:flex;align-items:center;gap:10px;margin-bottom:28px;text-decoration:none;">
        <div style="width:36px;height:36px;background:#006591;border-radius:10px;display:flex;align-items:center;justify-content:center;">
          <span class="material-symbols-outlined" style="color:#fff;font-size:20px;font-variation-settings:'FILL' 1;">health_and_safety</span>
        </div>
        <div>
          <p style="font-size:16px;font-weight:800;color:#006591;line-height:1.1;">FARSISK</p>
          <p style="font-size:11px;color:#6e7881;">Clinical Rehab AI</p>
        </div>
      </a>

      <!-- Nav links -->
      <nav style="flex:1;display:flex;flex-direction:column;gap:4px;">${nav}</nav>

      <!-- User card bottom -->
      <div style="margin-top:24px;padding-top:16px;border-top:1px solid #bec8d2;">
        <div style="display:flex;align-items:center;gap:10px;padding:10px;border-radius:12px;background:#f8f9ff;margin-bottom:8px;">
          <div style="width:36px;height:36px;border-radius:50%;background:#006591;display:flex;align-items:center;justify-content:center;color:#fff;font-size:13px;font-weight:700;flex-shrink:0;">${initials}</div>
          <div style="min-width:0;">
            <p style="font-size:13px;font-weight:600;color:#0b1c30;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">${this.userName}</p>
            <p style="font-size:11px;color:#6e7881;">${colors.label}</p>
          </div>
        </div>
        <button id="lc-logout-btn" class="lc-nav-link" style="width:100%;border:none;background:none;cursor:pointer;color:#ba1a1a;" onclick="LumbaCareNav.logout()">
          <span class="material-symbols-outlined" style="font-size:20px;">logout</span>
          <span>Cerrar sesión</span>
        </button>
      </div>
    `;
    document.body.prepend(sidebar);
  },

  _renderTopnav() {
    const colors  = this.roleColors[this.role];
    const initials = this.userName.split(' ').map(w=>w[0]).join('').slice(0,2).toUpperCase();
    const now = new Date();
    const dateStr = now.toLocaleDateString('es-MX', { weekday:'long', year:'numeric', month:'long', day:'numeric' });

    const topnav = document.createElement('header');
    topnav.id = 'lc-topnav';
    topnav.innerHTML = `
      <!-- Left: hamburger + date -->
      <div style="display:flex;align-items:center;gap:16px;">
        <button id="lc-hamburger" onclick="LumbaCareNav.toggleSidebar()" style="display:none;background:none;border:none;cursor:pointer;padding:4px;" aria-label="Menú">
          <span class="material-symbols-outlined" style="color:#3e4850;">menu</span>
        </button>
        <p style="font-size:13px;color:#6e7881;display:flex;align-items:center;gap:6px;">
          <span class="material-symbols-outlined" style="font-size:16px;color:#6e7881;">calendar_today</span>
          ${dateStr}
        </p>
      </div>

      <!-- Right: notifications + user -->
      <div style="display:flex;align-items:center;gap:16px;">
        <!-- Notification bell -->
        <button id="lc-notif-btn" style="position:relative;background:none;border:none;cursor:pointer;width:40px;height:40px;border-radius:50%;display:flex;align-items:center;justify-content:center;transition:background .15s;" onmouseenter="this.style.background='#e5eeff'" onmouseleave="this.style.background='none'">
          <span class="material-symbols-outlined" style="color:#3e4850;">notifications</span>
          <span id="lc-notif-badge" style="position:absolute;top:6px;right:6px;width:8px;height:8px;background:#ba1a1a;border-radius:50%;border:2px solid #fff;display:none;"></span>
        </button>

        <!-- Divider -->
        <div style="width:1px;height:32px;background:#bec8d2;"></div>

        <!-- User info -->
        <div style="display:flex;align-items:center;gap:10px;">
          <div style="text-align:right;">
            <p style="font-size:14px;font-weight:600;color:#0b1c30;">${this.userName}</p>
            <p style="font-size:11px;color:#6e7881;">${colors.label}</p>
          </div>
          <div style="width:38px;height:38px;border-radius:50%;background:#006591;display:flex;align-items:center;justify-content:center;color:#fff;font-size:13px;font-weight:700;border:2px solid #e5eeff;">${initials}</div>
        </div>
      </div>
    `;
    document.body.insertBefore(topnav, document.body.children[1]);
  },

  _setActiveLink() {
    document.querySelectorAll('.lc-nav-link[data-page]').forEach(link => {
      if (link.dataset.page === this.activePage) link.classList.add('active');
    });
  },

  _bindLogout() {
    // already handled by onclick
  },

  toggleSidebar() {
    document.getElementById('lc-sidebar')?.classList.toggle('open');
  },

  logout() {
    ['lc_token','lc_role','lc_email','lc_name','lc_auto_login'].forEach(k => localStorage.removeItem(k));
    window.location.href = '../login.html';
  },

  // Show notification badge
  showNotifBadge() {
    const b = document.getElementById('lc-notif-badge');
    if (b) b.style.display = 'block';
  },

  // Wrap page content in #lc-main
  wrapContent() {
    const main = document.getElementById('lc-main');
    if (main) return; // already wrapped
    const wrapper = document.createElement('div');
    wrapper.id = 'lc-main';
    // Move all body children except sidebar and topnav into wrapper
    const toMove = [...document.body.children].filter(el =>
      el.id !== 'lc-sidebar' && el.id !== 'lc-topnav' && el.tagName !== 'SCRIPT' && el.tagName !== 'STYLE'
    );
    toMove.forEach(el => wrapper.appendChild(el));
    document.body.appendChild(wrapper);
  }
};
