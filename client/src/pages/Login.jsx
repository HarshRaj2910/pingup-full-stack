import React from 'react'
import { assets } from '../assets/assets'
import { Star, ShieldCheck, Zap, Activity, Users, ArrowRight, Code2 } from 'lucide-react'
import { SignIn } from '@clerk/clerk-react'

const Login = () => {
  return (
    <div className='min-h-screen bg-slate-50 font-sans selection:bg-indigo-500 selection:text-white'>
      
      {/* Navbar */}
      <nav className='absolute top-0 w-full flex items-center justify-between p-6 lg:px-20 z-50'>
          <div className='flex items-center gap-2'>
              <img src={assets.logo} alt="PingUp Logo" className='h-8 lg:h-10 object-contain hover:scale-105 transition-transform duration-300'/>
          </div>
          <div className='hidden md:flex gap-8 text-sm font-medium text-slate-600'>
              <a href="#features" className='hover:text-indigo-600 transition-colors'>Features</a>
              <a href="#testimonials" className='hover:text-indigo-600 transition-colors'>Testimonials</a>
          </div>
          <a href="#login" className='bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2.5 rounded-full text-sm font-bold shadow-lg shadow-indigo-600/30 transition-all hover:scale-105 active:scale-95'>
              Get Started
          </a>
      </nav>

      {/* Hero Section */}
      <section className='relative pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden'>
        <div className='absolute inset-0 bg-[url("https://www.transparenttextures.com/patterns/cubes.png")] opacity-5'></div>
        <div className='absolute top-0 right-0 -mr-20 -mt-20 w-[500px] h-[500px] bg-purple-400/30 blur-[120px] rounded-full pointer-events-none'></div>
        <div className='absolute bottom-0 left-0 -ml-20 -mb-20 w-[600px] h-[600px] bg-indigo-500/20 blur-[150px] rounded-full pointer-events-none'></div>
        
        <div className='max-w-7xl mx-auto px-6 lg:px-20 flex flex-col lg:flex-row items-center gap-16 relative z-10'>
          
          {/* Left Text */}
          <div className='flex-1 text-center lg:text-left'>
            <div className='inline-flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-100 text-indigo-700 font-semibold text-xs mb-6 border border-indigo-200 shadow-sm animate-bounce'>
              <span className='w-2 h-2 rounded-full bg-indigo-600 animate-pulse'></span>
              PingUp 2.0 is Here!
            </div>
            
            <h1 className='text-5xl lg:text-7xl font-extrabold text-slate-900 leading-tight mb-6 tracking-tight'>
              Connect, Code & <br/> <span className='bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent'>Collaborate.</span>
            </h1>
            
            <p className='text-lg lg:text-xl text-slate-600 mb-10 max-w-2xl mx-auto lg:mx-0 leading-relaxed'>
              The ultimate platform for developers, indie hackers, and students to monitor uptime, share code, and build a global network. Simple, fast, and powerful.
            </p>
            
            <div className='flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4'>
              <a href="#login" className='flex items-center justify-center gap-2 bg-slate-900 hover:bg-slate-800 text-white px-8 py-4 rounded-xl font-bold text-lg w-full sm:w-auto shadow-xl shadow-slate-900/20 transition-all hover:-translate-y-1 group'>
                Start Building Free
                <ArrowRight className='w-5 h-5 group-hover:translate-x-1 transition-transform'/>
              </a>
              <a href="#features" className='flex items-center justify-center gap-2 bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 px-8 py-4 rounded-xl font-bold text-lg w-full sm:w-auto transition-all'>
                See How It Works
              </a>
            </div>

            <div className='mt-12 flex flex-col sm:flex-row items-center gap-4 justify-center lg:justify-start'>
                <div className='flex -space-x-3'>
                    <img src="https://i.pravatar.cc/100?img=1" className='w-10 h-10 rounded-full border-2 border-white' alt=""/>
                    <img src="https://i.pravatar.cc/100?img=2" className='w-10 h-10 rounded-full border-2 border-white' alt=""/>
                    <img src="https://i.pravatar.cc/100?img=3" className='w-10 h-10 rounded-full border-2 border-white' alt=""/>
                    <div className='w-10 h-10 rounded-full border-2 border-white bg-slate-100 flex items-center justify-center text-xs font-bold text-slate-600'>+2k</div>
                </div>
                <div className='text-sm text-slate-600'>
                    <div className='flex text-amber-400 mb-1'>
                        {Array(5).fill(0).map((_, i) => <Star key={i} className='w-4 h-4 fill-current'/>)}
                    </div>
                    Loved by <span className='font-bold text-slate-900'>12,000+</span> developers
                </div>
            </div>
          </div>

          {/* Right Visuals */}
          <div className='flex-1 w-full relative'>
             <div className='relative rounded-2xl bg-white p-2 shadow-2xl border border-slate-100 transform lg:rotate-2 hover:rotate-0 transition-transform duration-500'>
                <div className='bg-slate-900 rounded-xl overflow-hidden shadow-inner'>
                  <div className='flex items-center gap-2 px-4 py-3 bg-slate-800 border-b border-slate-700'>
                      <div className='w-3 h-3 rounded-full bg-red-500'></div>
                      <div className='w-3 h-3 rounded-full bg-amber-500'></div>
                      <div className='w-3 h-3 rounded-full bg-green-500'></div>
                      <div className='ml-4 px-3 py-1 bg-slate-700 rounded-md text-xs text-slate-300 flex items-center gap-2'>
                        <ShieldCheck className='w-3 h-3 text-green-400'/> Admin Dashboard
                      </div>
                  </div>
                  <div className='p-6 h-[300px] flex flex-col gap-4 relative'>
                      <div className='flex items-center justify-between'>
                          <div>
                              <p className='text-slate-400 text-xs font-medium uppercase tracking-wider mb-1'>Total Users</p>
                              <h3 className='text-white text-3xl font-bold'>12,492</h3>
                          </div>
                          <Activity className='w-10 h-10 text-indigo-500 opacity-50'/>
                      </div>
                      <div className='w-full h-32 mt-4 flex items-end gap-2'>
                          {[40, 60, 30, 80, 50, 90, 70, 100].map((h, i)=>(
                              <div key={i} className='flex-1 bg-gradient-to-t from-indigo-600 to-indigo-400 rounded-t-sm hover:from-purple-500 transition-colors cursor-pointer' style={{height: `${h}%`}}></div>
                          ))}
                      </div>
                      {/* Floating Element */}
                      <div className='absolute -right-6 -bottom-6 bg-white p-4 rounded-xl shadow-xl border border-slate-100 flex items-center gap-4 animate-pulse'>
                          <div className='w-10 h-10 bg-green-100 rounded-full flex items-center justify-center'>
                              <Code2 className='w-5 h-5 text-green-600'/>
                          </div>
                          <div>
                              <p className='text-slate-900 font-bold text-sm'>Live Collab</p>
                              <p className='text-slate-500 text-xs'>Syncing code...</p>
                          </div>
                      </div>
                  </div>
                </div>
             </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className='py-24 bg-white relative'>
          <div className='max-w-7xl mx-auto px-6 lg:px-20'>
              <div className='text-center max-w-3xl mx-auto mb-16'>
                  <h2 className='text-3xl lg:text-4xl font-bold text-slate-900 mb-4'>Everything you need to ship faster</h2>
                  <p className='text-lg text-slate-600'>Built for speed, collaboration, and modern workflows. PingUp brings developers together.</p>
              </div>

              <div className='grid grid-cols-1 md:grid-cols-3 gap-8'>
                  {/* Feature 1 */}
                  <div className='p-8 rounded-2xl bg-slate-50 border border-slate-100 hover:border-indigo-200 hover:shadow-lg transition-all group'>
                      <div className='w-14 h-14 bg-indigo-100 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform'>
                          <Code2 className='w-7 h-7 text-indigo-600'/>
                      </div>
                      <h3 className='text-xl font-bold text-slate-900 mb-3'>Live Code Collaboration</h3>
                      <p className='text-slate-600 leading-relaxed'>Work together in real-time. Share code snippets, debug together, and sync instantly across multiple languages.</p>
                  </div>
                  {/* Feature 2 */}
                  <div className='p-8 rounded-2xl bg-slate-50 border border-slate-100 hover:border-purple-200 hover:shadow-lg transition-all group'>
                      <div className='w-14 h-14 bg-purple-100 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform'>
                          <Activity className='w-7 h-7 text-purple-600'/>
                      </div>
                      <h3 className='text-xl font-bold text-slate-900 mb-3'>Simple Uptime Monitoring</h3>
                      <p className='text-slate-600 leading-relaxed'>Keep track of your projects and incidents. Perfect for indie hackers and startups who need fast setups.</p>
                  </div>
                  {/* Feature 3 */}
                  <div className='p-8 rounded-2xl bg-slate-50 border border-slate-100 hover:border-pink-200 hover:shadow-lg transition-all group'>
                      <div className='w-14 h-14 bg-pink-100 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform'>
                          <Users className='w-7 h-7 text-pink-600'/>
                      </div>
                      <h3 className='text-xl font-bold text-slate-900 mb-3'>Global Network</h3>
                      <p className='text-slate-600 leading-relaxed'>Connect with peers, share updates, post videos, and grow your professional presence effortlessly.</p>
                  </div>
              </div>
          </div>
      </section>

      {/* Login / CTA Section */}
      <section id="login" className='py-24 bg-slate-900 relative overflow-hidden'>
          <div className='absolute inset-0 bg-indigo-900/20 blur-3xl rounded-full w-[800px] h-[800px] -top-96 -right-20 pointer-events-none'></div>
          <div className='max-w-7xl mx-auto px-6 lg:px-20 flex flex-col lg:flex-row items-center justify-between gap-16 relative z-10'>
              
              <div className='flex-1 text-center lg:text-left'>
                  <h2 className='text-3xl lg:text-5xl font-bold text-white mb-6'>Join the Developer Network.</h2>
                  <p className='text-lg text-indigo-200 mb-8 max-w-lg mx-auto lg:mx-0'>Create your account in seconds. Start collaborating, monitoring, and sharing with a community that understands you.</p>
                  
                  <div className='flex items-center gap-4 justify-center lg:justify-start text-white/80 text-sm'>
                      <div className='flex items-center gap-2'><Zap className='w-4 h-4 text-amber-400'/> Fast Setup</div>
                      <div className='flex items-center gap-2'><ShieldCheck className='w-4 h-4 text-green-400'/> Secure via Clerk</div>
                  </div>
              </div>

              <div className='flex-1 w-full max-w-md bg-white p-8 rounded-3xl shadow-2xl relative'>
                  <div className='absolute -top-6 -left-6 bg-indigo-600 text-white text-xs font-bold px-4 py-2 rounded-full shadow-lg transform -rotate-12'>Free Forever for Students</div>
                  <SignIn />
                  <div className='mt-6 text-center'>
                      <p className='text-xs text-slate-400'>By joining, you agree to our Terms of Service. If form is missing, check your <code className='bg-slate-100 px-1 rounded'>.env</code> for Clerk Keys.</p>
                  </div>
              </div>

          </div>
      </section>
      
      {/* Footer */}
      <footer className='py-10 bg-slate-950 text-center text-slate-500 text-sm border-t border-slate-800'>
          <p>© 2026 PingUp. Built for Developers.</p>
      </footer>
    </div>
  )
}

export default Login
