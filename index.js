const express=require("express");
const app=express();
const mongoose=require("mongoose");
const path=require("path");
const Chat=require("./models/chat.js");
const methodOverride=require("method-override");
const ExpressError=require("./ExpressError");

app.use(express.static(path.join(__dirname,"public")));
app.set("views",path.join(__dirname,"views"));
app.set("view engine","ejs");

app.use(express.urlencoded({extended:true}));
app.use(methodOverride("_method"));

main().then(()=>{
    console.log("connection successful");
}).catch(err => console.log(err));

async function main() {
    await mongoose.connect('mongodb://127.0.0.1:27017/fakewhatsapp');
}

//wrapasync function to handle asynchrouns errors
// function asyncWrap(fn){
//     return function(req,res,next){
//         fn(req,res,next).catch((err)=> next(err));
//     }
// }
// app.get("/chats",asyncWrap (async(req,res,next)=>{
//     let chats=await Chat.find();
//     // console.log(chats);
//     res.render("index.ejs",{ chats });
// }));

//index route
app.get("/chats",async(req,res,next)=>{
    try{
        let chats=await Chat.find();
        // console.log(chats);
        res.render("index.ejs",{ chats });
    }catch(err){
        next(err);
    }
});

//newchat route
app.get("/chats/new",(req,res)=>{
    //throw new ExpressError(404,"Page not found");
    res.render("new.ejs");
});

//add chats
app.post("/chats",async(req,res,next)=>{
    try{
        let { from, to, msg }=req.body;
        let newChat=new Chat({
            from:from,
            msg:msg,
            to:to,
            created_at:new Date()
        });
        //to save the new chat
        await newChat.save();
        res.redirect("/chats");
    } catch(err){
        next(err);
    }
})

//New - show route
app.get("/chats/:id",async(req,res,next)=>{
    try{
        let { id }=req.params;
        let chat=await Chat.findById(id);
        if(!chat){
            next(new ExpressError(500,"Chat not found"));
        }
        res.render("edit.ejs",{ chat });
    }catch(err){
        next(err);
    }
})

//edit route
app.get("/chats/:id/edit",async (req,res,next)=>{
    try{
        let {id}=req.params;
        let chat=await Chat.findById(id);
        res.render("edit.ejs",{chat});
    }catch(err){
        next(err);
    }
});

//update route
app.put("/chats/:id",async(req,res,next)=>{
    try{
        let {id}=req.params;
        let {message}=req.body;
        const chat=await Chat.findByIdAndUpdate(
            id,
            {msg:message},
            {runValidators:true,new :true}
        );
        console.log(chat);
        res.redirect("/chats");
    }catch(err){
        next(err);
    }
});

//destroy route
app.delete("/chats/:id",async(req,res)=>{
    try{
        let {id}=req.params;
        const chat=await Chat.findByIdAndDelete(id);
        console.log(`deleted : ${chat}`);
        res.redirect("/chats");
    }catch(err){
        next(err);
    }
}); 

//error name printing middlewares
const handleValidationErr=(err)=>{
    console.log("This is a Validation error . Please follow the rules.");
    console.dir(err.message);
    return err;
}
app.use((err,req,res,next)=>{
    console.log(err.name);
    if(err.name==="ValidationError"){
        err=handleValidationErr(err);
    }
    next(err);
})

//error handling middleware
app.use((err,req,res,next)=>{
    let{ status=500,message="Some Error Occurred"}=err;
    res.status(status).send(message);
})

app.get("/",(req,res)=>{
    res.send("welcome user , you are on correct page!");
});
app.listen(8080,()=>{
    console.log("server is listening to port 8080");
});
