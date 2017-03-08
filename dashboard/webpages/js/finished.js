function getLink(){

    var gid = document.cookie.replace(/(?:(?:^|.*;\s*)user\s*\=\s*([^;]*).*$)|^.*$/, "$1");

    var link = new Vue({
      el: '#link',
      data: {
        url: "http://localhost:80/dashboard?id=" + gid
      }
    });


}

getLink();
