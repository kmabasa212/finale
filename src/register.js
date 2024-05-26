document.addEventListener('DOMContentLoaded', function() {
      const form = document.getElementById('signup-form');
      
      form.addEventListener('submit', function(event) {
          event.preventDefault();
          
          // Get form values
          const username = document.getElementById('username').value;
          const email = document.getElementById('email').value;
          const password = document.getElementById('password').value;
          const confirmPassword = document.getElementById('confirm-password').value;
          
          // Simple validation
          if (password !== confirmPassword) {
              alert('Passwords do not match');
              return;
          }
          
          // Perform signup logic (e.g., send data to server)
          console.log('Sign up successful!');
          
          // Display alert
          alert('You are registered');
      });
  });
  