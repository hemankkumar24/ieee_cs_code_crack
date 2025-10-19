import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../supabaseClient'
import bcrypt from 'bcryptjs';

const AdminDashboard = () => {
    const navigate = useNavigate()

    const handleLogout = async () => {
        const { error } = await supabase.auth.signOut();

        if (error) {
            console.error('Error logging out:', error);
        } else {
            navigate('/');
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

    const [teamData, setTeamData] = useState([])

    useEffect(() => {
        const getUserData = async () => {
            const { data, error } = await supabase.from('authentication_table').select('*');
            if (error) {
                console.error('Error fetching data:', error);
                return [];
            }

            setTeamData(data);
        }

        getUserData();
    },[])

    const [teamName, setTeamName] = useState('')
    const [password, setPassword] = useState('')
    const [leaderMail, setLeaderMail] = useState('')

    const hashPassword = async (plainPassword) => {
        const saltRounds = 10; 
        const hashedPassword = await bcrypt.hash(plainPassword, saltRounds);
        return hashedPassword;
    }

    const handleSubmit = async (e) => {
        e.preventDefault();

        const hashed_password = await hashPassword(password)

        const { data, error } = await supabase.from('authentication_table').insert([{
            team_name: teamName,
            email: leaderMail,
            password: hashed_password,
        }]).select();

        if (error) {
            console.error('Error creating team:', error)
            return null
        }

        alert(`Team ${teamName} Created`)

        setLeaderMail('')
        setPassword('')
        setTeamName('')

        setTeamData(prev => [...prev, ...data])
    }

    const handleDelete = async (teamId) => {
        const confirmed = window.confirm(`Are you sure you want to delete ${teamName}?`);
        if (!confirmed) return;
        const { data, error } = await supabase
            .from('authentication_table')
            .delete()
            .eq('id', teamId)   

        if (error) {
            console.error('Error deleting team:', error)
        } else {
            setTeamData(prev => prev.filter(team => team.id !== teamId))
        }
    }

    return (
        <div className='min-h-screen w-full bg-neutral-600 p-2'>
            <div className='w-full flex justify-between items-center'>
                <div className='text-3xl text-white pb-2'>
                    IEEE CS
                </div>
                <div className='text-red-400 hover:text-red-500 active:text-red-600 cursor-pointer text-xl'
                 onClick={handleLogout}>
                    Logout
                </div>
            </div>
            <div className='bg-neutral-50 p-2'>
                <div className='text-2xl w-full border-b-2 pb-2'>
                    CREATE TEAMS
                </div>
                <form onSubmit={handleSubmit}>
                    <div className='text-xl pt-2'>
                        TEAM_NAME
                        <input type="text" className='w-full bg-neutral-200 p-1 outline-none' placeholder='team_name'
                         value={teamName} onChange={(e) => setTeamName(e.target.value)}/>
                    </div>
                    <div className='text-xl pt-2'>
                        LEADER'S EMAIL
                        <input type="text" className='w-full bg-neutral-200 p-1 outline-none' placeholder="leader's mail"
                         value={leaderMail} onChange={(e) => setLeaderMail(e.target.value)}/>
                    </div>
                    <div className='text-xl pt-2'>
                        PASSWORD
                        <input type="text" className='w-full bg-neutral-200 p-1 outline-none' placeholder='password'
                         value={password} onChange={(e) => setPassword(e.target.value)}/>
                    </div>
                    <button type="submit" className='w-full text-xl p-1 bg-green-400 mt-3 rounded cursor-pointer hover:bg-green-500 active:hover:bg-green-600'>
                        Submit
                    </button>  
                </form>
            </div>
            <div>
                {teamData && teamData.length > 0
                    ?
                    (
                        teamData.map((team) => (
                            <div key={team.id} className='p-2 text-black bg-green-200 mt-2 rounded'>
                                <div className='w-full flex justify-between items-center'>
                                    <div>
                                        <h1 className='text-2xl'>
                                            TEAM NAME: {team.team_name}
                                        </h1>
                                        <div>
                                            Leader's Mail: {team.email}
                                        </div>
                                    </div>
                                    <div className='text-red-400 hover:text-red-500 active:text-red-600 cursor-pointer'
                                     onClick={() => {handleDelete(team.id)}}>
                                        Delete Team
                                    </div>
                                </div>
                            </div>
                        ))
                    )
                    :
                    (
                        <h1 className='text-white text-xl pt-2'>Add Teams and they will show here</h1>
                    )
                }
                
            </div>
        </div>
    )
}

export default AdminDashboard