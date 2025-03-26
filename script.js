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


// Initialize canvas and context variables
document.addEventListener("DOMContentLoaded", () => {
    const canvas = document.getElementById("insertMemeCanvas");
    const ctx = canvas.getContext("2d");
    let img = null;

    // Array to store text elements
    const textElements = [];
    let activeText = null;

    // Ensure canvas and necessary elements exist before attaching listeners
    const uploadImageInput = document.getElementById("insertUploadImage");
    const addTextButton = document.querySelector(".insert-button.add-text");
    const downloadButton = document.querySelector(".insert-button.download");

    if (uploadImageInput) {
        uploadImageInput.addEventListener("change", function (event) {
            const file = event.target.files[0];
            if (!file) {
                alert("No image file selected.");
                return;
            }

            const reader = new FileReader();
            reader.onload = function (e) {
                img = new Image();
                img.src = e.target.result;
                img.onload = function () {
                    drawInsertCanvas();
                };
                img.onerror = function () {
                    alert("Error loading image. Please try again.");
                };
            };
            reader.readAsDataURL(file);
        });
    }

    if (addTextButton) {
        addTextButton.addEventListener("click", () => {
            const newTextInput = document.getElementById("insertNewText");
            const newText = newTextInput.value.trim() || "New Text";
            const fontSize = document.getElementById("insertFontSize").value || 20;
            const textColor = document.getElementById("insertTextColor").value || "#000000";

            const newTextElement = {
                text: newText,
                x: canvas.width / 2,
                y: canvas.height / 2,
                fontSize: fontSize,
                color: textColor,
                isDragging: false,
            };

            textElements.push(newTextElement);
            newTextInput.value = ""; // Clear input field
            drawInsertCanvas();
        });
    }

    if (downloadButton) {
        downloadButton.addEventListener("click", () => {
            const link = document.createElement("a");
            link.download = "meme.png";
            link.href = canvas.toDataURL();
            link.click();
        });
    }

    function drawInsertCanvas() {
        // Ensure canvas and context are properly initialized
        if (!canvas || !ctx) {
            console.error("Canvas or context not found.");
            return;
        }

        // Clear canvas
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // Draw uploaded image if it exists
        if (img) {
            ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        }

        // Draw all text elements
        textElements.forEach((el) => {
            ctx.font = `${el.fontSize}px Arial`;
            ctx.fillStyle = el.color;
            ctx.strokeStyle = "black";
            ctx.lineWidth = 2;
            ctx.textAlign = "center";
            ctx.fillText(el.text, el.x, el.y);
            ctx.strokeText(el.text, el.x, el.y);
        });
    }

    // Add drag-and-drop functionality for text
    canvas.addEventListener("mousedown", (e) => {
        const mouseX = e.offsetX;
        const mouseY = e.offsetY;

        activeText = textElements.find((el) => isMouseOverInsertText(mouseX, mouseY, el));
        if (activeText) {
            activeText.isDragging = true;
        }
    });

    canvas.addEventListener("mousemove", (e) => {
        if (activeText && activeText.isDragging) {
            activeText.x = e.offsetX;
            activeText.y = e.offsetY;
            drawInsertCanvas();
        }
    });

    canvas.addEventListener("mouseup", () => {
        if (activeText) {
            activeText.isDragging = false;
            activeText = null;
        }
    });

    canvas.addEventListener("dblclick", (e) => {
        const mouseX = e.offsetX;
        const mouseY = e.offsetY;

        const textIndex = textElements.findIndex((el) => isMouseOverInsertText(mouseX, mouseY, el));
        if (textIndex !== -1) {
            const userText = prompt("Enter text for the text box:", textElements[textIndex].text || "");
            if (userText !== null) {
                textElements[textIndex].text = userText.trim();
                drawInsertCanvas();
            }
        }
    });

    function isMouseOverInsertText(mouseX, mouseY, textElement) {
        const textWidth = ctx.measureText(textElement.text).width;
        const textHeight = parseInt(textElement.fontSize);
        return (
            mouseX > textElement.x - textWidth / 2 &&
            mouseX < textElement.x + textWidth / 2 &&
            mouseY > textElement.y - textHeight &&
            mouseY < textElement.y
        );
    }

    // Draw initial blank canvas
    drawInsertCanvas();
});
