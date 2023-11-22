
const {parentPort} = require('worker_threads');


const  calculateFactorial= (n)=>
{

    if(n == 0)
    {
        return 1;   
    }
    else
    {
        return n * calculateFactorial(n - 1);
    }

}

parentPort.on('message', (msg) => {


    console.log("message from server",msg);



    //    let number= theData.factorialNumber;

    parentPort.postMessage({result: calculateFactorial(msg.factorialNumber)});





});