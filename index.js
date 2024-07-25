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
});

app.get("/country", async (req,res) => {
    try{
        const response = await axios.get(generalAPI_URL+"countries?key="+yourTokenKey);
        console.log(response.data[0]);
        res.render("index.ejs",{cList: response.data.data});
    }catch(error){
        res.render("index.ejs",{err: error.data.message});
    }
});

app.get("/state", async (req,res) => {
    res.render("index.ejs",{getStateList: true});
});

app.post("/getStates", async (req,res) => {
    try{
        const response = await axios.get(generalAPI_URL+"states?country="+req.body["chosenCountry"]+"&key="+yourTokenKey);
        res.render("index.ejs",{
            sList: response.data.data,
            countryName: req.body["chosenCountry"]
        });
    }catch(error){
        res.render("index.ejs",{err: error.data.message});
    }
});

app.get("/city", async (req,res) => {
    res.render("index.ejs",{getCityList: true});
});

app.post("/getCities", async (req,res) => {
    try{
        const response = await axios.get(generalAPI_URL+"cities?state="+req.body["chosenState"]+
            "&country="+req.body["chosenCountry"]+"&key="+yourTokenKey);
        res.render("index.ejs",{
            ctList: response.data.data,
            stateName: req.body["chosenState"],
            countryName: req.body["chosenCountry"]
        });
    }catch(error){
        res.render("index.ejs",{err: error.data.message});
    }
})

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});