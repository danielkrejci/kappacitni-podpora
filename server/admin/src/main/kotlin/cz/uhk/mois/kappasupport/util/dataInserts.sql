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


INSERT INTO public.service_cases (id, userid, deviceid, casetypeid, stateid, hash, datebegin, dateend)
VALUES (64, 3, 1, 1, 1,
        'Wp1XX8VeQxWu7obu3UG3lYZcEPQF6nQPFpVocFsMHTScZgAYw7sLy5Sug8v8eX9qHq7qvj7IKtrEGCd2Xragkqc2JASyssiE9odB7yw0WeJd60BF1MfFyeodsFj9T1Ca',
        '2023-03-22 22:12:26.822458', null);
INSERT INTO public.service_cases (id, userid, deviceid, casetypeid, stateid, hash, datebegin, dateend)
VALUES (63, 3, 1, 1, 1,
        'HGYdsY4s5tSaA8QqkvgPFAGraoCeQn53CFRz9c3uerXH1NYzjW82qqSy6n3O0hRTks0coVmNfqjmVAeptXQbMGK9RPJaECgcjC34SGRJzXJ3Tp0MXQ0DwnCjcCG8KuyA',
        '2023-03-22 22:12:26.434584', null);
INSERT INTO public.service_cases (id, userid, deviceid, casetypeid, stateid, hash, datebegin, dateend)
VALUES (62, 3, 1, 1, 1,
        'eM3lfsnuQ5hOZP7Ht4JlhvpyEdPS8Ky3R5lPw70HttpDpV2bRUzUKMte6FA99VWiAJTzyx1f8lWG0Uhe1byzQ0Z8Etm6jG1B7Dg1Vb5tcn40CpV5AGhLx415QtfFNT5w',
        '2023-03-22 22:12:26.065255', null);
INSERT INTO public.service_cases (id, userid, deviceid, casetypeid, stateid, hash, datebegin, dateend)
VALUES (61, 3, 1, 1, 1,
        'NorShQACJEAz35GhT70YHH6cWMPC0YPkO9I6Fmk6sUpDjmgoNk0nNsfSxJwXmCnsEUzyhgyDGnUwH1vskzB5xOU1wyHSGTRXbIWBX0TFz3Y6kxEIlVAKMlqI4JKRoiKS',
        '2023-03-22 22:12:25.439527', null);
INSERT INTO public.service_cases (id, userid, deviceid, casetypeid, stateid, hash, datebegin, dateend)
VALUES (60, 3, 1, 1, 1,
        '3jp5rC0OEeHrBh4xMfOYrnBKS4T6EVI7zGphDg6LsYkUcZnV4yGXaNu0WU6LxvBCs7iOFjCWLL6aQQJVl5ZVy52HFiJvWiYiSaW3Xz6wv10zJLfOV1pVPiJqefPwVJIK',
        '2023-03-22 22:12:24.774718', null);
INSERT INTO public.service_cases (id, userid, deviceid, casetypeid, stateid, hash, datebegin, dateend)
VALUES (59, 3, 1, 1, 1,
        'mGUoH1YCyIBs511V9SuMkdAKybf3fE49DDCYE3No9v9ou5xh0eg45BWpPaqtz3m3hdVwrv0zULODbAXDFSWM9L6SK7xX7T7eibomS6IMh0PNNViaKXUzyCRl1NGukoPW',
        '2023-03-22 22:12:24.124225', null);
INSERT INTO public.service_cases (id, userid, deviceid, casetypeid, stateid, hash, datebegin, dateend)
VALUES (58, 3, 1, 1, 1,
        'SL68NoGubWDISRq8hIJ2eZhNLaOpIXeG6XmLxsPZKFsH0ibRenqVaHOj8K4cQHYo8LyLcjfHnH06dI5aLKCP8YbrZwY8catRkdrbk20S2gdXajS0epcTof3jgM7wZTvV',
        '2023-03-22 22:12:23.771744', null);
