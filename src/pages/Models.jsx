import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import StorageService from "../services/storageService";

const Models = () => {
    const [models, setModels] = useState([]);

    useEffect(() => {
        const savedModels = StorageService.getAllModels().map(x => {
            return {
                id: x.id,
                name: x.name
            }
        });
        setModels(savedModels);
    }, []);

    return (
        <div className="text-brown p-4">
            {/* Título e Descrição */}
            <h1 className="mb-4">📜 Modelos Salvos</h1>
            <p className="lead text-brown">
                Aqui você pode criar e editar modelos de fichas.
            </p>

            {/* Botão para criar novo modelo */}
            <Link className="btn btn-brown mb-4" to="/modular-desk/configure-model/">
                Criar Novo Modelo
            </Link>

            {/* Divisor */}
            <hr className="border-brown" />

            {/* Lista de modelos */}
            <ul className="list-group">
                {models.length === 0 && (
                    <p className="text-brown">Nenhum modelo salvo.</p>
                )}
                {models.map((model, index) => (
                    <Link
                        key={index}
                        to={`/modular-desk/configure-model/${model.id}`}
                        className="btn btn-beige text-brown text-start mb-2"
                    >
                        <strong>ID:</strong> {model.id}, <strong>Nome:</strong> {model.name}
                    </Link>
                ))}
            </ul>
        </div>
    );
};

export default Models;