import { useTheme } from '@/theme/ThemeProvider'

export function TopBar() {
  const { theme, toggleTheme } = useTheme()

  return (
    <header
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 16,
        padding: '14px 24px',
        borderBottom: '1px solid var(--line)',
        background: 'var(--panel)',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'baseline', gap: 8 }}>
        <span style={{ fontFamily: 'var(--disp)', fontWeight: 600, fontSize: 16 }}>COrtai</span>
        <span style={{ fontSize: 12, color: 'var(--text-3)' }}>Network Portal</span>
      </div>
      <div style={{ flex: 1 }} />
      <button
        className="btn"
        onClick={toggleTheme}
        aria-label="Toggle color theme"
        title={theme === 'dark' ? 'Switch to Arctic (light)' : 'Switch to Nocturne (dark)'}
      >
        {theme === 'dark' ? '☾ Nocturne' : '☀ Arctic'}
      </button>
    </header>
  )
}