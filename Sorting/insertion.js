var beep = new Audio('beep.mp3');
var mouseclick = new Audio('Mouseclick.mp3');
var done = new Audio('wrong.mp3');

const InsertionSortButton = document.querySelector(".InsertionSort");
InsertionSortButton.addEventListener('click', async function () {
    mouseclick.play();
    selectText.innerHTML = `Insertion Sort..`;
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
        await InsertionSort();
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

async function InsertionSort() {
    shouldReset = false;
    const elements = document.querySelectorAll('.bar');
    elements[0].style.background = 'cyan';
    
    for (let i = 1; i < elements.length; i++) {
        if (shouldReset) {
            resetBarColors(elements);
            return;
        }
        
        let j = i - 1;
        const keyHeight = elements[i].style.height;
        const keyValue = elements[i].textContent;
        elements[i].style.background = 'rgb(250, 5, 54)';
        
        await waitforme(delay);
        if (shouldReset) {
            resetBarColors(elements);
            return;
        }

        while (j >= 0 && parseInt(elements[j].textContent) > parseInt(keyValue)) {
            incrementComparison();
            
            elements[j].style.background = 'rgb(9, 102, 2)';
            elements[j + 1].style.height = elements[j].style.height;
            elements[j + 1].textContent = elements[j].textContent;
            
            j--;
            
            beep.play();
            await waitforme(delay);
            if (shouldReset) {
                resetBarColors(elements);
                return;
            }

            for (let k = i; k >= 0; k--) {
                elements[k].style.background = 'rgb(3, 252, 11)';
            }
        }
        
        incrementComparison(); // Count the final comparison that exits the loop
        
        if (!shouldReset) {
            elements[j + 1].style.height = keyHeight;
            elements[j + 1].textContent = keyValue;
            elements[i].style.background = 'rgb(3, 252, 11)';
            incrementSwap();
        }
    }
    
    if (!shouldReset) {
        elements.forEach(el => el.style.background = 'rgb(0,255,0)');
    }
}

function resetBarColors(elements) {
    elements.forEach(el => {
        el.style.background = '';
    });
}