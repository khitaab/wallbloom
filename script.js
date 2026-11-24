/* =========================================
   Wallbloom - script.js
   CSE326 Project
   ========================================= */


/* ---------- 1. COST ESTIMATOR ---------- */

// Rates in rupees per square foot
const PRIMER_RATE = 6;
const INTERIOR_LABOUR = 10;
const EXTERIOR_LABOUR = 14;

// Paintable wall area = carpet area x this number
const INTERIOR_FACTOR = 3.5;
const EXTERIOR_FACTOR = 1.8;

// Shows a number as Indian rupees, for example 133000 becomes ₹1,33,000
function formatRupees(amount) {
    return "₹" + amount.toLocaleString("en-IN");
}

// Shows "-" in all result boxes (used when the input is wrong)
function clearResult() {
    document.getElementById("wallArea").innerHTML = "-";
    document.getElementById("paintCost").innerHTML = "-";
    document.getElementById("primerCost").innerHTML = "-";
    document.getElementById("labourCost").innerHTML = "-";
    document.getElementById("totalCost").innerHTML = "-";
    document.getElementById("estimateField").value = "";
}

// Works out the cost and shows it on the page
function calculateCost() {
    let homeSize = document.getElementById("homeSize").value;
    let paintType = document.getElementById("paintType").value;
    let paintScope = document.getElementById("paintScope").value;
    let paintRate = Number(document.getElementById("paintQuality").value);

    let customBox = document.getElementById("customBox");
    let areaError = document.getElementById("areaError");
    let carpetArea;

    // Step 1: find the carpet area
    if (homeSize == "custom") {
        customBox.classList.remove("hidden");
        carpetArea = Number(document.getElementById("customArea").value);

        if (carpetArea < 100 || carpetArea > 10000) {
            areaError.innerHTML = "Please enter an area between 100 and 10,000 sq ft.";
            clearResult();
            return;
        }
        areaError.innerHTML = "";
    } else {
        customBox.classList.add("hidden");
        carpetArea = Number(homeSize);
    }

    // Step 2: find the wall area and labour rate
    let wallArea;
    let labourRate;

    if (paintType == "interior") {
        wallArea = carpetArea * INTERIOR_FACTOR;
        labourRate = INTERIOR_LABOUR;
    } else {
        wallArea = carpetArea * EXTERIOR_FACTOR;
        labourRate = EXTERIOR_LABOUR;
    }
    wallArea = Math.round(wallArea);

    // Step 3: work out each cost
    let paintCost = wallArea * paintRate;
    let labourCost = wallArea * labourRate;
    let primerCost = 0;

    if (paintScope == "fresh") {
        primerCost = wallArea * PRIMER_RATE;
    }

    let totalCost = paintCost + primerCost + labourCost;

    // Step 4: show the results
    document.getElementById("wallArea").innerHTML = wallArea.toLocaleString("en-IN") + " sq ft";
    document.getElementById("paintCost").innerHTML = formatRupees(paintCost);
    document.getElementById("labourCost").innerHTML = formatRupees(labourCost);
    document.getElementById("totalCost").innerHTML = formatRupees(totalCost);

    if (primerCost == 0) {
        document.getElementById("primerCost").innerHTML = "Not needed";
    } else {
        document.getElementById("primerCost").innerHTML = formatRupees(primerCost);
    }

    // Also put the total in the booking form
    document.getElementById("estimateField").value = formatRupees(totalCost);
}


/* ---------- 2. BOOKING FORM ---------- */

// Shows an error message under a box and gives the box a red border
function showError(inputId, errorId, message) {
    document.getElementById(errorId).innerHTML = message;

    if (message == "") {
        document.getElementById(inputId).classList.remove("input-error");
    } else {
        document.getElementById(inputId).classList.add("input-error");
    }
}

// Runs when the form is submitted
function bookInspection() {
    let name = document.getElementById("fullName").value.trim();
    let phone = document.getElementById("phone").value.trim();
    let address = document.getElementById("address").value.trim();
    let date = document.getElementById("visitDate").value;
    let slot = document.getElementById("timeSlot").value;

    let isValid = true;

    // Check the name
    if (name.length < 3) {
        showError("fullName", "nameError", "Please enter your full name.");
        isValid = false;
    } else {
        showError("fullName", "nameError", "");
    }

    // Check the phone number (must be 10 digits)
    if (phone.length != 10 || isNaN(phone)) {
        showError("phone", "phoneError", "Please enter a valid 10 digit phone number.");
        isValid = false;
    } else {
        showError("phone", "phoneError", "");
    }

    // Check the address
    if (address.length < 10) {
        showError("address", "addressError", "Please enter your complete address.");
        isValid = false;
    } else {
        showError("address", "addressError", "");
    }

    // Check the date (cannot be empty or in the past)
    let today = new Date();
    today.setHours(0, 0, 0, 0);
    let chosenDate = new Date(date + "T00:00");

    if (date == "") {
        showError("visitDate", "dateError", "Please choose a date.");
        isValid = false;
    } else if (chosenDate < today) {
        showError("visitDate", "dateError", "The date cannot be in the past.");
        isValid = false;
    } else {
        showError("visitDate", "dateError", "");
    }

    // Check the time slot
    if (slot == "") {
        showError("timeSlot", "slotError", "Please select a time slot.");
        isValid = false;
    } else {
        showError("timeSlot", "slotError", "");
    }

    // If everything is correct, show the confirmation
    if (isValid) {
        let bookingId = "WB" + Math.floor(1000 + Math.random() * 9000);

        document.getElementById("confirmId").innerHTML = bookingId;
        document.getElementById("confirmName").innerHTML = name;
        document.getElementById("confirmPhone").innerHTML = phone;
        document.getElementById("confirmDate").innerHTML = date;
        document.getElementById("confirmSlot").innerHTML = slot;
        document.getElementById("confirmEstimate").innerHTML = document.getElementById("estimateField").value;

        document.getElementById("bookingForm").classList.add("hidden");
        document.getElementById("confirmBox").classList.remove("hidden");
    }

    // Return false so the page does not reload
    return false;
}

// Shows the empty form again
function bookAgain() {
    document.getElementById("bookingForm").reset();
    document.getElementById("bookingForm").classList.remove("hidden");
    document.getElementById("confirmBox").classList.add("hidden");

    // reset() empties the estimate box too, so fill it in again
    calculateCost();
}


/* ---------- 3. RUN WHEN THE PAGE LOADS ---------- */
calculateCost();
