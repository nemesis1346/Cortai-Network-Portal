export interface AuthApi {
  requestCode(email: string): Promise<void>
  verifyCode(email: string, code: string): Promise<{ token: string }>
}
