const output = document.querySelector('#size_value');
const bars = document.querySelector("#mainbody");
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
        const bar = document.createElement("div");
        bar.style.height = `${array[i].height}px`;
        bar.className = 'bar';
        bar.innerHTML = `${array[i].number}`;
        bar.style.width = `${(96 / array.length)}vw`;
        bar.style.fontSize = `${Math.min(16, 100/array.length)}px`;
        bars.appendChild(bar);
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
    const description = document.querySelector('#description');
    description.style.display = 'none';
    const section = document.querySelector('#fullbody');
    section.style.height = '100vh';
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
    document.querySelector('#size').disabled = true;
}

function enableSizeSlider() {
    document.querySelector("#size_slider").disabled = false;
    document.querySelector('#size').disabled = false;
}

function disableNewArrayBtn() {
    document.querySelector("#generate").disabled = true;
}

function enableNewArrayBtn() {
    document.querySelector("#generate").disabled = false;
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

function swapping(element1, element2) {
    // Swap heights
    const tempHeight = element1.style.height;
    element1.style.height = element2.style.height;
    element2.style.height = tempHeight;
    
    // Swap numbers
    const tempText = element1.textContent;
    element1.textContent = element2.textContent;
    element2.textContent = tempText;
    
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

// Dropdown menu functionality
const menu = document.querySelector('.menu');
const options = document.querySelectorAll('.menu li');
const icon = document.querySelector('.icon');
const select = document.querySelector('.select');
const selected = document.querySelector('.selected');

menu.classList.toggle('close');

select.addEventListener('click', () => {
    menu.classList.toggle('close');
    icon.classList.toggle('icon-rotate');
});

options.forEach(option => {
    option.addEventListener('click', () => {
        selected.innerText = option.innerText;
        menu.classList.toggle('close');
        icon.classList.toggle('icon-rotate');
    });
});