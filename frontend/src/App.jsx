import { useState } from 'react'
import { Navbar } from './components/Navbar'
import './App.css'

function App() {
  return (
    <div className="app-container">
      <Navbar />
      
      <main className="main-content">
        <div className="hero-section">
          <div className="glow-orb orb-1"></div>
          <div className="glow-orb orb-2"></div>
          
          <h1 className="hero-title">
            Welcome to <span className="text-gradient">Nexus</span>
          </h1>
          <p className="hero-subtitle">
            Experience the future of Web3 integrations with stunning UI, seamless connectivity, and robust smart contract interactions.
          </p>
          
          <div className="hero-actions">
            <button className="btn-primary">Get Started</button>
            <button className="btn-secondary">View Documentation</button>
          </div>
        </div>

        <div className="features-grid">
          <div className="feature-card">
            <div className="feature-icon">🚀</div>
            <h3>Lightning Fast</h3>
            <p>Optimized for performance with Vite and React.</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">🔒</div>
            <h3>Secure by Design</h3>
            <p>Built-in security with Thirdweb standard practices.</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">✨</div>
            <h3>Beautiful UI</h3>
            <p>Glassmorphism, gradients, and modern design principles.</p>
          </div>
        </div>
      </main>
    </div>
  )
}

export default App
