function insertUser(){
  // getting cookie value
  var gid = document.cookie.replace(/(?:(?:^|.*;\s*)user\s*\=\s*([^;]*).*$)|^.*$/, "$1");
  var url = 'http://localhost/api/user?gid=' + gid;

  getAjax(url, function(data){
    console.log(data);
    var jsonData = JSON.parse(data);
    window.fname.textContent = jsonData.firstname;
  });

}

window.addEventListener("load", insertUser);
