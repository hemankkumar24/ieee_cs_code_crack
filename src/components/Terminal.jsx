import React from 'react'

const Terminal = ({ currentError, currentOutput, questions, selectedQuestionId }) => {
    const currentQuestion  = questions.find(q => q.id == selectedQuestionId);
    const currentAnswer = currentQuestion ? currentQuestion.solution_expected : null;
    const cleanOutput = currentOutput.replace(/\r?\n$/, "");
    const cleanAnswer = currentAnswer ? currentAnswer.replace(/\r?\n$/, "") : "";
    console.log('Current Output:', JSON.stringify(cleanOutput));
    console.log('Expected Answer:', JSON.stringify(cleanAnswer));

    let displayText = '';

    if (currentError && currentError.trim() !== "") {
        displayText = currentError; // show error if exists
    } else if (cleanOutput == "") {
        displayText = 'Code Yet to be Run'; // nothing executed yet
    } else if (cleanOutput == cleanAnswer) {
        displayText = 'Correct Answer'; // output matches expected
    } else {
        displayText = 'Wrong Answer'; // output does not match
    }

  return (
    <div className='min-h-full bg-neutral-800 border-t-2 border-neutral-600'>
        <div className='text-white'>
            {displayText}
        </div>
    </div>
  )
}

export default Terminal