INSERT INTO public.service_cases (id, userid, deviceid, casetypeid, stateid, hash, datebegin, dateend)
VALUES (57, 3, 1, 1, 1,
        'uHELMJ9YXqkDy41YkMEeZZwuXamTYo2pQUhTk9goR9Gng9ke4nvbN0G7zjsv3gga0JqgXGkm8NTmSYjDH32UxlSg4HsPpUcM3y4lNIXpFLAFpnmJ9WXy0p7e8ONWLzuG',
        '2023-03-22 22:12:23.410955', null);
INSERT INTO public.service_cases (id, userid, deviceid, casetypeid, stateid, hash, datebegin, dateend)
VALUES (56, 3, 1, 1, 1,
        'Z2Klyezw5pF7qnxcVcsTG4lxMXmVZCeO9WeN025MfmvzWug4Z5XNKl6f7a9tTzWn9E7gpAo5vgzvNB7pNBNKGXOEJiKOKynMMwLDH1f2OUWrsT24riAFYZGH4rYBKFcn',
        '2023-03-22 22:12:23.087622', null);
INSERT INTO public.service_cases (id, userid, deviceid, casetypeid, stateid, hash, datebegin, dateend)
VALUES (55, 3, 1, 1, 1,
        '7bba8CSXFQsQFQfLjYUYMDte68S2ccBSitEb8MfovjchZEFoqyrMAC7RcdfD9Sb8aMcngdJ3gxvpG6VqtVRlXMrS49mgjR1TF6BuBxT4GPmWcIfOnRDomA8wAalzTk3w',
        '2023-03-22 22:12:22.622944', null);
INSERT INTO public.service_cases (id, userid, deviceid, casetypeid, stateid, hash, datebegin, dateend)
VALUES (54, 3, 1, 1, 1,
        '1RMq0C7LAGQDaxfcshZwnoiKyjKhSCNWGkH0z55Xp1MZSR3BF74KOtMFG4IyDNkFyuJ4jCSV4dtolMIsi5nfP8q7YQWiDnYNnHS4emjvIMn9AKOhHTpN6so64rQrtoYH',
        '2023-03-22 22:12:21.731556', null);
INSERT INTO public.service_cases (id, userid, deviceid, casetypeid, stateid, hash, datebegin, dateend)
VALUES (53, 3, 1, 1, 1,
        'QF2ineCIy00exjcpC0WtxFmrNBQ4OXyHWYuQEuMQVAzyIeqt4ch1OwVenCgrCAzdEyB2mMJbDAmMKv9Kq6G0Yqu4P4I4dYX7IKq5KEJC8rZl7jdOKiJVsS6kBB1GIeJF',
        '2023-03-22 22:12:21.393811', null);
INSERT INTO public.service_cases (id, userid, deviceid, casetypeid, stateid, hash, datebegin, dateend)
VALUES (52, 3, 1, 1, 1,
        'ZlQE0mTjYNcUpJmht0VrLrXzlC8jHlRNtsDySXZBEtFhRsItKz6RAfWhL2s8oPDBwQIDUTvzxbT5VgYS8LhpcJABl5vuA1UAEvPxIRgXlGnsfO0BTztGQFidseyWALuA',
        '2023-03-22 22:12:21.087246', null);
INSERT INTO public.service_cases (id, userid, deviceid, casetypeid, stateid, hash, datebegin, dateend)
VALUES (51, 3, 1, 1, 1,
        'JuIHvAlJEKFVXWQnXx1qyBCuAlOAAwmq3OHSCNRi15nGOTonwSJL18DgRQckE9nsyQW7Uma7q0owbmHnouX0Q5yLnUtKz6LT3R0oHSiFwJvcQedpiiEswEiK0QXlI8Jb',
        '2023-03-22 22:12:20.779052', null);
INSERT INTO public.service_cases (id, userid, deviceid, casetypeid, stateid, hash, datebegin, dateend)
VALUES (50, 3, 1, 1, 1,
        '7luHcmAh7Hq1tLIt0Vv1nDpYIxMbIu0bYlBK02aIvqKU3i4l0Krhsyk4PD2b0eenJ42sn88pCJeBJsqNmgowu5ya2SP0CDPnpvrLrWYFJatikTHOM5EJnN56VWZJujGy',
        '2023-03-22 22:12:20.404254', null);
