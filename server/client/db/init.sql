CREATE TABLE IF NOT EXISTS users
(
    id bigserial primary key,
    name text not null
);

CREATE TABLE IF NOT EXISTS devices (
   id bigserial primary key,
   type text not null,
   model_name text not null,
   serial_number text not null
);