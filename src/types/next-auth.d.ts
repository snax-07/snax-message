import 'next-auth'
import { DefaultSession } from 'next-auth'

declare module 'next-auth' {
  interface User {
    _id?: string
    isVerified: boolean
    isAcceptingMessages: boolean
    username: string
    verifyCode : string
  }

  interface Session{
    user : {
        _id? : string
        isVerified: boolean
        isAcceptingMessages: boolean
        username: string
    }& DefaultSession['User']
  }
}


declare module 'next-auth/JWT' {
  interface JWT {
      _id: string
      isVerified: boolean
      isAcceptingMessages: boolean
      username: string
  }
}