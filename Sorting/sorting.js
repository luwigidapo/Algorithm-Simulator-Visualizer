const output = document.querySelector('#size_value');
const bars = document.querySelector("#mainbody"); // This is correct
const arraySize = document.querySelector('#size_slider');
const selectText = document.querySelector('.selected');
output.innerHTML = arraySize.value;

// Counter variables
let comparisonCount = 0;
let swapCount = 0;
let sortStartTime = 0;
let timerInterval = null;
let isPaused = false;
let shouldReset = false;
let sortingActive = false;
let resolvePause = null;

var arrayVal = 64;
arraySize.addEventListener('input', function () {
    selectText.innerHTML = `Size Changed`;
    output.innerHTML = this.value;
    arrayVal = this.value;
    createNewArray(arrayVal);
});

let delay = 512; // Initial delay (2^9)

let delayElement = document.querySelector('#speed_slider');
const speedOutput = document.querySelector('#speed_value');
speedOutput.innerHTML = delayElement.value;

delayElement.addEventListener('input', function () {
    selectText.innerHTML = `Speed Changed`;
    speedOutput.innerHTML = this.value;
    delay = Math.pow(2, 10 - this.value);
});

let array = [];

// Initialize with default array
createNewArray(64);

// Counter functions
function resetCounters() {
    comparisonCount = 0;
    swapCount = 0;
    document.getElementById('comparison-count').textContent = '0';
    document.getElementById('swap-count').textContent = '0';
    document.getElementById('time-count').textContent = '0s';
    if (timerInterval) {
        clearInterval(timerInterval);
        timerInterval = null;
    }
}

function startTimer() {
    sortStartTime = Date.now();
    timerInterval = setInterval(() => {
        const elapsed = (Date.now() - sortStartTime) / 1000;
        document.getElementById('time-count').textContent = `${elapsed.toFixed(1)}s`;
    }, 100);
}

function stopTimer() {
    if (timerInterval) {
        clearInterval(timerInterval);
        timerInterval = null;
    }
}

function incrementComparison() {
    comparisonCount++;
    document.getElementById('comparison-count').textContent = comparisonCount;
}

function incrementSwap() {
    swapCount++;
    document.getElementById('swap-count').textContent = swapCount;
}

function createNewArray(arrayVal, customArray = null) {
    resetCounters();
    deleteChild();
    array = [];
    
    const maxHeight = 400;
    const minHeight = 20;
    const maxNumber = 1000;
    
    if (customArray && customArray.length > 0) {
        // Use custom array
        const maxCustomValue = Math.max(...customArray);
        const minCustomValue = Math.min(...customArray);
        
        for (let i = 0; i < customArray.length; i++) {
            const height = minHeight + ((customArray[i] - minCustomValue) / (maxCustomValue - minCustomValue)) * (maxHeight - minHeight);
            array.push({ height, number: customArray[i] });
        }
    } else {
        // Create proportional values
        for (let i = 0; i < arrayVal; i++) {
            const ratio = i / (arrayVal - 1);
            const height = Math.floor(ratio * (maxHeight - minHeight) + minHeight);
            const number = Math.floor(ratio * maxNumber);
            array.push({ height, number });
        }
        
        // Shuffle but keep height/number pairs together
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
    }

    for (let i = 0; i < array.length; i++) {
        const barContainer = document.createElement("div");
        barContainer.className = 'bar-container';
        barContainer.style.width = `${(96 / array.length)}vw`;
        
        const bar = document.createElement("div");
        bar.style.height = `${array[i].height}px`;
        bar.className = 'bar';
        bar.innerHTML = `<div class="bar-number">${array[i].number}</div>`;
        bar.style.fontSize = `${Math.min(20, 120/array.length)}px`;
        
        barContainer.appendChild(bar);
        bars.appendChild(barContainer);
    }
}

function deleteChild() {
    while (bars.firstChild) {
        bars.removeChild(bars.firstChild);
    }
}

const newArray = document.querySelector("#generate");
newArray.addEventListener("click", function () {
    var mouseclick = new Audio('Mouseclick.mp3');
    mouseclick.play();
    enableSortingBtn();
    enableSizeSlider();
    selectText.innerHTML = `New Array Generated`;
    createNewArray(arrayVal);
});

// Button state functions
function disableSortingBtn() {
    document.querySelector(".BubbleSort").disabled = true;
    document.querySelector(".InsertionSort").disabled = true;
    document.querySelector(".MergeSort").disabled = true;
    document.querySelector(".QuickSort").disabled = true;
    document.querySelector(".SelectionSort").disabled = true;
}

