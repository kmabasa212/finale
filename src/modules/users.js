import { db, auth, provider } from './init.js';
import { modal } from '../scripts/notifications.js';
import { signInWithPopup , GoogleAuthProvider, signOut} from "https://www.gstatic.com/firebasejs/10.11.0/firebase-auth.js"
import { collection, getDocs, query, where, addDoc } from "https://www.gstatic.com/firebasejs/10.11.0/firebase-firestore.js";




/*   FUNCTION: Used to help us find the userID  of a specific user which will be used through out our query searches
*   PARAMS: email- will be used to find the row that contains the email, essentially locating the user
*   TODO: Hash the email so it can correspond with the hashed email in our database
*   This funtion returns the userID of a user
*/  
async function getUserID(email){
    try {
      const q = query(collection(db, 'users'), where('Email', '==', email));
      const querySnapshot = await getDocs(q);
      //console.log(querySnapshot.docs[0].id);
      return querySnapshot.docs[0].id;
  
    } catch (error) {
      console.error(error);
    }
    
}


//Function to check if user is registered
async function verifyRole(email, role){
    try {
        console.log('Verifying role.....');
        const q = query(collection(db, 'users'), where('Email', '==', email), where('Role', '==',role));
        const querySnapshot = await getDocs(q);
        if(querySnapshot.empty){
            return false;
        }
        return true;
      } catch (error) {
        console.error(error);
      }
}


//Function to check if user is registered
async function verifyUser(email){
    try {
        console.log('Verifying Email');
        const q = query(collection(db, 'users'), where('Email', '==', email));
        const querySnapshot = await getDocs(q);
        if(querySnapshot.empty){
            return false;
        }
        if(querySnapshot.docs[0].data().Blocked === true){
            modal('You have been blocked');
            return false;
        }
        return true;
      } catch (error) {
        console.error(error);
      }
}

//Function to set the email
function setEmail(email){
    window.localStorage.setItem('email', email);
}

//Function to set the email
function getEmail(){
    return window.localStorage.getItem('email');
}

//Function to set the email
function setToken(email){
    window.localStorage.setItem('token', email);
}




/*
*
*
*/
async function AssignRole( email){
    const user =await getUser(email);
    return user.Role;

}



//FUNCTION: Registers user using their google email
async function signInUser(pTag){
    //sign-in using small window prompt
    signInWithPopup(auth, provider)
    .then(async (result) => {
        // This gives you a Google Access Token. You can use it to access the Google API.
        const credential = GoogleAuthProvider.credentialFromResult(result);
        //console.log(credential);
        // The signed-in user info.
        //return result.user;
        const user = result.user;
        const email = user.email;
        setEmail(email);
        setToken(user.accessToken);

        const verified = await verifyUser(email);
        // The signed-in user info.
        if(!verified){
            /*
            pTag.innerHTML = 'Please register';
            pTag.style.color = 'red';
            pTag.style.textAlign = 'center';
            */
            signOutUser();
            return;
        }


        const role = await AssignRole(email);

        //Then take the user to their desired home page
        if(role === 'Admin'){
            window.location.href ='https://mango-rock-04251f303.5.azurestaticapps.net/AdminUpdate.html';
        }else if(role === 'Fund Manager'){
            window.location.href ='https://mango-rock-04251f303.5.azurestaticapps.net/fundmanager.html';
        }else{
            window.location.href ='https://mango-rock-04251f303.5.azurestaticapps.net/applicant.html';
        }
            
        }).catch((error) => {
            // Handle Errors here.
            signOutUser();
            console.log(error);
            console.log('Error code: ', error.code);
        });
    
}


/*  FUNCTION: checks whether or not a user is in the database
*   PARAMETERS: email- each user has a unique email which will help us identify users
*   This function should return true or false based on whether or not a user is registered or not
*/
async function isRegistered(email){
    const userRef = query(collection(db, 'users'), where('Email', '==', email));

    const querySnapshot = await getDocs(userRef);
    //console.log(querySnapshot);
    //console.log('Is snapShot empty: ',querySnapshot.value === undefined);
    //console.log(querySnapshot.doc);
    if(querySnapshot.empty){
        //console.log('Here');
        
        console.log(querySnapshot.empty);
        return false;
    }

    return true;
}


/*  FUNCTION: Adds user to the database
*   PARAMETERS: email- User email that we need to has
*               role- specifies the role of the user
*               isSignIn- specifies whether or not user is SignedIn
*               token- this is the token received from google signIn
*   TODO: Hash email address for security issues
*/
async function addUser(email, role, isSignIn, userToken, name){
    //console.log('Email: ',email);
    //console.log('Role : ',role);
    ////console.log('Status: ',isSignIn);
    //console.log('Token: ',userToken);
    try {

        const registeredUser = await isRegistered(email);
        //console.log(registeredUser);
        if(registeredUser){
            return false;
        }
        const userRef = collection(db, 'users');

        const docRef = await addDoc(userRef, {
          Email: email,
          Name: name,
          Blocked: false,
          Role: role,
          isSignIn: isSignIn,
          Token: userToken
        });
        console.log("Sucessfully Added");
        return true;
      } catch (e) {
        console.error("Error adding document: ", e);
    }
}


