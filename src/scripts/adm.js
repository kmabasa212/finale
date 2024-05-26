import { getUser, getAllUsers, blockUser } from "../modules/users.js";
import { getAllFundingOpportunities } from "../modules/funding.js";
import { getfundingByName, deleteFundingOpportunity } from "../modules/funding.js";
import { getAndVerifyEmail } from "../modules/security.js";
import { modal } from "./notifications.js";

window.onload = await getAndVerifyEmail('Admin');

const searchUser = document.getElementById('search-user');
const userBtn = document.getElementById('user-Search');
const searchOpportunity = document.getElementById('search-opportunity');
const opportunitydBtn = document.getElementById('opportunity-Search');
const allUserBtn = document.getElementById('user-all-Search');
const allFundBtn = document.getElementById('opportunity-all-Search'); 
const sec = document.getElementById('user-section');
const SignOutBtn = document.getElementById('fixedButton');

var currentUser;
var allUsers;
var allFunds;
var fundingOpportunity;
var userEmail;
var fundName;


SignOutBtn.addEventListener('click', () =>{
    for (let i = 0; i < localStorage.length; i++) {
        let key = localStorage.key(i);
        let value = localStorage.removeItem(key);
        console.log(`${key}: ${value}`);
    }
    window.location.href = 'https://ambitious-glacier-0cd46151e.5.azurestaticapps.net/index.html';
    
});
if(window.localStorage.getItem('Blocked') !== null){
    let role = window.localStorage.getItem('Blocked');
    modal(`Access not granted as you did not register as ${role}.`);
    
    window.localStorage.removeItem('Blocked');
}

/*
*
*
*/
async function SearchForUser(){
    userEmail = searchUser.value;
    if(!userEmail){
        sec.innerHTML = ``;
        const response = document.createElement('p');
        response.textContent = 'Enter user Details';
        response.style.color ='red';
        response.style.fontWeight = 'bold';
        sec.appendChild(response);
        sec.style.boxShadow = '0 5px 15px rgba(0, 0, 0, 0.1)';
        return;
    }
    currentUser = await getUser(userEmail);
    if(!currentUser){
        sec.innerHTML = ``;
        const response = document.createElement('p');
        response.textContent = 'User not found';
        response.style.color ='red';
        response.style.fontWeight = 'bold';
        sec.appendChild(response);
        sec.style.boxShadow = '0 5px 15px rgba(0, 0, 0, 0.1)';
        return
    }
    displayUser();
    //console.log('User found');
}

userBtn.addEventListener('click',()=>{
    SearchForUser();
});


/*
*
*
*/
async function searchFundOpportunity(){
    fundName = searchOpportunity.value;
    if(!fundName){
        sec.innerHTML = ``;
        const response = document.createElement('p');
        response.style.fontWeight = 'bold';
        response.style.color ='red';
        response.textContent = 'Please enter a Funding Opportunity';
        sec.style.textAlign = 'center';
        sec.appendChild(response);
        sec.style.boxShadow = '0 5px 15px rgba(0, 0, 0, 0.1)';
        return;
    }
    fundingOpportunity = await getfundingByName(fundName);
    if(!fundingOpportunity){
        sec.innerHTML = ``;
        const response = document.createElement('p');
        response.style.fontWeight = 'bold';
        response.style.color ='red';
        response.textContent = 'Funding Opportunity not found';
        sec.style.textAlign = 'center';
        sec.appendChild(response);
        sec.style.boxShadow = '0 5px 15px rgba(0, 0, 0, 0.1)';
        return;
    }
    //console.log(fundingOpportunity);
    displayOpportunity();
    //console.log('Funding Opportunity found');
}

opportunitydBtn.addEventListener('click', ()=>{
    searchFundOpportunity();
});


