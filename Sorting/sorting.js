// Global variables
const output = document.querySelector('#size_value');
const bars = document.querySelector("#mainbody");
const arraySize = document.querySelector('#size_slider');
const selectText = document.querySelector('.selected')
output.innerHTML = arraySize.value

let arrayVal = 15; // Default size
let delay = 100; // Default speed (medium)
let isPaused = false;
let resumePromise = null;

// Array size control
arraySize.addEventListener('input', function() {
    selectText.innerHTML = `Size Changed`;
    output.innerHTML = this.value;
    arrayVal = this.value;
    createNewArray(arrayVal);
});

// Speed control
let delayElement = document.querySelector('#speed_slider');
const speedOutput = document.querySelector('#speed_value')
speedOutput.innerHTML = delayElement.value

delayElement.addEventListener('input', function() {
    selectText.innerHTML = `Speed Changed`;
    speedOutput.innerHTML = this.value;
    
    const speedValues = [
        1000, 800, 600, 400, 200, 
        100, 50, 20, 10, 5
    ];
    
    delay = speedValues[this.value - 1];
});

// Array creation
let array = [];
createNewArray(arrayVal);

function createNewArray(arrayVal) {
    deleteChild();
    array = [];
    
    for (let i = 0; i < arrayVal; i++) {
        let temp = Math.floor(Math.random() * (370 - 20) + 20);
        array.push(temp);
    }
    
    let sortedTemp = [...array].sort((a,b) => a-b);
    
    for (let i = 0; i < arrayVal; i++) {
        const bar = document.createElement("div");
        bar.style.height = `${array[i]}px`;
        bar.className = 'bar';
        
        const position = sortedTemp.indexOf(array[i]);
        const proportionalNumber = Math.floor((position + 1) * (100 / arrayVal));
        
        bar.innerHTML = `${proportionalNumber}`;
        bar.style.width = `${(96 / arrayVal)}vw`;
        bars.appendChild(bar);
    }
}

function deleteChild() {
    while (bars.firstChild) {
        bars.removeChild(bars.firstChild)
    }
}

// New array button
const newArray = document.querySelector("#generate");
newArray.addEventListener("click", function() {
    enableSortingBtn();
    enableSizeSlider();
    selectText.innerHTML = `New Array Generated`;
    createNewArray(arrayVal);
});

// Pause functionality
function togglePause() {
    isPaused = !isPaused;
    const pauseBtn = document.getElementById('pauseBtn');
    
    if (isPaused) {
        pauseBtn.textContent = 'Resume';
        pauseBtn.classList.add('paused');
    } else {
        pauseBtn.textContent = 'Pause';
        pauseBtn.classList.remove('paused');
        if (resumePromise) {
            resumePromise();
            resumePromise = null;
        }
    }
}

async function checkPaused() {
    if (isPaused) {
        return new Promise(resolve => {
            resumePromise = resolve;
        });
    }
    return Promise.resolve();
}

// Button controls
function disableSortingBtn() {
    document.querySelector(".BubbleSort").disabled = true;
    document.querySelector(".InsertionSort").disabled = true;
    document.querySelector(".MergeSort").disabled = true;
    document.querySelector(".QuickSort").disabled = true;
    document.querySelector(".SelectionSort").disabled = true;
    document.getElementById("pauseBtn").disabled = false;
}

function enableSortingBtn() {
    document.querySelector(".BubbleSort").disabled = false;
    document.querySelector(".InsertionSort").disabled = false;
    document.querySelector(".MergeSort").disabled = false;
    document.querySelector(".QuickSort").disabled = false;
    document.querySelector(".SelectionSort").disabled = false;
    document.getElementById("pauseBtn").disabled = true;
    document.getElementById("pauseBtn").textContent = "Pause";
    document.getElementById("pauseBtn").classList.remove("paused");
    isPaused = false;
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

function waitforme(milisec) {
    return new Promise(resolve => {
        setTimeout(() => { resolve('') }, milisec);
    })
}

function swapping(element1, element2) {
    let temp = element1.style.height;
    element1.style.height = element2.style.height;
    element2.style.height = temp;
    
    // Also swap the numbers
    temp = element1.innerHTML;
    element1.innerHTML = element2.innerHTML;
    element2.innerHTML = temp;
}

// Initialize pause button
document.getElementById('pauseBtn').addEventListener('click', togglePause);
document.getElementById('pauseBtn').disabled = true;