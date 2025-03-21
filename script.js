document.addEventListener("DOMContentLoaded", function () {
    console.log("JavaScript Loaded!"); // Debugging message

    const clearButton = document.querySelector(".button-x");
    const form = document.querySelector("form"); // Selects the form

    if (!clearButton) {
        console.error("Error: Clear button (.button-x) not found.");
        return;
    }
    if (!form) {
        console.error("Error: Form not found.");
        return;
    }

    clearButton.addEventListener("click", function (event) {
        event.preventDefault(); // Prevents default behavior
        form.reset(); // Clears all inputs
        console.log("Form cleared!"); // Confirms action in console
    });
});


document.addEventListener("DOMContentLoaded", function () {
    document.querySelectorAll('input[type="number"]').forEach(function (input) {
        input.addEventListener("keypress", function (event) {
            if (!/[0-9]/.test(event.key)) {
                event.preventDefault(); // Block non-numeric input
            }
        });

        input.addEventListener("paste", function (event) {
            const pastedData = event.clipboardData.getData("text");
            if (!/^\d+$/.test(pastedData)) {
                event.preventDefault(); // Block non-numeric paste
            }
        });
    });
});






