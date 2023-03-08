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
        FOREIGN KEY (address) REFERENCES ADDRESSES (id)
            ON DELETE RESTRICT
            ON UPDATE CASCADE;


/*DEVICES*/
INSERT INTO public.devices (id, type, modelname, serialnumber)
VALUES (1, 'MY_PHONE', 'MP-D100', 'dsadsda');
/*ADDRESSES*/
INSERT INTO public.addresses (id, street, housenumber, postalcode, city)
VALUES (1, 'Divická', '450', '56601', 'Vyoské Mýto');
INSERT INTO public.addresses (id, street, housenumber, postalcode, city)
VALUES (2, 'Bratří zvonků', '690', '50003', 'Hradec Králové');
INSERT INTO public.addresses (id, street, housenumber, postalcode, city)
VALUES (3, 'Na pouchově', '534', '50003', 'Praha');

/*OPERATORS*/
INSERT INTO public.users (id, address, name, surname, phone, email, operator)
VALUES (1, 1, 'Jan', 'Chaloupka', '123456789', 'drdobbylp@gmail.com', true);
INSERT INTO public.users (id, address, name, surname, phone, email, operator)
VALUES (2, 2, 'Daniel', 'Krejčí', '123456789', 'danielkrejci7@gmail.com', true);


/* TODO kontrola před vložením service_case že daný device_id existuje */
