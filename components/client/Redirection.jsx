import { useEffect } from "react";
import { useRouter } from 'next/navigation';
import Link from 'next/link';

function Redirection() {
    const router = useRouter();

    useEffect(() => {
        setTimeout(() => {
            router.push('/login');
        }, [3000])
    }, [])

    return (
        <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
            <div className="w-full max-w-sm p-6 bg-white rounded-lg shadow-md">
                <h1 className="text-3xl font-bold text-center mb-6">Login Redirection</h1>

                <p className="text-lg text-gray-700 text-center mb-4">
                    You are being redirected to the login page. If you are not automatically redirected, please click the button below.
                </p>

                <Link href="/login" className="block text-center text-white bg-blue-500 hover:bg-blue-600 px-4 py-2 rounded-full transition-all">
                    Go to Login Page
                </Link>
            </div>
        </div>
    )
}

export default Redirection