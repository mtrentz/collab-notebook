import React, { useEffect, useState } from 'react'

interface NotepadProps {
    id: string
    text: string
    saveText: (text: string, id: string) => void
    editable?: boolean
    className?: string
}

const Notepad = ({ id, text, saveText, className, editable }: NotepadProps) => {

    const [textState, setTextState] = useState(text)

    useEffect(() => {
        setTextState(text)
    }, [text])

    return (
        <div className="flex flex-col h-full">
            {/*  Large text area thats writable */}
            <textarea
                className={`flex-grow m-2 p-4 text-2xl font-mono bg-white rounded-lg resize-none focus:outline-0 ${className}`}
                value={textState}
                readOnly={!editable}
                onChange={(e) => setTextState(e.target.value)}
            />

            {/* <div className="bg-red-300 flex-grow m-10"> yo</div> */}

            {/*  Save button */}
            <button
                className="bg-blue-500 hover:bg-blue-700 my-2 w-64 h-12 self-center text-white font-bold py-2 px-4 rounded"
                onClick={() => saveText(textState, id)}
                // Disable if not editable
                disabled={!editable}
            >
                Save
            </button>
        </div>

    )
}

export default Notepad