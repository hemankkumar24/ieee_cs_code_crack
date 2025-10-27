import React, { useEffect, useState } from 'react'
import { supabase } from '../supabaseClient';
import axios from 'axios';

const Terminal = ({ currentError, currentOutput, questions, selectedQuestionId, incrementScore, executionCount }) => {
    const backendUrl = import.meta.env.VITE_BACKEND_URL;
    const [displayText, setDisplayText] = useState('');
    const teamId = localStorage.getItem('team_id')
    useEffect(() => {
        const currentQuestion = questions.find(q => q.id == selectedQuestionId);
        const currentAnswer = currentQuestion ? currentQuestion.solution_expected : null;

        const cleanOutput = currentOutput ? currentOutput.replace(/\r?\n/g, "") : "";
        const cleanAnswer = currentAnswer ? currentAnswer.replace(/\r?\n/g, "") : "";

        console.log('Current Output:', JSON.stringify(cleanOutput));
        console.log('Expected Answer:', JSON.stringify(cleanAnswer));

        let text = '';

        const terminalDataUpdate = async () => {

            setDisplayText(''); // set it to nothing before showing new

            if (cleanOutput === "") {
                text = ''; // show no output when the program hasnt been run yet
            } else if (cleanOutput === cleanAnswer) {
                text = 'Correct Answer'; // if the output is correct

                const res = await axios.post(`${backendUrl}/api/submissions/submit`, {
                    teamId,
                    questionId: selectedQuestionId,
                    isCorrect: true
                }); 
                
                if (res.data.success && !res.data.alreadySubmitted) {
                    incrementScore(10);
                }

            } else {
                text = 'Wrong Answer';
            }

            if (currentError && currentError.trim() !== "") {
            text = currentError;
            }

            setDisplayText(prevText => prevText + ' \n ' + text);
        }

        terminalDataUpdate();

    }, [currentOutput, currentError, questions, selectedQuestionId, executionCount]);
    

  return (
    <div className='h-full bg-neutral-800 border-t-2 border-neutral-600 p-2 overflow-auto'>
        <div className='text-neutral-400'>
            TERMINAL:
        </div>
        <div className='text-white code text-lg'>
            {displayText}
        </div>
    </div>
  )
}

export default Terminal