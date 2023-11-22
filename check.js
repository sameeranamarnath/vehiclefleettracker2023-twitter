/*var request = require('request');
var options = {
  'method': 'GET',
  'url': 'https://api.twitter.com/2/tweets/search/stream/rules',
  'headers': {
    'Authorization': 'Bearer AAAAAAAAAAAAAAAAAAAAAP2tqQEAAAAAhu0w8WZ4SxFHEN%2BITgdjlc5miRE%3DqjbJ0quHqYf6SaBwWmhGW5YHbpHUzH7uPcgHvI8xHFR62DrGib',
  }
};
request(options, function (error, response) {
  if (error) throw new Error(error);
  console.log(response.body);
});
*/

process.env.UV_THREADPOOL_SIZE=1;

const https=require('https');
const crypto= require('crypto');
const  fs  = require('fs');

const express= require('express');

const app =express();
const {Worker} = require('worker_threads');

const start= Date.now();

function doRequest()
{
  https.request("https:/www.google.com",res=>{

    res.on("data",()=>{});

    res.on("end",()=>{console.log("doRequest ended after:",(Date.now()-start) + "ms")});

  }).end();
}

function doHash()
{
  
  crypto.pbkdf2("a","b",100000,512,"sha512",()=>{
    console.log("doHash ended after:",(Date.now()-start) + "ms");
  });

}

fs.readFile("./check.js", "utf8", (err, data) => {
  if (err) {
    console.error(err);
    return;
  }

  console.log("fs readfile ended after:",(Date.now()-start) + "ms");

});

doRequest();
doHash();
doHash();
doHash();
doHash();


app.get('/spanWorkerForFactorialCalculation',(req,res)=>{

  var data= req.query.factorialNumber;
  const worker = new Worker('./worker.js');


    worker.on("message",function(msg){
      console.log("message from worker:",msg);

      res.json(msg);
    });
    worker.on("error",function(err){
      console.log("error from worker:",err);
      
    });
    worker.on("exit",function(code){
      console.log("worker exited with code:",code);
    });


    worker.on("online",function(){
      console.log("worker is online");

      worker.postMessage({factorialNumber:data});
    });

    worker.on("messageerror",function(err){
      console.log("message error from worker:",err);
    });



})


app.listen("3000");
