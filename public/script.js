// Function to show different sections
function showSection(sectionId) {
  const sections = document.querySelectorAll('.content-section'); // Select all content sections
  
  sections.forEach(section => {
    if (section.id === sectionId) {
      section.style.display = 'block'; // Show the matching section
    } else {
      section.style.display = 'none';  // Hide the other sections
    }
  });
}

// Automatically show the Dashboard section when the page loads
document.addEventListener('DOMContentLoaded', function() {
  showSection('dashboard'); // Show the Dashboard section on page load
});

// Handle Sidebar Link Clicks and Show Sections
const allLinks = document.querySelectorAll(".sidebar-links a");

allLinks.forEach((elem) => {
  elem.addEventListener("click", function (event) {
    event.preventDefault();  // Prevent page reload
    const sectionId = elem.getAttribute('onclick').match(/'([^']+)'/)[1]; // Extract the section ID
    showSection(sectionId);  // Show the corresponding section
  });
});



// Handle login form submission
document.getElementById('loginForm').addEventListener('submit', function(event) {
  event.preventDefault(); // Prevent the form from refreshing the page

  // Get form data
  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;

  // Send the login request to the server
  fetch('/login', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      email: email,
      password: password
    })
  })
  .then(response => response.json())
  .then(data => {
    // Handle the response
    const messageDiv = document.getElementById('loginMessage');
    if (data.status === 'success') {
      messageDiv.innerHTML = `<p style="color: green;">${data.message}</p>`;
    } else {
      messageDiv.innerHTML = `<p style="color: red;">${data.message}</p>`;
    }
  })
  .catch(error => {
    console.error('Error:', error);
  });
});

// Handle registration form submission
document.getElementById('registrationForm').addEventListener('submit', function(event) {
  event.preventDefault(); // Prevent form from refreshing the page

  const email = document.getElementById('registerEmail').value;
  const password = document.getElementById('registerPassword').value;

  // Send the registration request to the server
  fetch('/register', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      email: email,
      password: password
    })
  })
  .then(response => response.json())
  .then(data => {
    const messageDiv = document.getElementById('registerMessage');
    if (data.status === 'success') {
      messageDiv.innerHTML = `<p style="color: green;">${data.message}</p>`;
    } else {
      messageDiv.innerHTML = `<p style="color: red;">${data.message}</p>`;
    }
  })
  .catch(error => {
    console.error('Error:', error);
  });
});

// Handle profile form submission
document.getElementById('profileForm').addEventListener('submit', function(event) {
  event.preventDefault(); // Prevent form from refreshing the page

  // Get form data
  const fullName = document.getElementById('fullName').value;
  const address = document.getElementById('address').value;
  const skills = document.getElementById('skills').value;
  const availability = document.getElementById('availability').value;

  // Send profile update request to the server
  fetch('/profile', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      fullName: fullName,
      address: address,
      skills: skills,
      availability: availability
    })
  })
  .then(response => response.json())
  .then(data => {
    const messageDiv = document.getElementById('profileMessage');
    if (data.status === 'success') {
      messageDiv.innerHTML = `<p style="color: green;">${data.message}</p>`;
    } else {
      messageDiv.innerHTML = `<p style="color: red;">${data.message}</p>`;
    }
  })
  .catch(error => {
    console.error('Error:', error);
  });
});

// Handle event creation form submission
// Handle event creation form submission
// Handle event creation form submission
document.getElementById('eventForm').addEventListener('submit', function(event) {
  event.preventDefault(); // Prevent form from refreshing the page

  // Get form data
  const eventName = document.getElementById('eventName').value;
  const eventLocation = document.getElementById('eventLocation').value;
  
  // Get selected required skills (convert to an array)
  const selectedSkills = Array.from(document.getElementById('requiredSkills').selectedOptions)
                               .map(option => option.value);

  const urgency = document.getElementById('urgency').value;
  const eventDate = document.getElementById('eventDate').value;

  // Send event creation request to the server
  fetch('/events', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      eventName: eventName,
      eventLocation: eventLocation,
      requiredSkills: selectedSkills,  // Send as array
      urgency: urgency,
      eventDate: eventDate
    })
  })
  .then(response => response.json())
  .then(data => {
    const messageDiv = document.getElementById('eventMessage');
    if (data.status === 'success') {
      messageDiv.innerHTML = `<p style="color: green;">${data.message}</p>`;
    } else {
      messageDiv.innerHTML = `<p style="color: red;">${data.message}</p>`;
    }
  })
  .catch(error => {
    console.error('Error:', error);
  });
});


// Handle volunteer matching form submission
document.getElementById('matchingForm').addEventListener('submit', function(event) {
  event.preventDefault(); // Prevent form from refreshing the page

  const volunteerName = document.getElementById('volunteerName').value;
  const eventName = document.getElementById('eventName').value;

  // Send volunteer matching request to the server
  fetch('/match', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      volunteerName: volunteerName,
      eventName: eventName
    })
  })
  .then(response => response.json())
  .then(data => {
    const messageDiv = document.getElementById('matchMessage');
    if (data.status === 'success') {
      messageDiv.innerHTML = `<p style="color: green;">${data.message}</p>`;
    } else {
      messageDiv.innerHTML = `<p style="color: red;">${data.message}</p>`;
    }
  })
  .catch(error => {
    console.error('Error:', error);
  });
});
// Fetch volunteer history and display in the table
function loadVolunteerHistory() {
  fetch('/history')
    .then(response => response.json())
    .then(data => {
      const historyTableBody = document.getElementById('historyTable').querySelector('tbody');
      historyTableBody.innerHTML = ''; // Clear current data

      data.forEach(item => {
        const row = document.createElement('tr');
        row.innerHTML = `
          <td>${item.eventName}</td>
          <td>${item.eventDate}</td>
          <td>${item.status}</td>
        `;
        historyTableBody.appendChild(row);
      });
    })
    .catch(error => {
      console.error('Error:', error);
    });
}
// Fetch and display notifications
function loadNotifications() {
  fetch('/notifications')
    .then(response => response.json())
    .then(data => {
      const notificationDiv = document.getElementById('notificationMessage');
      notificationDiv.innerHTML = ''; // Clear current notifications

      data.forEach(notification => {
        const p = document.createElement('p');
        p.textContent = notification;
        notificationDiv.appendChild(p);
      });
    })
    .catch(error => {
      console.error('Error:', error);
    });
}

// Call the function to load notifications when the page loads or when needed
loadNotifications();


// Call the function to load history when the page loads or when needed
loadVolunteerHistory();


