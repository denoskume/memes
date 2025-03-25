document.addEventListener("DOMContentLoaded", () => {
    // Select navigation links and main content placeholder
    const links = document.querySelectorAll(".navbar a");
    const content = document.getElementById("content");

    // Load default page (Home.html) on initial visit
    loadPage("pages/Home.html");

    // Attach click event listeners to navigation links
    links.forEach(link => {
        link.addEventListener("click", (event) => {
            event.preventDefault(); // Prevent default anchor behavior
            const page = link.getAttribute("data-page"); // Get the page from data-page attribute
            loadPage(`pages/${page}`);
        });
    });

    /**
     * Function to dynamically load page content
     * @param {string} page - Path to the HTML file to load
     */
    function loadPage(page) {
        fetch(page)
            .then(response => {
                if (!response.ok) {
                    throw new Error(`Page not found: ${page}`);
                }
                return response.text();
            })
            .then(data => {
                // Insert page content into the <main> element
                content.innerHTML = data;
                console.log(`Successfully loaded: ${page}`);
            })
            .catch(error => {
                // Display error message inside the <main> element
                content.innerHTML = `
                    <h2>Error</h2>
                    <p>${error.message}</p>`;
                console.error("Error loading page:", error);
            });
    }
});

// Load footer dynamically
document.addEventListener("DOMContentLoaded", () => {
    // Select footer placeholder
    const footerPlaceholder = document.getElementById("footer-placeholder");

    /**
     * Function to load footer content dynamically
     */
    function loadFooter() {
        fetch("footer.html")
            .then(response => {
                if (!response.ok) {
                    throw new Error("Footer not found.");
                }
                return response.text();
            })
            .then(data => {
                footerPlaceholder.innerHTML = data; // Insert footer content
                console.log("Footer loaded successfully.");
            })
            .catch(error => {
                footerPlaceholder.innerHTML = `<p>Unable to load footer content.</p>`;
                console.error("Error loading footer:", error);
            });
    }

    loadFooter(); // Load the footer on page load
});
