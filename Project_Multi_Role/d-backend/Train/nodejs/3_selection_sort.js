const { delay } = require('./lib/timer');
const data = [8,2,3,6,5,4,7,1];




async function main() {
    for (i = 0; i < data.length; i++){
        await delay(1000);
        console.log(data[i]);
        





    }
}








main();