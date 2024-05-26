import { getUser, verifyRole, signOutUser } from './users.js';
import { getAuth, auth } from './init.js';
import { onAuthStateChanged  } from "https://www.gstatic.com/firebasejs/10.11.0/firebase-auth.js"



//Function: checks and authorised
async function isAuthorised(email, role){
    const verified = await verifyRole(email, role);
    if(!verified){
        const retrievedUser = await getUser(email);
        const tempRole = retrievedUser.Role;
        //console.log(await getUser(email));
        if( tempRole == "Admin"){
            window.localStorage.setItem("Blocked", role);
            window.location.href = 'https://mango-rock-04251f303.5.azurestaticapps.net/AdminUpdate.html'; 
        }else if( tempRole == "Fund Manager"){
            window.localStorage.setItem("Blocked", role);
            window.location.href = 'https://mango-rock-04251f303.5.azurestaticapps.net/fundmanager.html'; 
        }else{
            window.localStorage.setItem("Blocked", role);
            window.location.href = 'https://mango-rock-04251f303.5.azurestaticapps.net/applicant.html';
            //console.log(tempRole);
            //console.log(email);
        }
        return;
    }

    if(!email){
        window.localStorage.setItem("Blocked", "Unregistered");
        window.location.href = 'https://mango-rock-04251f303.5.azurestaticapps.net/index.html';
        //console.error('422 error');
        return;
    }



    //Check if user in cache in the same user currently logged in
    /*
    var userToken;
    userToken = getUser(email).accessToken;
    const realToken = window.localStorage.getItem('token');
    if(userToken != realToken){
        //console.log('Token ',userToken);
        //console.log('RealToken: ',realToken);
        //signOutUser();
        window.location.href = 'https://mango-rock-04251f303.5.azurestaticapps.net/index.html';
        //console.log('Please register');
        return;
    }*/
}

async function getAndVerifyEmail(role){
    //console.log('Verifying...');
    onAuthStateChanged(auth, async (user)=>{
        //console.log(user);
        if(!user){
            window.localStorage.setItem("Blocked", "Unregistered");
            window.location.href = 'https://mango-rock-04251f303.5.azurestaticapps.net/index.html';     
            return;
        }else{
            const email = user.email;
            //console.log(user);
            isAuthorised(email, role)
        }
    });
    
}

export {
    isAuthorised,
    getAndVerifyEmail
}
