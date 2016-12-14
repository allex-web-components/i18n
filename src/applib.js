(function (allex, global, ALLEX_CONFIGURATION) {
  'use strict';
  var lib = allex.lib,
    applib = allex.WEB_COMPONENTS.allex_applib,
    BasicProcessor = applib.BasicProcessor,
    BasicElement = applib.BasicElement,
    misc = applib.misc;
 

  function I18nElement (id, options) {
    BasicElement.call(this, id, options);
    this.language = null;
    this.available_langs = null;
    global.i18next.on ('initialized', this._onI18Inintialized.bind(this));
    if (global.i18next.language) this.set('language', global.i18next.language);
  }
  lib.inherit (I18nElement, BasicElement);
  I18nElement.prototype.__cleanUp = function () {
    this.language = null;
    this.available_langs = null;
    BasicElement.prototype.__cleanUp.call(this);
  };

  I18nElement.prototype._onI18Inintialized = function () {
    this.set('language', i18next.language);
  };

  I18nElement.prototype.set_language = function (lang) {
    this.language = lang;
    global.i18next.changeLanguage(lang, this._onLanguageChanged.bind(this));
  };

  I18nElement.prototype._onLanguageChanged = function () {
    $('body').localize();
    if (lib.isFunction (this.getConfigVal ('onLanguageChanged'))) {
      this.getConfigVal ('onLanguageChanged')(this.language);
    }
  };

  applib.registerElementType ('i18n', I18nElement);

  function I18PreProcessor () {
    BasicProcessor.call(this);
  }
  lib.inherit (I18PreProcessor, BasicProcessor);
  I18PreProcessor.prototype.destroy = function () {
    BasicProcessor.prototype.destroy.call(this);
  };

  I18PreProcessor.prototype.process = function (desc) {
    var elements = misc.getElementsArr(desc),
      config = this.config;

    if (config) {
      elements.push ({
        name : config.element_name || 'language',
        type : 'i18n',
        options : {
          onLanguageChanged : config.onLanguageChanged
        }
      });
    }

    var CONFIG = ALLEX.lib.extend ({
        defaultLanguageCode : 'en',
        fallbackLng : 'en',
        debug : false,
        load: 'all'
    }, ALLEX_CONFIGURATION.i18n);

    var options = {
      lng : CONFIG.defaultLanguageCode,
      fallbackLng: CONFIG.fallbackLng
    };

    if (!CONFIG.translations) {
      throw new Error('Unable to load translation data, CONFIG.translation data');
    }

    i18next.init ({
      lng : CONFIG.defaultLanguageCode,
      resources : CONFIG.translations
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
      lng: CONFIG.defaultLanguageCode
    });
  };
  applib.registerPreprocessor ('i18PreProcessor', I18PreProcessor);

})(ALLEX, window, ALLEX_CONFIGURATION);
