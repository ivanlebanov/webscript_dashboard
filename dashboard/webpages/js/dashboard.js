function init(){
  'use strict';
  let config = {};
  // getting cookie value
  const gid =  QueryString.id;

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
    fetch(config.base + '/api/user?gid=' + QueryString.id)
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
    fetch(config.base + '/api/user/' + QueryString.id + '/issues')
      .then( extract )
      .then(function(response) {
        appendIssues(response);
      });
  }

  function appendIssues(issues) {
    clearHTML(window.issueList);
    window.issues.classList.remove('hidden');
    if(issues.length > 0){
      appendIssueList(issues);
    }else{
      noIssues();
    }
  }

  function noIssues() {
    // add paragraph
    let p = document.createElement('p');
    p.textContent = 'No issue at the moment';
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
    fetch(config.base + '/api/user/' + QueryString.id + '/articles')
      .then( extract )
      .then(function(response) {
        appendArticle(response.articles);
      });
  }

  function getRandomJoke() {
    fetch(config.base + '/api/joke')
      .then( extract )
      .then(function(response) {
        appendJoke(response);
      });
  }

  function appendJoke(data) {
    clearHTML(window.chuckJoke);
    let paragraphItem = document.createElement('p');
    paragraphItem.textContent = data.value.joke.replace(/&quot;/g, '\\"');
    window.chuckJoke.appendChild(paragraphItem);
  }


  function appendArticle(articles) {
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
    getNewsArticles();
    getIssues();
    getUser();
    startTime();
    getRandomJoke();
  }


  fetch('js/config.json')
    .then( extract )
    .then( storeConfig )
    .then( initalizeDashboard );

  setInterval(showMessage, 60000 * 30);
  setInterval(getRandomJoke, 60000 * 5);
  setInterval(getNewsArticles, 60000);
  setInterval(getIssues, 300000);

}
init();
