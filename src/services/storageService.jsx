const STORAGE_KEY = "rpg_data"; // Nome da chave principal no localStorage

const StorageService = {
    // Salva um objeto JSON no localStorage
    saveData: (key, data) => {
        const currentData = StorageService.getAllData(); // Obtém todos os dados salvos
        currentData[key] = data; // Adiciona/atualiza o dado
        localStorage.setItem(STORAGE_KEY, JSON.stringify(currentData)); // Salva no localStorage
    },

    // Recupera um dado específico pelo nome
    getData: (key) => {
        const data = StorageService.getAllData();
        return data[key] || null; // Retorna o dado ou null se não existir
    },

    // Recupera todos os dados salvos
    getAllData: () => {
        try {
            const data = localStorage.getItem(STORAGE_KEY);
            return data ? JSON.parse(data) : {}; // Se existir, converte para objeto JSON
        } catch (error) {
            console.error("Erro ao ler os dados do localStorage:", error);
            return {}; // Retorna um objeto vazio em caso de erro
        }
    },

    // Remove um dado específico pelo nome
    removeData: (key) => {
        const currentData = StorageService.getAllData();
        delete currentData[key]; // Remove o dado do objeto
        localStorage.setItem(STORAGE_KEY, JSON.stringify(currentData)); // Atualiza o localStorage
    },

    // Retorna todos os modelos armazenados
    getAllModels: () => {
        const allData = StorageService.getAllData(); // Obtém todos os dados salvos
        return Object.keys(allData)
            .filter(key => key.startsWith("model-"))
            .map(key => allData[key]); // Retorna os modelos diretamente
    },

    // Limpa TODOS os dados salvos
    clearAll: () => {
        localStorage.removeItem(STORAGE_KEY);
    }
};

export default StorageService;
