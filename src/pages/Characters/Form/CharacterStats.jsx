import React, { useState, useEffect } from "react";

const CharacterStats = ({ stats, attributes, onStatsComputed }) => {
  const [computedStats, setComputedStats] = useState(stats);

  useEffect(() => {
    const newComputedStats = stats.map(stat => {
      try {
        // Limpa os espaços dos nomes dos atributos
        const paramNames = attributes.map(attr => attr.title.replace(/\s+/g, ""));
        // Limpa os espaços dos valores dos atributos (caso sejam strings convertidas)
        const paramValues = attributes.map(attr => Number(attr.value));
        // Limpa espaços na fórmula
        const cleanedFormula = stat.formula.replace(/\s+/g, "");
        
        // Cria a função dinamicamente
        const func = new Function(...paramNames, `return ${cleanedFormula}`);
        const result = func(...paramValues);

        return {
          title: stat.title,
          value: Math.floor(result),
          blockType: stat.blockType,
          formula: stat.formula,
          current: Math.floor(result),
          locked: true
        };
      } catch (error) {
        return {
          title: stat.title,
          value: "Erro",
          blockType: stat.blockType,
          formula: stat.formula,
          current: "Erro",
          locked: true
        };
      }
    });

    // Atualiza o estado apenas se os valores mudaram
    if (JSON.stringify(newComputedStats) !== JSON.stringify(computedStats)) {
      setComputedStats(newComputedStats);
      if (typeof onStatsComputed === "function") {
        onStatsComputed(newComputedStats);
      }
    }
  }, [stats, attributes]);

  return (
    <div className="mt-4 card-custom bg-beige p-4 rounded-3 border-brown">
      <h2 className="mb-4 text-brown border-bottom border-brown pb-2">📊 Status Calculados</h2>
      <div className="row">
        {computedStats.map((stat, index) => (
          <div key={index} className="col-md-4 mb-3">
            <div className="p-3 border-brown rounded bg-light-brown-transparent">
              <h5 className="mb-2 text-brown">{stat.title}</h5>
              <p className="mb-0 text-brown">Valor: {stat.value}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CharacterStats;