// This function sets up a listener- '.on()' gets called automatically whenever something saved in '/stream/' changes.
// It's main purpose is to iterate over the stream in the database and add each message to the page.
function initializeStreamListener() {
  const databaseStreamReference = firebase.database().ref('/stream/');

  databaseStreamReference.on('value', function(snapshot) {
    var messages = snapshot.val();
    $('#stream').empty();

    if (messages) {
      Object.keys(messages).forEach(function (key) {
        const message = messages[key];
        $('#stream').append(`<div><img src='${message.authorPic}'></div>
        	<div>Author: ${message.author}</div>
        	<div>Message: ${message.body}</div>
        	<button type="submit" id="like">Like</button>` );
      });
    }
  });
}

// This function gets called with the new message information.
// It gets the user information and uses both to add the post to the database.
function addMessage(body, title) {
  var user = firebase.auth().currentUser;
  var authorPic = user.photoURL;
  var author = user.displayName;

  var postData = {
    author: author,
    authorPic: authorPic,
    title: title,
    body: body
  };

  var newPostKey = firebase.database().ref().child('stream').push().key;
  firebase.database().ref('/stream/' + newPostKey).set(postData);
}

var likeButton = document.getElementById("like");

likeButton.addEventListener("click", function(){
	console.log("like button clicked");
});

var refresh = document.getElementById("refresh");
refresh.addEventListener('click', function(){
	document.getElementById("new-post-title").placeholder = "title...";
	document.getElementById("new-post-body").placeholder = "message...";
});

// This gets called whenver the form is submitted (check out the index.ejs).
// Uses jQuery to get the message info and passes it to 'addMessage to actually submit the info to firebase.
function handleMessageFormSubmit() {
  var body = $('#new-post-body').val();
  var title = $('#new-post-title').val();

  addMessage(body, title);
}


// Gets called whenever the user clicks "sign in" or "sign out".
function toggleSignIn() {
  if (!firebase.auth().currentUser) { // if no user, handle login
    var provider = new firebase.auth.GoogleAuthProvider();
    provider.addScope('https://www.googleapis.com/auth/plus.login');
    firebase.auth().signInWithPopup(provider).then(function(result) {
      console.log("success");
      document.getElementById("sign").innerHTML = "Sign Out";
    }).catch(function(error) {
      console.error("error", error);
    });
  } else { // handle logout
    firebase.auth().signOut();
    document.getElementById("sign").innerHTML = "Sign In";
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