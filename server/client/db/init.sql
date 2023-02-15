CREATE TABLE devices
(
    id            bigserial primary key,
    type          text not null,
    model_name    text not null,
    serial_number text not null
);

CREATE TABLE service_cases
(
    id            bigserial primary key,
    type          text not null,
    serial_number text not null,
    message       text not null,
    name          text not null,
    surname       text not null,
    email         text not null,
    phone         text,
    street        text,
    house_number  text,
    city          text,
    postal_code   text,
    date_begin    timestamp without time zone,
    date_end      timestamp without time zone
);

CREATE TABLE USERS
(
    id          bigserial PRIMARY KEY,
    address     bigint,
    name        text,
    surname     text,
    phone       text,
    email       text UNIQUE,
    operator    boolean
);

CREATE TABLE ADDRESSES (
    id serial primary key,
    street text not null,
    house_number text not null,
    postal_code text not null,
    city text not null
);


/*
 CONSTRAINTY
 */
/*kontrola zda existuje adresa v databázi předs vložením usera*/
ALTER TABLE USERS
    ADD CONSTRAINT "fk_address"
        FOREIGN KEY (address) REFERENCES ADDRESSES(id)
            ON DELETE RESTRICT
            ON UPDATE CASCADE;