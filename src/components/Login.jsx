import React, { useState } from 'react'
import { supabase } from '../supabaseClient'
import bcrypt from 'bcryptjs'
import { useNavigate } from 'react-router-dom'

const Login = () => {

    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const navigate = useNavigate()

    const handleSubmit = async (e) => {
        e.preventDefault()
        const { data, error } = await supabase.from('authentication_table').select('*')
        .eq('email', email).single()

        if (error || !data) {
            alert('Invalid email or password')
            return
        }

        alert(`Welcome ${data.team_name}!`)
        localStorage.setItem('team_id', data.id)
        localStorage.setItem('team_name', data.team_name)

        navigate('/dashboard')
    }

  return (
    <div className='h-screen w-full bg-neutral-800 flex items-center justify-center'>
        <div className='h-auto w-[400px] bg-neutral-700 rounded'>
            <div className='p-5'>
                <div className='text-3xl text-white'>
                    IEEE CS
                </div>
                <form onSubmit={handleSubmit}>
                    <div className='pt-2 text-xl text-white'>
                        Leader's Mail
                    </div>
                    <input type="text" className='mt-2 p-3 w-full bg-neutral-600 rounded outline-0 text-white focus:shadow-xl transition duration-200' value={email}
                    onChange={(e) => {setEmail(e.target.value)}}/>
                    <div className='pt-2 text-xl text-white'>
                        Password
                    </div>
                    <input type="text" className='mt-2 p-3 w-full bg-neutral-600 rounded outline-0 text-white focus:shadow-xl transition duration-200' value={password} 
                    onChange={(e) => {setPassword(e.target.value)}}/>
                    <button type='submit' className='p-3 text-white w-full bg-green-400 hover:bg-green-500 active:bg-green-600
                    rounded mt-4 '>
                        Submit
                    </button>
                </form>
            </div>
        </div>
    </div>
  )
}

export default Login