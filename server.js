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