import * as express from "express";
import {
    getDatabases,
    readData
} from "./connection";
import * as fs from "fs";
import * as dotenv from "dotenv";
const bodyParser = require("body-parser");
import OpenAI  from "openai";


dotenv.config();

const app = express();
const router = express.Router();

const database = 'chatbotVetv1';
const table = 'my_book';
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

router.get("/api/hello", (req, res, next) => {
    res.json("SingleStore");
});

router.post("/setup", bodyParser.json(), async (req, res, next) => {
    const host = req.body.hostname;
    const password = req.body.password;

    try {
        fs.writeFileSync(".env", `HOST="${host}"\nPASSWORD="${password}"`);
    } catch (err) {
        console.error(err);
    }

    try {
        const data = fs.readFileSync(".env", "utf-8");
        console.log({ data });
    } catch (err) {
        console.error(err);
    }

    dotenv.config();
    res.json("/SETUP!");
});

router.get("/api/database", async (req, res) => {
    const sqlRes = await getDatabases();
    res.json(sqlRes);
});

router.get("/api/database", async (req, res) => {
    const sqlRes = await getDatabases();
    res.json(sqlRes);
});

router.get("/api/database/:text", async (req, res) => {
    console.log(req.params.text);
    const text = req.params.text;
    

    try {
        const response = await openai.embeddings.create({
            model: "text-embedding-ada-002",
            input: text,
        });
        const embedding = response.data[0].embedding;
        const sqlRes = await readData({database, embedding});
        
        const propt = `The user asked : ${text}. the most similar text from the book is: ${sqlRes.text}`;
        // New
        const chatCompletion = await openai.chat.completions.create({
            model: "gpt-3.5-turbo",
            messages: [{"role": "user", "content": propt}],
        });
        console.log(chatCompletion.choices[0].message);
        res.json(chatCompletion.choices[0].message)

    } catch (error) {
        console.error(error);
    }
    
});

export default router;
