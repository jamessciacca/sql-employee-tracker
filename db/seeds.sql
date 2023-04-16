INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES ('The', 'Boss', 1, null);
INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES ('James', 'Sciacca', 2, 1);
INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES ('Michael', 'McConnell', 2, 1);
INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES ('Will', 'Bodnar', 2, 1);
INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES ('Joseph', 'Pisano', 4, 1);
INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES ('Jake', 'Umans', 3, 1);
INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES ('Alex', 'Scaramuzzino', 3, 1);

INSERT INTO department (department_name)
VALUES ('Big Boss');
INSERT INTO department (department_name)
VALUES ('Administrative');
INSERT INTO department (department_name)
VALUES ('Buisness');
INSERT INTO department (department_name)
VALUES ('Sales');
INSERT INTO department (department_name)
VALUES ('Marketing');

INSERT INTO role (title, salary, department_id)
VALUES ('CEO', 3000000, 1);
INSERT INTO role (title, salary, department_id)
VALUES ('Receptionist', 300000, 2);
INSERT INTO role (title, salary, department_id)
VALUES ('Analyst', 400000, 3);
INSERT INTO role (title, salary, department_id)
VALUES ('Sales Representative', 400000, 4);
INSERT INTO role (title, salary, department_id)
VALUES ('Creative Director', 750000, 5);
