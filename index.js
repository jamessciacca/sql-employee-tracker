// Pulling In Inquirer and Console Table NPM
const mysql = require('mysql2');
const inquirer = require('inquirer');
const consoleTable = require('console.table');
const util = require('util');

//creating the connection the database
const connection = mysql.createConnection({
    host: 'localhost',
    port: 3306,
    user: 'root',
    password: 'pass',
    database: 'employee_DB'
});

//querying to the database with a promise
connection.query = util.promisify(connection.query);

// starting the application
connection.connect(function (err) {
    if (err) throw err;
    //if the connection is made run our first function
    startMenu();
});

// Creating a Welcome Screen sO the user can see when they are in the application
//this uses the console table npm
console.table(
    '\n---------- Employee Tracker App ----------\n'
);

//Presenting User with options they can choose from.
const startMenu = async () => {
    try{
        // setting userOption = to the users choice!
        const userOption = await inquirer.prompt({
            name: 'action',
            type: 'list',
            message: 'Select from the following options : ',
            choices: [
                'View all Departments',
                'View all Roles',
                'View all Employees',
                'Add a Department',
                'Add a Role',
                'Add an Employee',
                'Update an Employees Role',
                'Exit Application'
            ]
        });
        //using a switch statement to find a match to the users choice
        switch (userOption.action){

            //when we find the users choice, the function for their choice will run!

            case 'View all Departments':
                viewAllDepartments();
                break;

            case 'View all Roles':
                viewAllRoles();
                break;
                
            case 'View all Employees':
                viewAllEmployees();
                break;
            
            case 'Add a Department':
                addDepartment();
                break;
                
            case 'Add a Role':
                addRole();
                break;

            case 'Add an Employee':
                addEmployee();
                break;

            case 'Update an Employees Role':
                updateEmployee();
                break;

        };
        //incase of an error we will send the user back to the startMenu
    }catch (err) {
        console.log(err);
        startMenu();
    };
};

// Creating Functions for each of the options the user can choose from
//using try catch to make sure each function is working properly

//View All Departments Function
const viewAllDepartments = async () => {
    console.log('Department View');
    
    try{
        //grabbing data from database for the departments
        const query = 'SELECT * FROM department';
        //asking our connection to put the data in a table
        connection.query(query, function (err, res) {
            // if error thqueryow an error
            if (err) throw err;
            // creating an array to push the data into
            let departmentArray = [];
            res.forEach(department => departmentArray.push(department));
            // Printing the array to the screen using console.table
            console.table(departmentArray);
            startMenu();
        });
    }
        //using the catch to send user back to the startMenu
        catch (err) {
            console.log(err);
            startMenu();
        };
};

//View All Roles Function
// following the department function for the rest of the functions
const viewAllRoles = async () => {
    console.log('Roles View');

    try{
        const query = 'SELECT * FROM role';
        connection.query(query, function (err, res) {
            if (err) throw err;
            let roleArray = [];
            res.forEach(role => roleArray.push(role));
            console.table(roleArray);
            startMenu();
        });
    }catch (err) {
        console.log(err);
        startMenu();
    };
};

//View All Employees Function
const viewAllEmployees = async () => {
    console.log('Employees View');

    try{
        const query = 'SELECT * FROM employee';
        connection.query(query, function(err, res) {
            if (err) throw err;
            let employeeArray = [];
            res.forEach(employee => employeeArray.push(employee));
            console.table(employeeArray);
            startMenu();
        });
    }catch (err) {
        console.log(err);
        startMenu();
    };
};

//Add a Department Function 
const addDepartment = async () => {
    try{
        console.log('Add Department');

        //prompting the user for needed info
        let userAnswer = await inquirer.prompt([
            {
                name: 'departmentName',
                type: 'input',
                message: 'Enter the New Department Name!'
            }
        ]);

        let result = await connection.query('INSERT INTO department SET ?', {
            department_name: userAnswer.departmentName
        });

        //Message to let the user know the Department was added successfully
        console.log(`${userAnswer.departmentName} added successfully to Departments!`)
        startMenu();

    }catch (err) {
        console.log(err);
        startMenu();
    };
};

