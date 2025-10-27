import React, { useEffect, useState } from 'react'
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
                navigate('/ieeecstopadminlogin') 
            }
        }

        checkUser()
    }, [navigate]) // check if admin account is actually logged in

    
    const [questionDataRoundOne, setQuestionDataRoundOne] = useState([])

    useEffect(() => {
        const getUserData = async () => {
            const { data, error } = await supabase.from('questions_round_1').select('*')
            .order('id', { ascending: true });
            if (error) {
                console.error('Error fetching data:', error);
                return [];
            }

            setQuestionDataRoundOne(data);
        }

        getUserData();
    },[])

    const [question, setQuestion] = useState('')
    const [buggyCodeC, setBuggyCodeC] = useState('')
    const [buggyCodeCpp, setBuggyCodeCPP] = useState('')
    const [buggyCodeJava, setBuggyCodeJava] = useState('')
    const [buggyCodePython, setBuggyCodePython] = useState('')
    const [testCase, setTestCase] = useState('')
    const [solutionExpected, setSolutionExpected] = useState('')

    const handleSubmit = async (e) => {
        e.preventDefault();

        const { data, error } = await supabase.from('questions_round_1').insert([{
                    question: question,
                    buggy_code_c: buggyCodeC,
                    buggy_code_cpp: buggyCodeCpp,
                    buggy_code_java: buggyCodeJava,
                    buggy_code_python: buggyCodePython,
                    test_case: testCase,
                    solution_expected: solutionExpected
                }]).select();

        if (error) {
            console.error('Error creating question:', question)
            return null
        }

        alert(`Question ${question} Created`)

        setQuestionDataRoundOne((prev) => [...prev, ...data]);

        setQuestion('');
        setBuggyCodeC('');
        setBuggyCodeCPP('');
        setBuggyCodeJava('');
        setBuggyCodePython('');
        setTestCase('');
        setSolutionExpected('');
    }

    const handleDelete = async (questions) => {
        const confirmed = window.confirm(`Are you sure you want to delete the question: ${questions.question} ?`)
        if (!confirmed) return;
            const { data, error } = await supabase
                .from('questions_round_1')
                .delete()
                .eq('id', questions.id)   
    
        if (error) {
            console.error('Error deleting team:', error)
        }
        else {
            setQuestionDataRoundOne(prev => prev.filter(q => q.id !== questions.id));
        }
    }

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
            <form onSubmit={handleSubmit}>
                <div className='text-xl pt-2'>
                    QUESTION
                    <input type="text" className='w-full bg-neutral-200 p-1 outline-none' placeholder='QUESTION' value={question} onChange={(e) => {setQuestion(e.target.value)}}/>
                </div>
                <div className='text-xl pt-2'>
                    BUGGY CODE IN C
                    <textarea
                        className='w-full bg-neutral-200 p-1 outline-none font-mono rounded'
                        placeholder='Write C code here...'
                        rows={6}
                        value={buggyCodeC}
                        onChange={(e) => {setBuggyCodeC(e.target.value)}}
                    />
                </div>
                <div className='text-xl pt-2'>
                    BUGGY CODE IN CPP
                    <textarea
                        className='w-full bg-neutral-200 p-1 outline-none font-mono rounded'
                        placeholder='Write CPP code here...'
                        rows={6}
                        value={buggyCodeCpp}
                        onChange={(e) => {setBuggyCodeCPP(e.target.value)}}
                    />
                </div>
                <div className='text-xl pt-2'>
                    BUGGY CODE IN JAVA
                    <textarea
                        className='w-full bg-neutral-200 p-1 outline-none font-mono rounded'
                        placeholder='Write JAVA code here...'
                        rows={6}
                        value={buggyCodeJava}
                        onChange={(e) => {setBuggyCodeJava(e.target.value)}}
                    />
                </div>
                <div className='text-xl pt-2'>
                    BUGGY CODE IN PYTHON
                    <textarea
                        className='w-full bg-neutral-200 p-1 outline-none font-mono rounded'
                        placeholder='Write PYTHON code here...'
                        rows={6}
                        value={buggyCodePython}
                        onChange={(e) => {setBuggyCodePython(e.target.value)}}
                    />
                </div>
                <div className='text-xl pt-2'>
                    TEST CASE
                    <textarea
                        className='w-full bg-neutral-200 p-1 outline-none font-mono rounded'
                        placeholder='Write PYTHON code here...'
                        rows={6}
                        value={testCase}
                        onChange={(e) => {setTestCase(e.target.value)}}
                    />
                </div>
                <div className='text-xl pt-2'>
                    SOLUTION EXPECTED
                    <textarea
                        className='w-full bg-neutral-200 p-1 outline-none font-mono rounded'
                        placeholder='Write PYTHON code here...'
                        rows={6}
                        value={solutionExpected}
                        onChange={(e) => {setSolutionExpected(e.target.value)}}
                    />
                </div>
                <button type="submit" className='w-full text-xl p-1 bg-green-400 mt-3 rounded cursor-pointer hover:bg-green-500 active:hover:bg-green-600'>
                    Submit
                </button>
            </form>
        </div>
        <div>
            {questionDataRoundOne && questionDataRoundOne.length > 0
                    ?
                    (
                        questionDataRoundOne.map((questions, index) => (
                            <div key={questions.id} className='p-2 text-black bg-green-200 mt-2 rounded'>
                                <div className='w-full flex justify-between items-center'>
                                    <div>
                                        <h1 className='text-2xl'>
                                            Question {index + 1}: {questions.question}
                                        </h1>
                                        <br />
                                        <div>
                                            <h2>Buggy Code (C):</h2>
                                            <pre className="bg-green-100 p-2 rounded"><code>{questions.buggy_code_c}</code></pre>
                                        </div>

                                        <div>
                                            <h2>Buggy Code (C++):</h2>
                                            <pre className="bg-green-100 p-2 rounded"><code>{questions.buggy_code_cpp}</code></pre>
                                        </div>

                                        <div>
                                            <h2>Buggy Code (Java):</h2>
                                            <pre className="bg-green-100 p-2 rounded"><code>{questions.buggy_code_java}</code></pre>
                                        </div>

                                        <div>
                                            <h2>Buggy Code (Python):</h2>
                                            <pre className="bg-green-100 p-2 rounded"><code>{questions.buggy_code_python}</code></pre>
                                        </div>

                                        <div>
                                            <h2>Test Case</h2>
                                            <pre className="bg-green-100 p-2 rounded"><code>{questions.test_case}</code></pre>
                                        </div>

                                        <div>
                                            <h2>Solution Expected</h2>
                                            <pre className="bg-green-100 p-2 rounded"><code>{questions.solution_expected}</code></pre>
                                        </div>

                                        <div className='my-2 text-xl text-red-500 cursor-pointer hover:text-red-600' onClick={() => {handleDelete(questions)}}>
                                            Delete Question
                                        </div>
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

export default AddQuestions