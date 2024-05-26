import {db, auth, provider} from './init.js';
import { collection, addDoc, getDocs, doc, query, where, orderBy, deleteDoc  } from "https://www.gstatic.com/firebasejs/10.11.0/firebase-firestore.js";
import { deleteUserApplication } from '../modules/userApplications.js'




var fundID;

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


/* FUNCTION: Checks whether or not there is another funding opportunity with the exact same name
* PARAMS: name- this is the name of funding opportunity to verify or chack if it already exists
*  Should return true if there is no funding opportunity with the same name
*/
async function verifyFundingName(name){
    const userRef = query(collection(db, 'Funding Opportunity'), where('Name','==',name));
    const namesQuerySnapshot = await getDocs(userRef);
    //console.log('Here');
    //console.log(namesQuerySnapshot);
    if(namesQuerySnapshot.empty){
      return true;
    }
    //console.log('Please use a different Funding name');
    return false;
}



/*  FUNCTION: Creates and/or adds a subcollection for roles 
*   In this case it creates a subcollection that stores all user roles
*   PARAMS: userID- is the userID that comes from the database and is used to get the user document
*           After getting user document we create a collection in that user document
*   TODO: be able to update status
*/
async function addUserRole(FOName, email){
    try {
        // Reference to the user document
        //console.log('Funding Opportunity Name: ', FOName);
        //console.log('Email: ', email);
        //const q = query( collection(db, 'Funding Opportunity'), where('Name', '==', FOName));
        const q = doc(db, 'Funding Opportunity', fundID );
  
  
        // Reference to the subcollection
        //console.log('Trying FORef');
        //const applicationsRef = collection(userRef, 'Roles');
        const roleRef = collection(q, 'Roles');
  
        //console.log('Here');
        const docRef = await addDoc(roleRef, {
          userEmail: email,
          Role: "fundManager",
        });
        console.log("Added Role Sucessfully");
      } catch (e) {
        console.error("Error adding document: ", e);
    }
}


/*  FUNCTION: This function creates a funding opprtunity
*   PARAMS: FOName- this is the name of the funding opportunity
*           type- specifies the type of funding(eg.Educational)
*           budget- explains the amount of money the Fund Manager is willing to spend on the Funding Opportunity
*           description- self-explanatory, is the Funding Opportunity description
*           closing- this is the closing date of the funding Opportunity
*   The function adds to fundingOpportunities list which stores a list of all funding Opportunities
*/
async function createFundingOportunity(name, type, estimatedFund, applicantFund,suitable, deadline,summary, email){
    try {
      const verified = await verifyFundingName(name);
      //If !verified then the name of the funding opportunity to be created already exists
      if(!verified){
        console.log('Funding Opportunity with the same name exists');
        return;
      }
  
      const docRef = await addDoc(collection(db, "Funding Opportunity"), {
        Name: name,
        Type: type,
        EstimatedFunds: Number(estimatedFund),
        ApplicantFund: Number(applicantFund),
        Description: summary,
        SuitableCandidates: suitable,
        TransactionSummary: {0: 0},
        ClosingDate: deadline,
        Manager: email,
        Status: 'Pending',
        AvailableFunds: estimatedFund
      });

      //console.log('Email: ', email);
      //console.log('Why email not logging');
      await getFundingOpportunityID(name);
      //await addUserRole(name, email);
      console.log("Sucessfully Added");
    } catch (e) {
      console.error("Error adding document: ", e);
    }
}



async function getOrderedFungingOpportunity(){
const querySnapshot = await getDocs(collection(db, "Funding Opportunity"), where('Status', '==','Approved'),orderBy("Name"));
  const allFunds = [];

  //results from database
  querySnapshot.forEach((doc)=>{
      allFunds.push(doc.data().Name);
  });

  return allFunds;
}


async function getRoleOrderedFungingOpportunity(email){
  const querySnapshot = await getDocs(collection(db, "Funding Opportunity"), where('Manager', '==',email),orderBy("Name"));
    const allFunds = [];
  
    //results from database
    querySnapshot.forEach((doc)=>{
        allFunds.push(doc.data().Name);
    });
  
    return allFunds;
  }




/*  FUNCTION: Retrieves and displays all information about a bursary
*
*
*/
async function getfundingByName(name){
  const q =  query(collection(db, "Funding Opportunity"), where('Name','==',name));
  const querySnapshot = await getDocs(q);
  //const data = querySnapshot.docs.data;
  //console.log(querySnapshot);
  var info;
  //console.log(data);
  querySnapshot.forEach((doc) => {
      //console.log(doc);
      info = doc.data();
      return;
  });

  return info;
}


/*  FUNCTION: This is a function that displays all the Applications Associated with a Funding Opportunity
*   PARAMS: name-thia is the name of the funding opportunity you want to be displayed
*   The function updated FundingApplications array which will contain all the funding Opportunities
*/
async function getAllFundingApplications(name){
  const userRef = query(collection(db, 'Funding Opportunity'), where('Name','==',name));
  const namesQuerySnapshot = await getDocs(userRef);

  const result = namesQuerySnapshot.docs[0];

  // Reference to the subcollection
  const applicationsRef = collection( result.ref,'Applications');
  const q = query(applicationsRef, orderBy("submitDate", "asc"));
  const querySnapshot = await getDocs(q);


  const applications = [];
  if(querySnapshot.empty){
    return applications;
  }

  //sort according to pending and approved after adding
  
  querySnapshot.forEach((doc) => {
      applications.push(doc.data());
  });
  
  return applications;
}


async function getAllFundingOpportunities(){
  const q =  query(collection(db, "Funding Opportunity"));
  const querySnapshot = await getDocs(q);
  //const data = querySnapshot.docs.data;
  //console.log(querySnapshot);
  var info = [];
  //console.log(data);
  querySnapshot.forEach((doc) => {
      //console.log(doc);
      info.push(doc.data());
  });

  return info;
}


async function deleteFundingOpportunity(name){
    try {
      const userRef = query(collection(db, 'Funding Opportunity'), where('Name', '==', name));
      const namesQuerySnapshot = await getDocs(userRef);
      
      const result = namesQuerySnapshot.docs[0];
      console.log(namesQuerySnapshot);

      const appsQuery = query(collection(result.ref, 'Applications'));
      const appsRef =await getDocs(appsQuery);
      console.log(appsQuery);
      appsRef.forEach(async (doc)=>{
        await deleteUserApplication(name, doc.data().Email)
      });
      deleteDoc(result.ref)
      .then(() => {
        console.log('Document successfully deleted!');
      })
      .catch((error) => {
        console.error('Error removing document: ', error);
      });
    } catch (error) {
      console.error('Error Removing: ',error);
    } 
  
}

export {
    createFundingOportunity,
    verifyFundingName,
    getOrderedFungingOpportunity,
    getfundingByName,
    getAllFundingApplications,
    getRoleOrderedFungingOpportunity,
    getAllFundingOpportunities, 
    deleteFundingOpportunity
}