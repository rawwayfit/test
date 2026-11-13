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
    var pageTitle = document.body.getAttribute("data-page-title");
    if (pageTitle) {
      document.title = pageTitle + " — " + cfg.brandName;
    }
  }

  var SOCIAL_SVGS = {
    instagram:
      '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M7.75 2h8.5A5.75 5.75 0 0 1 22 7.75v8.5A5.75 5.75 0 0 1 16.25 22h-8.5A5.75 5.75 0 0 1 2 16.25v-8.5A5.75 5.75 0 0 1 7.75 2Zm0 1.8A3.95 3.95 0 0 0 3.8 7.75v8.5a3.95 3.95 0 0 0 3.95 3.95h8.5a3.95 3.95 0 0 0 3.95-3.95v-8.5a3.95 3.95 0 0 0-3.95-3.95h-8.5Zm9.55 2.4a1.15 1.15 0 1 1 0 2.3 1.15 1.15 0 0 1 0-2.3ZM12 7a5 5 0 1 1 0 10 5 5 0 0 1 0-10Zm0 1.8a3.2 3.2 0 1 0 0 6.4 3.2 3.2 0 0 0 0-6.4Z"/></svg>',
    facebook:
      '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M13.5 22v-8.25h2.77l.41-3.22H13.5V8.48c0-.93.26-1.57 1.6-1.57h1.7V4.03c-.3-.04-1.31-.13-2.49-.13-2.46 0-4.15 1.5-4.15 4.26v2.37H7.38v3.22h2.78V22h3.34Z"/></svg>',
    youtube:
      '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M21.58 7.19a2.5 2.5 0 0 0-1.76-1.77C18.25 5 12 5 12 5s-6.25 0-7.82.42A2.5 2.5 0 0 0 2.42 7.2 26.2 26.2 0 0 0 2 12a26.2 26.2 0 0 0 .42 4.81 2.5 2.5 0 0 0 1.76 1.77C5.75 19 12 19 12 19s6.25 0 7.82-.42a2.5 2.5 0 0 0 1.76-1.77A26.2 26.2 0 0 0 22 12a26.2 26.2 0 0 0-.42-4.81ZM10 15V9l5.2 3-5.2 3Z"/></svg>',
    linkedin:
      '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M19.5 3h-15A1.5 1.5 0 0 0 3 4.5v15A1.5 1.5 0 0 0 4.5 21h15a1.5 1.5 0 0 0 1.5-1.5v-15A1.5 1.5 0 0 0 19.5 3ZM8.34 18.34H5.67V9.75h2.67v8.59ZM7 8.58a1.55 1.55 0 1 1 0-3.1 1.55 1.55 0 0 1 0 3.1Zm11.34 9.76h-2.66v-4.18c0-1-.02-2.28-1.39-2.28-1.39 0-1.6 1.09-1.6 2.21v4.25h-2.66V9.75h2.55v1.17h.04c.36-.67 1.22-1.38 2.52-1.38 2.69 0 3.19 1.77 3.19 4.07v4.73Z"/></svg>',
  };

  function renderHeaderSocialIcons() {
    var links = (cfg.contact && cfg.contact.socialLinks) || [];
    return links
      .map(function (item) {
        var key = (item.id || item.label || "").toLowerCase();
        var svg = SOCIAL_SVGS[key];
        if (!svg) return "";
        var url = item.url || "#";
        return (
          '<a href="' +
          escapeHtml(url) +
          '" target="_blank" rel="noopener noreferrer" class="social-icon-link" aria-label="' +
          escapeHtml(cfg.brandName + " on " + item.label) +
          '" title="' +
          escapeHtml(item.label) +
          '">' +
          svg +
          "</a>"
        );
      })
      .join("");
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
      '    <button type="button" class="menu-toggle" id="mobile-menu-btn" aria-label="Open navigation menu" aria-expanded="false">' +
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

    function setDrawerState(open) {
      if (!btn || !drawer) return;
      drawer.classList.toggle("is-open", open);
      drawer.setAttribute("aria-hidden", open ? "false" : "true");
      btn.setAttribute("aria-expanded", open ? "true" : "false");
      btn.setAttribute("aria-label", open ? "Close navigation menu" : "Open navigation menu");
      btn.innerHTML = open ? closeSvg : hamburgerSvg;
    }

    if (btn && drawer) {
      btn.addEventListener("click", function () {
        var nextOpen = !drawer.classList.contains("is-open");
        setDrawerState(nextOpen);
      });

      drawer.querySelectorAll("a").forEach(function (link) {
        link.addEventListener("click", function () {
          setDrawerState(false);
        });
      });

      document.addEventListener("keydown", function (e) {
        if (e.key === "Escape" && drawer.classList.contains("is-open")) {
          setDrawerState(false);
        }
      });

      document.addEventListener("click", function (e) {
        if (drawer.classList.contains("is-open") && !mount.contains(e.target)) {
          setDrawerState(false);
        }
      });
    }
  }

  function renderFooter() {
    var mount = document.getElementById("site-footer");
    if (!mount) return;

    var waHref = buildWhatsAppUrl(
      "Hello " + cfg.brandName + ", I would like to enquire about personal fitness coaching."
    );
    var year = new Date().getFullYear();

    mount.className = "site-footer";
    mount.innerHTML =
      '<div class="container">' +
      '  <div class="footer-grid">' +
      '    <div>' +
      '      <a href="index.html" class="brand-lockup">' +
      '        <img src="' +
      escapeHtml(cfg.logo.darkBgPath) +
      '" alt="' +
      escapeHtml(cfg.brandName) +
      ' logo" width="26" height="26" class="brand-logo-img">' +
      '        <span class="brand-wordmark brand-wordmark-light">' +
      escapeHtml(cfg.brandName) +
      "</span>" +
      "      </a>" +
      '      <p style="margin-top:14px;font-family:var(--font-display);font-weight:600;font-size:1rem;color:#fff;">' +
      escapeHtml(cfg.coreMessage) +
      "</p>" +
      '      <p style="margin-top:10px;font-size:0.9375rem;color:#aeb7c2;max-width:36ch;">' +
      escapeHtml(cfg.tagline) +
      " Personalised home, outdoor, partner, and online fitness coaching built around your location.</p>" +
      '      <div style="margin-top:18px;">' +
      '        <a href="' +
      waHref +
      '" target="_blank" rel="noopener noreferrer" class="btn btn-primary">WhatsApp Enquiry</a>' +
      "      </div>" +
      "    </div>" +
      '    <div>' +
      '      <h3 class="footer-heading">Pages</h3>' +
      '      <ul class="footer-links">' +
      '        <li><a href="index.html">Home</a></li>' +
      '        <li><a href="about.html">About Us</a></li>' +
      '        <li><a href="services.html">Services</a></li>' +
      '        <li><a href="coaches.html">Coaches</a></li>' +
      '        <li><a href="transformations.html">Transformations</a></li>' +
      '        <li><a href="contact.html">Contact</a></li>' +
      "      </ul>" +
      "    </div>" +
      '    <div>' +
      '      <h3 class="footer-heading">Coaching</h3>' +
      '      <ul class="footer-links">' +
      '        <li><a href="services.html#home-personal-training">Home Personal Training</a></li>' +
      '        <li><a href="services.html#outdoor-personal-training">Outdoor Training</a></li>' +
      '        <li><a href="services.html#online-fitness-coaching">Online Coaching</a></li>' +
      '        <li><a href="services.html#strength-conditioning">Strength &amp; Conditioning</a></li>' +
      '        <li><a href="services.html#partner-training">Partner Training</a></li>' +
      "      </ul>" +
      "    </div>" +
      '    <div>' +
      '      <h3 class="footer-heading">Contact Details</h3>' +
      '      <div style="display:flex;flex-direction:column;gap:12px;font-size:1rem;color:rgba(255,255,255,0.9);">' +
      '        <div><span class="spec-label">Phone</span><span>' +
      escapeHtml(cfg.contact.phoneDisplay) +
      "</span></div>" +
      '        <div><span class="spec-label">WhatsApp</span><span>' +
      escapeHtml(cfg.contact.whatsappDisplay) +
      "</span></div>" +
      '        <div><span class="spec-label">Email</span><span>' +
      escapeHtml(cfg.contact.emailDisplay) +
      "</span></div>" +
      '        <p style="font-size:0.875rem;color:#aeb7c2;line-height:1.55;">' +
      escapeHtml(cfg.contact.locationPolicy) +
      "</p>" +
      "      </div>" +
      "    </div>" +
      "  </div>" +
      '  <div class="footer-bottom">' +
      "    <p>&copy; " +
      year +
      " " +
      escapeHtml(cfg.brandName) +
      ". Independent personal coaching service.</p>" +
      "    <p>General fitness guidance only — not medical diagnosis or treatment.</p>" +
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

  function renderFounders() {
    var containers = document.querySelectorAll('[data-render="founders"]');
    if (!containers.length || !cfg.founders) return;

    var html = cfg.founders
      .map(function (f) {
        return (
          '<article class="founder-card">' +
          '  <div class="avatar-slot">' +
          '    <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" aria-hidden="true"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>' +
          '    <span style="margin-top:6px;">Photo</span>' +
          "  </div>" +
          '  <div style="min-width:0;display:flex;flex-direction:column;gap:6px;">' +
          '    <p class="meta-line">' +
          escapeHtml(f.label) +
          " · " +
          escapeHtml(f.ownership) +
          "</p>" +
          '    <h3 class="card-title">' +
          escapeHtml(f.name) +
          "</h3>" +
          '    <p class="meta-muted">' +
          escapeHtml(f.role) +
          "</p>" +
          '    <p class="meta-muted">' +
          escapeHtml(f.qualifications) +
          "</p>" +
          '    <p class="card-text" style="margin-top:4px;">' +
          escapeHtml(f.bio) +
          "</p>" +
          "  </div>" +
          "</article>"
        );
      })
      .join("");

    containers.forEach(function (el) {
      el.innerHTML = html;
    });
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

      grid.innerHTML = items
        .map(function (item) {
          return (
            '<article class="card-media">' +
            '  <div class="placeholder-slot">' +
            '    <span class="meta-muted" style="font-weight:600;">Client Transformation Photo Slot</span>' +
            '    <span class="meta-muted" style="max-width:26ch;">Reserved for verified client progress imagery with written consent.</span>' +
            "  </div>" +
            '  <div class="card-media-body">' +
            '    <div style="display:flex;flex-direction:column;gap:8px;">' +
            '      <p class="meta-line">' +
            escapeHtml(item.goal) +
            " · " +
            escapeHtml(item.format) +
            "</p>" +
            '      <h3 class="card-title">' +
            escapeHtml(item.clientLabel) +
            "</h3>" +
            '      <p class="meta-muted">' +
            escapeHtml(item.timeframe) +
            "</p>" +
            '      <p class="card-text">' +
            escapeHtml(item.story) +
            "</p>" +
            "    </div>" +
            '    <p style="font-size:0.875rem;font-style:italic;color:var(--color-muted-ink);padding-top:12px;border-top:1px solid var(--color-border);">' +
            escapeHtml(item.quote) +
            "</p>" +
            "  </div>" +
            "</article>"
          );
        })
        .join("");
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
        var href = s.url ? escapeHtml(s.url) : "#";
        var attrs = s.url
          ? 'href="' + href + '" target="_blank" rel="noopener noreferrer"'
          : 'href="contact.html"';
        return (
          '<li>' +
          '  <a ' +
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
    renderFounders();
    renderCoachesDirectory();
    renderTransformations();
    renderTestimonialsCarousel();
    renderSocialLinks();
    initWhatsAppTopicSwitcher();
    initScrollReveal();
  });
})();
