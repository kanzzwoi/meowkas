let db;
const DB_NAME = "MeowKAS_DB";
const DB_VERSION = 1;

function initDB() {
    return new Promise((resolve, reject) => {
        const req = indexedDB.open(DB_NAME, DB_VERSION);
        req.onupgradeneeded = (e) => {
            const database = e.target.result;
            if (!database.objectStoreNames.contains("transactions")) {
                database.createObjectStore("transactions", { keyPath: "id", autoIncrement: true });
            }
            if (!database.objectStoreNames.contains("savings")) {
                database.createObjectStore("savings", { keyPath: "id", autoIncrement: true });
            }
        };
        req.onsuccess = (e) => {
            db = e.target.result;
            resolve(db);
        };
        req.onerror = (e) => reject(e);
    });
}

const dbOp = {
    async getAll(storeName) {
        return new Promise((resolve) => {
            const tx = db.transaction(storeName, "readonly");
            const store = tx.objectStore(storeName);
            const req = store.getAll();
            req.onsuccess = () => resolve(req.result || []);
        });
    },
    async add(storeName, data) {
        return new Promise((resolve) => {
            const tx = db.transaction(storeName, "readwrite");
            const store = tx.objectStore(storeName);
            const req = store.add(data);
            req.onsuccess = () => resolve(req.result);
        });
    },
    async put(storeName, data) {
        return new Promise((resolve) => {
            const tx = db.transaction(storeName, "readwrite");
            const store = tx.objectStore(storeName);
            const req = store.put(data);
            req.onsuccess = () => resolve(req.result);
        });
    },
    async delete(storeName, id) {
        return new Promise((resolve) => {
            const tx = db.transaction(storeName, "readwrite");
            const store = tx.objectStore(storeName);
            const req = store.delete(id);
            req.onsuccess = () => resolve(true);
        });
    },
    async clear(storeName) {
        return new Promise((resolve) => {
            const tx = db.transaction(storeName, "readwrite");
            const store = tx.objectStore(storeName);
            const req = store.clear();
            req.onsuccess = () => resolve(true);
        });
    }
};
