let config = {};
// getting cookie value
const gid = document.cookie.replace(
  /(?:(?:^|.*;\s*)user\s*\=\s*([^;]*).*$)|^.*$/,
  '$1');

function storeConfig(json) {
  config = json;
}
/*
* Make and API call to get all user's
* dashboards and call the function to
* append them to the UI on
* completion.
*/
function getUserDashboards(){
  fetch(config.base + '/api/dashboards/' + gid)
    .then( extract )
    .then( function(response) {
      appendDashboards(response);
    } );
}

/*
* Show a list of all user's dashboards with links
* to edit, configure and delete, a title and
* informational paragraph.
*/
function appendDashboards(dashboards) {
  clearHTML(window.dashboards);

  if(dashboards.length > 0){
    for (var i = 0; i < dashboards.length; i++) {
      // create DOM elements
      let liElem = document.createElement('li');
      let headingElem = document.createElement('h2');
      let linkElem = document.createElement('a');
      let secondLinkElem = document.createElement('a');
      let lastLinkElem = document.createElement('a');
      let paraElem = document.createElement('p');
      // add text contents, links and classes
      headingElem.textContent = dashboards[i].title;
      paraElem.textContent = 'Link to your dashboard: ' + config.base +
       '/dashboard?secret=' + gid + '&id=' + dashboards[i].id;
       if(dashboards[i].finishedSetup === '1' &&
          dashboards[i].finishedSetup !== null){
         linkElem.textContent = 'see dashboard';
         paraElem.textContent = '';
         linkElem.href = config.base +  '/dashboard?secret=' +
          gid + '&id=' + dashboards[i].id;
       }else{
         paraElem.textContent = 'You haven\'t finished the configuration'+
         ' of your dashboard.';
         linkElem.textContent = 'configure dashboard';
         linkElem.href = config.base +  '/welcome?id=' + dashboards[i].id;
       }

      secondLinkElem.textContent = 'Advanced settings';
      secondLinkElem.dataset.id = dashboards[i].id;
      secondLinkElem.dataset.title = dashboards[i].title;
      secondLinkElem.classList.add('chooseSettings');
      secondLinkElem.classList.add('white-button');
      secondLinkElem.classList.add('small-button');

      lastLinkElem.textContent = 'Delete dashboard';
      lastLinkElem.dataset.id = dashboards[i].id;
      lastLinkElem.dataset.title = dashboards[i].title;
      lastLinkElem.classList.add('deleteDashboard');
      lastLinkElem.classList.add('red-button');
      lastLinkElem.classList.add('small-button');

      linkElem.classList.add('green-button');
      linkElem.classList.add('small-button');
      // append the new html elements
      liElem.appendChild(headingElem);
      liElem.appendChild(paraElem);
      liElem.appendChild(linkElem);
      liElem.appendChild(secondLinkElem);
      liElem.appendChild(lastLinkElem);
      window.dashboards.appendChild(liElem);
    }

    var deleteLinks = document.querySelectorAll('.deleteDashboard');

    Array.from(deleteLinks).forEach(link => {
        link.addEventListener('click', function(event) {
          showDeletePopup(this.dataset.id, this.dataset.title);
        });
    });

    var settingsLinks = document.querySelectorAll('.chooseSettings');

    Array.from(settingsLinks).forEach(link => {
        link.addEventListener('click', function(event) {
          chooseSettings(this.dataset.id, this.dataset.title);
        });
    });

  }

}
/*
* Get single dashboard information.
*/
function chooseSettings(id, title) {
  fetch(config.base + '/api/dashboard/' + gid + '/' + id)
  .then( extract )
  .then( r => showUpdatePopup(r) );
}
/*
* Show update popup and fill the inputs.
*/
function showUpdatePopup(dashboard) {
  window.titleUpdate.value = dashboard.title;
  window.showIssues.checked = (dashboard.showIssues == 1) ? true : false;
  window.showJoke.checked = (dashboard.showJoke == 1) ? true : false;
  window.showNews.checked = (dashboard.showNews == 1) ? true : false;
  window.updateDashboard.dataset.id = dashboard.id;

  window.popupEdit.classList.remove('hidden');
}
/*
* Show a delete popup.
* This part can and will be improved soon.
*/
function showDeletePopup(id, title) {
  if (confirm(`sure u want to delete ${title}`)) {
      fetch(config.base + '/api/dashboard/' + gid + '/' + id , {
        method: 'delete'
      })
      .then( extract )
      .then( r => showMessage(r.status, r.message, false) )
      .then(getUserDashboards)
      .then(closeThePopup);
  }
}
/*
* Close a popup to edit a dashboard.
*/
function closeThePopup(){
  window.popupAdd.classList.add('hidden');
}
/*
* Close a popup to edit a dashboard.
*/
function closeThePopupEdit() {
  window.popupEdit.classList.add('hidden');
}
/*
* Make an API call to add dashboard
* created with default settings by the API.
*/
function addThedashboard() {
  fetch(config.base + '/api/dashboard/' + gid , {
    method: 'post',
    headers: {
      'Accept': 'application/json, application/xml, text/plain, text/html, *.*',
      'Content-Type': 'application/json'
      },
    body: JSON.stringify({
      'title': window.title.value
    })
  })
  .then( extract )
  .then( r => showMessage(r.status, r.message, false) )
  .then(getUserDashboards)
  .then(closeThePopup);
}

/*
* Make an API call to update dashboard's
* settings and title after which a message is
* displayed as well as the popup closed.
*/
function updateTheDashboard() {
  let id = this.dataset.id;
  let params = {
    'title': window.titleUpdate.value,
    'showIssues': (window.showIssues.checked) ? 1 : 0,
    'showJoke': (window.showJoke.checked) ? 1 : 0,
    'showNews': (window.showNews.checked) ? 1 : 0
  };
  fetch(config.base + '/api/dashboard/' + gid + '/' + id , {
    method: 'put',
    headers: {
      'Accept': 'application/json, application/xml, text/plain, text/html, *.*',
      'Content-Type': 'application/json'
      },
    body: JSON.stringify(params)
  })
  .then( extract )
  .then( r => showMessage(r.status, r.message, false) )
  .then(getUserDashboards)
  .then(closeThePopupEdit);
}

/*
* Open a popup to add a dashboard.
*/
function openPopup(e) {
  e.preventDefault();
  window.popupAdd.classList.remove('hidden');
}

fetch('js/config.json')
  .then( extract )
  .then( storeConfig )
  .then( getUserDashboards );

/// event listeners
window.addDashboard.addEventListener('click', addThedashboard);
window.createDashboard.addEventListener('click', openPopup);
window.closePopup.addEventListener('click', closeThePopup);
window.closePopupEdit.addEventListener('click', closeThePopupEdit);
window.updateDashboard.addEventListener('click', updateTheDashboard);
