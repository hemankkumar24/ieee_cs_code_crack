import React, { useEffect } from 'react'
import { useNavigate } from 'react-router-dom';
import { supabase } from '../supabaseClient';

const AddQuestions = () => {
    const navigate = useNavigate()

    const handleLogout = async () => {
        const { error } = await supabase.auth.signOut();

        if (error) {
            console.error('Error logging out:', error);
        } else {
            navigate('/ieeecstopadminlogin');
        }
    };

    useEffect(() => {
        const checkUser = async () => {
            const { data } = await supabase.auth.getUser()
            if (!data.user) {
                navigate('/') 
            }
        }

        checkUser()
    }, [navigate]) // check if admin account is actually logged in

  return (
    <div className='min-h-screen w-full bg-neutral-600 p-2'>
        <div className='w-full flex justify-between items-center'>
            <div className='text-3xl text-white pb-2'>
                IEEE CS
            </div>
            <div className='gap-5 flex items-center'>
                <div className='text-green-400 hover:text-green-500 active:text-green-600 cursor-pointer'
                onClick={() => {navigate('/addaccounts')}}>
                    Add Accounts
                </div>
                <div className='text-red-400 hover:text-red-500 active:text-red-600 cursor-pointer text-xl'
                onClick={handleLogout}>
                    Logout
                </div>
            </div>
        </div>
        <div className='bg-neutral-50 p-2'>
            <div className='text-2xl w-full border-b-2 pb-2'>
                CREATE QUESTIONS
            </div>
            <form>
                <div className='text-xl pt-2'>
                    QUESTION
                    <input type="text" className='w-full bg-neutral-200 p-1 outline-none' placeholder='QUESTION'/>
                </div>
                <div className='text-xl pt-2'>
                    BUGGY CODE IN C
                    <textarea
                        className='w-full bg-neutral-200 p-1 outline-none font-mono rounded'
                        placeholder='Write C code here...'
                        rows={6}
                    />
                </div>
                <div className='text-xl pt-2'>
                    BUGGY CODE IN CPP
                    <textarea
                        className='w-full bg-neutral-200 p-1 outline-none font-mono rounded'
                        placeholder='Write CPP code here...'
                        rows={6}
                    />
                </div>
                <div className='text-xl pt-2'>
                    BUGGY CODE IN JAVA
                    <textarea
                        className='w-full bg-neutral-200 p-1 outline-none font-mono rounded'
                        placeholder='Write JAVA code here...'
                        rows={6}
                    />
                </div>
                <div className='text-xl pt-2'>
                    BUGGY CODE IN PYTHON
                    <textarea
                        className='w-full bg-neutral-200 p-1 outline-none font-mono rounded'
                        placeholder='Write PYTHON code here...'
                        rows={6}
                    />
                </div>
                <button type="submit" className='w-full text-xl p-1 bg-green-400 mt-3 rounded cursor-pointer hover:bg-green-500 active:hover:bg-green-600'>
                    Submit
                </button>
            </form>
        </div>
    </div>
  )
}

export default AddQuestions