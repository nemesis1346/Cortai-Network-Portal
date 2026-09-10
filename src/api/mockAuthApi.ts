import type { AuthApi } from './authTypes'
import { InvalidCodeError } from './invalidCodeError'

const NETWORK_DELAY_MS = 280

function delay<T>(value: T): Promise<T> {
  return new Promise((resolve) => setTimeout(() => resolve(value), NETWORK_DELAY_MS))
}

export const mockAuthApi: AuthApi = {
  async requestCode() {
    return delay(undefined)
  },

  verifyCode(_email, code) {
    if (code === '123456') return delay({ token: 'mock-token' })
    return Promise.reject(new InvalidCodeError('Incorrect code. Please try again.'))
  },
}
