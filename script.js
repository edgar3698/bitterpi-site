document.addEventListener("DOMContentLoaded", function () {
  console.log("JavaScript Loaded!");

  const clearButton = document.querySelector(".button-x");
  const form = document.getElementById("order-form");

  if (!clearButton || !form) return;

  // Helper: Highlight field with CSS animation
  function highlightField(field) {
    if (!field) return;
    field.classList.add("highlight-change");
    field.addEventListener(
      "animationend",
      function () {
        field.classList.remove("highlight-change");
      },
      { once: true }
    );
  }

  clearButton.addEventListener("click", function (event) {
    event.preventDefault();
    form.reset();
    console.log("Form cleared!");
  });

  // Prevent non-digit entry in number inputs
  document.querySelectorAll('input[type="number"]').forEach(function (input) {
    input.addEventListener("keypress", function (event) {
      if (!/[0-9]/.test(event.key)) event.preventDefault();
    });
    input.addEventListener("paste", function (event) {
      const pastedData = event.clipboardData.getData("text");
      if (!/^\d+$/.test(pastedData)) event.preventDefault();
    });
  });

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
      comment: form.comment?.value,
    };

    const res = await fetch("https://bitterpit.org/api/contact", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    });

    if (res.ok) {
      alert("🎉Պատվերը հաջողությամբ ուղարկվել է։");
      form.reset();
    } else {
      alert("💀Մի բան այն չէ։");
    }
  });

  // Custom validity messages
  const requiredFields = form.querySelectorAll("input[required], textarea[required]");
  requiredFields.forEach((field) => {
    field.addEventListener("input", () => field.setCustomValidity(""));
    field.addEventListener("invalid", () =>
      field.setCustomValidity("Այս դաշտը լրացնելը պարտադիր է 😊")
    );
  });

  // Disable logic for Two-sided and Color-count when Print is "Ոչ"
  const printRadios = form.querySelectorAll('input[name="Print"]');
  const twoSidedRadios = form.querySelectorAll('input[name="Two-sided"]');
  let colorCount = form.querySelectorAll('input[name="Color-count"]');

  // Container holding the Color-count radio buttons
  const colorCountContainer = form.querySelector(".radiodiv-4");

  function updatePrintRelatedFields() {
    const selectedPrint = form.querySelector('input[name="Print"]:checked');
    if (selectedPrint && selectedPrint.value === "Ոչ") {
      twoSidedRadios.forEach((input) => {
        input.disabled = true;
        input.checked = false;
        input.closest("label")?.style.setProperty("opacity", "0.5");
      });
      colorCount.forEach((input) => {
        input.disabled = true;
        input.checked = false;
        input.closest("label")?.style.setProperty("opacity", "0.5");
      });
    } else {
      // Enable fields when Print is "Այո"
      twoSidedRadios.forEach((input) => {
        input.disabled = false;
        input.closest("label")?.style.setProperty("opacity", "1");
      });
      colorCount.forEach((input) => {
        input.disabled = false;
        input.closest("label")?.style.setProperty("opacity", "1");
      });
    }
  }

  // New logic for when Print is "Այո"
  function updatePrintYesLogic() {
    const selectedPrint = form.querySelector('input[name="Print"]:checked');
    if (!selectedPrint || selectedPrint.value !== "Այո") return;

    // --- Width check ---
    const widthInput = form.querySelector('input[name="width"]');
    if (widthInput) {
      let widthVal = Number(widthInput.value);
      if (widthVal > 60) {
        widthInput.value = 60; // force width to maximum allowed value
        highlightField(widthInput);
      }
    }

    // --- Height rounding ---
    const heightInput = form.querySelector('input[name="Height"]');
    if (heightInput) {
      const allowedHeights = [25, 30, 35, 40, 45, 50, 55, 60, 70, 90];
      let heightVal = Number(heightInput.value);
      if (!isNaN(heightVal)) {
        let nearest = allowedHeights.reduce((prev, curr) => {
          return Math.abs(curr - heightVal) < Math.abs(prev - heightVal) ? curr : prev;
        }, allowedHeights[0]);
        if (nearest !== heightVal) {
          heightInput.value = nearest;
          highlightField(heightInput);
        }

        // --- Color-count restriction when height equals 90 ---
        if (nearest === 90) {
          colorCount.forEach((input) => {
            if (input.value.includes("3 Գույն") || input.value.includes("4 Գույն")) {
              if (!input.disabled) {
                input.disabled = true;
                input.checked = false;
                const label = input.closest("label");
                if (label) {
                  label.style.setProperty("opacity", "0.5");
                  highlightField(label);
                }
              }
            } else {
              if (input.disabled) {
                input.disabled = false;
                const label = input.closest("label");
                if (label) {
                  label.style.setProperty("opacity", "1");
                  highlightField(label);
                }
              }
            }
          });
        } else {
          // For any other height, ensure all color-count options are enabled
          colorCount.forEach((input) => {
            if (input.disabled) {
              input.disabled = false;
              const label = input.closest("label");
              if (label) {
                label.style.setProperty("opacity", "1");
                highlightField(label);
              }
            }
          });
        }
      }
    }
  }

  function updatePrintFields() {
    updatePrintRelatedFields();
    const selectedPrint = form.querySelector('input[name="Print"]:checked');
    if (selectedPrint && selectedPrint.value === "Այո") {
      updatePrintYesLogic();
    }
  }

  // Combined update for Color-count options based on Two-sided and Material
  function updateColorCountOptionsBasedOnTwoSided() {
    const twoSidedValue = form.querySelector('input[name="Two-sided"]:checked')?.value;
    const materialValue = form.querySelector('input[name="Material"]:checked')?.value;
    let options = [];

    // If Two-sided is "Այո", force Print to be "Այո"
    if (twoSidedValue === "Այո") {
      const printYesRadio = form.querySelector('input[name="Print"][value="Այո"]');
      if (printYesRadio) {
        printYesRadio.checked = true;
        updatePrintFields();
      }
    }

    if (twoSidedValue === "Այո") {
      if (materialValue === "PP") {
        // When Material is PP and Two-sided is "Այո"
        options = [
          { label: "1 | 1", value: "1 | 1" },
          { label: "1 | 2", value: "1 | 2" },
          { label: "1 | 3", value: "1 | 3" },
          
        ];
        colorCountContainer.style.gridTemplateColumns = "repeat(5, auto)";
      } else {
        // When Two-sided is "Այո" but Material is not PP
        options = [
          
          { label: "1 | 1", value: "1 | 1" },
          { label: "1 | 2", value: "1 | 2" },
          { label: "2 | 2", value: "2 | 2" },
          { label: "1 | 3", value: "1 | 3" },
        ];
        colorCountContainer.style.gridTemplateColumns = "repeat(5, auto)";
      }
    } else {
      // Default options when Two-sided is not "Այո"
      options = [
        { label: "1", value: "1 Գույն" },
        { label: "2", value: "2 Գույն" },
        { label: "3", value: "3 Գույն" },
        { label: "4", value: "4 Գույն" },
      ];
      colorCountContainer.style.gridTemplateColumns = "repeat(4, auto)";
    }

    // Clear and rebuild the Color-count radio buttons
    colorCountContainer.innerHTML = "";
    options.forEach((opt) => {
      const label = document.createElement("label");
      label.className = "radiolabel";
      const input = document.createElement("input");
      input.type = "radio";
      input.name = "Color-count";
      input.value = opt.value;
      label.appendChild(input);
      label.append(" " + opt.label);
      colorCountContainer.appendChild(label);
    });
    colorCount = form.querySelectorAll('input[name="Color-count"]');
  }

  // Event listeners
  printRadios.forEach((radio) => {
    radio.addEventListener("change", updatePrintFields);
  });
  twoSidedRadios.forEach((radio) => {
    radio.addEventListener("change", updateColorCountOptionsBasedOnTwoSided);
  });
  const materialRadios = form.querySelectorAll('input[name="Material"]');
  materialRadios.forEach((radio) => {
    radio.addEventListener("change", updateColorCountOptionsBasedOnTwoSided);
  });

  // Additional listeners for width and height inputs when Print is "Այո"
  const widthInput = form.querySelector('input[name="width"]');
  const heightInput = form.querySelector('input[name="Height"]');
  if (widthInput) {
    widthInput.addEventListener("change", function () {
      const selectedPrint = form.querySelector('input[name="Print"]:checked');
      if (selectedPrint && selectedPrint.value === "Այո") {
        updatePrintYesLogic();
      }
    });
  }
  if (heightInput) {
    heightInput.addEventListener("blur", function () {
      const selectedPrint = form.querySelector('input[name="Print"]:checked');
      if (selectedPrint && selectedPrint.value === "Այո") {
        updatePrintYesLogic();
      }
    });
  }

  // Run once on page load
  updatePrintFields();
  updateColorCountOptionsBasedOnTwoSided();
});
