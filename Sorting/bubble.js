var beep = new Audio('beep.mp3');
var mouseclick = new Audio('Mouseclick.mp3');
var done = new Audio('wrong.mp3');

const BubbleSortButton = document.querySelector(".BubbleSort");
BubbleSortButton.addEventListener('click', async function () {
    mouseclick.play();
    selectText.innerHTML = `Bubble Sort..`;
    
    // Update info panel
    document.getElementById('code_java').innerHTML = 
`void bubbleSort(int arr[]) {
    int n = arr.length;
    for (int i = 0; i < n-1; i++)
        for (int j = 0; j < n-i-1; j++)
            if (arr[j] > arr[j+1]) {
                // swap
                int temp = arr[j];
                arr[j] = arr[j+1];
                arr[j+1] = temp;
            }
}`;
    document.getElementById('time').innerHTML = "O(n²) - Worst and Average Case\nO(n) - Best Case (when already sorted)";
    document.getElementById('space').innerHTML = "O(1) - In-place sorting";
    
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
    const barContainers = document.querySelectorAll('.bar-container');
    
    for (let i = 0; i < barContainers.length - 1; i++) {
        if (shouldReset) {
            resetBarColors();
            removeComparisonIndicators();
            return;
        }
        
        for (let j = 0; j < barContainers.length - i - 1; j++) {
            if (shouldReset) {
                resetBarColors();
                removeComparisonIndicators();
                return;
            }
            
            const bar1 = barContainers[j].querySelector('.bar');
            const bar2 = barContainers[j + 1].querySelector('.bar');
            
            // Show comparison indicators
            createComparisonIndicator(j, j + 1);
            
            bar1.style.background = 'rgb(250, 5, 54)';
            bar2.style.background = 'rgb(250, 5, 54)';
            
            incrementComparison();
            
            if (parseInt(bar1.style.height) > parseInt(bar2.style.height)) {
                await waitforme(delay);
                if (shouldReset) {
                    resetBarColors();
                    removeComparisonIndicators();
                    return;
                }
                swapping(j, j + 1);
                beep.play();
            }
            
            bar1.style.background = 'rgb(245, 212, 24)';
            bar2.style.background = 'rgb(245, 212, 24)';
            
            // Remove indicators after comparison is done
            removeComparisonIndicators();
        }
        
        if (!shouldReset) {
            barContainers[barContainers.length - 1 - i].querySelector('.bar').style.background = 'rgb(0,255,0)';
        }
    }
    
    if (!shouldReset) {
        barContainers[0].querySelector('.bar').style.background = 'rgb(0,255,0)';
    }
}

function resetBarColors() {
    const bars = document.querySelectorAll('.bar');
    bars.forEach(el => {
        el.style.background = '';
    });
}
