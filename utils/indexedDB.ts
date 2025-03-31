import {type IDBPDatabase, openDB} from "idb";
// this is a helper file for IndexDB cause if I do that in that huge component too im gonna die

const DB_NAME = "dataDB";
const STORE_NAME = "shelves";

async function initDB() {
    return openDB(DB_NAME, 1, {
        upgrade(db) {
            if (!db.objectStoreNames.contains(STORE_NAME)) {
                db.createObjectStore(STORE_NAME, { keyPath: "id" });
            }
        },
    });
}

interface ShelfDataObjectInterface {
    id: number;
    gX: number;
    gY: number;
    isRad: boolean;
    isIdkSomething: boolean;
}

export async function saveShelf(shelf: ShelfDataObjectInterface) {
    if (!shelf) {
        console.warn("ALERT, one of the saved shelves is a null. Hide, run, burn, conceive anarchy, we're all doomed, the world will perish...")
        return;
    }
    console.log(`Saved shelf: ${JSON.stringify(shelf)}`);
    const id = shelf.id;
    const db: IDBPDatabase<unknown> = await initDB();
    await db.put(STORE_NAME, { contents: shelf, id })
    console.log(await db.get(STORE_NAME, id));
}

export async function getShelf(id: number) {
    const db: IDBPDatabase<unknown> = await initDB();
    return db.get(STORE_NAME, id)
}

export async function getAllShelves() {
    const db: IDBPDatabase<unknown> = await initDB();
    return db.getAll(STORE_NAME)
}

export async function deleteShelf(id: number) {
    const db: IDBPDatabase<unknown> = await initDB();
    await db.delete(STORE_NAME, id);
}

export async function clearShelves() {
    const db: IDBPDatabase<unknown> = await initDB();
    await db.clear(STORE_NAME);
}