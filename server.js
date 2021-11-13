// Dependencies
const inquirer = require("inquirer");
const mysql = require("mysql");
const cTable = require("console.table");

const connection = mysql.createConnection({
    host: "localhost",

    // PORT
    port: 3306,

    // username
    user:"root",

    db:"employee_db"
});

// connection tp mySql server
connection.connect(function(err){
    if(err) throw err;
    console.log("SQL connected");

    start();
});

function start(){
    inquirer.prompt([
        {
            type: "list",
            name: "start",
            message: "Pick one of the following",
            choices: ["View", "Add", "Update", "Exit"]
        }
    ]).then(function(res){
        switch(res.strat){
            case "View": view();
            break;
            case "Add": add();
            break;
            case "Update": updateEmployee();
            break;
            case "Exit":
                console.log("--------------------------------");
                console.log("All done");
                console.log("--------------------------------");
                break;
                default: console.log("default");
        }
    });
}

function view(){
    inquirer.prompt([
        {
            type: "list",
            name: "view",
            message: "Pick one of the following",
            choices: ["All Employees", "By Department", "By Role"]
        }
    ]).then(function(res){
        switch(res.strat){
            case "All employees": viewAllEmployees();
            break;
            case "By Department": viewByDepartment();
            break;
            case "By Role": viewByRole();
            break;
            default: console.log("default");
        }
    });
}

function viewAllEmployees(){
    connection.query("SELECT e.id AS ID, e.first_name AS First, e.last_name AS Last, e.role_id AS Role, r.salary AS Salary, m.last_name AS Manager, d.name AS Department FROM employee e LEFT JOIN employee m ON e.manager_id = m.id LEFT JOIN role r ON e.role_id = r.title LEFT JOIN department d ON r. department_id = d.id", function(err, results)
    {
        if(err) throw err;
        console.table(results);
        start();
    });
}

function viewByDepartment(){
    connection.query("SELECT * FROM department", function(err, results){
        if(err) throw err;
        inquirer.prompt([
            {
                name: "choice", 
                type: "list",
                choices: function(){
                    let choiceArr = [];
                    for(i=0; i < results.length; i++ );{
                        choiceArr.push(results[i].name);
                    }
                    return choiceArr;
                },
                message: "Select department"
            }
        ]).then(function(answer){
            connection.query(
                "SELECT e.id AS ID, e.first_name AS First, e.last_name AS Last, e.role_id AS Role, r.salary AS Salary, m.last_name AS Manager, d.name AS Department FROM employee e LEFT JOIN employee m ON e.manager_id = m.id LEFT JOIN role r ON e.role_id = r.title LEFT JOIN department d ON r.department_id = d.id WHERE d.name =?", [answer.choice], function(err, results)
                {
                    if(err) throw err;
                    console.table(results);
                    start();
                }
            )
        })
    })
}

function viewByRole(){
    connection.query("SELECT title FROM role", function(err, results){
        if(err) throw err;
        inquirer.prompt([
            {
                name: "choice",
                type: "list",
                choices: function(){
                    let choiceArr = [];
                    for(i=0; i < results.length; i++){
                        choiceArr.push(results[i].title);
                    }
                    return choiceArr
                },
                message: "Select Role"
            }
        ]).then(function(answer){
            console.log(answer.choice);
            connection.query("SELECT e.id AS ID, e.first_name AS First, e.last_name AS Last, e.role_id AS Role, r.salary AS Salary, m.last_name AS Manager, d.name AS Department FROM employee e LEFT JOIN employee m ON e.manager_id = m.id LEFT JOIN role r ON e. role_id = r.title LEFT JOIN department d ON r.department_id = d.id WHERE e.role_id =?", [answer.choice], function(err, results)
            {
                if(err) throw err;
                console.table(results);
                start();
            })
        })
    })
}

function add(){
    inquirer.prompt([
        {
            type: "list",
            name: "add",
            message: "What would you like to add?",
            choices: ["Department", "Employee Role", "Employee"]
        }
    ]).then(function(res){
        switch(res.add) {
            case "Department": addDepartment();
            break;
            case "Employee Role": addEmpolyeeRole();
            break;
            case "Employee": addEmployee();
            default: console.log("default");
        }
    });
}

