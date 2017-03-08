function getNews(){
  var url = 'http://localhost:80/api/news';

  getAjax(url, function(data){
    data = JSON.parse(data);

    var list = new Vue({
      el: '#brand_list',
      data: {
        items: data.sources
      }
    });

  });

}

getNews();

function sendFavouriteNews(e) {
  e.preventDefault();
  var checkedBoxes = getCheckedBoxes("sources");
  var valueObj = [];

  if(checkedBoxes)
    for (var i = 0; i < checkedBoxes.length; i++)
      valueObj[i] = checkedBoxes[i].value;

  var gid = document.cookie.replace(/(?:(?:^|.*;\s*)user\s*\=\s*([^;]*).*$)|^.*$/, "$1");

      var url = 'http://localhost:80/api/user/' + gid + '/news' + "?sources=" + valueObj;
      postAjax(url, valueObj, function(data){
        window.location = 'http://localhost:80/finished';
      });


}
window.save_favourite_brands.addEventListener("click", sendFavouriteNews);
