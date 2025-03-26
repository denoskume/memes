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


// Insert Script

const canvas = document.getElementById("insertMemeCanvas");
const ctx = canvas.getContext("2d");
let img = null;

// Array to store text elements
const textElements = [];
let activeText = null;

// Upload image
document.getElementById("insertUploadImage").addEventListener("change", function (event) {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = function (e) {
        img = new Image();
        img.src = e.target.result;
        img.onload = function () {
            drawInsertCanvas();
        };
    };
    reader.readAsDataURL(file);
});

// Add a new text element
function addInsertTextElement() {
    const newTextInput = document.getElementById("insertNewText");
    const newText = newTextInput.value || "New Text";
    const fontSize = document.getElementById("insertFontSize").value;
    const textColor = document.getElementById("insertTextColor").value;

    const newTextElement = {
        text: newText,
        x: canvas.width / 2,
        y: canvas.height / 2,
        fontSize: fontSize,
        color: textColor,
        isDragging: false,
    };

    textElements.push(newTextElement);
    newTextInput.value = ""; // Clear the text input field after adding
    drawInsertCanvas();
}

// Draw everything on the canvas
function drawInsertCanvas() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    if (img) {
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
    }

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

// Handle mouse down for drag-and-drop
canvas.addEventListener("mousedown", (e) => {
    const mouseX = e.offsetX;
    const mouseY = e.offsetY;

    activeText = textElements.find((el) => isMouseOverInsertText(mouseX, mouseY, el));
    if (activeText) {
        activeText.isDragging = true;
    }
});

// Handle mouse move for dragging text
canvas.addEventListener("mousemove", (e) => {
    if (activeText && activeText.isDragging) {
        activeText.x = e.offsetX;
        activeText.y = e.offsetY;
        drawInsertCanvas();
    }
});

// Handle mouse up to stop dragging
canvas.addEventListener("mouseup", () => {
    if (activeText) {
        activeText.isDragging = false;
        activeText = null;
    }
});

// Handle double-click to remove text
canvas.addEventListener("dblclick", (e) => {
    const mouseX = e.offsetX;
    const mouseY = e.offsetY;

    const textIndex = textElements.findIndex((el) => isMouseOverInsertText(mouseX, mouseY, el));
    if (textIndex !== -1) {
        textElements.splice(textIndex, 1); // Remove the text element from the array
        drawInsertCanvas();
    }
});

// Check if mouse is over text
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

// Download meme
function downloadInsertMeme() {
    const link = document.createElement("a");
    link.download = "meme.png";
    link.href = canvas.toDataURL();
    link.click();
}

// Initialize canvas with default state
drawInsertCanvas();