sec.addEventListener('click', async (event) => {
    if (event.target.classList.contains('approve-btn')) {
        //console.log('clicked accept btn');
        approveUser();
    }
    if (event.target.classList.contains('single-block-btn')) {
        //console.log('clicked accept btn');
        if(await blockUser(currentUser.Email)){
            sec.innerHTML = ``;
            const response = document.createElement('p');
            response.style.fontWeight = 'bold';
            response.style.color ='red';
            response.textContent = 'User Blocked';
            sec.style.textAlign = 'center';
            sec.appendChild(response);
            sec.style.boxShadow = '0 5px 15px rgba(0, 0, 0, 0.1)';
            return;
        }else{
            sec.innerHTML = ``;
            const response = document.createElement('p');
            response.style.fontWeight = 'bold';
            response.style.color ='red';
            response.textContent = 'Unable to block user';
            sec.style.textAlign = 'center';
            sec.appendChild(response);
            sec.style.boxShadow = '0 5px 15px rgba(0, 0, 0, 0.1)';
            return;
        }
    }

    
  
    else if (event.target.classList.contains('block-btn')) {
        const index = event.target.dataset.index;
        //console.log('clicked block btn');
        if(await blockUser(allUsers[index].Email)){
            sec.innerHTML = ``;
            const response = document.createElement('p');
            response.style.fontWeight = 'bold';
            response.style.color ='red';
            response.textContent = 'User Blocked';
            sec.style.textAlign = 'center';
            sec.appendChild(response);
            sec.style.boxShadow = '0 5px 15px rgba(0, 0, 0, 0.1)';
            return;
        }else{
            sec.innerHTML = ``;
            const response = document.createElement('p');
            response.style.fontWeight = 'bold';
            response.style.color ='red';
            response.textContent = 'Unable to block user';
            sec.style.textAlign = 'center';
            sec.appendChild(response);
            sec.style.boxShadow = '0 5px 15px rgba(0, 0, 0, 0.1)';
            return;
        }
    }
  
  
    else if(event.target.classList.contains('permissions-btn')){
        //console.log('clicked permissions btn');
        changePermissions();
    }

    else if(event.target.classList.contains('remove-btn')){
        const index = event.target.dataset.index;
        var fundName;
        if(index){
            //console.log('clicked remove btn at: ', index);
            fundName = allFunds[index].Name;
            await deleteFundingOpportunity(fundName);
            await SearchAllFunds();
        }else{
            fundName = fundingOpportunity;
            //console.log(fundName);
            await deleteFundingOpportunity(fundName.Name);
            sec.innerHTML = ``;
            sec.style.boxShadow ='none';
        }
        
        //console.log('clicked remove btn');

    }
});



/*
*
*
*/
async function approveUser(){
    console.log('User Approved');
}




/*
*
*
*/
async function changePermissions(){
    console.log('Permissions changed');
}



function displayUser(){
    sec.innerHTML = ``;
    const userInfo = document.createElement('table');
    userInfo.className='user-table';

    userInfo.innerHTML = `
        <thead id="table">
            <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Role</th>
                <th>Actions</th>
            </tr>
        </thead>
        <tbody>
            <tr>
                <td>${currentUser.Name}</td>
                <td>${currentUser.Email}</td>
                <td>${currentUser.Role}</td>
                <td class='btn'>
                    <input id='btns' class="single-approve-btn" type="button" value='Approve'>
                    <input id='btns' class="single-block-btn" type="button" value='block'>
                    <input id='btns' class="single-permissions-btn" type="button" value='Permissions'>
                </td>
            </tr>
        </tbody>
    `;
    sec.appendChild(userInfo);
    sec.style.boxShadow = '0 5px 15px rgba(0, 0, 0, 0.1)';
}



