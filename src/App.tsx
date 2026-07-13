import { useState } from 'react'
import games from './data/games.json'

const LS_PLAYER_NAME = 'portal_player_name'

interface Game {
  name: string
  ticker?: string
  description: string
  icon: string
  url: string
  comingSoon: boolean
  ideaBy?: { name: string; avatar: string }
}

const gameList = games as Game[]

const TAPE_ITEMS: Array<{ sym: string; chg: string; up: boolean }> = [
  { sym: 'AAPL', chg: '+1.24%', up: true },
  { sym: 'NVDA', chg: '+2.87%', up: true },
  { sym: 'TSLA', chg: '-0.93%', up: false },
  { sym: 'MSFT', chg: '+0.41%', up: true },
  { sym: 'AMZN', chg: '+1.02%', up: true },
  { sym: 'GOOGL', chg: '-0.28%', up: false },
  { sym: 'META', chg: '+1.66%', up: true },
  { sym: 'NFLX', chg: '-1.12%', up: false },
  { sym: 'AMD', chg: '+3.05%', up: true },
  { sym: 'COST', chg: '+0.57%', up: true },
  { sym: 'SBUX', chg: '-0.44%', up: false },
  { sym: 'V', chg: '+0.19%', up: true },
]

// Deterministic pseudo-random sparkline per card, viewBox 0 0 120 34
function sparkPoints(seed: number): string {
  const pts: string[] = []
  let y = 20
  for (let i = 0; i <= 12; i++) {
    y += Math.sin(seed * 3.7 + i * 1.35) * 4.5 - 0.35
    y = Math.min(29, Math.max(5, y))
    pts.push(`${i * 10},${y.toFixed(1)}`)
  }
  return pts.join(' ')
}

function TickerTape() {
  const row = (hidden: boolean) => (
    <div className="flex items-center gap-8 pr-8" aria-hidden={hidden}>
      {TAPE_ITEMS.map((t) => (
        <span key={t.sym} className="flex items-center gap-2 font-mono text-xs whitespace-nowrap">
          <span className="text-fog font-semibold">{t.sym}</span>
          <span className={t.up ? 'text-bull' : 'text-bear'}>
            {t.up ? '▲' : '▼'} {t.chg}
          </span>
        </span>
      ))}
    </div>
  )
  return (
    <div className="tape-wrap overflow-hidden border-b border-edge bg-panel/70 py-2.5 select-none">
      <div className="tape flex">
        {row(false)}
        {row(true)}
      </div>
    </div>
  )
}

