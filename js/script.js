(function () {
  "use strict";

  var cfg = window.SITE_CONFIG;
  if (!cfg) return;

  function escapeHtml(str) {
    return String(str)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#39;");
  }

  function buildWhatsAppUrl(message) {
    var raw = (cfg.contact && cfg.contact.whatsappDigits) || "";
    var digits = raw.replace(/\D/g, "");
    var encoded = encodeURIComponent(
      message || "Hello " + cfg.brandName + ", I would like to enquire about personal coaching."
    );
    if (digits.length >= 8) {
      return "https://wa.me/" + digits + "?text=" + encoded;
    }
    return "https://api.whatsapp.com/send?text=" + encoded;
  }

  function syncThemeColors() {
    if (!cfg.colors) return;
    var root = document.documentElement.style;
    if (cfg.colors.midnight) root.setProperty("--color-midnight", cfg.colors.midnight);
    if (cfg.colors.charcoal) root.setProperty("--color-charcoal", cfg.colors.charcoal);
    if (cfg.colors.white) root.setProperty("--color-white", cfg.colors.white);
    if (cfg.colors.accentRed) root.setProperty("--color-red", cfg.colors.accentRed);
    if (cfg.colors.steel) root.setProperty("--color-steel", cfg.colors.steel);
    if (cfg.colors.lightGrey) root.setProperty("--color-light", cfg.colors.lightGrey);
  }

  function updateDocumentTitle() {
    var page = document.body.getAttribute("data-page");
    var pageTitle = document.body.getAttribute("data-page-title");
    if (pageTitle) {
      document.title =
        page === "home"
          ? cfg.brandName + " — " + pageTitle
          : pageTitle + " — " + cfg.brandName;
    }
  }

  function resolveConfiguredWhatsAppUrl(itemUrl) {
    var raw = (cfg.contact && cfg.contact.whatsappDigits) || "";
    var digits = raw.replace(/\D/g, "");
    if (digits.length >= 8) {
      var encoded = encodeURIComponent(
        "Hello " + cfg.brandName + ", I would like to enquire about personal coaching."
      );
      return "https://wa.me/" + digits + "?text=" + encoded;
    }
    return itemUrl ? String(itemUrl).trim() : "";
  }

  var SOCIAL_SVGS = {
    instagram:
      '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M7.75 2h8.5A5.75 5.75 0 0 1 22 7.75v8.5A5.75 5.75 0 0 1 16.25 22h-8.5A5.75 5.75 0 0 1 2 16.25v-8.5A5.75 5.75 0 0 1 7.75 2Zm0 1.8A3.95 3.95 0 0 0 3.8 7.75v8.5a3.95 3.95 0 0 0 3.95 3.95h8.5a3.95 3.95 0 0 0 3.95-3.95v-8.5a3.95 3.95 0 0 0-3.95-3.95h-8.5Zm9.55 2.4a1.15 1.15 0 1 1 0 2.3 1.15 1.15 0 0 1 0-2.3ZM12 7a5 5 0 1 1 0 10 5 5 0 0 1 0-10Zm0 1.8a3.2 3.2 0 1 0 0 6.4 3.2 3.2 0 0 0 0-6.4Z"/></svg>',
    facebook:
      '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M13.5 22v-8.25h2.77l.41-3.22H13.5V8.48c0-.93.26-1.57 1.6-1.57h1.7V4.03c-.3-.04-1.31-.13-2.49-.13-2.46 0-4.15 1.5-4.15 4.26v2.37H7.38v3.22h2.78V22h3.34Z"/></svg>',
    whatsapp:
      '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12.04 2C6.51 2 2.02 6.49 2.02 12.02c0 1.77.46 3.5 1.34 5.02L2 22l5.09-1.33a9.97 9.97 0 0 0 4.95 1.31h.01c5.53 0 10.02-4.49 10.02-10.02A10.02 10.02 0 0 0 12.04 2Zm5.83 14.23c-.25.7-1.45 1.34-2.01 1.42-.51.08-1.17.11-1.89-.12-.44-.14-1-.33-1.72-.64-3.03-1.31-5.01-4.37-5.16-4.57-.15-.2-1.23-1.64-1.23-3.13 0-1.49.78-2.22 1.06-2.52.28-.3.61-.38.81-.38.2 0 .4 0 .58.01.19.01.44-.07.69.53.25.61.86 2.1.94 2.25.08.15.13.33.03.53-.1.2-.15.33-.3.5-.15.18-.32.4-.45.53-.15.15-.31.31-.13.61.18.3.78 1.29 1.68 2.09 1.15 1.03 2.13 1.35 2.43 1.5.3.15.48.13.66-.08.18-.2.76-.88.96-1.18.2-.3.4-.25.68-.15.28.1 1.76.83 2.06.98.3.15.5.23.58.35.07.13.07.73-.18 1.43Z"/></svg>',
    linkedin:
      '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M19.5 3h-15A1.5 1.5 0 0 0 3 4.5v15A1.5 1.5 0 0 0 4.5 21h15a1.5 1.5 0 0 0 1.5-1.5v-15A1.5 1.5 0 0 0 19.5 3ZM8.34 18.34H5.67V9.75h2.67v8.59ZM7 8.58a1.55 1.55 0 1 1 0-3.1 1.55 1.55 0 0 1 0 3.1Zm11.34 9.76h-2.66v-4.18c0-1-.02-2.28-1.39-2.28-1.39 0-1.6 1.09-1.6 2.21v4.25h-2.66V9.75h2.55v1.17h.04c.36-.67 1.22-1.38 2.52-1.38 2.69 0 3.19 1.77 3.19 4.07v4.73Z"/></svg>',
  };

  function renderSocialIconsHtml(linkClass) {
    var links = (cfg.contact && cfg.contact.socialLinks) || [];
    var cls = linkClass || "social-icon-link";
    return links
      .map(function (item) {
        var key = (item.id || item.label || "").toLowerCase();
        var svg = SOCIAL_SVGS[key];
        if (!svg) return "";
        var isWhatsApp = key === "whatsapp";
        var resolvedUrl = isWhatsApp ? resolveConfiguredWhatsAppUrl(item.url) : item.url || "#";
        var ariaLabel = isWhatsApp
          ? "Chat with us on WhatsApp"
          : cfg.brandName + " on " + item.label;
        var titleText = isWhatsApp ? "Chat with us on WhatsApp" : item.label;
        var attrs = resolvedUrl
          ? 'href="' + escapeHtml(resolvedUrl) + '" target="_blank" rel="noopener noreferrer"'
          : 'href="#" data-whatsapp-unconfigured="true"';
        return (
          "<a " +
          attrs +
          ' class="' +
          escapeHtml(cls) +
          '" aria-label="' +
          escapeHtml(ariaLabel) +
          '" title="' +
          escapeHtml(titleText) +
          '">' +
          svg +
          "</a>"
        );
      })
      .join("");
  }

  function renderHeaderSocialIcons() {
    return renderSocialIconsHtml("social-icon-link");
  }

  function renderHeader() {
    var mount = document.getElementById("site-header");
    if (!mount) return;

    var currentPage = document.body.getAttribute("data-page") || "home";
    var navItems = [
      { id: "home", label: "Home", href: "index.html" },
      { id: "about", label: "About", href: "about.html" },
      { id: "services", label: "Services", href: "services.html" },
      { id: "coaches", label: "Coaches", href: "coaches.html" },
      { id: "transformations", label: "Transformations", href: "transformations.html" },
      { id: "contact", label: "Contact", href: "contact.html" },
    ];

    var desktopLinksHtml = navItems
      .map(function (item) {
        var activeClass = item.id === currentPage ? " is-active" : "";
        return (
          '<a href="' +
          item.href +
          '" class="nav-link' +
          activeClass +
          '">' +
          escapeHtml(item.label) +
          "</a>"
        );
      })
      .join("");

    var mobileLinksHtml = navItems
      .map(function (item) {
        var activeClass = item.id === currentPage ? " is-active" : "";
        var activeMark =
          item.id === currentPage
            ? '<span style="font-size:0.875rem;">Current</span>'
            : "";
        return (
          '<a href="' +
          item.href +
          '" class="mobile-nav-link' +
          activeClass +
          '"><span>' +
          escapeHtml(item.label) +
          "</span>" +
          activeMark +
          "</a>"
        );
      })
      .join("");

    var socialIconsHtml = renderHeaderSocialIcons();

    var hamburgerSvg =
      '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="square" aria-hidden="true"><line x1="3" y1="6" x2="21" y2="6"></line><line x1="3" y1="12" x2="21" y2="12"></line><line x1="3" y1="18" x2="21" y2="18"></line></svg>';

    var closeSvg =
      '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="square" aria-hidden="true"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>';

    mount.className = "site-header";
    mount.innerHTML =
      '<div class="container header-inner">' +
      '  <a href="index.html" class="brand-lockup" aria-label="' +
      escapeHtml(cfg.brandName) +
      ' Home">' +
      '    <img src="' +
      escapeHtml(cfg.logo.darkBgPath) +
      '" alt="' +
      escapeHtml(cfg.brandName) +
      ' logo" width="26" height="26" class="brand-logo-img">' +
      '    <span class="brand-wordmark brand-wordmark-light">' +
      escapeHtml(cfg.brandName) +
      "</span>" +
      "  </a>" +
      '  <nav class="desktop-nav" aria-label="Primary Navigation">' +
      desktopLinksHtml +
      "</nav>" +
      '  <div class="header-actions">' +
      '    <div class="header-social" aria-label="Social Media Links">' +
      socialIconsHtml +
      "    </div>" +
      '    <button type="button" class="menu-toggle" id="mobile-menu-btn" aria-label="Open navigation menu" aria-expanded="false" aria-controls="mobile-drawer">' +
      hamburgerSvg +
      "    </button>" +
      "  </div>" +
      "</div>" +
      '<div class="mobile-drawer" id="mobile-drawer" aria-hidden="true">' +
      '  <nav class="mobile-nav-list" aria-label="Mobile Navigation">' +
      mobileLinksHtml +
      "  </nav>" +
      "</div>";

    var btn = document.getElementById("mobile-menu-btn");
    var drawer = document.getElementById("mobile-drawer");

    var isMenuOpen = false;
    var isHidden = false;

    function getClampedScrollY() {
      var rawY = window.scrollY || window.pageYOffset || 0;
      var maxScroll = Math.max(
        0,
        document.documentElement.scrollHeight - window.innerHeight
      );
      return Math.min(Math.max(0, rawY), maxScroll);
    }

    var lastY = getClampedScrollY();
    var scrollDir = "";
    var dirDistance = 0;
    var rafId = 0;
    var HIDE_THRESHOLD = 14;
    var SHOW_THRESHOLD = 8;

    function setHeaderHidden(hidden) {
      var nextHidden = Boolean(hidden);
      if (nextHidden && isMenuOpen) {
        nextHidden = false;
      }
      if (nextHidden && mount.contains(document.activeElement)) {
        nextHidden = false;
      }
      if (nextHidden === isHidden) return;
      isHidden = nextHidden;
      mount.classList.toggle("is-hidden", isHidden);
    }

    function setDrawerState(open) {
      if (!btn || !drawer) return;
      var nextOpen = Boolean(open);
      isMenuOpen = nextOpen;
      drawer.classList.toggle("is-open", nextOpen);
      drawer.setAttribute("aria-hidden", nextOpen ? "false" : "true");
      btn.classList.toggle("is-open", nextOpen);
      btn.setAttribute("aria-expanded", nextOpen ? "true" : "false");
      btn.setAttribute("aria-label", nextOpen ? "Close navigation menu" : "Open navigation menu");
      btn.innerHTML = nextOpen ? closeSvg : hamburgerSvg;
      document.body.classList.toggle("nav-menu-open", nextOpen);
      if (nextOpen) {
        setHeaderHidden(false);
      }
      lastY = getClampedScrollY();
      scrollDir = "";
      dirDistance = 0;
    }

    function onDocumentKeydown(e) {
      if (e.key === "Escape" && isMenuOpen) {
        setDrawerState(false);
      }
    }

    function onDocumentClick(e) {
      if (!isMenuOpen) return;
      if (!e.target || !document.contains(e.target) || mount.contains(e.target)) return;
      setDrawerState(false);
    }

    function onHistoryOrHashSync() {
      if (isMenuOpen || (drawer && drawer.classList.contains("is-open"))) {
        setDrawerState(false);
      }
      lastY = getClampedScrollY();
      if (lastY <= (mount.offsetHeight || 72)) {
        setHeaderHidden(false);
      }
    }

    function updateHeaderOnScroll() {
      rafId = 0;
      var currentY = getClampedScrollY();
      var headerHeight = mount.offsetHeight || 72;

      if (isMenuOpen) {
        setHeaderHidden(false);
        lastY = currentY;
        scrollDir = "";
        dirDistance = 0;
        return;
      }

      if (currentY <= headerHeight) {
        setHeaderHidden(false);
        lastY = currentY;
        scrollDir = "";
        dirDistance = 0;
        return;
      }

      var delta = currentY - lastY;
      if (delta === 0) return;

      var nextDir = delta > 0 ? "down" : "up";
      if (nextDir !== scrollDir) {
        scrollDir = nextDir;
        dirDistance = Math.abs(delta);
      } else {
        dirDistance += Math.abs(delta);
      }
      lastY = currentY;

      if (scrollDir === "down" && dirDistance >= HIDE_THRESHOLD) {
        setHeaderHidden(true);
      } else if (scrollDir === "up" && dirDistance >= SHOW_THRESHOLD) {
        setHeaderHidden(false);
      }
    }

    function onWindowScroll() {
      if (rafId) return;
      rafId = window.requestAnimationFrame(updateHeaderOnScroll);
    }

    function onWindowResize() {
      if (window.innerWidth >= 1024 && isMenuOpen) {
        setDrawerState(false);
      }
      lastY = getClampedScrollY();
      if (lastY <= (mount.offsetHeight || 72)) {
        setHeaderHidden(false);
      }
    }

    function cleanupHeader() {
      if (rafId) {
        window.cancelAnimationFrame(rafId);
        rafId = 0;
      }
      document.body.classList.remove("nav-menu-open");
      window.removeEventListener("scroll", onWindowScroll);
      window.removeEventListener("resize", onWindowResize);
      window.removeEventListener("pageshow", onHistoryOrHashSync);
      window.removeEventListener("hashchange", onHistoryOrHashSync);
      window.removeEventListener("pagehide", cleanupHeader);
      document.removeEventListener("keydown", onDocumentKeydown);
      document.removeEventListener("click", onDocumentClick);
    }

    if (btn && drawer) {
      btn.addEventListener("click", function () {
        setDrawerState(!isMenuOpen);
      });

      drawer.querySelectorAll("a").forEach(function (link) {
        link.addEventListener("click", function () {
          setDrawerState(false);
        });
      });

      document.addEventListener("keydown", onDocumentKeydown);
      document.addEventListener("click", onDocumentClick);
    }

    window.addEventListener("scroll", onWindowScroll, { passive: true });
    window.addEventListener("resize", onWindowResize, { passive: true });
    window.addEventListener("pageshow", onHistoryOrHashSync);
    window.addEventListener("hashchange", onHistoryOrHashSync);
    window.addEventListener("pagehide", cleanupHeader);
  }

  function renderFooter() {
    var mount = document.getElementById("site-footer");
    if (!mount) return;

    var waHref = buildWhatsAppUrl(
      "Hello " + cfg.brandName + ", I would like to enquire about personal fitness coaching."
    );
    var year = new Date().getFullYear();

    var phoneRaw = (cfg.contact && cfg.contact.phoneDisplay) || "";
    var phoneDigits = phoneRaw.replace(/[^\d+]/g, "");
    var phoneHtml =
      phoneDigits.length >= 8
        ? '<a href="tel:' +
          escapeHtml(phoneDigits) +
          '" class="footer-contact-value footer-contact-link">' +
          escapeHtml(phoneRaw) +
          "</a>"
        : '<span class="footer-contact-value">' + escapeHtml(phoneRaw) + "</span>";

    var emailRaw = (cfg.contact && cfg.contact.emailDisplay) || "";
    var emailHtml =
      emailRaw.indexOf("@") !== -1 && emailRaw.indexOf("[") === -1
        ? '<a href="mailto:' +
          escapeHtml(emailRaw.trim()) +
          '" class="footer-contact-value footer-contact-link">' +
          escapeHtml(emailRaw) +
          "</a>"
        : '<span class="footer-contact-value">' + escapeHtml(emailRaw) + "</span>";

    var whatsappRaw = (cfg.contact && cfg.contact.whatsappDisplay) || "";
    var footerSocialHtml = renderSocialIconsHtml("footer-social-btn");

    mount.className = "site-footer";
    mount.innerHTML =
      '<div class="container">' +
      '  <div class="footer-grid">' +
      '    <div class="footer-col-brand">' +
      '      <a href="index.html" class="brand-lockup" aria-label="' +
      escapeHtml(cfg.brandName) +
      ' Home">' +
      '        <img src="' +
      escapeHtml(cfg.logo.darkBgPath) +
      '" alt="' +
      escapeHtml(cfg.brandName) +
      ' logo" width="28" height="28" class="brand-logo-img">' +
      '        <span class="brand-wordmark brand-wordmark-light">' +
      escapeHtml(cfg.brandName) +
      "</span>" +
      "      </a>" +
      '      <p class="footer-tagline">' +
      escapeHtml(cfg.tagline) +
      "</p>" +
      '      <p class="footer-subtagline">Built Together. Stronger Together.</p>' +
      '      <p class="footer-desc">Fitness, performance, and wellness coaching built around unity, discipline, and personalised home, outdoor, partner, and online training.</p>' +
      '      <div class="footer-cta-wrap">' +
      '        <a href="' +
      waHref +
      '" target="_blank" rel="noopener noreferrer" class="btn btn-primary">WhatsApp Enquiry</a>' +
      "      </div>" +
      "    </div>" +
      '    <div class="footer-col-links">' +
      '      <h3 class="footer-heading">Quick Links</h3>' +
      '      <ul class="footer-links">' +
      '        <li><a href="index.html">Home</a></li>' +
      '        <li><a href="about.html">About Us</a></li>' +
      '        <li><a href="services.html">Our Services</a></li>' +
      '        <li><a href="coaches.html">Coaches</a></li>' +
      '        <li><a href="transformations.html">Transformations</a></li>' +
      '        <li><a href="contact.html">Contact Us</a></li>' +
      "      </ul>" +
      "    </div>" +
      '    <div class="footer-col-services">' +
      '      <h3 class="footer-heading">Our Services</h3>' +
      '      <ul class="footer-links">' +
      '        <li><a href="services.html#home-personal-training">Home Personal Training</a></li>' +
      '        <li><a href="services.html#outdoor-personal-training">Outdoor Personal Training</a></li>' +
      '        <li><a href="services.html#online-fitness-coaching">Online Coaching</a></li>' +
      '        <li><a href="services.html#strength-conditioning">Strength &amp; Conditioning</a></li>' +
      '        <li><a href="services.html#weight-loss">Weight Loss</a></li>' +
      '        <li><a href="services.html#muscle-gain">Muscle Gain</a></li>' +
      '        <li><a href="services.html#partner-training">Partner Training</a></li>' +
      "      </ul>" +
      "    </div>" +
      '    <div class="footer-col-connect">' +
      '      <h3 class="footer-heading">Connect With Us</h3>' +
      '      <div class="footer-contact-list">' +
      '        <div class="footer-contact-item"><span class="footer-contact-label">Phone</span>' +
      phoneHtml +
      "</div>" +
      '        <div class="footer-contact-item"><span class="footer-contact-label">WhatsApp</span><span class="footer-contact-value">' +
      escapeHtml(whatsappRaw) +
      "</span></div>" +
      '        <div class="footer-contact-item"><span class="footer-contact-label">Email</span>' +
      emailHtml +
      "</div>" +
      "      </div>" +
      '      <p class="footer-policy">' +
      escapeHtml(cfg.contact.locationPolicy) +
      "</p>" +
      (footerSocialHtml
        ? '      <div class="footer-social-row" aria-label="Social Media Links">' +
          footerSocialHtml +
          "</div>"
        : "") +
      "    </div>" +
      "  </div>" +
      '  <div class="footer-bottom">' +
      "    <p>&copy; " +
      year +
      " " +
      escapeHtml(cfg.brandName) +
      ". All rights reserved.</p>" +
      '    <p class="footer-legal-note">General fitness guidance only — not medical diagnosis or treatment.</p>' +
      "  </div>" +
      "</div>";
  }

  function hydrateTextPlaceholders() {
    var mappings = [
      ["[data-brand-name]", cfg.brandName],
      ["[data-brand-short]", cfg.brandShort],
      ["[data-brand-tagline]", cfg.tagline],
      ["[data-brand-supporting]", cfg.supportingStatement],
      ["[data-brand-core]", cfg.coreMessage],
      ["[data-contact-phone]", cfg.contact.phoneDisplay],
      ["[data-contact-whatsapp]", cfg.contact.whatsappDisplay],
      ["[data-contact-email]", cfg.contact.emailDisplay],
      ["[data-contact-cities]", cfg.contact.serviceCities],
      ["[data-location-policy]", cfg.contact.locationPolicy],
    ];

    mappings.forEach(function (pair) {
      document.querySelectorAll(pair[0]).forEach(function (el) {
        el.textContent = pair[1];
      });
    });

    document.querySelectorAll("[data-whatsapp-message]").forEach(function (anchor) {
      var msg = anchor.getAttribute("data-whatsapp-message") || "";
      anchor.setAttribute("href", buildWhatsAppUrl(msg.replace(/\{BRAND\}/g, cfg.brandName)));
      anchor.setAttribute("target", "_blank");
      anchor.setAttribute("rel", "noopener noreferrer");
    });

    var phoneLink = document.getElementById("contact-phone-link");
    if (phoneLink) {
      var phoneDigits = (cfg.contact.phoneDisplay || "").replace(/[^\d+]/g, "");
      if (phoneDigits.length >= 8) {
        phoneLink.setAttribute("href", "tel:" + phoneDigits);
      } else {
        phoneLink.setAttribute("href", "contact.html");
      }
    }

    var emailLink = document.getElementById("contact-email-link");
    if (emailLink) {
      var emailStr = cfg.contact.emailDisplay || "";
      if (emailStr.indexOf("@") !== -1 && emailStr.indexOf("[") === -1) {
        emailLink.setAttribute("href", "mailto:" + emailStr.trim());
      } else {
        emailLink.setAttribute("href", "contact.html");
      }
    }
  }

  function renderCoachesDirectory() {
    var grid = document.querySelector('[data-render="coaches"]');
    if (!grid || !cfg.coaches) return;

    grid.innerHTML = cfg.coaches
      .map(function (c) {
        var waUrl = buildWhatsAppUrl(
          "Hello " +
            cfg.brandName +
            ", I would like to enquire about coaching with " +
            c.name +
            " (" +
            c.modes.join(", ") +
            ")."
        );
        var mediaHtml = c.photo
          ? '<div class="card-media-frame coach-photo-frame">' +
            '  <img src="' +
            escapeHtml(c.photo) +
            '" alt="' +
            escapeHtml(c.photoAlt || c.name) +
            '" loading="lazy"' +
            (c.photoPosition
              ? ' style="object-position:' + escapeHtml(c.photoPosition) + ';"'
              : "") +
            " />" +
            "</div>"
          : '<div class="placeholder-slot">' +
            '  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#525c67" stroke-width="1.6" aria-hidden="true"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>' +
            '  <span class="meta-muted" style="font-weight:600;">Coach Photograph Placeholder</span>' +
            "</div>";
        var bioHtml = c.bio
          ? '<p class="card-text">' + escapeHtml(c.bio) + "</p>"
          : "";
        var qualificationsHtml = c.qualifications
          ? '<div><span class="spec-label">Qualifications</span><span class="spec-value">' +
            escapeHtml(c.qualifications) +
            "</span></div>"
          : "";

        return (
          '<article class="card-media">' +
          mediaHtml +
          '  <div class="card-media-body">' +
          '    <div style="display:flex;flex-direction:column;gap:10px;">' +
          '      <p class="meta-line">' +
          escapeHtml(c.modes.join(" · ")) +
          "</p>" +
          '      <h3 class="card-title">' +
          escapeHtml(c.name) +
          "</h3>" +
          '      <p class="meta-muted">' +
          escapeHtml(c.role) +
          "</p>" +
          bioHtml +
          '      <div class="spec-list">' +
          qualificationsHtml +
          '        <div><span class="spec-label">Experience</span><span class="spec-value">' +
          escapeHtml(c.experience) +
          "</span></div>" +
          '        <div><span class="spec-label">Specialisations</span><span class="spec-value">' +
          escapeHtml(c.specialisations.join(" · ")) +
          "</span></div>" +
          '        <div><span class="spec-label">Languages</span><span class="spec-value">' +
          escapeHtml(c.languages) +
          "</span></div>" +
          '        <div><span class="spec-label">Areas Served</span><span class="spec-value">' +
          escapeHtml(c.areasServed) +
          "</span></div>" +
          '        <div><span class="spec-label">Availability</span><span class="spec-value">' +
          escapeHtml(c.availability) +
          "</span></div>" +
          "      </div>" +
          "    </div>" +
          '    <a href="' +
          waUrl +
          '" target="_blank" rel="noopener noreferrer" class="btn btn-dark" style="width:100%;">Contact Coach</a>' +
          "  </div>" +
          "</article>"
        );
      })
      .join("");
  }

  function renderTransformationCardHtml(item, idx) {
    var storyId = item.id || "story-" + (typeof idx === "number" ? idx + 1 : 1);
    var displayTitle =
      item.clientName && String(item.clientName).trim()
        ? item.clientName
        : item.clientLabel;
    var hasBeforeAfter = Boolean(item.beforeImage && item.afterImage);
    var singleImg = item.comparisonImage || item.afterImage || item.beforeImage || "";

    var mediaInnerHtml = "";
    if (hasBeforeAfter) {
      mediaInnerHtml =
        '<div class="transformation-compare">' +
        '  <div class="transformation-panel">' +
        '    <span class="transformation-tag">Before</span>' +
        '    <img src="' +
        escapeHtml(item.beforeImage) +
        '" alt="' +
        escapeHtml(item.beforeAlt || displayTitle + " before photo") +
        '" width="480" height="600" loading="lazy">' +
        "  </div>" +
        '  <div class="transformation-panel">' +
        '    <span class="transformation-tag is-after">After</span>' +
        '    <img src="' +
        escapeHtml(item.afterImage) +
        '" alt="' +
        escapeHtml(item.afterAlt || displayTitle + " after photo") +
        '" width="480" height="600" loading="lazy">' +
        "  </div>" +
        "</div>";
    } else if (singleImg) {
      mediaInnerHtml =
        '<div class="transformation-single">' +
        '  <div class="transformation-panel">' +
        '    <span class="transformation-tag is-after">Progress</span>' +
        '    <img src="' +
        escapeHtml(singleImg) +
        '" alt="' +
        escapeHtml(item.afterAlt || item.beforeAlt || displayTitle + " transformation photo") +
        '" width="640" height="480" loading="lazy">' +
        "  </div>" +
        "</div>";
    }

    var expandSvg =
      '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><polyline points="15 3 21 3 21 9"></polyline><polyline points="9 21 3 21 3 15"></polyline><line x1="21" y1="3" x2="14" y2="10"></line><line x1="3" y1="21" x2="10" y2="14"></line></svg>';

    return (
      '<article class="card-media transformation-card">' +
      '  <button type="button" class="transformation-media-btn" data-lightbox-open data-story-id="' +
      escapeHtml(storyId) +
      '" aria-label="View larger Before and After photos for ' +
      escapeHtml(displayTitle) +
      '">' +
      mediaInnerHtml +
      '    <span class="transformation-zoom-hint">' +
      expandSvg +
      "<span>View Larger</span></span>" +
      "  </button>" +
      '  <div class="card-media-body">' +
      '    <div style="display:flex;flex-direction:column;gap:8px;">' +
      '      <p class="meta-line">' +
      escapeHtml(item.goal) +
      " · " +
      escapeHtml(item.format) +
      "</p>" +
      '      <h3 class="card-title">' +
      escapeHtml(displayTitle) +
      "</h3>" +
      '      <p class="transformation-duration">Duration: <span>' +
      escapeHtml(item.timeframe) +
      "</span></p>" +
      '      <p class="card-text">' +
      escapeHtml(item.story) +
      "</p>" +
      "    </div>" +
      (item.quote
        ? '    <p class="transformation-quote">' + escapeHtml(item.quote) + "</p>"
        : "") +
      "  </div>" +
      "</article>"
    );
  }

  function renderTransformations() {
    var grid = document.querySelector('[data-render="transformations"]');
    if (!grid || !cfg.transformations) return;

    var filterButtons = document.querySelectorAll("[data-goal-filter]");

    function draw(goal) {
      var items =
        goal === "All"
          ? cfg.transformations
          : cfg.transformations.filter(function (t) {
              return t.goal === goal;
            });

      grid.innerHTML = items.map(renderTransformationCardHtml).join("");
    }

    filterButtons.forEach(function (btn) {
      btn.addEventListener("click", function () {
        var goal = btn.getAttribute("data-goal-filter") || "All";
        filterButtons.forEach(function (b) {
          b.classList.remove("is-active");
        });
        btn.classList.add("is-active");
        draw(goal);
      });
    });

    draw("All");
  }

  function initCardCarousel(opts) {
    var section = opts.section;
    var mount = opts.mount;
    var viewport = opts.viewport;
    var track = opts.track;
    var prevBtn = opts.prevBtn;
    var nextBtn = opts.nextBtn;
    var dotsContainer = opts.dotsContainer;
    var counterEl = opts.counterEl;
    var total = opts.total;
    var cloneCount = opts.cloneCount;
    var realStart = cloneCount;
    var autoplayMs = opts.autoplayMs || 0;
    var dotLabelPrefix = opts.dotLabelPrefix || "Show slide";

    if (!section || !mount || !viewport || !track || total <= 0) return null;

    if (typeof mount._destroyCarousel === "function") {
      mount._destroyCarousel();
    }

    if (dotsContainer && !dotsContainer.children.length) {
      var dotsMarkup = [];
      for (var d = 0; d < total; d++) {
        var activeCls = d === 0 ? " is-active" : "";
        var currentAttr = d === 0 ? ' aria-current="true"' : "";
        dotsMarkup.push(
          '<button type="button" class="stories-dot-btn' +
            activeCls +
            '" data-carousel-dot="' +
            d +
            '" aria-label="' +
            escapeHtml(dotLabelPrefix) +
            " " +
            (d + 1) +
            " of " +
            total +
            '"' +
            currentAttr +
            '><span class="stories-dot" aria-hidden="true"></span></button>'
        );
      }
      dotsContainer.innerHTML = dotsMarkup.join("");
    }

    var dotBtns = mount.querySelectorAll("[data-carousel-dot], [data-story-dot]");

    if (prevBtn) prevBtn.disabled = total <= 1;
    if (nextBtn) nextBtn.disabled = total <= 1;

    var activeIndex = 0;
    var trackIndex = realStart;
    var isAnimating = false;
    var fallbackTimer = null;
    var autoplayTimer = null;
    var resizeRaf = null;
    var isHovered = false;
    var isFocused = false;
    var isTouching = false;
    var isDestroyed = false;

    var motionMq = window.matchMedia
      ? window.matchMedia("(prefers-reduced-motion: reduce)")
      : null;

    function prefersReducedMotion() {
      return !!(motionMq && motionMq.matches);
    }

    function getDesiredVisibleCount() {
      var w = window.innerWidth;
      if (w >= 1024) return Math.min(3, total);
      if (w >= 768) return Math.min(2, total);
      return 1;
    }

    function getStepPx() {
      var slides = track.children;
      if (slides.length >= 2) {
        return (
          slides[1].getBoundingClientRect().left -
          slides[0].getBoundingClientRect().left
        );
      }
      return viewport.getBoundingClientRect().width;
    }

    function setTranslate(px, animate) {
      if (animate && !prefersReducedMotion()) {
        track.style.transition =
          "transform 420ms cubic-bezier(0.16, 1, 0.3, 1)";
      } else {
        track.style.transition = "none";
      }
      track.style.transform = "translate3d(" + px + "px, 0, 0)";
    }

    function formatCounter(num) {
      return num < 10 ? "0" + num : String(num);
    }

    function updateIndicators() {
      dotBtns.forEach(function (dot, idx) {
        var isActive = idx === activeIndex;
        dot.classList.toggle("is-active", isActive);
        if (isActive) {
          dot.setAttribute("aria-current", "true");
        } else {
          dot.removeAttribute("aria-current");
        }
      });
      if (counterEl) {
        counterEl.textContent =
          formatCounter(activeIndex + 1) + " / " + formatCounter(total);
      }
    }

    function normalizeTrackIndex() {
      if (total <= 1) return;
      if (trackIndex >= realStart + total) {
        trackIndex -= total;
        setTranslate(-trackIndex * getStepPx(), false);
        void track.offsetHeight;
      } else if (trackIndex < realStart) {
        trackIndex += total;
        setTranslate(-trackIndex * getStepPx(), false);
        void track.offsetHeight;
      }
    }

    function finishTransition() {
      if (fallbackTimer) {
        clearTimeout(fallbackTimer);
        fallbackTimer = null;
      }
      normalizeTrackIndex();
      isAnimating = false;
    }

    function syncLayout() {
      track.style.setProperty(
        "--cards-visible",
        String(getDesiredVisibleCount())
      );
      normalizeTrackIndex();
      setTranslate(-trackIndex * getStepPx(), false);
    }

    function canAutoplay() {
      return (
        !isDestroyed &&
        autoplayMs > 0 &&
        total > 1 &&
        !document.hidden &&
        !prefersReducedMotion() &&
        !isHovered &&
        !isFocused &&
        !isTouching
      );
    }

    function stopAutoplay() {
      if (autoplayTimer) {
        clearInterval(autoplayTimer);
        autoplayTimer = null;
      }
    }

    function startAutoplay() {
      stopAutoplay();
      if (!canAutoplay()) return;
      autoplayTimer = setInterval(function () {
        if (!canAutoplay() || isAnimating) return;
        goBy(1, false);
      }, autoplayMs);
    }

    function resetAutoplay() {
      stopAutoplay();
      startAutoplay();
    }

    function goBy(delta, isManual) {
      if (total <= 1 || isAnimating || isDestroyed) return;
      var stepPx = getStepPx();
      trackIndex += delta;
      activeIndex = (activeIndex + delta + total) % total;
      updateIndicators();

      if (isManual !== false) {
        resetAutoplay();
      }

      if (prefersReducedMotion()) {
        setTranslate(-trackIndex * stepPx, false);
        normalizeTrackIndex();
        return;
      }

      isAnimating = true;
      setTranslate(-trackIndex * stepPx, true);
      fallbackTimer = setTimeout(finishTransition, 480);
    }

    function goToDot(targetIdx) {
      if (total <= 1 || isAnimating || isDestroyed || targetIdx === activeIndex) {
        return;
      }
      var stepPx = getStepPx();
      var diff = targetIdx - activeIndex;
      trackIndex += diff;
      activeIndex = targetIdx;
      updateIndicators();
      resetAutoplay();

      if (prefersReducedMotion()) {
        setTranslate(-trackIndex * stepPx, false);
        normalizeTrackIndex();
        return;
      }

      isAnimating = true;
      setTranslate(-trackIndex * stepPx, true);
      fallbackTimer = setTimeout(finishTransition, 480);
    }

    function onTransitionEnd(e) {
      if (e.target === track && e.propertyName === "transform") {
        finishTransition();
      }
    }

    function onPrevClick() {
      goBy(-1, true);
    }

    function onNextClick() {
      goBy(1, true);
    }

    function onDotClick(e) {
      var btn = e.currentTarget;
      var raw =
        btn.getAttribute("data-carousel-dot") ||
        btn.getAttribute("data-story-dot");
      var idx = parseInt(raw, 10);
      if (!isNaN(idx)) goToDot(idx);
    }

    function onKeyDown(e) {
      if (e.key === "ArrowLeft") {
        e.preventDefault();
        goBy(-1, true);
      } else if (e.key === "ArrowRight") {
        e.preventDefault();
        goBy(1, true);
      }
    }

    function onMouseEnter() {
      isHovered = true;
      stopAutoplay();
    }

    function onMouseLeave() {
      isHovered = false;
      startAutoplay();
    }

    function onFocusIn() {
      isFocused = true;
      stopAutoplay();
    }

    function onFocusOut() {
      requestAnimationFrame(function () {
        if (!isDestroyed && !section.contains(document.activeElement)) {
          isFocused = false;
          startAutoplay();
        }
      });
    }

    function onVisibilityChange() {
      if (document.hidden) {
        stopAutoplay();
      } else {
        startAutoplay();
      }
    }

    function onMotionChange() {
      if (prefersReducedMotion()) {
        stopAutoplay();
      } else {
        startAutoplay();
      }
    }

    /* Touch / Swipe Gesture Support for Mobile */
    var startX = null;
    var startY = null;
    var startTime = 0;
    var dragMode = null;
    var dragDx = 0;
    var baseTranslate = 0;
    var dragStepPx = 0;
    var suppressClickUntil = 0;

    function onTouchStart(e) {
      if (total <= 1 || isAnimating || e.touches.length !== 1) return;
      isTouching = true;
      stopAutoplay();
      startX = e.touches[0].clientX;
      startY = e.touches[0].clientY;
      startTime = Date.now();
      dragMode = null;
      dragDx = 0;
      dragStepPx = getStepPx();
      baseTranslate = -trackIndex * dragStepPx;
    }

    function onTouchMove(e) {
      if (startX === null || dragMode === "vertical" || e.touches.length !== 1) {
        return;
      }
      var dx = e.touches[0].clientX - startX;
      var dy = e.touches[0].clientY - startY;

      if (dragMode === null) {
        if (Math.abs(dy) > 8 && Math.abs(dy) > Math.abs(dx)) {
          dragMode = "vertical";
          return;
        }
        if (Math.abs(dx) > 8 && Math.abs(dx) >= Math.abs(dy)) {
          dragMode = "horizontal";
        } else {
          return;
        }
      }

      if (dragMode === "horizontal") {
        var maxDrag = dragStepPx * 0.9;
        dragDx = Math.max(-maxDrag, Math.min(maxDrag, dx));
        setTranslate(baseTranslate + dragDx, false);
        if (e.cancelable) e.preventDefault();
      }
    }

    function onTouchEnd() {
      isTouching = false;
      if (startX !== null && dragMode === "horizontal") {
        if (Math.abs(dragDx) > 8) {
          suppressClickUntil = Date.now() + 350;
        }
        var elapsed = Date.now() - startTime;
        var threshold =
          elapsed < 260
            ? 28
            : Math.min(56, viewport.getBoundingClientRect().width * 0.16);

        if (dragDx <= -threshold) {
          goBy(1, true);
        } else if (dragDx >= threshold) {
          goBy(-1, true);
        } else {
          isAnimating = true;
          setTranslate(baseTranslate, true);
          fallbackTimer = setTimeout(finishTransition, 360);
          resetAutoplay();
        }
      } else {
        resetAutoplay();
      }
      startX = null;
      startY = null;
      dragMode = null;
      dragDx = 0;
    }

    function onViewportCaptureClick(e) {
      if (Date.now() < suppressClickUntil) {
        e.preventDefault();
        e.stopPropagation();
      }
    }

    function scheduleSync() {
      if (resizeRaf) cancelAnimationFrame(resizeRaf);
      resizeRaf = requestAnimationFrame(function () {
        if (isDestroyed) return;
        isAnimating = false;
        if (fallbackTimer) {
          clearTimeout(fallbackTimer);
          fallbackTimer = null;
        }
        syncLayout();
      });
    }

    track.addEventListener("transitionend", onTransitionEnd);
    if (prevBtn) prevBtn.addEventListener("click", onPrevClick);
    if (nextBtn) nextBtn.addEventListener("click", onNextClick);
    dotBtns.forEach(function (dot) {
      dot.addEventListener("click", onDotClick);
    });
    section.addEventListener("keydown", onKeyDown);

    if (autoplayMs > 0) {
      mount.addEventListener("mouseenter", onMouseEnter);
      mount.addEventListener("mouseleave", onMouseLeave);
      section.addEventListener("focusin", onFocusIn);
      section.addEventListener("focusout", onFocusOut);
      document.addEventListener("visibilitychange", onVisibilityChange);
      if (motionMq) {
        if (motionMq.addEventListener) {
          motionMq.addEventListener("change", onMotionChange);
        } else if (motionMq.addListener) {
          motionMq.addListener(onMotionChange);
        }
      }
    }

    viewport.addEventListener("touchstart", onTouchStart, { passive: true });
    viewport.addEventListener("touchmove", onTouchMove, { passive: false });
    viewport.addEventListener("touchend", onTouchEnd, { passive: true });
    viewport.addEventListener("touchcancel", onTouchEnd, { passive: true });
    viewport.addEventListener("click", onViewportCaptureClick, true);
    window.addEventListener("resize", scheduleSync);

    var ro = null;
    if ("ResizeObserver" in window) {
      ro = new ResizeObserver(scheduleSync);
      ro.observe(viewport);
    }

    function destroy() {
      if (isDestroyed) return;
      isDestroyed = true;
      stopAutoplay();
      if (fallbackTimer) {
        clearTimeout(fallbackTimer);
        fallbackTimer = null;
      }
      if (resizeRaf) {
        cancelAnimationFrame(resizeRaf);
        resizeRaf = null;
      }
      if (ro) {
        ro.disconnect();
        ro = null;
      }
      track.removeEventListener("transitionend", onTransitionEnd);
      if (prevBtn) prevBtn.removeEventListener("click", onPrevClick);
      if (nextBtn) nextBtn.removeEventListener("click", onNextClick);
      dotBtns.forEach(function (dot) {
        dot.removeEventListener("click", onDotClick);
      });
      section.removeEventListener("keydown", onKeyDown);
      if (autoplayMs > 0) {
        mount.removeEventListener("mouseenter", onMouseEnter);
        mount.removeEventListener("mouseleave", onMouseLeave);
        section.removeEventListener("focusin", onFocusIn);
        section.removeEventListener("focusout", onFocusOut);
        document.removeEventListener("visibilitychange", onVisibilityChange);
        if (motionMq) {
          if (motionMq.removeEventListener) {
            motionMq.removeEventListener("change", onMotionChange);
          } else if (motionMq.removeListener) {
            motionMq.removeListener(onMotionChange);
          }
        }
      }
      viewport.removeEventListener("touchstart", onTouchStart);
      viewport.removeEventListener("touchmove", onTouchMove);
      viewport.removeEventListener("touchend", onTouchEnd);
      viewport.removeEventListener("touchcancel", onTouchEnd);
      viewport.removeEventListener("click", onViewportCaptureClick, true);
      window.removeEventListener("resize", scheduleSync);
      window.removeEventListener("pagehide", destroy);
    }

    window.addEventListener("pagehide", destroy);
    mount._destroyCarousel = destroy;

    updateIndicators();
    syncLayout();
    requestAnimationFrame(syncLayout);
    startAutoplay();

    return destroy;
  }

  function renderServicesCarousel() {
    var section = document.querySelector("[data-services-section]");
    var mount = document.querySelector("[data-services-carousel]");
    var viewport = mount && mount.querySelector("[data-services-viewport]");
    var track = mount && mount.querySelector("[data-services-track]");
    if (!section || !mount || !viewport || !track) return;

    var cards = Array.prototype.slice.call(track.children);
    var total = cards.length;
    if (!total) return;

    cards.forEach(function (card) {
      card.querySelectorAll("img").forEach(function (img) {
        img.loading = "eager";
      });
    });

    function createSlide(node, isClone) {
      var slide = document.createElement("div");
      slide.className = "stories-slide";
      if (isClone) {
        slide.setAttribute("aria-hidden", "true");
        slide.setAttribute("data-carousel-clone", "true");
        node.querySelectorAll("a, button").forEach(function (el) {
          el.setAttribute("tabindex", "-1");
        });
      }
      slide.appendChild(node);
      return slide;
    }

    var cloneCount = total > 1 ? Math.min(3, total) : 0;
    var frag = document.createDocumentFragment();
    var i;

    for (i = 0; i < cloneCount; i++) {
      var tailClone = cards[(total - cloneCount + i) % total].cloneNode(true);
      frag.appendChild(createSlide(tailClone, true));
    }
    for (i = 0; i < total; i++) {
      frag.appendChild(createSlide(cards[i], false));
    }
    for (i = 0; i < cloneCount; i++) {
      var headClone = cards[i % total].cloneNode(true);
      frag.appendChild(createSlide(headClone, true));
    }

    track.innerHTML = "";
    track.appendChild(frag);

    initCardCarousel({
      section: section,
      mount: mount,
      viewport: viewport,
      track: track,
      prevBtn: section.querySelector("[data-services-prev]"),
      nextBtn: section.querySelector("[data-services-next]"),
      dotsContainer: mount.querySelector("[data-services-dots]"),
      counterEl: mount.querySelector("[data-services-counter]"),
      total: total,
      cloneCount: cloneCount,
      autoplayMs: 3000,
      dotLabelPrefix: "Show service",
    });
  }

  function renderTransformationsCarousel() {
    var mount = document.querySelector('[data-render="transformations-carousel"]');
    if (!mount || !cfg.transformations || !cfg.transformations.length) return;

    var items = cfg.transformations;
    var total = items.length;
    var cloneCount = total > 1 ? Math.min(3, total) : 0;

    var slideEntries = [];
    var i;
    for (i = 0; i < cloneCount; i++) {
      slideEntries.push({
        item: items[(total - cloneCount + i) % total],
        isClone: true,
      });
    }
    for (i = 0; i < total; i++) {
      slideEntries.push({
        item: items[i],
        isClone: false,
      });
    }
    for (i = 0; i < cloneCount; i++) {
      slideEntries.push({
        item: items[i % total],
        isClone: true,
      });
    }

    var slidesHtml = slideEntries
      .map(function (entry, idx) {
        var cloneAttrs = entry.isClone
          ? ' aria-hidden="true" data-carousel-clone="true"'
          : "";
        return (
          '<div class="stories-slide"' +
          cloneAttrs +
          ">" +
          renderTransformationCardHtml(entry.item, idx) +
          "</div>"
        );
      })
      .join("");

    mount.innerHTML =
      '<div class="stories-carousel-stage">' +
      '  <div class="stories-viewport" data-stories-viewport>' +
      '    <div class="stories-track" data-stories-track>' +
      slidesHtml +
      "    </div>" +
      "  </div>" +
      '  <div class="stories-bottom-controls">' +
      '    <div class="stories-nav-controls" role="group" aria-label="Transformations carousel navigation">' +
      '      <button type="button" class="stories-arrow stories-arrow-prev" data-stories-prev aria-label="Previous client progress story">' +
      '        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><polyline points="15 18 9 12 15 6"></polyline></svg>' +
      "      </button>" +
      '      <button type="button" class="stories-arrow stories-arrow-next" data-stories-next aria-label="Next client progress story">' +
      '        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><polyline points="9 18 15 12 9 6"></polyline></svg>' +
      "      </button>" +
      "    </div>" +
      '    <div class="stories-pagination">' +
      '      <div class="stories-dots" role="group" aria-label="Client progress story pagination" data-stories-dots></div>' +
      '      <span class="num-tabular stories-counter" data-stories-counter aria-live="polite">01 / 0' +
      total +
      "</span>" +
      "    </div>" +
      "  </div>" +
      "</div>";

    var section = mount.closest("section") || mount;
    initCardCarousel({
      section: section,
      mount: mount,
      viewport: mount.querySelector("[data-stories-viewport]"),
      track: mount.querySelector("[data-stories-track]"),
      prevBtn: mount.querySelector("[data-stories-prev]"),
      nextBtn: mount.querySelector("[data-stories-next]"),
      dotsContainer: mount.querySelector("[data-stories-dots]"),
      counterEl: mount.querySelector("[data-stories-counter]"),
      total: total,
      cloneCount: cloneCount,
      autoplayMs: 0,
      dotLabelPrefix: "Show client progress story",
    });
  }

  function initTransformationLightbox() {
    var items = cfg.transformations || [];
    if (!items.length) return;
    if (!document.querySelector("[data-lightbox-open]")) return;

    var existing = document.getElementById("transformation-lightbox");
    if (existing) existing.remove();

    var backdrop = document.createElement("div");
    backdrop.id = "transformation-lightbox";
    backdrop.className = "lightbox-backdrop";
    backdrop.setAttribute("role", "dialog");
    backdrop.setAttribute("aria-modal", "true");
    backdrop.setAttribute("aria-labelledby", "lightbox-title");
    backdrop.hidden = true;

    backdrop.innerHTML =
      '<div class="lightbox-dialog">' +
      '  <div class="lightbox-header">' +
      '    <div>' +
      '      <p class="meta-line" data-lightbox-meta></p>' +
      '      <h3 class="lightbox-title" id="lightbox-title" data-lightbox-title></h3>' +
      "    </div>" +
      '    <button type="button" class="lightbox-close" data-lightbox-close aria-label="Close photo lightbox">' +
      '      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="square" aria-hidden="true"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>' +
      "    </button>" +
      "  </div>" +
      '  <div class="lightbox-compare" data-lightbox-compare></div>' +
      '  <div class="lightbox-meta-row" data-lightbox-details></div>' +
      '  <p class="lightbox-story" data-lightbox-story></p>' +
      '  <p class="lightbox-quote" data-lightbox-quote></p>' +
      '  <p class="lightbox-placeholder-note" data-lightbox-note></p>' +
      '  <div class="lightbox-footer">' +
      '    <div class="lightbox-nav-group">' +
      '      <button type="button" class="lightbox-nav-btn" data-lightbox-prev aria-label="Previous transformation">&larr; Previous</button>' +
      '      <button type="button" class="lightbox-nav-btn" data-lightbox-next aria-label="Next transformation">Next &rarr;</button>' +
      "    </div>" +
      '    <span class="num-tabular" style="font-size:0.875rem;color:#929ba5;" data-lightbox-counter></span>' +
      "  </div>" +
      "</div>";

    document.body.appendChild(backdrop);

    var closeBtn = backdrop.querySelector("[data-lightbox-close]");
    var prevBtn = backdrop.querySelector("[data-lightbox-prev]");
    var nextBtn = backdrop.querySelector("[data-lightbox-next]");
    var metaEl = backdrop.querySelector("[data-lightbox-meta]");
    var titleEl = backdrop.querySelector("[data-lightbox-title]");
    var compareEl = backdrop.querySelector("[data-lightbox-compare]");
    var detailsEl = backdrop.querySelector("[data-lightbox-details]");
    var storyEl = backdrop.querySelector("[data-lightbox-story]");
    var quoteEl = backdrop.querySelector("[data-lightbox-quote]");
    var noteEl = backdrop.querySelector("[data-lightbox-note]");
    var counterEl = backdrop.querySelector("[data-lightbox-counter]");

    var activeIdx = 0;
    var lastTrigger = null;

    function renderLightboxStory(index) {
      activeIdx = (index + items.length) % items.length;
      var item = items[activeIdx];
      var displayTitle =
        item.clientName && String(item.clientName).trim()
          ? item.clientName
          : item.clientLabel;

      if (metaEl) metaEl.textContent = item.goal + " · " + item.format;
      if (titleEl) titleEl.textContent = displayTitle;
      if (detailsEl) {
        detailsEl.innerHTML =
          "<span><strong>Duration:</strong> " +
          escapeHtml(item.timeframe) +
          "</span><span><strong>Mode:</strong> " +
          escapeHtml(item.format) +
          "</span>";
      }
      if (storyEl) storyEl.textContent = item.story || "";
      if (quoteEl) {
        quoteEl.textContent = item.quote || "";
        quoteEl.hidden = !item.quote;
      }
      if (noteEl) {
        noteEl.textContent = item.isPlaceholderMedia
          ? "Placeholder comparison imagery shown until consented client photos are provided."
          : "";
        noteEl.hidden = !item.isPlaceholderMedia;
      }
      if (counterEl) {
        counterEl.textContent =
          (activeIdx < 9 ? "0" : "") +
          (activeIdx + 1) +
          " / " +
          (items.length < 10 ? "0" : "") +
          items.length;
      }

      if (compareEl) {
        var hasBoth = Boolean(item.beforeImage && item.afterImage);
        compareEl.classList.toggle("is-single", !hasBoth);
        if (hasBoth) {
          compareEl.innerHTML =
            '<div class="lightbox-panel">' +
            '  <span class="transformation-tag">Before</span>' +
            '  <img src="' +
            escapeHtml(item.beforeImage) +
            '" alt="' +
            escapeHtml(item.beforeAlt || displayTitle + " before photo") +
            '">' +
            "</div>" +
            '<div class="lightbox-panel">' +
            '  <span class="transformation-tag is-after">After</span>' +
            '  <img src="' +
            escapeHtml(item.afterImage) +
            '" alt="' +
            escapeHtml(item.afterAlt || displayTitle + " after photo") +
            '">' +
            "</div>";
        } else {
          var singleImg =
            item.comparisonImage || item.afterImage || item.beforeImage || "";
          compareEl.innerHTML = singleImg
            ? '<div class="lightbox-panel">' +
              '  <span class="transformation-tag is-after">Progress</span>' +
              '  <img src="' +
              escapeHtml(singleImg) +
              '" alt="' +
              escapeHtml(item.afterAlt || item.beforeAlt || displayTitle) +
              '">' +
              "</div>"
            : "";
        }
      }
    }

    function openLightboxById(storyId, triggerEl) {
      var foundIdx = 0;
      for (var i = 0; i < items.length; i++) {
        if ((items[i].id || "story-" + (i + 1)) === storyId) {
          foundIdx = i;
          break;
        }
      }
      lastTrigger = triggerEl || document.activeElement;
      renderLightboxStory(foundIdx);
      backdrop.hidden = false;
      document.body.classList.add("lightbox-open");
      if (closeBtn) closeBtn.focus();
    }

    function closeLightbox() {
      if (backdrop.hidden) return;
      backdrop.hidden = true;
      document.body.classList.remove("lightbox-open");
      if (lastTrigger && typeof lastTrigger.focus === "function" && document.contains(lastTrigger)) {
        lastTrigger.focus();
      }
      lastTrigger = null;
    }

    function onDocumentTriggerClick(e) {
      var trigger = e.target.closest && e.target.closest("[data-lightbox-open]");
      if (!trigger) return;
      e.preventDefault();
      openLightboxById(trigger.getAttribute("data-story-id") || "", trigger);
    }

    function onBackdropClick(e) {
      if (e.target === backdrop) {
        closeLightbox();
      }
    }

    function onKeyDown(e) {
      if (backdrop.hidden) return;
      if (e.key === "Escape") {
        e.preventDefault();
        closeLightbox();
      } else if (e.key === "ArrowLeft" && items.length > 1) {
        e.preventDefault();
        renderLightboxStory(activeIdx - 1);
      } else if (e.key === "ArrowRight" && items.length > 1) {
        e.preventDefault();
        renderLightboxStory(activeIdx + 1);
      }
    }

    function cleanupLightbox() {
      document.body.classList.remove("lightbox-open");
      document.removeEventListener("click", onDocumentTriggerClick);
      document.removeEventListener("keydown", onKeyDown);
      backdrop.removeEventListener("click", onBackdropClick);
      window.removeEventListener("pagehide", cleanupLightbox);
    }

    if (closeBtn) closeBtn.addEventListener("click", closeLightbox);
    if (prevBtn) {
      prevBtn.disabled = items.length <= 1;
      prevBtn.addEventListener("click", function () {
        renderLightboxStory(activeIdx - 1);
      });
    }
    if (nextBtn) {
      nextBtn.disabled = items.length <= 1;
      nextBtn.addEventListener("click", function () {
        renderLightboxStory(activeIdx + 1);
      });
    }

    document.addEventListener("click", onDocumentTriggerClick);
    document.addEventListener("keydown", onKeyDown);
    backdrop.addEventListener("click", onBackdropClick);
    window.addEventListener("pagehide", cleanupLightbox);
  }

  function renderTestimonialsCarousel() {
    var mount = document.querySelector('[data-render="testimonials"]');
    if (!mount || !cfg.testimonials || !cfg.testimonials.length) return;

    var idx = 0;

    function update() {
      var item = cfg.testimonials[idx];
      var quoteEl = mount.querySelector("[data-testimonial-quote]");
      var authorEl = mount.querySelector("[data-testimonial-author]");
      var contextEl = mount.querySelector("[data-testimonial-context]");
      var counterEl = mount.querySelector("[data-testimonial-counter]");

      if (quoteEl) quoteEl.textContent = item.quote;
      if (authorEl) authorEl.textContent = item.author;
      if (contextEl) contextEl.textContent = item.context;
      if (counterEl) {
        counterEl.textContent =
          "0" + (idx + 1) + " / 0" + cfg.testimonials.length;
      }
    }

    var prevBtn = mount.querySelector("[data-testimonial-prev]");
    var nextBtn = mount.querySelector("[data-testimonial-next]");

    if (prevBtn) {
      prevBtn.addEventListener("click", function () {
        idx = (idx - 1 + cfg.testimonials.length) % cfg.testimonials.length;
        update();
      });
    }

    if (nextBtn) {
      nextBtn.addEventListener("click", function () {
        idx = (idx + 1) % cfg.testimonials.length;
        update();
      });
    }

    update();
  }

  function renderSocialLinks() {
    var mount = document.querySelector('[data-render="social-links"]');
    if (!mount || !cfg.contact || !cfg.contact.socialLinks) return;

    mount.innerHTML = cfg.contact.socialLinks
      .map(function (s) {
        var key = (s.id || s.label || "").toLowerCase();
        var isWhatsApp = key === "whatsapp";
        var resolvedUrl = isWhatsApp ? resolveConfiguredWhatsAppUrl(s.url) : s.url;
        var attrs = resolvedUrl
          ? 'href="' + escapeHtml(resolvedUrl) + '" target="_blank" rel="noopener noreferrer"'
          : isWhatsApp
          ? 'href="#" data-whatsapp-unconfigured="true" aria-label="Chat with us on WhatsApp"'
          : 'href="contact.html"';
        return (
          "<li>" +
          "  <a " +
          attrs +
          ' class="social-tap-row">' +
          '    <span style="font-weight:600;">' +
          escapeHtml(s.label) +
          "</span>" +
          '    <span class="meta-muted">' +
          escapeHtml(s.handle) +
          "</span>" +
          "  </a>" +
          "</li>"
        );
      })
      .join("");
  }

  function initWhatsAppTopicSwitcher() {
    var buttons = document.querySelectorAll("[data-wa-topic]");
    var targetBtn = document.getElementById("contact-whatsapp-cta");
    var previewEl = document.getElementById("contact-whatsapp-preview");
    if (!buttons.length || !targetBtn) return;

    function setTopic(topicText) {
      var msg =
        "Hello " +
        cfg.brandName +
        ", I would like to enquire about: " +
        topicText +
        ". Please share coach availability in my area.";
      targetBtn.setAttribute("href", buildWhatsAppUrl(msg));
      targetBtn.setAttribute("target", "_blank");
      targetBtn.setAttribute("rel", "noopener noreferrer");
      if (previewEl) {
        previewEl.textContent = '"' + msg + '"';
      }
    }

    buttons.forEach(function (btn) {
      btn.addEventListener("click", function () {
        buttons.forEach(function (b) {
          b.classList.remove("is-active");
        });
        btn.classList.add("is-active");
        setTopic(btn.getAttribute("data-wa-topic") || "Personal Training");
      });
    });

    setTopic("Home Personal Training");
  }

  function initScrollReveal() {
    var items = document.querySelectorAll(".reveal");
    if (!items.length) return;

    if (!("IntersectionObserver" in window)) {
      items.forEach(function (el) {
        el.classList.add("is-visible");
      });
      return;
    }

    var observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.06, rootMargin: "0px 0px -20px 0px" }
    );

    items.forEach(function (el) {
      observer.observe(el);
    });
  }

  document.addEventListener("DOMContentLoaded", function () {
    syncThemeColors();
    updateDocumentTitle();
    renderHeader();
    renderFooter();
    hydrateTextPlaceholders();
    renderCoachesDirectory();
    renderServicesCarousel();
    renderTransformations();
    renderTransformationsCarousel();
    initTransformationLightbox();
    renderTestimonialsCarousel();
    renderSocialLinks();
    initWhatsAppTopicSwitcher();
    initScrollReveal();

    document.addEventListener("click", function (e) {
      var unconfigured = e.target.closest && e.target.closest('[data-whatsapp-unconfigured="true"]');
      if (unconfigured) {
        e.preventDefault();
      }
    });
  });
})();
