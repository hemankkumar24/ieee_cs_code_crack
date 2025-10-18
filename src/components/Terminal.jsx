import React from 'react'

const Terminal = ({ currentError, currentOutput, questions, selectedQuestionId }) => {
    const currentQuestion  = questions.find(q => q.id == selectedQuestionId);
    const currentAnswer = currentQuestion ? currentQuestion.solution_expected : null;
    const cleanOutput = currentOutput ? currentOutput.replace(/\r?\n/g, "") : "";
    const cleanAnswer = currentAnswer ? currentAnswer.replace(/\r?\n/g, "") : "";
    console.log('Current Output:', JSON.stringify(cleanOutput));
    console.log('Expected Answer:', JSON.stringify(cleanAnswer));

    let displayText = '';

    if (cleanOutput == "") {
        displayText = 'Code Yet to be Run';
    }
    else if (cleanOutput == cleanAnswer) {
        displayText = 'Correct Answer';
    } 
    else if (cleanOutput != cleanAnswer) {
        displayText = 'Wrong Answer';
    }
    if (currentError && currentError.trim() !== "") {
        displayText = currentError;
    } 
    

  return (
    <div className='min-h-full bg-neutral-800 border-t-2 border-neutral-600 p-2 overflow-auto'>
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