function getLink(){
  var gid = document.cookie.replace(/(?:(?:^|.*;\s*)user\s*\=\s*([^;]*).*$)|^.*$/, "$1");
  window.link.href = "http://localhost:80/dashboard?id=" + gid;
}
getLink();
