import { useEffect, useState } from 'react'

const prefersReducedMotion = () =>
  typeof matchMedia === 'function' && matchMedia('(prefers-reduced-motion: reduce)').matches

interface TypewriterState {
  renderedHtml: string
  done: boolean
}

/**
 * Token-by-token reveal of an HTML string — tags are inserted instantly so markup
 * never breaks mid-render, only whitespace-delimited word tokens are paced.
 * Instant if html is null or the OS prefers reduced motion.
 */
export function useTypewriter(html: string | null, tokenDelayMs = 26): TypewriterState {
  const [state, setState] = useState<TypewriterState>({ renderedHtml: '', done: false })

  useEffect(() => {
    if (html === null) {
      setState({ renderedHtml: '', done: false })
      return
    }
    if (prefersReducedMotion()) {
      setState({ renderedHtml: html, done: true })
      return
    }

    setState({ renderedHtml: '', done: false })
    const tokens = html.split(/(<[^>]+>|\s+)/).filter(Boolean)
    let index = 0
    let out = ''
    let cancelled = false

    const step = () => {
      if (cancelled) return
      if (index >= tokens.length) {
        setState({ renderedHtml: out, done: true })
        return
      }
      const token = tokens[index]
      out += token
      index += 1
      setState({ renderedHtml: out, done: false })
      setTimeout(step, token.startsWith('<') ? 0 : tokenDelayMs)
    }
    step()

    return () => {
      cancelled = true
    }
  }, [html, tokenDelayMs])

  return state
}
