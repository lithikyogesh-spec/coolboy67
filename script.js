let currentInput = "";
let isDegMode = true;
let lastAnswer = "0";

const exprDisplay = document.getElementById("expression-display");
const resDisplay = document.getElementById("result-display");
const angleIndicator = document.getElementById("angle-indicator");
const historyItems = document.getElementById("history-items");

// Theme Switcher Engine
document.getElementById("theme-toggle").addEventListener("click", () => {
    const currentTheme = document.documentElement.getAttribute("data-theme");
    const targetTheme = currentTheme === "dark" ? "light" : "dark";
    document.documentElement.setAttribute("data-theme", targetTheme);
});

// Degree/Radian System Switcher
document.getElementById("mode-toggle").addEventListener("click", (e) => {
    isDegMode = !isDegMode;
    e.target.innerText = isDegMode ? "DEG" : "RAD";
    angleIndicator.innerText = isDegMode ? "Degrees" : "Radians";
});

function input(value) {
    currentInput += value;
    updateDisplay();
}

function inputFunc(funcName) {
    currentInput += funcName;
    updateDisplay();
}

function useAns() {
    currentInput += lastAnswer;
    updateDisplay();
}

function clearAll() {
    currentInput = "";
    resDisplay.innerText = "0";
    updateDisplay();
}

function backspace() {
    currentInput = currentInput.slice(0, -1);
    updateDisplay();
}

function updateDisplay() {
    let displayStr = currentInput
        .replace(/\*/g, "×")
        .replace(/\//g, "÷")
        .replace(/sqrt/g, "√")
        .replace(/asin/g, "sin⁻¹")
        .replace(/acos/g, "cos⁻¹")
        .replace(/atan/g, "tan⁻¹");
    exprDisplay.innerText = displayStr;
}

function fact(n) {
    if (n < 0) return NaN;
    if (n === 0 || n === 1) return 1;
    let result = 1;
    for (let i = 2; i <= n; i++) result *= i;
    return result;
}

// Math String Parser Rules Engine
function calculate() {
    if (!currentInput) return;
    
    let parseExpression = currentInput;

    parseExpression = parseExpression.replace(/π/g, "Math.PI").replace(/e/g, "Math.E");
    parseExpression = parseExpression.replace(/\^2/g, "**2");
    parseExpression = parseExpression.replace(/\^/g, "**");
    parseExpression = parseExpression.replace(/sqrt\(/g, "Math.sqrt(");
    parseExpression = parseExpression.replace(/log\(/g, "Math.log10(");
    parseExpression = parseExpression.replace(/ln\(/g, "Math.log(");

    const degToRadFactor = isDegMode ? "(Math.PI / 180)" : "1";
    const radToDegFactor = isDegMode ? "(180 / Math.PI)" : "1";

    parseExpression = parseExpression.replace(/sin\(/g, `Math.sin(${degToRadFactor} * `);
    parseExpression = parseExpression.replace(/cos\(/g, `Math.cos(${degToRadFactor} * `);
    parseExpression = parseExpression.replace(/tan\(/g, `Math.tan(${degToRadFactor} * `);

    parseExpression = parseExpression.replace(/asin\(/g, `(${radToDegFactor} * Math.asin(`);
    parseExpression = parseExpression.replace(/acos\(/g, `(${radToDegFactor} * Math.acos(`);
    parseExpression = parseExpression.replace(/atan\(/g, `(${radToDegFactor} * Math.atan(`);

    try {
        let finalResult = eval(parseExpression);
        
        if (typeof finalResult === 'number' && !isNaN(finalResult)) {
            if (finalResult % 1 !== 0) {
                finalResult = parseFloat(finalResult.toFixed(10));
            }
        } else {
            throw new Error("Invalid Output");
        }

        resDisplay.innerText = finalResult;
        addToHistory(exprDisplay.innerText, finalResult);
        lastAnswer = finalResult.toString();
        currentInput = finalResult.toString(); 
    } catch (error) {
        resDisplay.innerText = "Error";
    }
}

function addToHistory(expr, res) {
    const item = document.createElement("div");
    item.className = "history-item";
    item.innerHTML = `
        <div class="history-expr">${expr}</div>
        <div class="history-res">${res}</div>
    `;
    item.onclick = () => {
        currentInput = res.toString();
        updateDisplay();
        resDisplay.innerText = res;
    };
    historyItems.prepend(item);
}

function clearHistory() {
    historyItems.innerHTML = "";
}

// Physical Keyboard Listener Mapping 
document.addEventListener("keydown", (e) => {
    if (e.key >= "0" && e.key <= "9") input(e.key);
    if (e.key === ".") input(".");
    if (e.key === "+") input("+");
    if (e.key === "-") input("-");
    if (e.key === "*") input("*");
    if (e.key === "/") input("/");
    if (e.key === "%") input("%");
    if (e.key === "(") input("(");
    if (e.key === ")") input(")");
    if (e.key === "Enter" || e.key === "=") calculate();
    if (e.key === "Backspace") backspace();
    if (e.key === "Escape") clearAll();
});
