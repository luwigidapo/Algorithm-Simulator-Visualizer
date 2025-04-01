document.querySelector(".BubbleSort").addEventListener('click', async function() {
    if (isSorting) return;
    
    mouseclick.play();
    isSorting = true;
    disableButtons();
    resetStats();
    
    document.querySelector(".selected").innerHTML = `Bubble Sort Running...`;
    const description = document.querySelector('#description');
    description.style.display = 'flex';
    document.querySelector('#fullbody').style.height = '184vh';
    
    await bubbleSort();
    
    if (!stopSorting) {
        isSorting = false;
        enableButtons();
        document.querySelector(".selected").innerHTML = `Sorting Complete!`;
    }
});

async function bubbleSort() {
    currentSort = bubbleSort;
    stopSorting = false;
    isPaused = false;
    
    const bars = document.querySelectorAll('.bar');
    const speedValue = parseInt(document.getElementById("speed_slider").value);
    const currentDelay = 1050 - (speedValue * 100); // Consistent with utilities.js
    
    for (let i = 0; i < bars.length - 1; i++) {
        for (let j = 0; j < bars.length - i - 1; j++) {
            compareCount++;
            updateStats();
            
            if (stopSorting) return;
            while (isPaused) await waitforme(100);
            
            bars[j].style.background = '#ff0000';
            bars[j + 1].style.background = '#ff0000';
            await waitforme(currentDelay/2);

            if (parseInt(bars[j].style.height) > parseInt(bars[j + 1].style.height)) {
                swapCount++;
                updateStats();
                
                [bars[j].style.height, bars[j + 1].style.height] = 
                [bars[j + 1].style.height, bars[j].style.height];
                
                [bars[j].textContent, bars[j + 1].textContent] = 
                [bars[j + 1].textContent, bars[j].textContent];
                
                beep.play();
                await waitforme(currentDelay/2);
            }

            bars[j].style.background = '#008000';
            bars[j + 1].style.background = '#008000';
        }
        bars[bars.length-1-i].style.background = '#00ff00';
    }
    bars.forEach(bar => bar.style.background = '#00ff00');
    done.play();
    currentSort = null;
}