'use client';
import { useEffect, useState } from 'react';

export default function Form({ formData, setFormData }) {
    const [name, setName] = useState('');
    const [annotation, setAnnotation] = useState('');
    const [brands, setBrands] = useState('');
    const [material, setMaterial] = useState('');
    const [color, setColor] = useState('');
    const [size, setSize] = useState('');

    const splitter = (text, inputSep = ' ', sep = ', ') => {
        return text.trimEnd().split(inputSep).join(sep);
    };

    const handleChanged = () => {
        let data = '';
        if (name) data += name + '\n\n';
        if (annotation) data += annotation + '\n\n';
        if (brands) {
            data += `Совместимость с брендом: ${splitter(brands)}\n`;
        }
        if (material) data += `Материал: ${splitter(material)}\n`;
        if (color) data += `Цвет: ${splitter(color)}\n`;
        if (size) {
            data += `Размер: ${splitter(size)}\n\n`;
        }
        setFormData(data);
    };

    useEffect(() => {
        handleChanged();
    }, [name, annotation, brands, material, color, size]);

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
        </>
    );
}
