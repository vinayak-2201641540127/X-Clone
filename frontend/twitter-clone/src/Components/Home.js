import React, { useEffect } from 'react'
import LeftSideBar from './LeftSideBar'
import RightSideBar from './RightSideBar'
import {Outlet, useNavigate} from 'react-router-dom'
import { useSelector } from 'react-redux'
import useOtherUsers from '../hooks/useOtherUsers'
import useGetMyTweets from '../hooks/useGetMyTweets'
// import store from '../redux/store'


const Home = () => {
  //custom Hooks
  const navigate = useNavigate();
  useEffect(()=>{
    if(!user){
      navigate("/login")
    }
  }, [])
  const {user, otherUsers} = useSelector(store=>store.user)
  useOtherUsers(user?._id);
  useGetMyTweets(user?._id);
  return (
    <div className = "flex justify-between w-[80%] mx-auto">
        <LeftSideBar/>
        <Outlet/>
        <RightSideBar otherUsers = {otherUsers}/>
    </div>
  )
}

export default Home