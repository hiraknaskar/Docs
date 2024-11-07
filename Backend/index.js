require("dotenv").config();

const config= require("./config.json");
const mongoose= require("mongoose");

mongoose.connect(config.connectionString);

const User= require("./models/user.model");
const Note= require("./models/note.model");

const express= require("express");
const cors= require("cors");
const app= express();

const jwt= require("jsonwebtoken");
const {authenticateToken}=require("./utilities");

app.use(express.json());

app.use(
    cors({
        origin: 'http://localhost:5173',
        'https://docs-550b.onrender.com'// Your frontend URL
    methods: ['GET', 'HEAD', 'PUT', 'PATCH', 'POST', 'DELETE'],
    allowedHeaders: ['Authorization', 'Content-Type'],
    })
);

app.get("/",(req,res)=>{
    res.json({data:"hello"});
});

//Create Account API

app.post("/create-account",async(req,res)=>{
    const { fullName, email, password}= req.body;
    if(!fullName) {
        return res.status(400).json({error:true , message: "Full Name is require"});
    }

    if(!email) {
        return res.status(400).json({error:true , message: "Full Email is require"});
    }

    if(!password) {
        return res.status(400).json({error:true , message: "Full Password is require"});
    }

    const isUser= await User.findOne({email:email});
    if(isUser){
        return res.status(400).json({error:true , message: "User already exists"});
    }
    const user =new User({
        fullName,
        email,
        password,
    });
    await user.save();

    const accessToken=jwt.sign({user}, process.env.ACCESS_TOKEN_SECRET,{
        expiresIn:"30m",
    });
    return res.json({
        error:false,
        user,
        accessToken,
        message:"Registered successfully",
    });
});

//Login API

app.post("/login",async(req,res)=>{
    const {email, password}=req.body;
    if(!email){
        return res.status(400).json({message:"Email is require"});
    }
    if(!password){
        return res.status(400).json({message:"Password is require"});
    }
    const userInfo= await User.findOne({email:email});

    if(!userInfo){
        return res.status(400).json({message:"User not found"});
    }
    if(userInfo.email==email&&userInfo.password==password){
        const user={user:userInfo};
        const accessToken=jwt.sign(user, process.env.ACCESS_TOKEN_SECRET,{
            expiresIn:"36000m",
        });

        return res.json({
            error:false,
            message:"Login Successful",
            email,
            accessToken,
        });
    }else{
        return res.status(400).json({
            error:true,
            message:"Invalid Credentials",
        });
    }
});

//Get user

app.get("/get-user",authenticateToken,async(req,res)=>{
    const{user}= req.user;
    const isUser = await User.findOne({_id: user._id});

    if(!isUser){
        return res.sendStatus(401);
    }
    return res.json({
        user:{
            fullName:isUser.fullName,
            email:isUser.email,
            _id: isUser._id,
            createdOn: isUser.createdOn,
        },
        message:"",
    });
});

//Add new note API

app.post("/add-note",authenticateToken,async(req,res)=>{
    const {title,content,tags}=req.body;
    const {user}=req.user;

    if(!title){
        return res.status(400).json({error:true,message:"Title is require"});
    }

    if (!content) {
        return res.status(400).json({ error: true, message: "Content is required" });
    }

    try {
        const note = new Note({
            title,
            content,
            tags:tags||[],
            userId:user._id,
        });
        await note.save();
        return res.json({
            error:false,
            note,
            message:"Note added successfully",
        });
    } catch (error) {
        return res.status(500).json({
            error:true,
            message: "Internal Server Error",
        });
    }
});

//API for editing notes

app.put("/Edit-note/:noteId",authenticateToken,async(req,res)=>{
    const noteId= req.params.noteId;
    const {title, content,tags,isPinned}=req.body;
    const {user}= req.user;

    if(!title && !content && !tags){
        return res.status(400).json({error:true, message:"No changes provided"});
    }
    try {
        const note = await Note.findOne({_id:noteId, userId: user._id});
        if(!note){
            return res.status(404).json({error:true, message:"Note not found"});
        }
        if(title) note.title= title;
        if(content) note.content = content;
        if(tags) note.tags= tags;
        if(isPinned) note.isPinned=isPinned;

        await note.save();
        return res.json({
            error: false,
            note,
            message:"Note updated successfully",    
        });
    } catch (error) {
       return res.status(500).json({
        error:true,
        message: "Internal server error",
       }) 
    }
});

//API for grt all notes

app.get("/get-all-note",authenticateToken,async(req,res)=>{
    const{user}=req.user;
    try{
        const notes=await Note.find({userId:user._id}).sort({isPinned:-1});
        return res.json({
            error:false,
            notes,
            message:"all notes retrieved successfully",
        });
    } catch(error){
        return res.status(500).json({
            error:true,
            message: "Internal server error",
        });
    }
});

//Delete Note

app.delete("/delete-note/:noteId",authenticateToken,async(req,res)=>{
    const noteId= req.params.noteId;
    const {user}= req.user;

    try {
        const note = await Note.findOne({_id: noteId,userId: user._id});
        if(!note){
            return res.status(404).json({error: true, message:"Note not found"});
        }

        await Note.deleteOne({_id:noteId, userId:user._id});

        return res.json({
            error:false,
            message:"Note deleted succesfully",
        });
    } catch (error) {
        return res.status(500).json({
            error: true,
            message: "Internal Serevr Error",
        })
    }
});


//Update isPinned value 

app.put("/update-note-pinned/:noteId",authenticateToken,async(req,res)=>{
    const noteId= req.params.noteId;
    const {isPinned}=req.body;
    const {user}= req.user;

    try {
        const note = await Note.findOne({_id:noteId, userId: user._id});
        if(!note){
            return res.status(404).json({error:true, message:"Note not found"});
        }
        note.isPinned=isPinned;

        await note.save();
        return res.json({
            error: false,
            note,
            message:"Note updated successfully",    
        });
    } catch (error) {
       return res.status(500).json({
        error:true,
        message: "Internal server error",
       }) 
    }
});

//Search Notes 
app.get("/search-notes",authenticateToken,async(req,res)=>{
    const {user} =req.user;
    const {query}= req.query;
    if(!query){
        return res.status(400).json({error: true, message: "Search Query is required"});
    }
    try {
        const matchingNotes= await Note.find({
            userId:user._id,
            $or:[
                {title:{$regex: new RegExp(query, "i")}},
                 {content:{$regex: new RegExp(query, "i")}},
            ],
        });

        return res.json({
            error: false,
            notes: matchingNotes,
            message: "Notes matching the search query retrived successfully",
        })
    } catch (error) {
        return res.status(500).json({
            error:true,
            message: "Internal Server Error"
        });
    }
})

app.listen(8000);
module.exports = app;
