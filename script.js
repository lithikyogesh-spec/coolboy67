// Target the screen input element directly using its unique ID
const display = document.getElementById('display');

// Adds whatever number or operator button was pressed onto the screen string
function appendValue(input) {
    display.value += input;
}

// Clears everything out of the text string input field entirely
function clearDisplay() {
    display.value = "";
}

// Evaluates the math text string on the screen and changes it into an integer answer
function calculateResult() {
    try {
        // eval handles math string evaluation automatically (e.g. "2+5*3" becomes 17)
        display.value = eval(display.value);
    } catch (error) {
        // If the user inputs broken syntax like "5++3", catch the crash error and print Error
        display.value = "Error";
    }
}
