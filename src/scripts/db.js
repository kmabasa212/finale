import { initializeApp } from "https://www.gstatic.com/firebasejs/10.11.0/firebase-app.js"
import { getFirestore, collection, addDoc, getDocs, doc, query, where, orderBy, updateDoc, or, deleteDoc  } from "https://www.gstatic.com/firebasejs/10.11.0/firebase-firestore.js";


const firebaseConfig = {
  apiKey: "AIzaSyD-4HV9w6vG-y6QGrIxgn8F10s7ugLcHYo",
  authDomain: "login-with-firebase-data-d447f.firebaseapp.com",
  projectId: "login-with-firebase-data-d447f",
  storageBucket: "login-with-firebase-data-d447f.appspot.com",
  messagingSenderId: "972550034552",
  appId: "1:972550034552:web:2fa6da4f5f6a7825d9098d"
  };
// Initialize Firebase
const app = initializeApp(firebaseConfig);
// Initialize Cloud Firestore and get a reference to the service
const db = getFirestore(app);

//intialise app variables
//Get references to buttons
const addBtn = document.getElementById('addSum');
const getBtn = document.getElementById('getSum');
const addUserAppBtn = document.getElementById('addUserApp');
const updateSignInBtn = document.getElementById('updateSignIn');
const getUserAppBtn = document.getElementById('getUserApp');
const getOrderedUserApp = document.getElementById('getOrderedUserApp');
const createFundingOpportunity = document.getElementById('createFundingOpportunity');
const showFundingOpportunity = document.getElementById('showFundingOpportunity');
const applyFundingOpportunity = document.getElementById('applyFundingOpportunity');
const showFundingOpportunityApplications = document.getElementById('showFundingOpportunityApplications');
const acceptBtn = document.getElementById('Accept');
const rejectBtn = document.getElementById('Reject');
const allInfo = document.getElementById('Client-info'); //This is the part where we display operation status
const appInfo = document.getElementById('App-info'); //This is where we display info we want to display
//const email = "2508872@students.wits.ac.za";
const email = window.localStorage.getItem('email');
var FOName = "ABSA Bursary";
var userApplicationID;
var userID;
var fundID;
var userApplications = [];  //Array that contains all the user applications in our database
var users = [];  //Array that contains all the users we have in our database
var fundingOpportunities = [];   //Array that contains all the Funding Opportunities we have in the database
var FundingApplications = [];   //Array that stores all the Applications to a Funding Opportunity


//==================================================Users==============================================================

//Function that displays the Applictions made by specific user
function displayApplications(array){
  array.forEach((data)=>{
    const ID = data.userID;
    const STATUS = data.status;
    const SUBMITDATE = data.submitDate;
    const CLOSINGDATE = data.closingDate;
    const userInfoDiv = document.getElementById("user-info");
    userInfoDiv.innerHTML = `
        <h2>${"Applicaton"}</h2>
        <p>ID: ${ID}</p>
        <p>Status: ${STATUS}</p>
        <p>Date Apply: ${SUBMITDATE}</p>
    `;

  });
}


//TODO: fix it so you can update user information
async function updateSignIn(userID){
  
  try {
    const q = doc(db, "users", userID);
    await updateDoc(q, {
      isSignIn: false, 
    })
    .then(()=>{
      allInfo.textContent = "Updated Sucessfully";
    })
    .catch((error)=>{
      console.error("Error updating document: ", error)
    });
    
  } catch (e) {
    console.error("Error updating document: ", e);
  }
}

/*  FUNCTION: Adds user to the database
*   PARAMETERS: email- User email that we need to has
*               role- specifies the role of the user
*               isSignIn- specifies whether or not user is SignedIn
*               token- this is the token received from google signIn
*   TODO: Hash email address for security issues
*/
async function addUser(email, role, isSignIn, userToken){
    try {
        const docRef = await addDoc(collection(db, "users"), {
          Email: email,
          Role: role,
          isSignIn: isSignIn,
          Token: userToken
        });
        allInfo.textContent = "Sucessfully Added";
      } catch (e) {
        console.error("Error adding document: ", e);
    }
}


