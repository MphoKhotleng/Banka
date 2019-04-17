-- Users SQL query

-- create users table
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  email VARCHAR(80),
  firstName VARCHAR(20),
  lastName VARCHAR(20),
  password VARCHAR(80),
  type VARCHAR(10),
  isAdmin BOOLEAN
);

-- select all from users table
SELECT * FROM "users" LIMIT 10

-- insert into users table
INSERT into "users" values($1), ['value']

-- update into users
update users 