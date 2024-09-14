import express from "express";
import axios from "axios";
import bodyParser from "body-parser";
import env from "dotenv";

const app = express();
const port = 1304;
env.config();

const generalAPI_URL = "https://api.airvisual.com/v2/";
const yourTokenKey = process.env.IQAIR_TOKENKEY;
let iconIndex;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

app.get("/", (req,res) => {
    res.render("index.ejs");
});

app.get("/country", async (req,res) => {
    try{
        const response = await axios.get(generalAPI_URL+"countries?key="+yourTokenKey);
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
        res.render("index.ejs",{err: "there was an error"});
    }
});

app.post("/getWeather", async (req,res) => {
    try {
        const response = await axios.get(generalAPI_URL+"city?city="+req.body["city"]+"&state="+req.body["state"]+
            "&country="+req.body["country"]+"&key="+yourTokenKey);
        switch (response.data.data.current.weather.ic) {
            case "01d": iconIndex = "clear sky (day)"; break;

            case "01n": iconIndex = "clear sky (night)"; break;

            case "02d": iconIndex = "few clouds (day)"; break;

            case "02n": iconIndex = "few clouds (night)"; break;

            case "03d": iconIndex = "scattered clouds"; break;

            case "04d": iconIndex = "broken clouds"; break;

            case "09d": iconIndex = "shower rain"; break;

            case "10d": iconIndex = "rain (day time)"; break;

            case "10n": iconIndex = "rain (night time)"; break;

            case "11d": iconIndex = "thunderstorm"; break;

            case "13d": iconIndex = "snow"; break;

            case "50d": iconIndex = "mist"; break;

            default: iconIndex = "N/A"; break;
        }
        res.render("index.ejs",{
            wthData: response.data.data,
            cityName: req.body["city"],
            icon: iconIndex
        });
    } catch (error) {
        res.render("index.ejs",{err: error.data.message});
    }
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});