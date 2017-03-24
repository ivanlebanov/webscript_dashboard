
function clearHTML(elem) {
  while (elem.firstChild){
    elem.removeChild(elem.firstChild);
  }
}

function extract(response) {
  return response.json();
}

function checkTime(i) {
    if (i < 10) {i = '0' + i;}
    return i;
}

var QueryString = function () {
  // This function is anonymous, is executed immediately and
  // the return value is assigned to QueryString!
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

// Pass the checkbox name to the function
function getCheckedBoxes(chkboxName) {
  var checkboxes = document.getElementsByName(chkboxName);
  var checkboxesChecked = [];
  // loop over them all
  for (var i=0; i<checkboxes.length; i++) {
     // And stick the checked ones onto an array...
     if (checkboxes[i].checked) {
        checkboxesChecked.push(checkboxes[i]);
     }
  }
  // Return the array if it is non-empty, or null
  return checkboxesChecked.length > 0 ? checkboxesChecked : null;
}