function GameCard({ game, index, ready, onEnter }: {
  game: Game
  index: number
  ready: boolean
  onEnter: (url: string) => void
}) {
  const live = !game.comingSoon
  return (
    <div
      className={`game-card rise flex flex-col gap-3 rounded-2xl border p-5 ${
        live
          ? 'game-card-live border-edge bg-panel'
          : 'border-dashed border-edge/70 bg-panel/40'
      }`}
      style={{ animationDelay: `${380 + index * 90}ms` }}
    >
      {/* ticker + market status */}
      <div className="flex items-center justify-between font-mono text-xs">
        <span className={live ? 'font-semibold text-fog' : 'text-fog/50'}>
          ${game.ticker ?? '—'}
        </span>
        {live ? (
          <span className="flex items-center gap-1.5 text-bull">
            <span className="relative flex h-1.5 w-1.5">
              <span className="dot-ping absolute inline-flex h-full w-full rounded-full bg-bull" />
              <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-bull" />
            </span>
            OPEN
          </span>
        ) : (
          <span className="rounded-full border border-gold/30 bg-gold/10 px-2 py-0.5 text-[10px] font-semibold text-gold">
            PRE-MARKET
          </span>
        )}
      </div>

      {/* icon + name */}
      <div className={live ? '' : 'opacity-50'}>
        <div className="game-icon w-fit text-4xl">{game.icon || '🎮'}</div>
        <h2 className="mt-2 text-lg font-semibold text-white">{game.name}</h2>
        <p className="mt-1 text-sm leading-relaxed text-fog">{game.description}</p>
      </div>

      {/* sparkline */}
      <svg viewBox="0 0 120 34" className="h-8 w-full" preserveAspectRatio="none" aria-hidden="true">
        <polyline
          points={sparkPoints(index + 1)}
          fill="none"
          stroke={live ? 'var(--color-bull)' : 'var(--color-fog)'}
          strokeOpacity={live ? 0.8 : 0.25}
          strokeWidth="1.5"
          strokeLinejoin="round"
          strokeLinecap="round"
          className="spark-draw"
          style={{ animationDelay: `${600 + index * 120}ms` }}
        />
      </svg>

      {game.ideaBy && (
        <div className="flex items-center gap-2">
          <span className="font-mono text-[10px] uppercase tracking-wider text-fog/60">Idea by</span>
          <svg className="h-3.5 w-3.5 flex-shrink-0" viewBox="0 0 127.14 96.36" fill="#5865F2" xmlns="http://www.w3.org/2000/svg">
            <path d="M107.7,8.07A105.15,105.15,0,0,0,81.47,0a72.06,72.06,0,0,0-3.36,6.83A97.68,97.68,0,0,0,49,6.83,72.37,72.37,0,0,0,45.64,0,105.89,105.89,0,0,0,19.39,8.09C2.79,32.65-1.71,56.6.54,80.21h0A105.73,105.73,0,0,0,32.71,96.36,77.7,77.7,0,0,0,39.6,85.25a68.42,68.42,0,0,1-10.85-5.18c.91-.66,1.8-1.34,2.66-2a75.57,75.57,0,0,0,64.32,0c.87.71,1.76,1.39,2.66,2a68.68,68.68,0,0,1-10.87,5.19,77,77,0,0,0,6.89,11.1A105.25,105.25,0,0,0,126.6,80.22h0C129.24,52.84,122.09,29.11,107.7,8.07ZM42.45,65.69C36.18,65.69,31,60,31,53s5-12.74,11.43-12.74S54,46,53.89,53,48.84,65.69,42.45,65.69Zm42.24,0C78.41,65.69,73.25,60,73.25,53s5-12.74,11.44-12.74S96.23,46,96.12,53,91.08,65.69,84.69,65.69Z"/>
          </svg>
          <span className="text-xs text-fog">{game.ideaBy.name}</span>
        </div>
      )}

      <button
        disabled={!ready || game.comingSoon}
        onClick={() => onEnter(game.url)}
        className="group mt-auto w-full rounded-xl bg-bull/90 py-2.5 text-sm font-semibold text-ink transition-colors hover:bg-bull disabled:cursor-not-allowed disabled:bg-edge disabled:text-fog/50"
      >
        {game.comingSoon ? (
          'เร็วๆ นี้'
        ) : (
          <span className="inline-flex items-center gap-1.5">
            เข้าเล่น
            <span className="transition-transform duration-300 group-hover:translate-x-1">→</span>
          </span>
        )}
      </button>
    </div>
  )
}

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
    <div className="relative min-h-screen overflow-hidden bg-ink">
      {/* ambient layers */}
      <div className="bg-grid pointer-events-none absolute inset-0" aria-hidden="true" />
      <div
        className="glow-drift pointer-events-none absolute -top-40 left-1/2 h-[480px] w-[720px] -translate-x-1/2 rounded-full bg-bull/[0.07] blur-3xl"
        aria-hidden="true"
      />

      <div className="relative">
        <TickerTape />

        {/* Header */}
        <header className="px-4 pb-6 pt-12 text-center">
          <p className="rise font-mono text-xs uppercase tracking-[0.3em] text-bull" style={{ animationDelay: '80ms' }}>
            🌐 US Stock Trivia Arcade
          </p>
          <h1
            className="rise mt-3 font-mono text-4xl font-bold tracking-tight text-white sm:text-5xl"
            style={{ animationDelay: '160ms' }}
          >
            STOCK UNIVERSE
            <span className="cursor-blink ml-1 text-bull">▮</span>
          </h1>
          <p className="rise mt-3 text-base text-fog" style={{ animationDelay: '240ms' }}>
            เลือกเกมที่อยากเล่น แล้วลุยเลย
          </p>
        </header>

        {/* Name input */}
        <div className="rise mb-12 flex justify-center px-4" style={{ animationDelay: '320ms' }}>
          <div className="w-full max-w-sm">
            <label htmlFor="player-name" className="mb-2 block font-mono text-xs uppercase tracking-wider text-fog">
              ชื่อผู้เล่น
            </label>
            <div className="flex items-center gap-2 rounded-xl border border-edge bg-panel px-4 transition-colors focus-within:border-bull/60">
              <span className="font-mono text-bull" aria-hidden="true">&gt;</span>
              <input
                id="player-name"
                className="w-full bg-transparent py-3 text-base text-white placeholder-fog/40 focus:outline-none"
                placeholder="พิมพ์ชื่อของคุณ..."
                value={name}
                maxLength={30}
                onChange={(e) => handleNameChange(e.target.value)}
              />
            </div>
            <p className={`mt-2 text-center font-mono text-xs transition-colors ${name.trim() ? 'text-bull' : 'text-fog/60'}`}>
              {name.trim() ? '✓ พร้อมเข้าเล่น' : 'กรอกชื่อก่อนเข้าเล่น'}
            </p>
          </div>
        </div>

        {/* Game cards */}
        <main className="px-4 pb-20">
          <div className="mx-auto grid max-w-5xl grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {gameList.map((game, i) => (
              <GameCard
                key={game.name}
                game={game}
                index={i}
                ready={Boolean(name.trim())}
                onEnter={handleEnterGame}
              />
            ))}
          </div>
        </main>
      </div>
    </div>
  )
}
