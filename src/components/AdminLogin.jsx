import React, { useEffect, useState } from 'react'
import { supabase } from '../supabaseClient';
import { useNavigate } from 'react-router-dom'

const AdminLogin = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate()

    useEffect(() => {
            const checkUser = async () => {
                const { data } = await supabase.auth.getUser()

                if(data.user)
                {
                    navigate('/addaccounts')
                }
            }})
    
    const onSubmit = async (e) => {
        e.preventDefault();
        if (!email || !password) {
            alert("Please enter email and password");
            return;
        }

        const { data, error } = await supabase.auth.signInWithPassword({
            email,
            password
        })

        if (error) {
            alert(error.message)
        } else {
            console.log('User:', data.user)
            navigate('/addaccounts') 
        }

    }

  return (
    <div className='h-screen w-full flex justify-center items-center bg-neutral-600'>
        <div className='w-[420px] h-auto bg-white/75 rounded p-5'>
            <form onSubmit={onSubmit}>
                <div className='text-xl'>
                    Email
                </div>
                <input type="text" className='bg-white/90 rounded w-full text-xl p-3 outline-none'
                 value={email} onChange={(e) => {setEmail(e.target.value)}}/>
                <div className='text-xl mt-3'>
                    Password
                </div>
                <input type="text" className='bg-white/90 rounded w-full text-xl p-3 outline-none'
                 value={password} onChange={(e) => {setPassword(e.target.value)}}/>
                <button type="submit" className='w-full p-3 text-xl bg-green-400 mt-5 rounded'>
                    Submit
                </button>   
            </form>
        </div>
    </div>
  )
}

export default AdminLogin