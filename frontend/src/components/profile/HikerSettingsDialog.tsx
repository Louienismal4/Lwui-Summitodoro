import { useState } from 'react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { useHikerSettings } from '@/hooks/useHikerSettings'
import type { HikerProfile } from '@/hooks/useHikerProfile'
import { useHikerGears } from '@/hooks/useHikerGears'
import { PRESET_AVATARS } from '@/lib/settings'
import { authService } from '@/services/auth.service'
import type { GearCategory, GearItem } from '@/types/gear'

type Props = {
  open: boolean
  onOpenChange: (open: boolean) => void
  profile: HikerProfile
  isGuest: boolean
  onUpdateProfile: (updates: Partial<Pick<HikerProfile, 'displayName' | 'avatarUrl' | 'motto' | 'coins'>>) => void
  onLogin: (email: string, pass: string) => Promise<unknown>
  onRegister: (name: string, email: string, pass: string) => Promise<unknown>
  onLogout: () => Promise<void>
}

const DURATION_PRESETS = [25, 30, 45, 60]

const CATEGORY_TABS: { id: GearCategory | 'all'; label: string; icon: string }[] = [
  { id: 'all', label: 'All', icon: '🎒' },
  { id: 'footwear', label: 'Boots', icon: '🥾' },
  { id: 'pack', label: 'Packs', icon: '🎒' },
  { id: 'poles', label: 'Poles', icon: '🦯' },
  { id: 'apparel', label: 'Shells', icon: '🧥' },
  { id: 'lamp', label: 'Lamps', icon: '🔦' },
  { id: 'nav', label: 'Nav', icon: '🧭' },
]

