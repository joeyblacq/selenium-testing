"use strict";
////////////////////////////////////////////////////////////////
// VARIABLES
////////////////////////////////////////////////////////////////

// Set the DOM elements variables for divisions of steps 1 to 4
const DIV_STEP_1 = document.getElementById("step-1");
const DIV_STEP_2 = document.getElementById("step-2");
const DIV_STEP_3 = document.getElementById("step-3");
const DIV_STEP_4 = document.getElementById("step-4");

// Set the DOM element variable for building type dropdown of step 1
const SELECT_BUILDING_TYPE = document.getElementById("select-building-type");

// Set the DOM element variable for the group of divisions of step 2 inputs
const DIV_NUMBER_OF_APARTMENT = document.getElementById("div-number-of-apartments");
const DIV_MAXIMUM_OCCUPANCY = document.getElementById("div-maximum-occupancy");
const DIV_NUMBER_OF_FLOORS = document.getElementById("div-number-of-floors");
const DIV_NUMBER_OF_ELEVATORS = document.getElementById("div-number-of-elevators");
const DIV_AMOUNT_ELEVATORS_NEEDED = document.getElementById("div-amount-elevators-needed");

// Set the DOM element variable for inputs of step 2
const INPUT_NUMBER_OF_APARTMENT = DIV_NUMBER_OF_APARTMENT.querySelector('input');
const INPUT_NUMBER_OF_FLOORS = DIV_NUMBER_OF_FLOORS.querySelector('input');
const INPUT_MAXIMUM_OCCUPANCY = DIV_MAXIMUM_OCCUPANCY.querySelector('input');
const INPUT_NUMBER_OF_ELEVATORS = DIV_NUMBER_OF_ELEVATORS.querySelector('input');
const INPUT_AMOUNT_ELEVATORS_NEEDED = DIV_AMOUNT_ELEVATORS_NEEDED.querySelector('input');

// Set the DOM element variable for group of radio buttons of step 3
const RADIO_BUTTONS_PRODUCT_LINE = document.getElementById('radio-buttons-product-line')

// Set the DOM element variable for radio buttons of step 3
const RADIO_BUTTON_STANDARD = document.getElementById("radio-button-standard");
const RADIO_BUTTON_PREMIUM = document.getElementById("radio-button-premium");
const RADIO_BUTTON_EXCELIUM = document.getElementById("radio-button-excelium");

// Set the DOM element variable for read-only inputs of step 4
const INPUT_ELEVATOR_UNIT_PRICE = document.getElementById("elevator-unit-price");
const INPUT_ELEVATOR_TOTAL_PRICE = document.getElementById("elevator-total-price");
const INPUT_INSTALLATION_FEES = document.getElementById("installation-fees");
const INPUT_TOTAL_COST = document.getElementById("total-cost");

// Set the object variable for elevator UNIT_PRICES
const UNIT_PRICES = { 
    standard: 8000, 
    premium: 12000, 
    excelium: 15000
};

// Set the object variable for elevator INSTALLATION_PERCENT_FEES
const INSTALLATION_PERCENT_FEES = { 
    standard: 0.1, 
    premium: 0.15, 
    excelium: 0.2
};

////////////////////////////////////////////////////////////////
// FUNCTIONS
////////////////////////////////////////////////////////////////

// Function to hides steps 2 to 4 of the quote form
function hideSteps() {
    DIV_STEP_2.style.display = 'none';
    DIV_STEP_3.style.display = 'none';
    DIV_STEP_4.style.display = 'none';
}

// Function to shows steps 2 to 4 of the quote form
function showSteps() {
    DIV_STEP_2.style.display = 'block';
    DIV_STEP_3.style.display = 'block';
    DIV_STEP_4.style.display = 'block';
}

// Function to resets all values and radio buttons
function resetValues() {
    // Input values
    INPUT_NUMBER_OF_APARTMENT.value = '';
    INPUT_NUMBER_OF_FLOORS.value = '';
    INPUT_NUMBER_OF_ELEVATORS.value = '';
    INPUT_MAXIMUM_OCCUPANCY.value = '';
    INPUT_AMOUNT_ELEVATORS_NEEDED.value = '';
    INPUT_ELEVATOR_UNIT_PRICE.value = '';
    INPUT_ELEVATOR_TOTAL_PRICE.value = '';
    INPUT_INSTALLATION_FEES.value = '';
    INPUT_TOTAL_COST.value = '';
    // Radio buttons
    RADIO_BUTTON_STANDARD.checked = false;
    RADIO_BUTTON_PREMIUM.checked = false;
    RADIO_BUTTON_EXCELIUM.checked = false;
}

