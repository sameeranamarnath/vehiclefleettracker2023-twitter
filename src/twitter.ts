import needle from  'needle';
import dotenv from "dotenv";
import { Rule, TweetStream } from './types/twitter';
import { sqsSendMessage, updateDynamoDBTweet } from './aws';
import { Scraper } from '@the-convocation/twitter-scraper';

dotenv.config();
const RULES_URL = 'https://api.twitter.com/2/tweets/search/stream/rules';
const STREAM_URL = 'https://api.twitter.com/2/tweets/search/stream?tweet.fields=attachments,author_id,context_annotations,conversation_id,created_at,edit_controls,edit_history_tweet_ids,entities,geo,id,in_reply_to_user_id,lang,non_public_metrics,organic_metrics,possibly_sensitive,promoted_metrics,public_metrics,referenced_tweets,reply_settings,source,text,withheld&expansions=attachments.media_keys,attachments.poll_ids,author_id,edit_history_tweet_ids,entities.mentions.username,geo.place_id,in_reply_to_user_id,referenced_tweets.id,referenced_tweets.id.author_id&media.fields=alt_text,duration_ms,height,media_key,non_public_metrics,organic_metrics,preview_image_url,promoted_metrics,public_metrics,type,url,variants,width&poll.fields=duration_minutes,end_datetime,id,options,voting_status&user.fields=created_at,description,entities,id,location,name,pinned_tweet_id,profile_image_url,protected,public_metrics,url,username,verified,withheld&place.fields=contained_within,country,country_code,full_name,geo,id,name,place_type';
const TOKEN=process.env.TWITTER_API_BEARER_TOKEN??""
const AWS_VENDORS_TABLE_NAME =process.env.AWS_VENDORS_TABLE_NAME??""
const AWS_SQS_URL = process.env.AWS_SQS_URL??""
console.log("token is:",TOKEN);
const setRules=async (rules:Rule[])=>{

    try{

        const res= await needle("post",RULES_URL,{
            "add":rules
        },{headers:{
            "content-type":"application/json",
            "authorization":`Bearer ${TOKEN}`
        }})

        if(res.statusCode !==201)
        {
            throw new Error(`setRules error response: ${res.statusCode}  ${res.statusMessage}`);
        }


    }catch(e)
    {
        if(e instanceof Error)
        {
            return e;
        }
        throw new Error("setRules unexpected error twitter api");
    }
}


export const getAllRules = async ()=>{


    try{


        const res= await needle("get",RULES_URL,{

     headers: {

        "authorization":`Bearer ${TOKEN}`
     }

        })

        if(res.statusCode !==200)
        {
            throw new Error(`getAllRules error response: ${res.statusCode} ${res.statusMessage}`);
        }


    }catch(e)
    {

        if(e instanceof Error)
        {
            throw e
        }

        throw new Error("Exception while fetching rules");
    }



};


export const deleteAllRules =async(rules:any)=> {


    
    try{


        if(!Array.isArray(rules.data))
        {

            throw new Error("invalid rules set passed in");
        }


        const ids= rules.data.map((rule:any)=>rule.id);
        const params= {
            delete: {ids}

        }

        const res= await needle("post",RULES_URL,{

     headers: {

        "authorization":`Bearer ${TOKEN}`
     }

        })

        if(res.statusCode !==200)
        {
            throw new Error(`getAllRules error response: ${res.statusCode} ${res.statusMessage}`);
        }


    }catch(e)
    {

        if(e instanceof Error)
        {
            throw e
        }

        throw new Error("Exception while fetching rules");
    }





}

 export  const   getTweets= async ( ids:string[]) =>{

    const scraper = new Scraper({
        transform: {
          request: (input, init) => {
            return [input, init];
          },
        },
      });

      console.log("getting tweets");
   
    let counter = 0;
    let tweets=[];
    for await (const tweet of scraper.getTweets('elonmusk', 10)) {
      if (tweet) {
        counter++;
        console.log(tweet.text);
        tweets.push(tweet);
      }
    }

    return  tweets;

}

const parseTweet= (stream:TweetStream) =>
{

    try{
        const user= stream.includes.users[0];
        const tweet= stream.includes.tweets[0];
        const place= stream.includes.places[0];
        return{

            id:tweet.id,
            userName:user.name,
            userId: user.username,
            text:tweet.text,
            date: tweet.created_at,
            geo:{
                id:place.id,
                name:place.name,
                full_name:place.full_name,
                place_type:place.place_type,
                country:place.country,
                country_code:place.country_code,
                coordinates: {

                    long:place.geo.bbox[0],
                    lat:place.geo.bbox[1]
                }
            }
        }
        
    }catch(e)
    {
        if(e instanceof Error)
        {
            return  e;
        }

        throw new Error("parseTweet encountered an unexpected error");
    }

}

export const connectStream=  async (retryAttempt: number = 0) =>
{
    const stream  =await  needle('get',STREAM_URL,{

        header:{
            authorization:`Bearer ${TOKEN} `,
            
        },
        timeout: 20000
    });

    stream.on('data',async (data: any) =>{

        try {
        const json: TweetStream=JSON.parse(data);
        const tweetObj=parseTweet(json);

        if(tweetObj instanceof Error)
        {
            console.log("Error parsing tweet",tweetObj.message);
        }
        else
        {

        const updatedTweetResult= await updateDynamoDBTweet(AWS_VENDORS_TABLE_NAME,tweetObj,tweetObj.id);
        if(updatedTweetResult instanceof  Error)
        {
            console.log("dynamodbupdatetweet error:",updatedTweetResult.message);

        }
        const sqsRes= await sqsSendMessage(AWS_SQS_URL,JSON.stringify(tweetObj));

        if(sqsRes instanceof Error)
        {
            console.log("sqsSendMessage error:",sqsRes.message);

        }


        }

           }
           catch(e)
           {

             if( data.status === 401)
             {
                console.log("error status 401",data);
                throw new Error("Error status 401");
             }
             else if(data.detail=="This stream is currently at the maximum allowed connection limit.")
              {
                console.log("error",data.detail);
                throw new Error("Stream max limit");
              }
              else
              {

              }


           }

    }).on("error",e=>{

        console.log("error",e.message);
        if(e.message !=="ECONNRESET")
        {

            console.log("invalid error code");
            throw new Error("Invalid error code");

        }
        else
        {
            console.log("Twitter connection failed trying again, attempt", retryAttempt);
       
            //exponential backoff method
            setTimeout(()=>{

              connectStream(++retryAttempt);

            },2 ** retryAttempt);
        }


    });

    return stream;

}