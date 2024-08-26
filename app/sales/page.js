import Invoice from '../../components/client/Invoice'
import { headers } from 'next/headers';

const fetchApi = async () => {
  const head = headers()
  const hostname = head.get('x-hostname')
  const res = await fetch(`${hostname}/api/stripe`)
  const data = await res.json()
  return data
}

async function page() {
  const { packages, suits } = await fetchApi()
  return (
    <Invoice packages={packages} suits={suits} />
  )
}

export default page