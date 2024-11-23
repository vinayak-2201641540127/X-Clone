import axios from 'axios';
import React, { useState } from 'react'
import { USER_API_END_POINT } from '../utils/constant';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { getUser } from '../redux/userSlice';

const Login = () => {
  const [isLogin, setisLogin] = useState(false);
  const [name, setName] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const submitHandler = async (e) => {
    e.preventDefault();
    // console.log(name, username, email, password);
    if (isLogin) {
      //login
      try {
        const res = await axios.post(`${USER_API_END_POINT}/login`, { email, password }, {
          headers: {
            "Content-type": "application/json"
          },
          withCredentials: true
        });
        dispatch(getUser(res?.data?.user))
        if(res.data.success){
          navigate("/");
          toast.success(res.data.message)
        }
      } catch (error) {
        toast.success(error.response.data.message);
        console.log(error)
      }
    } else {
      //signup
      try {
        const res = await axios.post(`${USER_API_END_POINT}/register`, { name, username, email, password }, {
          headers: {
            "Content-type": "application/json"
          },
          withCredentials: true
        });
        if(res.data.success){
          setisLogin(true);
          toast.success(res.data.message)
        }
      } catch (error) {
        toast.success(error.response.data.message);
        console.log(error)
      }
    }
  }

  const loginSignuphandler = () => {
    setisLogin(!isLogin);
  }
  return (
    <div className="w-screen h-screen flex items-center justify-center">
      <div className='flex items-center justify-evenly w-[80%]'>
        <div>
          <img className="ml-5" width={"300px"} src="https://img.freepik.com/free-vector/new-2023-twitter-logo-x-icon-design_1017-45418.jpg?size=626&ext=jpg&ga=GA1.1.1098082284.1706876266&semt=ais_hybrid" alt="twitter-logo"></img>
        </div>

        <div>
          <div className='my-5'>
            <h1 className='font-bold text-6xl'>Happening Now!</h1>
          </div>
          <h1 className='text-2xl font-bold mt-4 mb-2'>{isLogin ? "Login" : "Sign-Up"}</h1>
          <form onSubmit={submitHandler} className='flex flex-col w-[50%]'>
            {
              !isLogin && (
                <>
                  <input type='text' value={name} onChange={(e) => setName(e.target.value)} placeholder='name' className="outline-blue-500 border border-gray-800 px-3 py-1 rounded-full my-1 font" />
                  <input type='text' value={username} onChange={(e) => setUsername(e.target.value)} placeholder='username' className="outline-blue-500 border border-gray-800 px-3 py-1 rounded-full my-1" />
                </>
              )
            }
            <input type='email' value={email} onChange={(e) => setEmail(e.target.value)} placeholder='email' className="outline-blue-500 border border-gray-800 px-3 py-1 rounded-full my-1" />
            <input type='password' value={password} onChange={(e) => setPassword(e.target.value)} placeholder='password' className="outline-blue-500 border border-gray-800 px-3 py-1 rounded-full my-1" />
            <button className="bg-[#1098F0] rounded-full py-2 border-none text-lg text-white my-4" >{isLogin ? "Login" : "Create Account"}</button>
            <h1>{isLogin ? "Don't have an account" : "Already Have an account?"} <span onClick={loginSignuphandler} className='text-blue-600 font-bold cursor-pointer'>{isLogin ? "Register" : "Login"}</span> </h1>
          </form>
        </div>
      </div>
    </div>
  )
}

export default Login 