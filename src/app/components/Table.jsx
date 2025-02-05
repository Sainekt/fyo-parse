export default function Table({ data, series }) {
    if (!data) return;
    return (
        <div className='table-container'>
            <table>
                <thead>
                    <tr>
                        <th scope='col'>Brand</th>
                        <th scope='col'>Model</th>
                        {series && <th scope='col'>Series</th>}
                    </tr>
                </thead>
                <tbody>
                    {data.map((item, index) => (
                        <tr key={index}>
                            <td>{item.brand}</td>
                            <td>{item.model}</td>
                            {series && <td>{item.series}</td>}
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}
