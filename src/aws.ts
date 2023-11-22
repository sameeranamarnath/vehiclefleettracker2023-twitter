import AWS, { SQS } from "aws-sdk"
import { marshall, unmarshall } from "@aws-sdk/util-dynamodb";
import dotenv from "dotenv";
dotenv.config();
AWS.config.update({region:process.env.AWS_REGION});
import { TweetFormatted } from "./types/twitter";

const {DynamoDB} =AWS;

const dynamodb= new DynamoDB();
const sqs  = new SQS();

export const createDynamoDBTable = async  (params: AWS.DynamoDB.CreateTableInput) => {

 try {
   const result=  await dynamodb.createTable(params).promise();
    console.log("Table created:",result);
    return result; 

 }
 catch(e)
 {
    if(e instanceof Error)
    {
        throw e
    }
    else 
    {
       throw new Error("DynamoDBCreate Table object unknown error type")
     }

 }


}


export const scanDynamoDBTable = async function* (tableName: string, limit: number = 25, lastEvaluatedKey?: AWS.DynamoDB.Key) {
    while (true) {
        const params: AWS.DynamoDB.ScanInput = {
            "TableName": tableName,
            "Limit": limit,
        }

        if (lastEvaluatedKey) {
            params.ExclusiveStartKey = lastEvaluatedKey
        }

        try {
            const result = await dynamodb.scan(params).promise();
            if (!result.Count) {
                return;
            }

            lastEvaluatedKey = (result as AWS.DynamoDB.ScanOutput).LastEvaluatedKey;
            result.Items = result.Items?.map((item) =>AWS.DynamoDB.Converter.unmarshall(item));
            yield result;
        } catch(e) {
            if (e instanceof Error) {
                throw e;
            }
            throw new Error('dynamodbScanTable unexpected error')
        }
    }
}


export const getAllScanResults=  async <T>(tableName:string, limit: number =2) =>
{
  
    try{

        await describeDynamoDBTable(tableName);

        const scanDynamoDBTableGen= await scanDynamoDBTable(tableName,limit);

        const results: T[] = [];
        let isDone= false;
   
         while(!isDone)
         {


            const iterator = await scanDynamoDBTableGen.next();
            if(!iterator)
            {
                throw new Error("No iterator returned");
            }

            if(iterator.done || !iterator.value.LastEvaluatedKey) {

                isDone=true;
            }

            if(iterator.value)
            {
                iterator.value.Items!.forEach((result:any)=>results.push(result));
            }



         }

         return results;

    

    } catch(e)
    {

        if(e instanceof Error)
        {
           throw e; 
        }

        throw new Error('dynamodbGetAllScanResults unexpected error')

    }

}
export const describeDynamoDBTable = async (tableName:string) => {

try{

    const table= await dynamodb.describeTable({TableName:tableName}).promise();
  console.log("Table retrieved :",table)
  return table;
}
catch(e)
{
  if(e instanceof Error)
  {
    return e
  }

   throw new Error("Dynamodb describe table error");
}

};

export const deleteDynamoDBTable= async(tableName:string) => {


    try {

        const result = await dynamodb.deleteTable({TableName:tableName}).promise();
        console.log("table deleted",result);
        return result
    }

    catch(e)
    {
        if(e instanceof Error)
        {
            throw e
        }
        else
        {
            throw new Error("unknown (rare) error while deleting DynamoDB table");
        }
    }



}

export const updateDynamoDBTweet =async(tableName:string, tweet:TweetFormatted,twitterId:string) =>
{


    try{


        const params: AWS.DynamoDB.UpdateItemInput = {  

            TableName: tableName,
            Key: marshall({
                "twitterId":  twitterId
            }),
            UpdateExpression: "set  #tweets= list_append(if_not_exists(#tweets,:empty_list),:tweet), #updated=:updated",
            ExpressionAttributeNames: {

                "#tweets": "tweets",
                "#updated": "updatedtimestamp"
            },
            ExpressionAttributeValues: marshall( {    
    
                ":tweet":[tweet],
                ":updated":Date.now(),
                ":empty_list":[]

            })
            

        }
         const result = await dynamodb.updateItem(params).promise();

         console.log("Tweet added to record!");
         return result;
    }catch(e)
    {

        if(e instanceof Error)
        {
            console.log("Error",e)
            throw e;
        }
    }


}

/*
export const addRecordToDynamoDBTable= async(tableName:string, vendorInfo:Vendor)=>
{

    try{

         await ( dynamodb.putItem({
            TableName: tableName,
            Item: marshall(vendorInfo)
        })).promise();

         console.log("done creating record");
    }

    catch(e)
    {
        if(e instanceof Error)
        {
            console.log("Error while adding record to Dynamodb",e);
            throw e
        }
        throw new Error("unknownError while adding record to Dynamodb")
    }



    
}
*/


export const sqsSendMessage= async(queueUrl:string, messageBody:string) => {

    try{
        const params : AWS.SQS.SendMessageRequest ={

            MessageBody:messageBody,
            QueueUrl:queueUrl
        }

        const result = await sqs.sendMessage(params).promise();
        console.log("Message sent to SQS",result);
       return result;

    }
    catch(e)
    {
        if(e instanceof Error)
        {
            console.log("Error while sending message to SQS",e);
            throw e
        }
        throw new Error("unknownError while sending message to SQS")    
    }


}


