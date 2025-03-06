import Main from './components/Main';
import Link from 'next/link';
export default function Home() {
    return (
        <>
            <div className='mt-5'>
                <Link
                    className='text-white border border-white rounded-lg p-2
                    hover:bg-gray-800 duration-200'
                    href={'/cells'}
                >
                    Cells checker
                </Link>
            </div>
            <Main />
        </>
    );
}
