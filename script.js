// Expand/Collapse Sidebar on Button Click
const expand_btn = document.querySelector(".expand-btn");
expand_btn.addEventListener("click", () => {
  document.body.classList.toggle("collapsed");
});

// Handle Sidebar Link Clicks
const allLinks = document.querySelectorAll(".sidebar-links a");

allLinks.forEach((elem) => {
  elem.addEventListener("click", function (event) {
    event.preventDefault();  // Prevent page reload
    document.body.classList.remove("collapsed");  // Ensure sidebar expands on link click

    const sectionId = elem.getAttribute('href').substring(1);  // Get the target section ID
    showSection(sectionId);  // Show the corresponding section

    // Set active class for clicked link
    allLinks.forEach((link) => {
      if (link === elem) {
        link.classList.add("active");
      } else {
        link.classList.remove("active");
      }
    });
  });
});

// Function to Show the Corresponding Content Section
function showSection(sectionId) {
  const sections = document.querySelectorAll('.content-section');
  sections.forEach((section) => {
    section.style.display = (section.id === sectionId) ? 'block' : 'none';
  });
}

// Expand Sidebar when Search Input is Focused
const searchInput = document.querySelector(".search__wrapper input");
searchInput.addEventListener("focus", (e) => {
  document.body.classList.remove("collapsed");  // Expand sidebar when search is focused
});
