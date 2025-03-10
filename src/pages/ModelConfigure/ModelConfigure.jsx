import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import IdentityBlock from "./blocs/IdentityBlock";
import StorageService from "../../services/storageService";
import AttributeBlock from "./blocs/AttributesBlock";
import MainBlock from "./blocs/MainBlock";
import StatsBlock from "./blocs/StatsBlock";

const ModelConfigure = () => {
    const { modelId } = useParams();
    const [model, setModel] = useState({
        id: modelId || Date.now(),
        name: "",
        idCounter: 0,
        blocs: [
            {
                id: 0,
                type: "Main",
                fields: [
                    { title: "Nome", type: "text", value: "", colspan: 2, deletable: false },
                    { title: "Nivel", type: "number", value: "", colspan: 1, deletable: false }
                ]
            }
        ]
    });

    useEffect(() => {
        if (modelId) {
            const savedModel = StorageService.getData(`model-${modelId}`);
            if (savedModel) setModel(savedModel);
        }
    }, [modelId]);

    const handleNameChange = (e) => {
        setModel(prev => ({ ...prev, name: e.target.value }));
    };

    const addBlock = () => {
        const type = document.querySelector("#blockType").value;
        setModel(prev => ({
            ...prev,
            idCounter: ++prev.idCounter,
            blocs: [...prev.blocs, { id: prev.idCounter, type, fields: [] }]
        }));
    };

    const removeBlock = (id) => {
        setModel(prev => ({ ...prev, blocs: prev.blocs.filter(block => block.id !== id) }));
    };

    const saveBlock = (updatedBlock) => {
        setModel(prev => ({
            ...prev,
            blocs: prev.blocs.map(block => (block.id === updatedBlock.id ? updatedBlock : block))
        }));
    };

    const saveModelToStorage = () => {
        if (!model.name.trim()) {
            alert("Por favor, insira um nome para o modelo antes de salvar.");
            return;
        }
        StorageService.saveData(`model-${model.id}`, model);
        console.log(model);

        alert("Modelo salvo com sucesso!");
    };

    return (
        <div className="work-area text-brown p-4">
            {/* Título */}
            <h1>{modelId ? "Editar Modelo" : "Criar Novo Modelo"}</h1>
            <hr className="border-brown" />

            {/* Nome do Modelo */}
            <div className="row px-3 mb-4">
                <label className="text-brown">Nome do Modelo:</label>
                <input
                    type="text"
                    value={model.name}
                    onChange={handleNameChange}
                    className="form-control bg-beige text-brown border-brown"
                    placeholder="Digite um nome para o modelo"
                />
            </div>
            <hr className="border-brown" />

            {/* Adicionar Bloco */}
            <div className="row px-3 mb-4">
                <select
                    id="blockType"
                    className="form-select bg-beige text-brown border-brown"
                    style={{ width: "33.33333333%" }}
                >
                    <option value="Identity">Identidade</option>
                    <option value="Attribute">Atributos</option>
                    <option value="Stats">Status</option>
                </select>
                <button
                    className="btn btn-brown col-md-2 mx-2"
                    onClick={addBlock}
                >
                    Adicionar Bloco
                </button>
            </div>
            <hr className="border-brown mb-5" />

            {/* Blocos do Modelo */}
            {model.blocs.map((block, i) => {
                if (block.type === "Main") return <MainBlock _fields={block.fields} key={i} />;
                if (block.type === "Identity") return <IdentityBlock _fields={block.fields} id={block.id} saveAction={saveBlock} deleteAction={removeBlock} key={i} />;
                if (block.type === "Attribute") return <AttributeBlock _fields={block.fields} _pointsPerLevel={block.pointsPerLevel} _title={block.title} _basePoints={block.basePoints} id={block.id} saveAction={saveBlock} deleteAction={removeBlock} key={i} />;
                if (block.type === "Stats") return <StatsBlock attributes={model.blocs.find(x => x.type == "Attribute").fields || []} _fields={block.fields} id={block.id} saveAction={saveBlock} deleteAction={removeBlock} key={i} />;
                return <p>Erro ao carregar bloco</p>;
            })}

            {/* Botão de Salvar */}
            <hr className="border-brown" />
            <div className="w-100 text-end pb-4">
                <button
                    className="btn btn-brown"
                    onClick={saveModelToStorage}
                >
                    Salvar Modelo
                </button>
            </div>
        </div>
    );
};

export default ModelConfigure;