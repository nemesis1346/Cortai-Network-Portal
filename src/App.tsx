import { ToastProvider } from '@/components/ui'
import { ThemeProvider } from '@/theme/ThemeProvider'
import { AppShell } from '@/shell/AppShell'

export default function App() {
  return (
    <ThemeProvider>
      <ToastProvider>
        <AppShell />
      </ToastProvider>
    </ThemeProvider>
  )
}