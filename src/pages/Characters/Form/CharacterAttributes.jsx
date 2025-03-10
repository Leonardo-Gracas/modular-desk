import React from "react";

const CharacterAttributes = ({ blocks, _attributes, onChange, level }) => {
    return (
        <div className="my-4 card-custom bg-beige p-4 rounded-3 border-brown">
            <h2 className="mb-4 text-brown border-bottom border-brown pb-2">🎯 Atributos</h2>
            {blocks.map((block, blockIndex) => {
                // Filtrar apenas os atributos pertencentes a este bloco
                const blockFields = _attributes.filter(
                    (attr) => attr.blockTitle === block.title
                );

                const totalPoints = level * (block.pointsPerLevel || 1) + block.basePoints;
                const usedPoints = blockFields.reduce(
                    (sum, field) => sum + Number(field.value || 0),
                    0
                );
                const remainingPoints = totalPoints - usedPoints;

                return (
                    <div key={blockIndex} className="mb-4">
                        <h4 className="text-brown border-bottom border-brown pb-2">{block.title}</h4>
                        <p className="mb-0 text-brown">
                            <strong>Pontos Totais:</strong> {totalPoints}
                        </p>
                        <p className="mb-2 text-brown">
                            <strong>Pontos Restantes:</strong> {remainingPoints}
                        </p>
                        <div className="row">
                            {blockFields.map((field, fieldIndex) => (
                                <div
                                    key={fieldIndex}
                                    className={`col-md-4 mb-3`}
                                >
                                    <label className="text-brown">{field.title}</label>
                                    <input
                                        type="number"
                                        value={field.value || 0}
                                        className="form-control bg-beige text-brown border-brown"
                                        min="0"
                                        onChange={(e) => {
                                            const newValue = Number(e.target.value);
                                            onChange(block.title, field.title, newValue);
                                        }}
                                    />
                                </div>
                            ))}
                        </div>
                    </div>
                );
            })}
        </div>
    );
};

export default CharacterAttributes;