'use client'

import { useState, useMemo } from 'react'

type Member = {
  id: string
  role: string
  status: string
  created_at: string
  user_id: string
  users: { id: string; full_name: string | null; email: string } | null
}

interface MembersTableProps {
  members: Member[]
  isOwner: boolean
  onApprove: (id: string) => Promise<void>
  onReject: (id: string) => Promise<void>
}

const PAGE_SIZE = 10

const STATUS_COLORS: Record<string, string> = {
  approved: '#22c55e',
  pending: '#f59e0b',
  rejected: '#ef4444',
  banned: '#6b7280',
}

export function MembersTable({ members, isOwner, onApprove, onReject }: MembersTableProps) {
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [roleFilter, setRoleFilter] = useState<string>('all')
  const [page, setPage] = useState(1)
  const [loadingId, setLoadingId] = useState<string | null>(null)

  const filtered = useMemo(() => {
    return members.filter((m) => {
      const name = m.users?.full_name?.toLowerCase() ?? ''
      const email = m.users?.email?.toLowerCase() ?? ''
      const q = search.toLowerCase()
      const matchesSearch = !q || name.includes(q) || email.includes(q)
      const matchesStatus = statusFilter === 'all' || m.status === statusFilter
      const matchesRole = roleFilter === 'all' || m.role === roleFilter
      return matchesSearch && matchesStatus && matchesRole
    })
  }, [members, search, statusFilter, roleFilter])

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE))
  const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)

  const handleApprove = async (id: string) => {
    setLoadingId(id)
    await onApprove(id)
    setLoadingId(null)
  }

  const handleReject = async (id: string) => {
    setLoadingId(id)
    await onReject(id)
    setLoadingId(null)
  }

  return (
    <div>
      {/* Filters row */}
      <div style={{
        display: 'flex',
        flexWrap: 'wrap',
        gap: '12px',
        marginBottom: '20px',
        alignItems: 'center',
      }}>
        {/* Search */}
        <input
          type="text"
          placeholder="Search by name or email..."
          value={search}
          onChange={(e) => { setSearch(e.target.value); setPage(1) }}
          className="gym-input"
          style={{ flex: '1', minWidth: '200px', maxWidth: '320px' }}
        />

        {/* Status filter */}
        <select
          value={statusFilter}
          onChange={(e) => { setStatusFilter(e.target.value); setPage(1) }}
          className="gym-input"
          style={{ maxWidth: '160px' }}
        >
          <option value="all">All Statuses</option>
          <option value="approved">Approved</option>
          <option value="pending">Pending</option>
          <option value="rejected">Rejected</option>
          <option value="banned">Banned</option>
        </select>

        {/* Role filter */}
        <select
          value={roleFilter}
          onChange={(e) => { setRoleFilter(e.target.value); setPage(1) }}
          className="gym-input"
          style={{ maxWidth: '140px' }}
        >
          <option value="all">All Roles</option>
          <option value="member">Member</option>
          <option value="admin">Admin</option>
          <option value="owner">Owner</option>
        </select>

        {/* Count */}
        <p style={{ fontSize: '13px', color: '#777', marginLeft: 'auto' }}>
          {filtered.length} member{filtered.length !== 1 ? 's' : ''}
        </p>
      </div>

      {/* Table */}
      {paginated.length === 0 ? (
        <div className="gym-card" style={{ textAlign: 'center', padding: '48px 24px' }}>
          <p style={{ fontSize: '16px', color: '#777', marginBottom: '8px' }}>
            {members.length === 0
              ? 'No members yet.'
              : 'No members match your filters.'}
          </p>
          <p style={{ fontSize: '13px', color: '#555' }}>
            {members.length === 0
              ? 'Once people join your gym, they\'ll appear here.'
              : 'Try adjusting your search or filter criteria.'}
          </p>
        </div>
      ) : (
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '14px' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid #222' }}>
                {['Member', 'Email', 'Role', 'Status', 'Joined'].concat(isOwner ? ['Actions'] : []).map((h) => (
                  <th key={h} style={{
                    textAlign: 'left',
                    padding: '10px 14px',
                    fontSize: '11px',
                    fontWeight: 600,
                    letterSpacing: '0.08em',
                    textTransform: 'uppercase',
                    color: '#666',
                  }}>
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {paginated.map((m) => (
                <tr
                  key={m.id}
                  style={{ borderBottom: '1px solid #111' }}
                  onMouseEnter={(e) => (e.currentTarget.style.background = '#0a0a0a')}
                  onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
                >
                  <td style={{ padding: '14px' }}>
                    <p style={{ fontWeight: 500, color: 'var(--color-white)' }}>
                      {m.users?.full_name || '—'}
                    </p>
                  </td>
                  <td style={{ padding: '14px', color: '#777' }}>
                    {m.users?.email || '—'}
                  </td>
                  <td style={{ padding: '14px' }}>
                    <span className="gym-badge">{m.role}</span>
                  </td>
                  <td style={{ padding: '14px' }}>
                    <span style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '6px',
                      fontSize: '12px',
                      fontWeight: 500,
                      color: STATUS_COLORS[m.status] ?? '#777',
                      textTransform: 'capitalize',
                    }}>
                      <span style={{
                        width: '6px',
                        height: '6px',
                        borderRadius: '50%',
                        background: STATUS_COLORS[m.status] ?? '#777',
                        display: 'inline-block',
                      }} />
                      {m.status}
                    </span>
                  </td>
                  <td style={{ padding: '14px', color: '#777', fontSize: '13px' }}>
                    {new Date(m.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                  </td>
                  {isOwner && (
                    <td style={{ padding: '14px' }}>
                      {m.status === 'pending' ? (
                        <div style={{ display: 'flex', gap: '8px' }}>
                          <button
                            onClick={() => handleApprove(m.id)}
                            disabled={loadingId === m.id}
                            className="gym-btn gym-btn-primary"
                            style={{ padding: '4px 12px', fontSize: '11px' }}
                          >
                            {loadingId === m.id ? '...' : 'Approve'}
                          </button>
                          <button
                            onClick={() => handleReject(m.id)}
                            disabled={loadingId === m.id}
                            className="gym-btn gym-btn-secondary"
                            style={{ padding: '4px 12px', fontSize: '11px' }}
                          >
                            Reject
                          </button>
                        </div>
                      ) : (
                        <span style={{ color: '#444', fontSize: '12px' }}>—</span>
                      )}
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginTop: '20px',
          fontSize: '13px',
          color: '#777',
        }}>
          <p>
            Showing {(page - 1) * PAGE_SIZE + 1}–{Math.min(page * PAGE_SIZE, filtered.length)} of {filtered.length}
          </p>
          <div style={{ display: 'flex', gap: '8px' }}>
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
              className="gym-btn gym-btn-secondary"
              style={{ padding: '4px 12px', fontSize: '12px', opacity: page === 1 ? 0.4 : 1 }}
            >
              Prev
            </button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
              <button
                key={p}
                onClick={() => setPage(p)}
                className={p === page ? 'gym-btn gym-btn-primary' : 'gym-btn gym-btn-secondary'}
                style={{ padding: '4px 10px', fontSize: '12px', minWidth: '32px' }}
              >
                {p}
              </button>
            ))}
            <button
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              className="gym-btn gym-btn-secondary"
              style={{ padding: '4px 12px', fontSize: '12px', opacity: page === totalPages ? 0.4 : 1 }}
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  )
}