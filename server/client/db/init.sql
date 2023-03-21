CREATE TABLE addresses
(
    id          SERIAL PRIMARY KEY,
    street      TEXT NOT NULL,
    houseNumber TEXT NOT NULL,
    postalCode  TEXT NOT NULL,
    city        TEXT NOT NULL
);

CREATE TABLE users
(
    id         SERIAL PRIMARY KEY,
    addressId  BIGINT,
    name       TEXT,
    surname    TEXT,
    phone      TEXT,
    email      TEXT UNIQUE,
    isOperator boolean,
    isClient   boolean,
    FOREIGN KEY (addressId) REFERENCES addresses (id)
);

CREATE TABLE devices
(
    id           SERIAL PRIMARY KEY,
    typeId       BIGINT NOT NULL,
    modelName    TEXT NOT NULL,
    serialNumber TEXT NOT NULL,
    releaseDate  TIMESTAMP WITHOUT TIME ZONE
);

CREATE TABLE service_cases
(
    id         SERIAL PRIMARY KEY,
    userId     BIGINT NOT NULL,
    deviceId   BIGINT NOT NULL,
    caseTypeId BIGINT NOT NULL,
    stateId    BIGINT NOT NULL,
    hash       TEXT   NOT NULL,
    dateBegin  TIMESTAMP WITHOUT TIME ZONE,
    dateEnd    TIMESTAMP WITHOUT TIME ZONE,
    FOREIGN KEY (userId) REFERENCES users (id),
    FOREIGN KEY (deviceId) REFERENCES devices (id)
);

CREATE TABLE service_case_messages
(
    id            SERIAL PRIMARY KEY,
    userId        BIGINT,
    serviceCaseId BIGINT NOT NULL,
    stateId       BIGINT NOT NULL,
    message       TEXT NOT NULL,
    date          TIMESTAMP WITHOUT TIME ZONE,
    FOREIGN KEY (userId) REFERENCES users (id),
    FOREIGN KEY (serviceCaseId) REFERENCES service_cases (id)
);



CREATE TABLE users_service_cases
(
    id            SERIAL PRIMARY KEY,
    userId        BIGINT REFERENCES users (id),
    serviceCaseId BIGINT REFERENCES service_cases (id)
);

/*
 CONSTRAINTY
 */
/*kontrola zda existuje adresa v databázi předs vložením usera*/
ALTER TABLE USERS
    ADD CONSTRAINT "fk_address"
        FOREIGN KEY (addressId) REFERENCES ADDRESSES (id)
            ON DELETE RESTRICT
            ON UPDATE CASCADE;

/* DEVICES */
INSERT INTO public.devices (typeId, modelName, serialNumber, releaseDate)
VALUES (1, 'MP-H100', 'SI2E26ZDBD6YVKQ', TIMESTAMP '2020-03-01 00:00:00.000000 CET');
INSERT INTO public.devices (typeId, modelName, serialNumber, releaseDate)
VALUES (2, 'MP-D100', '2H6KDZDSKDPRP5B', TIMESTAMP '2020-03-01 00:00:00.000000 CET');
INSERT INTO public.devices (typeId, modelName, serialNumber, releaseDate)
VALUES (3, 'MB-K100', '067FOPSTKEI76HZ', TIMESTAMP '2020-03-01 00:00:00.000000 CET');
INSERT INTO public.devices (typeId, modelName, serialNumber, releaseDate)
VALUES (4, 'MS-O100', 'POVS700YN7ZPDVU', TIMESTAMP '2020-03-01 00:00:00.000000 CET');
INSERT INTO public.devices (typeId, modelName, serialNumber, releaseDate)
VALUES (5, 'MW-CH10', 'WA6KVFQZ2JTZWCZ', TIMESTAMP '2020-03-01 00:00:00.000000 CET');
INSERT INTO public.devices (typeId, modelName, serialNumber, releaseDate)
VALUES (6, 'MP-DS10', 'K3FUYM54R6LCPJE', TIMESTAMP '2020-03-01 00:00:00.000000 CET');

/* ADDRESSES*/
INSERT INTO public.addresses (street, housenumber, postalcode, city)
VALUES ('U hadů a krys', '666', '66600', 'Vysoké Mýto');
INSERT INTO public.addresses (street, housenumber, postalcode, city)
VALUES ('Černý Benzo', 'c63s', '50000', 'Hradec Králové');

/* OPERATORS */
INSERT INTO public.users (addressid, name, surname, phone, email, isClient, isOperator)
VALUES (1, 'Jan', 'Chaloupka', '+420 123 456 789', 'drdobbylp@gmail.com', false, true);
INSERT INTO public.users (addressid, name, surname, phone, email, isClient, isOperator)
VALUES (2, 'Daniel', 'Krejčí', '+420 123 456 789', 'daniel.krejci777@gmail.com', false, true);


/* TODO kontrola před vložením service_case že daný device_id existuje */
