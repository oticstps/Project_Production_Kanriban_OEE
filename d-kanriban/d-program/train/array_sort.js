

// sortir terkecil
const data = [6,5,89,54,2,3,4,5,4];
let minVal = data[0];

for(i = 0;i < data.length;i++){
    if( data[i] < minVal){
        minVal = data[i];
    }
    
}

console.log(minVal);