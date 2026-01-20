const { delay } = require('./lib_time');
const data ="App Run!";



async function main() {
  while (true) {
    console.log(data);
    await delay(1000);
  }
}



main();