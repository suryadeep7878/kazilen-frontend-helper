// app/create-account/page.js

import CreateAccountClient from './CreateAccountClient'

export default function Page({ searchParams }) {
  const phone = searchParams?.phone || ''

  return <CreateAccountClient phoneFromQuery={phone} />
}