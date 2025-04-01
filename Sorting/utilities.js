// Shared variables
let delay = 300;
let isSorting = false;
let isPaused = false;
let stopSorting = false;
let currentSort = null;
let swapCount = 0;
let compareCount = 0;

// Audio elements
const beep = new Audio('beep3.mp3');
const mouseclick = new Audio('Mouseclick.mp3');
const done = new Audio('wrong.mp3');

// Initialize array size and speed display
document.getElementById("size_value").textContent = document.getElementById("size_slider").value;
document.getElementById("speed_value").textContent = document.getElementById("speed_slider").value;

// Event listeners for sliders
document.getElementById("size_slider").addEventListener('input', function() {
    document.getElementById("size_value").textContent = this.value;
    generateNewArray();
});

document.getElementById("speed_slider").addEventListener('input', function() {
    const speedValue = parseInt(this.value);
    document.getElementById("speed_value").textContent = speedValue;
    
    // Linear speed calculation (1 = slowest, 10 = fastest)
    delay = 1050 - (speedValue * 100); // 1:950ms, 10:50ms
});

// Generate array button
document.getElementById("generate").addEventListener('click', function() {
    if (isSorting) return;
    mouseclick.play();
    generateNewArray();
});

// Pause/Resume button
document.getElementById("pause").addEventListener("click", function() {
    if (currentSort) {
        isPaused = !isPaused;
        this.textContent = isPaused ? "Resume" : "Pause";
        if (!isPaused && currentSort) {
            currentSort();
        }
    }
});

// Stop button
document.getElementById("stop").addEventListener("click", function() {
    stopSorting = true;
    isPaused = false;
    document.getElementById("pause").textContent = "Pause";
    enableButtons();
});

// Helper functions
function waitforme(ms) {
    return new Promise(resolve => {
        let interval = setInterval(() => {
            if (stopSorting) {
                clearInterval(interval);
                resolve('stopped');
            }
            if (!isPaused) {
                clearInterval(interval);
                resolve('');
            }
        }, 10);
        setTimeout(() => {
            clearInterval(interval);
            resolve('');
        }, ms);
    });
}

function disableButtons() {
    document.querySelectorAll(".BubbleSort, .SelectionSort, .InsertionSort, #generate, #size_slider, #speed_slider, .array-input, .array-submit").forEach(btn => {
        btn.disabled = true;
    });
    document.getElementById("pause").disabled = false;
    document.getElementById("stop").disabled = false;
}

function enableButtons() {
    document.querySelectorAll(".BubbleSort, .SelectionSort, .InsertionSort, #generate, #size_slider, #speed_slider, .array-input, .array-submit").forEach(btn => {
        btn.disabled = false;
    });
    document.getElementById("pause").disabled = true;
    document.getElementById("stop").disabled = true;
    isSorting = false;
    isPaused = false;
    stopSorting = false;
    currentSort = null;
}

function updateStats() {
    document.getElementById("swap-count").textContent = swapCount;
    document.getElementById("compare-count").textContent = compareCount;
}

function resetStats() {
    swapCount = 0;
    compareCount = 0;
    updateStats();
}

function generateNewArray() {
    stopSorting = true;
    isPaused = false;
    resetStats();
    const arraySize = document.getElementById("size_slider").value;
    const mainBody = document.getElementById("mainbody");
    let array = [];
    mainBody.innerHTML = "";

    const barWidth = Math.max(40, Math.min(60, (window.innerWidth * 0.8) / arraySize));

    for (let i = 0; i < arraySize; i++) {
        array.push(Math.floor(Math.random() * 100) + 5);
        
        const bar = document.createElement("div");
        bar.className = "bar";
        bar.style.height = `${array[i]}px`;
        bar.style.width = `${barWidth}px`;
        bar.style.lineHeight = `${array[i]}px`;
        bar.textContent = array[i];
        
        mainBody.appendChild(bar);
    }
    return array;
}

// Generate initial array
generateNewArray();