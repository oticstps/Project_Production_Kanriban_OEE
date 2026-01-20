const dataSource = [77,5,5,6,6,5,5,5,9,5,5,2,88,985,6,2,313,2,2];

let lengthDataSource = dataSource.length;

for (i = 0; i < lengthDataSource - 1; i++){
    swapped = false;
    for(j = 0; j < lengthDataSource - i - 1; j++){
        if (dataSource[j] > dataSource[j + 1]){

            let temp = dataSource[j];

            dataSource[j] = dataSource[j+1];
            dataSource[j+1] =temp;

            swapped = true;
        }
    }
    if(!swapped){
        break;
    }
}


console.log(dataSource);