/* i18n overrides loader — applies content.json i18nOverrides to the current page */
(function () {
  function applyOverrides(data) {
    var ov = data && data.i18nOverrides;
    if (!ov) return;

    /* Apply EN / JA overrides via i18nPatch */
    ['en', 'ja'].forEach(function (lang) {
      if (!ov[lang]) return;
      Object.keys(ov[lang]).forEach(function (key) {
        var val = ov[lang][key];
        if (val && window.i18nPatch) window.i18nPatch(lang, key, val);
      });
    });

    /* Apply ZH overrides by updating data-zh attributes on matching elements */
    if (ov.zh) {
      Object.keys(ov.zh).forEach(function (key) {
        var val = ov.zh[key];
        if (!val) return;
        document.querySelectorAll('[data-i18n="' + key + '"], [data-i18n-html="' + key + '"]').forEach(function (el) {
          el.setAttribute('data-zh', val);
        });
      });
    }

    /* Re-render the current language */
    if (window.applyLang) {
      window.applyLang(window.i18nCurrent || 'zh');
    }
  }

  function load() {
    fetch('/api/content')
      .then(function (r) { return r.json(); })
      .then(applyOverrides)
      .catch(function () {});
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', load);
  } else {
    load();
  }
})();
