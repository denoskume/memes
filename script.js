document.addEventListener("DOMContentLoaded", () => {
    const links = document.querySelectorAll(".navbar a");
    const content = document.getElementById("content");

    // Load default page (Home.html)
    loadPage("pages/Home.html");

    // Attach click event listeners to links
    links.forEach(link => {
        link.addEventListener("click", (event) => {
            event.preventDefault(); // Prevent default anchor behavior
            const page = link.getAttribute("data-page");
            loadPage(`pages/${page}`);
        });
    });

    // Function to load a page dynamically
    function loadPage(page) {
        fetch(page)
            .then(response => {
                if (!response.ok) {
                    throw new Error("Page not found");
                }
                return response.text();
            })
            .then(data => {
                content.innerHTML = data; // Insert page content into <main>
            })
            .catch(error => {
                content.innerHTML = `<h2>Error</h2><p>${error.message}</p>`;
            });
    }
});
