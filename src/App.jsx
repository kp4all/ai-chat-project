
import React, { useState } from 'react'
import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({
  apiKey: import.meta.env.VITE_GEMINI_API_KEY,
});

const App = () => {

  const [userInput, setUserInput] = useState('')
  const [messages, setMessages] = useState([])
  const [loading, setLoading] = useState(false)
  const [darkMode, setDarkMode] = useState(true)

  async function askGemeni() {

    if (!userInput.trim()) return

    const question = userInput

    setMessages([...messages, {
      user: question
    }])

    setUserInput('')
    setLoading(true)

    try {

      const result = await ai.models.generateContent({
        model: "gemini-3.1-flash-lite",
        contents: question
      })

      setMessages([...messages, {
        user: question,
        ai: result.text
      }])

    } catch (error) {

      console.log(error)

      setMessages([...messages, {
        user: question,
        ai: 'Something went wrong.'
      }])

    }

    setLoading(false)
  }


  function newChat() {
    setMessages([])
    setUserInput('')
  }


  return (

    <div className={
      darkMode
        ? "flex h-screen bg-zinc-950 text-white"
        : "flex h-screen bg-white text-black"
    }>

      {/* Sidebar */}

      <div className={
        darkMode
          ? "w-64 bg-zinc-900 border-r border-zinc-800 p-4"
          : "w-64 bg-zinc-100 border-r border-zinc-200 p-4"
      }>

        <button
          onClick={newChat}
          className={
            darkMode
              ? "w-full bg-white text-black py-2 rounded-lg"
              : "w-full bg-black text-white py-2 rounded-lg"
          }
        >
          + New Chat
        </button>

        <p className="mt-6 text-sm text-zinc-500">
          Chat
        </p>

        {messages.length > 0 && (

          <div className={
            darkMode
              ? "mt-3 bg-zinc-800 p-3 rounded-lg text-sm"
              : "mt-3 bg-white p-3 rounded-lg text-sm border"
          }>
            {messages[0].user}
          </div>

        )}

        <button
          onClick={() => setDarkMode(!darkMode)}
          className={
            darkMode
              ? "absolute bottom-5 bg-zinc-800 px-4 py-2 rounded-lg"
              : "absolute bottom-5 bg-white border px-4 py-2 rounded-lg"
          }
        >
          {darkMode ? "☀ Light Mode" : "☾ Dark Mode"}
        </button>

      </div>


      {/* Main */}

      <div className="flex-1 flex flex-col">


        {/* Messages */}

        <div className="flex-1 overflow-y-auto px-6 py-10">

          <div className="max-w-3xl mx-auto">

            {messages.length === 0 && (

              <div className="text-center text-zinc-500 mt-40 text-xl">
                What can I help you with?
              </div>

            )}


            {messages.map((message, index) => (

              <div key={index} className="mb-8">

                {/* User */}

                <div className="flex justify-end">

                  <div className={
                    darkMode
                      ? "bg-zinc-800 px-4 py-3 rounded-2xl max-w-[75%]"
                      : "bg-zinc-100 px-4 py-3 rounded-2xl max-w-[75%]"
                  }>
                    {message.user}
                  </div>

                </div>


                {/* AI */}

                {message.ai && (

                  <div className="mt-4">

                    <p className="text-sm text-zinc-500 mb-2">
                      Gemini
                    </p>

                    <p className="leading-7 whitespace-pre-wrap">
                      {message.ai}
                    </p>

                  </div>

                )}

              </div>

            ))}


            {loading && (

              <p className="text-zinc-500">
                Gemini is thinking...
              </p>

            )}

          </div>

        </div>


        {/* Input */}

        <div className="p-5">

          <div className="max-w-3xl mx-auto">

            <div className={
              darkMode
                ? "bg-zinc-800 border border-zinc-700 rounded-2xl px-4 py-2 flex gap-3"
                : "bg-zinc-100 border border-zinc-200 rounded-2xl px-4 py-2 flex gap-3"
            }>

              <input
                className="flex-1 bg-transparent outline-none py-2"
                type="text"
                placeholder="Ask me anything..."
                value={userInput}
                onChange={(e) => setUserInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    askGemeni()
                  }
                }}
              />

              <button
                onClick={askGemeni}
                disabled={loading}
                className={
                  darkMode
                    ? "bg-white text-black px-4 py-2 rounded-xl"
                    : "bg-black text-white px-4 py-2 rounded-xl"
                }
              >
                {loading ? "..." : "Ask"}
              </button>

            </div>

            <p className="text-center text-xs text-zinc-500 mt-2">
              AI can make mistakes. Check important information.
            </p>

          </div>

        </div>

      </div>

    </div>
  )
}

export default App