INSERT INTO public.service_cases (id, userid, deviceid, casetypeid, stateid, hash, datebegin, dateend)
VALUES (49, 3, 1, 1, 1,
        'Tcx9I5xbikgaKTZdncrc5bw1kKEmkxrX8L2fHpAeALo24YPgCB9QzQW51DKCxYmhMUJhsr69muRh5m1SkEJx5k92FEGLrk9yQcb30TE6BHD7N6L3oONhGCrhFdDjzENi',
        '2023-03-22 22:12:20.092850', null);
INSERT INTO public.service_cases (id, userid, deviceid, casetypeid, stateid, hash, datebegin, dateend)
VALUES (48, 3, 1, 1, 1,
        'oDuNt1Q1lnnvBzk3cG4Vpb0mmeeT8dhnpUP5iMRjqZrBQ3liUX3KySlm6n19HCqO37nYHGvuO96uDHmpyHuEADte1WaYbpkbuA2JX0CKyTWj4hWZ4bODmJMaX0c0SftC',
        '2023-03-22 22:12:19.759022', null);
INSERT INTO public.service_cases (id, userid, deviceid, casetypeid, stateid, hash, datebegin, dateend)
VALUES (47, 3, 1, 1, 1,
        'HC9WcEH9EREynt38yaESjGlMQeWw2ESztiquZTKYENeydZPgiFt7aNenYTEoxllRpYSXutgUoq8sWvqTyHHKc1yiOIiKtR4MSO7KZfBVU2Kakjf8S4Vzle4jEFRYl7lV',
        '2023-03-22 22:12:19.399545', null);
INSERT INTO public.service_cases (id, userid, deviceid, casetypeid, stateid, hash, datebegin, dateend)
VALUES (46, 3, 1, 1, 1,
        'X9wMiSaDhdAsxVQLuRT2f35qJyNBC0gscqIsYsGA3IGu5DunxRQk1Z4UeYJHoJppK5I4u9l9mwliBH1w3WfE7Su6fAqBuAoZkJ1n17SLrCKEc34QERAphF5JUXHBK96g',
        '2023-03-22 22:12:19.099939', null);
INSERT INTO public.service_cases (id, userid, deviceid, casetypeid, stateid, hash, datebegin, dateend)
VALUES (45, 3, 1, 1, 1,
        '1ntKCl2YPE4ZColK6ZYJ8boqPZod06gYIPmFEroPD9tgaakuHxs9ZiTw7HQu1BNYWl1EaDu6vrR0n5HGa0r1HOehMyoGwoSGW3TeBH3sLIUSZU8sgZnsQELrwWTqKW1o',
        '2023-03-22 22:12:18.781977', null);
INSERT INTO public.service_cases (id, userid, deviceid, casetypeid, stateid, hash, datebegin, dateend)
VALUES (44, 3, 1, 1, 1,
        'pk8UYjc4IMJWsGWBqjNv2OGmCjun6pKdXFa6xyBWdCfnaN6JlQDO3VsYt5ZZMHIE2CvL1BvZoQYKEdf84kKijvrk3QG8Xy9JjJhiBsbFAQLJM23ofNalfc5oaUg6vGtz',
        '2023-03-22 22:12:18.423363', null);
INSERT INTO public.service_cases (id, userid, deviceid, casetypeid, stateid, hash, datebegin, dateend)
VALUES (43, 3, 1, 1, 1,
        'bSj0dcI6dmHx5P5yfNusFk0r4y7s44LIjtNSmsAAzQPrOlRfLXTcFVECbGywpRnKh7FDEL0iV1P2Q6qKpbxtChyKufKZg578gfUUQUktWGTMmYUDn6pF01iPfzDGvae0',
        '2023-03-22 22:12:18.038709', null);
INSERT INTO public.service_cases (id, userid, deviceid, casetypeid, stateid, hash, datebegin, dateend)
VALUES (42, 3, 1, 1, 1,
        'zzVvnHu33wdmuncfESFvURj4CnBWaMRLt2VUoh5Fq0M06jmarztFKqx04cRCTVOjr1ZzydPhwS3f2JTBT26iW9UkxyKpchw4l85gx67Kx7YTTq4SgF7TAkLBmXVMJojx',
        '2023-03-22 22:12:17.682599', null);
