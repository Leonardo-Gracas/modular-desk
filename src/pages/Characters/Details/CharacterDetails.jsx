import React, { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import StorageService from "../../../services/storageService";
import StatsPanel from "./StatsPanel";
import InventoryPanel from "./InventoryPanel";
import TalentsPanel from "./TalentsPanel";
import EquippedItemsPanel from "./EquippedItemsPanel";
import AttributesGroup from "./AttributesGroup";

function CharacterDetails() {
    const { characterId } = useParams();
    const navigate = useNavigate();
    const [character, setCharacter] = useState(null);

    useEffect(() => {
        const savedCharacters = StorageService.getData("characters") || [];
        const foundCharacter = savedCharacters.find(
            (char) => char.id.toString() === characterId
        );
        if (foundCharacter) {
            console.log(foundCharacter);
            if (!foundCharacter.talents) {
                foundCharacter.talents = [];
            }
            // Se não existir inventário, inicializa com array vazio
            if (!foundCharacter.inventory) {
                foundCharacter.inventory = [];
            }
            setCharacter(foundCharacter);
        }
    }, [characterId]);

    useEffect(() => {
        if (character) {
            const savedCharacters = StorageService.getData("characters") || [];
            const updatedCharacters = savedCharacters.map((char) =>
                char.id === character.id ? character : char
            );
            StorageService.saveData("characters", updatedCharacters);
        }
    }, [character]);

    if (!character) {
        return <p className="text-danger">Personagem não encontrado.</p>;
    }

    const mainFields = character.fields.filter(f => f.blockType === "Main");
    mainFields.push({
        "title": "Modelo",
        "type": "text",
        "value": character.model.name,
        "colspan": 1,
        "deletable": false,
        "blockType": "Main"
    });
    const identityFields = character.fields.filter(f => f.blockType === "Identity");
    const stats = character.stats || [];

    // Callback para atualizar o inventário dentro do personagem
    const handleUpdateInventory = (newInventory) => {
        const updatedCharacter = { ...character, inventory: newInventory };
        setCharacter(updatedCharacter);
    };

    // Função para remover o personagem do storage e redirecionar
    const handleRemoveCharacter = () => {
        if (window.confirm("Deseja remover este personagem?")) {
            if (window.confirm("Tem certeza? esta ação não pode ser desfeita")) {
                const savedCharacters = StorageService.getData("characters") || [];
                const updatedCharacters = savedCharacters.filter(
                    (char) => char.id.toString() !== characterId
                );
                StorageService.saveData("characters", updatedCharacters);
                navigate("/characters"); // ajuste para a rota desejada
            }
        }
    };

    return (
        <div className="container mt-4">
            <div className="row">
                <div className="col-md-7">
                    <div className="card-custom bg-beige p-4 rounded-3 border-brown mb-4">
                        <div className="d-flex justify-content-between align-items-center">
                            <h1 className="text-center text-brown">
                                {mainFields.find(f => f.title === "Nome")?.value || "Personagem Sem Nome"}
                            </h1>
                            <div>
                                <Link to={`/modular-desk/match/${characterId}`} className="btn btn-outline-brown me-2">
                                    Partida
                                </Link>
                                <button className="btn btn-outline-danger" onClick={handleRemoveCharacter}>
                                    Excluir
                                </button>
                            </div>
                        </div>
                        <hr className="border-brown mb-4" />

                        {mainFields.length > 0 && (
                            <div className="mb-4">
                                <h3 className="text-brown border-bottom border-brown pb-2">🪶 Informações Básicas</h3>
                                <div className="row g-3">
                                    {mainFields.map((field, index) => (
                                        <div key={index} className={`col-md-${(field.colspan || 1) * 3}`}>
                                            <div className="p-3 border-brown rounded bg-light-brown-transparent shadow-sm">
                                                <strong className="text-uppercase text-brown">
                                                    {field.title}:
                                                </strong>
                                                <p className="mb-0 text-brown">
                                                    {field.value || "N/A"}
                                                </p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {identityFields.length > 0 && (
                            <div className="mb-4">
                                <div className="row g-3">
                                    {identityFields.map((field, index) => (
                                        <div key={index} className={`col-md-${(field.colspan || 1) * 3}`}>
                                            <div className="p-3 border-brown rounded bg-light-brown-transparent shadow-sm">
                                                <strong className="text-uppercase text-brown">
                                                    {field.title}:
                                                </strong>
                                                <p className="mb-0 text-brown">
                                                    {field.value || "N/A"}
                                                </p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {stats.length > 0 && <StatsPanel onChange={setCharacter} character={character} />}

                        <AttributesGroup character={character} onChange={setCharacter} />
                    </div>
                </div>

                <div className="col-md-5 row" style={{ height: "fit-content" }}>
                    <InventoryPanel
                        inventory={character.inventory}
                        onUpdateInventory={handleUpdateInventory}
                        character={character}
                    />
                    <TalentsPanel onChange={setCharacter} character={character} />
                    <div className="card-custom bg-beige p-4 rounded-3 border-brown mb-4 col-md-12">
                        <EquippedItemsPanel inventory={character.inventory} onUpdateInventory={handleUpdateInventory} />
                    </div>
                </div>
            </div>
        </div>
    );
}

export default CharacterDetails;
