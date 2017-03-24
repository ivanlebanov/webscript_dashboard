function init() {
  'use strict';
  let config = {};
  // getting cookie value
  const gid = document.cookie.replace(
    /(?:(?:^|.*;\s*)user\s*\=\s*([^;]*).*$)|^.*$/,
    '$1');
  function storeConfig(json) {
    config = json;
  }

  fetch('js/config.json')
    .then( extract )
    .then( storeConfig )
    .then( insertUser );

  function insertUser(){
    fetch(config.base + '/api/user?gid=' + gid)
      .then( extract )
      .then( r => window.thename.textContent = r.firstname );
  }

  function authorizeGithubLink() {
    const clientId = '5045e9984b7ba7e07b52';
    const githubBase = 'https://github.com/login/oauth/authorize?client_id=';
    window.githubAuthorize.href = githubBase + clientId + '&scope=user,repo';
  }

  authorizeGithubLink();
}

init();
