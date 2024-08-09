DROP DATABASE IF EXISTS employeetracker_dp;
CREATE DATABASE employeetracker_dp;
\c employeetracker_dp;

CREATE TABLE departments (
    id SERIAL PRIMARY KEY,
    department_name VARCHAR(300) NOT NULL
);

CREATE TABLE roles (
    id SERIAL PRIMARY KEY,
    title VARCHAR(300),
    salary DECIMAL(10,2),
    department_id INT,
    FOREIGN KEY (department_id)
    REFERENCES departments(id)
    ON DELETE SET NULL
);

CREATE TABLE employee (
    id SERIAL PRIMARY KEY,
    first_name VARCHAR(30) NOT NULL,
    last_name VARCHAR(30) NOT NULL,
    role_id INT,
    FOREIGN KEY (role_id)
    REFERENCES roles(id),
    manager_id INT
);