/*  FUNCTION: Creates and/or adds a subcollection
*   In this case it creates a subcollection that stores all user Applications
*   PARAMS: userID- is the userID that comes from the database and is used to get the user document
*           After getting user document we create a collection in that user document
*   TODO: be able to update status
*/
async function addUserApplication(appName, userID, closingDate){
  try {
      // Reference to the user document
      const userRef = doc(db, 'users', userID);

      // Reference to the subcollection
      const applicationsRef = collection(userRef, 'Applications');
      const currentDate = new Date().toLocaleDateString();

      const docRef = await addDoc(applicationsRef, {
        FundingOpportunity: appName,
        userID: userID,
        status: "Pending",
        submitDate: currentDate,
        closingDate: closingDate
      });
      allInfo.textContent = "Added Application Sucessfully";
    } catch (e) {
      console.error("Error adding document: ", e);
  }
}


/*  FUNCTION: returns an array full of all the users in the database
*   Updates users array which we can use to see all users in the database
*/
async function getUsers(){
  const querySnapshot = await getDocs(collection(db, "users"));
  users = [];
  querySnapshot.forEach((doc) => {
    users.push(doc.data());
  });
  allInfo.textContent = "Operation Sucessful";
}


/*  FUNCTION: returns an array full of all the applications made by user in the database
*   PARAMS: userID- used to navigate to user documents
*   Updates userApplication array which we can use to see all users in the database
*/
async function getUserApplications(userID){
  const querySnapshot = await getDocs(collection(db, "users", userID, "Applications"));
  userApplications = [];
  querySnapshot.forEach((doc) => {
    userApplications.push(doc.data());
  });
  displayApplications(userApplications);
}

/*  FUNCTION: returns an array full of all the applications made by user in the database
*   PARAMS: userID- used to navigate to user documents
*   Check whether or not a user has applied to a specific Funding Opportunity
*/
async function allowUserApplication(userID, FOName){
  const userRef = query(collection(db, 'users',userID, 'Applications'), where('Name', '==',FOName));
  const namesQuerySnapshot = await getDocs(userRef);
  if(namesQuerySnapshot.empty){
    return true;
  }
  const doc = namesQuerySnapshot.docs[0];

  // Reference to the subcollection
  const applicationsRef = collection( doc.ref);
  const q = query(doc.ref, where('status','==','Pending'));
  const querySnapshot = await getDocs(q);
  if(querySnapshot.empty){
    return true;
  }
  return false;
}


/*  FUNCTION: Unrelated but this functions retrieves a specific doc from the user
*   PARAMS: userID- inorder to retrieve this information we specify the userID
*   Updates users array which will only store the document of the specific user
*/
async function getSpecificUser(userID){
  const q = query(doc(db, "users", userID));
  const querySnapshot = await getDocs(q);
  users = [];
  querySnapshot.forEach((doc) => {
    users.push(doc.data());
  });
}

/*  FUNCTION: gets all the applications associated with a user from the latest to the oldest
*   PARAMS: userID- will be used to loacte or specify the user we want to see all the applications
*   Then userApplications will be used to display all the applications associated with the user along with the contents
*/
async function getAllApplications(userID){
  userApplications = [];
  const q = query(collection(db, 'users', userID, 'Applications'), where("status", "==", "approved"), orderBy("submitDate", "asc"));
  const querySnapshot = await getDocs(q);
  querySnapshot.forEach((doc) => {
    userApplications.push(doc.data());
  });
  
  displayApplications(userApplications);
}

/*  FUNCTION: This is used to get the Application ID of the Funding Opportunity from user side
*   PARAMS: name- this is the name of the Funding Opportunity
*           userID- this takes in the userID of the user
*   This function will update userApplicationID which is the same ID we want 
*/
async function getUserApplicationID(name,userID){
  try {
    const q = query(collection(db, 'users',userID,'Applications'), where('FundingOpportunity', '==', name));
    const querySnapshot = await getDocs(q);
    //console.log(querySnapshot);
    querySnapshot.forEach((doc) => {
      userApplicationID = doc.id;
    });

  } catch (error) {
    console.error(error);
  }
}