INSERT INTO public.service_cases (id, userid, deviceid, casetypeid, stateid, hash, datebegin, dateend)
VALUES (41, 3, 1, 1, 1,
        'd2az1NywRgIyLJQ95zrnahcf0HguTzK84xgL0gqtxGI1voMRsxR107a7in4uqAGMBQFvsyi9kEm0Ety2lh0sN4bw3valc3rstoimgQFpKGFYnIRV9Zu41dLSJydNUkTc',
        '2023-03-22 22:12:17.328069', null);
INSERT INTO public.service_cases (id, userid, deviceid, casetypeid, stateid, hash, datebegin, dateend)
VALUES (40, 3, 1, 1, 1,
        'hkSL6UpykfjpV4OiszGbytd5RH86FxZeWq7uYQEnTPfdrWv1aojfWxxst0ZokfssTv8dgPvp7l8QzJl8MCA4CKFkDhHj0Ux16DSJylPvokJSX5q7x1qNxyZGyY9ZW5KY',
        '2023-03-22 22:12:16.391172', null);
INSERT INTO public.service_cases (id, userid, deviceid, casetypeid, stateid, hash, datebegin, dateend)
VALUES (39, 3, 1, 1, 1,
        'svxkqGfHQKk6T0vosbDOU8PwXrcNpmLLjqixoKPcCUu2n4sKJXytw2V5a9CuD7Tig4CG00l7ndcZAglgjHmiNMmRojCPWELNsWrPmyA6zxBoDXpTxFt17P28a9NmVixb',
        '2023-03-22 22:12:16.049039', null);
INSERT INTO public.service_cases (id, userid, deviceid, casetypeid, stateid, hash, datebegin, dateend)
VALUES (38, 3, 1, 1, 1,
        'DP2V9CrRdv7aJcBQl27DdFL7Krxsk3AdJfmZHdM0R6fHDsueqp3ArQfVbpcX4QItXHlk17fWsaA64HXryfZAz53NOje0urtU9L9IxG7M3DD2qJL9sThPCxa8Fyk53VYx',
        '2023-03-22 22:12:15.689786', null);
INSERT INTO public.service_cases (id, userid, deviceid, casetypeid, stateid, hash, datebegin, dateend)
VALUES (37, 3, 1, 1, 1,
        'A8b0tZ3TiVSURVHGiXPmd82BgIsCTlOkwdiyNLwLFWlsXLg7S99ZKh9v2jTmV6zBR5ITmlJMB8axsIVSYBIUDprnWvNFMP5EhGyso3ofytBD55bOGYAliMzqOxWyq3Jq',
        '2023-03-22 22:12:15.366925', null);
INSERT INTO public.service_cases (id, userid, deviceid, casetypeid, stateid, hash, datebegin, dateend)
VALUES (36, 3, 1, 1, 1,
        'L3tWNgCLo7Ayyrr3BMWbsrMPjOCtjj02ZqAgjLLVaW4kkRlMQsrwLxwJxTIh7IZw3QdS2wxzCvLCp3llC1obMKEckKmBWXmmYWPFxFg0BxhEN8lnGKzw05eIm29emOvK',
        '2023-03-22 22:12:15.050711', null);
INSERT INTO public.service_cases (id, userid, deviceid, casetypeid, stateid, hash, datebegin, dateend)
VALUES (35, 3, 1, 1, 1,
        'KhBDnOWFUx9VUCwkaE3oQBkj4UlbLcr8Y9onAWgeber8fu07jVGxG8r6QGzG6zROZptILHiOrURGWJeTSfD0SBE1ATrzPgLo3EJOVJhqYVonV2seQm8AY0R61vdaa1yQ',
        '2023-03-22 22:12:14.741956', null);
INSERT INTO public.service_cases (id, userid, deviceid, casetypeid, stateid, hash, datebegin, dateend)
VALUES (34, 3, 1, 1, 1,
        'K3ZnPPvuxeRFLxgRcOQ4R8igzfH57WlaLWDkV0Zyrk77NJ1MJW3BjIE0m5cnyoempYhFyGSH8Z7eS46DeG5fHIR5Zp6k2EkSolDQNQR1bymNZowWIBY6s1RH0AkAnPR3',
        '2023-03-22 22:12:14.376170', null);
