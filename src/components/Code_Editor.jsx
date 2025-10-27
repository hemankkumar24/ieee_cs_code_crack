import { Editor } from '@monaco-editor/react'
import React, { useEffect, useImperativeHandle, useRef, useState } from 'react'

const Code_Editor = ( {recieve_error, recieve_output, ref, questions, selectedQuestionId, selectedOption}) => {
  const version_list = {'python': '3.10.0', 'java': '15.0.2', 'c': '10.2.0', 'cpp': '10.2.0'}
  const options_suffix = {'python': 'py', 'java': 'java', 'c': 'c', 'cpp': 'cpp'}
  const [currentCode, setCurrentCode] = useState('')
  const [currentOutput, setCurrentOutput] = useState('')
  const [currentError, setCurrentError] = useState('')
    // the whole purpose behind this is to focus 
    // the editor when the website loads
    const editorRef = useRef(null); // this one is for focusing
    // the other ref is for using the execute code function on parent class 

    const onMount = (editor) => {
        editorRef.current = editor;
        editor.focus();
    };

    // get the the selected question
    const selectedQuestion = questions.find(q => q.id == selectedQuestionId)
    // get the language to currently show the buggy code in
    const buggy_code = 'buggy_code_' + selectedOption.toLowerCase()
    // show the code appropriately
    const code = selectedQuestion ? selectedQuestion[buggy_code] : ''


    useEffect(() => {
      setCurrentCode(code) // to set code
    }, [code])

    const executeCode = async () => {
    const response = await fetch("https://emkc.org/api/v2/piston/execute", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
            },
        body: JSON.stringify({
            language: selectedOption.toLowerCase() == 'cpp' ? 'c++' : selectedOption.toLowerCase(),
            version: version_list[selectedOption.toLowerCase()],
            files: [
                    {
                        name: `main.${options_suffix[selectedOption.toLowerCase()]}`,
                        content: currentCode
                    }
                ],
              "stdin": questions.find(q => q.id == selectedQuestionId)['test_case']
        })
    });
    
        const data = await response.json();
        if (data.run.stderr && data.run.stderr.trim() !== "") {
            recieve_error(data.run.stderr);
            recieve_output(""); 
        } else {
            recieve_output(data.run.stdout);
            recieve_error("");
        }
    };

  useImperativeHandle(ref, () => ({
    executeCode
  }))

  return (
    <div className='h-full w-full'>
        <Editor 
        height="100%" 
        width="100%"
        theme="vs-dark" 
        language={selectedOption.toLowerCase()} 
        value={code}
        onChange={(value) => {setCurrentCode(value)}} 
        onMount={onMount}
        />
    </div>
  )
}

export default Code_Editor