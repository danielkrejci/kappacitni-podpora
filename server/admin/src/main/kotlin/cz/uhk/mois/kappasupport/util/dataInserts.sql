-- FOR TESTING PURPOSES ONLY

INSERT INTO addresses (street, houseNumber, postalCode, city)
VALUES ('Main Street', '123', '12345', 'New York'),
       ('Broadway', '456', '67890', 'Los Angeles'),
       ('Market Street', '789', '54321', 'San Francisco'),
       ('Park Avenue', '321', '09876', 'Chicago'),
       ('Bourbon Street', '987', '65432', 'New Orleans'),
       ('Wall Street', '234', '67890', 'New York'),
       ('Rodeo Drive', '567', '12345', 'Los Angeles'),
       ('Lombard Street', '890', '54321', 'San Francisco'),
       ('Michigan Avenue', '432', '09876', 'Chicago'),
       ('Frenchmen Street', '654', '65432', 'New Orleans');

INSERT INTO users (addressId, name, surname, phone, email, isOperator, isClient)
VALUES (1, 'John', 'Doe', '1234567890', 'john.doe@example.com', true, false),
       (2, 'Jane', 'Doe', '2345678901', 'jane.doe@example.com', true, false),
       (3, 'Bob', 'Smith', '3456789012', 'bob.smith@example.com', true, true),
       (4, 'Alice', 'Jones', '4567890123', 'alice.jones@example.com', true, true),
       (5, 'Charlie', 'Brown', '5678901234', 'charlie.brown@example.com', true, true),
       (6, 'David', 'Lee', '6789012345', 'david.lee@example.com', true, true),
       (7, 'Emily', 'Wang', '7890123456', 'emily.wang@example.com', true, true),
       (8, 'Frank', 'Chen', '8901234567', 'frank.chen@example.com', true, true),
       (9, 'Grace', 'Kim', '9012345678', 'grace.kim@example.com', false, true),
       (10, 'Henry', 'Garcia', '0123456789', 'henry.garcia@example.com', false, true);


INSERT INTO SERVICE_CASES (userid, deviceid, casetypeid, stateid, datebegin, dateend, hash)
SELECT (5 + (random() * 6)::int)                                     as userid,
       (1 + (random() * 2)::int)                                     as deviceid,
       (1 + (random() * 2)::int)::bigint                             as casetype,
       (1 + (random() * 2)::int)::bigint                             as statetype,
       now()                                                         as datebegin,
       null                                                          as dateend,
       substr(md5(random()::text || clock_timestamp()::text), 1, 10) as hash
FROM generate_series(1, 100);

-- Execute multiple times
INSERT INTO users_service_cases (userId, serviceCaseId)
SELECT u.id  as userId,
       sc.id as serviceCaseId
FROM users u
         CROSS JOIN LATERAL (
    SELECT id FROM service_cases ORDER BY random() LIMIT 1
    ) AS sc
WHERE u.isOperator = true
ORDER BY sc.id
LIMIT 10;