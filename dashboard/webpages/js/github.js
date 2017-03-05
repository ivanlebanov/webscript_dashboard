
function insertUser(){
  // getting cookie value
  var gid = document.cookie.replace(/(?:(?:^|.*;\s*)user\s*\=\s*([^;]*).*$)|^.*$/, "$1");
  url = 'http://localhost:80/api/user?gid=' + gid;

  getAjax(url, function(data){

    var jsonData = JSON.parse(data);
    var app = new Vue({
      el: '#name',
      data: {
        name: jsonData.firstname
      }
    });

  });

}

function authorizeGithub(e) {
  e.preventDefault();
  window.location = 'https://github.com/login/oauth/authorize?client_id=5045e9984b7ba7e07b52&scope=user,repo';
}

insertUser();
window.github_authorize.addEventListener("click", authorizeGithub);
