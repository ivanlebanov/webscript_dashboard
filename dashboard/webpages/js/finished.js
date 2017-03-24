function init() {
  'use strict';
  const gid = document.cookie.replace(
    /(?:(?:^|.*;\s*)user\s*\=\s*([^;]*).*$)|^.*$/,
    '$1');

  function getLink(){
    window.link.href = 'http://localhost:80/dashboard?id=' + gid;
  }

  getLink();
}

init();
