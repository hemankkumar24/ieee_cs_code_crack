import React, { useEffect, useState } from 'react'
import { supabase } from '../supabaseClient';

const Terminal = ({ currentError, currentOutput, questions, selectedQuestionId, incrementScore, executionCount }) => {
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
                const { data, error } = await supabase.from('submissions_round_1').select('*').eq('team_id', teamId)
                .eq('question_id', parseInt(selectedQuestionId)).maybeSingle(); // check if a submission for that question already exists
        
                if(!data) // if it does NOT
                {
                    const {error: insertError} = await supabase.from('submissions_round_1').insert([{team_id: teamId, question_id: parseInt(selectedQuestionId), is_correct: true}])
                    // make a submission row marking it correct

                    const {data: scoreData, error: scoreError} = await supabase.from('scores_round_1').select('total_score').eq('team_id', teamId).maybeSingle();
                    // get the current score for the team 
                    const current_score = scoreData ? scoreData.total_score : 0;
                    
                    // and update it by incrementing it by 10
                    const {error: scoreUpdateError} = await supabase.from('scores_round_1').update({'total_score': current_score + 10}).eq('team_id', teamId);

                    // this function will visually update it in our dashboard
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