/*   FUNCTION: Used to help us find the userID  of a specific user which will be used through out our query searches
*   PARAMS: email- will be used to find the row that contains the email, essentially locating the user
*   TODO: Hash the email so it can correspond with the hashed email in our database
*   This funtion returns the userID of a user
*/  
async function getUserID(email){
  try {
    const q = query(collection(db, 'users'), where('Email', '==', email));
    const querySnapshot = await getDocs(q);
    //console.log(querySnapshot);
    querySnapshot.forEach((doc) => {
      userID = doc.id;
    });

  } catch (error) {
    console.error(error);
  }
  
}

//When the page loads we want to fetch the userID immediately
window.onload = getUserID(email);

//======================================Funding Opportunities===========================================================

/*  FUNCTION: Serves to provide the ID of a Specific Funding Opportunity
*   PARAMS: name- this is the name of the funding Opportunity
*   The resulting of this function is that it returns the id of the Funding Opportunity based on a name search
*/
async function getFundingOpportunityID(name){
  try {
    const q1 = query(collection(db, 'Funding Opportunity'), where("Name", "==", name));
    const querySnapshot = await getDocs(q1);
    //console.log(querySnapshot);
    querySnapshot.forEach((doc) => {
      fundID = doc.id;
    });

  } catch (error) {
    console.error(error);
  }
}
getFundingOpportunityID(FOName);





/* FUNCTION: Checks whether or not there is another funding opportunity with the exact same name
* PARAMS: name- this is the name of funding opportunity to verify or chack if it already exists
*  Should return true if there is no funding opportunity with the same name
*/
async function verifyFundingName(name){
  const userRef = query(collection(db, 'Funding Opportunity'), where('Name','==',name));
  const namesQuerySnapshot = await getDocs(userRef);
  if(namesQuerySnapshot.empty){
    return true;
  }
  return false;
}


/*  FUNCTION: This function creates a funding opprtunity
*   PARAMS: FOName- this is the name of the funding opportunity
*           type- specifies the type of funding(eg.Educational)
*           budget- explains the amount of money the Fund Manager is willing to spend on the Funding Opportunity
*           description- self-explanatory, is the Funding Opportunity description
*           closing- this is the closing date of the funding Opportunity
*   The function adds to fundingOpportunities list which stores a list of all funding Opportunities
*/
async function createFundingOportunity(FOName,type,budget,description,closing){
  try {
    const verified = await verifyFundingName(FOName);
    //If !verified then the name of the funding opportunity to be created already exists
    if(!verified){
      console.log('Funding Opportunity with the same name exists');
      return;
    }

    const docRef = await addDoc(collection(db, "Funding Opportunity"), {
      Name: FOName,
      Type: type,
      Budget: budget,
      allocatedFunds: 0,
      Description: description,
      closingDate: closing
    });
    fundingOpportunities.push(docRef.id);
    allInfo.textContent = "Sucessfully Added";
  } catch (e) {
    console.error("Error adding document: ", e);
  }
}


/*  FUNCTION: This is a function that shows all funding opportunities
*   The function makes the fundingOpportunities list empty so we can add all the funding Opportunities
*/
async function showAllFundingOpportunities(){
  const querySnapshot = await getDocs(collection(db, "Funding Opportunity"));
  fundingOpportunities = [];
  querySnapshot.forEach((doc) => {
    fundingOpportunities.push(doc.data());
  });
  allInfo.textContent = "Operation Sucessful";
}


/*  FUNCTION: This is a function used to get the budget of a Funding Opportunity given the name of the Funding Opportunity
*   PARAMS: FOName- This is the name of the Funding Opportunity
*   The result of the function is that it returns a value that represents the budgeted value
*/
async function getFundingOpportunityBudget(FOName){
  const q = query(collection(db, "Funding Opportunity"), where("Name","==", FOName));
  const querySnapshot = await getDocs(q);
  querySnapshot.forEach((doc) => {
    return doc.data().Budget;
  });
}

