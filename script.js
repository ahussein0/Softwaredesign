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
  
  // Handle Sidebar Link Clicks and Show Sections
  const allLinks = document.querySelectorAll(".sidebar-links a");
  
  allLinks.forEach((elem) => {
    elem.addEventListener("click", function (event) {
      event.preventDefault();  // Prevent page reload
      const sectionId = elem.getAttribute('onclick').match(/'([^']+)'/)[1]; // Extract the section ID
      showSection(sectionId);  // Show the corresponding section
    });
  });
  