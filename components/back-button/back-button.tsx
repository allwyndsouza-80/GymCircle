'use client'

import '@/app/internal.css'
import { ArrowLeft } from 'lucide-react'
import { useRouter } from 'next/navigation'

interface BackButtonProps {
  gymName: string,
  pageName: string
}

export default function BackButton({ gymName, pageName }: BackButtonProps) {
  const router = useRouter()

  return (  
    <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-sm)', marginBottom: 'var(--spacing-md)' }}>
      <button
        onClick={() => router.back()}
        style={{ 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center',
          background: 'transparent',
          border: 'none',
          cursor: 'pointer',
          padding: '8px',
          borderRadius: '4px',
          transition: 'background 0.2s',
          color: 'var(--color-white)'
        }}
        onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(245, 158, 11, 0.1)'}
        onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
      >
        <ArrowLeft size={16} /> 
      </button>
      <span className="gym-section-label">{gymName} {pageName}</span>
    </div>
  )
}