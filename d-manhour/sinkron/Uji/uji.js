
const s = [15, 4, 8, 11, 2, 10, 19];


// Fungsi urut manual (bubble sort)
function bubbleSort(arr, ascending = true) {
  const result = [...arr];
  const n = result.length;

  for (let i = 0; i < n - 1; i++) {
    
    
    for (let j = 0; j < n - i - 1; j++) {
        
      if (
        (ascending && result[j] > result[j + 1]) ||
        (!ascending && result[j] < result[j + 1])
      ) {
        // Tukar posisi elemen
        [result[j], result[j + 1]] = [result[j + 1], result[j]];
      }
    }


  }

  return result;
}


console.log('Ascending:', bubbleSort(s, true));
console.log('Descending:', bubbleSort(s, false));
