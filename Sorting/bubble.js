var beep = new Audio('beep.mp3');
var mouseclick = new Audio('Mouseclick.mp3');
var done = new Audio('wrong.mp3');

const BubbleSortButton = document.querySelector(".BubbleSort");
BubbleSortButton.addEventListener('click', async function () {
    mouseclick.play();
    selectText.innerHTML = `Bubble Sort..`;
    const description = document.querySelector('#description');
    description.style.display = 'flex';
    const section = document.querySelector('#fullbody');
    section.style.height = '184vh';
    
    disableSortingBtn();
    disableSizeSlider();
    disableNewArrayBtn();
    resetCounters();
    startTimer();
    
    try {
        await BubbleSort();
        if (!shouldReset) {
            done.play();
            selectText.innerHTML = `Sorting Complete!`;
            stopTimer();
        }
    } catch (e) {
        console.log("Sorting was interrupted");
    }
    
    enableSortingBtn();
    enableSizeSlider();
    enableNewArrayBtn();
});

async function BubbleSort() {
    shouldReset = false;
    const element = document.querySelectorAll('.bar');
    
    for (let i = 0; i < element.length - 1; i++) {
        if (shouldReset) {
            resetBarColors(element);
            return;
        }
        
        for (let j = 0; j < element.length - i - 1; j++) {
            if (shouldReset) {
                resetBarColors(element);
                return;
            }
            
            element[j].style.background = 'rgb(250, 5, 54)';
            element[j + 1].style.background = 'rgb(250, 5, 54)';
            
            incrementComparison();
            
            if (parseInt(element[j].style.height) > parseInt(element[j + 1].style.height)) {
                await waitforme(delay);
                if (shouldReset) {
                    resetBarColors(element);
                    return;
                }
                swapping(element[j], element[j + 1]);
                beep.play();
            }
            
            element[j].style.background = 'rgb(245, 212, 24)';
            element[j + 1].style.background = 'rgb(245, 212, 24)';
        }
        
        if (!shouldReset) {
            element[element.length - 1 - i].style.background = 'rgb(0,255,0)';
        }
    }
    
    if (!shouldReset) {
        element[0].style.background = 'rgb(0,255,0)';
    }
}

function resetBarColors(elements) {
    elements.forEach(el => {
        el.style.background = '';
    });
}