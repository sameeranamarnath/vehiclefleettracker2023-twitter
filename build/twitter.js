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
var __asyncValues = (this && this.__asyncValues) || function (o) {
    if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
    var m = o[Symbol.asyncIterator], i;
    return m ? m.call(o) : (o = typeof __values === "function" ? __values(o) : o[Symbol.iterator](), i = {}, verb("next"), verb("throw"), verb("return"), i[Symbol.asyncIterator] = function () { return this; }, i);
    function verb(n) { i[n] = o[n] && function (v) { return new Promise(function (resolve, reject) { v = o[n](v), settle(resolve, reject, v.done, v.value); }); }; }
    function settle(resolve, reject, d, v) { Promise.resolve(v).then(function(v) { resolve({ value: v, done: d }); }, reject); }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var _a, _b, _c;
Object.defineProperty(exports, "__esModule", { value: true });
exports.connectStream = exports.getTweets = exports.deleteAllRules = exports.getAllRules = void 0;
const needle_1 = __importDefault(require("needle"));
const dotenv_1 = __importDefault(require("dotenv"));
const aws_1 = require("./aws");
const twitter_scraper_1 = require("@the-convocation/twitter-scraper");
dotenv_1.default.config();
const RULES_URL = 'https://api.twitter.com/2/tweets/search/stream/rules';
const STREAM_URL = 'https://api.twitter.com/2/tweets/search/stream?tweet.fields=attachments,author_id,context_annotations,conversation_id,created_at,edit_controls,edit_history_tweet_ids,entities,geo,id,in_reply_to_user_id,lang,non_public_metrics,organic_metrics,possibly_sensitive,promoted_metrics,public_metrics,referenced_tweets,reply_settings,source,text,withheld&expansions=attachments.media_keys,attachments.poll_ids,author_id,edit_history_tweet_ids,entities.mentions.username,geo.place_id,in_reply_to_user_id,referenced_tweets.id,referenced_tweets.id.author_id&media.fields=alt_text,duration_ms,height,media_key,non_public_metrics,organic_metrics,preview_image_url,promoted_metrics,public_metrics,type,url,variants,width&poll.fields=duration_minutes,end_datetime,id,options,voting_status&user.fields=created_at,description,entities,id,location,name,pinned_tweet_id,profile_image_url,protected,public_metrics,url,username,verified,withheld&place.fields=contained_within,country,country_code,full_name,geo,id,name,place_type';
const TOKEN = (_a = process.env.TWITTER_API_BEARER_TOKEN) !== null && _a !== void 0 ? _a : "";
const AWS_VENDORS_TABLE_NAME = (_b = process.env.AWS_VENDORS_TABLE_NAME) !== null && _b !== void 0 ? _b : "";
const AWS_SQS_URL = (_c = process.env.AWS_SQS_URL) !== null && _c !== void 0 ? _c : "";
console.log("token is:", TOKEN);
const setRules = (rules) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const res = yield (0, needle_1.default)("post", RULES_URL, {
            "add": rules
        }, { headers: {
                "content-type": "application/json",
                "authorization": `Bearer ${TOKEN}`
            } });
        if (res.statusCode !== 201) {
            throw new Error(`setRules error response: ${res.statusCode}  ${res.statusMessage}`);
        }
    }
    catch (e) {
        if (e instanceof Error) {
            return e;
        }
        throw new Error("setRules unexpected error twitter api");
    }
});
const getAllRules = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const res = yield (0, needle_1.default)("get", RULES_URL, {
            headers: {
                "authorization": `Bearer ${TOKEN}`
            }
        });
        if (res.statusCode !== 200) {
            throw new Error(`getAllRules error response: ${res.statusCode} ${res.statusMessage}`);
        }
    }
    catch (e) {
        if (e instanceof Error) {
            throw e;
        }
        throw new Error("Exception while fetching rules");
    }
});
exports.getAllRules = getAllRules;
const deleteAllRules = (rules) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (!Array.isArray(rules.data)) {
            throw new Error("invalid rules set passed in");
        }
        const ids = rules.data.map((rule) => rule.id);
        const params = {
            delete: { ids }
        };
        const res = yield (0, needle_1.default)("post", RULES_URL, {
            headers: {
                "authorization": `Bearer ${TOKEN}`
            }
        });
        if (res.statusCode !== 200) {
            throw new Error(`getAllRules error response: ${res.statusCode} ${res.statusMessage}`);
        }
    }
    catch (e) {
        if (e instanceof Error) {
            throw e;
        }
        throw new Error("Exception while fetching rules");
    }
});
exports.deleteAllRules = deleteAllRules;
const getTweets = (ids) => __awaiter(void 0, void 0, void 0, function* () {
    var _d, e_1, _e, _f;
    const scraper = new twitter_scraper_1.Scraper({
        transform: {
            request: (input, init) => {
                return [input, init];
            },
        },
    });
    console.log("getting tweets");
    let counter = 0;
    let tweets = [];
    try {
        for (var _g = true, _h = __asyncValues(scraper.getTweets('elonmusk', 10)), _j; _j = yield _h.next(), _d = _j.done, !_d; _g = true) {
            _f = _j.value;
            _g = false;
            const tweet = _f;
            if (tweet) {
                counter++;
                console.log(tweet.text);
                tweets.push(tweet);
            }
        }
    }
    catch (e_1_1) { e_1 = { error: e_1_1 }; }
    finally {
        try {
            if (!_g && !_d && (_e = _h.return)) yield _e.call(_h);
        }
        finally { if (e_1) throw e_1.error; }
    }
    return tweets;
});
exports.getTweets = getTweets;
const parseTweet = (stream) => {
    try {
        const user = stream.includes.users[0];
        const tweet = stream.includes.tweets[0];
        const place = stream.includes.places[0];
        return {
            id: tweet.id,
            userName: user.name,
            userId: user.username,
            text: tweet.text,
            date: tweet.created_at,
            geo: {
                id: place.id,
                name: place.name,
                full_name: place.full_name,
                place_type: place.place_type,
                country: place.country,
                country_code: place.country_code,
                coordinates: {
                    long: place.geo.bbox[0],
                    lat: place.geo.bbox[1]
                }
            }
        };
    }
    catch (e) {
        if (e instanceof Error) {
            return e;
        }
        throw new Error("parseTweet encountered an unexpected error");
    }
};
const connectStream = (retryAttempt = 0) => __awaiter(void 0, void 0, void 0, function* () {
    const stream = yield (0, needle_1.default)('get', STREAM_URL, {
        header: {
            authorization: `Bearer ${TOKEN} `,
        },
        timeout: 20000
    });
    stream.on('data', (data) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const json = JSON.parse(data);
            const tweetObj = parseTweet(json);
            if (tweetObj instanceof Error) {
                console.log("Error parsing tweet", tweetObj.message);
            }
            else {
                const updatedTweetResult = yield (0, aws_1.updateDynamoDBTweet)(AWS_VENDORS_TABLE_NAME, tweetObj, tweetObj.id);
                if (updatedTweetResult instanceof Error) {
                    console.log("dynamodbupdatetweet error:", updatedTweetResult.message);
                }
                const sqsRes = yield (0, aws_1.sqsSendMessage)(AWS_SQS_URL, JSON.stringify(tweetObj));
                if (sqsRes instanceof Error) {
                    console.log("sqsSendMessage error:", sqsRes.message);
                }
            }
        }
        catch (e) {
            if (data.status === 401) {
                console.log("error status 401", data);
                throw new Error("Error status 401");
            }
            else if (data.detail == "This stream is currently at the maximum allowed connection limit.") {
                console.log("error", data.detail);
                throw new Error("Stream max limit");
            }
            else {
            }
        }
    })).on("error", e => {
        console.log("error", e.message);
        if (e.message !== "ECONNRESET") {
            console.log("invalid error code");
            throw new Error("Invalid error code");
        }
        else {
            console.log("Twitter connection failed trying again, attempt", retryAttempt);
            //exponential backoff method
            setTimeout(() => {
                (0, exports.connectStream)(++retryAttempt);
            }, 2 ** retryAttempt);
        }
    });
    return stream;
});
exports.connectStream = connectStream;
