INSERT INTO departments (department_name)
VALUES 
('Executives'),
('Advertisement'),
('Human Resources'),
('Finance'),
('Safety'),
('Shipping and Receiving'),
('Customer Relations'),
('Research and Development'),
('Legal'),
('Maintenance');

INSERT INTO roles (title, salary, department_id)
VALUES 
('Chief Executive Officer', 660500.00, 1),
('Advertisement Manager', 123550.00, 2),
('HR Director', 135500.00, 3),
('Finance Head', 130999.00, 4),
('Safety Manager', 123445.00, 5),
(' Shipping Manager', 111000.00, 6),
('Customer Relations Manager', 76700.00, 7),
('Research and Development Manager ', 177330.00, 8),
('Legal Manager', 95800.00, 9),
('Maintenance Manager', 120334.00, 10);

INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES
('Dale', 'Goodman', 1, 1),
('Allison', 'Sky', 2, 2),
('Karen', 'Mcclure', 3, 3),
('Wesley', 'Jackson', 4, 4),
('Daniel', 'Chung', 5, 5),
('Kyle', 'Anderson', 6, 6),
('Justin', 'Smith', 7, 7),
('Olivia', 'Stover', 8, 8),
('Russel', 'Green', 9, 9),
('Javier', 'Sanchez', 10, 10);