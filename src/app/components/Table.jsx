export default function Table({ data, series }) {
    if (!data) return;
    return (
        <table className='table-fixed min-w-full text-center'>
            <thead>
                <tr className='bg-gray-700'>
                    <th className='p-3 font-semibold'>Brand</th>
                    <th className='p-3 font-semibold'>Model</th>
                    {series && <th className='p-3 font-semibold'>Series</th>}
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
                        <td className='p-3 border-t border-gray-600'>
                            {item.brand}
                        </td>
                        <td className='p-3 border-t border-gray-600'>
                            {item.model}
                        </td>
                        {series && (
                            <td className='p-3 border-t border-gray-600'>
                                {item.series}
                            </td>
                        )}
                    </tr>
                ))}
            </tbody>
        </table>
    );
}