INSERT INTO public.service_cases (id, userid, deviceid, casetypeid, stateid, hash, datebegin, dateend)
VALUES (33, 3, 1, 1, 1,
        'YxDVSd5Y9S4UVAgoQL2nN51oFCv5OzOH1O3FkKLFL9BBSoLk6rhfqFTlqAztZINMqBcfkqPasTNVqvwvB1xDRRtMzdNHhEwHbYDxCCGUJvsk5vlrSNACpYkZVbGaEt9x',
        '2023-03-22 22:12:13.926402', null);
INSERT INTO public.service_cases (id, userid, deviceid, casetypeid, stateid, hash, datebegin, dateend)
VALUES (32, 3, 1, 1, 1,
        '4rho7cPwgPcz40RsbMLdgpQ2Sj9FD2UBLL5dZbDPEJhU7YQHu6oqSpcxhcQNcGDZSiwU54ECZP3MBQGInqVs13KHiOGX8zZwaiNLpYflelM1mjgNfAB4rrnq1HNEghcl',
        '2023-03-22 22:12:13.570226', null);
INSERT INTO public.service_cases (id, userid, deviceid, casetypeid, stateid, hash, datebegin, dateend)
VALUES (31, 3, 1, 1, 1,
        'uPvwk24qtfYqrfNk0hQtGiMPqs2xHA4Bj5Iv9itrkafhbIsHSFOkpuZTEpqyWh8EF7EjKRk135wg3nXaQ31aztc8STpUpFi3sxMw0ifYZsbbGXAgmu7s5D1fyfBaOzs1',
        '2023-03-22 22:12:13.212473', null);
INSERT INTO public.service_cases (id, userid, deviceid, casetypeid, stateid, hash, datebegin, dateend)
VALUES (30, 3, 1, 1, 1,
        'gr9GIvoiYq0XUuhenLDWlSlXI9bWWb9mAkjXFEjVxX5DmAatFOv5Ys7XiQ7uWmb3xUL564DqPEMcvC0oT9wpsS4xKyEC23XPz9cbUXMYBQUhvWVXOeWDz94vJfXGQuLA',
        '2023-03-22 22:12:12.779509', null);
INSERT INTO public.service_cases (id, userid, deviceid, casetypeid, stateid, hash, datebegin, dateend)
VALUES (29, 3, 1, 1, 1,
        '0YzQ4TyT16P6p2UtjbutE2Tcojj0zBNu39vitsFIky8CIuemwXLtYJ8AVOxTuKRaOdiRuKsuhGawCRfrknXTWClQtJRBvD35k5n9c1z1nw3QB6p4ZaiKjksPgdNykAGw',
        '2023-03-22 22:12:12.417096', null);
INSERT INTO public.service_cases (id, userid, deviceid, casetypeid, stateid, hash, datebegin, dateend)
VALUES (28, 3, 1, 1, 1,
        'yyJCTaOJkeUmq8XTTqyK5Kj3CtBkTu14D4LoaycnSThcSYp2hP3FhcFcaF7Siv0qAJRyio5xqHP5lliQXCFOQ0Nb93jHSAQV8Hb9zqRtjt3kT6qsp4Qfdh38v8mJBo0L',
        '2023-03-22 22:12:12.016659', null);
INSERT INTO public.service_cases (id, userid, deviceid, casetypeid, stateid, hash, datebegin, dateend)
VALUES (27, 3, 1, 1, 1,
        'bWO0OJ0iZHDeKMi2JN6MWVZPhzn5A6bPdTrT1pmmFXgBpz0k3sP6T1eNJkd2LesF6LVuFgLVNrZxaLOGZLjm7suOxS4ltMMlLl9AmHlZNbvMN05nlx2CmLWgogU1vJRU',
        '2023-03-22 22:12:11.547250', null);
INSERT INTO public.service_cases (id, userid, deviceid, casetypeid, stateid, hash, datebegin, dateend)
VALUES (26, 3, 1, 1, 1,
        'ipCW9pENzhsHTNI3i2abhO5nIzs3DzfhirBrxbfr9PmZ4J9vlgRHgFPDCcjZma8lqS9httInrhMegN46n3gUEeKjUelYtLdsG12JceC5AJtNeq9CgiLicdf8XFv6n4Us',
        '2023-03-22 22:12:10.870982', null);
