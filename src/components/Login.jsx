import React, { useState } from 'react'
import { supabase } from '../supabaseClient'
import bcrypt from 'bcryptjs'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'

const Login = () => {
    const backendUrl = import.meta.env.VITE_BACKEND_URL;
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const navigate = useNavigate()

    const handleSubmit = async (e) => {
        e.preventDefault()
        try {
            const res = await axios.post(`${backendUrl}/api/login`, {
                email: email,
                password: password
            });

            if (res.status === 200) {
                const data = res.data;
                
                alert(`Welcome ${data.team_name}!`)
                localStorage.setItem('team_id', data.id)
                localStorage.setItem('team_name', data.team_name)

                navigate('/dashboard')
            }
        }
        catch (err) {
            console.log(err.response.data)
                console.log('Status code:', err.response.status);
    console.log('Headers:', err.response.headers);
            if (err.response.status === 401) {
                alert("Invalid email or password");
            }
            else {
                alert("Some Error Occured: Try Again")
            }
        }
    }


  return (
    <div className='h-screen w-full bg-neutral-900 flex items-center justify-center'>
        <div className='h-auto py-2 w-[450px] bg-neutral-800/75 shadow-lg shadow-neutral-100/15'>
            <div>
                <div className='p-5'>
                    <div className='flex w-full justify-between items-center'>
                        <div className='text-3xl font-semi bold text-white'>
                            LOG IN
                        </div>
                    </div>
                    <form onSubmit={handleSubmit}>
                        <div className='pt-2 text-xl text-white'>
                            Leader's Mail
                        </div>
                        <input type="text" className='mt-2 p-3 w-full bg-neutral-600 outline-0 text-white focus:shadow-xl transition duration-200' value={email}
                        onChange={(e) => {setEmail(e.target.value)}} placeholder='Email'/>
                        <div className='pt-2 text-xl text-white'>
                            Password
                        </div>
                        <input type="text" className='mt-1 p-3 w-full bg-neutral-600 outline-0 text-white focus:shadow-xl transition duration-200' value={password} 
                        onChange={(e) => {setPassword(e.target.value)}} placeholder='Password'/>
                        <button type='submit' className='p-3 text-white w-full bg-blue-500 hover:bg-blue-600 active:bg-blue-600 cursor-pointer
                        rounded mt-3'>
                            Submit
                        </button>
                    </form>
                </div>
            </div>
        </div>
    </div>
  )
}

export default Login