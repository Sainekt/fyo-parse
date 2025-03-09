'use client';
import { useState, useEffect } from 'react';
import TableCell from '../components/TableCells';

export default function IncludeView() {
    const [data, setData] = useState(null);
    const [cell, setCell] = useState(null);
    const [cellError, setCellError] = useState(false);
    const [defaultLength, setDefaultLength] = useState(6);
    const [error, setError] = useState(null);
    const [message, setMessage] = useState(null);
    const regex = /^\d+-\d+/;
    const url = `${window.location.origin}/api/cells/excluded`;
    const headers = { 'Content-Type': 'application/json' };

    function onChangeCell(event) {
        setError(false);
        const value = event.target.value;
        setCell(value);
        if (!regex.test(value)) return setCellError(true);
        return setCellError(false);
    }

    function handleAdd() {
        if (!cell || cellError) return;
        const addCell = async (cell) => {
            const response = await fetch(url, {
                method: 'POST',
                headers: headers,
                body: JSON.stringify({ cell }),
            });
            if (response.status === 201) {
                setMessage('Исключение успешно добавлено.');
                setTimeout(() => {
                    setMessage(null);
                }, 4000);
                return setData((perv) => [...perv, { cell: cell }]);
            }
            const data = await response.json();
            if (data.error) return setError(data.error);
        };
        addCell(cell);
    }

    function handleRemove() {
        if (!cell || cellError) return;
        const removeCell = async (cell) => {
            const response = await fetch(`${url}`, {
                method: 'DELETE',
                headers: headers,
                body: JSON.stringify({ cell }),
            });
            console.log(response);

            if (response.status === 204) {
                setMessage('Исключение успешно удалено.');
                setTimeout(() => {
                    setMessage(null);
                }, 4000);
                return setData((perv) =>
                    perv.filter((value) => value.cell !== cell)
                );
            }
            const data = await response.json();
            if (data.error) return setError(data.error);
        };
        removeCell(cell);
    }

    useEffect(() => {
        const fetchData = async () => {
            const response = await fetch(url);
            const data = await response.json();
            if (!response.ok) {
                setError(data.error);
            } else if (response.status === 404) {
                setError(`Страницы: ${url} не найдена`);
            }
            setData(data.data);
        };
        fetchData();
    }, []);
    return (
        <>
            <div className='flex-col justify-center bg-zinc-800 border rounded-lg p-2'>
                {error && (
                    <div className='items-center flex justify-center p-1 mb-2 bg-black font-semibold text-red-500 border-4 border-red-500 rounded-lg'>
                        Ошибка: {error}
                    </div>
                )}
                {message && (
                    <div className='items-center flex justify-center p-1 mb-2 bg-black font-semibold text-green-500 border-4 border-green-500 rounded-lg'>
                        Уведомление: {message}
                    </div>
                )}
                {data && (
                    <div className='rounded-lg border bg-neutral-900 my-3'>
                        <div className='text-center font-bold m-2'>
                            Исключенные ячейки
                        </div>
                        <div className='w-full rounded-b-lg overflow-auto max-h-96'>
                            <TableCell data={data} onlyCell={true}></TableCell>
                        </div>
                    </div>
                )}
                <div className='flex justify-evenly items-center m-3'>
                    <div className=' items-center'>
                        <span className='mr-1 font-bold '>Номер ячейки:</span>

                        <input
                            type='text'
                            className={`input-field max-w-20 border focus:border-4 ${
                                cellError
                                    ? 'focus:border-red-500'
                                    : 'focus:border-green-500'
                            }`}
                            maxLength={defaultLength}
                            onChange={onChangeCell}
                        />
                    </div>
                    <div className='flex justify-end items-center'>
                        <span className='mr-1 font-bold'>Лимит символов:</span>

                        <input
                            type='number'
                            className='input-field max-w-16 border'
                            value={defaultLength}
                            onChange={(event) =>
                                setDefaultLength(event.target.value)
                            }
                        />
                    </div>
                </div>
                <div className='flex flex-row justify-evenly'>
                    <button
                        className='w-full text-center bg-black p-3 rounded-lg font-semibold
                        m-3 hover:bg-gray-800 border border-gray-300 duration-200
                        min-w-28'
                        onClick={handleAdd}
                    >
                        Добавить
                    </button>
                    <button
                        className='w-full text-center bg-black p-3 rounded-lg font-semibold
                        m-3 hover:bg-gray-800 border border-gray-300 duration-200
                        min-w-28'
                        onClick={handleRemove}
                    >
                        Удалить
                    </button>
                </div>
            </div>
        </>
    );
}
