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

