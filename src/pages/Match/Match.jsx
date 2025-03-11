import React, { useEffect, useState } from 'react';
import { Navigate, useParams } from 'react-router-dom';
import useWebSocket from 'react-use-websocket';
import StorageService from '../../services/storageService';
import MatchCharacterDetails from './MatchCharacterDetails';

const Match = () => {
    const { characterId } = useParams();
    const [character, setCharacter] = useState(null);
    const [username, setUsername] = useState('');
    const [isConnected, setIsConnected] = useState(false);
    const [players, setPlayers] = useState([]); // Lista de jogadores conectados
    const [displayChar, setDisplayChar] = useState()

    useEffect(() => {
        const savedCharacters = StorageService.getData("characters") || [];
        const foundCharacter = savedCharacters.find(
            (char) => char.id.toString() === characterId
        );
        if (foundCharacter) {
            if (!foundCharacter.talents) foundCharacter.talents = [];
            if (!foundCharacter.inventory) foundCharacter.inventory = [];
            setCharacter(foundCharacter)
            setIsConnected(false)
        }
    }, [characterId]);

    const handleClose = () => {
        console.log("Desconectado do WebSocket!")
        Navigate({ to: "/characters" })
    }

    const WS_url = "ws://localhost:8000?username=" + username;

    const { sendMessage } = useWebSocket(WS_url, {
        shouldReconnect: () => true,
        onOpen: () => console.log("Conectado ao WebSocket!"),
        onClose: () => handleClose,
        onMessage: (message) => {
            const data = JSON.parse(message.data);
            //console.log("Mensagem recebida do WebSocket:", data);

            if (data.type === "user_list") {
                const mySelf = data.users.find(p => p.character.id === character.id)
                const otherPlayers = data.users.filter(p => p.character.id !== character.id);
                setPlayers([mySelf, ...otherPlayers]); // Garante que o personagem do usuário sempre esteja em primeiro
            }
        },
    }, isConnected);

    const handleUsernameSubmit = (e) => {
        e.preventDefault();
        if (username.trim()) {
            setIsConnected(true);
            const payload = {
                type: "set_username",
                username,
                character
            };
            sendMessage(JSON.stringify(payload));
            //console.log("Enviado ao WebSocket:", payload);
        }
    };

    useEffect(() => {
        if (!displayChar) {
            setDisplayChar(character)
            return
        }

        if (displayChar.id != character.id) {
            return
        }

        const payload = {
            type: "set_username",
            username,
            character: displayChar
        };
        //console.log(JSON.stringify(payload))
        sendMessage(JSON.stringify(payload));
    }, [displayChar])

    useEffect(() => {
        if(!players){
            return
        }
        if(!displayChar){
            return
        }
        const current = players.find(x => displayChar.id == x.character.id)
        if(current){
            if(current.character.id == characterId){
                return
            }
            setDisplayChar(current.character)
        }

    }, [players])

    return (
        !isConnected ? (
            <div className="d-flex flex-column align-items-center justify-content-center vh-100">
                <div className="p-4 border-brown rounded bg-light-brown-transparent shadow">
                    <h3 className="text-brown text-center">Digite seu nome de usuário</h3>
                    <form onSubmit={handleUsernameSubmit} className="d-flex flex-column">
                        <input
                            type="text"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            placeholder="Nome de usuário"
                            className="form-control bg-beige text-brown border-brown my-2"
                            required
                        />
                        <button type="submit" className="btn btn-brown w-100">Entrar</button>
                    </form>
                </div>
            </div>
        ) : (
            <div className="d-flex vh-100">
                {/* Lista lateral com os personagens conectados */}
                <div className="bg-dark text-light p-3 sidebar-custom" style={{ width: "250px", overflowY: "auto" }}>
                    <h4 className="text-center mb-3">Jogadores</h4>
                    {players.map((player, index) => (
                        <div key={player.character.id} onClick={() => setDisplayChar(player.character)} className={`p-2 btn w-100 rounded mb-2 ${displayChar.id === player.character.id ? "btn-brown" : "btn-outline-brown bg-beige"}`}>
                            <strong>{player.username}</strong>
                            <p className="mb-0">{player.character.fields.find(f => f.title === "Nome")?.value || "Sem Nome"}</p>
                        </div>
                    ))}
                </div>

                {/* Área principal para exibir os detalhes do personagem */}
                <div className="flex-grow-1 p-4">
                    {character && <MatchCharacterDetails character={displayChar} isMain={displayChar.id == character.id} onUpdateCharacter={setDisplayChar} />}
                </div>
            </div>
        )
    );
};

export default Match;
