'use client';
import { useEffect, useState } from 'react';
import TableCell from '../../components/TableCells';

export default function CellsChecker() {
    const [update, setUpdate] = useState(true);
    const [data, setData] = useState(null);
    const [error, setError] = useState(null);
    const [loader, setLoader] = useState(false);

    useEffect(() => {
        if (!update) return;
        setLoader(true);
        setData(null);
        const url = `${window.location.origin}/api/cells`;
        fetch(url).then((response) => {
            if (response.ok) {
                response.json().then((data) => {
                    setData(data);
                    setError(null);
                });
            } else {
                response.json().then((data) => {
                    setError(data.error);
                });
            }
            setUpdate(false);
            setLoader(false);
        });
    }, [update]);
    return (
        <div className='flex justify-center items-center min-h-screen m-2'>
            <div className='flex flex-col bg-zinc-900 border border-gray-700 text-zinc-200 p-10 rounded-lg min-w-[850px]'>
                {error && (
                    <div className='bg-black p-2 rounded-lg border border-red-600 text-center text-red-500 font-bold'>
                        Ошибка при получении данных: {error}
                    </div>
                )}
                <div className='flex justify-evenly'>
                    <button
                        className='w-full text-center bg-black p-3 rounded-lg font-semibold
                        m-3 hover:bg-gray-800 border border-gray-300 duration-200
                        disabled:bg-gray-600 disabled:cursor-not-allowed'
                        onClick={() => setUpdate(true)}
                        disabled={update}
                    >
                        Обновить
                    </button>
                </div>
                {data ? (
                    <>
                        <div className='bg-neutral-900 p-2 rounded-lg border mt-2 text-center'>
                            Обработано: {data ? data.data.countGoods : 0}
                            товаров
                        </div>
                        {data && data.data.dublicate.length ? (
                            <div className='rounded-lg border-4 bg-neutral-900 border-red-500 my-3 mt-5'>
                                <div className='text-center font-bold m-2  text-red-600'>
                                    Дубликаты
                                </div>
                                <div className='w-full rounded-b-lg overflow-auto max-h-96'>
                                    <TableCell
                                        data={data.data.dublicate}
                                    ></TableCell>
                                </div>
                            </div>
                        ) : null}
                        <div className='rounded-lg border bg-neutral-900 my-3'>
                            <div className='text-center font-bold m-2'>
                                Не распределены
                            </div>
                            <div className='w-full rounded-b-lg overflow-auto max-h-96'>
                                <TableCell
                                    data={data.data.clear}
                                    onlyCell={true}
                                ></TableCell>
                            </div>
                        </div>
                        <div className='rounded-lg border bg-neutral-900 my-3'>
                            <div className='text-center font-bold m-2'>
                                Пустые
                            </div>
                            <div className='w-full rounded-b-lg overflow-auto max-h-96'>
                                <TableCell data={data.data.empty}></TableCell>
                            </div>
                        </div>
                    </>
                ) : (
                    loader && (
                        <div className='text-center mt-4'>
                            <span className='loader'></span>
                        </div>
                    )
                )}
            </div>
        </div>
    );
}
