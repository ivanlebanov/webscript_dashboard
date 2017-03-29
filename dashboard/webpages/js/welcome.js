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
  * Add link href.
  */
  function addLink(){
    window.githubLink.href = '/github?id=' + QueryString.id;
  }
  /*
  * Insert user's firstname to the UI.
  */
  function insertUser(){
    fetch(config.base + '/api/user?gid=' + gid)
      .then( extract )
      .then( r => window.fname.textContent = r.firstname )
      .then(addLink);
  }

  fetch('js/config.json')
    .then( extract )
    .then( storeConfig )
    .then( insertUser );

}
init();
