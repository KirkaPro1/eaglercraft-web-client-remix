import { useEffect, useState } from 'react'
import { createFileRoute } from '@tanstack/react-router'
import { AnimatePresence, motion } from 'framer-motion'
import { ArrowLeft, ChevronRight, Gamepad2, Globe2, Settings2, Upload, X } from 'lucide-react'
import { toast } from 'sonner'

export const Route = createFileRoute('/')({
  head: () => ({ meta: [{ title: 'Void Client · Eaglercraft 1.21' }, { name: 'description', content: 'A dark, atmospheric browser launcher for Eaglercraft.' }] }),
  component: VoidClient,
})

type Skin = { name: string; url: string }
const presets: Skin[] = [
  { name: 'Steve', url: 'https://textures.minecraft.net/texture/8667ba71b85a400c6c2b2a3b0e7f3f3f4f5b5f3f2f5f7e0f6c5b4a3928171615' },
  { name: 'Alex', url: 'https://textures.minecraft.net/texture/4c1f7a1e5b4f3c2d1a0e9f8d7c6b5a49382716151413121110ffeeddccbbaa99' },
  ...['Noor', 'Sunny', 'Ari', 'Zuri', 'Makena', 'Kai', 'Efe'].map((name, i) => ({ name, url: `https://mc-heads.net/avatar/${name === 'Noor' ? 'MHF_Villager' : `MHF_${['Villager', 'Zombie', 'Steve', 'Alex', 'Herobrine', 'Creeper', 'Enderman'][i]}`}/96` })),
]
const menuItems = [
  { id: 'single', title: 'Single Player', sub: 'Enter a world of your own', icon: Gamepad2 },
  { id: 'multi', title: 'Multiplayer', sub: 'Join a server with friends', icon: Globe2 },
  { id: 'settings', title: 'Settings', sub: 'Tune your experience', icon: Settings2 },
]