export function HikerSettingsDialog({
  open,
  onOpenChange,
  profile,
  isGuest,
  onUpdateProfile,
  onLogin,
  onRegister,
  onLogout,
}: Props) {
  const { settings, updateSetting } = useHikerSettings()
  const {
    selectedGear,
    setSelectedGearId,
    activeCategory,
    setActiveCategory,
    filteredCatalog,
    isUnlocked,
    isEquipped,
    checkCanUnlock,
    handleUnlock,
    handleEquip,
    gearsData,
  } = useHikerGears(profile, onUpdateProfile)

  // Dialog top-level tab: 'settings' or 'gears'
  const [activeTab, setActiveTab] = useState<'settings' | 'gears'>('settings')

  // Profile Form state
  const [nameInput, setNameInput] = useState(profile.displayName)
  const [isNameDirty, setIsNameDirty] = useState(false)

  // Auth Form state (Login / Register for guests)
  const [showAuthForm, setShowAuthForm] = useState(false)
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login')
  const [authEmail, setAuthEmail] = useState('')
  const [authPassword, setAuthPassword] = useState('')
  const [authName, setAuthName] = useState('')
  const [authError, setAuthError] = useState<string | null>(null)
  const [isAuthLoading, setIsAuthLoading] = useState(false)

  // Change Password state (for authenticated hikers)
  const [showPasswordForm, setShowPasswordForm] = useState(false)
  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [passwordError, setPasswordError] = useState<string | null>(null)
  const [passwordSuccess, setPasswordSuccess] = useState<string | null>(null)
  const [isPasswordLoading, setIsPasswordLoading] = useState(false)

  const currentAvatar = profile.avatarUrl || '🥾'

  const handleNameChange = (val: string) => {
    setNameInput(val)
    setIsNameDirty(val.trim() !== profile.displayName)
  }

  const handleSaveName = (e?: React.FormEvent) => {
    e?.preventDefault()
    const clean = nameInput.trim() || 'Trail Hiker'
    onUpdateProfile({ displayName: clean })
    setNameInput(clean)
    setIsNameDirty(false)
  }

  const handleSelectBadge = (emoji: string) => {
    onUpdateProfile({ avatarUrl: emoji })
  }

  const handleAuthSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setAuthError(null)

    if (!authEmail.trim() || !authPassword.trim()) {
      setAuthError('Please enter email and password.')
      return
    }

    try {
      setIsAuthLoading(true)
      if (authMode === 'login') {
        await onLogin(authEmail, authPassword)
      } else {
        await onRegister(authName.trim() || nameInput, authEmail, authPassword)
      }
      setShowAuthForm(false)
    } catch (err: unknown) {
      const msg =
        err && typeof err === 'object' && 'response' in err
          ? (err as { response?: { data?: { message?: string } } }).response?.data?.message
          : null
      setAuthError(msg || 'Unable to authenticate. Please check your credentials.')
    } finally {
      setIsAuthLoading(false)
    }
  }

  const handleChangePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setPasswordError(null)
    setPasswordSuccess(null)

    if (!currentPassword) {
      setPasswordError('Please enter your current password.')
      return
    }
    if (newPassword.length < 8) {
      setPasswordError('New password must be at least 8 characters.')
      return
    }
    if (newPassword !== confirmPassword) {
      setPasswordError('New password and confirmation do not match.')
      return
    }

    try {
      setIsPasswordLoading(true)
      const res = await authService.changePassword(currentPassword, newPassword, confirmPassword)
      setPasswordSuccess(res.message || 'Password updated successfully!')
      setCurrentPassword('')
      setNewPassword('')
      setConfirmPassword('')
    } catch (err: unknown) {
      const msg =
        err && typeof err === 'object' && 'response' in err
          ? (err as { response?: { data?: { message?: string } } }).response?.data?.message
          : null
      setPasswordError(msg || 'Failed to update password. Check current password.')
    } finally {
      setIsPasswordLoading(false)
    }
  }

  // Calculate XP progress towards next 1000 threshold
  const currentLevelXp = profile.exp % 1000
  const xpPercent = Math.min(100, Math.round((currentLevelXp / 1000) * 100))

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md md:max-w-[780px] w-full bg-[var(--paper)] p-5 sm:p-6 rounded-3xl border border-[var(--line)] shadow-2xl overflow-hidden">
        {/* Header with Title and Mode Switcher */}
        <DialogHeader className="gap-2 text-left pb-2 border-b border-[var(--line)] flex flex-row items-center justify-between">
          <div>
            <DialogTitle className="font-serif text-xl sm:text-2xl font-bold text-[var(--ink-deep)]">
              {activeTab === 'settings' ? 'Hiker Profile & Settings' : 'Mountaineering Gear Locker'}
            </DialogTitle>
            <DialogDescription className="text-xs text-[#637168]">
              {activeTab === 'settings'
                ? 'Adjust personalizations on the left and monitor mountaineer stats on the right.'
                : 'Equip trail-tested Philippine climbing loadouts and unlock perks using Trail Coins.'}
            </DialogDescription>
          </div>

          {/* Sub-tab Pill Switcher */}
          <div className="flex items-center gap-1 bg-[var(--cream)] p-1 rounded-xl border border-[var(--line)] shrink-0">
            <button
              type="button"
              onClick={() => setActiveTab('settings')}
              className={`px-2.5 py-1 text-xs font-bold rounded-lg cursor-pointer transition-all ${
                activeTab === 'settings'
                  ? 'bg-[var(--pine)] text-white shadow-xs'
                  : 'text-[var(--ink)] hover:text-[var(--pine)]'
              }`}
            >
              ⚙️ Settings
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('gears')}
              className={`px-2.5 py-1 text-xs font-bold rounded-lg cursor-pointer transition-all ${
                activeTab === 'gears'
                  ? 'bg-[var(--pine)] text-white shadow-xs'
                  : 'text-[var(--ink)] hover:text-[var(--pine)]'
              }`}
            >
              🎒 Gears
            </button>
          </div>
        </DialogHeader>

        {/* TAB 1: SETTINGS & STATS */}
        {activeTab === 'settings' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5 items-stretch pt-2">
            {/* LEFT SIDE: Updating Data & Personalization */}
            <div className="bg-[var(--cream)]/40 rounded-2xl p-4 border border-[var(--line)] flex flex-col justify-between space-y-3">
              {/* 1. Name Input */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <Label htmlFor="hiker-name-input" className="text-xs font-bold text-[var(--ink)]">
                    Trail Name
                  </Label>
                  {isNameDirty && (
                    <span className="text-[10px] text-[var(--coral)] font-bold">Unsaved</span>
                  )}
                </div>
                <div className="flex items-center gap-1.5">
                  <Input
                    id="hiker-name-input"
                    value={nameInput}
                    onChange={(e) => handleNameChange(e.target.value)}
                    onBlur={() => handleSaveName()}
                    placeholder="Trail Hiker"
                    className="h-8 text-xs font-bold bg-[var(--paper)] border-[var(--line)]"
                  />
                  {isNameDirty && (
                    <Button
                      type="button"
                      size="sm"
                      onClick={() => handleSaveName()}
                      className="h-8 px-2.5 text-xs font-bold bg-[var(--pine)] text-white hover:bg-[var(--ink)] shrink-0 cursor-pointer"
                    >
                      Save
                    </Button>
                  )}
                </div>
              </div>

              {/* 2. Choose Badge */}
              <div className="space-y-1.5">
                <Label className="text-xs font-bold text-[var(--ink)] block">
                  Mountaineer Emblem Badge
                </Label>
                <div className="grid grid-cols-5 gap-1.5">
                  {PRESET_AVATARS.map((av) => (
                    <button
                      key={av.id}
                      type="button"
                      onClick={() => handleSelectBadge(av.emoji)}
                      className={`h-8 rounded-lg flex items-center justify-center text-sm cursor-pointer transition-all hover:scale-105 ${
                        currentAvatar === av.emoji
                          ? 'bg-[var(--pine)] text-white ring-2 ring-[var(--pine)]/30 shadow-xs'
                          : 'bg-[var(--paper)] border border-[var(--line)] hover:bg-[var(--cream)]'
                      }`}
                      title={av.title}
                    >
                      {av.emoji}
                    </button>
                  ))}
                </div>
              </div>

              <Separator className="bg-[var(--line)]/60 my-0.5" />

              {/* 3. Expedition Settings: Duration */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-[var(--ink)]">Default Focus Block</span>
                  <span className="font-bold text-[var(--pine)]">{settings.defaultDurationMinutes} min</span>
                </div>
                <div className="grid grid-cols-4 gap-1.5">
                  {DURATION_PRESETS.map((mins) => (
                    <Button
                      key={mins}
                      type="button"
                      size="sm"
                      variant={settings.defaultDurationMinutes === mins ? 'default' : 'outline'}
                      onClick={() => updateSetting('defaultDurationMinutes', mins)}
                      className={`h-7 text-xs font-bold rounded-lg cursor-pointer ${
                        settings.defaultDurationMinutes === mins
                          ? 'bg-[var(--pine)] text-white hover:bg-[var(--pine)]'
                          : 'border-[var(--line)] hover:bg-[var(--cream)] text-[var(--ink)]'
                      }`}
                    >
                      {mins}m
                    </Button>
                  ))}
                </div>
              </div>

              {/* 4. Toggles */}
              <div className="space-y-2 pt-0.5">
                <div className="flex items-center justify-between gap-3">
                  <div className="space-y-0.5">
                    <Label htmlFor="sfx-toggle" className="text-xs font-bold text-[var(--ink)] cursor-pointer">
                      Sound Effects
                    </Label>
                    <p className="text-[10px] text-[#748078] leading-tight">
                      Fanfare & checkpoint chimes
                    </p>
                  </div>
                  <Switch
                    id="sfx-toggle"
                    size="sm"
                    checked={settings.soundEffectsEnabled}
                    onCheckedChange={(checked) => updateSetting('soundEffectsEnabled', checked)}
                  />
                </div>

                <div className="flex items-center justify-between gap-3">
                  <div className="space-y-0.5">
                    <Label htmlFor="breaks-toggle" className="text-xs font-bold text-[var(--ink)] cursor-pointer">
                      Auto-Start Rest Breaks
                    </Label>
                    <p className="text-[10px] text-[#748078] leading-tight">
                      Prompts pause at 25%, 50%, 75%
                    </p>
                  </div>
                  <Switch
                    id="breaks-toggle"
                    size="sm"
                    checked={settings.autoStartBreaks}
                    onCheckedChange={(checked) => updateSetting('autoStartBreaks', checked)}
                  />
                </div>
              </div>
            </div>

            {/* RIGHT SIDE: Stats / Password / Auth Form */}
            <div className="bg-[var(--cream)]/40 rounded-2xl p-4 border border-[var(--line)] flex flex-col justify-between space-y-3">
              {showPasswordForm ? (
                /* Change Password Form (for Authenticated Hikers) */
                <form onSubmit={handleChangePasswordSubmit} className="space-y-2 animate-in fade-in-0 duration-150">
                  <div className="flex items-center justify-between border-b border-[var(--line)] pb-1.5">
                    <strong className="text-xs font-bold text-[var(--ink)]">
                      Change Account Password
                    </strong>
                    <button
                      type="button"
                      onClick={() => {
                        setShowPasswordForm(false)
                        setPasswordError(null)
                        setPasswordSuccess(null)
                      }}
                      className="text-[11px] text-[var(--pine)] hover:underline font-bold cursor-pointer"
                    >
                      ← Back to Stats
                    </button>
                  </div>

                  {passwordSuccess && (
                    <p
                      role="status"
                      className="text-[11px] text-[var(--pine)] font-semibold leading-tight mt-1"
                    >
                      ✓ {passwordSuccess}
                    </p>
                  )}

                  {passwordError && (
                    <p
                      role="alert"
                      className="text-[11px] text-[var(--coral)] font-semibold leading-tight mt-1"
                    >
                      {passwordError}
                    </p>
                  )}

                  <div className="space-y-0.5">
                    <Label htmlFor="pwd-current" className="text-[10px] font-bold text-[var(--ink)]">
                      Current Password
                    </Label>
                    <Input
                      id="pwd-current"
                      type="password"
                      value={currentPassword}
                      onChange={(e) => setCurrentPassword(e.target.value)}
                      placeholder="••••••••"
                      className="h-7 text-xs bg-[var(--paper)]"
                      required
                    />
                  </div>

                  <div className="space-y-0.5">
                    <Label htmlFor="pwd-new" className="text-[10px] font-bold text-[var(--ink)]">
                      New Password (min 8 chars)
                    </Label>
                    <Input
                      id="pwd-new"
                      type="password"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      placeholder="••••••••"
                      className="h-7 text-xs bg-[var(--paper)]"
                      required
                    />
                  </div>

                  <div className="space-y-0.5">
                    <Label htmlFor="pwd-confirm" className="text-[10px] font-bold text-[var(--ink)]">
                      Confirm New Password
                    </Label>
                    <Input
                      id="pwd-confirm"
                      type="password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="••••••••"
                      className="h-7 text-xs bg-[var(--paper)]"
                      required
                    />
                  </div>

                  <div className="pt-1.5 flex gap-2">
                    <Button
                      type="submit"
                      disabled={isPasswordLoading}
                      className="flex-1 h-8 text-xs font-bold bg-[var(--pine)] text-white hover:bg-[var(--ink)] cursor-pointer"
                    >
                      {isPasswordLoading ? 'Updating...' : 'Update Password'}
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => {
                        setShowPasswordForm(false)
                        setPasswordError(null)
                        setPasswordSuccess(null)
                      }}
                      className="h-8 px-3 text-xs font-bold border-[var(--line)] cursor-pointer"
                    >
                      Cancel
                    </Button>
                  </div>
                </form>
              ) : showAuthForm ? (
                /* Inline Auth Form */
                <form onSubmit={handleAuthSubmit} className="space-y-2.5 animate-in fade-in-0 duration-150">
                  <div className="flex items-center justify-between border-b border-[var(--line)] pb-1.5">
                    <strong className="text-xs font-bold text-[var(--ink)]">
                      {authMode === 'login' ? 'Sign In as Hiker' : 'Register Account'}
                    </strong>
                    <button
                      type="button"
                      onClick={() => {
                        setAuthMode(authMode === 'login' ? 'register' : 'login')
                        setAuthError(null)
                      }}
                      className="text-[11px] text-[var(--pine)] hover:underline font-bold cursor-pointer"
                    >
                      {authMode === 'login' ? 'Register' : 'Sign In'}
                    </button>
                  </div>

                  {authError && (
                    <p
                      role="alert"
                      className="text-[11px] text-[var(--coral)] font-semibold leading-tight mt-1"
                    >
                      {authError}
                    </p>
                  )}

                  {authMode === 'register' && (
                    <div className="space-y-0.5">
                      <Label htmlFor="hiker-reg-name" className="text-[10px] font-bold text-[var(--ink)]">
                        Hiker Name
                      </Label>
                      <Input
                        id="hiker-reg-name"
                        value={authName}
                        onChange={(e) => setAuthName(e.target.value)}
                        placeholder="Name"
                        className="h-7 text-xs bg-[var(--paper)]"
                      />
                    </div>
                  )}

                  <div className="space-y-0.5">
                    <Label htmlFor="hiker-reg-email" className="text-[10px] font-bold text-[var(--ink)]">
                      Email
                    </Label>
                    <Input
                      id="hiker-reg-email"
                      type="email"
                      value={authEmail}
                      onChange={(e) => setAuthEmail(e.target.value)}
                      placeholder="hiker@email.com"
                      className="h-7 text-xs bg-[var(--paper)]"
                    />
                  </div>

                  <div className="space-y-0.5">
                    <Label htmlFor="hiker-reg-pass" className="text-[10px] font-bold text-[var(--ink)]">
                      Password
                    </Label>
                    <Input
                      id="hiker-reg-pass"
                      type="password"
                      value={authPassword}
                      onChange={(e) => setAuthPassword(e.target.value)}
                      placeholder="••••••••"
                      className="h-7 text-xs bg-[var(--paper)]"
                    />
                  </div>

                  <div className="pt-1 flex gap-2">
                    <Button
                      type="submit"
                      disabled={isAuthLoading}
                      className="flex-1 h-8 text-xs font-bold bg-[var(--pine)] text-white hover:bg-[var(--ink)] cursor-pointer"
                    >
                      {isAuthLoading ? 'Connecting...' : authMode === 'login' ? 'Sign In →' : 'Register →'}
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => {
                        setShowAuthForm(false)
                        setAuthError(null)
                      }}
                      className="h-8 px-3 text-xs font-bold border-[var(--line)] cursor-pointer"
                    >
                      Back
                    </Button>
                  </div>
                </form>
              ) : (
                /* Stats & Account Display */
                <>
                  {/* Hiker Emblem & Level Card */}
                  <div className="flex items-center gap-3 bg-[var(--paper)] rounded-xl p-3 border border-[var(--line)] shadow-2xs">
                    <div className="size-12 rounded-xl bg-[var(--cream)] border-2 border-[var(--pine)] flex items-center justify-center text-2xl shadow-xs shrink-0 select-none">
                      {currentAvatar}
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <strong className="text-sm font-bold text-[var(--ink-deep)] truncate block">
                          {profile.displayName}
                        </strong>
                        {isGuest ? (
                          <Badge variant="secondary" className="bg-[#d66b4d]/15 text-[var(--coral)] text-[9px] px-1.5 py-0 h-4 font-bold border-transparent">
                            Guest
                          </Badge>
                        ) : (
                          <Badge variant="secondary" className="bg-[var(--pine)]/15 text-[var(--pine)] text-[9px] px-1.5 py-0 h-4 font-bold border-transparent">
                            Verified
                          </Badge>
                        )}
                      </div>
                      <span className="text-[11px] text-[#748078] block">
                        Mountaineer Rank: Level {profile.level}
                      </span>
                    </div>
                  </div>

                  {/* Stats Grid */}
                  <div className="grid grid-cols-3 gap-2 text-center">
                    <div className="bg-[var(--paper)] rounded-xl p-2 border border-[var(--line)]">
                      <span className="text-[9px] uppercase font-bold text-[#748078] block">Exp</span>
                      <strong className="text-xs font-serif font-bold text-[var(--pine)]">
                        {profile.exp.toLocaleString()}
                      </strong>
                    </div>
                    <div className="bg-[var(--paper)] rounded-xl p-2 border border-[var(--line)]">
                      <span className="text-[9px] uppercase font-bold text-[#748078] block">Coins</span>
                      <strong className="text-xs font-serif font-bold text-[#b77d12]">
                        ◆ {profile.coins.toLocaleString()}
                      </strong>
                    </div>
                    <div className="bg-[var(--paper)] rounded-xl p-2 border border-[var(--line)]">
                      <span className="text-[9px] uppercase font-bold text-[#748078] block">Peak</span>
                      <strong className="text-xs font-serif font-bold text-[var(--ink-deep)] truncate block">
                        Batulao
                      </strong>
                    </div>
                  </div>

                  {/* XP Progress Bar to Next Level */}
                  <div className="space-y-1 bg-[var(--paper)] rounded-xl p-2.5 border border-[var(--line)]">
                    <div className="flex justify-between items-center text-[10px] font-bold text-[#637168]">
                      <span>Level Progress</span>
                      <span>{currentLevelXp} / 1000 XP</span>
                    </div>
                    <div className="h-1.5 w-full bg-[var(--cream)] rounded-full overflow-hidden">
                      <div
                        className="h-full bg-[var(--pine)] rounded-full transition-all duration-300"
                        style={{ width: `${xpPercent}%` }}
                      />
                    </div>
                  </div>

                  {/* Account row */}
                  <div className="flex items-center justify-between bg-[var(--paper)] rounded-xl p-2.5 border border-[var(--line)] text-xs">
                    {isGuest ? (
                      <>
                        <div>
                          <span className="text-[10px] text-[#748078] block leading-tight">Local Guest Mode</span>
                          <span className="text-[11px] font-bold text-[var(--ink)]">Sync disabled</span>
                        </div>
                        <Button
                          type="button"
                          size="sm"
                          onClick={() => {
                            setShowAuthForm(true)
                            setAuthError(null)
                          }}
                          className="h-7 text-[11px] font-bold bg-[var(--ink)] hover:bg-[var(--coral)] text-white px-2.5 cursor-pointer"
                        >
                          Sign In / Sync →
                        </Button>
                      </>
                    ) : (
                      <>
                        <div className="truncate mr-2">
                          <span className="text-[10px] text-[#748078] block leading-tight">Hiker Account</span>
                          <span className="text-[11px] font-bold text-[var(--ink)] truncate block max-w-[120px]">
                            {profile.email}
                          </span>
                        </div>
                        <div className="flex items-center gap-1.5 shrink-0">
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              setShowPasswordForm(true)
                              setPasswordError(null)
                              setPasswordSuccess(null)
                            }}
                            className="h-7 text-[10px] font-bold border-[var(--line)] hover:bg-[var(--cream)] text-[var(--ink)] cursor-pointer"
                          >
                            🔑 Password
                          </Button>
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={async () => {
                              await onLogout()
                              onOpenChange(false)
                            }}
                            className="h-7 text-[10px] font-bold border-[var(--line)] hover:bg-[var(--coral)]/10 text-[var(--coral)] cursor-pointer"
                          >
                            Sign Out
                          </Button>
                        </div>
                      </>
                    )}
                  </div>

                  {/* Done Action Button */}
                  <Button
                    type="button"
                    onClick={() => onOpenChange(false)}
                    className="w-full h-8 bg-[var(--ink)] hover:bg-[var(--pine)] text-[var(--paper)] font-bold text-xs cursor-pointer tracking-wider"
                  >
                    Done
                  </Button>
                </>
              )}
            </div>
          </div>
        )}

        {/* TAB 2: EXPEDITION GEARS */}
        {activeTab === 'gears' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5 items-stretch pt-2">
            {/* LEFT SIDE: Gear Locker Catalog */}
            <div className="bg-[var(--cream)]/40 rounded-2xl p-3 sm:p-4 border border-[var(--line)] flex flex-col justify-between space-y-2.5">
              <div>
                <div className="flex items-center justify-between pb-1.5">
                  <span className="text-xs font-bold text-[var(--ink)]">Gear Inventory</span>
                  <span className="text-xs font-serif font-bold text-[#b77d12]">
                    Coins: ◆ {profile.coins.toLocaleString()}
                  </span>
                </div>

                {/* Category Pills */}
                <div className="flex items-center gap-1 overflow-x-auto pb-1.5 scrollbar-none">
                  {CATEGORY_TABS.map((cat) => (
                    <button
                      key={cat.id}
                      type="button"
                      onClick={() => setActiveCategory(cat.id)}
                      className={`px-2 py-0.5 text-[11px] font-bold rounded-lg cursor-pointer transition-all whitespace-nowrap ${
                        activeCategory === cat.id
                          ? 'bg-[var(--pine)] text-white shadow-2xs'
                          : 'bg-[var(--paper)] text-[var(--ink)] border border-[var(--line)] hover:bg-[var(--cream)]'
                      }`}
                    >
                      {cat.icon} {cat.label}
                    </button>
                  ))}
                </div>

                {/* Compact Gear Cards Grid */}
                <div className="grid grid-cols-2 gap-1.5 max-h-[260px] overflow-y-auto pr-0.5 pt-0.5">
                  {filteredCatalog.map((gear: GearItem) => {
                    const unlocked = isUnlocked(gear.id)
                    const equipped = isEquipped(gear)
                    const isSelected = selectedGear.id === gear.id

                    return (
                      <button
                        key={gear.id}
                        type="button"
                        onClick={() => setSelectedGearId(gear.id)}
                        className={`text-left p-2 rounded-xl border transition-all cursor-pointer flex flex-col justify-between min-h-[64px] ${
                          isSelected
                            ? 'bg-[var(--paper)] border-[var(--pine)] ring-2 ring-[var(--pine)]/30 shadow-xs'
                            : 'bg-[var(--paper)] border-[var(--line)] hover:border-[var(--pine)]/50'
                        }`}
                      >
                        <div className="flex items-start justify-between gap-1">
                          <span className="text-base select-none">{gear.icon}</span>
                          {equipped ? (
                            <Badge className="bg-[var(--pine)] text-white text-[8px] px-1 py-0 h-3.5 font-bold border-transparent">
                              Equipped
                            </Badge>
                          ) : unlocked ? (
                            <Badge variant="outline" className="text-[var(--pine)] border-[var(--pine)]/40 text-[8px] px-1 py-0 h-3.5 font-bold">
                              Owned
                            </Badge>
                          ) : (
                            <span className="text-[9px] font-serif font-bold text-[#b77d12]">
                              ◆ {gear.coinsCost}
                            </span>
                          )}
                        </div>
                        <div>
                          <strong className="text-[11px] font-bold text-[var(--ink-deep)] block truncate">
                            {gear.name}
                          </strong>
                          <span className="text-[9px] text-[#748078] block truncate">
                            Lvl {gear.levelRequired} • {gear.category}
                          </span>
                        </div>
                      </button>
                    )
                  })}
                </div>
              </div>

              <div className="text-[10px] text-[#748078] italic text-center pt-1 border-t border-[var(--line)]/50">
                Select an item to inspect specifications and equip it to your active pack.
              </div>
            </div>

            {/* RIGHT SIDE: Selected Gear Details & Loadout Summary */}
            <div className="bg-[var(--cream)]/40 rounded-2xl p-4 border border-[var(--line)] flex flex-col justify-between space-y-3">
              {/* Gear Inspector Detail Card */}
              <div className="bg-[var(--paper)] rounded-xl p-3 border border-[var(--line)] shadow-2xs space-y-2">
                <div className="flex items-start gap-3">
                  <div className="size-12 rounded-xl bg-[var(--cream)] border-2 border-[var(--pine)] flex items-center justify-center text-2xl shadow-xs shrink-0 select-none">
                    {selectedGear.icon}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <strong className="text-sm font-bold text-[var(--ink-deep)] truncate block">
                        {selectedGear.name}
                      </strong>
                      <Badge variant="secondary" className="bg-[var(--cream)] text-[var(--ink)] text-[9px] px-1.5 py-0 h-4 font-bold border border-[var(--line)] uppercase">
                        {selectedGear.category}
                      </Badge>
                    </div>
                    <span className="text-[11px] text-[#748078] block">
                      Required Rank: Level {selectedGear.levelRequired}
                    </span>
                  </div>
                </div>

                {/* Perk Callout */}
                <div className="bg-[var(--pine)]/10 border border-[var(--pine)]/20 rounded-lg p-2 text-xs">
                  <span className="text-[10px] uppercase font-bold text-[var(--pine)] block">Trail Perk</span>
                  <p className="font-medium text-[var(--ink-deep)] text-[11px]">
                    {selectedGear.perk}
                  </p>
                </div>

                <p className="text-[11px] text-[#637168] leading-relaxed">
                  {selectedGear.description}
                </p>

                {/* Action button */}
                <div className="pt-1">
                  {isEquipped(selectedGear) ? (
                    <Button
                      disabled
                      size="sm"
                      className="w-full h-8 text-xs font-bold bg-[var(--pine)]/15 text-[var(--pine)] border border-[var(--pine)]/30 cursor-default"
                    >
                      ✓ Currently Equipped in Loadout
                    </Button>
                  ) : isUnlocked(selectedGear.id) ? (
                    <Button
                      type="button"
                      size="sm"
                      onClick={() => handleEquip(selectedGear)}
                      className="w-full h-8 text-xs font-bold bg-[var(--pine)] text-white hover:bg-[var(--ink)] cursor-pointer"
                    >
                      Equip {selectedGear.name} →
                    </Button>
                  ) : (
                    (() => {
                      const check = checkCanUnlock(selectedGear)
                      return (
                        <Button
                          type="button"
                          size="sm"
                          disabled={!check.allowed}
                          onClick={() => handleUnlock(selectedGear)}
                          className={`w-full h-8 text-xs font-bold cursor-pointer ${
                            check.allowed
                              ? 'bg-[#b77d12] hover:bg-[#8f610e] text-white'
                              : 'bg-zinc-200 text-zinc-500 cursor-not-allowed'
                          }`}
                        >
                          {check.allowed
                            ? `Unlock for ◆ ${selectedGear.coinsCost} Coins`
                            : check.reason}
                        </Button>
                      )
                    })()
                  )}
                </div>
              </div>

              {/* Current Active Loadout Grid */}
              <div className="bg-[var(--paper)] rounded-xl p-2.5 border border-[var(--line)] space-y-1.5">
                <span className="text-[10px] uppercase font-bold text-[#748078] block">
                  Active Expedition Loadout (6 Slots)
                </span>
                <div className="grid grid-cols-6 gap-1.5 text-center">
                  {(['footwear', 'pack', 'poles', 'apparel', 'lamp', 'nav'] as GearCategory[]).map((cat) => {
                    const gearId = gearsData.equippedGears[cat]
                    const gear = filteredCatalog.find((g) => g.id === gearId) || { icon: '•', name: cat }
                    return (
                      <div
                        key={cat}
                        className="bg-[var(--cream)] rounded-lg p-1 border border-[var(--line)]/60 text-center"
                        title={`${cat}: ${gear.name}`}
                      >
                        <span className="text-sm block">{gear.icon}</span>
                        <span className="text-[8px] text-[#748078] uppercase font-bold block truncate">
                          {cat.slice(0, 4)}
                        </span>
                      </div>
                    )
                  })}
                </div>
              </div>

              {/* Back to Expedition Done button */}
              <Button
                type="button"
                onClick={() => onOpenChange(false)}
                className="w-full h-8 bg-[var(--ink)] hover:bg-[var(--pine)] text-[var(--paper)] font-bold text-xs cursor-pointer tracking-wider"
              >
                Close Locker
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}