INSERT INTO public.service_cases (id, userid, deviceid, casetypeid, stateid, hash, datebegin, dateend)
VALUES (25, 3, 1, 1, 1,
        'rx9uzVvmXYRGImwHgqHDdklsvcVDbGM57WuPozloj74rnwLuNvezt2fA6veby9rOfNf0EWYI41foAs0W0xF6F7ltXaOuKf8uYq7IXjqYUtyZdtk4ZDY6cejEQy3MLCgI',
        '2023-03-22 22:12:10.492432', null);
INSERT INTO public.service_cases (id, userid, deviceid, casetypeid, stateid, hash, datebegin, dateend)
VALUES (24, 3, 1, 1, 1,
        '6vjB5d5OMXqaWThhfVpGluPQKQiOX6yYNiG0klsRpPYJKbOeXzYumzv9MmJqFpJTVJlmyKifEoqluw7C62yc3PXgegfn5OMJECp7RWL0ui15GqXgx7qa3TeUs5iooURz',
        '2023-03-22 22:12:10.144866', null);
INSERT INTO public.service_cases (id, userid, deviceid, casetypeid, stateid, hash, datebegin, dateend)
VALUES (23, 3, 1, 1, 1,
        '1wIeShADLAO0eVPaYh7G4FkbbyrqMaVS2XSQL0Zj4tKZbZUIG4ujR4lyKwwWg2l4OLob23QoahrseE9YLW4Jpl09gEf9KSqWNKF8t7ioORN8LdPYqbffaadJfLEf6Lja',
        '2023-03-22 22:12:09.772659', null);
INSERT INTO public.service_cases (id, userid, deviceid, casetypeid, stateid, hash, datebegin, dateend)
VALUES (22, 3, 1, 1, 1,
        'NNmyL0l1HbnpAfmt5GjKDGhBBOcs77Da4wFbGNer9jbcobCs8B8LpgpCLh9f4k7eugv8lVij8ofvd6t2cfUwIIU37qdS5XHUXDXfN5ktJdS991AaB5Ercunblk9lDXXB',
        '2023-03-22 22:12:09.404126', null);
INSERT INTO public.service_cases (id, userid, deviceid, casetypeid, stateid, hash, datebegin, dateend)
VALUES (21, 3, 1, 1, 1,
        'jl3tUZFkNnrcw03mdGEjgJR3wAA7ogaAZRLSajjBQFpMZRbCZ77akKANipykAmwW6B6Rbm7bPx50r4IB2fnFEvkz37AuB1AGe26vu5oqwe5xuxhTyrECRFEunZdWv60n',
        '2023-03-22 22:12:09.054455', null);
INSERT INTO public.service_cases (id, userid, deviceid, casetypeid, stateid, hash, datebegin, dateend)
VALUES (20, 3, 1, 1, 1,
        'Wru7Ld0zU4sQ3hgRUFiGnVItcXLFT02ZVg1ff1Nh40NL02cb3ACaipfwGmgPX4HfNwT8Eu7KKEdCrMpccp0r7EqaH8TBG5aiZXodc4U4BCCgMugQyxVOXrg58yMQrsAM',
        '2023-03-22 22:12:08.680487', null);
INSERT INTO public.service_cases (id, userid, deviceid, casetypeid, stateid, hash, datebegin, dateend)
VALUES (19, 3, 1, 1, 1,
        'K98gicz5WKbtqd4e8zLpJqM73zklFAaTGw0NSQFlPYDKQmKLoD0K95xCHZFtouiw08O8pxTFbWedei9lhy34w0hyOdHJJaKMJUKh3CSLVcItU0fjcd9DBOAbvxnBdaSv',
        '2023-03-22 22:12:08.272092', null);
