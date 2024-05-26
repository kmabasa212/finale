import { initializeApp } from "https://www.gstatic.com/firebasejs/10.11.0/firebase-app.js"
import { sendSignInLinkToEmail, isSignInWithEmailLink, signInWithEmailLink, linkWithCredential, EmailAuthProvider, getAuth, GoogleAuthProvider, onAuthStateChanged, signInWithPopup } from "https://www.gstatic.com/firebasejs/10.11.0/firebase-auth.js"

const firebaseConfig = {
    apiKey: "AIzaSyD-4HV9w6vG-y6QGrIxgn8F10s7ugLcHYo",
    authDomain: "login-with-firebase-data-d447f.firebaseapp.com",
    projectId: "login-with-firebase-data-d447f",
    storageBucket: "login-with-firebase-data-d447f.appspot.com",
    messagingSenderId: "972550034552",
    appId: "1:972550034552:web:2fa6da4f5f6a7825d9098d"
  };
var btn_register = document.getElementById('register-link');
const btn_applicant_login = document.getElementById('btn-applicant-login');
const btn_fundManganer_login = document.getElementById('btn-fundManager-login');
const btn_platformAdmin_login = document.getElementById('btn-platformAdmin-login');
// Initialize Firebase
const app = initializeApp(firebaseConfig);
//create google instance
const auth = getAuth(app);
const provider = new GoogleAuthProvider();
var admin = false;
var fundManger = false;
var applicant = false;

//Can be used to get the information of current user
const user = auth.currentUser;


btn_register.addEventListener('click',()=>{
    //After pressing the register button, user is sent to register page
    window.location.href = 'https://kmabasa212.github.io/sprint/src/register.html';
});

btn_applicant_login.addEventListener('click',()=>{
    //After user clicks login. user will be signed in
    applicant = true;
    signInUser();
});

btn_fundManganer_login.addEventListener('click',()=>{
    //After user clicks login. user will be signed in
    fundManger = true;
    signInUser();
});

btn_platformAdmin_login.addEventListener('click',()=>{
    //After user clicks login. user will be signed in
    admin = true;
    signInUser();

});

//FUNCTION: Registers user using their google email
function signInUser(){
    //sign-in using small window prompt
    signInWithPopup(auth, provider)
    .then((result) => {
        // The signed-in user info.
        const user = result.user;
        //Then take the user to their desired home page
        if(admin){
            window.location.href ='https://kmabasa212.github.io/sprint/src/admin.html';
        }else if(fundManger){
            window.location.href ='https://kmabasa212.github.io/sprint/src/fundmanager.html';
        }else{
            window.location.href ='https://kmabasa212.github.io/sprint/src/applicant.html';
        }
        
    }).catch((error) => {
        // Handle Errors here.
        const errorCode = error.code;
        const errorMessage = error.message;
    });
}


function registerWithEmail(){
    console.log('Yes');
    //get user email
    email = 'kmabasa212@gmail.com';

    const actionCodeSettings = {
        // URL you want to redirect back to. The domain (www.example.com) for this
        // URL must be in the authorized domains list in the Firebase Console.
        url: 'https://kmabasa212.github.io/Google-Verification-test/home.html',
        // This must be true.
        handleCodeInApp: true,
        iOS: {
            bundleId: 'com.example.ios'
        },
        android: {
            packageName: 'com.example.android',
            installApp: true,
            minimumVersion: '12'
        },
        dynamicLinkDomain: 'example.page.link'
    };

    sendSignInLinkToEmail(auth, email, actionCodeSettings)
        .then(() => {
            console.log('Yes2');
        // The link was successfully sent. Inform the user.
        console.log('Successfully logged in');
        // Save the email locally so you don't need to ask the user for it again
        // if they open the link on the same device.
        window.localStorage.setItem('emailForSignIn', email);
        // ...
        })
        .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        // ...
        });

    if (isSignInWithEmailLink(auth, window.location.href)) {
        console.log('Yes3');

        let email = window.localStorage.getItem('emailForSignIn');
        if (!email) {
            console.log('Yes4');
 
            email = window.prompt('Please provide your email for confirmation');
        }
        // The client SDK will parse the code from the link for you.
        signInWithEmailLink(auth, email, window.location.href)
        .then((result) => {
            console.log('Yes5');
            // Clear email from storage.
            window.localStorage.removeItem('emailForSignIn');
            // You can access the new user via result.user
            console.log(result.user);
            // Additional user info profile not available via:
            // result.additionalUserInfo.profile == null
            // You can check if the user is new or existing:
            console.log(result.additionalUserInfo.isNewUser);
        })
        .catch((error) => {
            // Some error occurred, you can inspect the code: error.code
            // Common errors could be invalid email and invalid or expired OTPs.
        });
    }

    //SingIn when user is already authentificated
    //NOTE: -User has to login in the same device where he first logged in otherwise we re-authentificate
    // Construct the email link credential from the current URL.
    const credential = EmailAuthProvider.credentialWithLink(
        email, window.location.href);

    // Link the credential to the current user.
    linkWithCredential(auth.currentUser, credential)
        .then((usercred) => {
            console.log('Yes6');
        // The provider is now successfully linked.
        // The phone user can now sign in with their phone number or email.
        })
        .catch((error) => {
        // Some error occurred.
        });
}
