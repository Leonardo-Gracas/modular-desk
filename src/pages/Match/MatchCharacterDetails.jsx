import React from "react";
import { useNavigate, Link } from "react-router-dom";
import StatsPanel from "../Characters/Details/StatsPanel";
import InventoryPanel from "../Characters/Details/InventoryPanel";
import TalentsPanel from "../Characters/Details/TalentsPanel";
import EquippedItemsPanel from "../Characters/Details/EquippedItemsPanel";
import AttributesGroup from "../Characters/Details/AttributesGroup";

const MatchCharacterDetails = ({ character, onUpdateCharacter, isMain }) => {
    const navigate = useNavigate();

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

    const handleUpdateInventory = (newInventory) => {
        onUpdateCharacter({ ...character, inventory: newInventory });
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
                                                <p className="mb-0 text-brown">{field.value || "N/A"}</p>
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
                                                <p className="mb-0 text-brown">{field.value || "N/A"}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {stats.length > 0 && <StatsPanel onChange={onUpdateCharacter} character={character} />}

                        <AttributesGroup character={character} onChange={onUpdateCharacter} />
                    </div>
                </div>

                <div className="col-md-5 row" style={{ height: "fit-content" }}>
                    {isMain &&
                        <>
                            <InventoryPanel inventory={character.inventory} onUpdateInventory={handleUpdateInventory} />
                            <TalentsPanel onChange={onUpdateCharacter} character={character} />
                        </>
                    }
                    <div className="card-custom bg-beige p-4 rounded-3 border-brown mb-4 col-md-12">
                        <EquippedItemsPanel inventory={character.inventory} isMain={isMain} onUpdateInventory={handleUpdateInventory} />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MatchCharacterDetails;