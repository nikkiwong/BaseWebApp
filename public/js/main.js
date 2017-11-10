// Gets called whenever the user clicks "sign in" or "sign out".
function toggleSignIn() {
  if (!firebase.auth().currentUser) { // if no user, handle login
    var provider = new firebase.auth.GoogleAuthProvider();
    provider.addScope('https://www.googleapis.com/auth/plus.login');
    firebase.auth().signInWithPopup(provider).then(function(result) {
      console.log("success");
    }).catch(function(error) {
      console.error("error", error);
    });
  } else { // handle logout
    firebase.auth().signOut();
  }

  //This disables the button until login or logout is successful
  $('#login-button').attr("disabled", true);
}


// The main purpose of this function is to set up a listener (using firebase) for when the auth state changes.
// If a user isn't authenticated, we should not show the stream and prompt them to log in.
// If a use IS authenticated, we should load/show the stream and give them the option to log out.
window.onload = function() {
  firebase.auth().onAuthStateChanged(function(user) {
    if (user) {
      $('#stream').show();
      $('#login-button').html("Log out");
      initializeStreamListener();
    } else {
      $('#stream').hide();
      $('#login-button').html("Log in with google");
    }
    $('#login-button').attr("disabled", false);
  });
};