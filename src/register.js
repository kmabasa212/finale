// Import the functions you need from the SDKs you need
import { registerUser } from "../modules/users.js";
import { auth } from "../modules/init.js";



const user = auth.currentUser;
var admin = false;
var fundManager = false;
var applicant = false;

const userName = document.getElementById('fullname');
const userEmail = document.getElementById('email');
const userIDNum = document.getElementById('ID');
const userReason = document.getElementById('Reason');
const userRole = document.getElementById('Type');





const btn_submit_signup = document.getElementById('btn-submit-signup');

btn_submit_signup.addEventListener('click', async ()=>{
    

    const role = userRole.value;
    if( role === "Admin"){
        admin = true;
        fundManager = false;
        applicant = false;
    }else if(role === "Fund-Manager"){
        admin = false;
        fundManager = true;
        applicant = false;
    }else{
        admin = false;
        fundManager = false;
        applicant = true;
    }

    if(userName.value && userEmail.value && userIDNum.value && userReason.value && userRole.value){
        await registerUser(admin, fundManager, applicant, userEmail.value, userName.value, document.getElementById('response'));
        
    }else{
        document.getElementById('response').innerHTML = 'Please enter required fields';
        document.getElementById('response').style.color = 'red';
        document.getElementById('response').style.textAlign = 'center';
        document.getElementById('response').style.marginBottom = '2px';
    }
})
