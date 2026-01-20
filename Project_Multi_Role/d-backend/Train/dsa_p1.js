const data = [1,2,4,5,3,0,3,2,2,5,5,3,89];

let newValue = data[0];
for (i=0;i<data.length;i++){
    if(newValue > data[i]){
        newValue = data[i];
    }
    
}

console.log(newValue);