"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __await = (this && this.__await) || function (v) { return this instanceof __await ? (this.v = v, this) : new __await(v); }
var __asyncGenerator = (this && this.__asyncGenerator) || function (thisArg, _arguments, generator) {
    if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
    var g = generator.apply(thisArg, _arguments || []), i, q = [];
    return i = {}, verb("next"), verb("throw"), verb("return"), i[Symbol.asyncIterator] = function () { return this; }, i;
    function verb(n) { if (g[n]) i[n] = function (v) { return new Promise(function (a, b) { q.push([n, v, a, b]) > 1 || resume(n, v); }); }; }
    function resume(n, v) { try { step(g[n](v)); } catch (e) { settle(q[0][3], e); } }
    function step(r) { r.value instanceof __await ? Promise.resolve(r.value.v).then(fulfill, reject) : settle(q[0][2], r); }
    function fulfill(value) { resume("next", value); }
    function reject(value) { resume("throw", value); }
    function settle(f, v) { if (f(v), q.shift(), q.length) resume(q[0][0], q[0][1]); }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sqsSendMessage = exports.updateDynamoDBTweet = exports.deleteDynamoDBTable = exports.describeDynamoDBTable = exports.getAllScanResults = exports.scanDynamoDBTable = exports.createDynamoDBTable = void 0;
const aws_sdk_1 = __importStar(require("aws-sdk"));
const util_dynamodb_1 = require("@aws-sdk/util-dynamodb");
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
aws_sdk_1.default.config.update({ region: process.env.AWS_REGION });
const { DynamoDB } = aws_sdk_1.default;
const dynamodb = new DynamoDB();
const sqs = new aws_sdk_1.SQS();
const createDynamoDBTable = (params) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const result = yield dynamodb.createTable(params).promise();
        console.log("Table created:", result);
        return result;
    }
    catch (e) {
        if (e instanceof Error) {
            throw e;
        }
        else {
            throw new Error("DynamoDBCreate Table object unknown error type");
        }
    }
});
exports.createDynamoDBTable = createDynamoDBTable;
const scanDynamoDBTable = function (tableName, limit = 25, lastEvaluatedKey) {
    var _a;
    return __asyncGenerator(this, arguments, function* () {
        while (true) {
            const params = {
                "TableName": tableName,
                "Limit": limit,
            };
            if (lastEvaluatedKey) {
                params.ExclusiveStartKey = lastEvaluatedKey;
            }
            try {
                const result = yield __await(dynamodb.scan(params).promise());
                if (!result.Count) {
                    return yield __await(void 0);
                }
                lastEvaluatedKey = result.LastEvaluatedKey;
                result.Items = (_a = result.Items) === null || _a === void 0 ? void 0 : _a.map((item) => aws_sdk_1.default.DynamoDB.Converter.unmarshall(item));
                yield yield __await(result);
            }
            catch (e) {
                if (e instanceof Error) {
                    throw e;
                }
                throw new Error('dynamodbScanTable unexpected error');
            }
        }
    });
};
exports.scanDynamoDBTable = scanDynamoDBTable;
const getAllScanResults = (tableName, limit = 2) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield (0, exports.describeDynamoDBTable)(tableName);
        const scanDynamoDBTableGen = yield (0, exports.scanDynamoDBTable)(tableName, limit);
        const results = [];
        let isDone = false;
        while (!isDone) {
            const iterator = yield scanDynamoDBTableGen.next();
            if (!iterator) {
                throw new Error("No iterator returned");
            }
            if (iterator.done || !iterator.value.LastEvaluatedKey) {
                isDone = true;
            }
            if (iterator.value) {
                iterator.value.Items.forEach((result) => results.push(result));
            }
        }
        return results;
    }
    catch (e) {
        if (e instanceof Error) {
            throw e;
        }
        throw new Error('dynamodbGetAllScanResults unexpected error');
    }
});
exports.getAllScanResults = getAllScanResults;
const describeDynamoDBTable = (tableName) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const table = yield dynamodb.describeTable({ TableName: tableName }).promise();
        console.log("Table retrieved :", table);
        return table;
    }
    catch (e) {
        if (e instanceof Error) {
            return e;
        }
        throw new Error("Dynamodb describe table error");
    }
});
exports.describeDynamoDBTable = describeDynamoDBTable;
const deleteDynamoDBTable = (tableName) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const result = yield dynamodb.deleteTable({ TableName: tableName }).promise();
        console.log("table deleted", result);
        return result;
    }
    catch (e) {
        if (e instanceof Error) {
            throw e;
        }
        else {
            throw new Error("unknown (rare) error while deleting DynamoDB table");
        }
    }
});
exports.deleteDynamoDBTable = deleteDynamoDBTable;
const updateDynamoDBTweet = (tableName, tweet, twitterId) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const params = {
            TableName: tableName,
            Key: (0, util_dynamodb_1.marshall)({
                "twitterId": twitterId
            }),
            UpdateExpression: "set  #tweets= list_append(if_not_exists(#tweets,:empty_list),:tweet), #updated=:updated",
            ExpressionAttributeNames: {
                "#tweets": "tweets",
                "#updated": "updatedtimestamp"
            },
            ExpressionAttributeValues: (0, util_dynamodb_1.marshall)({
                ":tweet": [tweet],
                ":updated": Date.now(),
                ":empty_list": []
            })
        };
        const result = yield dynamodb.updateItem(params).promise();
        console.log("Tweet added to record!");
        return result;
    }
    catch (e) {
        if (e instanceof Error) {
            console.log("Error", e);
            throw e;
        }
    }
});
exports.updateDynamoDBTweet = updateDynamoDBTweet;
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
const sqsSendMessage = (queueUrl, messageBody) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const params = {
            MessageBody: messageBody,
            QueueUrl: queueUrl
        };
        const result = yield sqs.sendMessage(params).promise();
        console.log("Message sent to SQS", result);
        return result;
    }
    catch (e) {
        if (e instanceof Error) {
            console.log("Error while sending message to SQS", e);
            throw e;
        }
        throw new Error("unknownError while sending message to SQS");
    }
});
exports.sqsSendMessage = sqsSendMessage;
