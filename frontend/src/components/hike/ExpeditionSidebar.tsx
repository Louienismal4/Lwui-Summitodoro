import { useState, useRef, useEffect } from 'react'
import { CurtainLink } from '@/components/layout/CurtainLink'
import { formatRemainingTime } from '@/lib/formatTime'
import type { ExpeditionMountain } from '@/data/expeditionMountains'
import type { HikerProfile } from '@/hooks/useHikerProfile'
import type { FocusSession } from '@/hooks/useFocusSession'

type Task = {
  id: string
  title: string
  completed: boolean
}

type Props = {
  profile: HikerProfile
  selectedMountain: ExpeditionMountain
  onSelectMountain: (mountain: ExpeditionMountain) => void
  mountains: ExpeditionMountain[]
  session: FocusSession
  onOpenProfile: () => void
}

const PRESETS = [30, 45, 60, 90, 120]

const YOUTUBE_STREAMS = [
  { id: '5qap5aO4i9A', label: 'Lo-fi study', description: 'Beats to relax/study' },
  { id: 'DWcJFNfaw9c', label: 'Chill beats', description: 'Beats to sleep/chill' },
  { id: 'lTRiuFIWV54', label: '1 A.M study', description: 'Late-night focus mix' },
  { id: 'hHW1oY26kxQ', label: 'Focus radio', description: 'Relax/study stream' },
  { id: 'rUxyKA_-grg', label: 'Sleep radio', description: 'Sleep/chill stream' },
]

