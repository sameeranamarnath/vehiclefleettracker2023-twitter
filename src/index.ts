import { describeDynamoDBTable,getAllScanResults,scanDynamoDBTable, updateDynamoDBTweet,sqsSendMessage } from "./aws"
import dotenv from "dotenv";
import { Vendor } from "./types/vendor";
dotenv.config();
import { Scraper } from "@the-convocation/twitter-scraper";
import express from "express";
import { Rule, TweetFormatted } from "./types/twitter";
import healthcheck from './healtcheck';
import { getAllRules } from "./twitter";
import { HttpsProxyAgent } from "https-proxy-agent";
import { getTweets } from "./twitter";
import { TwitterOpenApi } from "twitter-openapi-typescript";

export interface ScraperTestOptions {
    /**
     * Force the scraper to use username/password to authenticate instead of cookies. Only used
     * by this file for testing auth, but very unreliable. Should always use cookies to resume
     * session when possible.
     */
    authMethod: 'password' | 'cookies' | 'anonymous';
  }
export async function getScraper(
  ) {
    
  
    const scraper = new Scraper({
      transform: {
        request: (input, init) => {
          return [input, init];
        },
      },
    });
  
  
    return scraper;
  }


const init= async ()=> {

console.log("init");
 //   let res=await describeDynamoDBTable("vendors")
 //console.log(res);
 //const scanIterator = await scanDynamoDBTable("vendors",5);
 //const items = await scanIterator.next();
 //console.log(items);
//console.log(vendors);

 const data:TweetFormatted= {

     id:"tweet1",
     userId:"DcTacoTruck",
     userName:"DC Taco Truck",
     text:"Test tweet",
     date:"02/08/23",
     geo:{
         id:"geo1",
         name:"Geo location1",
         place_type:"place 1",
         full_name:"place 1",
         country:"USA",
         country_code:"USA",
         coordinates:{
             
            lat:34.01283,
            long:41.1818

         }

     }
}

 
//let result= await updateDynamoDBTweet(process.env.AWS_VENDORS_TABLE_NAME??" ",data,"dcslices");
//console.log(result);

let messageData={
    queueUrl:"https://sqs.us-east-1.amazonaws.com/387899812183/testqueue1",
    message:"sampleMessage"
}
//await sqsSendMessage(messageData.queueUrl ,messageData.message);


const vendors = await getAllScanResults<Vendor>("vendors");
const vendorList = vendors.map(vendor=>vendor.twitterId);
const rules: Rule[] =  [{


     value:`has:geo (from:${vendorList.join(" OR from: ")})`,
     tag: 'vendors-geo'

}];


/*
const rules2=await getAllRules();

console.log(rules2);



let scraper =await  getScraper();
let tweet= await scraper.getTweet("1727217534771106039");
console.log(tweet?.text);
const tweets = scraper.getTweets('devcheckeract', 1);
console.log( (await tweets.next()).value);

for await (const tweet of scraper.getTweetsByUserId('devcheckeract', 10)) {
    if (tweet) {
      console.log(tweet.text);
    }
    console.log("no tweets");
  }
*/


/*
const api = new TwitterOpenApi();
const client = await api.getGuestClient();
const response = await client.getUserApi().getUserByScreenName({ screenName: 'elonmusk' });
*/
const app = express();
app.use('/', healthcheck);
app.listen(process.env.PORT, () => console.log(`Healthcheck listening on port ${process.env.PORT}`))


//t.getTweets();
}



init(); 



function setRules() {
    throw new Error("Function not implemented.");
}
//