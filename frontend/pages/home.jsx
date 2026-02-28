import React from 'react'

const Home = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#071034] via-[#0b3a73] to-[#081a3a] text-white">
      <div className="max-w-6xl mx-auto px-6 py-12">
        <header className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-md bg-gradient-to-r from-blue-400 to-indigo-500 flex items-center justify-center font-bold">HC</div>
            <div className="text-xl font-semibold">HatchChat</div>
          </div>

          <nav className="flex items-center gap-4">
            <a href="#features" className="text-white/80 hover:underline text-sm">Features</a>
            <a href="/login" className="text-white/80 hover:underline text-sm">Sign in</a>
            <a href="/signup" className="px-4 py-2 rounded-lg bg-gradient-to-r from-blue-400 to-indigo-500 text-sm font-semibold shadow">Get started</a>
          </nav>
        </header>

        <main className="mt-16 grid md:grid-cols-2 gap-10 items-center">
          <div>
            <h1 className="text-4xl md:text-5xl font-extrabold leading-tight">Build delightful chat experiences, fast.</h1>
            <p className="mt-4 text-white/80">Secure messaging, realtime updates, and beautiful UI components — all designed to help your team ship faster.</p>
            <div className="mt-6 flex gap-4">
              <a href="/signup" className="px-6 py-3 rounded-lg bg-gradient-to-r from-blue-400 to-indigo-500 font-semibold shadow">Get started — it's free</a>
              <a href="#features" className="px-6 py-3 rounded-lg border border-white/10 text-white/90">See features</a>
            </div>

            <div className="mt-8 grid grid-cols-2 gap-3 text-sm text-white/70">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-white/6 flex items-center justify-center">🚀</div>
                <div>
                  <div className="font-semibold">Realtime</div>
                  <div className="text-xs">Low-latency messaging built for scale</div>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-white/6 flex items-center justify-center">🔒</div>
                <div>
                  <div className="font-semibold">Secure</div>
                  <div className="text-xs">End-to-end patterns and safe defaults</div>
                </div>
              </div>
            </div>
          </div>

          <div>
            <div className="p-6 rounded-2xl bg-white/6 backdrop-blur-md border border-white/10 shadow-xl">
              <div className="h-80 rounded-lg bg-gradient-to-br from-white/5 to-white/3 p-4 flex flex-col justify-between">
                <div className="text-sm text-white/80">General • 12 members</div>
                <div className="flex-1 mt-4 overflow-auto">
                  <div className="space-y-3">
                    <div className="text-sm text-white/90">Ali: Hey — check out the new release ✨</div>
                    <div className="text-sm text-white/80">Jamie: Looks great — love the animations.</div>
                    <div className="text-sm text-white/80">Morgan: Deployed to staging.</div>
                  </div>
                </div>
                <div className="mt-4 flex items-center gap-2">
                  <input className="flex-1 px-3 py-2 rounded-lg bg-white/5 border border-white/10 placeholder-white/40 outline-none" placeholder="Write a message" />
                  <button className="px-4 py-2 rounded-lg bg-blue-500 text-white">Send</button>
                </div>
              </div>
            </div>
          </div>
        </main>

        <section id="features" className="mt-14 grid md:grid-cols-3 gap-6">
          <div className="p-6 rounded-2xl bg-white/6 backdrop-blur-md border border-white/10">
            <h3 className="font-semibold">Realtime Sync</h3>
            <p className="mt-2 text-sm text-white/80">Keep users in sync across devices with minimal setup.</p>
          </div>

          <div className="p-6 rounded-2xl bg-white/6 backdrop-blur-md border border-white/10">
            <h3 className="font-semibold">Customizable UI</h3>
            <p className="mt-2 text-sm text-white/80">Easy to theme components to match your brand.</p>
          </div>

          <div className="p-6 rounded-2xl bg-white/6 backdrop-blur-md border border-white/10">
            <h3 className="font-semibold">Secure by Default</h3>
            <p className="mt-2 text-sm text-white/80">Best practices for auth and data protection.</p>
          </div>
        </section>

        <footer className="mt-12 text-center text-white/60">© 2026 HatchChat. All rights reserved.</footer>
      </div>
    </div>
  )
}

export default Home