export function ExpeditionSidebar({
  profile,
  selectedMountain,
  onSelectMountain,
  mountains,
  session,
  onOpenProfile,
}: Props) {
  const {
    status,
    durationMinutes,
    remainingMs,
    progress,
    setDurationMinutes: onSetDuration,
    start: onStart,
    pause: onPause,
    resume: onResume,
    reset: onReset,
  } = session
  const [isMountainMenuOpen, setIsMountainMenuOpen] = useState(false)
  const mountainSelectorRef = useRef<HTMLElement>(null)
  const [selectedStreamIndex, setSelectedStreamIndex] = useState(0)

  // Local task list
  const [tasks, setTasks] = useState<Task[]>([
    { id: 'task-1', title: 'Complete today’s key objectives', completed: false },
  ])
  const [newTaskTitle, setNewTaskTitle] = useState('')
  const [showTaskInput, setShowTaskInput] = useState(false)

  const streamOption = YOUTUBE_STREAMS[selectedStreamIndex]
  const active = status === 'running' || status === 'paused'

  // Close mountain picker on outside click
  useEffect(() => {
    if (!isMountainMenuOpen) return
    const handleOutsideClick = (e: MouseEvent) => {
      if (!mountainSelectorRef.current?.contains(e.target as Node)) {
        setIsMountainMenuOpen(false)
      }
    }
    document.addEventListener('mousedown', handleOutsideClick)
    return () => document.removeEventListener('mousedown', handleOutsideClick)
  }, [isMountainMenuOpen])

  const handleAddTask = (e: React.FormEvent) => {
    e.preventDefault()
    if (!newTaskTitle.trim()) return
    setTasks((prev) => [
      ...prev,
      { id: `task-${Date.now()}`, title: newTaskTitle.trim(), completed: false },
    ])
    setNewTaskTitle('')
    setShowTaskInput(false)
  }

  const handleToggleTask = (id: string) => {
    setTasks((prev) =>
      prev.map((t) => (t.id === id ? { ...t, completed: !t.completed } : t)),
    )
  }

  const handleDeleteTask = (id: string) => {
    setTasks((prev) => prev.filter((t) => t.id !== id))
  }

  return (
    <aside className="expedition-sidebar" aria-label="Expedition dashboard">
      <div className="bottom-sheet-handle" aria-hidden="true" />
      <div className="sidebar-scroll">
        {/* Brand Header */}
        <header className="dashboard-header">
          <CurtainLink to="/" className="dashboard-brand" aria-label="Summitodoro home">
            <img
              className="dashboard-brand-logo"
              src="/summitodoro-logo.svg"
              alt="Summitodoro"
            />
          </CurtainLink>
        </header>

        {/* Mountain Selector Card */}
        <section ref={mountainSelectorRef} className="hud-card mountain-selector-card">
          <div className="hud-card-heading">
            <span>△</span>
            <strong>Mountain selector</strong>
            <small>{mountains.length} available</small>
          </div>

          <button
            type="button"
            className={
              isMountainMenuOpen
                ? 'mountain-picker-trigger is-open'
                : 'mountain-picker-trigger'
            }
            aria-haspopup="listbox"
            aria-expanded={isMountainMenuOpen}
            disabled={active}
            onClick={() => setIsMountainMenuOpen((open) => !open)}
          >
            <span className="mountain-picker-card-wrap">
              <span className="mountain-option-card">
                <span className="mountain-option-image" aria-hidden="true">
                  <img
                    src={selectedMountain.imagePath}
                    alt={selectedMountain.name}
                    onError={(e) => {
                      e.currentTarget.style.display = 'none'
                    }}
                  />
                </span>
                <span className="mountain-option-copy">
                  <strong>{selectedMountain.name}</strong>
                  <small>
                    {selectedMountain.province} · {selectedMountain.region}
                  </small>
                  <em>{selectedMountain.elevationMasl.toLocaleString()} MASL</em>
                  <i>{selectedMountain.isDefaultUnlocked ? 'Unlocked' : 'Expedition Ready'}</i>
                </span>
                <b className={`difficulty-${selectedMountain.difficulty}`}>
                  {selectedMountain.difficulty}
                </b>
              </span>
              <span
                className={`mountain-picker-chevron ${isMountainMenuOpen ? 'is-open' : ''}`}
                aria-hidden="true"
              />
            </span>
          </button>

          {isMountainMenuOpen && (
            <div className="mountain-picker-menu" role="listbox">
              {mountains.map((mountain) => (
                <button
                  key={mountain.id}
                  type="button"
                  role="option"
                  aria-selected={mountain.id === selectedMountain.id}
                  className={`mountain-picker-option ${
                    mountain.id === selectedMountain.id ? 'selected' : ''
                  }`}
                  onClick={() => {
                    setIsMountainMenuOpen(false)
                    onSelectMountain(mountain)
                  }}
                >
                  <span className="mountain-option-card">
                    <span className="mountain-option-image" aria-hidden="true">
                      <img
                        src={mountain.imagePath}
                        alt={mountain.name}
                        onError={(e) => {
                          e.currentTarget.style.display = 'none'
                        }}
                      />
                    </span>
                    <span className="mountain-option-copy">
                      <strong>{mountain.name}</strong>
                      <small>
                        {mountain.province} · {mountain.region}
                      </small>
                      <em>{mountain.elevationMasl.toLocaleString()} MASL</em>
                      <i>
                        {mountain.isDefaultUnlocked
                          ? 'Unlocked'
                          : `Level ${mountain.requiredLevel} · ${mountain.unlockCost} Coins`}
                      </i>
                    </span>
                    <b className={`difficulty-${mountain.difficulty}`}>
                      {mountain.difficulty}
                    </b>
                  </span>
                </button>
              ))}
            </div>
          )}
        </section>

        {/* Expedition Summary Card */}
        <section className="hud-card expedition-summary">
          <div className="hud-card-heading">
            <span>♜</span>
            <strong>Expedition summary</strong>
          </div>
          <div className="summary-grid">
            <div>
              <span>◷</span>
              <small>Focus time</small>
              <strong>{durationMinutes}m</strong>
            </div>
            <div>
              <span>⚑</span>
              <small>Summits</small>
              <strong>{status === 'completed' ? 1 : 0}</strong>
            </div>
            <div>
              <span>⌁</span>
              <small>Focus chain</small>
              <strong>1</strong>
            </div>
          </div>
          <div className="mission-reward-row">
            <span>Mission reward</span>
            <strong>
              {profile.isGuest
                ? '+0 XP · +0 Trail Coins (Guest)'
                : `+${durationMinutes * 5} XP · +${Math.round(durationMinutes * 0.5)} Trail Coins`}
            </strong>
          </div>
        </section>

        {/* Pomodoro Timer Console */}
        <section className="hud-card timer-panel" aria-label="Focus timer">
          <div className="panel-heading">
            <div>
              <span className="section-kicker">Pomodoro console</span>
              <h2>Focus control</h2>
            </div>
            <span className={`status-badge status-${status}`}>
              {status}
            </span>
          </div>

          <div className="preset-group" aria-label="Focus duration">
            {PRESETS.map((minutes) => (
              <button
                key={minutes}
                type="button"
                className={`preset ${durationMinutes === minutes ? 'active' : ''}`}
                disabled={active}
                onClick={() => onSetDuration(minutes)}
              >
                {minutes} min
              </button>
            ))}
          </div>
          <p className="preset-help">
            Short breaks are 20% of each work segment. Choose 60 min for a three-checkpoint expedition.
          </p>

          <div className="timer-face">
            <span className="timer-label">
              {status === 'idle' ? 'Ready when you are' : 'Time remaining'}
            </span>
            <strong>{formatRemainingTime(remainingMs)}</strong>
            <span className="progress-copy">
              {Math.round(progress * 100)}% of trail
            </span>
          </div>

          <div className="timer-progress" aria-hidden="true">
            <span style={{ width: `${Math.round(progress * 100)}%` }} />
          </div>

          <div className="timer-actions">
            {status === 'idle' && (
              <button
                type="button"
                className="primary-button"
                onClick={onStart}
              >
                Deploy hiker
              </button>
            )}
            {status === 'running' && (
              <button
                type="button"
                className="primary-button"
                onClick={onPause}
              >
                Pause
              </button>
            )}
            {status === 'paused' && (
              <button
                type="button"
                className="primary-button"
                onClick={onResume}
              >
                Resume
              </button>
            )}
            {status === 'completed' && (
              <button
                type="button"
                className="primary-button"
                onClick={onReset}
              >
                Start New Trek
              </button>
            )}
            <button
              type="button"
              className="secondary-button"
              onClick={onReset}
            >
              Reset
            </button>
          </div>
        </section>

        {/* Focus Tasks Section */}
        <section className="hud-card" aria-label="Focus tasks">
          <div className="hud-card-heading">
            <span>✓</span>
            <strong>Focus Tasks</strong>
            <button
              type="button"
              onClick={() => setShowTaskInput((v) => !v)}
              className="text-[9px] font-bold text-[#0aa256] uppercase hover:underline cursor-pointer"
            >
              {showTaskInput ? 'Cancel' : '+ Add task'}
            </button>
          </div>

          {showTaskInput && (
            <form onSubmit={handleAddTask} className="mt-3 flex gap-2">
              <input
                type="text"
                placeholder="What are you working on?"
                value={newTaskTitle}
                onChange={(e) => setNewTaskTitle(e.target.value)}
                autoFocus
                className="flex-1 px-2.5 py-1.5 text-xs bg-white border border-[#d9ded7] rounded text-[#20251f] focus:outline-[#0ba256]"
              />
              <button
                type="submit"
                className="px-3 py-1.5 text-[9px] uppercase font-extrabold bg-[#101311] text-white rounded hover:bg-[#0aa256]"
              >
                Add
              </button>
            </form>
          )}

          <div className="mt-2.5 flex flex-col gap-1.5">
            {tasks.length === 0 ? (
              <p className="text-[10px] text-[#777e78] italic">No active tasks. Add one to stay focused!</p>
            ) : (
              tasks.map((task) => (
                <div
                  key={task.id}
                  className="flex items-center justify-between gap-2 p-1.5 rounded bg-[#f7f8f5] border border-[#e0e4de] text-xs"
                >
                  <label className="flex items-center gap-2 cursor-pointer flex-1 min-w-0">
                    <input
                      type="checkbox"
                      checked={task.completed}
                      onChange={() => handleToggleTask(task.id)}
                      className="accent-[#0ba256] size-3.5"
                    />
                    <span
                      className={`truncate text-[11px] font-medium ${
                        task.completed ? 'line-through text-[#858c85]' : 'text-[#20251f]'
                      }`}
                    >
                      {task.title}
                    </span>
                  </label>
                  <button
                    type="button"
                    onClick={() => handleDeleteTask(task.id)}
                    className="text-[#99a099] hover:text-[#a33d34] text-xs px-1 cursor-pointer"
                    title="Remove task"
                  >
                    ×
                  </button>
                </div>
              ))
            )}
          </div>
        </section>

        {/* Trail Music Player */}
        <section className="hud-card music-panel" aria-label="Trail music">
          <div className="hud-card-heading">
            <span>♫</span>
            <strong>Trail Music</strong>
            <small>{streamOption.label}</small>
          </div>
          <iframe
            className="music-player"
            src={`https://www.youtube-nocookie.com/embed/${streamOption.id}`}
            title="YouTube stream player"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
          <div className="stream-controls">
            <button
              type="button"
              className="stream-control"
              onClick={() =>
                setSelectedStreamIndex(
                  (i) => (i - 1 + YOUTUBE_STREAMS.length) % YOUTUBE_STREAMS.length,
                )
              }
            >
              ‹ Previous
            </button>
            <span className="text-[9px] text-[#737a74] font-medium">
              {streamOption.description}
            </span>
            <button
              type="button"
              className="stream-control"
              onClick={() =>
                setSelectedStreamIndex((i) => (i + 1) % YOUTUBE_STREAMS.length)
              }
            >
              Next ›
            </button>
          </div>
        </section>

        {/* Navigation & App Links */}
        <nav className="sidebar-legal-links" aria-label="Legal and info links">
          <button
            type="button"
            onClick={onOpenProfile}
            className="hover:underline cursor-pointer"
          >
            Settings
          </button>
          <CurtainLink to="/about">About</CurtainLink>
          <CurtainLink to="/changelog">Changelog</CurtainLink>
          <CurtainLink to="/">Home</CurtainLink>
        </nav>
      </div>

      {/* Hiker Profile Card Footer */}
      <section className="hiker-profile">
        <button
          type="button"
          className="avatar cursor-pointer"
          onClick={onOpenProfile}
          title="Profile & Settings"
        >
          <span>{profile.avatarUrl || '🥾'}</span>
        </button>

        <div className="hiker-profile-details">
          <small>{profile.isGuest ? 'Guest hiker' : 'Hiker profile'}</small>
          <div className="profile-name-row">
            <button
              type="button"
              onClick={onOpenProfile}
              className="text-left font-bold text-[var(--ink-deep)] hover:underline cursor-pointer truncate"
              title="Click to edit profile"
            >
              <strong>{profile.displayName}</strong>
            </button>
            {profile.isGuest ? (
              <button
                type="button"
                onClick={onOpenProfile}
                className="guest-badge hover:opacity-80 cursor-pointer transition-opacity text-left"
                title="Sign in or link account"
              >
                Guest
              </button>
            ) : (
              <span className="text-[10px] font-bold text-[#b77d12]">
                ◆ {profile.coins.toLocaleString()}
              </span>
            )}
          </div>
          <span>
            {profile.isGuest
              ? 'Guest mode (XP disabled)'
              : `Level ${profile.level} · ${profile.exp} XP`}
          </span>
        </div>

        <div className={`profile-status ${active ? 'active' : ''}`}>
          {profile.isGuest ? 'GUEST' : active ? 'ON TRAIL' : 'AT CAMP'}
        </div>

        <div className="profile-xp-progress">
          <div>
            <small>{profile.isGuest ? 'Progress' : 'Next level'}</small>
            <span>
              {profile.isGuest ? 'Sign in to level up' : `${profile.exp % 1000} / 1000 XP`}
            </span>
          </div>
          <div className="segmented-progress">
            {Array.from({ length: 10 }, (_, i) => (
              <span
                key={i}
                className={!profile.isGuest && i < Math.ceil(((profile.exp % 1000) / 1000) * 10) ? 'filled' : ''}
              />
            ))}
          </div>
        </div>
      </section>
    </aside>
  )
}
