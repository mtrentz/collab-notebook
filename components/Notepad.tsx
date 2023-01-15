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
        <div>
            {/*  Large text area thats writable */}
            <textarea
                className={`w-full h-full p-4 text-2xl font-mono bg-gray-100 rounded-lg resize-none ${className}`}
                value={textState}
                readOnly={!editable}
                onChange={(e) => setTextState(e.target.value)}
            />

            {/*  Save button */}
            <button
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
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