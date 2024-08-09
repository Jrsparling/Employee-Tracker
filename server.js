const inquirer = require("inquirer");
// const pool = require("./connection");
const { error } = require("console");

const { Pool } = require("pg");
const { type } = require("os");


const connection = new Pool(
    {
      // Enter PostgreSQL username
      user: "postgres",
      // Enter PostgreSQL password
      password: "Daxter20!",
      host: "127.0.0.1",
      database: "employeetracker_dp",
    },
    console.log("Connected to the employeetracker_db database!")
  );
// const connection = pool.connect()
connection.connect()
async function start() {
    inquirer.prompt({
        type: "list",
        name: "action",
        message: "Select an option",
        choices:[
            "View all Departments",
            "View all Roles",
            "View all Employees",
            "Add Department",
            "Add a Role",
            "Add Employee",
            "Add a Manager",
            "Update Employee's Role",
            "View Employee by Manager",
            "View Employee by Department",
            "Delete Department | Roles | Employees",
            "View The Budget of a Department",
            "EXIT", 
        ],
    })
    .then((answer) => {
        switch (answer.action) {
            case "View all Departments":
                viewAllDepartments();
                break;
            case "View all Roles":
                        viewAllRoles();
                        break;
            case "View all Employees":
                        viewAllEmployees();
                        break;
            case "Add Department":
                        addDepartment();
                        break;
            case "Add a Role":
                        addRole();
                        break;
            case "Add Employee":
                        addEmployee();
                        break;
            case "Add a Manager":
                        addManager();
                        break;
            case "Update Employee's Role":
                        updateEmployeeRole();
                        break;
            case "View Employee by Manager":
                        viewEmployeesByManager();
                        break;
            case "View Employee by Department":
                        viewEmployeesByDepartment();
                        break;
            case "Delete Departments | Roles | Employees":
                        deleteDepartmentsRolesEmployees();
                        break;
            case "View The Budget of a Department":
                        viewBudgetOfDepartment();
                        break;
            case "Exit":
                        connection.sever();
                        console.log("Connection Severed.");
                        break;
        }
    });
}
// Views all departments works
function viewAllDepartments() {
    const sql = "SELECT * FROM departments";
    connection.query(sql, (err, {rows}) =>{
        if (err) throw err;
        console.table(rows);
        start();
    });
}
// Views all roles works
function viewAllRoles() {
    const query = "SELECT roles.title, roles.id, departments.department_name, roles.salary from roles join departments on roles.department_id = departments.id";
    connection.query(query, (err, {rows}) => {
        if (err) throw err;
        console.table(rows);
        // restarts the app
        start();
    });
}

// Views all employees works
function viewAllEmployees() {
    const query = `
    SELECT e.id, e.first_name, e.last_name, r.title, d.department_name, r.salary, CONCAT(m.first_name, ' ', m.last_name) AS manager_name
    FROM employee e
    LEFT JOIN roles r ON e.role_id = r.id
    LEFT JOIN departments d ON r.department_id = d.id
    LEFT JOIN employee m ON e.manager_id = m.id;
    `;
    connection.query(query, (err, {rows}) => {
        if (err) throw err;
        console.table(rows);
        // restarts the app
        start();
    });
}

// Adds a new department
// function addDepartment() {
//     inquirer
//         .prompt({
//             type: "input",
//             name: "name",
//             message: "Enter the name of the new department:",
//         }))
//     })
//         .then((answer) => {
//             console.log(answer.name);
//             const query = `INSERT INTO departments (department_name) VALUES ("${answer.name}")`;
//             connection.query(query, (err, res) => {
//                 if (err) throw err;
//                 console.log(`Added department ${answer.name} to the database!`);
//                 // restarts the app
//                 start();
//                 console.log(answer.name);
//             });
//         });
// }
function addDepartment() {
        inquirer
            .prompt([
                {
                    type: "input",
                    name: "title",
                    message: "Enter the title of the new department:",
                },
                // {
                //     type: "list",
                //     name: "department",
                //     message: "Select the department for the new role:",
                //     choices: res.rows.map(({id, department_name}) =>({
                //         name: department_name,
                //         value: id
                //     }
                // ))
                // },
            ])
            .then((answers) => {
                const query = "INSERT INTO departments(department_name) VALUES ($1)";
                connection.query(
                    query,
                    [
                        answers.title,
                    ],
                    (err, res) => {
                        if (err) throw err;
                        console.log(
                            `Added department ${answers.title} in the database!`
                        );
                        // restarts the app
                        start();
                    }
                );
            });
    }
