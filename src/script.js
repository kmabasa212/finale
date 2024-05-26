// Add functionality to navigate to options pages
function navigateTo(page) {
    window.location.href = page;
}


// Function to delete a funding opportunity
function deleteOpportunity(index) {
    fundingOpportunities.splice(index, 1); // Remove opportunity at the specified index
    // Update localStorage with the updated fundingOpportunities array
    localStorage.setItem('fundingOpportunities', JSON.stringify(fundingOpportunities));
    // Refresh the page to reflect changes
    location.reload();
}

// Retrieve stored funding opportunities from localStorage
let fundingOpportunities = JSON.parse(localStorage.getItem('fundingOpportunities')) || [];

// Function to create a new funding opportunity
document.getElementById('create-form')?.addEventListener('submit', function(event) {
    event.preventDefault();
    // Get form data
    const formData = new FormData(this);
    
    // Extract relevant fields
    const title = formData.get('title');
    const description = formData.get('description');
    const category = formData.get('category');
    const deadline = formData.get('deadline');
    const eligibility = formData.get('eligibility');
    const amount = formData.get('amount');
    const documents =formData.get('documents');
    

    // Create new funding opportunity object
    const newOpportunity = {
        title,
        description,
        category,
        deadline,
        eligibility,
        amount,
        documents,
       
    };

    // Add new opportunity to fundingOpportunities array
    fundingOpportunities.push(newOpportunity);

    // Update localStorage with the updated fundingOpportunities array
    localStorage.setItem('fundingOpportunities', JSON.stringify(fundingOpportunities));

    // Redirect to advertisement.html
    window.location.href = 'advertise.html';
});

// Execute code specific to advertisement.html
if (window.location.pathname.endsWith("advertisement.html")) {
    // Display each funding opportunity
    const opportunityList = document.getElementById('opportunity-list');
    fundingOpportunities.forEach((opportunity, index) => {
        // Create HTML elements to display opportunity
        // Append them to opportunityList
    });
}

// Function to populate the list with funding opportunities
function populateOpportunityList() {
    const opportunityList = document.getElementById('opportunity-list');
    opportunityList.innerHTML = ''; // Clear previous content

    // Retrieve funding opportunities from local storage
    let fundingOpportunities = JSON.parse(localStorage.getItem('fundingOpportunities')) || [];

    // Check if there are any funding opportunities
    if (fundingOpportunities.length > 0) {
        // Loop through each funding opportunity and create HTML elements for them
        fundingOpportunities.forEach((opportunity, index) => {
            const opportunityDiv = document.createElement('div');
            opportunityDiv.classList.add('opportunity-card');
            opportunityDiv.innerHTML = `
                <h2>${opportunity.title}</h2>
                <p>Description: ${opportunity.description}</p>
                <p>Category: ${opportunity.category}</p>
                <p>Deadline: ${opportunity.deadline}</p>
                <p>Eligibility Criteria: ${opportunity.eligibility}</p>
                <p>Funding Amount: ${opportunity.amount}</p>
                <p>Required Documents: ${opportunity.documents}</p>
               
                <button onclick="deleteOpportunity(${index})">Delete</button>
            `;
            opportunityList.appendChild(opportunityDiv);
        });
    } else {
        // If there are no funding opportunities, display a message
        opportunityList.innerHTML = '<p>No funding opportunities available.</p>';
    }
}

// Call the function to populate the list when the page loads
 //window.addEventListener('load', populateOpportunityList);




// Function to populate the list with funding opportunities for the submission form
 function populateSubmissionForm() {
    const opportunitySelect = document.getElementById('opportunity');
    opportunitySelect.innerHTML = '';

    if (fundingOpportunities.length > 0) {
        fundingOpportunities.forEach(opportunity => {
            const option = document.createElement('option');
            option.value = opportunity.title;
            option.textContent = opportunity.title;
            opportunitySelect.appendChild(option);
        });
    } else {
        const option = document.createElement('option');
        option.value = '';
        option.textContent = 'No funding opportunities available';
        opportunitySelect.appendChild(option);
    }
}

// Function to submit an application
document.getElementById('submit-form')?.addEventListener('submit', function(event) {
    event.preventDefault();
    const formData = new FormData(this);

    const application = {
        opportunity: formData.get('opportunity'),
        name: formData.get('applicant-name'),
        email: formData.get('applicant-email'),
        documents: Array.from(formData.getAll('application-documents')).map(file => URL.createObjectURL(file)),
        status: 'Pending'
    };

    let applications = JSON.parse(localStorage.getItem('applications')) || [];
    applications.push(application);
    localStorage.setItem('applications', JSON.stringify(applications));

    alert('Application submitted');
    window.location.reload();
});

// Function to track application statuses
function trackApplicationStatus() {
    const statusList = document.getElementById('status-list');
    statusList.innerHTML = '';

    let applications = JSON.parse(localStorage.getItem('applications')) || [];

    if (applications.length > 0) {
        applications.forEach(application => {
            const statusDiv = document.createElement('div');
            statusDiv.classList.add('status-card');
            statusDiv.innerHTML = `
                <h2>${application.opportunity}</h2>
                <p>Name: ${application.name}</p>
                <p>Email: ${application.email}</p>
                <p>Status: ${application.status}</p>
            `;
            statusList.appendChild(statusDiv);
        });
    } else {
        statusList.innerHTML = '<p>No applications submitted.</p>';
    }
}

// Function to populate applications for fund managers
function populateApplications() {
    const applicationList = document.getElementById('application-list');
    applicationList.innerHTML = '';

    let applications = JSON.parse(localStorage.getItem('applications')) || [];

    if (applications.length > 0) {
        applications.forEach((application, index) => {
            const applicationDiv = document.createElement('div');
            applicationDiv.classList.add('application-card');
            applicationDiv.innerHTML = `
                <h2>${application.opportunity}</h2>
                <p>Name: ${application.name}</p>
                <p>Email: ${application.email}</p>
                
                <p>Status: ${application.status}</p>
                <button onclick="updateApplicationStatus(${index}, 'Approved')">Approve</button>
                <button onclick="updateApplicationStatus(${index}, 'Rejected')">Reject</button>
            `;
            applicationList.appendChild(applicationDiv);
        });
    } else {
        applicationList.innerHTML = '<p>No applications submitted.</p>';
    }
}

// Function to update application status
function updateApplicationStatus(index, status) {
    let applications = JSON.parse(localStorage.getItem('applications')) || [];
    applications[index].status = status;
    localStorage.setItem('applications', JSON.stringify(applications));
    window.location.reload();
}

// Initialize pages based on the current location
window.addEventListener('load', () => {
    const pathname = window.location.pathname;

    if (pathname.endsWith('advertise.html')) {
        populateOpportunityList();

    } else if (pathname.endsWith('submit.html')) {
        populateSubmissionForm();
    } else if (pathname.endsWith('track.html')) {
        trackApplicationStatus();
    } else if (pathname.endsWith('applications.html')) {
        populateApplications();
    }
    else if(pathname.endsWith('advertise_applicant.html')){
        populateOpportunityList();
    }
}); 








































