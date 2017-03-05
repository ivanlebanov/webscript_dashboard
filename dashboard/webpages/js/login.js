function onSignIn(googleUser) {
  var profile = googleUser.getBasicProfile();
  var authResponse = googleUser.getAuthResponse();
  var firstName = profile.getGivenName();
  var photo = profile.getImageUrl();
  var id = profile.getId();
  var lastName = profile.getFamilyName();
  var token = authResponse.id_token;

  var url = 'http://localhost:80/api/login';
  var data = '?firstName=' + firstName+ '&lastName=' + lastName + '&token=' + token + '&gid=' + id + "&photo=" + photo;
  if(googleUser.isSignedIn()){
    url += data + "&newUser=true";
    postAjax(url, data, function(data){
    //  console.log(data);
      document.cookie = "user=" + id;
      window.location = 'http://localhost/welcome';
     } );
  }else{
    url += data + "&newUser=false";
    postAjax(url, data, function(data){
      console.log(data);
      document.cookie = "user=" + id;
      window.location = 'http://localhost/welcome';
     } );
  }

}
