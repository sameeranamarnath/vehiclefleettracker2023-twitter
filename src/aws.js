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
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteDynamoDBTable = exports.describeDynamoDBTable = exports.createDynamoDBTable = void 0;
var aws_sdk_1 = require("aws-sdk");
var dotenv_1 = require("dotenv");
dotenv_1.default.config();
aws_sdk_1.default.config.update({ region: process.env.AWS_REGION });
var DynamoDB = aws_sdk_1.default.DynamoDB;
var dynamodb = new DynamoDB();
var createDynamoDBTable = function (params) { return __awaiter(void 0, void 0, void 0, function () {
    var result, e_1;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                return [4 /*yield*/, dynamodb.createTable(params).promise()];
            case 1:
                result = _a.sent();
                console.log("Table created:", result);
                return [2 /*return*/, result];
            case 2:
                e_1 = _a.sent();
                if (e_1 instanceof Error) {
                    throw e_1;
                }
                else {
                    throw new Error("DynamoDBCreate Table object unknown error type");
                }
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); };
exports.createDynamoDBTable = createDynamoDBTable;
var describeDynamoDBTable = function (tableName) { return __awaiter(void 0, void 0, void 0, function () {
    var table, e_2;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                return [4 /*yield*/, dynamodb.describeTable({ TableName: tableName }).promise()];
            case 1:
                table = _a.sent();
                console.log("Table retrieved :", table);
                return [2 /*return*/, table];
            case 2:
                e_2 = _a.sent();
                if (e_2 instanceof Error) {
                    return [2 /*return*/, e_2];
                }
                throw new Error("Dynamodb describe table error");
            case 3: return [2 /*return*/];
        }
    });
}); };
exports.describeDynamoDBTable = describeDynamoDBTable;
var deleteDynamoDBTable = function (tableName) { return __awaiter(void 0, void 0, void 0, function () {
    var result, e_3;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                return [4 /*yield*/, dynamodb.deleteTable({ TableName: tableName }).promise()];
            case 1:
                result = _a.sent();
                console.log("table deleted", result);
                return [2 /*return*/, result];
            case 2:
                e_3 = _a.sent();
                if (e_3 instanceof Error) {
                    throw e_3;
                }
                else {
                    throw new Error("unknown (rare) error while deleting DynamoDB table");
                }
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); };
exports.deleteDynamoDBTable = deleteDynamoDBTable;
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
