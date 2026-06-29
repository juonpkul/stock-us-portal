import { useState } from 'react'
import games from './data/games.json'

const LS_PLAYER_NAME = 'portal_player_name'

interface Game {
  name: string
  description: string
  icon: string
  url: string
  comingSoon: boolean
  ideaBy?: { name: string; avatar: string }
}

const gameList = games as Game[]

export default function App() {
  const [name, setName] = useState(() => localStorage.getItem(LS_PLAYER_NAME) ?? '')

  const handleNameChange = (value: string) => {
    setName(value)
    if (value.trim()) {
      localStorage.setItem(LS_PLAYER_NAME, value.trim())
    } else {
      localStorage.removeItem(LS_PLAYER_NAME)
    }
  }

  const handleEnterGame = (url: string) => {
    if (!name.trim()) return
    localStorage.setItem(LS_PLAYER_NAME, name.trim())
    const target = new URL(url)
    target.searchParams.set('player', name.trim())
    window.open(target.toString(), '_blank', 'noopener,noreferrer')
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900">
      {/* Header */}
      <header className="pt-12 pb-6 text-center px-4">
        <div className="text-5xl mb-3">🌐</div>
        <h1 className="text-4xl font-extrabold text-white tracking-tight">Stock Universe</h1>
        <p className="text-indigo-300 mt-2 text-base">เลือกเกมที่ต้องการเล่น</p>
      </header>

      {/* Name input */}
      <div className="flex justify-center px-4 mb-10">
        <div className="w-full max-w-sm">
          <label className="block text-indigo-200 text-sm font-semibold mb-2">
            ชื่อผู้เล่น
          </label>
          <input
            className="w-full bg-white/10 border border-indigo-400/40 rounded-xl px-4 py-3 text-white text-base placeholder-indigo-300/50 focus:outline-none focus:border-indigo-400 focus:bg-white/15 transition"
            placeholder="ระบุชื่อผู้เล่น..."
            value={name}
            maxLength={30}
            onChange={(e) => handleNameChange(e.target.value)}
          />
          {!name.trim() && (
            <p className="text-indigo-400/70 text-xs mt-2 text-center">
              กรอกชื่อเพื่อเริ่มเล่นเกม
            </p>
          )}
        </div>
      </div>

      {/* Game cards */}
      <main className="px-4 pb-16">
        <div className="max-w-3xl mx-auto grid grid-cols-1 sm:grid-cols-2 gap-5">
          {gameList.map((game) => (
            <div
              key={game.name}
              className={`border rounded-2xl p-6 flex flex-col gap-3 transition ${
                game.comingSoon
                  ? 'bg-white/[0.03] border-white/5 opacity-60'
                  : 'bg-white/5 border-white/10 hover:bg-white/10 hover:border-indigo-400/40'
              }`}
            >
              <div className="flex items-start justify-between">
                <div className="text-4xl">{game.icon}</div>
                {game.comingSoon && (
                  <span className="text-xs font-semibold bg-white/10 text-indigo-300 px-2.5 py-1 rounded-full">
                    เร็วๆ นี้
                  </span>
                )}
              </div>
              <div>
                <h2 className="text-white font-bold text-lg">{game.name}</h2>
                <p className="text-indigo-300/80 text-sm mt-1">{game.description}</p>
              </div>
              {game.ideaBy && (
                <div className="flex items-center gap-2 pt-1">
                  <span className="text-indigo-400/60 text-xs">Idea by</span>
                  <svg className="w-4 h-4 flex-shrink-0" viewBox="0 0 127.14 96.36" fill="#5865F2" xmlns="http://www.w3.org/2000/svg">
                    <path d="M107.7,8.07A105.15,105.15,0,0,0,81.47,0a72.06,72.06,0,0,0-3.36,6.83A97.68,97.68,0,0,0,49,6.83,72.37,72.37,0,0,0,45.64,0,105.89,105.89,0,0,0,19.39,8.09C2.79,32.65-1.71,56.6.54,80.21h0A105.73,105.73,0,0,0,32.71,96.36,77.7,77.7,0,0,0,39.6,85.25a68.42,68.42,0,0,1-10.85-5.18c.91-.66,1.8-1.34,2.66-2a75.57,75.57,0,0,0,64.32,0c.87.71,1.76,1.39,2.66,2a68.68,68.68,0,0,1-10.87,5.19,77,77,0,0,0,6.89,11.1A105.25,105.25,0,0,0,126.6,80.22h0C129.24,52.84,122.09,29.11,107.7,8.07ZM42.45,65.69C36.18,65.69,31,60,31,53s5-12.74,11.43-12.74S54,46,53.89,53,48.84,65.69,42.45,65.69Zm42.24,0C78.41,65.69,73.25,60,73.25,53s5-12.74,11.44-12.74S96.23,46,96.12,53,91.08,65.69,84.69,65.69Z"/>
                  </svg>
                  <span className="text-indigo-300/80 text-xs font-medium">{game.ideaBy.name}</span>
                </div>
              )}
              <button
                disabled={!name.trim() || game.comingSoon}
                onClick={() => handleEnterGame(game.url)}
                className="mt-auto w-full bg-indigo-600 hover:bg-indigo-500 disabled:opacity-30 disabled:cursor-not-allowed text-white font-semibold py-2.5 rounded-xl transition text-sm"
              >
                {game.comingSoon ? 'เร็วๆ นี้' : 'เข้าเล่น →'}
              </button>
            </div>
          ))}
        </div>
      </main>
    </div>
  )
}
