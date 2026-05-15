import React from 'react'
import { Code2, ArrowRight } from 'lucide-react'
import { Link } from 'react-router-dom'

const CodeShare = () => {
  return (
    <div className='bg-gradient-to-br from-indigo-50 to-white w-full p-5 text-slate-800 border-t border-gray-100'>
      <div className='flex items-center gap-2 mb-3'>
        <div className='p-2 bg-indigo-100 rounded-lg text-indigo-600'>
          <Code2 size={20} />
        </div>
        <h3 className='font-bold text-slate-800 text-sm'>Student Code Share</h3>
      </div>
      <p className='text-xs text-slate-600 mb-4'>Share your snippets, ask for help, or collaborate with classmates in real-time.</p>
      <Link to='/code-share' className='w-full py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-semibold transition flex items-center justify-center gap-2 shadow-sm'>
        Open Code Space
        <ArrowRight size={14} />
      </Link>
    </div>
  )
}

export default CodeShare
