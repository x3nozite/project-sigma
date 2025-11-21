export const initIndexedDb = async (): Promise<boolean> => {
  let request: IDBOpenDBRequest;
  let db: IDBDatabase;
  let version = 1;

  return new Promise((resolve) => {
    // open connection
    request = indexedDB.open("CanvasDB", 1);
    request.onupgradeneeded = () => {
      db = request.result;

      // create object store if it doesn't exist yet
      if (!db.objectStoreNames.contains("Canvas")) {
        console.log("create object store");
        db.createObjectStore("Canvas", { keyPath: "local_canvas" });
      }
    };

    request.onsuccess = () => {
      db = request.result;
      version = db.version;
      console.log("version: ", version);
      resolve(true);
    };

    request.onerror = () => {
      resolve(false);
    }
  })
}
