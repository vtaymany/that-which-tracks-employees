const mysql = require('mysql')
const inquirer = require('inquirer')
const consoleTable = require('console.table')
const roleArr = []

function addDepartment() {
  inquirer
    .prompt([
      {
        name: 'name',
        type: 'input',
        message: 'Enter department name',
      },
    ])
    .then(function (res) {
      var query = connection.query(
        'INSERT INTO departments SET ? ',
        {
          name: res.name,
        },
        function (err) {
          if (err) throw err
          console.table(res)
          initialize()
        }
      )
    })
}

function addRole() {
  inquirer
    .prompt([
      {
        name: 'title',
        type: 'input',
        message: 'Enter role title',
      },
    ])
    .then(function (res) {
      var query = connection.query(
        'INSERT INTO roles SET ? ',
        {
          title: res.title,
        },
        function (err) {
          if (err) throw err
          console.table(res)
          initialize()
        }
      )
    })
}

function addEmployee() {
  inquirer
    .prompt([
      {
        name: 'firstName',
        type: 'input',
        message: 'Enter first name',
      },
      {
        name: 'lastName',
        type: 'input',
        message: 'Enter last name',
      },
    ])
    .then(function (res) {
      var query = connection.query(
        'INSERT INTO employees SET ? ',
        {
          first_name: res.firstName,
          last_name: res.lastName,
        },
        function (err) {
          if (err) throw err
          console.table(res)
          initialize()
        }
      )
    })
}

function viewAllDepartments() {
  connection.query('SELECT * FROM departments', function (err, res) {
    if (err) throw err
    console.table(res)
    initialize()
  })
}

function viewAllRoles() {
  connection.query('SELECT * FROM roles', function (err, res) {
    if (err) throw err
    console.table(res)
    initialize()
  })
}

function viewAllEmployees() {
  connection.query('SELECT * FROM employees', function (err, res) {
    if (err) throw err
    console.table(res)
    initialize()
  })
}

function selectRole() {
  roleArr.length = 0
  connection.query('SELECT * FROM roles', function (err, res) {
    if (err) throw err
    for (var i = 0; i < res.length; i++) {
      roleArr.push(res[i].title)
    }
  })
  console.log('this is the roleArr' + roleArr)
  return roleArr
}

function updateEmployee() {
  connection.query(
    'SELECT employees.last_name, roles.title FROM employees JOIN roles ON employees.role_id = roles.id;',
    function (err, res) {
      // console.log(res)
      if (err) throw err
      console.log(res)
      inquirer
        .prompt([
          {
            name: 'lastName',
            type: 'rawlist',
            choices: function () {
              var lastName = []
              for (var i = 0; i < res.length; i++) {
                lastName.push(res[i].last_name)
              }
              return lastName
            },
            message: "What is the Employee's last name? ",
          },
          {
            name: 'role',
            type: 'rawlist',
            message: 'What is the Employees new title? ',
            choices: selectRole(),
          },
        ])
        .then(function (res) {
          console.log('hello world' + roleArr)
          var roleID = roleArr.indexOf(res.role) + 1
          connection.query(
            'UPDATE employees SET role_id="' +
              roleID +
              '" WHERE last_name="' +
              res.lastName +
              '";',
            function (err) {
              if (err) throw err
              console.table(res)
              initialize()
            }
          )
        })
    }
  )
}

const connection = mysql.createConnection({
  host: 'localhost',

  // Your port; if not 3306
  port: 3306,

  // Your username
  user: 'root',

  // Your password
  password: 'welcome123',
  database: 'staffDB',
})

connection.connect(function (err) {
  if (err) throw err
  console.log('connected as id ' + connection.threadId)
  initialize()
})

function initialize() {
  inquirer
    .prompt([
      {
        type: 'list',
        message: 'What would you like to do?',
        name: 'choice',
        choices: [
          'Add Department',
          'Add Role',
          'Add Employee',
          'View all Departments',
          'View all Roles',
          'View all Employees',
          'Update Employee Role',
        ],
      },
    ])
    .then(function (val) {
      switch (val.choice) {
        case 'Add Department':
          addDepartment()
          break

        case 'Add Role':
          addRole()
          break

        case 'Add Employee':
          addEmployee()
          break

        case 'View all Departments':
          viewAllDepartments()
          break

        case 'View all Roles':
          viewAllRoles()
          break

        case 'View all Employees':
          viewAllEmployees()
          break

        case 'Update Employee Role':
          updateEmployee()
          break
      }
    })
}
