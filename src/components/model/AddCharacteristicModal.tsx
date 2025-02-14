import React, { useState } from 'react';
import { Button } from '../common/Button';
import { Modal } from '../common/Modal';


interface Props {
    isOpen: boolean;
    onClose: () => void;
    onAdd: () => void;
}

export const AddCharacteristicModal: React.FC<Props> = ({ isOpen, onClose, onAdd }) => {
    const [formData, setFormData] = useState({
        name: '',
        value: '',
        category: '',
        confidence_level: ''
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // Aquí iría la lógica para agregar la característica
        onAdd();
        onClose();
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} title="Agregar Característica">
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700">Nombre</label>
                    <input
                        type="text"
                        value={formData.name}
                        onChange={(e) => setFormData({...formData, name: e.target.value})}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                    />
                </div>
                <Button type="submit" variant="primary">Agregar</Button>
            </form>
        </Modal>
    );
}; 