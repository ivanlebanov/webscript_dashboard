function startTime() {
    var today = new Date();
    var h = today.getHours();
    var m = today.getMinutes();
    var s = today.getSeconds();
    m = checkTime(m);
    s = checkTime(s);
    window.clock.textContent = h + ":" + m + ":" + s;
    var t = setTimeout(startTime, 500);
}

function getUser() {
  fetch('http://localhost:80/api/user?gid=' + QueryString.id)
    .then( extract )
    .then(function(response) {
      appendUser(response);
      setInterval(function(){
        appendUser(response);
      },60000 * 10);
    });
}

function appendUser(response){
  clearHTML(window.profile_info);
  var element = document.createElement("img");
  element.src = response.photo;
  window.profile_info.appendChild(element);
  var heading_item = document.createElement("h1");
  heading_item.textContent = greeting(response.firstname + " " + response.lastname, new Date());
  window.profile_info.appendChild(heading_item);
}

function greeting(name, date, elem = false) {
  let greeting = "";
  if(date.getHours() < 12){
    greeting = "Good morning " + name + "!";
  }else if(date.getHours() >= 12 && date.getHours() < 19 ){
    greeting = "Hi " + name;
  }else{
    greeting = "Good evening, " + name + "!";
  }
  if(elem)
    window.the_name.textContent = "" + greeting;

  return greeting;

}

function getIssues() {
  fetch('http://localhost:80/api/user/' + QueryString.id + '/issues')
    .then( extract )
    .then(function(response) {
      appendIssues(response);
    });
}

function appendIssues(issues) {
  clearHTML(window.issue_list);
  window.issues.classList.remove("hidden");
  if(issues.length > 0){
    appendIssueList(issues);
  }else{
    noIssues();
  }
}

function noIssues() {
  // add paragraph
  var p = document.createElement("p");
  p.textContent = "No issue at the moment";
  window.issues.appendChild(p);
}

function appendIssueList(issues){

  for (var i = 0; i < issues.length; i++) {
    // create DOM elements
    var element = document.createElement("li");
    var heading_item = document.createElement("h3");
    var paragraph_item = document.createElement("p");

    // append data received from the API call to the DOM
    heading_item.textContent = issues[i].title;
    paragraph_item.textContent = "Repository: " + issues[i].repository.name + " Assigned by: " + issues[i].user.login;

    // append the new DOM
    element.appendChild(heading_item);
    element.appendChild(paragraph_item);
    window.issue_list.appendChild(element);
  }

}


function getNewsArticles() {
  fetch('http://localhost:80/api/user/' + QueryString.id + '/articles')
    .then( extract )
    .then(function(response) {
      appendArticle(response.articles);
    });
}

function getRandomJoke() {
  fetch('http://localhost:80/api/joke')
    .then( extract )
    .then(function(response) {
      appendJoke(response);
    });
}

function appendJoke(data) {
  clearHTML(window.chuck_joke);
  var paragraph_item = document.createElement("p");
  paragraph_item.textContent = data.value.joke.replace(/&quot;/g, '\\"');
  window.chuck_joke.appendChild(paragraph_item);
}


function appendArticle(articles) {
  clearHTML(window.newsarcticle);
  var article = articles[Math.floor(Math.random()*articles.length)];
  // create DOM elements
  var element = document.createElement("img");
  var div_el = document.createElement("div");
  var heading_item = document.createElement("h3");
  var paragraph_item = document.createElement("p");
  // in some cases the API doesn't return an image
  if(article.urlToImage === null)
    element.classList.add("hidden");
  else
    element.classList.remove("hidden");

  // append data received from the API call to the DOM
  element.src = article.urlToImage;
  heading_item.textContent = article.title;
  paragraph_item.textContent = article.description + " By: " + article.author;

  // append the new DOM
  window.newsarcticle.appendChild(element);
  div_el.appendChild(heading_item);
  div_el.appendChild(paragraph_item);
  window.newsarcticle.appendChild(div_el);
  // create QR code
  var qrcode = new QRCode("qr_code", {
      text: article.url,
      width: 128,
      height: 128,
      colorDark : "#000000",
      colorLight : "#ffffff",
      correctLevel : QRCode.CorrectLevel.H
  });
  qrcode.clear();
  qrcode.makeCode(article.url);
}

function showMessage() {
  clearHTML(window.popup);
  window.popup.classList.remove("hidden");
  var paragraph_item = document.createElement("p");
  paragraph_item.textContent = 'Forget about your tasks. Strech out and chill for a moment!';
  window.popup.appendChild(paragraph_item);
  setTimeout(
    function() {
      window.popup.classList.add("hidden");
    }, 60000);
}

getNewsArticles();
getIssues();
getUser();
startTime();
getRandomJoke();

setInterval(showMessage, 60000 * 10);
setInterval(getRandomJoke, 60000 * 5);
setInterval(getNewsArticles, 60000);
setInterval(getIssues, 300000);
