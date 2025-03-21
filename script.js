document.addEventListener("DOMContentLoaded", function () {
    console.log("JavaScript Loaded!");
  
    const clearButton = document.querySelector(".button-x");
    const form = document.getElementById("order-form");
  
    if (!clearButton) {
      console.error("Error: Clear button (.button-x) not found.");
      return;
    }
    if (!form) {
      console.error("Error: Form not found.");
      return;
    }
  
    clearButton.addEventListener("click", function (event) {
      event.preventDefault();
      form.reset();
      console.log("Form cleared!");
    });
  
    // Block non-numeric input on all number fields
    document.querySelectorAll('input[type="number"]').forEach(function (input) {
      input.addEventListener("keypress", function (event) {
        if (!/[0-9]/.test(event.key)) {
          event.preventDefault();
        }
      });
  
      input.addEventListener("paste", function (event) {
        const pastedData = event.clipboardData.getData("text");
        if (!/^\d+$/.test(pastedData)) {
          event.preventDefault();
        }
      });
    });
  
    // Form submit logic
    form.addEventListener("submit", async function (e) {
      e.preventDefault();
  
      const formData = {
        client: form.client?.value,
        material: form.Material?.value,
        thickness_name: form.Thickness_name?.value,
        thickness_micron: form.Thickness_micron?.value,
        width: form.width?.value,
        height: form.Height?.value,
        fold: form.Fold?.value,
        color: form.Color?.value,
        handle: form.Handle?.value,
        surface: form.Surface?.value,
        print: form.Print?.value,
        double_sided: form["Two-sided"]?.value,
        color_count: form["Color-count"]?.value,
        comment: form.comment?.value
      };
  
      const res = await fetch("https://bitterpit.org/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData)
      });
  
      if (res.ok) {
        alert("Your order has been sent!");
        form.reset();
      } else {
        alert("Failed to send the order. Please try again.");
      }
    });
    // All required input, select, and textarea fields
const requiredFields = form.querySelectorAll("input[required], textarea[required]");

requiredFields.forEach(field => {
  // Clear custom message when typing
  field.addEventListener("input", () => {
    field.setCustomValidity("");
  });

  // Set message if left empty
  field.addEventListener("invalid", (e) => {
    field.setCustomValidity("Այս դաշտը լրացնելը պարտադիր է 😊");
  });
});

  }

);
  