// Adds a new role works
function addRole() {
    const query = "SELECT * FROM departments";
    connection.query(query, (err, res) => {
        if (err) throw err;
        inquirer
            .prompt([
                {
                    type: "input",
                    name: "title",
                    message: "Enter the title of the new role:",
                },
                {
                    type: "input",
                    name: "salary",
                    message: "Enter the salary of the new role:",
                },
                {
                    type: "list",
                    name: "department",
                    message: "Select the department for the new role:",

                    choices: res.rows.map(({id, department_name}) =>({
                        name: department_name,
                        value: id
                    }))
                },
            ])
            .then((answers) => {
                console.log(answers.department)
                const query = "INSERT INTO roles(title, salary, department_id) VALUES ($1, $2, $3)";
                connection.query(
                    query,
                    [
                        answers.title,
                        answers.salary,
                        answers.department,
                    ],
                    (err, res) => {
                        if (err) throw err;
                        console.log(
                            `Added role ${answers.title} with salary ${answers.salary} to the ${answers.department} department in the database!`
                        );
                        // restarts the app
                        start();
                    }
                );
            });
    });
}
// test code 
async function addEmployee() {
    const query = "SELECT id, title FROM roles";
    const managerData = await connection.query ("SELECT * FROM employee")
    let managers = managerData.rows.map(({id, first_name, last_name}) => ({
        name: first_name + " " + last_name,
        value: id
    }))
    connection.query(query, (err, res) => {
        if (err) throw err;
        inquirer
            .prompt([
                {
                    type: "input",
                    name: "firstName",
                    message: "Employee's first name:",
                },
                {
                    type: "input",
                    name: "lastName",
                    message: "Employee's last name:",
                },
                {
                    type: "list",
                    name: "employee_role",
                    message: "Select the role for the employee:",
                    choices: res.rows.map(({id, title}) =>({
                        name: title,
                        value: id
                    }))
                },
                {
                    type: "list",
                    name: "employee_manager",
                    message: "Select the employee's manager",
                    choices: managers
                }
            ])
            .then((answers) => {
                const queryEmployeesManager = `
                INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES ($1, $2, $3, $4)
                ;`
                connection.query(queryEmployeesManager,[
                    answers.firstName,
                    answers.lastName,
                    answers.employee_role,
                    answers.employee_manager,

                ], (err,) => {
                     if (err) throw err; 

                     console.log("added employee to database");
                     start();
                });
                // console.log(answers.manager)
                // const query = "INSERT INTO (firstName, lastName, manager_id) VALUES ($1, $2, $3)";
                // connection.query(
                //     query,
                //     [
                //         answers.firstName,
                //         answers.lastName,
                //         answers.manager,
                //     ],
                //     (err, res) => {
                //         if (err) throw err;
                //         console.log(
                //             `Added employee ${answers.firstName} ${answers.lastName} as their ${answers.manager}.`
                //         );
                //         // restarts the app
                //         start();
                //     }
                // );
            });
    });
}
// test code

