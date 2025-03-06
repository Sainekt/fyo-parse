'use client';
import { useEffect, useState } from 'react';

export default function CellsChecker() {
    useEffect(() => {
        const url = `${window.location.origin}/api/cells`;
        fetch(url).then((response) => {
            if (response.ok) {
                response.json().then((data) => {
                    console.log(data);
                });
                console.log(response);
            }
        });
    }, []);
    return (
        <div className='flex justify-center items-center min-h-screen m-2'>
            <div className='flex flex-col bg-zinc-900 border border-gray-700 text-zinc-200 p-10 rounded-lg min-w-[850px]'>
                <div className='flex justify-evenly'>
                    <button
                        className='w-full text-center bg-black p-3 rounded-lg font-semibold
                        mt-3 hover:bg-gray-800 border border-gray-300 duration-200
                        disabled:bg-gray-600 disabled:cursor-not-allowed'
                    >
                        Update
                    </button>
                </div>
                <div className=''>{}</div>
            </div>
        </div>
    );
}