/*  FUNCTION: This is a function used to get the Allocated Funds of a Funding Opportunity given the name of the Funding Opportunity
*   PARAMS: FOName- This is the name of the Funding Opportunity
*   The result of the function is that it returns a value that represents the Allocated Funds value
*/
async function getFundingOpportunityAlloc(FOName){
  const q = query(collection(db, "Funding Opportunity"), where("Name","==", FOName));
  const querySnapshot = await getDocs(q);
  querySnapshot.forEach((doc) => {
    return doc.data().allocatedFunds;
  });
}


/*  FUNCTION: This is a function that adds a funding Opportunity Application to the Funding Opportunity
*   PARAMS: userID- this is the ID of the user
*           closingDate- this is the closing date of the funding opportunity
*/
async function addFundingApplication(userID, fundID){
  try {

    // Reference to the user document
    const userRef = doc(db, 'Funding Opportunity', fundID);

    // Reference to the subcollection
    const applicationsRef = collection(userRef, 'Applications');
    const currentDate = new Date().toLocaleDateString();

    const docRef = await addDoc(applicationsRef, {
      userID: userID,
      Status: "Pending",
      submitDate: currentDate
    });
    allInfo.textContent = "Added Application Sucessfully";
  } catch (e) {
    console.error("Error adding document: ", e);
}
}


/* FUNCTION: This is a function dedicated to allow users to be able to apply for Funding Opportunity
*  PARAMS: userID- This corresponds to the ID of the user
*   This functions does the operations and exits.
*/
async function applyForFundingOpportunity(userID, fundID, closingDate){
  const isValidApplication = await allowUserApplication(userID, FOName);
  //If a user has already applied for the Funding Opportunity then they cant apply again
  if(!isValidApplication){
    console.log('Already Applied for this Funding Opportunity');
    return;
  }

  addUserApplication(FOName, userID, closingDate);
  addFundingApplication(userID, fundID);
}


/*  FUNCTION: This is a function that displays all the Applications Associated with a Funding Opportunity
*   PARAMS: name-thia is the name of the funding opportunity you want to be displayed
*   The function updated FundingApplications array which will contain all the funding Opportunities
*/
async function showAllFundingApplications(name){
  FundingApplications = [];

  const userRef = query(collection(db, 'Funding Opportunity'), where('Name','==',name));
  const namesQuerySnapshot = await getDocs(userRef);

  const doc = namesQuerySnapshot.docs[0];

  // Reference to the subcollection
  const applicationsRef = collection( doc.ref,'Applications');
  const q = query(applicationsRef, orderBy("submitDate", "asc"));
  const querySnapshot = await getDocs(q);
  console.log(querySnapshot);
  querySnapshot.forEach((doc) => {
    console.log(doc.data());
    FundingApplications.push(doc.data());
  });
  
  displayApplications(FundingApplications);
}


/*  FUNCTION: This function removes an application to the Funding Opportunity on the Funding Management side
*   PARAMS: fundID-this is the ID of the Funding Opportunity
*           userID-this is the userID of user Application to be removed 
*   This is a void function that removes the application permanently
*/
async function removeFundingApplication(fundID, userID){
  const docRef = query(collection(db, 'Funding Opportunity', fundID,'Applications'), where('userID', '==', userID));
  const namesQuerySnapshot = await getDocs(docRef);

  const doc = namesQuerySnapshot.docs[0];
  deleteDoc(doc.ref)
  .then(() => {
    console.log('Document successfully deleted!');
    allInfo.textContent = "Rejected Sucessfully on Funding Opportunity Database";
  })
  .catch((error) => {
    console.error('Error removing document: ', error);
  });
}


