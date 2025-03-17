-- Users table
CREATE TABLE IF NOT EXISTS users (
    id TEXT PRIMARY KEY,
    email TEXT UNIQUE NOT NULL,
    username TEXT UNIQUE NOT NULL,
    inkbucks INTEGER DEFAULT 0,
    created_at TEXT DEFAULT (strftime('%Y-%m-%d %H:%M:%S', 'now')) NOT NULL
);

-- Icon_packs table
CREATE TABLE IF NOT EXISTS icon_packs (
    id TEXT PRIMARY KEY,
    user_id TEXT NOT NULL,
    name TEXT NOT NULL,
    created_at TEXT DEFAULT (strftime('%Y-%m-%d %H:%M:%S', 'now')) NOT NULL,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Icons table
CREATE TABLE IF NOT EXISTS icons (
    id TEXT PRIMARY KEY,
    user_id TEXT NOT NULL,
    icon_pack_id TEXT,
    image_url TEXT NOT NULL,
    metadata TEXT,
    image_data BLOB,
    created_at TEXT DEFAULT (strftime('%Y-%m-%d %H:%M:%S', 'now')) NOT NULL,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (icon_pack_id) REFERENCES icon_packs(id) ON DELETE SET NULL
);

-- Transactions table
CREATE TABLE IF NOT EXISTS transactions (
    id TEXT PRIMARY KEY,
    user_id TEXT NOT NULL,
    type TEXT NOT NULL CHECK(type IN ('generate', 'style', 'edit')),
    icon_id TEXT NOT NULL,
    amount INTEGER NOT NULL,
    created_at TEXT DEFAULT (strftime('%Y-%m-%d %H:%M:%S', 'now')) NOT NULL,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (icon_id) REFERENCES icons(id) ON DELETE CASCADE
);
