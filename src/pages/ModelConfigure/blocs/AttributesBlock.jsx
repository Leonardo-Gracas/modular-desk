import React, { useState, useEffect } from "react";
import NumberExample from "../examples/NumberExample";

const AttributeBlock = ({ _fields, _pointsPerLevel, _basePoints, _title, id, saveAction, deleteAction }) => {
    const [fields, setFields] = useState([..._fields]);
    const [pointsPerLevel, setPointsPerLevel] = useState(_pointsPerLevel);
    const [title, setTitle] = useState(_title);
    const [basePoints, setBasePoints] = useState(_basePoints);

    const [fieldModel, setFieldModel] = useState({
        title: "",
        value: 0,
        colspan: 1,
        type: "number",
    });

    useEffect(() => {
        saveAction({ id, title, type: "Attribute", pointsPerLevel, basePoints, fields });
    }, [fields, pointsPerLevel, basePoints]);

    const handleChange = (e) => {
        let { name, value } = e.target;

        if (name === "colspan") {
            value = Math.max(1, Math.min(4, Number(value))); // Garante que o valor esteja entre 1 e 4
        }

        setFieldModel(prev => ({ ...prev, [name]: value }));
    };

    const handlePointsChange = (e) => {
        setPointsPerLevel(Number(e.target.value) || 0);
    };

    const handleBasePointsChange = (e) => {
        setBasePoints(Number(e.target.value) || 0);
    };

    const handleTitleChange = (e) => {
        setTitle(e.target.value || "");
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        const newField = {
            title: fieldModel.title,
            value: 0,
            colspan: fieldModel.colspan,
            type: "number",
        };

        setFields(prev => [...prev, newField]);
        setFieldModel(prev => ({
            title: "",
            value: 0,
            colspan: prev.colspan,
            type: "number"
        }));
    };

    const handleRemoveField = (index) => {
        setFields(prev => prev.filter((_, i) => i !== index));
    };

    return (
        <div className="mb-5 card-custom bg-beige p-4 rounded-3 border-brown">
            {/* Cabeçalho do Bloco */}
            <div className="w-100 d-flex justify-content-between align-items-center mb-4">
                <h2 className="text-brown border-bottom border-brown pb-2">⚔️ Atributos</h2>
                <button className="btn btn-brown" onClick={() => deleteAction(id)}>
                    Remover
                </button>
            </div>

            {/* Configurações do Bloco */}
            <div className="row g-3 mb-4">
                <div className="col-md-3">
                    <label className="form-label text-brown">Nome do Bloco:</label>
                    <input
                        type="text"
                        value={title}
                        onChange={handleTitleChange}
                        className="form-control bg-beige text-brown border-brown"
                        min="1"
                    />
                </div>
                <div className="col-md-3">
                    <label className="form-label text-brown">Pontos Base:</label>
                    <input
                        type="number"
                        value={basePoints}
                        onChange={handleBasePointsChange}
                        className="form-control bg-beige text-brown border-brown"
                        min="1"
                    />
                </div>
                <div className="col-md-3">
                    <label className="form-label text-brown">Pontos por Nível:</label>
                    <input
                        type="number"
                        value={pointsPerLevel}
                        onChange={handlePointsChange}
                        className="form-control bg-beige text-brown border-brown"
                        min="1"
                    />
                </div>
            </div>

            {/* Formulário para Adicionar Atributos */}
            <form onSubmit={handleSubmit} className="row g-3 mb-4">
                <div className="col-md-4">
                    <label className="form-label text-brown">Nome do Atributo:</label>
                    <input
                        type="text"
                        name="title"
                        value={fieldModel.title}
                        onChange={handleChange}
                        className="form-control bg-beige text-brown border-brown"
                        required
                    />
                </div>
                <div className="col-md-auto d-flex align-items-end">
                    <button type="submit" className="btn btn-brown">
                        Adicionar
                    </button>
                </div>
            </form>

            {/* Divisor */}
            <hr className="border-brown" />

            {/* Lista de Atributos */}
            <div className="row g-4">
                {fields.map((field, index) => (
                    <NumberExample key={index} obj={field} index={index} handleRemoveField={handleRemoveField} />
                ))}
            </div>
        </div>
    );
};

export default AttributeBlock;