function displayOpportunity(){
    sec.innerHTML = ``;
    const userInfo = document.createElement('table');
    userInfo.className='user-table';

    userInfo.innerHTML = `
        <thead>
            <tr>
                <th>Name</th>
                <th>Deadline</th>
                <th>Description</th>
                <th>Actions</th>
            </tr>
        </thead>
        <tbody>
            <tr>
                <td>${fundingOpportunity.Name}</td>
                <td>${fundingOpportunity.ClosingDate}</td>
                <td>${fundingOpportunity.Description}</td>
                <td class='btn'>
                    <input id='btns' class="remove-btn"  type="button" value='Remove'>
                </td>
            </tr>
        </tbody>
    `;
    sec.appendChild(userInfo);
    sec.style.boxShadow = '0 5px 15px rgba(0, 0, 0, 0.1)';
}





allUserBtn.addEventListener('click', ()=>{
    SearchAllUsers()
});

async function SearchAllUsers(){
    allUsers = await getAllUsers();
    if(allUsers.empty){
        sec.innerHTML = ``;
        const response = document.createElement('p');
        response.style.fontWeight = 'bold';
        response.style.color ='red';
        response.textContent = 'There are currently no funding Opportunities';
        sec.style.textAlign = 'center';
        sec.appendChild(response);
        sec.style.boxShadow = '0 5px 15px rgba(0, 0, 0, 0.1)';
        return;
    }

    displayAllUsers();
    //console.log('Successfully displayed all users');
}

function displayAllUsers(){
    sec.innerHTML = ``;
    const userTable = document.createElement('table');
    userTable.className='user-table';

    const header = document.createElement('thead');
    header.innerHTML = `
        <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Role</th>
            <th>Actions</th>
        </tr>
    `;
    userTable.appendChild(header);

    allUsers.forEach((user, index) => {
        const userInfo = document.createElement('tbody');
        userInfo.innerHTML = `
            <tr>
                <td>${user.Name}</td>
                <td>${user.Email}</td>
                <td>${user.Role}</td>
                <td class='btn'>
                    <input id='btns' class="approve-btn" data-index="${index}" type="button" value='Approve'>
                    <input id='btns' class="block-btn" data-index="${index}" type="button" value='block'>
                    <input id='btns' class="permissions-btn" data-index="${index}" type="button" value='Permissions'>
                </td>
            </tr>
        `;
        userTable.appendChild(userInfo);
    });

    sec.appendChild(userTable);
    sec.style.boxShadow = '0 5px 15px rgba(0, 0, 0, 0.1)';
}



allFundBtn.addEventListener('click', ()=>{
    SearchAllFunds()
});

async function SearchAllFunds(){
    allFunds = await getAllFundingOpportunities();
    if(allFunds.empty){
        sec.innerHTML = ``;
        const response = document.createElement('p');
        response.textContent = 'There are currently no funding Opportunities';
        sec.appendChild(response);
        sec.style.boxShadow = '0 5px 15px rgba(0, 0, 0, 0.1)';
        return;
    }

    displayAllFunds();
    //console.log('Successfully displayed all users');
}

function displayAllFunds(){
    //console.log(allFunds)
    sec.innerHTML = ``;
    const fundTable = document.createElement('table');
    fundTable.className='user-table';

    const header = document.createElement('thead');
    header.innerHTML = `
        <tr>
            <th>Name</th>
            <th>Deadline</th>
            <th>Description</th>
            <th>Actions</th>
        </tr>
    `;
    fundTable.appendChild(header);

    allFunds.forEach((fund, index) => {
        const fundInfo = document.createElement('tbody');
        fundInfo.innerHTML = `
            <tr>
                <td>${fund.Name}</td>
                <td>${fund.ClosingDate}</td>
                <td>${fund.Description}</td>
                <td class='btn'>
                    <input id='btns' class="remove-btn" data-index="${index}" type="button" value='Remove'>
                </td>
            </tr>
        `;
        fundTable.appendChild(fundInfo);
    });

    sec.appendChild(fundTable);
    sec.style.boxShadow = '0 5px 15px rgba(0, 0, 0, 0.1)';
}


window.onload = await getAndVerifyEmail('Admin');
