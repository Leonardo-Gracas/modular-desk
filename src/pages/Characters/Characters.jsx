import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import StorageService from "../../services/storageService";

function Characters() {
  const navigate = useNavigate();
  const [characters, setCharacters] = useState([]);

  useEffect(() => {
    // Carrega personagens salvos
    const savedCharacters = StorageService.getData("characters") || [];
    setCharacters(savedCharacters);
  }, []);

  return (
    <div className="text-brown p-4">
      {/* Título e Descrição */}
      <h1 className="mb-4">🎭 Personagens</h1>
      <p className="lead text-brown">
        Preencha fichas e visualize seus personagens.
      </p>

      {/* Botão para Criar Personagem */}
      <button
        className="btn btn-brown mb-4"
        onClick={() => navigate("/create-character")}
      >
        Criar Personagem
      </button>

      {/* Divisor */}
      <hr className="border-brown" />

      {/* Lista de Personagens */}
      <h2 className="mb-4 text-brown">📜 Lista de Personagens</h2>
      {characters.length > 0 ? (
        <ul className="list-group">
          {characters.map((char, index) => (
            <Link
              key={index}
              to={`/character/${char.id}`}
              className="btn btn-beige text-brown text-start mb-2"
            >
              <strong>ID:</strong> {char.id} - <strong>Nome:</strong>{" "}
              {char.fields.find((f) => f.title === "Nome")?.value || "Sem Nome"}
            </Link>
          ))}
        </ul>
      ) : (
        <p className="text-brown">Nenhum personagem salvo.</p>
      )}
    </div>
  );
}

export default Characters; 