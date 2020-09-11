window.luxon = luxon;
(function() {
  function vendorModule() {
    'use strict';

    return {
      'default': window.luxon,
      __esModule: true,
    };
  }

  define('luxon', [], vendorModule);
})();
