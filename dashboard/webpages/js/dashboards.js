let config = {};
// getting cookie value
const gid = document.cookie.replace(
  /(?:(?:^|.*;\s*)user\s*\=\s*([^;]*).*$)|^.*$/,
  '$1');

function storeConfig(json) {
  config = json;
}

function getUserDashboards(){
  fetch(config.base + '/api/dashboards/' + gid)
    .then( extract )
    .then( function(response) {
      appendDashboards(response);
    } );
}
function appendDashboards(dashboards) {
  clearHTML(window.dashboards);

  if(dashboards.length > 0){
    for (var i = 0; i < dashboards.length; i++) {
      let liElem = document.createElement('li');
      let headingElem = document.createElement('h2');
      let linkElem = document.createElement('a');
      let paraElem = document.createElement('p');
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
      linkElem.classList.add('green-button');
      linkElem.classList.add('small-button');
      liElem.appendChild(headingElem);
      liElem.appendChild(paraElem);
      liElem.appendChild(linkElem);
      window.dashboards.appendChild(liElem);
    }
  }else{

  }
}
function closeThePopup(){
  window.popupAdd.classList.add('hidden');
}
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
function openPopup(e) {
  e.preventDefault();
  window.popupAdd.classList.remove('hidden');
}
window.addDashboard.addEventListener('click', addThedashboard);
window.createDashboard.addEventListener('click', openPopup);
window.closePopup.addEventListener('click', closeThePopup);

fetch('js/config.json')
  .then( extract )
  .then( storeConfig )
  .then( getUserDashboards );
