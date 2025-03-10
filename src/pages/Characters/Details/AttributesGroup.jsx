import React from 'react'

const AttributesGroup = ({ character, onChange }) => {
    const attributeGroups = character.fields
        .filter(f => f.blockType === "Attribute")
        .reduce((groups, field) => {
            if (!groups[field.blockTitle]) {
                groups[field.blockTitle] = [];
            }
            groups[field.blockTitle].push(field);
            return groups;
        }, {});

    const getBonusForStat = (statName) => {
        let bonus = 0;
        (character.inventory || []).forEach(item => {
            if (item.equipped && item.effects) {
                item.effects.forEach(effect => {
                    if (effect.attribute === statName) {
                        bonus += effect.cost;
                    }
                });
            }
        });
        return bonus;
    };

    return (
        Object.keys(attributeGroups).length > 0 && (
            <div className="mb-4">
                {Object.entries(attributeGroups).map(([blockTitle, attributes], index) => (
                    <div key={index} className="mb-3 pb-2">
                        <h4 className="text-brown pt-2 pb-2 border-bottom border-brown">⚔️ {blockTitle}</h4>
                        <div className="row g-3">
                            {attributes.map((field, i) => {
                                const bonus = getBonusForStat(field.title)

                                return <div key={i} className="col-md-4">
                                    <div className="d-flex align-items-center p-3 border-brown rounded bg-light-brown-transparent shadow-sm">
                                        <strong className="text-uppercase text-brown me-2">
                                            {field.title}:
                                        </strong>
                                        <p className="mb-0 text-brown">
                                            {field.value || 0} <strong>{bonus > 0 && " + " + bonus}</strong>
                                        </p>
                                    </div>
                                </div>
                            })}
                        </div>
                    </div>
                ))}
            </div>
        )
    )
}

export default AttributesGroup