INSERT INTO public.service_cases (id, userid, deviceid, casetypeid, stateid, hash, datebegin, dateend)
VALUES (18, 3, 1, 1, 1,
        'ZqYHhBKZXS5zkWdU1AgJAfohoQOey5Ij7vTHTSmO3Uo0sObrwSOijguSBDEOouxtMb2qqBqhFKxxqmeG2Z5f6RDETq757s5lBAE2N2DZx6ImjNMa2kgyZiZpoGQUkF62',
        '2023-03-22 22:12:07.888085', null);
INSERT INTO public.service_cases (id, userid, deviceid, casetypeid, stateid, hash, datebegin, dateend)
VALUES (17, 3, 1, 1, 1,
        'tfyB5kPXTKwWj4slbbzL9TkPhrbDUzNe6RnaKzPBAEIKzdfSOyDF5w7xpG4Zpd6suhvP5n2Ax3BOvAGyPlqcrh2GpBkawOCKD8BwNoHKpmyfW2dFgFdmWTN8ySKJSwZ0',
        '2023-03-22 22:12:07.501785', null);
INSERT INTO public.service_cases (id, userid, deviceid, casetypeid, stateid, hash, datebegin, dateend)
VALUES (16, 3, 1, 1, 1,
        '752Ikd43C4V1EzdZKeIcjuVhyAapvz2oPlH0qhMtFws9FC30EpOA2g6JrbTvlRMp8tVcNAaR7wMAPrIQ34IimnZCTRAe3hIlaQHsYzoIiVPW0sXFxb4V4TDOUjTLGIk7',
        '2023-03-22 22:12:07.113586', null);
INSERT INTO public.service_cases (id, userid, deviceid, casetypeid, stateid, hash, datebegin, dateend)
VALUES (15, 3, 1, 1, 1,
        'f7Kst66xweltmbTmX50fgPRWR6B2CaX1MqrlZZVdySGOKrIfgI9j0jMW5BIXzWsmZzAE9UqgmY4Juf07MmfJ06goges7FQqvB6IjBuedUggvxKupfFT4V4gkYXOFb3jd',
        '2023-03-22 22:12:06.752767', null);
INSERT INTO public.service_cases (id, userid, deviceid, casetypeid, stateid, hash, datebegin, dateend)
VALUES (14, 3, 1, 1, 1,
        'cdECXgFkBlevZ5JXof3f8BAEtFWf1XdyqZofezmSBz1ZOLcc1DBiJBvtVFHL0lHLTYYTlA1mdSgh4vg8qhAVBySzSk1NbB82si7WTjofzOjvIsyMJt2nRLfLdoH6fyMp',
        '2023-03-22 22:12:06.351292', null);
INSERT INTO public.service_cases (id, userid, deviceid, casetypeid, stateid, hash, datebegin, dateend)
VALUES (13, 3, 1, 1, 1,
        'cQYEoHqZukdadiX1LUNyRhbFWuBW7VVy1wJh1Ndn8kfRlTIytqmvYMGY9JhXhi7EUsjCok5RKAMfFHNxR4YI5mpSw8WnNWEPW4s23E8Uobt0IIu4fQxsqBmdrWSEFbuz',
        '2023-03-22 22:12:05.945438', null);
INSERT INTO public.service_cases (id, userid, deviceid, casetypeid, stateid, hash, datebegin, dateend)
VALUES (12, 3, 1, 1, 1,
        'qcNUP4fG3PdURtBsxIKwXVKiiFvGThwNJ9Bbj4joHfejjzGJqAPTVtfwncch3Yu2Rkcli1EWtKS7WwQwCq9cg5W6JpA4aB1SzlvzhwHv0N1e5oy5FzbiX6FluYp0gozn',
        '2023-03-22 22:12:05.547516', null);
INSERT INTO public.service_cases (id, userid, deviceid, casetypeid, stateid, hash, datebegin, dateend)
VALUES (11, 3, 1, 1, 1,
        'CSQqX1i9E5TYQKzuaQgNd9AOOsWDSDCi2iFRSOLpnaOzazSRd72FrqH7IPRS1xsJdgXKvsmj5SPldwYCMRc1YOLkVTJlvAhFG7VLsQC1lYaZN9kvfx0MQp2x95uxXYVx',
        '2023-03-22 22:12:05.132700', null);
