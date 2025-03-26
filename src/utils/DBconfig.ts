export const DBConfig = {
    name: "MyDB",
    version: 5,
    objectStoresMeta: [
        {
            store: "list",
            storeConfig: { keyPath: "messageId", autoIncrement: true },
            storeSchema: [
                { name: "id", keypath: "id", options: { unique: false } },
                { name: "role", keypath: "role", options: { unique: false } },
                { name: "content", keypath: "content", options: { unique: false } },
                { name:"type", keypath: "type", options: { unique: false } },
                { name:"timestamp", keypath: "timestamp", options: { unique: false } },
                { name:"uniqueId", keypath: "uniqueId", options: { unique: true } },
                { name:"questionId", keypath: "questionId", options: { unique: false } },
                { name:"address", keypath: "address", options: { unique: false } },
            ],
        },

    ],
};
