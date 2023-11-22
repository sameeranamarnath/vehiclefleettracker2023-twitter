"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getScraper = void 0;
const aws_1 = require("./aws");
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const twitter_scraper_1 = require("@the-convocation/twitter-scraper");
const express_1 = __importDefault(require("express"));
const healtcheck_1 = __importDefault(require("./healtcheck"));
function getScraper() {
    return __awaiter(this, void 0, void 0, function* () {
        const scraper = new twitter_scraper_1.Scraper({
            transform: {
                request: (input, init) => {
                    return [input, init];
                },
            },
        });
        return scraper;
    });
}
exports.getScraper = getScraper;
const init = () => __awaiter(void 0, void 0, void 0, function* () {
    console.log("init");
    //   let res=await describeDynamoDBTable("vendors")
    //console.log(res);
    //const scanIterator = await scanDynamoDBTable("vendors",5);
    //const items = await scanIterator.next();
    //console.log(items);
    //console.log(vendors);
    const data = {
        id: "tweet1",
        userId: "DcTacoTruck",
        userName: "DC Taco Truck",
        text: "Test tweet",
        date: "02/08/23",
        geo: {
            id: "geo1",
            name: "Geo location1",
            place_type: "place 1",
            full_name: "place 1",
            country: "USA",
            country_code: "USA",
            coordinates: {
                lat: 34.01283,
                long: 41.1818
            }
        }
    };
    //let result= await updateDynamoDBTweet(process.env.AWS_VENDORS_TABLE_NAME??" ",data,"dcslices");
    //console.log(result);
    let messageData = {
        queueUrl: "https://sqs.us-east-1.amazonaws.com/387899812183/testqueue1",
        message: "sampleMessage"
    };
    //await sqsSendMessage(messageData.queueUrl ,messageData.message);
    const vendors = yield (0, aws_1.getAllScanResults)("vendors");
    const vendorList = vendors.map(vendor => vendor.twitterId);
    const rules = [{
            value: `has:geo (from:${vendorList.join(" OR from: ")})`,
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
    const app = (0, express_1.default)();
    app.use('/', healtcheck_1.default);
    app.listen(process.env.PORT, () => console.log(`Healthcheck listening on port ${process.env.PORT}`));
    //t.getTweets();
});
init();
function setRules() {
    throw new Error("Function not implemented.");
}
//
