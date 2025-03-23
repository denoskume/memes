<script>
    function loadIncludes() {
        // Load the header
        fetch("header.html")
            .then(response => response.text())
            .then(data => {
                document.body.insertAdjacentHTML("afterbegin", data);
            });

        // Load the footer
        fetch("footer.html")
            .then(response => response.text())
            .then(data => {
                document.body.insertAdjacentHTML("beforeend", data);
            });
    }

    loadIncludes();
</script>
