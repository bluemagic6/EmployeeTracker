DROP DATABASE IF EXISTS tracker_db;
CREATE DATABASE tracker_db;

USE tracker_db;

CREATE TABLE department(
        ID INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(30) UNIQUE NOT NULL
);

CREATE TABLE role(
        id INT NOT NULL AUTO_INCREMENT,
    title VARCHAR(30),
    salary DECIMAL,
    department_id INT,
    primary key (id)
);

CREATE TABLE employee(
        id INT NOT NULL AUTO_INCREMENT,
    first_name VARCHAR(30),
    last_name VARCHAR(30),
    role_id VARCHAR(30),
    manager_id INT,
    PRIMARY KEY (id)
);

USE tracker_db;

INSERT INTO department(name)
VALUES ("Legal"), ("Engineering"), ("Sales"), ("Finance");

INSERT INTO role(title, salary, department_id)
VALUES 
    ("Director", 250000, 1), 
    ("Office Manager", 175000, 2), 
    ("Deveolpment", 140000, 3), 
    ("Intern", 60000, 4);

INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES 
    ("Johnny", "Dickerson", "Director", 1), 
    ("James", "Jones", "Office Manager", 2), 
    ("Joe", "Thomas", "Devlopment", 3), 
    ("Henry", "Mills", "Intern", 4)
;