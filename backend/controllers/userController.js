import { User } from "../models/userSchema.js";
import bcryptjs from "bcryptjs";
import jwt from "jsonwebtoken"
import { Tweet } from "../models/tweetSchema.js";

export const Register = async(req, res) =>{
    try{
        const {name, username, email, password} = req.body;
        //basic validation
        if(!name || !username || !email || !password){
            return res.status(401).json({
                message: "Please fill in all fields",
                success:true
            })
        }
        const user = await User.findOne({email});
        if(user){
            return res.status(401).json({
                message: "Email already exists",
                success:false
            })
        }
        const hashedPassword = await bcryptjs.hash(password, 16);
        await User.create({
            name,
            username,
            email,
            password:hashedPassword
        });
        return res.status(201).json({
            message:"Account created successfully",
            success:true
        })
    }catch(err){
        console.log(err)
    }
}


export const Login = async (req, res)=>{
    try{
        const {email, password} = req.body;
        if(!email || !password){
            return res.status(401).json({
                message:"All fields are required",
                success:false
            });            
        };
        //might
        const user = await User.findOne({email});
        console.log(user)
        if(!user){
            return res.status(401).json({
                message: "User does not exist",
                success:false
            });
        }
        const isMatch = await bcryptjs.compare(password, user.password);
        if(!isMatch){
            return res.status(401).json({
                message: "Invalid email or password",
                success:false
            });
        }
        const tokenData = {
            userId:user._id
        }
    const token = jwt.sign(tokenData, process.env.TOKEN_SECRET, {expiresIn:"1d"})
    return res.status(201).cookie("token", token, {expiresIn:"1d", httpOnly:true}).json({
        message:`Welcome back ${user.name}`,
        user,
        success:true
    })
    }
    catch(error){
        console.log(error)
    }
}


export const logout = (req, res) =>{
    return res.cookie("token", "", {expiresIn: new Date(Date.now())}).json({
        message:"User logged out successfully",
        success:true
    })
}

export const getMyProfile = async(req, res) =>{
    try {
        const id = req.params.id;
        const user = await User.findById(id).select("-password")
        return res.status(200).json({
            user,
        })
    } catch (error) {
        console.log(error)
    }
}

export const getOtherUsers = async(req, res)=>{
    try {
        const {id} = req.params;
        const otherUsers = await User.find({_id:{$ne:id}}).select("-password");
        if(!otherUsers){
            return res.status(401).json({
                message: "No users found",
            })
        }
        return res.status(200).json({
            otherUsers
        })
    } catch (error) {
        console.log(error)
    }
}

export const follow = async(req, res) =>{
     try {
        const loggedInUserId = req.body.id;
        const userId = req.params.id;
        const loggedInUser = await User.findById(loggedInUserId);
        const user = await User.findById(userId)
        if(!user.followers.includes(loggedInUserId)){
            await user.updateOne({$push:{followers:loggedInUserId}});
            await loggedInUser.updateOne({$push:{following:userId}})
        }else{
            return res.status(400).json({
                message:`User already followed to ${user.name}`
            })
        }
        return res.status(200).json({
            message:`${loggedInUser.name} just followd to ${user.name}`,
            success:true
        })
     } catch (error) {
        console.log(error)
     }
}

export const unfollow = async(req, res)=>{
    try {
        const loggedInUserId = req.body.id;
        const userId = req.params.id;
        const user = await User.findById(userId);//keshav
        const loggedInUser = await User.findById(loggedInUserId);
        if(loggedInUser.following.includes(userId)){
            await user.updateOne({$pull:{followers:loggedInUserId}});
            await loggedInUser.updateOne({$pull:{following:userId}});
        }else{
            return res.status(400).json({
                message:`User has not followed yet`
            })
        }
        return res.status(200).json({
            message:`${loggedInUser.name} just unfollowed to ${user.name}`,
            success:true
        })
    } catch (error) {
        console.log(error)
    }
}


export const getAllTweets = async (req, res)=>{

    try {
        const id = req.params.id;
        const loggedInUser  = await User.findById(id);
        const loggedInUserTweets = await Tweet.find({userId:id});
        const followingUserTweet = await Promise.all(loggedInUser.following.map((otherUsersId)=>{
            return Tweet.find({userId:otherUsersId})
        }))
        return res.status(200).json({
            tweets:loggedInUserTweets.concat(...followingUserTweet)
        })
    } catch (error) {
        console.log(error)
    }
}

export const getFollowingTweets = async(req, res)=>{
    try {
        const id = req.params.id;
        const loggedInUser = await User.findById(id);
        const followingUserTweet = await Promise.all(loggedInUser.following.map((otherUsersId)=>{
            return Tweet.find({userId:otherUsersId})
        }))
        return res.status(200).json({
            tweets:[].concat(...followingUserTweet)
        })
    } catch (error) {
        console.log(error)
    }
}