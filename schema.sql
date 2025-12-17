

DROP TABLE IF EXISTS users;
CREATE TABLE IF NOT EXISTS users (id INTEGER PRIMARY KEY, username TEXT, password TEXT);
INSERT INTO users (username, password) VALUES ('testuser', 'testpass');


DROP TABLE IF EXISTS posts;
CREATE TABLE IF NOT EXISTS posts (id INTEGER PRIMARY KEY, user_id INTEGER, title TEXT, description TEXT);
-- INSERT INTO posts (user_id, title, description) VALUES (1, 'POST TITLE', 'Lorem ipsum etc etc');


DROP TABLE IF EXISTS sessions;
CREATE TABLE IF NOT EXISTS sessions (id INTEGER PRIMARY KEY, user_id INTEGER, token TEXT, expiration TEXT);
