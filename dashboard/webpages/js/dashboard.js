function init(){
  'use strict';
  let config = {};
  let dashboard = {};
  // getting cookie value
  const gid =  QueryString.secret;
  const id =  QueryString.id;
  function storeConfig(json) {
    config = json;
  }

  function startTime() {
      let today = new Date();
      let h = today.getHours();
      let m = today.getMinutes();
      let s = today.getSeconds();
      m = checkTime(m);
      s = checkTime(s);
      window.clock.textContent = h + ':' + m + ':' + s;
      setTimeout(startTime, 500);
  }
  function storeDatabaseInfo(json) {
    dashboard = json;
    console.log(dashboard);
  }
  function appendUser(response){
    clearHTML(window.profileInfo);
    let element = document.createElement('img');
    element.src = response.photo;
    window.profileInfo.appendChild(element);
    let headingItem = document.createElement('h1');
    let fullName = response.firstname + ' ' + response.lastname;
    headingItem.textContent = greeting(fullName, new Date());
    window.profileInfo.appendChild(headingItem);
  }

  function getUser() {
    fetch(config.base + '/api/user?gid=' + gid)
      .then( extract )
      .then(function(response) {
        appendUser(response);
        setInterval(function(){
          appendUser(response);
        },60000 * 10);
      });
  }

  function greeting(name, date, elem = false) {
    let greeting = '';
    if(date.getHours() < 12){
      greeting = 'Good morning ' + name + '!';
    }else if(date.getHours() >= 12 && date.getHours() < 19 ){
      greeting = 'Hi, ' + name + '!';
    }else{
      greeting = 'Good evening, ' + name + '!';
    }

    return greeting;

  }

  function getIssues() {
    if(dashboard.showIssues == 1){
      showElement(window.issues);
      fetch(config.base + '/api/user/' + gid + '/issues')
        .then( extract )
        .then(function(response) {
          appendIssues(response);
        });
      }else{
        hideElement(window.issues);
      }
  }

  function appendIssues(issues) {
    clearHTML(window.issueList);
    if(issues.length > 0){
      appendIssueList(issues);
    }else{
      noIssues();
    }
  }

  function noIssues() {
    // add paragraph
    let p = document.createElement('p');
    p.textContent = 'No issues at the moment.';
    window.issues.appendChild(p);
  }

  function appendIssueList(issues){

    for (let i = 0; i < issues.length; i++) {
      // create DOM elements
      let element = document.createElement('li');
      let headingItem = document.createElement('h3');
      let paragraphItem = document.createElement('p');
      let repository = 'Repository: ' + issues[i].repository.name;
      let asssignedBy = ' Assigned by: ' + issues[i].user.login;
      // append data received from the API call to the DOM
      headingItem.textContent = issues[i].title;
      paragraphItem.textContent = repository + asssignedBy;

      // append the new DOM
      element.appendChild(headingItem);
      element.appendChild(paragraphItem);
      window.issueList.appendChild(element);
    }

  }


  function getNewsArticles() {
    if(dashboard.showNews == 1){
      // api/dashboard/:gid/:id/articles
      fetch(config.base + '/api/dashboard/' + gid + '/'+ id +'/articles')
        .then( extract )
        .then( r => appendArticle(r.articles));
    }else{
      hideElement(window.news);
    }

  }

  function getRandomJoke() {
    if(dashboard.showJoke == 1){
      showElement(window.chuckJoke);
      fetch(config.base + '/api/joke')
        .then( extract )
        .then( r => appendJoke(r) );
    }else{
      hideElement(window.chuckJoke);
    }

  }

  function appendJoke(data) {
    clearHTML(window.chuckJoke);
    let paragraphItem = document.createElement('p');
    paragraphItem.textContent = data.value.joke.replace(/&quot;/g, '\\"');
    window.chuckJoke.appendChild(paragraphItem);
  }


  function appendArticle(articles) {
    showElement(window.news);
    clearHTML(window.newsarcticle);
    let article = articles[Math.floor(Math.random()*articles.length)];
    // create DOM elements
    let element = document.createElement('img');
    let divEl = document.createElement('div');
    let headingItem = document.createElement('h3');
    let paragraphItem = document.createElement('p');
    // in some cases the API doesn't return an image
    if(article.urlToImage === null){
      element.classList.add('hidden');
    }else{
      element.classList.remove('hidden');
    }
    // append data received from the API call to the DOM
    element.src = article.urlToImage;
    headingItem.textContent = article.title;
    paragraphItem.textContent = article.description + ' By: ' + article.author;

    // append the new DOM
    window.newsarcticle.appendChild(element);
    divEl.appendChild(headingItem);
    divEl.appendChild(paragraphItem);
    window.newsarcticle.appendChild(divEl);
    // create QR code
    let qrcode = new QRCode('qr_code', {
        text: article.url,
        width: 128,
        height: 128,
        colorDark : '#000000',
        colorLight : '#ffffff',
        correctLevel : QRCode.CorrectLevel.H
    });
    qrcode.clear();
    qrcode.makeCode(article.url);
  }

  function showMessage() {
    window.popup.classList.remove('hidden');
    setTimeout(
      function() {
        window.popup.classList.add('hidden');
      }, 60000);
  }
  function initalizeDashboard() {
    getUser();
    startTime();
    if(dashboard.showNews == 1){
      getNewsArticles();
    }else{
      hideElement(window.news);
    }
    if(dashboard.showIssues == 1){
      getIssues();
    }else{
      hideElement(window.issues);
    }
    if(dashboard.showJoke == 1){
      getRandomJoke();
    }else{
      hideElement(window.chuckJoke);
    }
  }

function hideElement(elem) {
  elem.classList.add('hidden');
}

function showElement(elem) {
  elem.classList.remove('hidden');
}
function getDashboardData() {
    fetch(config.base + '/api/dashboard/' + gid + '/' + id)
      .then( extract )
      .then( storeDatabaseInfo )
      .then( initalizeDashboard );
}
  fetch('js/config.json')
    .then( extract )
    .then( storeConfig )
    .then( getDashboardData );

function getDashboardDataOnly() {
  fetch(config.base + '/api/dashboard/' + gid + '/' + id)
    .then( extract )
    .then( storeDatabaseInfo );
}
  setInterval(getDashboardDataOnly, 10000);

  setInterval(showMessage, 60000 * 30);
  setInterval(getRandomJoke, 60000 * 5);
  setInterval(getNewsArticles, 60000);
  setInterval(getIssues, 15000);

}
init();
