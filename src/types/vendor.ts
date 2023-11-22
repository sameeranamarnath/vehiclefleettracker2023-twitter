import {TweetFormatted} from "./twitter"
export interface Vendor{
    name:string,
    image: string,
    description:string,
    twitterId:string, //ref id is twitterid
    tweets: TweetFormatted[],
    createdtimestamp: number,
    updatedtimestamp:number 
   
   }