function sendMail(EMail){
    (function(){
        emailjs.init("u7aPmoilsd1g-HeLQ");
    })();

    var params = {
        sendername:"LoyalFunding",
        to: EMail,
        subject: "Registration",
        replyto: "noreply@gmail.com",
        message:"You are now registered",
    };
    var serviceID = "service_4jnlv73";
    var templateID = "template_e2xx532"; 

    emailjs.send(serviceID,templateID,params)
    .then( res => {
        //alert("Mail sent");
    })
    .catch();
}


async function registerUser(admin, fundManager, applicant, email, name, pTag){
    //sign-in using small window prompt
    signInWithPopup(auth, provider)
    .then(async (result) => {
        // This gives you a Google Access Token. You can use it to access the Google API.
        const credential = GoogleAuthProvider.credentialFromResult(result);
        /*
        if( result.user.email != email){
            console.log('Result: ',result);
            console.log(result.user.emai);
            console.log(email);
            pTag.innerHTML = 'Please provide a valid email';
            pTag.style.color = 'red';
            pTag.style.textAlign = 'center';
            signOutUser();
            return;
        }*/
        //console.log(credential);
        // The signed-in user info.
        //console.log('here');
        const user = result.user;
       // console.log(user.email);
        //console.log(admin, fundManager, applicant);
        //console.log('Now Here');
        console.log(user);
        const userToken = await user.accessToken;
        setToken(user.accessToken);
        if(admin && (await addUser(user.email, "Admin", true, userToken,name)) ){
            sendMail(email);
            window.location.href ='https://ambitious-glacier-0cd46151e.5.azurestaticapps.net/AdminUpdate.html';
        }else if(fundManager && (await addUser(user.email, "Fund Manager", true, userToken, name)) ){
            sendMail(email);
            window.location.href ='https://ambitious-glacier-0cd46151e.5.azurestaticapps.net/fundmanager.html';
        }else if(applicant && (await addUser(user.email, "Applicant", true, userToken, name)) ){
            sendMail(email);
            window.location.href ='https://mango-rock-04251f303.5.azurestaticapps.net/applicant.html';
        }else{
            pTag.innerHTML = 'Invalid register details';
            pTag.style.color = 'red';
            pTag.style.textAlign = 'center';
            signOutUser();
        }
        
    }).catch((error) => {
        // Handle Errors here.
        console.log(error);
        console.log('Error code: ', error.code);
    });       
}

/*  FUNCTION: To get a specific user
*
*
*/
async function getUser(email){
    try {
        const q = query(collection(db, 'users'), where('Email', '==', email));
        const querySnapshot = await getDocs(q);
        //console.log(email);
        //console.log(querySnapshot);
        var resultUser ;
        if(querySnapshot.empty){
            resultUser= undefined;
            return resultUser;
        }
        querySnapshot.forEach(doc => {
            resultUser = doc.data()
            return ;
        });
        return querySnapshot.docs[0].data();
    } catch (error) {
       console.error('Error Retrieving Object: ',error); 
    }
}


async function getAllUsers(){
    try {
        const q = query(collection(db, 'users'));
        const querySnapshot = await getDocs(q);
        //console.log(email);
        //console.log(querySnapshot);
        var resultUser = [];
        querySnapshot.forEach(doc => {
            resultUser.push(doc.data());
        });
        return resultUser;
    } catch (error) {
       console.error('Error Retrieving Object: ',error); 
    }
}


async function signOutUser(){
    signOut(auth).then(()=>{
        //console.log('signed out successfully');
    }).catch(error=>{
        console.log(error);
    })
}


async function blockUser(email){     
    try {
      const userRef = query(collection(db, 'users'), where('Email', '==', email));
      const namesQuerySnapshot = await getDocs(userRef);

      await updateDoc(namesQuerySnapshot.docs[0].ref, {
        Blocked: true, 
      })
      .then(async ()=>{
        //console.log('Rejected succefully!');
        return true;
      })
      .catch((error)=>{
        //console.error("Error updating document: ", error)
        return false;
      });
      
    } catch (e) {
      //console.error("Error updating document: ", e);
      return false;
    }
}



export {   
    verifyRole,
     verifyUser, 
     setEmail, 
     signInUser, 
     isRegistered, 
     addUser, 
     registerUser, 
     getUser, 
     getUserID,
     getEmail,
     getAllUsers,
     signOutUser,
     blockUser
};