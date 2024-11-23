import {Tweet} from "../models/tweetSchema.js"
import { User } from "../models/userSchema.js";

export const createTweet = async(req, res) =>{
    try {
        const {description, id} = req.body;
        if(!description || !id){
            res.status(401).json({
                message:"Fields are Required",
                success:false
            });
        }
        const user = await User.findById(id).select("-password");
        await Tweet.create({
            description,
            userId:id,
            userDetails:user
        });
        return res.status(201).json({
            message:"Tweet Created Successfully",
            success:true
        })
    } catch (error) {
        console.log(error)
    }
}

export const deleteTweet = async(req, res) =>{
    try {
        const {id} = req.params;
        await Tweet.findByIdAndDelete(id);
        return res.status(200).json({
            message:"Tweet Deleted Successfully",
            success:true
        })
    } catch (error) {
        console.log(error)
    }
}


export const likeOrDislike = async(req, res)=>{
    try {
        const loggedInUserId = req.body.id;
        const tweetId = req.params.id;
        const tweet = await Tweet.findById(tweetId);
        if(tweet.like.includes(loggedInUserId)){
            await Tweet.findByIdAndUpdate(tweetId, {$pull:{like:loggedInUserId}});
            return res.status(200).json({
                message:"Tweet Disliked Successfully",
            })
        }else{
            await Tweet.findByIdAndUpdate(tweetId, {$push:{like:loggedInUserId}});
            return res.status(200).json({
                message:"Tweet Liked Successfully",
            })
        }
    } catch (error) {
        console.log(error)
    }
}

export const bookmarks = async(req, res)=>{
    try {
        const loggedInUserId = req.body.id;
        const tweetId = req.params.id;
        const user = await User.findById(loggedInUserId);
        if(user.bookmarks.includes(tweetId)){
            //remove
            await User.findByIdAndUpdate(loggedInUserId, {$pull:{bookmarks:tweetId}})
            return res.status(200).json({
                message:"removed from book marks"
            })
        }else{
            //bookmarks
            await User.findByIdAndUpdate(loggedInUserId, {$push:{bookmarks:tweetId}})
            return res.status(200).json({
                message:"added to book marks"
            })
        }
    } catch (error) {
        console.log(error)
    }
}