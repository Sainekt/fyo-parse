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
            <div className='flex'>
                <div>
                    <div>
                        <label htmlFor='Name' className='font-semibold'>
                            Name:
                        </label>
                    </div>
                    <div>
                        <input
                            id='Name'
                            type='input'
                            onChange={(event) => setName(event.target.value)}
                            className='input-field'
                        />
                    </div>
                    <div>
                        <label htmlFor='Annotation' className='font-semibold'>
                            Annotation:
                        </label>
                    </div>
                    <div>
                        <textarea
                            id='Annotation'
                            onChange={(event) =>
                                setAnnotation(event.target.value)
                            }
                            className='input-field'
                        />
                    </div>
                    <div>
                        <label htmlFor='Brands' className='font-semibold'>
                            Brands:
                        </label>
                    </div>
                    <div>
                        <input
                            id='Brands'
                            type='input'
                            onChange={(event) => setBrands(event.target.value)}
                            className='input-field'
                            value={brands}
                        />
                    </div>
                    <div className='flex justify-evenly'>
                        <div className='flex-col m-1'>
                            <div>
                                <label
                                    htmlFor='Material'
                                    className='font-semibold'
                                >
                                    Material:
                                </label>
                            </div>
                            <div>
                                <input
                                    id='Material'
                                    type='input'
                                    onChange={(event) =>
                                        setMaterial(event.target.value)
                                    }
                                    className='input-field'
                                />
                            </div>
                        </div>

                        <div className='flex-col m-1'>
                            <div>
                                <label
                                    htmlFor='Color'
                                    className='font-semibold'
                                >
                                    Color:
                                </label>
                            </div>
                            <div>
                                <input
                                    id='Color'
                                    type='input'
                                    onChange={(event) =>
                                        setColor(event.target.value)
                                    }
                                    className='input-field'
                                />
                            </div>
                        </div>
                        <div className='flex-col m-1'>
                            <div>
                                <label htmlFor='Size' className='font-semibold'>
                                    Size:
                                </label>
                            </div>
                            <div>
                                <input
                                    id='Size'
                                    type='input'
                                    onChange={(event) =>
                                        setSize(event.target.value)
                                    }
                                    className='input-field'
                                />
                            </div>
                        </div>
                    </div>
                    <div className='flex-col'>
                        <div>
                            <label
                                htmlFor='parameters'
                                className='font-semibold'
                            >
                                Parameters:
                            </label>
                        </div>
                        <div>
                            <textarea
                                className='input-field'
                                type='text'
                                id='parameters'
                                value={parameters}
                                onChange={(target) =>
                                    setParameters(target.target.value)
                                }
                            />
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
