document.querySelector(".InsertionSort").addEventListener('click', async function() {
    if (isSorting) return;
    
    mouseclick.play();
    isSorting = true;
    disableButtons();
    resetStats();
    
    document.querySelector(".selected").innerHTML = `Insertion Sort Running...`;
    const description = document.querySelector('#description');
    description.style.display = 'flex';
    document.querySelector('#fullbody').style.height = '184vh';
    
    await InsertionSort();
    
    if (!stopSorting) {
        isSorting = false;
        enableButtons();
        document.querySelector(".selected").innerHTML = `Sorting Complete!`;
    }
});

async function InsertionSort() {
    currentSort = InsertionSort;
    stopSorting = false;
    isPaused = false;
    
    const elements = document.querySelectorAll('.bar');
    const currentDelay = delay;
    
    elements[0].style.background = '#00ffff';
    
    for (let i = 1; i < elements.length; i++) {
        if (stopSorting) return;
        while (isPaused) await waitforme(100);

        const currentHeight = elements[i].style.height;
        const currentText = elements[i].textContent;
        let j = i - 1;
        
        elements[i].style.background = '#ff0000';
        await waitforme(currentDelay);

        while (j >= 0 && parseInt(elements[j].style.height) > parseInt(currentHeight)) {
            compareCount++;
            updateStats();
            
            if (stopSorting) return;
            while (isPaused) await waitforme(100);

            swapCount++;
            updateStats();
            
            elements[j].style.background = '#ffff00';
            elements[j + 1].style.height = elements[j].style.height;
            elements[j + 1].textContent = elements[j].textContent;
            j--;
            
            beep.play();
            await waitforme(currentDelay);
            
            if (j >= 0) elements[j].style.background = '#00ffff';
        }

        elements[j + 1].style.height = currentHeight;
        elements[j + 1].textContent = currentText;
        elements[i].style.background = '#00ff00';
    }
    
    elements.forEach(el => el.style.background = '#00ff00');
    done.play();
    currentSort = null;
}