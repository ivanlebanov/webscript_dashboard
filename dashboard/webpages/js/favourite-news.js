function init(){
  'use strict';
  const gid = document.cookie.replace(
    /(?:(?:^|.*;\s*)user\s*\=\s*([^;]*).*$)|^.*$/,
    '$1');
  let config = {};

  function storeConfig(json) {
    config = json;
  }

  function getNews(){
    fetch(config.base + '/api/news')
      .then( extract )
      .then( r => appendNews(r.sources) );
  }

  function appendNews(sources){
    if(sources.length > 0){
        for (var i = 0; i < sources.length; i++) {
          let liElem = document.createElement('li');
          let inputElem = document.createElement('input');
          let labelElem = document.createElement('label');
          let imgElem = document.createElement('img');
          let spanElem = document.createElement('span');
          inputElem.type = 'checkbox';
          inputElem.name = 'sources';
          inputElem.value = inputElem.id = labelElem.htmlFor = sources[i].id;

          imgElem.src = sources[i].urlsToLogos.small;
          imgElem.alt = sources[i].name;
          spanElem.textContent = sources[i].name;

          labelElem.appendChild(imgElem);
          labelElem.appendChild(spanElem);

          liElem.appendChild(inputElem);
          liElem.appendChild(labelElem);
          window.brandList.appendChild(liElem);
        }
    }
  }
  function sendFavouriteNews(e) {
    e.preventDefault();
    let checkedBoxes = getCheckedBoxes('sources');
    let valueObj = [];

    if(checkedBoxes){
      for(let i = 0; i < checkedBoxes.length; i++){
        valueObj[i] = checkedBoxes[i].value;
      }
    }
    fetch(config.base + '/api/user/' + gid + '/news' + '?sources=' + valueObj, {
    	method: 'post'
    }).then(function(response) {
      window.location = config.base + '/finished';
    });

  }
  fetch('js/config.json')
    .then( extract )
    .then( storeConfig )
    .then( getNews );

  window.saveFavouriteBrands.addEventListener('click', sendFavouriteNews);
}

init();
