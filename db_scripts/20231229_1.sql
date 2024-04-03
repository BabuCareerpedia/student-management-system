CREATE TABLE user_tbl (
    user_id SERIAL PRIMARY KEY,
    firstname VARCHAR(60) NOT NULL,
    lastname VARCHAR(60) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    phone VARCHAR(20),
    passwd VARCHAR(255) NOT NULL,
    status_id int2 not null,
    created_by INT8 null,
    creation_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    last_modified_by INT8 null,
    last_modified_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
