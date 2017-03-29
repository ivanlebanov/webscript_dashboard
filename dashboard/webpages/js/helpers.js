function clearHTML(elem) {
  while (elem.firstChild){
    elem.removeChild(elem.firstChild);
  }
}
/*
* Extract json from a response.
* Used for turning the response into json object
*/
function extract(response) {
  return response.json();
}

/*
* Check time and prepend 0 if only
* one digit is returned.
*/
function checkTime(i) {
    if (i < 10) {i = '0' + i;}
    return i;
}

/*
* Create UI element for a notification message
* Remove it after 4 seconds.
*/
function showMessage(status, message){
  let divElem = document.createElement('div');
  let para = document.createElement('p');
  divElem.classList.add('message');
  divElem.classList.add(status);
  divElem.id = 'message';
  para.textContent = message;
  divElem.appendChild(para);
  document.body.appendChild(divElem);
  setTimeout(
    function() {
      document.body.removeChild(window.message);

    }, 4000);
}

// This function is anonymous, is executed immediately and
// the return value is assigned to QueryString!
var QueryString = function () {
  var querystring = {};
  var query = window.location.search.substring(1);
  var vars = query.split('&');
  for (var i=0;i<vars.length;i++) {
    var pair = vars[i].split('=');
    // If first entry with this name
    if (typeof querystring[pair[0]] === 'undefined') {
      querystring[pair[0]] = decodeURIComponent(pair[1]);
    // If second entry with this name
  } else if (typeof querystring[pair[0]] === 'string') {
      var arr = [ querystring[pair[0]],decodeURIComponent(pair[1]) ];
      querystring[pair[0]] = arr;
    // If third or later entry with this name
    } else {
      querystring[pair[0]].push(decodeURIComponent(pair[1]));
    }
  }
  return querystring;
}();
