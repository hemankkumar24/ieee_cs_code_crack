import { Editor } from '@monaco-editor/react'
import React, { useEffect, useRef, useState } from 'react'

const Code_Editor = () => {
    const [selectedOption, setSelectedOption] = useState('Python');
    const options = ['Python', 'CPP', 'C', 'Java'];
    const options_suffix = {'python': 'py', 'java': 'java', 'c': 'c', 'cpp': 'cpp'}
    const version_list = {'python': '3.10.0', 'java': '15.0.2', 'c': '10.2.0', 'cpp': '10.2.0'}
    const [currentScore, setCurrentScore] = useState(0)

    const [currentCode, setCurrentCode] = useState('') // get the current code in this state
    const editorRef = useRef() // the ref to the editor 
    const onMount = (editor) => {
        editorRef.current = editor;
        editor.focus(); // basically this just focuses it when its mounted!
    }

    const DIFFERENT_QUESTIONS = {
        'java' : `public class Main {\n    public static void main(String[] args) {\n        // Write your Java code here to print 5\n    }\n}\n`,
        'cpp' : `#include <iostream>\nusing namespace std;\n\nint main() {\n    // Write your cpp code here to print 5\n    return 0;\n}\n`,
        'c' : `#include <stdio.h>\n\nint main() {\n    // Write your c code here to print 5\n    return 0;\n}\n`,
        'python' : `print("Hello, World!")\n\n# Write your python code here to print 5\n`,
    }

    const onChangeCode = (e) => {
        e.preventDefault();
        setSelectedOption(e.target.value);
        setCurrentCode(DIFFERENT_QUESTIONS[(e.target.value).toLowerCase()]);
    }  

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
            })
        });

        const data = await response.json();
        console.log(data.run.stdout);

        if(data.run.stdout == 5)
        {
            setCurrentScore('100%')
        }
        };


  return (
    <div className='h-screen w-full flex flex-col'>
        <div className='w-full flex justify-between items-center'>
            <div className='p-2'>
                <select value={selectedOption} onChange={(e) => {onChangeCode(e);}}
                className='border-2 p-1 border-neutral-500'> {/* Select Language Idhar */}

                    {options.map((option, index) => ( // idhar mapping all the options
                    <option key={index} value={option}>
                        {option}
                    </option>
                    ))}
                </select>
            </div>
            <div>
                <div className='pr-5 cursor-pointer' onClick={executeCode}>
                    RUN
                </div>
            </div>
        </div>
        <div className='p-2'>
            Current Score: {currentScore}
        </div>
        <div className='flex justify-between h-full'>
            <div className='w-1/2 p-5'>
                Write a program to print 5 
            </div>
            <div className='w-1/2'>
                <Editor 
                height="100%" 
                width="100%"
                theme="vs-dark" 
                language={selectedOption.toLowerCase()} 
                value={currentCode}
                onChange={(value) => {setCurrentCode(value)}} // idhar abhi print hai!
                onMount={onMount}
                />
            </div>
        </div>
    </div>
  )
}

export default Code_Editor