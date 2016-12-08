(function (ALLEX, ALLEX_CONFIGURATION) {
  'use strict';

  var CONFIG = ALLEX.lib.extend ({
      defaultLanguageCode : 'en',
      fallbackLng : 'en',
      debug : false,
      load: 'all'
  }, ALLEX_CONFIGURATION.i18n);

  var options = {
    lng : CONFIG.defaultLanguageCode
    fallbackLng: CONFIG.fallbackLng
  }

  if (!CONFIG.translation) {
    import XHR from 'i18next-xhr-backend';
    options.loadPath = CONFIG.loadPath || 'assets/locales/{{lng}}.json'
    i18next.use (XHR)
  }

  i18next.init ({
    lng : CONFIG.defaultLanguageCode
  });
  jqueryI18next.init(i18next, $, {
    tName: 't', // --> appends $.t = i18next.t
    i18nName: 'i18n', // --> appends $.i18n = i18next
    handleName: 'localize', // --> appends $(selector).localize(opts);
    selectorAttr: 'data-i18n', // selector for translating elements
    targetAttr: 'i18n-target', // data-() attribute to grab target element to translate (if diffrent then itself)
    optionsAttr: 'i18n-options', // data-() attribute that contains options, will load/set if useOptionsAttr = true
    useOptionsAttr: false, // see optionsAttr
    parseDefaultValueFromContent: true // parses default values from content ele.val or ele.text
  });
  i18next.init({
      debug: true,
      lng: 'rs' // Set EN on init
    }, function () {
      $('body').localize();
  });
})(ALLEX, ALLEX_CONFIGURATION.CONFIG.i18n);
