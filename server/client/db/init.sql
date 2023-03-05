CREATE TABLE service_cases
(
    id        bigserial primary key,
    userId    bigserial,
    deviceId  bigserial not null,
    caseType  text      not null,
    stateType text      not null,
    hash      text      not null,
    dateBegin timestamp without time zone,
    dateEnd   timestamp without time zone
);

CREATE TABLE devices
(
    id           bigserial primary key,
    type         text not null,
    modelName    text not null,
    serialNumber text not null
);

CREATE TABLE users
(
    id       bigserial PRIMARY KEY,
    address  bigint,
    name     text,
    surname  text,
    phone    text,
    email    text UNIQUE,
    operator boolean
);

CREATE TABLE addresses
(
    id          bigserial PRIMARY KEY,
    street      text not null,
    houseNumber text not null,
    postalCode  text not null,
    city        text not null
);

CREATE TABLE messages
(
    id            bigserial PRIMARY KEY,
    userId        bigserial not null,
    serviceCaseId bigserial not null,
    stateType     text      not null,
    message       text      not null,
    date          timestamp without time zone,
    FOREIGN KEY (userId) REFERENCES users (id),
    FOREIGN KEY (serviceCaseId) REFERENCES service_cases (id)
);


/*
 CONSTRAINTY
 */
/*kontrola zda existuje adresa v databázi předs vložením usera*/
ALTER TABLE USERS
    ADD CONSTRAINT "fk_address"
        FOREIGN KEY (address) REFERENCES ADDRESSES (id)
            ON DELETE RESTRICT
            ON UPDATE CASCADE;


/*ADD DATA*/
INSERT INTO public.devices (id, type, modelname, serialnumber)
VALUES (1, 'MY_PHONE', 'SAD', 'dsadsda');

/* TODO kontrola před vložením service_case že daný device_id existuje */
