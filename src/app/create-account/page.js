// app/create-account/page.js

import CreateAccountClient from './CreateAccountClient'
import { useSearchParams } from 'next/navigation'

export default function Page({ searchParams }) {
	const param = useSearchParams()
	const phone = param.get("phone")
  return <CreateAccountClient phoneFromQuery={phone} />
}
