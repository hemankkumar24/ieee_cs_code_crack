import React, { useEffect, useRef, useState } from 'react'
import Code_Editor from './Code_Editor'
import { supabase } from '../supabaseClient';
import Terminal from './Terminal';
import { useNavigate } from 'react-router-dom'
import axios from 'axios';

const Dash = () => {
    const backendUrl = import.meta.env.VITE_BACKEND_URL;
    const navigate = useNavigate()
    const [teamData, setTeamData] = useState({ total_score: 0 })
    const [executionCount, setExecutionCount] = useState(0);
    const [loading, setLoading] = useState(true)
    const [overlay, setOverlay] = useState(false)
    const [leaderboardData, setLeaderboardData] = useState([]);

    const incrementScore = (points) => {
        setTeamData(prev => ({ ...prev, total_score: prev.total_score + points }));
    };

    {/* Idhar se checking about team auth and score tracking ke liye row creation */ }
    const teamName = localStorage.getItem('team_name')
    useEffect(() => { // this is to check if the team is logged in

        const verifyTeam = async () => {
            const teamId = localStorage.getItem('team_id')
            const teamName = localStorage.getItem('team_name');

            if (!teamId || !teamName) {
                navigate('/');
                setLoading(false);
                return;
            }

            try // this is to create a new row if the team has never logged in
            {
                const res = await axios.get(`${backendUrl}/api/scores/${teamId}`, {
                    params: { teamName } 
                });

                setTeamData(res.data); 
            } 
            catch (err) 
            {
                console.error('Axios error:', err.response?.data || err.message);
            } 
            finally 
            {
                setLoading(false);
            }
        }

        verifyTeam()

    }, [navigate, teamName])


    {/* Handling Dashboard Things here */ }
    const options = ['Python', 'CPP', 'C', 'Java'];
    const [questions, setQuestions] = useState([])
    const [selectedQuestionId, setSelectedQuestionId] = useState('1')
    const editorRef = useRef();

    const handleQuestionChange = (e) => {
        setSelectedQuestionId(e.target.value)
    }

    const [selectedOption, setSelectedOption] = useState('Python')

    useEffect(() => {

        const fetchQuestions = async () => {
            try {
                const res = await axios.get(`${backendUrl}/api/questions/get_questions_1`);
                setQuestions(res.data); 
            } catch (err) {
                console.error('Axios error:', err.response?.data || err.message);
            }
        };

        fetchQuestions();

    }, [])

    const [currentOutput, setCurrentOutput] = useState('')
    const recieve_output = (value) => {
        setCurrentOutput(value);
    }

    const [currentError, setCurrentError] = useState('')
    const recieve_error = (value) => {
        setCurrentError(value);
    }

    const toggleOverlay = async () => {
        setOverlay(prev => !prev);
        if (!overlay) {
            try {
                const res = await axios.get(`${backendUrl}/api/leaderboard/get_leaderboard_1`);
                setLeaderboardData(res.data); 
            } catch (err) {
                console.error('Axios error:', err.response?.data || err.message);
            }
        }
    }


    if (loading) {
        return <div className='h-screen w-full flex items-center justify-center bg-neutral-800 text-white text-3xl'>Loading Dashboard...</div>
    }

    return (
        <div className='flex justify-between h-screen w-full overflow-y-hidden overflow-x-auto'>
            <div className='w-1/2'>
                <div className='flex justify-between items-center p-3 bg-neutral-800'>
                    <div className='text-2xl text-neutral-50'>
                        TEAM {teamName}
                    </div>
                    <div className='flex gap-3 text-neutral-50 items-center'>
                        <div>
                            Score {teamData ? teamData.total_score : 0}
                        </div>
                        <div>
                            <select className='bg-neutral-800'
                                value={selectedQuestionId}
                                onChange={handleQuestionChange}>
                                {
                                    questions.map((item, index) => (
                                        <option key={item.id} value={item.id}>
                                            {'Question ' + (index + 1)} {/* Choose question number here */}
                                        </option>
                                    ))
                                }
                            </select>
                        </div>
                        <select value={selectedOption} onChange={(e) => { setSelectedOption(e.target.value); }}
                            className='border-0 cursor-pointer p-1 bg-neutral-800 outline-0'> {/* Select Language Idhar */}
                            {
                                options.map((option, index) => ( // idhar mapping all the options
                                    <option key={index} value={option}> {/* THIS IS FOR LANGUAGE */}
                                        {option}
                                    </option>
                                ))
                            }
                        </select>
                        <div className='cursor-pointer' onClick={() => { editorRef.current.executeCode(); setExecutionCount(prev => prev + 1); }}>
                            Run
                        </div>
                    </div>
                </div>
                <div className='h-full bg-neutral-900'>
                    <div className='text-xl text-neutral-50 p-5'>
                        {
                            questions.find(q => q.id == selectedQuestionId)?.question || 'Select a question' // the actual question
                        }
                    </div>
                </div>
            </div>
            <div className='w-1/2 flex flex-col'>
                <div className='h-3/4'>
                    <Code_Editor recieve_error={recieve_error} recieve_output={recieve_output} ref={editorRef} questions={questions} selectedQuestionId={selectedQuestionId} selectedOption={selectedOption} />
                </div>
                <div className='h-1/4'>
                    <Terminal currentError={currentError} currentOutput={currentOutput} questions={questions} selectedQuestionId={selectedQuestionId} incrementScore={incrementScore} executionCount={executionCount} />
                </div>
            </div>
            <div className='absolute m-2 bottom-0 left-0 w-50 h-10 bg-neutral-700 rounded text-xl text-white flex justify-center items-center cursor-pointer hover:bg-neutral-800' onClick={toggleOverlay}>
                Leaderboard
            </div>
            {overlay && (
                <div className='absolute bottom-11 rounded p-4 text-white m-2 w-96 bg-neutral-700'>
                    <div className='text-xl mb-2 font-bold'>
                        Leaderboard
                    </div>
                    <div className='overflow-y-auto max-h-64'>
                        <table className='w-full text-left border-collapse'>
                            <thead>
                                <tr className='border-b border-neutral-500'>
                                    <th className='py-1 px-2'>Sr</th>
                                    <th className='py-1 px-2'>Team</th>
                                    <th className='py-1 px-2'>Score</th>
                                </tr>
                            </thead>
                            <tbody>
                                {leaderboardData.map((team, index) => (
                                    <tr key={team.team_id} className='border-b border-neutral-600 hover:bg-neutral-600'>
                                        <td className='py-1 px-2'>{index + 1}</td>
                                        <td className='py-1 px-2'>{team.team_name}</td>
                                        <td className='py-1 px-2'>{team.total_score}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
        </div>
    )
}

export default Dash