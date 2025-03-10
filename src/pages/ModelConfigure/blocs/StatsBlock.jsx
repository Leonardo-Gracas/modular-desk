import React, { useState, useEffect } from "react";

const StatsBlock = ({ attributes, _fields, id, saveAction, deleteAction }) => {
    const [fields, setFields] = useState([..._fields]);
    const [statModel, setStatModel] = useState({
        title: "",
        formula: "",
    });

    useEffect(() => {
        saveAction({ id, type: "Stats", fields });
    }, [fields]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setStatModel(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        try {
            const newStat = {
                title: statModel.title,
                formula: statModel.formula,
            };

            setFields(prev => [...prev, newStat]);
            setStatModel({ title: "", formula: "" });
        } catch (error) {
            alert("Erro na fórmula. Verifique a sintaxe!");
        }
    };

    const handleRemoveStat = (index) => {
        setFields(prev => prev.filter((_, i) => i !== index));
    };

    return (
        <div className="mb-5 card-custom bg-beige p-4 rounded-3 border-brown">
            {/* Título do Bloco */}
            <h2 className="mb-4 text-brown border-bottom border-brown pb-2">🛡️ Status</h2>

            {/* Formulário para Adicionar Status */}
            <form onSubmit={handleSubmit} className="row g-3 mb-4">
                <div className="col-md-4">
                    <label className="form-label text-brown">Nome do Status:</label>
                    <input
                        type="text"
                        name="title"
                        value={statModel.title}
                        onChange={handleChange}
                        className="form-control bg-beige text-brown border-brown"
                        required
                    />
                </div>
                <div className="col-md-6">
                    <label className="form-label text-brown">Fórmula (use os nomes dos atributos):</label>
                    <input
                        type="text"
                        name="formula"
                        value={statModel.formula}
                        onChange={handleChange}
                        className="form-control bg-beige text-brown border-brown"
                        required
                        placeholder="Ex: Força * 2 + Destreza / 2"
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

            {/* Lista de Status */}
            <div className="row g-4">
                {fields.map((stat, index) => (
                    <div className="col-md-4" key={index}>
                        <div className="px-3 py-2 border-brown rounded d-flex justify-content-between align-items-center bg-light-brown-transparent">
                            <p className="my-2 text-brown">
                                <strong>{stat.title}:</strong> <span className="text-muted-brown">"{stat.formula}"</span>
                            </p>
                            <button
                                className="btn btn-close-brown"
                                onClick={() => handleRemoveStat(index)}
                            >
                                ✕
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default StatsBlock;