function enableSortingBtn() {
    document.querySelector(".BubbleSort").disabled = false;
    document.querySelector(".InsertionSort").disabled = false;
    document.querySelector(".MergeSort").disabled = false;
    document.querySelector(".QuickSort").disabled = false;
    document.querySelector(".SelectionSort").disabled = false;
}

function disableSizeSlider() {
    document.querySelector("#size_slider").disabled = true;
}

function enableSizeSlider() {
    document.querySelector("#size_slider").disabled = false;
}

function disableNewArrayBtn() {
    document.querySelector("#generate").disabled = true;
}

function enableNewArrayBtn() {
    document.querySelector("#generate").disabled = false;
}

function createComparisonIndicator(index1, index2) {
    const barContainers = document.querySelectorAll('.bar-container');
    const element1 = barContainers[index1].querySelector('.bar');
    const element2 = barContainers[index2].querySelector('.bar');
    
    // Remove any existing indicators
    removeComparisonIndicators();
    
    // Create left arrow indicator
    const leftArrow = document.createElement('div');
    leftArrow.className = 'comparison-arrow';
    leftArrow.innerHTML = '⬅';
    leftArrow.style.left = '50%';
    leftArrow.style.transform = 'translateX(-50%)';
    
    // Create right arrow indicator
    const rightArrow = document.createElement('div');
    rightArrow.className = 'comparison-arrow';
    rightArrow.innerHTML = '➡';
    rightArrow.style.left = '50%';
    rightArrow.style.transform = 'translateX(-50%)';
    
    // Add indicators to bars
    element1.appendChild(leftArrow);
    element2.appendChild(rightArrow);
}

function removeComparisonIndicators() {
    const existingArrows = document.querySelectorAll('.comparison-arrow');
    existingArrows.forEach(arrow => arrow.remove());
}

async function waitforme(milisec) {
    if (shouldReset) {
        shouldReset = false;
        throw new Error('Reset requested');
    }
    
    sortingActive = true;
    let startTime = Date.now();
    let elapsed = 0;
    
    while (elapsed < milisec) {
        if (shouldReset) {
            sortingActive = false;
            throw new Error('Reset requested');
        }
        
        if (isPaused) {
            await new Promise(resolve => {
                resolvePause = resolve;
            });
        }
        
        elapsed = Date.now() - startTime;
        await new Promise(resolve => setTimeout(resolve, 10));
    }
    
    sortingActive = false;
    return '';
}

function swapping(index1, index2) {
    const barContainers = document.querySelectorAll('.bar-container');
    const element1 = barContainers[index1].querySelector('.bar');
    const element2 = barContainers[index2].querySelector('.bar');
    
    // Swap heights
    const tempHeight = element1.style.height;
    element1.style.height = element2.style.height;
    element2.style.height = tempHeight;
    
    // Swap numbers
    const tempText = element1.querySelector('.bar-number').textContent;
    element1.querySelector('.bar-number').textContent = element2.querySelector('.bar-number').textContent;
    element2.querySelector('.bar-number').textContent = tempText;
    
    incrementSwap();
}

function togglePause() {
    isPaused = !isPaused;
    const pauseBtn = document.getElementById('pause-btn');
    
    if (isPaused) {
        pauseBtn.textContent = "Resume";
        pauseBtn.style.backgroundColor = "#2ecc71";
    } else {
        pauseBtn.textContent = "Pause";
        pauseBtn.style.backgroundColor = "#f39c12";
        if (resolvePause) {
            resolvePause();
            resolvePause = null;
        }
    }
}

function resetSorting() {
    shouldReset = true;
    isPaused = false;
    
    const pauseBtn = document.getElementById('pause-btn');
    pauseBtn.textContent = "Pause";
    pauseBtn.style.backgroundColor = "#f39c12";
    
    if (resolvePause) {
        resolvePause();
        resolvePause = null;
    }
    
    createNewArray(arrayVal);
    enableSortingBtn();
    enableSizeSlider();
    enableNewArrayBtn();
}

// Custom array implementation
document.getElementById('custom-array-btn').addEventListener('click', function() {
    const input = document.getElementById('custom-array-input').value;
    const numbers = input.split(',').map(num => parseInt(num.trim())).filter(num => !isNaN(num));
    
    if (numbers.length > 30) {
        alert('Maximum array size is 30. Only the first 30 numbers will be used.');
        numbers.length = 30;
    }
    
    if (numbers.length > 0) {
        createNewArray(numbers.length, numbers);
        selectText.innerHTML = `Custom Array Loaded`;
        enableSortingBtn();
        enableSizeSlider();
    } else {
        alert('Please enter valid numbers separated by commas.');
    }
});

document.getElementById('pause-btn').addEventListener('click', togglePause);
document.getElementById('reset-btn').addEventListener('click', resetSorting);
