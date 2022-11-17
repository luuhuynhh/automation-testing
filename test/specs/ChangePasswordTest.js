const account = require("../data/account.json");
const passwords = require("../data/passwords.json");
const fs = require('fs');

describe('ChangePassword', async () => {

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
    })

    after('Save result', async () => {
        fs.writeFile('./test/result/changePasswordResult.json', JSON.stringify(passwords), err => {
            if (err) {
                throw err
            }
            console.log('JSON data is saved.')
        })
    })

    passwords.map((password, index) => {
        // console.log(password);
        return it(`Change Password #${index + 1}`, async () => {
            // get menu
            const menu = await $('.oxd-userdropdown');
            await menu.click();

            // get btn ChangePassword
            const changePasswordMenu = await $('[role="menu"]> li:nth-child(3)');
            await changePasswordMenu.click();

            // get input
            const INPUT_SELECTOR = '.oxd-input.oxd-input--active';
            const inputCurrentPassword = await $$(INPUT_SELECTOR)[1];
            const inputNewPassword = await $$(INPUT_SELECTOR)[2];
            const inputConfirmPassword = await $$(INPUT_SELECTOR)[3];

            await inputCurrentPassword.setValue(password.currentPassword);
            await inputNewPassword.setValue(password.password);
            await inputConfirmPassword.setValue(password.confirmPassword);

            // browser.saveScreenshot('changePW.png');

            // get btn Save
            const btnSave = await $('button[type="submit"]');
            await btnSave.click();

            browser.pause(10000);
            await browser.saveScreenshot(`./test/images/saved#${index + 1}.png`);

            const errElemets = await $$('.oxd-text.oxd-text--span.oxd-input-field-error-message.oxd-input-group__message');
            password.realResult = errElemets.length;


            try {
                const toast = await $('.oxd-text.oxd-text--p.oxd-text--toast-title.oxd-toast-content-text');
                password.toastText = await toast?.getText() || "";
            }
            catch (err) {
                console.log(err);
            }
        })



        // it('login correct', async () => {
        //     // get menu
        //     const menu = await $('.oxd-userdropdown');
        //     await menu.click();

        //     // get btn ChangePassword
        //     const changePasswordMenu = await $('[role="menu"]> li:nth-child(3)');
        //     await changePasswordMenu.click();

        //     // get input
        //     const INPUT_SELECTOR = '.oxd-input.oxd-input--active';
        //     const inputCurrentPassword = await $$(INPUT_SELECTOR)[1];
        //     const inputNewPassword = await $$(INPUT_SELECTOR)[2];
        //     const inputConfirmPassword = await $$(INPUT_SELECTOR)[3];

        //     await inputCurrentPassword.setValue('current-password');
        //     await inputNewPassword.setValue('current-password');
        //     await inputConfirmPassword.setValue('current-password');

        //     // browser.saveScreenshot('changePW.png');

        //     // get btn Save
        //     const btnSave = await $('button[type="submit"]');
        //     await btnSave.click();

        //     browser.pause(10000);
        //     await browser.saveScreenshot('./saved.png');

        //     after('Clear data', async () => {
        //         console.log('After suite');
        //     })


        /*// get Button Add
        const btnAdd = await $$('.oxd-button.oxd-button--medium.oxd-button--secondary')[1];
        console.log(btnAdd);
        await btnAdd.click();
        // save add employee screen
        browser.pause(10000);
        await browser.saveScreenshot('./addEmployee.png');
 
        // get input firstName
        const inputFirstName = await $('[name="firstName"]');
        await inputFirstName.setValue("Lu");
        // get input middleName
        const inputMiddleName = await $('[name="middleName"]');
        await inputMiddleName.setValue("<3");
        // get input lastName
        const inputLastName = await $('[name="lastName"]');
        await inputLastName.setValue("XuanY");
 
        // save screen after fill field
        browser.pause(10000);
        browser.saveScreenshot('./afterFillField.png');*/
    })
})