'use client';

export default function TableCell({ data, onlyCell = false }) {
    if (!data) return;

    return (
        <table className='table-fixed min-w-full text-center'>
            <thead>
                <tr className='bg-gray-700'>
                    {!onlyCell ? (
                        <>
                            <th className='p-3 font-semibold'>Название</th>
                            <th className='p-3 font-semibold'>Код</th>
                            <th className='p-3 font-semibold'>Количество</th>
                        </>
                    ) : null}
                    <th className='p-3 font-semibold'>Ячейка</th>
                </tr>
            </thead>
            <tbody>
                {data.map((item, index) => (
                    <tr
                        key={index}
                        className={`hover:bg-gray-500 ${
                            index % 2 === 0 ? 'bg-gray-800' : 'bg-gray-700'
                        }`}
                    >
                        {!onlyCell ? (
                            <>
                                <td className='p-3 border-t border-gray-600'>
                                    {item.name ? item.name.slice(0, 60) : null}
                                </td>
                                <td className='p-3 border-t border-gray-600'>
                                    {item.code ? item.code : null}
                                </td>
                                <td className='p-3 border-t border-gray-600'>
                                    {item.stock | 0}
                                </td>
                            </>
                        ) : null}
                        <td className='p-3 border-t border-gray-600'>
                            {item.cell}
                        </td>
                    </tr>
                ))}
            </tbody>
        </table>
    );
}
