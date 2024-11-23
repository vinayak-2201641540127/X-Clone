import React from 'react'
import { IoIosArrowBack } from "react-icons/io";
import ae from './ae.png';
import { Link, useParams } from 'react-router-dom';
import Avatar from 'react-avatar';
import useGetProfile from '../hooks/useGetProfile';
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';
import { USER_API_END_POINT } from '../utils/constant';
import toast from 'react-hot-toast';
import { followingUpdate } from '../redux/userSlice';
import { getRefresh } from '../redux/tweetSlice';

const Profile = () => {
  const {user, profile} = useSelector(store =>store.user);  
  const {id }= useParams()
  useGetProfile(id)  
  const dispatch = useDispatch();

  const followAndFollowHandler = async() =>{
    if(user.following.includes(id)){
        //unfollow
        try {
            axios.defaults.withCredentials = true;
            const res = await axios.post(`${USER_API_END_POINT}/unfollow/${id}`,{id:user?._id})
            console.log(res)
            dispatch(followingUpdate(id))
            dispatch(getRefresh())
            toast.success(res.data.message);
        } catch (error) {
            toast.success(error.response.data.message);
            console.log(error)
        }
    }else{
        //follow
        try {
            axios.defaults.withCredentials = true;
            const res = await axios.post(`${USER_API_END_POINT}/follow/${id}`,{id:user?._id})
            console.log(res)
            dispatch(followingUpdate(id))
            dispatch(getRefresh())
            toast.success(res.data.message);
        } catch (error) {
            toast.success(error.response.data.message);
            console.log(error)
        }
    }
  } 

  return (
    <div className='w-[50%] border-l border-r border-gray-200'>
        <div>
            <div className="flex items-center py-2">
                <Link to="/" className="p-2 rounded-full bg-gray-100 hover:cursor-pointer">
                    <IoIosArrowBack size="24px"/>
                </Link>
                <div className="ml-2">
                    <h1 className="font-bold text-lg">{profile?.name}</h1>
                    <p className="text-gray-500 text-sm">10 posts</p>
                </div>
            </div>
            <img style={{ width: '100%', height: '200px' }}  src={ae} alt="logo"></img>
            <div className="absolute top-52 ml-2 border-4 border-white rounded-full">
                <Avatar src="https://facts.net/wp-content/uploads/2022/02/young-man-anime-style.jpg" size="120" round={true} /> 
            </div>
            <div className="text-right m-4">
                {
                    profile?._id === user?._id?(
                    <button className="px-4 py-1 hover:bg-gray-200 rounded-full border border-gray-400"> Edit Profile</button>
                    ):(
                    <button onClick={followAndFollowHandler} className="bg-black text-white px-4 py-1 rounded-full border border-gray-400">{user.following.includes(id)?"Following":"Follow"}</button>
                    )  
                }
                
            </div>
            <div className="m-4">
                <h1 className="font-bold text-xl">{profile?.name}</h1>
                <p>{`@${profile?.username}`}</p>
            </div>
            <div className="m-4 text-sm">
                <p>bio</p>
            </div>
        </div>
    </div>
  )
}

export default Profile;