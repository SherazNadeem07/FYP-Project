import ResetPassword from '@/components/ResetPassword'
import { Suspense } from 'react'
export default function otp() {
  return (
    <>
    <Suspense fallback={<>loading.....</>}>
    <ResetPassword/>
    </Suspense>
    </>
  )
}
