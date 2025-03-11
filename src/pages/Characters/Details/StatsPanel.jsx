import React, { useEffect } from "react";

const StatsPanel = ({ character = {}, onChange, isMain = true }) => {
  const stats = character.stats;

  // Inicializa as propriedades 'current' e 'locked' caso não existam
  useEffect(() => {
    onChange((prevCharacter) => {
      const newStats = prevCharacter.stats.map((stat) => ({
        ...stat,
        current: stat.current !== undefined ? stat.current : stat.value, // valor inicial de current é o valor base
        locked: stat.locked !== undefined ? stat.locked : true, // inicia travado por padrão
      }));
      return { ...prevCharacter, stats: newStats };
    });
  }, []);

  // useEffect(() => {
  //   onChange((prevCharacter) => {
  //     const newStats = prevCharacter.stats.map((stat) => ({
  //       ...stat,
  //       current: stat.current > stat.value ? stat.value : stat.current, // valor inicial de current é o valor base
  //     }));
  //     return { ...prevCharacter, stats: newStats };
  //   });
  // }, [character.inventory]);

  // Função que calcula o bônus total para um status a partir dos itens equipados
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

  // Aplica os bônus aos status para exibição
  const getModifiedStats = () => {
    return stats.map(stat => {
      const bonus = getBonusForStat(stat.title);
      return {
        ...stat,
        value: stat.value + bonus // o valor exibido é o base + bônus
      };
    });
  };

  // Armazena os status modificados para renderização
  const modifiedStats = getModifiedStats();

  // Ajusta o incremento utilizando o valor máximo modificado (base + bônus)
  const handleIncrement = (index) => {
    onChange((prevCharacter) => {
      const newStats = [...prevCharacter.stats];
      const bonus = getBonusForStat(newStats[index].title);
      // Permite incrementar se o status não estiver travado e current for menor que o valor máximo com bônus
      if (!newStats[index].locked && newStats[index].current < newStats[index].value + bonus) {
        newStats[index] = { ...newStats[index], current: newStats[index].current + 1 };
      }
      return { ...prevCharacter, stats: newStats };
    });
  };

  const handleDecrement = (index) => {
    onChange((prevCharacter) => {
      const newStats = [...prevCharacter.stats];
      if (!newStats[index].locked && newStats[index].current > 0) {
        newStats[index] = { ...newStats[index], current: newStats[index].current - 1 };
      }
      return { ...prevCharacter, stats: newStats };
    });
  };

  const toggleLock = (index) => {
    onChange((prevCharacter) => {
      const newStats = [...prevCharacter.stats];
      newStats[index] = { ...newStats[index], locked: !newStats[index].locked };
      return { ...prevCharacter, stats: newStats };
    });
  };

  return (
    <div className="mb-4">
      <h3 className="text-brown border-bottom border-brown pb-2">❤️ Status</h3>
      <div className="row g-3">
        {modifiedStats.map((stat, index) => (
          <div key={index} className="col-md-6">
            <div className="p-3 border-brown rounded bg-light-brown-transparent shadow-sm d-flex justify-content-between align-items-center">
              <div className="d-flex align-items-center">
                <h5 className="mb-0 me-2 text-brown">{stat.title}:</h5>
                <p className="mb-0 text-brown">
                  {stat.value !== stat.current ? `${stat.current} /` : ""} {stat.value}
                </p>
              </div>
              <div className="d-flex align-items-center">
                {isMain 
                ? <button
                    className="btn btn-link p-0 me-2"
                    onClick={() => toggleLock(index)}
                    title={stat.locked ? "Desbloquear" : "Bloquear"}
                  >
                    {stat.locked ? "🔒" : "🔓"}
                  </button>
                  : <button className="btn btn-link p-0 me-2">
                    🔒
                  </button>
                }
                {!stat.locked && isMain && (
                  <>
                    <button
                      className="btn btn-outline-brown btn-sm me-2"
                      onClick={() => handleDecrement(index)}
                      aria-label={`Diminuir ${stat.title}`}
                    >
                      –
                    </button>
                    <button
                      className="btn btn-outline-brown btn-sm"
                      onClick={() => handleIncrement(index)}
                      aria-label={`Aumentar ${stat.title}`}
                    >
                      +
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default StatsPanel;
