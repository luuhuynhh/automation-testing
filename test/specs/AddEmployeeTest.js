const account = require("../data/account.json");
const employees = require("../data/employees.json");
const fs = require('fs');

describe('AddEmployee', async () => {

    before('Data preparation', async () => {
        console.log("Before suite")
        // open login page
        await browser.url('http://localhost/orangehrm-5.1/web/index.php/auth/login');
        // get Element
        const inputUsername = await $('input[name = "username"]');
        const inputPassword = $("input[name='password']");
        // set value
        await inputUsername.setValue(account.userName);
        await inputPassword.setValue(account.password);
        // click to login
        const loginButton = await $('button[type="submit"]');
        await loginButton.click();
        // save login screen
        browser.pause(10000);
        await browser.saveScreenshot('./test/images/login.png');
        //btn Add
        const btnAdd = await $$('.oxd-button.oxd-button--medium.oxd-button--secondary')[1];
        await btnAdd.click();
    })

    after('Save result', async () => {
        fs.writeFile('./test/result/addEmployeesResult.json', JSON.stringify(employees), err => {
            if (err) {
                throw err
            }
            console.log('JSON data is saved.')
        })
    })

    beforeEach('Open add emplyee page', async () => {
        browser.url('http://localhost/orangehrm-5.1/web/pim/addEmployee');
    })

    employees.map((employee, index) => {
        console.log(employee);
        return it(`Add Employee #${index + 1}`, async () => {
            // get input
            const inputFirstName = await $('[name="firstName"]');
            await inputFirstName.setValue(employee.firstName);
            const inputMiddleName = await $('[name="middleName"]');
            await inputMiddleName.setValue(employee.middleName);
            const inputLastName = await $('[name="lastName"]');
            await inputLastName.setValue(employee.lastName);

            await browser.pause();

            // get btn Save
            const btnSave = await $('button[type="submit"]');
            await btnSave.click();

            browser.pause(10000);
            await browser.saveScreenshot(`./test/images/addEmployee#${index + 1}.png`);
        })
    })
})