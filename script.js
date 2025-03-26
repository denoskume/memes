document.addEventListener("DOMContentLoaded", () => {
    const canvas = document.getElementById("insertMemeCanvas");
    const ctx = canvas.getContext("2d");
    let img = null;

    const textElements = [];
    let activeText = null;

    // Add event listener for image upload
    const uploadImageInput = document.getElementById("insertUploadImage");
    if (uploadImageInput) {
        uploadImageInput.addEventListener("change", uploadImage);
    }

    // Add text element
    const addTextButton = document.querySelector(".insert-button.add-text");
    if (addTextButton) {
        addTextButton.addEventListener("click", addInsertTextElement);
    }

    // Download meme
    const downloadButton = document.querySelector(".insert-button.download");
    if (downloadButton) {
        downloadButton.addEventListener("click", downloadInsertMeme);
    }

    function uploadImage(event) {
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
    }

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
        newTextInput.value = "";
        drawInsertCanvas();
    }

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
            const userText = prompt("Enter text:", textElements[textIndex].text || "");
            if (userText !== null) {
                textElements[textIndex].text = userText;
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

    function downloadInsertMeme() {
        const link = document.createElement("a");
        link.download = "meme.png";
        link.href = canvas.toDataURL();
        link.click();
    }

    drawInsertCanvas();
});
