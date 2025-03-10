import React, { useState } from "react";
import { Modal, Button, Form } from "react-bootstrap";

const InventoryPanel = ({ inventory, onUpdateInventory, character }) => {
    const [showInventoryModal, setShowInventoryModal] = useState(false);
    const [activeModalPage, setActiveModalPage] = useState("list"); // "list" ou "form"
    const [newItem, setNewItem] = useState({ name: "", description: "", quantity: 1, effects: [], stackable: false, equipped: false });
    const [expandedItem, setExpandedItem] = useState(null);
    const [editingIndex, setEditingIndex] = useState(null); // Para rastrear se está editando

    const openInventoryModal = () => {
        setShowInventoryModal(true);
        setActiveModalPage("list");
    };

    const closeInventoryModal = () => {
        setShowInventoryModal(false);
        setActiveModalPage("list");
    };

    const openItemForm = (item = null, index = null) => {
        if (item) {
            setNewItem(item);
            setEditingIndex(index);
        } else {
            setNewItem({ name: "", description: "", quantity: 1, effects: [], stackable: false, equipped: false });
            setEditingIndex(null);
        }
        setActiveModalPage("form");
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setNewItem(prev => ({ ...prev, [name]: value }));
    };

    const handleAddItem = (e) => {
        e.preventDefault();
        if (!newItem.name.trim()) return;

        const itemToSave = {
            ...newItem,
            // Se o item não for empilhável, desconsidera a quantidade
            quantity: newItem.stackable ? (Number(newItem.quantity) || 1) : undefined,
            equipped: newItem.equipped || false
        };

        let updatedInventory;
        if (editingIndex !== null) {
            updatedInventory = inventory.map((item, i) => (i === editingIndex ? itemToSave : item));
            setEditingIndex(null);
        } else {
            updatedInventory = [...inventory, itemToSave];
        }
        onUpdateInventory(updatedInventory);
        // Reseta o formulário e retorna para a listagem sem fechar o modal
        setNewItem({ name: "", description: "", quantity: 1, effects: [], stackable: false, equipped: false });
        setActiveModalPage("list");
    };

    const handleEditItem = (index) => {
        openItemForm(inventory[index], index);
    };

    const handleRemoveItem = (index) => {
        const updatedInventory = [...inventory];
        updatedInventory.splice(index, 1);
        onUpdateInventory(updatedInventory);
    };

    const toggleExpandItem = (index) => {
        setExpandedItem(expandedItem === index ? null : index);
    };

    const toggleEquipItem = (index) => {
        const updatedInventory = inventory.map((item, i) => {
            if (i === index && !item.stackable) {
                return { ...item, equipped: !item.equipped };
            }
            return item;
        });
        onUpdateInventory(updatedInventory);
    };

    const handleAddEffect = (e) => {
        e.preventDefault();
        setNewItem(prev => ({
            ...prev,
            effects: [...prev.effects, { attribute: "", cost: 0 }],
        }));
    };

    const handleRemoveEffect = (index) => {
        if (confirm("Tem certeza que deseja excluir este item do inventário?")) {
            setNewItem(prev => ({
                ...prev,
                effects: prev.effects.filter((_, i) => i !== index),
            }));
        }
    };

    const handleEffectChange = (index, field, value) => {
        setNewItem(prev => {
            const updatedEffects = [...prev.effects];
            updatedEffects[index][field] = value;
            return { ...prev, effects: updatedEffects };
        });
    };

    return (
        <>
            <div className="mb-2 col-md-6 ps-0 pe-1">
                <button className="card-custom bg-beige p-4 rounded-3 border-brown btn btn-outline-brown w-100" onClick={openInventoryModal}>
                    <h3 className="mb-0">📦 Inventário</h3>
                </button>
            </div>
            <Modal show={showInventoryModal} onHide={closeInventoryModal} size="lg">
                <Modal.Header closeButton className="bg-beige border-brown">
                    {activeModalPage === "list" ? (
                        <Modal.Title className="text-brown">📦 Inventário</Modal.Title>
                    ) : (
                        <Modal.Title className="text-brown">
                            {editingIndex !== null ? "Editar Item" : "Adicionar Item"}
                        </Modal.Title>
                    )}
                </Modal.Header>
                <Modal.Body className="bg-beige">
                    {activeModalPage === "list" ? (
                        <>
                            <button className="btn btn-brown btn-sm mb-3 mt-2" onClick={() => openItemForm()}>
                                + Adicionar Item
                            </button>
                            {inventory.length === 0 ? (
                                <p className="text-brown">Nenhum item adicionado.</p>
                            ) : (
                                <div className="d-flex flex-wrap gap-3 overflow-y-auto">
                                    {inventory.map((item, index) => (
                                        <div key={index} className="p-3 border-brown rounded bg-light-brown-transparent shadow-sm w-100">
                                            {/* Cabeçalho: nome, quantidade (se stackable) e botões de ação */}
                                            <div className="d-flex justify-content-between align-items-center">
                                                <h5 className="mb-1 text-brown">
                                                    {item.name} {item.stackable && item.quantity ? `x${item.quantity}` : ""}
                                                </h5>
                                                <div>
                                                    {item.stackable ? (
                                                        <button className="btn btn-sm btn-warning">
                                                            Consumir
                                                        </button>
                                                    ) : (
                                                        <button
                                                            className={`btn btn-sm ${item.equipped ? "btn-danger" : "btn-success"}`}
                                                            onClick={() => toggleEquipItem(index)}
                                                        >
                                                            {item.equipped ? (
                                                                <i className="bi bi-shield-slash"></i>
                                                            ) : (
                                                                <i className="bi bi-shield"></i>
                                                            )}
                                                        </button>
                                                    )}
                                                </div>
                                            </div>
                                            <p className="mb-0 text-brown">{item.description}</p>
                                            {item.effects?.length > 0 && (
                                                <div className="mt-2">
                                                    <strong>Efeitos:</strong>
                                                    <ul className="list-group list-group-flush">
                                                        {item.effects.map((effect, i) => (
                                                            <li key={i} className="list-group-item border-0 bg-transparent p-1">
                                                                {effect.attribute}: <strong>{effect.cost}</strong>
                                                            </li>
                                                        ))}
                                                    </ul>
                                                </div>
                                            )}
                                            <div className="mt-2 d-flex gap-2">
                                                <button className="btn btn-sm btn-outline-secondary" onClick={() => openItemForm(item, index)}>
                                                    ✏️ Editar
                                                </button>
                                                <button className="btn btn-sm btn-outline-danger" onClick={() => handleRemoveItem(index)}>
                                                    Remover
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </>
                    ) : (
                        <Form onSubmit={handleAddItem}>
                            <Form.Group className="mb-3">
                                <Form.Label className="text-brown">Nome:</Form.Label>
                                <Form.Control
                                    type="text"
                                    name="name"
                                    value={newItem.name}
                                    onChange={handleChange}
                                    className="bg-beige text-brown border-brown"
                                    required
                                />
                            </Form.Group>
                            <Form.Group className="mb-3">
                                <Form.Label className="text-brown">Descrição:</Form.Label>
                                <Form.Control
                                    as="textarea"
                                    rows={3}
                                    name="description"
                                    value={newItem.description}
                                    onChange={handleChange}
                                    className="bg-beige text-brown border-brown"
                                />
                            </Form.Group>
                            <Form.Group className="mb-3">
                                <Form.Check
                                    type="checkbox"
                                    label="Empilhável"
                                    name="stackable"
                                    checked={newItem.stackable}
                                    onChange={(e) =>
                                        setNewItem(prev => ({ ...prev, stackable: e.target.checked }))
                                    }
                                    className="text-brown"
                                />
                            </Form.Group>
                            {newItem.stackable && (
                                <Form.Group className="mb-3">
                                    <Form.Label className="text-brown">Quantidade:</Form.Label>
                                    <Form.Control
                                        type="number"
                                        name="quantity"
                                        value={newItem.quantity}
                                        onChange={handleChange}
                                        className="bg-beige text-brown border-brown"
                                        min="1"
                                    />
                                </Form.Group>
                            )}
                            <hr className="border-brown" />
                            <h5 className="text-brown">Efeitos</h5>
                            {newItem.effects.map((effect, index) => (
                                <div key={index} className="d-flex align-items-center mb-2">
                                    <Form.Select
                                        className="me-2 bg-beige text-brown border-brown"
                                        value={effect.attribute}
                                        onChange={(e) => handleEffectChange(index, "attribute", e.target.value)}
                                    >
                                        <option value="">Selecione um atributo</option>
                                        {character.fields.map((field, idx) => {
                                            if (field.blockType === "Identity" || field.blockType === "Main") return null;
                                            return (
                                                <option key={idx} value={field.title}>
                                                    {field.title}
                                                </option>
                                            );
                                        })}
                                    </Form.Select>
                                    <Form.Control
                                        type="number"
                                        className="me-2 bg-beige text-brown border-brown"
                                        value={effect.cost}
                                        onChange={(e) => handleEffectChange(index, "cost", Number(e.target.value))}
                                    />
                                    <button className="btn btn-sm btn-danger" onClick={() => handleRemoveEffect(index)}>
                                        X
                                    </button>
                                </div>
                            ))}
                            <button className="btn btn-sm btn-brown mt-2" onClick={handleAddEffect}>
                                + Adicionar Efeito
                            </button>
                            <hr className="border-brown mb-1 mt-3" />
                            <button type="submit" className="btn btn-brown w-100 mt-3">
                                Salvar Item
                            </button>
                        </Form>
                    )}
                </Modal.Body>
                {activeModalPage === "form" && (
                    <Modal.Footer className="bg-beige">
                        <button className="btn btn-outline-brown" onClick={() => setActiveModalPage("list")}>
                            Voltar
                        </button>
                    </Modal.Footer>
                )}
            </Modal>
        </>
    );
};

export default InventoryPanel;
