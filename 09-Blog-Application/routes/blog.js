const {Router } = require("express")
const router = Router();
const path = require("path")
const Blog = require('../models/blog')
const Comment = require('../models/comment')




const storage = multer.diskStorage({
    destination : function (req , res , cb){
        cb(null , path.resolve('/public/my-uploads'));
    },
    filename : function (req , file , cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random()* 1E9)
        cb(null , file.filename + '-' + uniqueSuffix)
    }
})


router.get("/:id" ,(req , res)=>{
    const blog = await Blog.findById(req.params.id).populate("createdBy");
    const comments = await Comment.find({blogId:req.params.id}).populate("createdBy");
    return res.render("blog", {
        user : req.user,
        blog,
        comments,
    });
});

router.post('/comment/:blogId' , async (req , res)=>{
    const comment = await Comment.create({
        content:res.body.content,
        blogId  : req.params.blogId,
        createdBy : req.user._id
    })

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