function addDepartment(){
    inquirer.prompt([
        {
            name: "Department",
            type: "input",
            message: "What would you like to name the department?"
        }
    ]).then(function(answer){
        connection.query(
            "INSERT INTO department VALUES (DEFAULT, ?)",
            [answer.department],
            function(err){
                if(err) throw err;
                console.log("--------------------------------");
                console.log("Departments updated with "+ answer.department);
                console.log("--------------------------------");
                start();
            }
        )
    })
}

function addEmpolyeeRole(){
    inquirer.prompt([
        {
            name:"role",
            type: "input",
            message: "Enter role:"
        },
        {
            name: "salary", 
            type: "number",
            message: "Please Enter Salary",
            validate: function(value){
                if(isNaN(value) === false){
                    return true;
                }
                return false
            }
        },
        {
            name: "department_id", 
            type: "number", 
            message: "Enter Department ID",
            validate: function(value){
                if(isNaN(value) === false){
                    return true;
                }
                return false
            }
        }
    ]).then(function(answer){
        connection.query(
            "INSERT INTO role SET ?", 
            {
                title: answer.role,
                salary: answer.salary, 
                department_id: answer.department_id
            },
            function(err){
                if(err) throw err;
                console.log("--------------------------------");
                console.log("Employee Roles updated with "+ answer.role);
                console.log("--------------------------------");
                start();
            }
        )
    })
}

function addEmployee(){
    connection.query("SELECT * FROM role", function(err, results){
        if(err) throw err;
        inquirer.prompt([
            {
                name: "firstName",
                type: "input",
                message: "Enter Employee's name"
            },
            {
                name: "lastName",
                type: "input",
                message: "Enter Employee's last name"
            },
            {
                name: "role",
                type: "list",
                choices: function(){
                    var choiceArr = [];
                    for(i=0; i < results.length; i++){
                        choiceArr.push(results[i].title);
                    }
                    return choiceArr;
                },
                message: "Select title"
            },
            {
                name: "manager",
                type: "number",
                validate: function(value){
                    if(isNaN(value) === false){
                        return true;
                    } 
                    return false;
                },
                message: "Enter manager ID",
                default: "1"
            }
        ]).then(function(answer){
            connection.query(
                "INSERT INTO employee SET ?",
                {
                    first_name: answer.firstName,
                    last_name: answer.lastname,
                    role_id: answer.role,
                    manager_id: answer.manager
                }
            )
            console.log("Employee added");
            start();
        });
    });
}

function updateEmployee(){
    connection.query(
        "SELECT * FROM employee", function(err, results){
            if (err) throw err;
            inquirer.prompt([
                {
                    name: "choice",
                    type: "list",
                    choices: function(){
                        let choiceArr = [];
                        for(i=0; i < results.length; i++)
                        {
                            choiceArr.push(results[i].last_name);
                        } 
                        return choiceArr;
                    },
                    message: "Select an Employee to update"
                }
            ]).then(function(answer){
                const saveName = answer.choice;

                connection.query("SELECT * FROM employee", function(err, results){
                    if(err, results){
                        if(err) throw err;
                        inquirer.prompt([
                            {
                                name: "role", 
                                type: "list",
                                choices: function(){
                                    let choiceArr = [];
                                    for(i=0; i< results.length; i++){
                                        choiceArr.push(results[i].role_id);
                                    }
                                    return choiceArr;
                                },
                                message: "Select Title"
                            },
                            {
                                name: "manager",
                                type: "number",
                                validate: function(value){
                                    if(isNaN(value) === false){
                                        return true;
                                    }
                                    return false;
                                },
                                message: "Enter new Manager ID", 
                                default: "1"
                            }
                        ]).then(function(answer){
                            console.log(answer);
                            console.log(saveName);
                            connection.query("UPDATE employee SET ? WHERE last_name = ?",
                            [{
                                role_id: answer.role,
                                manager_id: answer.manager
                            }, saveName
                            ]
                    ),
                    console.log("Employee updated"),
                    start();
                });
            }
        })
    })
    }
    )
}