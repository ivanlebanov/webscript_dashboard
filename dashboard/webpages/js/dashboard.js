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
  /*
  * A function to display a clock updated every
  * 500 ms.
  */
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
  /*
  * Save the retuned json to the dashboard variable.
  */
  function storeDashboardInfo(json) {
    dashboard = json;
  }
  /*
  * Append the User to the navigation
  * bar of the dashboard.
  */
  function appendUser(response){
    clearHTML(window.profileInfo);
    let element = document.createElement('img');
    let headingItem = document.createElement('h1');
    let fullName = response.firstname + ' ' + response.lastname;
    element.src = response.photo;
    window.profileInfo.appendChild(element);
    headingItem.textContent = greeting(fullName, new Date());
    window.profileInfo.appendChild(headingItem);
  }

  /*
  * Change the greeting message changing depending
  * on the time.
  */
  function greeting(name, date) {
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

  /*
  * Get the User  via the API and update the
  * message every 10 minutes.
  */
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

  /*
  * Get the Issues for a project if
  * the user has chosen to show them
  * otherwise hide the section.
  */
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

  /*
  * Append issues to the UI if the
  * API returns any otherwise
  * show a message.
  */
  function appendIssues(issues) {
    clearHTML(window.issueList);
    if(issues.length > 0){
      appendIssueList(issues);
    }else{
      noIssues();
    }
  }
  /*
  * Show a message in the UI
  * for 'no issues'
  */
  function noIssues() {
    // add paragraph
    let p = document.createElement('p');
    p.textContent = 'No issues at the moment.';
    window.issues.appendChild(p);
  }

  /*
  * Append all Github issues returned
  * by the API as list items.
  */
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

  /*
  * Get News articles or hide the
  * section in the UI depending on user preferences.
  */
  function getNewsArticles() {
    if(dashboard.showNews == 1){
      fetch(config.base + '/api/dashboard/' + gid + '/'+ id +'/articles')
        .then( extract )
        .then( r => appendArticle(r.articles));
    }else{
      hideElement(window.news);
    }

  }

  /*
  * Get random joke from the API or hide the
  * section in the UI depending on user preferences.
  */
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

  /*
  * Append a joke to the UI with the provided
  * one by the API to the UI.
  */
  function appendJoke(data) {
    clearHTML(window.chuckJoke);
    let paragraphItem = document.createElement('p');
    paragraphItem.textContent = data.value.joke.replace(/&quot;/g, '\\"');
    window.chuckJoke.appendChild(paragraphItem);
  }

  /*
  * Append a random article from the returned
  * by the API.
  */
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
  /*
  * Show the message popup and hideElement
  * it after a minute.
  */
  function showMessage() {
    window.popup.classList.remove('hidden');
    setTimeout(
      function() {
        window.popup.classList.add('hidden');
      }, 60000);
  }
  /*
  * Initialize the dashboard calling
  * all the needed functions.
  */
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
  /*
  * Hide an element
  */
  function hideElement(elem) {
    elem.classList.add('hidden');
  }
  /*
  * Show an element
  */
  function showElement(elem) {
    elem.classList.remove('hidden');
  }
  /*
  * Get dashboard data followed by
  * initializing the dashboard.
  */
  function getDashboardData() {
      fetch(config.base + '/api/dashboard/' + gid + '/' + id)
        .then( extract )
        .then( storeDashboardInfo )
        .then( initalizeDashboard );
  }
  /*
  * Get dashboard data to refresh
  * the dashboard variable to
  * show/hide sections without refresh.
  */
  function getDashboardDataOnly() {
    fetch(config.base + '/api/dashboard/' + gid + '/' + id)
      .then( extract )
      .then( storeDashboardInfo );
  }

  fetch('js/config.json')
    .then( extract )
    .then( storeConfig )
    .then( getDashboardData );

  // refreshing the dashboard in different intervals
  setInterval(getDashboardDataOnly, 60000);
  setInterval(showMessage, 60000 * 30);
  setInterval(getRandomJoke, 60000 * 5);
  setInterval(getNewsArticles, 60000);
  setInterval(getIssues, 60000 * 5);

}
init();