// Function to shows/hides fields depending on the building type
function showHideFieldOnBuildingType() {
    // Hide steps
    hideSteps();
    // Reset values
    resetValues();
    
    if (SELECT_BUILDING_TYPE.value !== '---Select---') {
        // Show steps
        showSteps();

        // Set variables depending on the building type
        const displayResidential = SELECT_BUILDING_TYPE.value === "residential";
        const displayCommercial = SELECT_BUILDING_TYPE.value === "commercial";
        const displayIndustrial = SELECT_BUILDING_TYPE.value === "industrial";

        // Display fields depending on the building type
        DIV_NUMBER_OF_APARTMENT.style.display = displayResidential ? 'block' : 'none';
        DIV_NUMBER_OF_FLOORS.style.display = displayCommercial || displayResidential ? 'block' : 'none';
        DIV_MAXIMUM_OCCUPANCY.style.display = displayCommercial ? 'block' : 'none';
        DIV_NUMBER_OF_ELEVATORS.style.display = displayIndustrial ? 'block' : 'none';
    }
}

// Functions that calculate the amount of elevators needed depending on the building type
function calculateElevatorsNeeded() {
    const selectedBuildingType = SELECT_BUILDING_TYPE.value;
    let elevatorsNeeded = '';

    // Check if the residential building type is selected and its fields are filled
    if (selectedBuildingType === "residential" && INPUT_NUMBER_OF_FLOORS.value && INPUT_NUMBER_OF_APARTMENT.value) {
        elevatorsNeeded = calculateResidentialElevators(INPUT_NUMBER_OF_FLOORS.value, INPUT_NUMBER_OF_APARTMENT.value);
    }

    // Check if the commercial building type is selected and its fields are filled
    else if (selectedBuildingType === "commercial" && INPUT_NUMBER_OF_FLOORS.value && INPUT_MAXIMUM_OCCUPANCY.value) {
        elevatorsNeeded = calculateCommercialElevators(INPUT_NUMBER_OF_FLOORS.value, INPUT_MAXIMUM_OCCUPANCY.value);
    }

    // Check if the industrial building type is selected and its field is filled
    else if (selectedBuildingType === "industrial" && INPUT_NUMBER_OF_ELEVATORS.value) {
        elevatorsNeeded = calculateIndustrialElevators(INPUT_NUMBER_OF_ELEVATORS.value);
    }

    // Set the calculated elevators needed value or empty string
    INPUT_AMOUNT_ELEVATORS_NEEDED.value = elevatorsNeeded;

    // Call function that calculates the total cost
    calculateTotalCost(elevatorsNeeded);
}

// Functions that calculate the amount of elevators needed for residential buildings
function calculateResidentialElevators(numberOfFloors, numberOfApartment) {
    // Set the varialbe of the average apartment per floor
    let AVG_APT_PER_FLOOR = Math.ceil(numberOfApartment / numberOfFloors);
    
    // Set the varialbe of the amount of elevators needed
    let ELEVATORS_NEEDED = Math.ceil(AVG_APT_PER_FLOOR / 6);

    // Set the varialbe of the amount of elevators bank
    let ELEVATORS_BANK = Math.ceil(numberOfFloors / 20);

    // Return the total amount of elevators
    return ELEVATORS_NEEDED * ELEVATORS_BANK;
}

// Functions that calculate the amount of elevators needed for commercial buildings
function calculateCommercialElevators(numberOfFloors, maximumOccupancyPerFloor) {
    // Set the varialbe of the total number of occupants
    let TOTAL_NUMBER_OCCUPANTS = Math.ceil(maximumOccupancyPerFloor * numberOfFloors)

    // Set the varialbe of the amount of elevators required per bank
    let ELEVATORS_REQUIRED_PER_BANK = Math.ceil(TOTAL_NUMBER_OCCUPANTS / 200);

    // Set the varialbe of the amount of elevators bank
    let ELEVATOR_BANKS_REQUIRED = Math.ceil(numberOfFloors / 10);

    // Set the varialbe of the total amount of elevators required per bank
    let TOTAL_ELEVATORS_REQUIRED_PER_BANK = ELEVATORS_REQUIRED_PER_BANK * ELEVATOR_BANKS_REQUIRED

    // Set the varialbe of the amount of additional elevators for freight
    let ADDITIONAL_ELEVATOR_FOR_FREIGHT_PER_BANK = Math.ceil(numberOfFloors / 10);

    // Return the total amount of elevators
    return TOTAL_ELEVATORS_REQUIRED_PER_BANK + ADDITIONAL_ELEVATOR_FOR_FREIGHT_PER_BANK
}

