import React from 'react'
import { CiHome } from "react-icons/ci";
import { MdExplore } from "react-icons/md";
import { IoIosNotificationsOutline } from "react-icons/io"
import { CiBookmark } from "react-icons/ci";
import { CgProfile } from "react-icons/cg";
import { CiLogout } from "react-icons/ci";
import { Link, useNavigate } from 'react-router-dom';
import { useSelector,  useDispatch } from 'react-redux';
import axios from 'axios';
import { USER_API_END_POINT } from '../utils/constant';
import toast from 'react-hot-toast';
import { getMyProfile, getOtherUsers, getUser } from '../redux/userSlice';
const LeftSideBar = () => {
  const {user} = useSelector(store =>store.user);  
  const navigate = useNavigate();
  const dispatch = useDispatch();
    const logOutHandler = ()=>{
        try {
            const res = axios.get(`${USER_API_END_POINT}/logout`);
            dispatch(getUser(null));
            dispatch(getOtherUsers(null));
            dispatch(getMyProfile(null));
            navigate('/login')
            toast.success(res.data.message);
        } catch (error) {
            console.log(error)          
        }
    }
  return (
    <div className="w-[20%]"> 
        <div>
            <div>
                <img className="ml-5" width={"24px"} src="https://img.freepik.com/free-vector/new-2023-twitter-logo-x-icon-design_1017-45418.jpg?size=626&ext=jpg&ga=GA1.1.1098082284.1706876266&semt=ais_hybrid" alt="twitter-logo"></img>
            </div>
            <div className = "my-4">
                <Link to="/" className = "flex items-center my-2 px-3 py-2 hover:bg-gray-200 hover:cursor-pointer rounded-full">
                    <div>
                        <CiHome size="24px"/>
                    </div>
                    <h1 className = "font-bold text-lg ml-2">Home</h1>
                </Link>
                <div className = "flex items-center my-2 px-3 py-2 hover:bg-gray-200 hover:cursor-pointer rounded-full">
                    <div>
                        <MdExplore size="24px"/>
                    </div>
                    <h1 className = "font-bold text-lg ml-2">Explore</h1>
                </div>
                <div className = "flex items-center my-2 px-3 py-2 hover:bg-gray-200 hover:cursor-pointer rounded-full">
                    <div>
                        <IoIosNotificationsOutline size="24px"/>
                    </div>
                    <h1 className = "font-bold text-lg ml-2">Notifications</h1>
                </div>
                
                <div className = "flex items-center my-2 px-3 py-2 hover:bg-gray-200 hover:cursor-pointer rounded-full">
                    <div>
                        <CiBookmark size="24px"/>
                    </div>
                    <h1 className = "font-bold text-lg ml-2">BookMark</h1>
                </div>
                <Link to={`/profile/${user?._id}`} className = "flex items-center my-2 px-3 py-2 hover:bg-gray-200 hover:cursor-pointer rounded-full">
                    <div>
                        <CgProfile size="24px"/>
                    </div>
                    <h1 className = "font-bold text-lg ml-2">Profile</h1>
                </Link>
                <div onClick={logOutHandler} className = "flex items-center my-2 px-3 py-2 hover:bg-gray-200 hover:cursor-pointer rounded-full">
                    <div>
                        <CiLogout size="24px"/>
                    </div>
                    <h1 className = "font-bold text-lg ml-2">Log-out</h1>
                </div>
                <button className = "px-4 py-2 border-none texxt-md bg-[#1D98F0] w-full rounded-full font-bold">
                    Post
                </button>
            </div>
        </div>
    </div>
  )
}

export default LeftSideBar