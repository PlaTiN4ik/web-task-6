/*jslint browser */

function getPrices() {
    "use strict";
    return {
        prodOptions: {
            optPaper: 0,
            optHardcover: 250,
            optElectronic: -100
        },
        prodProperties: {
            propCertificate: 500,
            propPractice: 700
        },
        prodTypes: [450, 900, 2500]
    };
}

function updatePrice() {
    "use strict";
    let prices = getPrices();
    let radios = document.getElementsByName("serviceType");
    let selectedType = "1";
    let optionsWrapper = document.getElementById("options-wrapper");
    let propertyWrapper = document.getElementById("property-wrapper");
    let optionSelect = document.getElementById("calc-option");
    let checkboxes = document.querySelectorAll("#property-wrapper input[type=checkbox]");
    let quantityInput = document.getElementById("calc-quantity");
    let resultBox = document.getElementById("calc-result");
    let rawQuantity = quantityInput.value.trim();
    let validPattern = /^[1-9]\d*$/;
    let unitPrice = 0;
    let total = 0;

    radios.forEach(function (radio) {
        if (radio.checked) {
            selectedType = radio.value;
        }
    });

    if (selectedType === "1") {
        optionsWrapper.classList.add("d-none");
        propertyWrapper.classList.add("d-none");
    } else if (selectedType === "2") {
        optionsWrapper.classList.remove("d-none");
        propertyWrapper.classList.add("d-none");
    } else if (selectedType === "3") {
        optionsWrapper.classList.add("d-none");
        propertyWrapper.classList.remove("d-none");
    }

    if (!validPattern.test(rawQuantity)) {
        resultBox.innerHTML = (
            "<div class=\"alert alert-danger mb-0\">"
            + "Пожалуйста, введите корректное количество (целое положительное число)."
            + "</div>"
        );
        return;
    }

    unitPrice = prices.prodTypes[parseInt(selectedType, 10) - 1] || 0;

    if (selectedType === "2" && optionSelect) {
        if (prices.prodOptions[optionSelect.value] !== undefined) {
            unitPrice += prices.prodOptions[optionSelect.value];
        }
    }

    if (selectedType === "3") {
        checkboxes.forEach(function (checkbox) {
            if (checkbox.checked && prices.prodProperties[checkbox.name] !== undefined) {
                unitPrice += prices.prodProperties[checkbox.name];
            }
        });
    }

    total = unitPrice * parseInt(rawQuantity, 10);
    resultBox.innerHTML = (
        "<div class=\"alert alert-success mb-0 font-weight-bold\">"
        + "Итоговая стоимость услуги: " + total + " руб. "
        + "<span class=\"font-weight-normal text-muted\">("
        + rawQuantity + " шт. × " + unitPrice + " руб.)</span>"
        + "</div>"
    );
}

window.addEventListener("DOMContentLoaded", function () {
    "use strict";
    let quantityInput = document.getElementById("calc-quantity");
    let radios = document.getElementsByName("serviceType");
    let optionSelect = document.getElementById("calc-option");
    let checkboxes = document.querySelectorAll("#property-wrapper input[type=checkbox]");
    let calcForm = document.getElementById("calc-form");

    if (calcForm) {
        calcForm.addEventListener("submit", function (event) {
            event.preventDefault();
        });
    }

    if (quantityInput) {
        quantityInput.addEventListener("input", function () {
            updatePrice();
        });
        quantityInput.addEventListener("change", function () {
            updatePrice();
        });
    }

    radios.forEach(function (radio) {
        radio.addEventListener("change", function () {
            updatePrice();
        });
    });

    if (optionSelect) {
        optionSelect.addEventListener("change", function () {
            updatePrice();
        });
    }

    checkboxes.forEach(function (checkbox) {
        checkbox.addEventListener("change", function () {
            updatePrice();
        });
    });

    updatePrice();
});
