function init(){
  'use strict';
  let config = {};
  // getting cookie value
  const gid = document.cookie.replace(
    /(?:(?:^|.*;\s*)user\s*\=\s*([^;]*).*$)|^.*$/,
    '$1');
  function storeConfig(json) {
    config = json;
  }
  function redirectToAuthorized() {
    const code = QueryString.code;
    fetch(config.base + '/api/authorize?gid=' + gid + '&code=' + code, {
      method: 'post'
    }).then(function(response) {
      window.location = config.base + '/authorized';
    });
  }
}
init();