// Functions that return the amount of elevators needed for industrial buildings
function calculateIndustrialElevators(numberOfElevators) {
    return numberOfElevators;
}

// Function that calculates the installation fees
function calculateInstallationFees(totalPrice, installationPercentFees) {
    return Number(totalPrice) * Number(installationPercentFees);
}

// Function that calculates the total cost
function calculateTotalCost(amountElevatorsNeeded) {
    // Set empty variables to be used in this function
    let unitPrice;
    let totalElevatorPrice;
    let installationFees;
    let totalCost;

    // if statement to check if the radio buttons are not checked and set values to 0
    if (!RADIO_BUTTON_STANDARD.checked && !RADIO_BUTTON_PREMIUM.checked && !RADIO_BUTTON_EXCELIUM.checked) {
        unitPrice = 0; totalElevatorPrice = 0; installationFees = 0; totalCost = 0;
    }
    
    // if statement to check if the standard radio buttons is checked and set values
    if (RADIO_BUTTON_STANDARD.checked) {
        unitPrice = UNIT_PRICES.standard;
        totalElevatorPrice = amountElevatorsNeeded * unitPrice;
        installationFees = calculateInstallationFees(totalElevatorPrice, INSTALLATION_PERCENT_FEES.standard);
        totalCost = totalElevatorPrice + installationFees;
    }

    // if statement to check if the premium radio buttons is checked and set values
    if (RADIO_BUTTON_PREMIUM.checked) {
        unitPrice = UNIT_PRICES.premium;
        totalElevatorPrice = amountElevatorsNeeded * unitPrice;
        installationFees = calculateInstallationFees(totalElevatorPrice, INSTALLATION_PERCENT_FEES.premium);
        totalCost = totalElevatorPrice + installationFees;
    }

    // if statement to check if the excelium radio buttons is checked and set values
    if (RADIO_BUTTON_EXCELIUM.checked) {
        unitPrice = UNIT_PRICES.excelium;
        totalElevatorPrice = amountElevatorsNeeded * unitPrice;
        installationFees = calculateInstallationFees(totalElevatorPrice, INSTALLATION_PERCENT_FEES.excelium);
        totalCost = totalElevatorPrice + installationFees;
    }

    // Define function to format currency
    const formatCurrency = (amount) => new Intl.NumberFormat('en-US', {style: 'currency', currency: 'USD'}).format(amount);

    // Set read-only inputs with the calculated values using the formatCurrency function
    INPUT_ELEVATOR_UNIT_PRICE.value = formatCurrency(unitPrice);
    INPUT_ELEVATOR_TOTAL_PRICE.value = formatCurrency(totalElevatorPrice);
    INPUT_INSTALLATION_FEES.value = formatCurrency(installationFees);
    INPUT_TOTAL_COST.value = formatCurrency(totalCost);
}

////////////////////////////////////////////////////////////////
// EVENT LISTENERS
////////////////////////////////////////////////////////////////

// Set up event listeners for changes in the building type selection (dropdown) and trigger the function showHideFieldOnBuildingType when a change occurs.
SELECT_BUILDING_TYPE.addEventListener("change", showHideFieldOnBuildingType);

// Set up event listeners for input changes in step 2 fields to trigger the function calculateElevatorsNeeded.
DIV_STEP_2.addEventListener('input', calculateElevatorsNeeded)

// Set up event listeners for changes in radio button selections within the product line to trigger the function calculateElevatorsNeeded.
RADIO_BUTTONS_PRODUCT_LINE.addEventListener('change', calculateElevatorsNeeded)

////////////////////////////////////////////////////////////////
// INITIALIZATIONS
////////////////////////////////////////////////////////////////

// Call the function to hide all steps
hideSteps();

// Call the function to reset all values
resetValues();

// Set the default value of the building type
SELECT_BUILDING_TYPE.value = "---Select---";