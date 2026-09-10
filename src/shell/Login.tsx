import { useState, type FormEvent } from 'react'
import { errorMessage, portalApi } from '@/api'
import { Alert, Button, Card, Field, Input } from '@/components/ui-v2'
import { useAuth } from './AuthContext'

type Step = 'email' | 'code'

export function Login() {
  const { login } = useAuth()
  const [step, setStep] = useState<Step>('email')
  const [email, setEmail] = useState('')
  const [code, setCode] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)

  function useDifferentEmail() {
    setStep('email')
    setCode('')
    setError(null)
  }

  async function handleEmailSubmit(e: FormEvent) {
    e.preventDefault()
    setSubmitting(true)
    setError(null)
    try {
      await portalApi.auth.requestCode(email)
      setStep('code')
    } catch (err) {
      setError(errorMessage(err))
    } finally {
      setSubmitting(false)
    }
  }

  async function handleCodeSubmit(e: FormEvent) {
    e.preventDefault()
    setSubmitting(true)
    setError(null)
    try {
      const { token } = await portalApi.auth.verifyCode(email, code)
      login(token)
    } catch (err) {
      setError(errorMessage(err))
      setCode('')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="login-screen">
      <Card style={{ width: 360, gap: 'var(--spacing-20)' }}>
        <div>
          <h1 className="t-h2">Cortai Network Ops</h1>
          <p className="c-tertiary">{step === 'email' ? 'Sign in to your account' : `Enter the code sent to ${email}`}</p>
        </div>

        {error && <Alert variant="danger" title="Couldn't sign you in" description={error} />}

        {step === 'email' ? (
          <form onSubmit={handleEmailSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-16)' }}>
            <Field label="Email" htmlFor="login-email">
              <Input
                id="login-email"
                type="email"
                autoFocus
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </Field>
            <Button type="submit" variant="primary" block disabled={submitting}>
              {submitting ? 'Sending code…' : 'Send code'}
            </Button>
          </form>
        ) : (
          <form onSubmit={handleCodeSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-16)' }}>
            <Field label="Verification code" htmlFor="login-code">
              <Input
                id="login-code"
                type="text"
                inputMode="numeric"
                pattern="[0-9]{6}"
                maxLength={6}
                autoFocus
                required
                value={code}
                onChange={(e) => setCode(e.target.value)}
              />
            </Field>
            <Button type="submit" variant="primary" block disabled={submitting || code.length !== 6}>
              {submitting ? 'Verifying…' : 'Verify'}
            </Button>
            <Button type="button" variant="ghost" size="sm" onClick={useDifferentEmail}>
              Use a different email
            </Button>
          </form>
        )}
      </Card>
    </div>
  )
}
