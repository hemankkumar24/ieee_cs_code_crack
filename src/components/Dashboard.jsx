import React, { useEffect, useRef, useState } from 'react'
import Code_Editor from './Code_Editor'
import { supabase } from '../supabaseClient';
import Terminal from './Terminal';
import { useNavigate } from 'react-router-dom'

const Dash = () => {
    const navigate = useNavigate()

    {/* Idhar se checking about team auth and score tracking ke liye row creation */}
    const teamName = localStorage.getItem('team_name')
    useEffect(() => { // this is to check if the team is logged in
        const verifyTeam = async () => {
            const teamId = localStorage.getItem('team_id')

            if (!teamId || !teamName) {
                navigate('/');
                return;
            }

            const { data, error } = await supabase.from('scores_round_1').select('*').eq('team_id', teamId)
            .maybeSingle() // check if a row for the team exists

            if(error) {
                return;
            }

            if(!data) { // if not create a new one!
                const {data: insertData, error: insertError} = await supabase.from('scores_round_1').insert
                ([
                    {
                        team_id: teamId,
                        team_name: teamName,
                        total_score: 0
                    }
                ]).select().single()
            }
        }

        verifyTeam()

    }, [navigate])


    {/* Handling Dashboard Things here */}
    const options = ['Python', 'CPP', 'C', 'Java'];
    const [questions, setQuestions] = useState([])
    const [selectedQuestionId, setSelectedQuestionId] = useState('1')
    const editorRef = useRef();

    const handleQuestionChange = (e) => {
        setSelectedQuestionId(e.target.value)
    }
    
    const [selectedOption, setSelectedOption] = useState('Python')

    useEffect(() => {
    const load_questions = async ()  => {
        const { data, error } = await supabase.from('questions_round_1').select('*')
        if (error) console.error('Error:', error)
        else setQuestions(data)
    }
    load_questions()
    }, [])

    const [currentOutput, setCurrentOutput] = useState('')
    const recieve_output = (value) => {
        setCurrentOutput(value);
    }

    const [currentError, setCurrentError] = useState('')
    const recieve_error = (value) => {
        setCurrentError(value);
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
                        <select className='bg-neutral-800'
                        value={selectedQuestionId}
                        onChange={handleQuestionChange}>
                            {
                            questions.map((item) => (
                                <option key={item.id} value={item.id}>
                                {'Question ' + item.id} {/* Choose question number here */}
                                </option>
                            ))
                            }
                        </select>
                    </div>
                    <select value={selectedOption} onChange={(e) => {setSelectedOption(e.target.value);}}
                    className='border-0 cursor-pointer p-1 bg-neutral-800 outline-0'> {/* Select Language Idhar */}
                        {
                        options.map((option, index) => ( // idhar mapping all the options
                        <option key={index} value={option}> {/* THIS IS FOR LANGUAGE */}
                            {option}
                        </option>
                        ))
                        }
                    </select>
                    <div className='cursor-pointer' onClick={() => editorRef.current.executeCode()}>
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
            <Terminal currentError={currentError} currentOutput={currentOutput} questions={questions} selectedQuestionId={selectedQuestionId}/>
            </div>
        </div>
    </div>
  )
}

export default Dash