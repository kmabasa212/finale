import { getOrderedFungingOpportunity } from "../modules/funding.js";
import { addFundingApplication, getAllFundingApplications } from "../modules/fundingApplication.js";
import { getUserApplications, addUserApplication, allowUserApplication } from "../modules/userApplications.js";
import { uploadDoc } from "../modules/storage.js";
import { modal } from "./notifications.js";
import { getAndVerifyEmail } from '../modules/security.js'

const OPList = document.getElementById('opportunities-list');
const email = window.localStorage.getItem('email');
const dropdown = document.getElementById('fundingId');
const statusList = document.getElementById('status-list');
const submitBtn = document.getElementById('submit-btn');
const files = document.getElementById('supportingDocuments');
const SignOutBtn = document.getElementById('fixedButton');

var documents ;
var closingDate;
var applicationList;
var applications;

window.onload = await getAndVerifyEmail('Applicant');
window.onload = await loadFundingApplications();
window.onload = await fundingDropDown(dropdown);
window.onload = await loadApplications(email);


if(window.localStorage.getItem('Blocked') !== null){
    let role = window.localStorage.getItem('Blocked');
    modal(`Access not granted as you did not register as ${role}.`);
    
    window.localStorage.removeItem('Blocked');
}

SignOutBtn.addEventListener('click', () =>{
    for (let i = 0; i < localStorage.length; i++) {
        let key = localStorage.key(i);
        let value = localStorage.removeItem(key);
        console.log(`${key}: ${value}`);
    }
    window.location.href = 'https://mango-rock-04251f303.5.azurestaticapps.net./index.html';
    
});

/*  FUNCTION: This is a function that gets and displays all the Applications Associated with a Funding Opportunity
*   PARAMS: name-thia is the name of the funding opportunity you want to be displayed
*   The function updated FundingApplications array which will contain all the funding Opportunities
*/
async function loadFundingApplications(){
    applications = await getAllFundingApplications();
    displayAllApplications(OPList,applications,'fundingList');
}



/* FUNCTION: Displays all applications on the page
*
*
*/
function displayAllApplications(fullList, array, type){
    fullList.innerHTML = '';
    const list = document.createElement('ul');

    const nameDiv = document.createElement('div');
    const statusDiv = document.createElement('div');

    if(type === 'applicationList'){
        fullList.className = 'application-list';
        nameDiv.className = 'name-div';
        statusDiv.className = 'status-div';

        const nameHeader = document.createElement('p');
        nameHeader.className = 'format-header';
        nameHeader.textContent = 'Funding Opportunity';
        const statusHeader = document.createElement('p');
        statusHeader.className = 'format-header';
        statusHeader.textContent = 'Status';

        nameDiv.appendChild(nameHeader);
        statusDiv.appendChild(statusHeader);
    }else{
        list.className = 'funding-list';
    }

    array.forEach((doc, index) => {
        if(type === 'applicationList'){

            const statusList = document.createElement('p');
            statusList.className = 'status-list';
            statusList.textContent = doc.Status;

            const nameList = document.createElement('p');
            nameList.className = 'name-list';
            nameList.textContent = doc.FundingOpportunity;

            if(doc.Status == 'Approved'){
                statusList.style.color = '#138808';
            }else if(doc.Status == 'Rejected'){
                statusList.style.color = '#FF0000';
            }

            nameDiv.appendChild(nameList);
            statusDiv.appendChild(statusList);


        }else{
            const fund = document.createElement('li');
            fund.className = 'fund-opportunity';

            const listDate = document.createElement('p');
            listDate.className = 'closing-date';
            listDate.textContent = `Closing Date: ${doc.ClosingDate}`;
            const displayName = document.createElement('p');
            displayName.className = 'fund-name';
            displayName.textContent = `${doc.Name}`
            
            fund.appendChild(displayName);
            fund.appendChild(listDate);

            list.appendChild(fund);

        }
           
    });

    if(type === 'applicationList'){
        fullList.appendChild(nameDiv);
        fullList.appendChild(statusDiv);
    }else{
        fullList.appendChild(list);
    }
    
}



/*  FUNCTION: Gets all the funding opportunities in the database and adds them to the dropdown menu
*
*
*/
async function fundingDropDown(dropdown){
    dropdown.innerHTML = `<option value="Select">Select</option>`;
    //console.log(querySnapshot);
    const allFunds = await getOrderedFungingOpportunity();
    //console.log(allFunds);

    //sorts the funding opportunity array
    allFunds.sort((str1, str2)=>{
        let firstLetterA = str1.charAt(0).toUpperCase();
        let firstLetterB = str2.charAt(0).toUpperCase();

        if (firstLetterA < firstLetterB) {
            return -1;
        } else if (firstLetterA > firstLetterB) {
            return 1;
        } else {
            return 0;
        }
    });

    //display or add the Funding Opportunities to the dropdown menu
    allFunds.forEach((doc) => {
        dropdown.innerHTML += `<option value="${doc}">${doc}</option>`
    });
}


/*  FUNCTION: gets and displays all the applications of a applicant
*
*
*/
async function loadApplications(email){
    applicationList = await getUserApplications(email);
    displayAllApplications(statusList, applicationList,'applicationList');
}


/* FUNCTION: This is a function dedicated to allow users to be able to apply for Funding Opportunity
*  PARAMS: userID- This corresponds to the ID of the user
*   This functions does the operations and exits.
*/
async function applyForFundingOpportunity(FOName){
    const isValidApplication = await allowUserApplication(email, FOName);
    //If a user has already applied for the Funding Opportunity then they cant apply again
    if(!isValidApplication){
      modal('You have already Applied for this funding.');
      return;
    }
  
    closingDate = applications.find((element)=>{
        if(element.Name === FOName){
            return element.ClosingDate;
        }
    });
    //console.log(closingDate);
    console.log(documents);
    await addUserApplication(email, closingDate, FOName);
    await addFundingApplication(FOName, email);

    documents.forEach(async (file, index)=>{
        await uploadDoc(file, file.name, email, FOName, index);
    });

    window.location.reload();
}

submitBtn.addEventListener('click', async()=>{
    console.log('Hello');
    const FOName = dropdown.value;
    console.log(files.value);
    await applyForFundingOpportunity(FOName);
    
});

submitBtn.addEventListener('click', ()=>{
    const FOName = dropdown.value;
    if(FOName != "Select"){
        modal(`Your application for ${FOName} is successful and will be reviewed`);
    }else{
        modal("Please select a funding opportunity");
    }
    
}) 


files.addEventListener('change', (event)=>{
    documents= [];
    for (let index = 0; index < event.target.files.length; index++) {
        documents.push(event.target.files[index]);
    }
    //documents = event.target.files; 
});


