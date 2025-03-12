import React, { useEffect, useState } from 'react';
import { Navigate, useParams } from 'react-router-dom';
import useWebSocket from 'react-use-websocket';
import StorageService from '../../services/storageService';
import MatchCharacterDetails from './MatchCharacterDetails';

const Match = () => {
    const { characterId } = useParams();
    const [character, setCharacter] = useState(null);
    const [username, setUsername] = useState('');
    const [wsUrl, setWsUrl] = useState('');
    const [isConnected, setIsConnected] = useState(false);
    const [players, setPlayers] = useState([]);
    const [selectedPlayerIndex, setSelectedPlayerIndex] = useState(0);

    useEffect(() => {
        const savedCharacters = StorageService.getData("characters") || [];
        const foundCharacter = savedCharacters.find(char => char.id.toString() === characterId);

        if (foundCharacter) {
            foundCharacter.talents = foundCharacter.talents || [];
            foundCharacter.inventory = foundCharacter.inventory || [];
            setCharacter(foundCharacter);
            setIsConnected(false);
        }
    }, [characterId]);

    const handleClose = () => {
        console.log("Desconectado do WebSocket!");
        Navigate({ to: "/characters" });
    };

    const { sendMessage } = useWebSocket(isConnected ? `${wsUrl}?username=${username}` : null, {
        shouldReconnect: () => true,
        onOpen: () => console.log("Conectado ao WebSocket!"),
        onClose: () => handleClose(),
        onMessage: (message) => {
            const data = JSON.parse(message.data);
            
            if (data.type === "user_list") {
                console.log("Recebendo lista de usuários:", data);
                const player_list = [];
                const current = data.users.find(p => p.character && p.character.id === character?.id);
                if (current) {
                    player_list.push(current);
                }
                const otherPlayers = data.users.filter(p => p.character && p.character.id !== character?.id);
                if (otherPlayers) {
                    player_list.push(...otherPlayers);
                }
                setPlayers(player_list);
            }
        },
    }, isConnected);

    const handleConnect = (e) => {
        e.preventDefault();
        if (username.trim() && wsUrl.trim()) {
            setIsConnected(true);
            sendMessage(JSON.stringify({
                type: "set_username",
                username,
                character
            }));
        }
    };

    useEffect(() => {
        if (character && isConnected) {
            sendMessage(JSON.stringify({
                type: "update",
                username,
                character
            }));
        }
    }, [character]);

    const handleSelectPlayer = (index) => {
        if(players[index]){
            setSelectedPlayerIndex(index);
        } else {
            setSelectedPlayerIndex(0);
        }
    };

    return (
        !isConnected ? (
            <div className="d-flex flex-column align-items-center justify-content-center vh-100">
                <div className="p-4 border-brown rounded bg-light-brown-transparent shadow">
                    <h3 className="text-brown text-center">Digite seu nome de usuário e URL do WebSocket</h3>
                    <form onSubmit={handleConnect} className="d-flex flex-column">
                        <input
                            type="text"
                            value={wsUrl}
                            onChange={(e) => setWsUrl(e.target.value)}
                            placeholder="WebSocket URL"
                            className="form-control bg-beige text-brown border-brown my-2"
                            required
                        />
                        <input
                            type="text"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            placeholder="Nome de usuário"
                            className="form-control bg-beige text-brown border-brown my-2 mb-3"
                            required
                        />
                        <button type="submit" className="btn btn-brown w-100">Entrar</button>
                    </form>
                </div>
            </div>
        ) : (
            <div className="d-flex h-100">
                <div className="bg-dark text-light p-3 sidebar-custom" style={{ width: "250px", overflowY: "auto" }}>
                    <h4 className="text-center mb-3">Jogadores</h4>
                    {players.map((player, index) => (
                        player.character && (
                            <div
                                key={player.character.id}
                                onClick={() => handleSelectPlayer(index)}
                                className={`p-2 btn w-100 rounded mb-2 ${selectedPlayerIndex === index ? "btn-brown" : "btn-outline-brown bg-beige"}`}
                            >
                                <strong>{player.username}</strong>
                                <p className="mb-0">{player.character.fields?.find(f => f.title === "Nome")?.value || "Sem Nome"}</p>
                            </div>
                        )
                    ))}
                </div>
                <div className="flex-grow-1 p-4 overflow-y-auto">
                    {players[selectedPlayerIndex] && (
                        <MatchCharacterDetails 
                            character={players[selectedPlayerIndex].character} 
                            isMain={players[selectedPlayerIndex].character.id === character.id} 
                            onUpdateCharacter={players[selectedPlayerIndex].character.id === character.id ? setCharacter : () => {}} 
                        />
                    )}
                </div>
            </div>
        )
    );
};

export default Match;