/*  FUNCTION: This function is responsible for handling the rejection of applications to Funding Opportunities
*   PARAMS: FOName- this is the name of the Funding Opportunity
*           userID- is the ID of the user
*           fundID- this is the ID of the Funding Opportunity
*   Is a void function that deletes the application from Funding Opportunity and updates the application on the user side to rejected
*/
async function onRejectApplication(FOName, userID,fundID){
  try {
    await getUserApplicationID(FOName, userID);
    //console.log(userApplicationID);
    const q = doc(db, "users", userID, 'Applications', userApplicationID);
    await updateDoc(q, {
      status: 'Rejected', 
    })
    .then(()=>{
      allInfo.textContent = "Rejected Sucessfully";
    })
    .catch((error)=>{
      console.error("Error updating document: ", error)
    });
    
  } catch (e) {
    console.error("Error updating document: ", e);
  }

  await removeFundingApplication(fundID,userID);
}


/*  FUNCTION: This function is responsible for handling the acceptance of applications to Funding Opportunities
*   PARAMS: FOName- this is the name of the Funding Opportunity
*           userID- is the ID of the user
*           fundID- this is the ID of the Funding Opportunity
*   Is a void function that updates the application from Funding Opportunity and  the application on the user side to accepted
*/
async function onAcceptApplication(FOName, userID){
  try {
    await getUserApplicationID(FOName, userID);
    //console.log(userApplicationID);
    const q = doc(db, "users", userID, 'Applications', userApplicationID);
    await updateDoc(q, {
      status: 'Accepted', 
    })
    .then(()=>{
      allInfo.textContent = "Accepted Sucessfully";
    })
    .catch((error)=>{
      console.error("Error updating document: ", error)
    });
    
  } catch (e) {
    console.error("Error updating document: ", e);
  }

  try {
    await getFundingOpportunityID(FOName);
    const userRef = query(collection(db, 'Funding Opportunity', fundID,'Applications'), where('userID', '==', userID));
    const namesQuerySnapshot = await getDocs(userRef);

    const doc = namesQuerySnapshot.docs[0];

    await updateDoc(doc.ref, {
      status: 'Accepted', 
    })
    .then(()=>{
      allInfo.textContent = "Accepted Sucessfully on Funding Database";
    })
    .catch((error)=>{
      console.error("Error updating document: ", error)
    });
    
  } catch (e) {
    console.error("Error updating document: ", e);
  }
}


//=========================================OUR Button Event Listeners ==================================================















showFundingOpportunityApplications.addEventListener('click',()=>{
  showAllFundingApplications(FOName);
  //displayApplications(userApplications);
});

Acceptbtn.addEventListener('click', ()=>{
  onAcceptApplication(FOName, userID);
});

Rejectbtn.addEventListener('click', ()=>{
  onRejectApplication(FOName, userID, fundID);
});






/*
get elements using queries
const q = query(collection(db, "cities"), where("capital", "==", true));

const querySnapshot = await getDocs(q);
querySnapshot.forEach((doc) => {
  // doc.data() is never undefined for query doc snapshots
  console.log(doc.id, " => ", doc.data());
});


//creates a subcollection in a document
async function addUserSubCollection(){
  try {
      const docRef = await addDoc(collection(db, "users","tNg0DCaEmI7b1aKBMkG4","Application"), {
        status: "Pending",
        last: "Lovelace",
        born: 1815
      });
      console.log("Document written with ID: ", docRef.id);
      console.log("Document written with ID: ", docRef2.id);
    } catch (e) {
      console.error("Error adding document: ", e);
  }
}


//gets subcollections of user using user ID
async function getUsersID(){
  const userID = "tNg0DCaEmI7b1aKBMkG4"
  const querySnapshot = await getDocs(collection(db, "users", userID,"Application"));
  let i = 0;
  querySnapshot.forEach((doc) => {
    users.push(doc.data());
    //console.log(`${doc.id} => ${doc.data()}`);
    if(i == 11){
      doc
    }
  });
  console.log(querySnapshot);
  console.log(users);
}



var citiesRef = collection(db, "users");
  citiesRef.where("country", "==", "USA").orderBy("submitDate", "desc")

*/