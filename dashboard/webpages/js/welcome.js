let config = {};
// getting cookie value
const gid = document.cookie.replace(
  /(?:(?:^|.*;\s*)user\s*\=\s*([^;]*).*$)|^.*$/,
  '$1');

function storeConfig(json) {
  config = json;
}

function insertUser(){
  fetch(config.base + '/api/user?gid=' + gid)
    .then( extract )
    .then( r => window.fname.textContent = r.firstname );
}

fetch('js/config.json')
  .then( extract )
  .then( storeConfig )
  .then( insertUser );
