function onSignIn(googleUser) {
  var profile = googleUser.getBasicProfile();
  var authResponse = googleUser.getAuthResponse();
  var firstName = profile.getGivenName();
  var photo = profile.getImageUrl();
  var id = profile.getId();
  var lastName = profile.getFamilyName();
  var token = authResponse.id_token;


  var data = '?firstName=' + firstName+ '&lastName=' + lastName + '&token=' + token + '&gid=' + id + "&photo=" + photo;
  var url = 'http://localhost:80/api/login';
  url += (googleUser.isSignedIn()) ? data + "&newUser=true" : data + "&newUser=false";
  postAjax(url, data, function(data){
    document.cookie = "user=" + id;
    window.location = 'http://localhost/welcome';
   });

}
