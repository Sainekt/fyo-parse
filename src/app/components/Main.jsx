'use client';
import Table from './Table';
import Form from './Form';
import { useState, useEffect } from 'react';
export default function Main() {
    const [url, setUrl] = useState(null);
    const [defaultData, setDefautData] = useState(null);
    const [limit, setLimit] = useState(null);
    const [series, setSeries] = useState(false);
    const [data, setData] = useState(null);
    const [stringData, setStringData] = useState(null);
    const [loader, setLoader] = useState(false);
    const [formError, setFormError] = useState(null);
    const [copy, setCopy] = useState(false);
    const [unique, setUnique] = useState(true);
    const [prefix, setPrefix] = useState(true);
    const [viewForm, setViewForm] = useState(false);
    const [formData, setFormData] = useState('');
    const [totalLength, setToralLength] = useState(0);

    async function handleSend(event) {
        event.preventDefault();
        if (!url || loader) {
            return;
        }
        const address = document.location.href;
        const body = {
            url: url,
        };
        setLoader(true);
        setDefautData(null);
        setData(null);
        setStringData('');
        const response = await fetch(`${address}/api/`, {
            method: 'post',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(body),
        });
        const status = response.status;
        const result = await response.json();
        setLoader(false);
        if (status === 400) return setFormError(result.detail);
        if (status === 500) return setFormError('server Error 500');
        if (status === 404) return setFormError(result.detail);
        setDefautData(result);
        setData(result);
    }

    function getString(object) {
        return (
            (
                object.brand +
                ' ' +
                object.model +
                ' ' +
                (series && object.series ? object.series : '')
            ).trimEnd() + ',\n'
        );
    }
    function setString(array) {
        let sting = '';
        array.forEach((item, i) => {
            sting += getString(item);
        });
        return sting;
    }
    function handleCopyModels() {
        let data = '';
        if (formData) data = formData;
        setCopy(true);
        setTimeout(() => {
            setCopy(false);
        }, 1000);
        if (stringData) {
            data += stringData;
            return navigator.clipboard.writeText(data.trim());
        }
        data += setString(defaultData || []);
        navigator.clipboard.writeText(data.trim());
    }
    useEffect(() => {
        const newData = [];
        let models = '';
        if (prefix) {
            models +=
                '\nСписок совместимых устройств (может быть не полным!):\n';
        }
        const uniqueSet = new Set();
        if (defaultData) {
            for (const element of defaultData) {
                if (unique) {
                    if (uniqueSet.has(element.model)) {
                        continue;
                    }
                    uniqueSet.add(element.model);
                }
                const newModel = getString(element);
                if (limit && (models + newModel).length > limit) break;
                models += newModel;
                newData.push(element);
            }
        }
        const data = models.trimEnd();
        setStringData(data);
        setToralLength(data.length + formData.length);
        setData(newData);
    }, [defaultData, limit, series, unique, prefix, formData]);

    return (
        <div className='flex justify-center items-center min-h-screen m-2'>
            <div className='flex flex-col bg-zinc-900 border border-gray-700 text-zinc-200 p-10 rounded-lg min-w-[850px]'>
                <form>
                    <div className='flex-col m-2'>
                        <div>
                            <label
                                htmlFor='url'
                                className='font-semibold text-lg'
                            >
                                URL:
                            </label>
                        </div>
                        <div>
                            <input
                                id='url'
                                type='text'
                                onChange={(event) => {
                                    setUrl(event.target.value);
                                    setFormError(null);
                                }}
                                disabled={loader}
                                className={`input-field disabled:bg-gray-600 disabled:cursor-not-allowed ${
                                    formError ? 'border-4 border-red-500' : ''
                                }`}
                                required={true}
                            />
                            {formError && (
                                <div className='text-red-500 text-center'>
                                    Error: {formError}
                                </div>
                            )}
                        </div>
                        <div>
                            <button
                                type='submit'
                                onClick={handleSend}
                                disabled={loader}
                                className='w-full text-center bg-black p-3 rounded-lg font-semibold
                                    mt-3 hover:bg-gray-800 border border-gray-300 duration-200
                                    disabled:bg-gray-600 disabled:cursor-not-allowed'
                            >
                                Request Models
                            </button>
                        </div>
                    </div>
                </form>
                <div className='flex justify-evenly'>
                    <div className='flex-col'>
                        <div className='flex justify-center bg-black border rounded-md p-1 hover:bg-gray-800 duration-200 mb-2'>
                            <label
                                htmlFor='series'
                                className='font-semibold pr-1 w-full text-center'
                            >
                                Series:
                            </label>
                            <input
                                id='series'
                                type='checkbox'
                                onChange={(event) =>
                                    setSeries(event.target.checked)
                                }
                            />
                        </div>
                        <div className='flex justify-center bg-black border rounded-md p-1 hover:bg-gray-800 duration-200'>
                            <label
                                htmlFor='unique'
                                className='font-semibold pr-1 w-full text-center'
                            >
                                Unique:
                            </label>
                            <input
                                id='unique'
                                type='checkbox'
                                checked={unique}
                                onChange={(event) =>
                                    setUnique(event.target.checked)
                                }
                            />
                        </div>
                    </div>
                    <div className='flex-col'>
                        <div className='flex justify-center bg-black border rounded-md p-1 hover:bg-gray-800 duration-200 mb-2'>
                            <label
                                htmlFor='addPrefix'
                                className='font-semibold pr-1 w-full text-center'
                            >
                                Prefix model list:
                            </label>
                            <input
                                id='addPrefix'
                                type='checkbox'
                                checked={prefix}
                                onChange={(event) =>
                                    setPrefix(event.target.checked)
                                }
                            />
                        </div>
                        <div className='flex justify-center bg-black border rounded-md p-1 hover:bg-gray-800 duration-200'>
                            <label
                                htmlFor='viewForm'
                                className='font-semibold pr-1 w-full text-center'
                            >
                                View from:
                            </label>
                            <input
                                type='checkbox'
                                id='viewForm'
                                checked={viewForm}
                                onChange={(event) =>
                                    setViewForm(event.target.checked)
                                }
                            />
                        </div>
                    </div>
                </div>
                <div className='flex-col'>
                    <div className='flex justify-center'>
                        {viewForm ? (
                            <Form
                                defaultData={defaultData}
                                setFormData={setFormData}
                            ></Form>
                        ) : null}
                    </div>
                    <div>
                        <label htmlFor='limit' className='font-semibold'>
                            Limit:
                        </label>
                    </div>
                    <div>
                        <input
                            id='limit'
                            type='number'
                            onChange={(event) => setLimit(event.target.value)}
                            className='input-field'
                        />{' '}
                    </div>
                    <div className='flex justify-center bg-neutral-900 border rounded-md mt-2 p-1'>
                        <span className='mr-2 font-bold'>Total length:</span>
                        <span
                            className={
                                totalLength > 6000
                                    ? 'text-red-500'
                                    : 'text-green-500'
                            }
                        >
                            {totalLength}
                        </span>
                    </div>
                    <div>
                        <button
                            onClick={handleCopyModels}
                            className={`w-full text-center bg-black p-3 rounded-lg font-semibold
                                    my-3 hover:bg-gray-800 border border-gray-300 duration-200
                                     ${copy ? 'bg-gray-800' : null}`}
                        >
                            {copy ? '✔' : 'Copy'}
                        </button>
                    </div>
                    {defaultData ? (
                        <div
                            className='w-full rounded-lg border
                        border-white h-96 overflow-auto'
                        >
                            <Table data={data} series={series} />
                        </div>
                    ) : null}
                    {loader ? (
                        <div className='flex justify-center mt-7'>
                            <span className='loader'></span>{' '}
                        </div>
                    ) : null}
                </div>
            </div>
        </div>
    );
}
