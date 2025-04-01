var done = new Audio('wrong.mp3');

const SelectionSortButton = document.querySelector(".SelectionSort");
SelectionSortButton.addEventListener('click', async function() {
    if (isSorting) return;
    
    mouseclick.play();
    isSorting = true;
    disableButtons();
    resetStats();
    
    selectText.innerHTML = `Selection Sort Running...`;
    const description = document.querySelector('#description');
    description.style.display = 'flex';
    document.querySelector('#fullbody').style.height = '184vh';
    
    await descriptionText_selection();
    await SelectionSort();
    
    if (!stopSorting) {
        isSorting = false;
        enableButtons();
        selectText.innerHTML = `Sorting Complete!`;
    }
});

async function descriptionText_selection() {
    const section = document.querySelector('#fullbody');
    section.style.height = `184vh`;

    const description = document.querySelector('#description');
    description.style.display = 'flex';

    const code = document.querySelector('#code_java');
    code.innerHTML = `// Java program for implementation of Selection Sort
import java.io.*;
public class SelectionSort {
    void sort(int arr[]) {
        int n = arr.length;
        for (int i = 0; i < n-1; i++) {
            int min_idx = i;
            for (int j = i+1; j < n; j++)
                if (arr[j] < arr[min_idx])
                    min_idx = j;
            int temp = arr[min_idx];
            arr[min_idx] = arr[i];
            arr[i] = temp;
        }
    }

    void printArray(int arr[]) {
        int n = arr.length;
        for (int i=0; i<n; ++i)
            System.out.print(arr[i]+" ");
        System.out.println();
    }

    public static void main(String args[]) {
        SelectionSort ob = new SelectionSort();
        int arr[] = {64,25,12,22,11};
        ob.sort(arr);
        System.out.println("Sorted array");
        ob.printArray(arr);
    }
}`;

    const time = document.querySelector('#time');
    time.innerHTML = `<b>Time Complexity:</b> O(N²) - Two nested loops`;
    
    const space = document.querySelector('#space');
    space.innerHTML = `<b>Space Complexity:</b> O(1) - In-place sorting`;
}

async function SelectionSort() {
    currentSort = SelectionSort;
    stopSorting = false;
    isPaused = false;
    
    const elements = document.querySelectorAll('.bar');
    
    // Get current speed setting (1-10)
    const speedValue = parseInt(document.getElementById("speed_slider").value);
    
    // Calculate delay based on speed (1=slowest, 10=fastest)
    // Using exponential scale for better visual difference
    const currentDelay = 1000 / Math.pow(2, speedValue/2); // 1: ~700ms, 10: ~30ms
    
    for (let i = 0; i < elements.length - 1; i++) {
        if (stopSorting) return;
        while (isPaused) await waitforme(100);
        
        let minIndex = i;
        elements[i].style.background = '#ff0000'; // Red for current element
        
        for (let j = i + 1; j < elements.length; j++) {
            compareCount++;
            updateStats();
            
            if (stopSorting) return;
            while (isPaused) await waitforme(100);
            
            elements[j].style.background = '#ffff00'; // Yellow for comparison
            await waitforme(currentDelay/2);
            
            if (parseInt(elements[j].style.height) < parseInt(elements[minIndex].style.height)) {
                if (minIndex !== i) {
                    elements[minIndex].style.background = '#00ffff'; // Cyan for previous min
                }
                minIndex = j;
                elements[minIndex].style.background = '#ffa500'; // Orange for new min
            } else {
                elements[j].style.background = '#00ffff'; // Cyan for non-min elements
            }
            
            await waitforme(currentDelay/2);
        }
        
        if (minIndex !== i) {
            swapCount++;
            updateStats();
            
            // Swap heights and text
            [elements[i].style.height, elements[minIndex].style.height] = 
            [elements[minIndex].style.height, elements[i].style.height];
            
            [elements[i].textContent, elements[minIndex].textContent] = 
            [elements[minIndex].textContent, elements[i].textContent];
            
            beep.play();
            await waitforme(currentDelay);
        }
        
        elements[minIndex].style.background = '#00ffff'; // Cyan after swap
        elements[i].style.background = '#00ff00'; // Green for sorted
    }
    
    elements[elements.length - 1].style.background = '#00ff00'; // Last element
    done.play();
    currentSort = null;
}

// Helper function for swapping (if needed elsewhere)
function swapping(el1, el2) {
    const tempHeight = el1.style.height;
    const tempText = el1.textContent;
    
    el1.style.height = el2.style.height;
    el1.textContent = el2.textContent;
    
    el2.style.height = tempHeight;
    el2.textContent = tempText;
}