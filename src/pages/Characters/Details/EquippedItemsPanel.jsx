import React, { useState, useEffect } from "react";

function EquippedItemsPanel({ inventory, onUpdateInventory, isMain = true }) {
    const equippedItems = inventory.filter(item => item.equipped);

    return (
        <div>
            <div className="d-flex justify-content-between align-items-center">
                <h3 className="text-brown">🛡️ Equipamento</h3>
            </div>
            <div className="mt-2">
                <hr className="mb-3 mt-3 border-brown" />
                {equippedItems.length > 0 ? (
                    equippedItems.map(item => (
                        <div key={item.id || item.name} className="p-2 border-brown rounded bg-light-brown-transparent shadow-sm mb-2">
                            <div className="w-100 d-flex justify-content-between">
                                <h5 className="mb-1 text-brown">{item.name}</h5>
                                {isMain ?
                                    <button className="btn btn-sm btn-danger" onClick={() => {
                                        const updatedInventory = inventory.map(i =>
                                            i === item ? { ...i, equipped: false } : i
                                        );
                                        onUpdateInventory(updatedInventory);
                                    }}>
                                        <i className="bi bi-shield-slash"></i>
                                    </button>
                                    : <></>    
                                }
                            </div>
                            <p className="mb-0 text-brown">{item.description}</p>
                            {item.effects?.length > 0 && (
                                <div className="mt-2">
                                    <strong>Efeitos:</strong>
                                    <ul className="list-group list-group-flush">
                                        {item.effects.map((effect, i) => (
                                            <li key={i} className="list-group-item bg-transparent p-1">
                                                {effect.attribute}: <strong>{effect.cost}</strong>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            )}
                        </div>
                    ))
                ) : (
                    <p className="text-brown">Nenhum item equipado.</p>
                )}
            </div>
        </div>
    );
}

export default EquippedItemsPanel;
