import { useEffect, useState } from 'react'

function formatTime(date: Date): string {
  return date.toLocaleTimeString('en-CA', { hour12: false })
}

/** HH:MM:SS, ticking every second. */
export function useClock(): string {
  const [time, setTime] = useState(() => formatTime(new Date()))

  useEffect(() => {
    const id = setInterval(() => setTime(formatTime(new Date())), 1000)
    return () => clearInterval(id)
  }, [])

  return time
}
