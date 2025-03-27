\c ib_db

CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    email TEXT UNIQUE NOT NULL,
    username TEXT NOT NULL,
    inkbucks INTEGER NOT NULL,
    uid VARCHAR UNIQUE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Icon_packs table
CREATE TABLE IF NOT EXISTS icon_packs (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
);

-- Icons table
CREATE TABLE IF NOT EXISTS icons (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    icon_pack_id INTEGER REFERENCE icon_packs(id) ON DELETE CASCADE,
    metadata TEXT,
    image_data BYTEA NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Transactions table
CREATE TABLE IF NOT EXISTS transactions (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    type TEXT NOT NULL CHECK(type IN ('generate', 'style', 'edit')),
    icon_id INTEGER NOT NULL REFERENCES icons(id) ON DELETE CASCADE,
    amount INTEGER NOT NULL,
);
