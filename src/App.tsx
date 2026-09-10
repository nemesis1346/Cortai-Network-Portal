import { ToastProvider } from '@/components/ui'
import { ThemeProvider } from '@/theme/ThemeProvider'
import { ActionLauncherProvider } from '@/shell/ActionLauncherContext'
import { AppShell } from '@/shell/AppShell'
import { AuthProvider, useAuth } from '@/shell/AuthContext'
import { Login } from '@/shell/Login'

function Gate() {
  const { status } = useAuth()

  if (status === 'loading') return null
  if (status === 'unauthenticated') return <Login />

  return (
    <ActionLauncherProvider>
      <AppShell />
    </ActionLauncherProvider>
  )
}

export default function App() {
  return (
    <AuthProvider>
      <ThemeProvider>
        <ToastProvider>
          <Gate />
        </ToastProvider>
      </ThemeProvider>
    </AuthProvider>
  )
}