INSERT INTO public.service_cases (id, userid, deviceid, casetypeid, stateid, hash, datebegin, dateend)
VALUES (10, 3, 1, 1, 1,
        'IfPLl50KEwGRD3X9QMRNUbTsJFpOhlehkmOlC9Ot7WcSWm7E5yLprpsjJZhKU2mYK3JHUEuuj4Y1r4GA5EMSMFOvsHY2iNufpsOQrPnQJWX0uxCTTuygML26PHoPdDDB',
        '2023-03-22 22:12:04.724971', null);
INSERT INTO public.service_cases (id, userid, deviceid, casetypeid, stateid, hash, datebegin, dateend)
VALUES (9, 3, 1, 1, 1,
        'cMhaMDrAXGcPwnntSPnPrOqMQliIHrsOpyqWzXkEGE1d72IoGSZhHDSImi4SEawzAesUbs59Mk9YFqqVB8tjS2lJdpjvdgSDfE1vyg76D9zoF9PfB0mMJ3QOggFxucsZ',
        '2023-03-22 22:12:04.289516', null);
INSERT INTO public.service_cases (id, userid, deviceid, casetypeid, stateid, hash, datebegin, dateend)
VALUES (8, 3, 1, 1, 1,
        'ssc8BVRdA4GYZcvTtmdWG1KTC2onvZCBd7NrHPi4o3wGXZKmBpQBnilEbPRIZA54iQ6Q1XIary2wgXvLXWexVrc2mtoOQhXrohzyPHmIMT9NsyilZbOig2sSbvIffeSF',
        '2023-03-22 22:12:03.897539', null);
INSERT INTO public.service_cases (id, userid, deviceid, casetypeid, stateid, hash, datebegin, dateend)
VALUES (7, 3, 1, 1, 1,
        'mIlqB4X3pwR59PibkgoclnirlvcbmI91H4C0A5J2rHiJTBGG9xbERfDdSyFJVm2XNHSYV0f2bYUvfMe78FAaFv5cNRa7IYbuzD5q01rY0Tu54ws1QBSKQQNwHMJHcC7e',
        '2023-03-22 22:12:02.679103', null);
INSERT INTO public.service_cases (id, userid, deviceid, casetypeid, stateid, hash, datebegin, dateend)
VALUES (6, 3, 1, 1, 1,
        'UC7zOuSz2suJ1S557XtQnzy0qAsA676uq2wgMraRUqXK6o8uRIX7dv9ykLHhx7bsSI6mvqkXoDifZjtY1eLiUgyUUEl6dIEsx6LwX2pTI2EzkBzV3AETPGdnZO6ymv1m',
        '2023-03-22 22:12:02.372757', null);
INSERT INTO public.service_cases (id, userid, deviceid, casetypeid, stateid, hash, datebegin, dateend)
VALUES (5, 3, 1, 1, 1,
        'IhVX3rDQ9QYrXNakIFsqwjsGBuj3feGcUmLCnC8ToN1OCkUHz3uXyHTXTWhdw45KhRH9UGYEyLrF6jBuCOzuRgqLCdo0lVYA6WAloy5nDf34QIr58bw44CIccwQdg7ai',
        '2023-03-22 22:12:01.713808', null);
INSERT INTO public.service_cases (id, userid, deviceid, casetypeid, stateid, hash, datebegin, dateend)
VALUES (4, 3, 1, 1, 1,
        'hnRDoGrYDjFnPtzrmYPN1LG4MKslbEP0RagItGIUa2st6a0XTYjPX2O0dpCWz6DN2A8OO4HY5J9DvmyxX6asi8qPpcWOESy9fruQVSi4m6CN0eNErZpRJRRTc0eOfEmh',
        '2023-03-22 22:12:00.668467', null);
INSERT INTO public.service_cases (id, userid, deviceid, casetypeid, stateid, hash, datebegin, dateend)
VALUES (3, 3, 1, 2, 2,
        'fUEcEM8oR5Tcy9kIMsNaEIAzKaEgfYf7mBndjfocmbYwY0dqjKOdX1Kpvl3xiAaVcOxMRIl2NmZwMbXlUC2H4dbbGlniHuvaACgnIBVdns6QDDUe7uibPNau9agnv9j2',
        '2023-03-21 18:01:44.806934', null);
