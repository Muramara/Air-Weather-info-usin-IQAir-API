import express from "express";
import axios from "axios";
import bodyParser from "body-parser";

const app = express();
const port = 1304;
const generalAPI_URL = "https://api.airvisual.com/v2/";
const yourTokenKey = "75f7e8d9-099d-4b5e-a497-a3d28e99485d";

app.use(bodyParser.urlencoded({ extended: true }));

app.get("/", (req,res) => {
    res.render("index.ejs");
})