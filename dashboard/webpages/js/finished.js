function init() {
  'use strict';
  const gid = document.cookie.replace(
    /(?:(?:^|.*;\s*)user\s*\=\s*([^;]*).*$)|^.*$/,
    '$1');
  const dashboard = localStorage.getItem('dashboard');
  let config = {};

  function storeConfig(json) {
    config = json;
  }

  function getLink(){
    window.link.href = config.base + '/dashboard?secret=' + gid+
    '&id=' + dashboard;
    window.para.textContent +=' ' + config.base + '/dashboard?secret=' + gid+
    '&id=' + dashboard;
  }
  fetch('js/config.json')
    .then( extract )
    .then( storeConfig )
    .then( getLink );
}

init();