// Adds an Employee
// function addEmployee() {
//     connection.query("SELECT id, title FROM roles", (err, results) => {
//         if (err) {
//             console.log(error);
//             return;
//         }
        // const roles = results.map(({id, title}) =>({
        //     name: title,
        //     value: id,
        // }));
         // Gets list of employees from database to use as managers
        //  connection.query(
        //     'SELECT id, CONCAT(first_name, " ", last_name) AS name FROM employee',
        //     (error, results) => {
        //         if (error) {
        //             console.error(error);
        //             return;
        //         }

                // const managers = results.map(({ id, name }) => ({
                //     name,
                //     value: id,
                // }));

                // // User input employee information
                // inquirer
                //     .prompt([
                //         {
                //             type: "input",
                //             name: "firstName",
                //             message: "Employee's first name:",
                //         },
                //         {
                //             type: "input",
                //             name: "lastName",
                //             message: "Employee's last name:",
                //         },
                //         {
                //             type: "list",
                //             name: "roleId",
                //             message: "What is their role:",
                //             choices: roles,
                //         },
                //         {
                //             type: "list",
                //             name: "managerId",
                //             message: "Who's the employee's manager:",
                //             choices: [
                //                 { name: "None", value: null },
                //                 ...managers,
                //             ],
                //         },
                //     ])
                //     .then((answers) => {
                //         // Employee entered into the database
                //         const sql =
                //             "INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES (?, ?, ?, ?)";
                //         const values = [
                //             answers.firstName,
                //             answers.lastName,
                //             answers.roleId,
                //             answers.managerId,
                //         ];
        //                 connection.query(sql, values, (error) => {
        //                     if (error) {
        //                         console.error(error);
        //                         return;
        //                     }

        //                     console.log("Employee successfully added");
        //                     start();
        //                 });
        //             })
        //             .catch((error) => {
        //                 console.error(error);
        //             });
        //     }
        // );
//     });
// }
// Adds a Manager
function addManager() {
    const queryDepartments = "SELECT * FROM departments";
    const queryEmployees = "SELECT * FROM employee";

    connection.query(queryDepartments, (err, resDepartments) => {
        if (err) throw err;
        connection.query(queryEmployees, (err, resEmployees) => {
            if (err) throw err;
            inquirer.prompt([{
                        type: "list",
                        name: "department",
                        message: "Select Department:",
                        choices: resDepartments.map(
                            (department) => department.department_name
                        ),
                    },
                    {
                        type: "list",
                        name: "employee",
                        message: "Select employee to be added to manager:",
                        choices: resEmployees.map(
                            (employee) =>
                                `${employee.first_name} ${employee.last_name}`
                        ),
                    },
                    {
                        type: "list",
                        name: "manager",
                        message: "Who's the employee's manager:",
                        choices: resEmployees.map(
                            (employee) =>
                                `${employee.first_name} ${employee.last_name}`
                        ),
                    },
                ])
                .then((answers) => {
                    const department = resDepartments.find(
                        (department) =>
                            department.department_name === answers.department
                    );
                    const employee = resEmployees.find(
                        (employee) =>
                            `${employee.first_name} ${employee.last_name}` === answers.employee
                    );
                    const manager = resEmployees.find(
                        (employee) =>
                            `${employee.first_name} ${employee.last_name}` === answers.manager
                    );
                    const query =
                        "UPDATE employee SET manager_id = ? WHERE id = ? AND role_id IN (SELECT id FROM roles WHERE department_id = ?)";
                    connection.query(
                        query,
                        [manager.id, employee.id, department.id],
                        (err, res) => {
                            if (err) throw err;
                            console.log(
                                `Added the manager ${manager.first_name} ${manager.last_name} to employee ${employee.first_name} ${employee.last_name} in the department ${department.department_name}.`
                            );
                            // restarts the app
                            start();
                        }
                    );
                });
        });
    });
}

