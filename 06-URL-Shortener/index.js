const express = require("express")
const urlRoute = require("./routes/url")
const staticRouter = require("./routes/staticRouter")
const {connectToMongoDB} = require("./connects")
const cookies = require("cookies-parser")
const path = require("path")
const URL = require("./models/url")
const {restrictToLoggedinUserOnly}   =  require("./middlewares/auth")
const app = express();
const PORT = 8000;
const userRoute = require("./routes/user")

connectToMongoDB('mongodb://127.0.0.1:27017/short-url')
.then(()=>console.log("MongoDB is connected"))

app.set("view engine" , "ejs")
app.set("views" , path.resolve("./views"))


app.get("/test" , async (req , res) =>{
    const allUrls = await URL.find({});
    return res.render("home",{
        urls : allUrls,
        name : "node js"
    })
});



app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookies());
app.use("/", staticRouter);
app.use('/url', urlRoute);
app.use("/user", userRoute)
app.get('/:shortId' , async (req , res)=>{

    const shortId = req.params.shortId;

    const entry = await URL.findOneAndUpdate(
        {
            shortId
        },{$push :{
            visitHistory : {
                timestamp : Date.now(),
            },
        }}
    );
    res.redirect(entry.redirectURL)
})
app.listen(PORT, () => console.log(`Server is starting at PORT ${PORT}`));