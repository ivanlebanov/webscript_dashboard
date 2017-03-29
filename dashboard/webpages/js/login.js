let config = {};

function storeConfig(json) {
  config = json;
}
/*
* Use the google client API to login a user
* and save its credentials for later use via
* the API.
*/
function onSignIn(googleUser) {
  const profile = googleUser.getBasicProfile();
  const authResponse = googleUser.getAuthResponse();
  const firstName = '?firstName=' + profile.getGivenName();
  const photo = '&photo=' + profile.getImageUrl();
  const id = '&gid=' + profile.getId();
  const lastName = '&lastName=' + profile.getFamilyName();
  let token = '';
  /* jshint ignore:start */
  token = '&token=' + authResponse.id_token;
  /* jshint ignore:end */
  const profileData = firstName + lastName + token + id + photo;

  fetch(config.base + '/api/login/' + profileData, {
  	method: 'post'
  }).then(function(response) {
    document.cookie = 'user=' + profile.getId();
    window.location = config.base + '/dashboards';
  });
}

fetch('js/config.json')
  .then( extract )
  .then( storeConfig );