// Updates an employee's role
async function updateEmployeeRole() {
    const queryEmployees =
        "SELECT employee.id, employee.first_name, employee.last_name, roles.title FROM employee LEFT JOIN roles ON employee.role_id = roles.id";
    const queryRoles = "SELECT * FROM roles";
    await connection.query(queryEmployees, (err, resEmployees) => {
        if (err) throw err;
     connection.query(queryRoles, (err, resRoles) => {
            if (err) throw err;
            inquirer.prompt([
                    {
                        type: "list",
                        name: "employee",
                        message: "Select the employee to update their role:",
                        choices: resEmployees.map(
                            (employee) =>
                                `${employee.first_name} ${employee.last_name}`
                        ),
                    },
                    {
                        type: "list",
                        name: "role",
                        message: "Select their new role:",
                        choices: resRoles.map((role) => role.title),
                    },
                ])
                .then((answers) => {
                    const employee = resEmployees.find(
                        (employee) =>
                            `${employee.first_name} ${employee.last_name}` ===
                            answers.employee
                    );
                    const role = resRoles.find(
                        (role) => role.title === answers.role
                    );
                    const query =
                        "UPDATE employee SET role_id = ? WHERE id = ?";
                    connection.query(
                        query,
                        [role.id, employee.id],
                        (err, res) => {
                            if (err) throw err;
                            console.log(
                                `Updated ${employee.first_name} ${employee.last_name}'s role to ${role.title} in the database.`
                            );
                            // restarts the app
                            start();
                        }
                    );
                });
        });
    });
}

