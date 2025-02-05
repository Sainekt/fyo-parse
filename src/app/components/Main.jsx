'use client';
import { sendError } from 'next/dist/server/api-utils';
import Table from './Table';
import { useState, useEffect } from 'react';
export default function Main() {
    const [url, setUrl] = useState(null);
    const [defaultData, setDefautData] = useState(null);
    const [limit, setLimit] = useState(null);
    const [series, setSeries] = useState(false);
    const [data, setData] = useState(null);
    const [stringData, setStringData] = useState(null);
    const [loader, setLoader] = useState(false);
    const [error, setError] = useState(false);
    const [formError, setFormError] = useState(null);

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
        setError(null);
    }

    function getString(object) {
        return (
            (
                object.brand +
                ' ' +
                object.model +
                ' ' +
                (series ? object.series : '')
            ).trimEnd() + '\n'
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
        if (stringData) {
            return navigator.clipboard.writeText(stringData);
        }
        const result = setString(defaultData);
        navigator.clipboard.writeText(result);
    }
    useEffect(() => {
        if (!defaultData) return;
        if (!limit) {
            setStringData(null);
            return setData(defaultData);
        }
        const newData = [];
        let models = '';
        for (const element of defaultData) {
            const newModel = getString(element);

            if ((models + newModel).length > limit) break;
            models += newModel;
            newData.push(element);
        }
        setStringData(models);
        setData(newData);
    }, [defaultData, limit, series]);

    return (
        <div className='grid-container'>
            <div className='card'>
                <span className='error'>{error}</span>
                <form className='form'>
                    <label htmlFor='url' className='label'>
                        URL:
                    </label>{' '}
                    <input
                        id='url'
                        type='text'
                        onChange={(event) => {
                            setUrl(event.target.value);
                            setFormError(null);
                        }}
                        disabled={loader}
                        className={`input ${formError ? 'input-error' : ''}`}
                        required={true}
                    />
                    {formError && (
                        <span className='error-message'>{formError}</span>
                    )}
                    <button
                        type='submit'
                        onClick={handleSend}
                        className='button'
                        disabled={loader}
                    >
                        Request Models
                    </button>
                </form>
                <label htmlFor='limit' className='label'>
                    Limit:
                </label>
                <input
                    id='limit'
                    type='number'
                    onChange={(event) => setLimit(event.target.value)}
                    className='input'
                />
                <label htmlFor='series' className='label'>
                    Series:
                </label>
                <input
                    id='series'
                    type='checkbox'
                    onChange={(event) => setSeries(event.target.checked)}
                />
                <br />
                {defaultData ? (
                    <button
                        onClick={handleCopyModels}
                        className={`button button-copy`}
                    >
                        Copy Models
                    </button>
                ) : null}
                <Table data={data} series={series} />
                {loader ? (
                    <div className='loader-container'>
                        <span className='loader'></span>{' '}
                    </div>
                ) : null}
            </div>
        </div>
    );
}
