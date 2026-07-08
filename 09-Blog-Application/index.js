const path = requite("path")
const express = require("express")
const userRouter = require("./routes/user")
const blogRouter = require("./routes/blog")

const mongoose  = require("mongoose");
const cookieparser = require("cookieparser");
const { checkForAuthenticationCookie } = require("./middlewares/authentication");

const app = express();
const PORT = 8000;


mongoose.connect('mongodb://localhost:27017/blogify').then(e => console.log("Mongodb Connected"))



app.set("view engine" , "ejs");
app.set("views" ,path.resole("./views"));

app.use(express.urlencoded({extended:false}));
app.use(cookieparser())
app.use(checkForAuthenticationCookie("token"))

app.get("/" , (req , res)=>{
    res.render("home" , {
        user :req.user,
        blogs  : allblogs,
    });
})

app.use("/user" , userRouter)
app.user("/blog" , blogRouter)


app.listen(PORT , ()=> console.log(`Server Started at PORT:${PORT}`))