function VoidClient() {
  const [screen, setScreen] = useState('home')
  const [profileOpen, setProfileOpen] = useState(false)
  const [username, setUsername] = useState('Player')
  const [skin, setSkin] = useState<Skin>(presets[0])
  const [fog, setFog] = useState(55)
  const [animations, setAnimations] = useState(true)
  const [fps, setFps] = useState(true)
  const [server, setServer] = useState('')

  useEffect(() => {
    try {
      const saved = localStorage.getItem('void-client-profile')
      if (saved) { const parsed = JSON.parse(saved); setUsername(parsed.username || 'Player'); setSkin(parsed.skin || presets[0]) }
      const prefs = localStorage.getItem('void-client-settings')
      if (prefs) { const parsed = JSON.parse(prefs); setFog(parsed.fog ?? 55); setAnimations(parsed.animations ?? true); setFps(parsed.fps ?? true) }
    } catch { /* Ignore malformed local preferences. */ }
  }, [])
  const saveProfile = (nextName = username, nextSkin = skin) => {
    setUsername(nextName); setSkin(nextSkin)
    localStorage.setItem('void-client-profile', JSON.stringify({ username: nextName, skin: nextSkin }))
  }
  const saveSettings = (next: { fog?: number; animations?: boolean; fps?: boolean }) => {
    const settings = { fog, animations, fps, ...next }
    setFog(settings.fog); setAnimations(settings.animations); setFps(settings.fps)
    localStorage.setItem('void-client-settings', JSON.stringify(settings))
  }
  const uploadSkin = (file?: File) => {
    if (!file) return
    if (!file.type.includes('png')) { toast.error('Choose a PNG skin file.'); return }
    const image = new Image()
    const url = URL.createObjectURL(file)
    image.onload = () => {
      if (image.width !== 64 || image.height !== 64) { toast.error('Minecraft skins must be 64 × 64 pixels.'); URL.revokeObjectURL(url); return }
      const reader = new FileReader()
      reader.onload = () => { saveProfile(username, { name: 'Custom skin', url: String(reader.result) }); toast.success('Skin updated') }
      reader.readAsDataURL(file)
    }
    image.src = url
  }
  const choose = (id: string) => setScreen(id)
  const goBack = () => setScreen('home')

  return <main className="void-stage relative min-h-dvh overflow-hidden bg-background text-foreground">
    <div className="mist mist-one" /><div className="mist mist-two" /><div className="mist mist-three" />
    <div className="noise-layer" />
    <header className="absolute right-6 top-6 z-20 flex items-center gap-3 sm:right-10 sm:top-9">
      <div className="hidden text-right sm:block"><div className="text-[10px] uppercase tracking-[.28em] text-muted-foreground">Playing as</div><div className="mt-1 text-sm font-medium">{username}</div></div>
      <button onClick={() => setProfileOpen(true)} aria-label="Edit player profile" className="group rounded-[1.4rem] border border-white/10 bg-white/[.055] p-2 shadow-xl backdrop-blur-xl transition hover:-translate-y-0.5 hover:border-white/25 hover:bg-white/[.09]">
        <div className="relative grid size-[4.4rem] place-items-center overflow-hidden rounded-[1rem] bg-gradient-to-br from-white/10 to-transparent"><img className="pixel-head" src={skin.url} alt={`${skin.name} skin head`} /><span className="absolute bottom-1 right-1 size-1.5 rounded-full bg-white/80 shadow-[0_0_9px_white]" /></div>
      </button>
    </header>

    <AnimatePresence mode="wait">
      {screen === 'home' ? <motion.section key="home" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0, scale: .985 }} className="relative min-h-dvh">
        <div className="absolute bottom-9 left-6 z-10 flex w-[min(19rem,calc(100%-3rem))] flex-col gap-3 sm:bottom-12 sm:left-12">
          {menuItems.map((item, i) => <motion.button key={item.id} initial={{ opacity: 0, x: -18 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: .14 + i * .09 }} onClick={() => choose(item.id)} className="group flex items-center gap-4 rounded-[1.35rem] border border-white/[.09] bg-white/[.055] px-5 py-4 text-left shadow-[0_14px_40px_rgba(0,0,0,.25)] backdrop-blur-xl transition duration-300 hover:translate-x-1 hover:border-white/20 hover:bg-white/[.095] active:scale-[.98]">
            <span className="grid size-10 shrink-0 place-items-center rounded-[.9rem] bg-white/[.07] text-white/70 transition group-hover:bg-white/[.14] group-hover:text-white"><item.icon className="size-[18px]" /></span><span className="min-w-0 flex-1"><span className="block text-[15px] font-medium tracking-wide">{item.title}</span><span className="mt-1 block text-xs text-white/40">{item.sub}</span></span><ChevronRight className="size-4 text-white/30 transition group-hover:translate-x-1 group-hover:text-white/80" />
          </motion.button>)}
          <div className="mt-2 flex items-center gap-2 pl-2 font-mono text-[9px] uppercase tracking-[.22em] text-white/30"><span className="size-1.5 rounded-full bg-white/60 shadow-[0_0_8px_white]" /> Client interface ready <span className="ml-auto">v1.21</span></div>
        </div>
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: .9, delay: .08 }} className="absolute right-7 top-[34%] z-10 max-w-[min(37rem,calc(100%-3.5rem))] text-right sm:right-12 lg:right-[10%]">
          <div className="mb-5 font-mono text-[10px] uppercase tracking-[.45em] text-white/35">A quieter kind of adventure</div><h1 className="void-title text-6xl font-bold leading-[.88] tracking-[-.07em] sm:text-8xl lg:text-[7.7rem]">Void<br /><span>Client</span></h1><p className="ml-auto mt-7 max-w-sm text-sm leading-6 text-white/45 sm:text-base">Your world, without the noise.<br />A minimal launcher for Eaglercraft 1.21.</p>
          <div className="mt-8 flex justify-end gap-2"><span className="rounded-full border border-white/10 bg-white/[.04] px-3 py-1.5 font-mono text-[9px] uppercase tracking-widest text-white/40">Browser client</span><span className="rounded-full border border-white/10 bg-white/[.04] px-3 py-1.5 font-mono text-[9px] uppercase tracking-widest text-white/40">1.21</span></div>
        </motion.div>
        <div className="absolute bottom-5 right-6 font-mono text-[9px] uppercase tracking-[.28em] text-white/20 sm:bottom-8 sm:right-10">The night is yours</div>
      </motion.section> : <motion.section key={screen} initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} className="relative z-10 mx-auto flex min-h-dvh w-full max-w-5xl flex-col justify-center px-6 py-24 sm:px-10">
        <button onClick={goBack} className="mb-8 flex w-fit items-center gap-2 rounded-full border border-white/10 bg-white/[.045] px-4 py-2 text-sm text-white/60 transition hover:bg-white/10 hover:text-white"><ArrowLeft className="size-4" /> Main menu</button>
        <div className="rounded-[2rem] border border-white/10 bg-black/40 p-6 shadow-2xl backdrop-blur-2xl sm:p-10">
          {screen === 'single' && <><div className="font-mono text-[10px] uppercase tracking-[.32em] text-white/35">Solo adventure</div><h2 className="mt-3 font-serif text-4xl tracking-tight sm:text-5xl">Single Player</h2><p className="mt-3 max-w-lg text-sm leading-6 text-white/45">Create a private world and start exploring. Your player profile will be used in-game.</p><div className="mt-9 grid gap-4 sm:grid-cols-[1fr_auto] sm:items-end"><label className="block text-xs uppercase tracking-widest text-white/45">World name<input defaultValue="New World" className="mt-2 block w-full rounded-2xl border border-white/10 bg-white/[.04] px-4 py-3 text-sm text-white outline-none transition focus:border-white/30" /></label><button onClick={() => toast('Game instance is not connected yet', { description: 'Connect an Eaglercraft 1.21 game build to enable launching.' })} className="flex items-center justify-center gap-3 rounded-2xl bg-white px-6 py-3.5 text-sm font-semibold text-black transition hover:bg-white/85 active:scale-[.98]">Create world <ChevronRight className="size-4" /></button></div><div className="mt-7 rounded-2xl border border-white/[.07] bg-white/[.025] p-4 text-xs leading-5 text-white/35">The launcher interface is ready; a playable game requires an Eaglercraft 1.21 client build.</div></>}
          {screen === 'multi' && <><div className="font-mono text-[10px] uppercase tracking-[.32em] text-white/35">Play together</div><h2 className="mt-3 font-serif text-4xl tracking-tight sm:text-5xl">Multiplayer</h2><p className="mt-3 max-w-lg text-sm leading-6 text-white/45">Add a server address to keep your favorite worlds close.</p><div className="mt-8 flex flex-col gap-3 sm:flex-row"><input value={server} onChange={e => setServer(e.target.value)} placeholder="Server address" className="min-w-0 flex-1 rounded-2xl border border-white/10 bg-white/[.04] px-4 py-3 text-sm text-white outline-none placeholder:text-white/25 focus:border-white/30" /><button onClick={() => server.trim() ? toast('Server saved', { description: 'This entry is kept for this session.' }) : toast.error('Enter a server address first.')} className="rounded-2xl bg-white px-6 py-3 text-sm font-semibold text-black transition hover:bg-white/85 active:scale-[.98]">Add server</button></div><div className="mt-5 rounded-2xl border border-dashed border-white/10 px-5 py-8 text-center text-sm text-white/35">No servers added yet</div></>}
          {screen === 'settings' && <><div className="font-mono text-[10px] uppercase tracking-[.32em] text-white/35">Make it yours</div><h2 className="mt-3 font-serif text-4xl tracking-tight sm:text-5xl">Settings</h2><p className="mt-3 text-sm text-white/45">Your preferences are saved in this browser.</p><div className="mt-8 space-y-6">{[["Fog intensity", fog, (v: number) => saveSettings({ fog: v })] as const].map(([label, value, onChange]) => <label key={label} className="block"><span className="flex justify-between text-sm"><span>{label}</span><span className="text-white/45">{value}%</span></span><input type="range" min="0" max="100" value={value} onChange={e => onChange(Number(e.target.value))} className="mt-3 w-full accent-white" /></label>)}<ToggleRow title="Animations" description="Atmospheric movement and transitions" value={animations} onChange={v => saveSettings({ animations: v })} /><ToggleRow title="FPS display" description="Show a compact performance readout" value={fps} onChange={v => saveSettings({ fps: v })} /></div></>}
        </div>
      </motion.section>}
    </AnimatePresence>

    {fps && screen === 'home' && <div className="absolute bottom-8 left-1/2 z-10 hidden -translate-x-1/2 rounded-full border border-white/[.07] bg-black/20 px-3 py-1 font-mono text-[9px] text-white/30 sm:block">FPS —</div>}
    <AnimatePresence>{profileOpen && <motion.div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-4 backdrop-blur-md" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onMouseDown={e => { if (e.target === e.currentTarget) setProfileOpen(false) }}><motion.div initial={{ opacity: 0, y: 18, scale: .98 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 12 }} className="max-h-[90dvh] w-full max-w-xl overflow-y-auto rounded-[2rem] border border-white/10 bg-[#101114]/95 p-6 shadow-2xl sm:p-8"><div className="flex items-start justify-between"><div><div className="font-mono text-[10px] uppercase tracking-[.3em] text-white/35">Your identity</div><h2 className="mt-2 text-2xl font-semibold">Player Edit</h2></div><button onClick={() => setProfileOpen(false)} aria-label="Close profile dialog" className="rounded-full border border-white/10 p-2 text-white/50 hover:bg-white/10 hover:text-white"><X className="size-4" /></button></div><div className="mt-6 flex items-center gap-4 rounded-2xl border border-white/[.08] bg-white/[.035] p-4"><div className="grid size-16 place-items-center rounded-2xl bg-white/[.07]"><img src={skin.url} alt="Selected player skin" className="pixel-head size-12" /></div><div><div className="text-sm font-medium">{skin.name}</div><div className="mt-1 text-xs text-white/40">Selected appearance</div></div></div><label className="mt-6 block text-xs uppercase tracking-widest text-white/45">Username<input value={username} maxLength={16} onChange={e => saveProfile(e.target.value, skin)} className="mt-2 block w-full rounded-2xl border border-white/10 bg-white/[.04] px-4 py-3 text-sm text-white outline-none focus:border-white/30" /></label><div className="mt-6 flex items-center justify-between"><span className="text-xs uppercase tracking-widest text-white/45">Default skins</span><label className="flex cursor-pointer items-center gap-2 rounded-full border border-white/10 px-3 py-2 text-xs text-white/65 transition hover:bg-white/10"><Upload className="size-3.5" /> Upload PNG<input type="file" accept="image/png" className="hidden" onChange={e => uploadSkin(e.target.files?.[0])} /></label></div><div className="mt-3 grid grid-cols-3 gap-2 sm:grid-cols-5">{presets.map(p => <button key={p.name} onClick={() => saveProfile(username, p)} className={`flex flex-col items-center gap-2 rounded-2xl border p-3 transition hover:bg-white/[.07] ${skin.name === p.name ? 'border-white/50 bg-white/[.08]' : 'border-white/[.08] bg-white/[.025]'}`}><img className="pixel-head size-9" src={p.url} alt={`${p.name} preset`} /><span className="text-xs text-white/65">{p.name}</span></button>)}</div><div className="mt-5 text-[11px] leading-5 text-white/35">Custom skins must be 64 × 64 PNG. Your profile is stored only in this browser.</div></motion.div></motion.div>}</AnimatePresence>
  </main>
}

function ToggleRow({ title, description, value, onChange }: { title: string; description: string; value: boolean; onChange: (value: boolean) => void }) {
  return <div className="flex items-center justify-between gap-4"><div><div className="text-sm">{title}</div><div className="mt-1 text-xs text-white/40">{description}</div></div><button role="switch" aria-checked={value} onClick={() => onChange(!value)} className={`relative h-7 w-12 rounded-full border transition ${value ? 'border-white/50 bg-white/25' : 'border-white/15 bg-white/[.05]'}`}><span className={`absolute top-1 size-[18px] rounded-full bg-white transition ${value ? 'left-[25px]' : 'left-1'}`} /></button></div>
}
