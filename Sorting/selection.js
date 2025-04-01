var beep = new Audio('beep3.mp3');
var mouseclick = new Audio('Mouseclick.mp3');
var done = new Audio('wrong.mp3');

const SelectionSortButton = document.querySelector(".SelectionSort");
SelectionSortButton.addEventListener('click', async function () {
    mouseclick.play();
    selectText.innerHTML = `Selection Sort..`;
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
        await SelectionSort();
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

async function SelectionSort() {
    shouldReset = false;
    const elements = document.querySelectorAll(".bar");
    
    for (let i = 0; i < elements.length; i++) {
        if (shouldReset) {
            resetBarColors(elements);
            return;
        }
        
        let smallest_element_index = i;
        elements[i].style.background = 'rgb(250, 5, 54)';
        
        for (let j = i + 1; j < elements.length; j++) {
            if (shouldReset) {
                resetBarColors(elements);
                return;
            }
            
            elements[j].style.background = 'rgb(245, 212, 24)';
            await waitforme(delay);
            
            incrementComparison();
            
            if (parseInt(elements[j].textContent) < parseInt(elements[smallest_element_index].textContent)) {
                if (smallest_element_index !== i) {
                    elements[smallest_element_index].style.background = 'cyan';
                }
                smallest_element_index = j;
            }
            else {
                elements[j].style.background = 'cyan';
            }
        }
        
        if (!shouldReset) {
            if (smallest_element_index !== i) {
                beep.play();
                await waitforme(delay);
                swapping(elements[smallest_element_index], elements[i]);
                incrementSwap();
            }
            elements[smallest_element_index].style.background = 'cyan';
            elements[i].style.background = 'rgb(0,255,0)';
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