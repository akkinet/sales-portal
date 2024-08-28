import { headers } from 'next/headers';
import PricingChart from '../client/PricingChart';
import Modified from '../client/Modified';
import Invoice from '../client/invoice';

const fetchApi = async () => {
    const head = headers()
    const hostname = head.get('x-hostname')
    const res = await fetch(`${hostname}/api/stripe`)
    const data = await res.json()
    return data
}

const Dashboard = async () => {
    const { packages, suits } = await fetchApi()

    return (
        <Invoice packages={packages} suits={suits}/>
        // <PricingChart packages={packages} suits={suits} />
        // <Modified packages={packages} suits={suits} />
    )
}

export default Dashboard