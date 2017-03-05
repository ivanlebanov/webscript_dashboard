function insertUser(){
  // getting cookie value
  var gid = document.cookie.replace(/(?:(?:^|.*;\s*)user\s*\=\s*([^;]*).*$)|^.*$/, "$1");
  url = 'http://localhost/api/user?gid=' + gid;

  getAjax(url, function(data){
    console.log(data);
    var jsonData = JSON.parse(data);
    window.fname.textContent = jsonData.firstname;
  });

}

window.addEventListener("load", insertUser);


/**
* I want
* this in a config http://localhost:80/api/user?gid=
* get rid of insertUser function and used some sort of MVC for js
* lets do a js MVC
*/
