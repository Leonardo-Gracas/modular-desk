import React, { useState } from "react";
import { Modal, Button, Form, Card } from "react-bootstrap";

const TalentsPanel = ({ character, onChange }) => {
    const talents = character.talents || [];
    const stats = character.stats || [];

    const [showTalentsModal, setShowTalentsModal] = useState(false);
    const [activeModalPage, setActiveModalPage] = useState("list");
    const [editingIndex, setEditingIndex] = useState(null);
    const [newTalent, setNewTalent] = useState({ name: "", description: "", effects: [] });
    const [expandedTalent, setExpandedTalent] = useState(null);

    // Abre o modal geral e define a página inicial como a listagem de talentos
    const openTalentsModal = () => {
        setShowTalentsModal(true);
        setActiveModalPage("list");
    };

    // Fecha o modal geral e volta para a página de listagem
    const closeTalentsModal = () => {
        setActiveModalPage("list");
        setShowTalentsModal(false);
    };

    // Abre a "página" do formulário de criação/edição
    const openTalentForm = (talent = null, index = null) => {
        if (talent) {
            setNewTalent(talent);
            setEditingIndex(index);
        } else {
            setNewTalent({ name: "", description: "", effects: [] });
            setEditingIndex(null);
        }
        setActiveModalPage("form");
    };

    const handleAddOrUpdateTalent = (e) => {
        e.preventDefault();
        if (newTalent.name && newTalent.description) {
            const updatedTalents = [...talents];
            if (editingIndex !== null) {
                updatedTalents[editingIndex] = newTalent;
            } else {
                updatedTalents.push(newTalent);
            }
            onChange((prevCharacter) => ({ ...prevCharacter, talents: updatedTalents }));
            setActiveModalPage("list");
        }
    };

    const handleRemoveTalent = (index) => {
        if (confirm("Deseja mesmo excluir este talento?")) {
            const updatedTalents = talents.filter((_, i) => i !== index);
            onChange((prevCharacter) => ({ ...prevCharacter, talents: updatedTalents }));
        }
    };

    const toggleExpandTalent = (index) => {
        setExpandedTalent(expandedTalent === index ? null : index);
    };

    const handleAddEffect = (e) => {
        e.preventDefault();
        setNewTalent((prev) => ({
            ...prev,
            effects: [...prev.effects, { attribute: stats[0]?.title || "", cost: 0 }],
        }));
    };

    const handleRemoveEffect = (e, index) => {
        e.preventDefault();
        setNewTalent((prev) => ({
            ...prev,
            effects: prev.effects.filter((_, i) => i !== index),
        }));
    };

    const handleEffectChange = (index, field, value) => {
        setNewTalent((prev) => {
            const updatedEffects = [...prev.effects];
            updatedEffects[index][field] = value;
            return { ...prev, effects: updatedEffects };
        });
    };

    const applyEffects = (talent) => {
        let updatedStats = [...stats];

        talent.effects.forEach((effect) => {
            const statIndex = updatedStats.findIndex((s) => s.title === effect.attribute);
            if (statIndex !== -1) {
                updatedStats[statIndex] = {
                    ...updatedStats[statIndex],
                    current: (updatedStats[statIndex].current || 0) + effect.cost,
                };
            }
        });

        onChange((prevCharacter) => ({ ...prevCharacter, stats: updatedStats }));
    };

    return (
        <>
            <div className="mb-2 col-md-6 ps-1 pe-0">
                <button className="card-custom bg-beige p-4 rounded-3 border-brown btn btn-sm btn-outline-brown w-100" onClick={openTalentsModal}>
                    <h3 className="mb-0">✨ Talentos</h3>
                </button>
            </div>
            <Modal show={showTalentsModal} onHide={closeTalentsModal} size="lg">
                <Modal.Header closeButton className="bg-beige border-brown">
                    {activeModalPage === "list" ? (
                        <Modal.Title className="text-brown">✨ Talentos</Modal.Title>
                    ) : (
                        <Modal.Title className="text-brown">
                            {editingIndex !== null ? "Editar Talento" : "Adicionar Talento"}
                        </Modal.Title>
                    )}
                </Modal.Header>
                <Modal.Body className="bg-beige">
                    {activeModalPage === "list" ? (
                        <>
                            <button className="btn-sm btn-brown mb-3" onClick={() => openTalentForm()}>
                                + Adicionar Talento
                            </button>

                            {talents.length === 0 ? (
                                <p className="text-brown">Nenhum talento adicionado.</p>
                            ) : (
                                <div className="d-flex flex-wrap gap-3">
                                    {talents.map((talent, index) => (
                                        <Card key={index} className="bg-light-brown-transparent border-0 text-brown w-100">
                                            <Card.Body>
                                                <div className="d-flex justify-content-between align-items-center">
                                                    <div>
                                                        <Card.Title className="mb-1">{talent.name}</Card.Title>
                                                        <Card.Text className="mb-2">{talent.description}</Card.Text>
                                                    </div>
                                                    <div className="d-flex gap-2">
                                                        <button
                                                            className="btn btn-sm btn-outline-brown"
                                                            onClick={() => toggleExpandTalent(index)}
                                                        >
                                                            {expandedTalent === index ? (
                                                                <span className="py-0 my-0 px-1">x</span>
                                                            ) : (
                                                                "🪶"
                                                            )}
                                                        </button>
                                                    </div>
                                                </div>
                                                {talent.effects.length > 0 && (
                                                    <div className="mt-2">
                                                        <strong>Efeitos:</strong>
                                                        <ul className="list-group list-group-flush">
                                                            {talent.effects.map((effect, i) => (
                                                                <li key={i} className="list-group-item bg-transparent p-1">
                                                                    {effect.attribute}: <strong>{effect.cost}</strong>
                                                                </li>
                                                            ))}
                                                        </ul>
                                                    </div>
                                                )}

                                                {expandedTalent === index && (
                                                    <>
                                                        <button
                                                            className="btn btn-sm btn-outline-brown me-2"
                                                            onClick={() => applyEffects(talent)}
                                                        >
                                                            ⚡ Acionar
                                                        </button>
                                                        <button
                                                            className="btn btn-sm btn-outline-brown me-2"
                                                            onClick={() => openTalentForm(talent, index)}
                                                        >
                                                            ✏️ Editar
                                                        </button>
                                                        <button
                                                            className="btn btn-outline-danger btn-sm"
                                                            onClick={() => handleRemoveTalent(index)}
                                                        >
                                                            Excluir
                                                        </button>
                                                    </>
                                                )}
                                            </Card.Body>
                                        </Card>
                                    ))}
                                </div>
                            )}
                        </>
                    ) : (
                        <Form>
                            <Form.Group>
                                <Form.Label className="text-brown">Nome</Form.Label>
                                <Form.Control
                                    type="text"
                                    className="me-2 bg-beige text-brown border-brown"
                                    value={newTalent.name}
                                    onChange={(e) =>
                                        setNewTalent({ ...newTalent, name: e.target.value })
                                    }
                                />
                            </Form.Group>

                            <Form.Group className="mt-2">
                                <Form.Label className="text-brown">Descrição</Form.Label>
                                <Form.Control
                                    as="textarea"
                                    className="me-2 bg-beige text-brown border-brown"
                                    rows={2}
                                    value={newTalent.description}
                                    onChange={(e) =>
                                        setNewTalent({ ...newTalent, description: e.target.value })
                                    }
                                />
                            </Form.Group>

                            <h5 className="text-brown mt-3">Efeitos</h5>
                            {newTalent.effects.map((effect, index) => (
                                <div key={index} className="d-flex align-items-center mb-2">
                                    <Form.Select
                                        value={effect.attribute}
                                        className="me-2 bg-beige text-brown border-brown"
                                        onChange={(e) =>
                                            handleEffectChange(index, "attribute", e.target.value)
                                        }
                                    >
                                        {stats.map((stat) => (
                                            <option key={stat.title} value={stat.title}>
                                                {stat.title}
                                            </option>
                                        ))}
                                    </Form.Select>
                                    <Form.Control
                                        type="number"
                                        className="me-2 bg-beige text-brown border-brown"
                                        value={effect.cost}
                                        onChange={(e) =>
                                            handleEffectChange(index, "cost", Number(e.target.value))
                                        }
                                    />
                                    <button
                                        className="btn-sm btn-danger"
                                        onClick={(e) => handleRemoveEffect(e, index)}
                                    >
                                        X
                                    </button>
                                </div>
                            ))}

                            <button className="btn btn-sm btn-brown mt-2" onClick={handleAddEffect}>
                                + Adicionar Efeito
                            </button>
                            <hr className="border-brown mb-1 mt-3" />
                            <button
                                className="btn btn-brown w-100 mt-3"
                                onClick={handleAddOrUpdateTalent}
                            >
                                Salvar Item
                            </button>
                        </Form>
                    )}
                </Modal.Body>
                {activeModalPage === "form" && (
                    <Modal.Footer className="bg-beige">
                        <button className="btn btn-sm btn-outline-brown" onClick={() => setActiveModalPage("list")}>
                            Voltar
                        </button>
                    </Modal.Footer>
                )}
            </Modal>
        </>
    );
};

export default TalentsPanel;