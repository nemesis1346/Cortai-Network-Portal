import { ToastProvider } from '@/components/ui'
import { ThemeProvider } from '@/theme/ThemeProvider'
import { ActionLauncherProvider } from '@/shell/ActionLauncherContext'
import { AppShell } from '@/shell/AppShell'

export default function App() {
  return (
    <ThemeProvider>
      <ToastProvider>
        <ActionLauncherProvider>
          <AppShell />
        </ActionLauncherProvider>
      </ToastProvider>
    </ThemeProvider>
  )
}