// Function to add a new role
const addRole = async () => {
    try{
        console.log('Add a Role');

        //creating a variable to hold the departments data
        let departments = await connection.query('SELECT * FROM department');

        //prompting the user
        let userAnswer = await inquirer.prompt([
            {
                name: 'title',
                type: 'input',
                message: 'Enter the Name of the New Role!'
            },
            {
                name: 'salary',
                type: 'input',
                message: 'Enter the Salary for This Role!'
            },
            {
                name: 'departmentId',
                type: 'list',
                //giving the department data so the user can choose the associated department
                //for the role they are choosing
                choices: departments.map((departmentId) => {
                    return {
                        name: departmentId.department_name,
                        value: departmentId.id
                    }
                }),
                message: 'Enter the Department this Role is Associated With!',
            }
        ]);

        //for loop to find the chosen department and store it in a variable
        let usersDepartment;
        for(i = 0, i < departments.length; i++;){
            if(departments[i].department_id === userAnswer.choice){
                usersDepartment = departments[i];
            };
        }
        // Using a query to insert the new role into the database and log a confirmation message
        let result = await connection.query('INSERT INTO role SET ?', {
            title: userAnswer.title,
            salary: userAnswer.salary,
            department_id: userAnswer.departmentId
        })

        console.log(`${userAnswer.title} role added successfully!`)
        startMenu();
     }catch (err) {
        console.log(err);
        startMenu();
    };
};

//Function to Add an Employee
const addEmployee = async () => {
    try{
        console.log('Add Employee');

        //creating variables to pull in data
        const roles = await connection.query('SELECT * FROM role');
        const managers = await connection.query('SELECT * FROM employee');
        const userAnswer = await inquirer.prompt([
            {
                name: 'firstName',
                type: 'input',
                message: 'Enter the Employees First Name!'
            },
            {
                name: 'lastName',
                type: 'input',
                message: 'Enter the Employees Last Name'
            },
            {
                name: 'employeeRoleId',
                type: 'list',
                choices: roles.map((role) => {
                    return {
                        name: role.title,
                        value: role.id
                    }
                }),
                message: "Enter the Employees Role Id"
            },
            {
                name: 'employeeManagerId',
                type: 'list',
                choices: managers.map((manager) => {
                    return {
                        name: manager.first_name + " " + manager.last_name,
                        value: manager.id
                    }
                }),
                message: "Enter the Employees Manager's ID!"
            }
        ]);

        let result = await connection.query('INSERT INTO employee SET ?', {
            first_name: userAnswer.firstName,
            last_name: userAnswer.lastName,
            role_id: (userAnswer.employeeRoleId),
            manager_id: (userAnswer.employeeManagerId)
        });

        console.log(`${userAnswer.firstName} ${userAnswer.lastName} was added successfully`);
        startMenu();
    }catch (err) {
        console.log(err);
        startMenu();
    };
};

//function to update the employees role
const updateEmployee = async () => {
    try{
        console.log('Update Employee');
        //holding the data for employee
        const employees = await connection.query('SELECT * FROM employee');

        //prompting the user for the update

        let employeeSelect = await inquirer.prompt([
            {
                name: 'employee',
                type: 'list',
                //allowing the user to select fromt he list of existing users
                choices: employees.map((employeeName) => {
                    // returning the employee
                    return{
                        name: employeeName.first_name + ' ' + employeeName.last_name,
                        value: employeeName.id
                    }
                }),
                message: 'Select Employee to Update!'
            }
        ]);

        // prompt the user to select a new role for the chosen employee
        const roles = await connection.query('SELECT * FROM role');

        let roleSelect = await inquirer.prompt([
            {
                name: 'role',
                type: 'list',
                choices: roles.map((roleName) => {
                    return {
                        name: roleName.title,
                        value: roleName.id
                    }
                }),
                message: 'Select New Role for the Employee!'
            }
        ]);

        let result = await connection.query('UPDATE employee SET ? WHERE ?', [{
            role_id: roleSelect.role},{id: employeeSelect.employee}]);
            
        console.log(`Employee Role Updated!`)
        startMenu();
    }catch (err) {
        console.log(err);
        startMenu();
    };
};



