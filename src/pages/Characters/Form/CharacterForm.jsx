import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import StorageService from "../../../services/storageService";
import CharacterAttributes from "./CharacterAttributes";
import CharacterStats from "./CharacterStats";

function CharacterForm() {
    const navigate = useNavigate();
    const [models, setModels] = useState([]);
    const [selectedModel, setSelectedModel] = useState(null);
    const [level, setLevel] = useState(1);
    const [character, setCharacter] = useState({ id: Date.now(), fields: [], inventory: [], talents: []  });

    useEffect(() => {
        const savedModels = StorageService.getAllModels();
        setModels(savedModels);
    }, []);

    const handleModelSelect = (e) => {
        const modelId = e.target.value;
        const model = models.find((m) => m.id == parseInt(modelId));

        if (model) {
            setSelectedModel(model);

            const mainFields = model.blocs.find(b => b.type === "Main")?.fields || [];
            const allFields = model.blocs.flatMap((b) =>
                b.fields.map((field) => ({
                    ...field,
                    blockType: b.type,
                    blockTitle: b.title
                }))
            );

            const mainLevelField = mainFields.find(f => f.title === "Nivel");
            if (mainLevelField) {
                setLevel(mainLevelField.value || 1);
            }

            setCharacter({
                id: Date.now(),
                fields: allFields,
                model: { id: model.id, name: model.name },
            });
        }
    };

    const handleInputChange = (index, value) => {
        setCharacter((prev) => {
            const updatedFields = prev.fields.map((field, i) =>
                i === index ? { ...field, value } : field
            );
            return { ...prev, fields: updatedFields };
        });

        if (character.fields[index].title === "Nivel") {
            setLevel(Number(value) || 1);
        }
    };

    const handleAttributeChange = (blockIndex, fieldname, value) => {
        setCharacter((prev) => {
            const updatedFields = prev.fields.map((field, i) => {
                if (field.title == fieldname) {
                    return { ...field, value }
                }
                return field;
            });

            return { ...prev, fields: updatedFields };
        });
    };

    // Função para atualizar os stats no personagem
    const updateCharacterStats = (computedStats) => {
        setCharacter((prev) => {
            // Atualiza ou adiciona uma propriedade "stats" no objeto character
            return { ...prev, stats: computedStats };
        });
    };

    const saveCharacter = () => {
        const savedCharacters = StorageService.getData("characters") || [];
        const updatedCharacters = [...savedCharacters, character];
        StorageService.saveData("characters", updatedCharacters);
        alert("Personagem salvo com sucesso!");
        //navigate("/characters");
    };

    const attributeFields = character.fields.filter(f => f.blockType === "Attribute");
    const stats = character.fields.filter(f => f.blockType === "Stats");

    return (
        <div className="text-brown p-4">
            {/* Título e Descrição */}
            <h1 className="mb-4">📝 Criar Personagem</h1>
            <p className="lead text-brown">
                Escolha um modelo de ficha para criar seu personagem.
            </p>

            {/* Seleção de Modelo */}
            <select
                className="form-select bg-beige text-brown border-brown mb-4"
                onChange={handleModelSelect}
            >
                <option value="">Selecione um modelo...</option>
                {models.map((model, index) => (
                    <option key={index} value={model.id}>
                        {`${model.name}`}
                    </option>
                ))}
            </select>

            {selectedModel && (
                <div className="mt-4">
                    {/* Informações do Personagem */}
                    <h2 className="mb-4 text-brown border-bottom border-brown pb-2">📋 Informações do Personagem</h2>

                    {/* Campos Principais */}
                    <div className="row mb-3">
                        {character.fields.map((field, index) => {
                            if (field.blockType === "Main") {
                                return (
                                    <div key={index} className={`col-md-${field.colspan * 3 || 1} mb-3`}>
                                        <label className="form-label text-brown fw-bold">{field.title}</label>
                                        <input
                                            type={field.type}
                                            value={field.title === "Nivel" ? level : field.value}
                                            className="form-control bg-beige text-brown border-brown"
                                            onChange={(e) => handleInputChange(index, e.target.value)}
                                        />
                                    </div>
                                );
                            }
                            return null;
                        })}
                        <div className="col-md-12">
                            <hr className="border-brown" />
                        </div>
                        {character.fields.map((field, index) => {
                            if (field.blockType === "Identity") {
                                return (
                                    <div key={index} className={`col-md-${field.colspan * 3 || 1} mb-3`}>
                                        <label className="form-label text-brown fw-bold">{field.title}</label>
                                        <input
                                            type={field.type}
                                            value={field.title === "Nivel" ? level : field.value}
                                            className="form-control bg-beige text-brown border-brown"
                                            onChange={(e) => handleInputChange(index, e.target.value)}
                                        />
                                    </div>
                                );
                            }
                            return null;
                        })}
                    </div>

                    {/* Atributos */}
                    {attributeFields.length > 0 && (
                        <CharacterAttributes
                            blocks={selectedModel.blocs.filter(b => b.type === "Attribute")}
                            _attributes={character.fields}
                            onChange={handleAttributeChange}
                            level={level}
                        />
                    )}

                    {/* Status */}
                    {stats.length > 0 && (
                        <CharacterStats
                            attributes={attributeFields}
                            stats={stats}
                            onStatsComputed={updateCharacterStats}
                        />
                    )}

                    {/* Botão de Salvar */}
                    <button className="btn btn-brown mt-3" onClick={saveCharacter}>
                        💾 Salvar Personagem
                    </button>
                </div>
            )}
        </div>
    );
}

export default CharacterForm;