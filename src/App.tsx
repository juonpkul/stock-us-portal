import { useState } from 'react'
import games from './data/games.json'

const LS_PLAYER_NAME = 'portal_player_name'

interface Game {
  name: string
  description: string
  icon: string
  url: string
  comingSoon: boolean
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
              key={game.url}
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
