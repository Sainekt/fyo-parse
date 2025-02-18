'use client';
import { useEffect, useState } from 'react';

export default function Form({ defaultData, setFormData }) {
    const [name, setName] = useState('');
    const [annotation, setAnnotation] = useState('');
    const [brands, setBrands] = useState('');
    const [material, setMaterial] = useState('');
    const [color, setColor] = useState('');
    const [size, setSize] = useState('');
    const [parameters, setParameters] = useState('');

    const handleChanged = () => {
        let data = '';
        if (name) data += name + '\n\n';
        if (annotation) data += annotation + '\n\n';
        if (brands) {
            data += `Совместимость с брендом: ${brands}\n`;
        }
        if (material) data += `Материал: ${material}\n`;
        if (color) data += `Цвет: ${color}\n`;
        if (size) {
            data += `Размер: ${size}\n`;
        }
        if (parameters) data += `${parameters}\n`;
        setFormData(data);
    };

    useEffect(() => {
        handleChanged();
        return () => setFormData('');
    }, [name, annotation, brands, material, color, size, parameters]);

    useEffect(() => {
        if (defaultData) getBrands();
        else setBrands('');
    }, [defaultData]);

    const getBrands = () => {
        const brands = defaultData.reduce((curr, value) => {
            const capitalize =
                String(value.brand).charAt(0).toUpperCase() +
                String(value.brand).toLowerCase().slice(1);
            curr[capitalize] = null;
            return curr;
        }, {});
        const brandsList = Object.keys(brands).join(', ');
        setBrands(brandsList);
    };

    return (
        <>
            <label htmlFor='Name' className='label'>
                Name:
            </label>
            <input
                id='Name'
                type='input'
                onChange={(event) => setName(event.target.value)}
                className='input'
            />

            <label htmlFor='Annotation' className='label'>
                Annotation:
            </label>
            <textarea
                id='Annotation'
                onChange={(event) => setAnnotation(event.target.value)}
                className='input'
            />

            <label htmlFor='Brands' className='label'>
                Brands:
            </label>
            <input
                id='Brands'
                type='input'
                onChange={(event) => setBrands(event.target.value)}
                className='input'
                value={brands}
            />

            <div className='input-container'>
                <div className='input-half'>
                    <label htmlFor='Material' className='label'>
                        Material:
                    </label>
                    <input
                        id='Material'
                        type='input'
                        onChange={(event) => setMaterial(event.target.value)}
                        className='input'
                    />
                </div>

                <div className='input-half'>
                    <label htmlFor='Color' className='label'>
                        Color:
                    </label>
                    <input
                        id='Color'
                        type='input'
                        onChange={(event) => setColor(event.target.value)}
                        className='input'
                    />
                </div>
                <div className='input-half'>
                    <label htmlFor='Size' className='label'>
                        Size:
                    </label>
                    <input
                        id='Size'
                        type='input'
                        onChange={(event) => setSize(event.target.value)}
                        className='input'
                    />
                </div>
            </div>
            <label htmlFor='parameters' className='label'>
                Parameters:
            </label>
            <textarea
                className='input'
                type='text'
                id='parameters'
                value={parameters}
                onChange={(target) => setParameters(target.target.value)}
            />
        </>
    );
}
