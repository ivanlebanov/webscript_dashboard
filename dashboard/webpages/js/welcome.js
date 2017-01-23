function insertUser(){
  // getting cookie value
  var gid = document.cookie.replace(/(?:(?:^|.*;\s*)user\s*\=\s*([^;]*).*$)|^.*$/, "$1");
  url = 'http://localhost:8080/api/user?gid=' + gid;
  getAjax(url, function(data){
    var json = JSON.parse(data);
    window.fname.textContent = json.firstname;
  });
}

window.addEventListener("load", insertUser);
