import React from "react";
import { Link } from "react-router-dom";

function Home() {
  return (
    <div className="container text-center text-dark p-4">
      {/* Título e Descrição */}
      <h1 className="mb-4 display-4 text-brown">📜 Bem-vindo ao Criador de Personagens</h1>
      <p className="lead text-brown">
        Aqui você pode criar, personalizar e gerenciar modelos e personagens de forma intuitiva.  
        Siga as etapas abaixo para começar sua jornada!
      </p>

      {/* Etapas */}
      <div className="row mt-5">
        {/* Etapa 1 - Criar um Modelo */}
        <div className="col-md-4">
          <div className="card shadow-lg p-3 mb-4 bg-beige border-brown">
            <h3 className="text-brown">1️⃣ Criar um Modelo</h3>
            <p className="text-brown">Defina a estrutura de seus personagens criando um modelo personalizado.</p>
            <Link to="/modular-desk/models" className="btn btn-brown">📜 Gerenciar Modelos</Link>
          </div>
        </div>

        {/* Etapa 2 - Criar um Personagem */}
        <div className="col-md-4">
          <div className="card shadow-lg p-3 mb-4 bg-beige border-brown">
            <h3 className="text-brown">2️⃣ Criar um Personagem</h3>
            <p className="text-brown">Preencha uma ficha com base no modelo escolhido e adicione informações.</p>
            <Link to="/modular-desk/create-character" className="btn btn-brown">🎭 Criar Personagem</Link>
          </div>
        </div>

        {/* Etapa 3 - Visualizar Personagens */}
        <div className="col-md-4">
          <div className="card shadow-lg p-3 mb-4 bg-beige border-brown">
            <h3 className="text-brown">3️⃣ Visualizar Personagens</h3>
            <p className="text-brown">Consulte e edite os personagens já criados de maneira fácil.</p>
            <Link to="/modular-desk/characters" className="btn btn-brown">📂 Ver Personagens</Link>
          </div>
        </div>
      </div>

      {/* Divisor */}
      <hr className="my-5 border-brown" />

      {/* Explicação */}
      <h2 className="mt-4 text-brown">🔍 Como funciona?</h2>
      <p className="text-brown">
        1️⃣ <strong>Crie um Modelo</strong> definindo os atributos necessários.  
        2️⃣ <strong>Preencha um Personagem</strong> baseado no modelo.  
        3️⃣ <strong>Acesse os Personagens Criados</strong> e edite conforme necessário.  
      </p>
    </div>
  );
}

export default Home;