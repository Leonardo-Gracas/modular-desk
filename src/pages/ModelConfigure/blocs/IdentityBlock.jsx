import React, { useState, useEffect } from "react";
import TextExample from "../examples/TextExample";
import NumberExample from "../examples/NumberExample";

const IdentityBlock = ({ _fields, id, saveAction, deleteAction }) => {
    const [fields, setFields] = useState([..._fields]);

    const [fieldModel, setFieldModel] = useState({
        title: "",
        type: "",
        value: "",
        colspan: 1,
    });

    useEffect(() => {
        saveAction({ id, type: "Identity", fields });
    }, [fields]);

    const handleChange = (e) => {
        let { name, value } = e.target;

        if (name === "colspan") {
            value = Math.max(1, Math.min(4, Number(value))); // Garante que o valor esteja entre 1 e 4
        }

        setFieldModel(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        const newField = {
            title: fieldModel.title,
            type: fieldModel.type,
            value: "",
            colspan: fieldModel.colspan,
        };

        setFields(prev => [...prev, newField]);
        setFieldModel({ title: "", type: "", value: "", colspan: 1 });
    };

    const handleRemoveField = (index) => {
        setFields(prev => prev.filter((_, i) => i !== index));
    };

    return (
        <div className="mb-5 card-custom bg-beige p-4 rounded-3 border-brown">
            <h2 className="mb-4 text-brown border-bottom border-brown pb-2">🪶 Identidade</h2>
            <form onSubmit={handleSubmit} className="row g-3 mb-4">
                <div className="col-md-3">
                    <label className="form-label text-brown">Título:</label>
                    <input
                        type="text"
                        name="title"
                        value={fieldModel.title}
                        onChange={handleChange}
                        className="form-control bg-beige text-brown border-brown"
                    />
                </div>
                <div className="col-md-3">
                    <label className="form-label text-brown">Tipo:</label>
                    <select
                        name="type"
                        value={fieldModel.type}
                        onChange={handleChange}
                        className="form-select bg-beige text-brown border-brown"
                    >
                        <option value="">Selecione</option>
                        <option value="text">Texto</option>
                        <option value="number">Número</option>
                    </select>
                </div>
                <div className="col-md-2">
                    <label className="form-label text-brown">Colunas:</label>
                    <input
                        type="number"
                        name="colspan"
                        value={fieldModel.colspan}
                        onChange={handleChange}
                        className="form-control bg-beige text-brown border-brown"
                        min="1"
                        max="4"
                    />
                </div>
                <div className="col-md-2 d-flex align-items-end">
                    <button type="submit" className="btn btn-brown w-100">
                        Adicionar
                    </button>
                </div>
            </form>

            <div className="row g-4">
                {fields.map((field, index) =>
                    field.type === "text" ? (
                        <TextExample key={index} obj={field} index={index} handleRemoveField={handleRemoveField} />
                    ) : (
                        <NumberExample key={index} obj={field} index={index} handleRemoveField={handleRemoveField} />
                    )
                )}
            </div>
        </div>
    );
};

export default IdentityBlock;