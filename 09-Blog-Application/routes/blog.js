const {Router } = require("express")
const router = Router();
const path = require("path")




const storage = multer.diskStorage({
    destination : function (req , res , cb){
        cb(null , path.resolve('/public/my-uploads'));
    },
    filename : function (req , file , cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random()* 1E9)
        cb(null , file.filename + '-' + uniqueSuffix)
    }
})








router.get("/add-new"  , (req , res)=>{
    return res.render("addBlog", {
        user : res.user
    })
})

router.post("/" , (req , res)=>{
    console.log(req.body);
    return res.redirect("/");
})

router.post("/" , upload.single("coverImage"), (req , res)=>{
    const {title , body}  = req.body
    Blog.create({
        body,
        title,
        createdBy : req.user._id,
        coverImageURL : `/uploads/`
    })
})

module.exports = router;