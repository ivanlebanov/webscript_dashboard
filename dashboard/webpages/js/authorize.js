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
  /*
  * Make an API call to the authorization
  * endpoint and change the location
  * to the next page of the
  * configuration.
  */
  function redirectToAuthorized() {
    const code = QueryString.code;
    fetch(config.base + '/api/authorize?gid=' + gid + '&code=' + code, {
      method: 'post'
    }).then(function(response) {
      window.location = config.base + '/authorized';
    });
  }

  fetch('js/config.json')
    .then( extract )
    .then( storeConfig )
    .then( redirectToAuthorized );

}
init();
