import { MountainSnow } from 'lucide-react'
import { SiteLayout } from './components/layout/SiteLayout'
import './App.css'

function App() {
  return (
    <SiteLayout>
      <section className="landing-hero" aria-labelledby="hero-heading">
        <p className="kicker">A little focus. A higher summit.</p>
        <h1 id="hero-heading">Turn focus time into a mountain climb.</h1>
        <p className="hero-description">
          Meet Summitodoro: a mountain-inspired Pomodoro experience in the making.
          A calmer way to approach your work, one focused step at a time.
        </p>
        <div className="mountain-scene" aria-hidden="true">
          <MountainSnow strokeWidth={0.8} />
          <span>Small steps. Steady progress.</span>
        </div>
      </section>

      <section className="feature-grid" aria-label="Planned Summitodoro features">
        <article className="feature-card">
          <span className="kicker">01 / Planned</span>
          <h2>Pick your trail</h2>
          <p>
            Virtual routes inspired by Philippine mountains will bring a little
            adventure to your desk. Choose a mountain and give your work a mission.
          </p>
        </article>
        <article className="feature-card">
          <span className="kicker">02 / Planned</span>
          <h2>Set your pace</h2>
          <p>
            Planned Pomodoro sessions will divide your mission into focused
            checkpoints, with rest stops for a well-earned break.
          </p>
        </article>
        <article className="feature-card">
          <span className="kicker">03 / Planned</span>
          <h2>Reach the summit</h2>
          <p>
            Each completed focus session will move your virtual hiker closer to
            the summit. Build momentum through small, manageable steps.
          </p>
        </article>
      </section>

      <aside className="route-note" aria-labelledby="route-note-heading">
        <h2 id="route-note-heading">Built for focused work</h2>
        <p>
          Summitodoro is a virtual productivity experience. Its simplified routes
          are not hiking navigation, access information, or safety guidance.
        </p>
      </aside>
    </SiteLayout>
  )
}

export default App
