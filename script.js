document.addEventListener("DOMContentLoaded", function () {
  console.log("JavaScript Loaded!");

  const clearButton = document.querySelector(".button-x");
  const form = document.getElementById("order-form");

  if (!clearButton || !form) return;

  clearButton.addEventListener("click", function (event) {
    event.preventDefault();
    form.reset();
    console.log("Form cleared!");
  });

  // Block non-numeric input
  document.querySelectorAll('input[type="number"]').forEach(function (input) {
    input.addEventListener("keypress", function (event) {
      if (!/[0-9]/.test(event.key)) event.preventDefault();
    });

    input.addEventListener("paste", function (event) {
      const pastedData = event.clipboardData.getData("text");
      if (!/^\d+$/.test(pastedData)) event.preventDefault();
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
      alert("🎉Պատվերը հաջողությամբ ուղարկվել է։");
      form.reset();
    } else {
      alert("💀Մի բան այն չէ։");
    }
  });

  // Armenian validation message
  const requiredFields = form.querySelectorAll("input[required], textarea[required]");
  requiredFields.forEach(field => {
    field.addEventListener("input", () => field.setCustomValidity(""));
    field.addEventListener("invalid", () => field.setCustomValidity("Այս դաշտը լրացնելը պարտադիր է 😊"));
  });

  // Disable "Two-sided" and "Color-count" if "Print" = "Ոչ"
  const printRadios = form.querySelectorAll('input[name="Print"]');
  const twoSidedRadios = form.querySelectorAll('input[name="Two-sided"]');
  const colorCountRadios = form.querySelectorAll('input[name="Color-count"]');

  printRadios.forEach((radio) => {
    radio.addEventListener("change", () => {
      const disable = radio.value === "Ոչ" && radio.checked;

      twoSidedRadios.forEach(input => {
        input.disabled = disable;
        input.closest("label")?.style?.setProperty("opacity", disable ? "0.5" : "1");
      });

      colorCountRadios.forEach(input => {
        input.disabled = disable;
        input.closest("label")?.style?.setProperty("opacity", disable ? "0.5" : "1");
      });
    });
  });
});
