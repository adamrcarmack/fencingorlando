(function () {
  "use strict";

  document.addEventListener("DOMContentLoaded", function () {
    var cfg = window.SITE_CONFIG;
    if (!cfg) return;

    bindTextContent(cfg);
    bindAttributes(cfg);
    renderServices(cfg);
    renderTrustPoints(cfg);
    renderFaq(cfg);
    renderAreas(cfg);
    renderFooter(cfg);
    setSeoTitle(cfg);
  });

  function resolve(obj, path) {
    return path.split(".").reduce(function (o, k) {
      return o && o[k] !== undefined ? o[k] : null;
    }, obj);
  }

  function bindTextContent(cfg) {
    var els = document.querySelectorAll("[data-bind]");
    els.forEach(function (el) {
      var val = resolve(cfg, el.getAttribute("data-bind"));
      if (val !== null) el.textContent = val;
    });
  }

  function bindAttributes(cfg) {
    var els = document.querySelectorAll("[data-bind-attr]");
    els.forEach(function (el) {
      var pairs = el.getAttribute("data-bind-attr").split(",");
      pairs.forEach(function (pair) {
        var parts = pair.split(":").map(function (s) { return s.trim(); });
        var attr = parts[0];
        var key = parts[1];
        var val = resolve(cfg, key);
        if (val !== null) {
          if (attr === "bg-image") {
            el.style.backgroundImage = "url(" + val + ")";
          } else {
            el.setAttribute(attr, val);
          }
        }
      });
    });
  }

  function renderServices(cfg) {
    var container = document.getElementById("services-list");
    if (!container || !cfg.services) return;
    container.innerHTML = cfg.services.map(function (s) {
      var link = s.slug ? "/services/" + s.slug + "/" : "#contact";
      return '<a href="' + link + '" class="service-card-link">'
        + '<article class="service-card">'
        + '<img class="service-card-img" src="' + s.image + '" alt="' + s.title + '" width="400" height="200" loading="lazy">'
        + '<div class="service-card-body">'
        + '<h3>' + s.title + '</h3>'
        + '<p>' + s.description + '</p>'
        + '</div></article></a>';
    }).join("");
  }

  function renderTrustPoints(cfg) {
    var container = document.getElementById("trust-items");
    if (!container || !cfg.trustPoints) return;
    container.innerHTML = cfg.trustPoints.map(function (t) {
      return '<div class="trust-item"><span class="trust-check"></span><span>' + t + '</span></div>';
    }).join("");
  }

  function renderFaq(cfg) {
    var container = document.getElementById("faq-list");
    if (!container || !cfg.faq) return;
    container.innerHTML = cfg.faq.map(function (item) {
      return '<div class="faq-item">'
        + '<h3>' + item.question + '</h3>'
        + '<p>' + item.answer + '</p>'
        + '</div>';
    }).join("");
  }

  function renderAreas(cfg) {
    var container = document.getElementById("areas-list");
    if (!container || !cfg.areas) return;
    container.innerHTML = cfg.areas.map(function (a) {
      if (typeof a === "object" && a.slug) {
        return '<a href="/areas/' + a.slug + '/" class="area-pill">' + a.name + '</a>';
      }
      var name = (typeof a === "object") ? a.name : a;
      return '<span class="area-pill">' + name + '</span>';
    }).join("");
  }

  function renderFooter(cfg) {
    var yearEls = document.querySelectorAll("#footer-year, .js-year");
    var year = new Date().getFullYear();
    yearEls.forEach(function (el) { el.textContent = year; });

    var nameEls = document.querySelectorAll("[data-footer-name]");
    nameEls.forEach(function (e) { e.textContent = cfg.business.name; });
  }

  function setSeoTitle(cfg) {
    if (cfg.seo && cfg.seo.title && document.querySelector("[data-bind='hero.headline']")) {
      document.title = cfg.seo.title;
    }
  }
})();