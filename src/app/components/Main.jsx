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
        if (!defaultData) {
            setToralLength(formData.length);
            return;
        }
        const newData = [];
        let models = '';
        if (prefix) {
            models +=
                '\nСписок совместимых устройств (может быть не полным!):\n';
        }
        const uniqueSet = new Set();
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
        const data = models.trim();
        setStringData(data);
        setToralLength(data.length + formData.length);
        setData(newData);
    }, [defaultData, limit, series, unique, prefix, formData]);

    return (
        <div className='grid-container'>
            <div className='card'>
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
                <label htmlFor='series' className='label'>
                    Series:
                </label>
                <input
                    id='series'
                    type='checkbox'
                    onChange={(event) => setSeries(event.target.checked)}
                />
                <label htmlFor='unique' className='label'>
                    Unique:
                </label>
                <input
                    id='unique'
                    type='checkbox'
                    checked={unique}
                    onChange={(event) => setUnique(event.target.checked)}
                />
                <label htmlFor='addPrefix' className='label'>
                    Prefix model list:
                </label>
                <input
                    id='addPrefix'
                    type='checkbox'
                    checked={prefix}
                    onChange={(event) => setPrefix(event.target.checked)}
                />
                <label htmlFor='viewForm' className='label'>
                    View from
                </label>
                <input
                    type='checkbox'
                    id='viewForm'
                    checked={viewForm}
                    onChange={(event) => setViewForm(event.target.checked)}
                />
                <br />
                <p></p>
                {viewForm ? (
                    <Form
                        defaultData={defaultData}
                        setFormData={setFormData}
                    ></Form>
                ) : null}

                <p></p>
                <label htmlFor='limit' className='label'>
                    Limit:
                </label>
                <input
                    id='limit'
                    type='number'
                    onChange={(event) => setLimit(event.target.value)}
                    className='input'
                />
                {totalLength ? `Total length: ${totalLength}` : null}
                <button
                    onClick={handleCopyModels}
                    className={`button button-copy ${
                        copy ? 'button-copied' : null
                    }`}
                >
                    {copy ? '✔' : 'Copy'}
                </button>
                <Table data={data} series={series} />
                <p></p>
                {loader ? (
                    <div className='loader-container'>
                        <span className='loader'></span>{' '}
                    </div>
                ) : null}
            </div>
        </div>
    );
}