// View Employee By Managers
function viewEmployeesByManager() {
    const query = `
      SELECT 
        e.id, 
        e.first_name, 
        e.last_name, 
        r.title, 
        d.department_name, 
        CONCAT(m.first_name, ' ', m.last_name) AS manager_name
      FROM 
        employee e
        INNER JOIN roles r ON e.role_id = r.id
        INNER JOIN departments d ON r.department_id = d.id
        LEFT JOIN employee m ON e.manager_id = m.id
      ORDER BY 
        manager_name, 
        e.last_name, 
        e.first_name
    `;

    connection.query(query, (err, res) => {
        if (err) throw err;

        // group employees by the manager they are under
        const employeesByManager = res.reduce((acc, cur) => {
            const managerName = cur.manager_name;
            if (acc[managerName]) {
                acc[managerName].push(cur);
            } else {
                acc[managerName] = [cur];
            }
            return acc;
        }, {});

        // displays employees by manager
        console.log("Employees by manager:");
        for (const managerName in employeesByManager) {
            console.log(`\n${managerName}:`);
            const employees = employeesByManager[managerName];
            employees.forEach((employee) => {
                console.log(
                    `  ${employee.first_name} ${employee.last_name} | ${employee.title} | ${employee.department_name}`
                );
            });
        }

        // restarts the app
        start();
    });
}
// Views Employees by Department
function viewEmployeesByDepartment() {
    const query =
        "SELECT departments.department_name, employee.first_name, employee.last_name FROM employee INNER JOIN roles ON employee.role_id = roles.id INNER JOIN departments ON roles.department_id = departments.id ORDER BY departments.department_name ASC";

    connection.query(query, (err, res) => {
        if (err) throw err;
        console.log("\nEmployees by department:");
        console.table(res);
        // restarts the app
        start();
    });
}
// DELETES Departments, Roles, and Employees
function deleteDepartmentsRolesEmployees() {
    inquirer.prompt({

            type: "list",
            name: "data",
            message: "Select one to be deleted?",
            choices: ["Employee", "Role", "Department"],
        })
        .then((answer) => {
            switch (answer.data) {
                case "Employee":
                    deleteEmployee();
                    break;
                case "Role":
                    deleteRole();
                    break;
                case "Department":
                    deleteDepartment();
                    break;
                default:
                    console.log(`Invalid data: ${answer.data}`);
                    start();
                    break;
            }
        });
}
// DELETES Employees
function deleteEmployee() {
    const query = "SELECT * FROM employee";
    connection.query(query, (err, res) => {
        if (err) throw err;
        const employeeList = res.map((employee) => ({
            name: `${employee.first_name} ${employee.last_name}`,
            value: employee.id,
        }));
        employeeList.push({ name: "Go Back", value: "back" });
        inquirer.prompt({

                type: "list",
                name: "id",
                message: "Which employee do you wish to delete:",
                choices: employeeList,
            })
            .then((answer) => {
                if (answer.id === "back") {
                    // checks if user selected back option
                    deleteDepartmentsRolesEmployees();
                    return;
                }
                const query = "DELETE FROM employee WHERE id = ?";
                connection.query(query, [answer.id], (err, res) => {
                    if (err) throw err;
                    console.log(
                        `Deleted employee with ID ${answer.id} from the database!`
                        
                    );
                    // restarts the app
                    start();
                });
            });
    });
}
// DELETES ROLES
function deleteRole() {
    // Gets all roles from database
    const query = "SELECT * FROM roles";
    connection.query(query, (err, res) => {
        if (err) throw err;
        // Cycles through the retrieved data and makes an array
        const choices = res.map((role) => ({
            name: `${role.title} (${role.id}) - ${role.salary}`,
            value: role.id,
        }));
        // add a "Go Back" option to the list
        choices.push({ name: "Go Back", value: null });
        inquirer.prompt({

                type: "list",
                name: "roleId",
                message: "Select the role you're deleting:",
                choices: choices,
            })
            .then((answer) => {
                // checks if the user chose the Go Back
                if (answer.roleId === null) {
                    deleteDepartmentsRolesEmployees();
                    return;
                }
                const query = "DELETE FROM roles WHERE id = ?";
                connection.query(query, [answer.roleId], (err, res) => {
                    if (err) throw err;
                    console.log(
                        `Deleted role with ID ${answer.roleId} from the database!`
                    );
                    start();
                });
            });
    });
}
// DELETES Departments
function deleteDepartment() {
    // Lists Departments
    const query = "SELECT * FROM departments";
    connection.query(query, (err, res) => {
        if (err) throw err;
        const departmentChoices = res.map((department) => ({
            name: department.department_name,
            value: department.id,
        }));

        inquirer.prompt({

                type: "list",
                name: "departmentId",
                message: "Which department do you want to delete?",
                choices: [
                    ...departmentChoices,
                    { name: "Go Back", value: "back" },
                ],
            })
            .then((answer) => {
                if (answer.departmentId === "back") {
                    deleteDepartmentsRolesEmployees();
                } else {
                    const query = "DELETE FROM departments WHERE id = ?";
                    connection.query(
                        query,
                        [answer.departmentId],
                        (err, res) => {
                            if (err) throw err;
                            console.log(
                                `Deleted department ID ${answer.departmentId} from database.`
                            );
                            // restarts the app
                            start();
                        }
                    );
                }
            });
    });
}
// Views Total Budget of Department
function viewBudgetOfDepartment() {
    const query = "SELECT * FROM departments";
    connection.query(query, (err, res) => {
        if (err) throw err;
        const departmentChoices = res.map((department) => ({
            name: department.department_name,
            value: department.id,
        }));

        // prompts user to chose department
        inquirer.prompt({

                type: "list",
                name: "departmentId",
                message:
                    "Which department would you like to calculate a budget for?",
                choices: departmentChoices,
            })
            .then((answer) => {
                // calculates total budget for the department
                const query =
                    `SELECT 
                    departments.department_name AS department,
                    SUM(roles.salary) AS total_salary
                  FROM 
                    departments
                    INNER JOIN roles ON departments.id = roles.department_id
                    INNER JOIN employee ON roles.id = employee.role_id
                  WHERE 
                    departments.id = ?
                  GROUP BY 
                    departments.id;`;
                connection.query(query, [answer.departmentId], (err, res) => {
                    if (err) throw err;
                    const totalSalary = res[0].total_salary;
                    console.log(
                        `The total salary for employees in this department is $${totalSalary}`
                    );
                    // restarts the app
                    start();
                });
            });
    });
}

// severs the connection when the app exits
process.on("exit", () => {
    connection.sever();
});
start()