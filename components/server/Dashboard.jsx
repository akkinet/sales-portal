import { headers } from 'next/headers';
import PricingChart from '../client/PricingChart';

const fetchApi = async () => {
    const head = headers()
    const hostname = head.get('x-hostname')
    // let packages = await fetch(`${hostname}/api/packages`)
    // packages = await packages.json()
    // let suits = await fetch(`${hostname}/api/suits`)
    // suits = await suits.json()
    // return [packages, suits]
    const res = await fetch(`${hostname}/api/stripe`)
    const data = await res.json()
    return data
}

const Dashboard = async () => {
    const { packages, suits } = await fetchApi()

    return (
        <PricingChart packages={packages} suits={suits} />
    )
}

export default Dashboard