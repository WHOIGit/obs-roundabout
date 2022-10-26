// JavaScript source code
'use strict';
console.log("Running Delete Parts Test.");

// Generated by Selenium IDE
const { Builder, By, Key, until, a, WebElement, promise, Capabilities } = require('selenium-webdriver');
const chrome = require('selenium-webdriver/chrome');
const firefox = require('selenium-webdriver/firefox');

var driver;
var myArgs = process.argv.slice(2);
var user;
var password;

(async function testParts() {

    let chromeCapabilities = Capabilities.chrome();
    var firefoxOptions = new firefox.Options();

    // Docker linux chrome will only run headless
    if ((myArgs[1] == 'headless') && (myArgs.length != 0)) {

        chromeCapabilities.set("goog:chromeOptions", {
            args: [
                "--no-sandbox",
                "--disable-dev-shm-usage",
                "--headless",
                "--log-level=3",
                "--disable-gpu"
            ]
        });

        firefoxOptions.addArguments("-headless");
    }

    // First argument specifies the Browser type
    if (myArgs[0] == 'chrome') {
        driver = new Builder().forBrowser('chrome').withCapabilities(chromeCapabilities).build();
    }
    else if (myArgs[0] == 'firefox') {
        driver = new Builder().forBrowser('firefox').setFirefoxOptions(firefoxOptions).build();
    }
    else {
        console.log('Error: Missing Arguments');
    }

    if (myArgs[2] == 'admin') {
        await driver.get("http://localhost:8000/");
        user = "admin";
        password = "admin";
    }
    else {
        //        await driver.get("https://ooi-cgrdb-staging.whoi.net/");
        await driver.get("https://rdb-testing.whoi.edu/");
        user = "jkoch";
        password = "Automatedtests";
    }

    await driver.manage().window().setRect({ width: 1304, height: 834 });
    // Set implict wait time in between steps
    await driver.manage().setTimeouts({ implicit: 2000 });

    //Hide Timer Panel when connecting to circleci local rdb django app
    if ((await driver.findElements(By.css("#djHideToolBarButton"))).length != 0) {
        await driver.findElement(By.css("#djHideToolBarButton")).click();
    }

    try {

        // If navbar toggler present in small screen
        try {
            var signin = await driver.findElement(By.linkText("Sign In"));
        }
        catch (NoSuchElementException) {
            await driver.findElement(By.css(".navbar-toggler-icon")).click();
        }
        // LOGIN
        await driver.findElement(By.linkText("Sign In")).click();
        await driver.findElement(By.id("id_login")).sendKeys(user);
        await driver.findElement(By.id("id_password")).sendKeys(password);
        await driver.findElement(By.css(".primaryAction")).click();

        // Delete Part Types, Part Templates and Inventory created running automated tests.

        await driver.findElement(By.id("navbarTemplates")).click();
        await driver.findElement(By.linkText("Parts")).click();
        await driver.findElement(By.id("searchbar-query")).click();
        await driver.findElement(By.id("searchbar-query")).sendKeys("Coastal Mooring");
        await driver.findElement(By.css(".btn-outline-primary:nth-child(1)")).click();

        await new Promise(r => setTimeout(r, 4000));

        if ((await driver.findElements(By.css(".even > .searchcol-part_number > a"))).length != 0) {
            await driver.findElement(By.css(".even > .searchcol-part_number > a")).click();
            await driver.findElement(By.linkText("Delete")).click();
            await new Promise(r => setTimeout(r, 1000));  // wait for .btn-danger caused stale element
            while ((await driver.findElements(By.css(".btn-danger"))).length == 0) {
                await new Promise(r => setTimeout(r, 1000));
                console.log("Wait 1 second for Delete Part 1.");
            }
            //let encodedString = await driver.takeScreenshot();
            //await fs.writeFileSync('./pscreen.png', encodedString, 'base64');
            //await driver.navigate().refresh();  //this did not work
            await driver.findElement(By.css(".btn-danger")).click();
        }
        else
            console.log("Delete Parts failed: Coastal Mooring not found");

        await new Promise(r => setTimeout(r, 4000));

        await driver.findElement(By.id("navbarTemplates")).click();
        await driver.findElement(By.linkText("Parts")).click();
        await driver.findElement(By.id("searchbar-query")).click();
        await driver.findElement(By.id("searchbar-query")).sendKeys("Surface Buoy");
        await driver.findElement(By.css(".btn-outline-primary:nth-child(1)")).click();
        await new Promise(r => setTimeout(r, 2000));

        if ((await driver.findElements(By.linkText("555-456-789"))).length != 0) {
            await driver.findElement(By.linkText("555-456-789")).click();
            await driver.findElement(By.linkText("Delete")).click();
            await new Promise(r => setTimeout(r, 1000));  // wait for .btn-danger caused stale element
            while ((await driver.findElements(By.css(".btn-danger"))).length == 0) {
                await new Promise(r => setTimeout(r, 1000));
                console.log("Wait 1 second for Delete Part 2.");
            }
            await driver.findElement(By.css(".btn-danger")).click();
        }
        else
            console.log("Delete Parts failed: Surface Buoy not found");

        await new Promise(r => setTimeout(r, 4000));
        await driver.findElement(By.id("navbarTemplates")).click();
        await driver.findElement(By.linkText("Parts")).click();
        await driver.findElement(By.id("searchbar-query")).click();
        await driver.findElement(By.id("searchbar-query")).sendKeys("Wifi Template");
        await driver.findElement(By.css(".btn-outline-primary:nth-child(1)")).click();
        await new Promise(r => setTimeout(r, 2000));

        if ((await driver.findElements(By.linkText("666-456-789"))).length != 0) {
            await driver.findElement(By.linkText("666-456-789")).click();
            await driver.findElement(By.linkText("Delete")).click();
            await new Promise(r => setTimeout(r, 1000));  // wait for .btn-danger caused stale element
            while ((await driver.findElements(By.css(".btn-danger"))).length == 0) {
                await new Promise(r => setTimeout(r, 1000));
                console.log("Wait 1 second for Delete Part 3.");
            }
            await driver.findElement(By.css(".btn-danger")).click();
        }
        else
            console.log("Delete Parts failed: Wifi Template not found");

        await new Promise(r => setTimeout(r, 2000));
        await driver.findElement(By.id("navbarTemplates")).click();
        await driver.findElement(By.linkText("Parts")).click();
        await driver.findElement(By.id("searchbar-query")).click();
        await driver.findElement(By.id("searchbar-query")).sendKeys("Disk Drive");
        await driver.findElement(By.css(".btn-outline-primary:nth-child(1)")).click();
        await new Promise(r => setTimeout(r, 2000));

        if ((await driver.findElements(By.linkText("100-259-785"))).length != 0) {
            await driver.findElement(By.linkText("100-259-785")).click();
            await driver.findElement(By.linkText("Delete")).click();
            await new Promise(r => setTimeout(r, 1000));  // wait for .btn-danger caused stale element
            while ((await driver.findElements(By.css(".btn-danger"))).length == 0) {
                await new Promise(r => setTimeout(r, 1000));
                console.log("Wait 1 second for Delete Part 4.");
            }
            await driver.findElement(By.css(".btn-danger")).click();
        }
        else
            console.log("Delete Parts failed: Disk Drive not found");

        await new Promise(r => setTimeout(r, 2000));
        await driver.findElement(By.id("navbarTemplates")).click();
        await driver.findElement(By.linkText("Parts")).click();
        await driver.findElement(By.id("searchbar-query")).click();
        await driver.findElement(By.id("searchbar-query")).sendKeys("ADCPS-J");
        await driver.findElement(By.css(".btn-outline-primary:nth-child(1)")).click();
        await new Promise(r => setTimeout(r, 2000));

        if ((await driver.findElements(By.linkText("1336-00010-0000"))).length != 0) {
            await driver.findElement(By.linkText("1336-00010-0000")).click();
            await driver.findElement(By.linkText("Delete")).click();
            await new Promise(r => setTimeout(r, 1000));  // wait for .btn-danger caused stale element
            while ((await driver.findElements(By.css(".btn-danger"))).length == 0) {
                await new Promise(r => setTimeout(r, 1000));
                console.log("Wait 1 second for Delete Part 5.");
            }
            await driver.findElement(By.css(".btn-danger")).click();
        }
        else
            console.log("Delete Parts failed: ADCPS-J not found");

        // Delete User Define Part Types
        await driver.findElement(By.id("navbarTemplates")).click();
        await driver.findElement(By.id("navbarAdmintools")).click();
        await driver.findElement(By.linkText("Edit Part Types")).click();


        if ((await driver.findElements(By.xpath("//tr[*]/td[text()='Structural']"))).length != 0) {
            var i = 1;
            while (true) {
                if ((await driver.findElement(By.xpath("//tr[" + i + "]/td")).getText()) == "Structural") {
                    break;
                }
                i++;
            }
            await driver.findElement(By.css("tr:nth-child(" + i + ") .btn-danger")).click();
            await driver.findElement(By.css(".btn-danger")).click();
        }
        else
            console.log("Delete Parts failed: Structural type not found");

        // Delete Computerized Part Type
        if ((await driver.findElements(By.xpath("//tr[*]/td[text()='Computerized']"))).length != 0) {
            var i = 1;
            while (true) {
                if ((await driver.findElement(By.xpath("//tr[" + i + "]/td")).getText()) == "Computerized") {
                    break;
                }
                i++;
            }
            await driver.findElement(By.css("tr:nth-child(" + i + ") .btn-danger")).click();
            await driver.findElement(By.css(".btn-danger")).click();
        }
        else
            console.log("Delete Parts failed: Computerized type not found");

        // Delete Custom Fields
        await driver.findElement(By.id("navbarTemplates")).click();
        await driver.findElement(By.id("navbarAdmintools")).click();
        await driver.findElement(By.linkText("Custom Fields")).click();

        var i = 1;
        while (true){
            if ((await driver.findElements(By.css("tr:nth-child(" + i + ") .btn-danger"))).length != 0) {
                await driver.findElement(By.css("tr:nth-child(" + i + ") .btn-danger")).click();
                await driver.findElement(By.css(".btn-danger")).click();
            }
            else {
                break;
            }
        }

        // Delete Inventory Tests
        await driver.findElement(By.id("navbarAdmintools")).click();
        await driver.findElement(By.linkText("Inventory Tests")).click();

        var i = 1;
        while (true) {
            if ((await driver.findElements(By.css("tr:nth-child(" + i + ") .btn-danger"))).length != 0) {
                await driver.findElement(By.css("tr:nth-child(" + i + ") .btn-danger")).click();
                await driver.findElement(By.css(".btn-danger")).click();
            }
            else {
                break;
            }
        }

        // Close browser window
        driver.quit();

    }
    catch (e) {
        console.log(e.message, e.stack);
        console.log("Delete Parts failed.");
        return 1;
    }

    console.log("Delete Parts completed.")
    return 0;

})();
