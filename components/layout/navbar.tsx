'use client'

import Link from 'next/link'
import { User } from '@supabase/supabase-js'
import { Dumbbell, Bell, User as UserIcon, LogOut } from 'lucide-react'
import { APP_NAME } from '@/lib/constants'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import '@/app/landing.css'
import '@/app/internal.css'

export function Navbar({ user }: { user: User }) {
  const router = useRouter()
  const [showDropdown, setShowDropdown] = useState(false)
  const [firstName, ...restName] = APP_NAME.split(' ')
  const restOfName = restName.join(' ')

  const handleSignOut = async () => {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push('/')
  }

  return (
    <header className="gym-header">
      <div className="gym-header-inner">
        <Link href="/dashboard" className="gym-logo" aria-label="Dashboard">
          <div className="gym-logo-icon" aria-hidden="true">
            <Dumbbell size={18} color="#000" strokeWidth={2.5} />
          </div>
          <span className="gym-logo-text">
            {firstName}
            {restOfName && <span>{restOfName}</span>}
          </span>
        </Link>

        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-sm)' }}>
          <Link
            href="/notifications"
            style={{
              display: 'flex',
              width: '40px',
              height: '40px',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'background 0.2s',
            }}
            onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(245, 158, 11, 0.1)'}
            onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
          >
            <Bell size={20} color="#666" />
          </Link>

          <div style={{ position: 'relative' }}>
            <button
              onClick={() => setShowDropdown(!showDropdown)}
              style={{
                display: 'flex',
                width: '40px',
                height: '40px',
                alignItems: 'center',
                justifyContent: 'center',
                background: 'rgba(245, 158, 11, 0.1)',
                border: 'none',
                cursor: 'pointer',
                clipPath: 'polygon(6px 0%, 100% 0%, calc(100% - 6px) 100%, 0% 100%)',
                transition: 'background 0.2s',
              }}
              onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(245, 158, 11, 0.2)'}
              onMouseLeave={(e) => !showDropdown && (e.currentTarget.style.background = 'rgba(245, 158, 11, 0.1)')}
            >
              {user.user_metadata?.avatar_url ? (
                <img
                  src={user.user_metadata.avatar_url}
                  alt={user.user_metadata?.full_name || 'User'}
                  style={{
                    width: '40px',
                    height: '40px',
                    objectFit: 'cover',
                    clipPath: 'polygon(6px 0%, 100% 0%, calc(100% - 6px) 100%, 0% 100%)',
                  }}
                />
              ) : (
                <UserIcon size={20} color="var(--color-primary)" />
              )}
            </button>

            {showDropdown && (
              <div style={{
                position: 'absolute',
                right: 0,
                marginTop: 'var(--spacing-sm)',
                width: '220px',
                background: 'var(--color-panel)',
                border: '1px solid var(--color-border)',
                zIndex: 1000,
              }}>
                <div style={{
                  padding: 'var(--spacing-sm)',
                  borderBottom: '1px solid var(--color-border)',
                }}>
                  <p style={{
                    fontSize: '13px',
                    fontWeight: 600,
                    color: 'var(--color-white)',
                    marginBottom: '4px',
                    letterSpacing: '0.02em',
                  }}>
                    {user.user_metadata?.full_name || 'User'}
                  </p>
                  <p style={{
                    fontSize: '11px',
                    color: '#666',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                  }}>
                    {user.email}
                  </p>
                </div>
                <div style={{ padding: '4px 0' }}>
                  <Link
                    href="/profile"
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 'var(--spacing-xs)',
                      padding: '10px var(--spacing-sm)',
                      fontSize: '12px',
                      fontWeight: 600,
                      letterSpacing: '0.05em',
                      textTransform: 'uppercase',
                      color: '#888',
                      textDecoration: 'none',
                      transition: 'all 0.2s',
                    }}
                    onClick={() => setShowDropdown(false)}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = 'rgba(245, 158, 11, 0.05)'
                      e.currentTarget.style.color = 'var(--color-primary)'
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = 'transparent'
                      e.currentTarget.style.color = '#888'
                    }}
                  >
                    <UserIcon size={14} />
                    Profile
                  </Link>
                  <button
                    onClick={handleSignOut}
                    style={{
                      display: 'flex',
                      width: '100%',
                      alignItems: 'center',
                      gap: 'var(--spacing-xs)',
                      padding: '10px var(--spacing-sm)',
                      fontSize: '12px',
                      fontWeight: 600,
                      letterSpacing: '0.05em',
                      textTransform: 'uppercase',
                      color: '#EF4444',
                      background: 'transparent',
                      border: 'none',
                      cursor: 'pointer',
                      transition: 'all 0.2s',
                      textAlign: 'left',
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = 'rgba(239, 68, 68, 0.05)'
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = 'transparent'
                    }}
                  >
                    <LogOut size={14} />
                    Sign Out
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  )
}
