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
    house_number  integer,
    city          text,
    postal_code   text,
    date_begin    timestamp without time zone,
    date_end      timestamp without time zone
);
