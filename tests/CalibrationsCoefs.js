// JavaScript source code
'use strict';
console.log("Running Calibrations and Coefficients Test.");

// Generated by Selenium IDE
const { Builder, By, Key, until, a, WebElement, promise, Capabilities } = require('selenium-webdriver');
const chrome = require('selenium-webdriver/chrome');
const firefox = require('selenium-webdriver/firefox');
const assert = require('assert');
const fs = require('fs');

var driver;
var myArgs = process.argv.slice(2);
var user;
var password;


(async function calibrations() {

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

    // 2 | setWindowSize | 1304x834 | 
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

        // CALIBRATIONS AND COEFFICIENTS TEST

       // Create Calibrations for Part Template - Tests Issue #147
        // Search for Part Template
        // 13 | type | id=searchbar-query | sewing
        await driver.findElement(By.id("searchbar-query")).sendKeys("sewing");
        await driver.findElement(By.id("searchbar-modelselect")).sendKeys("Part Templates");
        // 14 | click | css=.btn-outline-primary:nth-child(1) | 
        await driver.findElement(By.css(".btn-outline-primary:nth-child(1)")).click();
	while ((await driver.findElements(By.linkText("1232"))).length == 0) // 1.6
	{
	   await new Promise(r => setTimeout(r, 2000));
	   console.log("Wait 2 seconds for Search.");
	}
        // 15 | click | linkText=1232 | 
        await driver.findElement(By.linkText("1232")).click();
	while ((await driver.findElements(By.linkText("Create Calibrations"))).length == 0)
	{
	   await new Promise(r => setTimeout(r, 2000));
	   console.log("Wait 2 seconds for Search Link.");
	}
        // Create Calibrations for Part Template
        await driver.findElement(By.linkText("Create Calibrations")).click();

	// 1.6 Behavior of this screen is so tweeky!!! Values set are cleared before .btn-primary
	// pushed. Doesn't happen stepping through the debugger. Fields MUST be set in this order!
	// Wait on a link, not a field, or a Stale Element error will be thrown
	while ((await driver.findElements(By.linkText("Add Calibration"))).length == 0)
	{
	   await new Promise(r => setTimeout(r, 2000));
	   console.log("Wait 2 seconds for Add.");
	} 
      
        // 24 | click | linkText=Add Configurations/Constants | 
        await new Promise(r => setTimeout(r, 2000));

        await driver.findElement(By.linkText("Add Calibration")).click();
        await new Promise(r => setTimeout(r, 2000)); 

        await driver.findElement(By.id("id_coefficient_names-1-value_set_type")).click();
        await driver.findElement(By.id("id_coefficient_names-1-value_set_type")).sendKeys("2-Dimensional Array");
        await driver.findElement(By.id("id_coefficient_names-1-calibration_name")).click();
        await driver.findElement(By.id("id_coefficient_names-1-calibration_name")).sendKeys("scalib2");
        await driver.findElement(By.id("id_coefficient_names-1-sigfig_override")).click(); 
        await driver.findElement(By.id("id_coefficient_names-1-sigfig_override")).sendKeys("20");
   
	await new Promise(r => setTimeout(r, 2000));
	await driver.findElement(By.id("id_coefficient_names-0-calibration_name")).clear();
        await driver.findElement(By.id("id_coefficient_names-0-calibration_name")).sendKeys("scalib1");

	await driver.findElement(By.id("id_user_draft")).sendKeys("admin");  //dropdown doesn't work, this gets unchecked
	await driver.findElement(By.id("id_user_draft")).sendKeys(user);  //dropdown doesn't work, this gets unchecked
	//encodedString = await driver.takeScreenshot();
	//await fs.writeFileSync('./ccscreen1.png', encodedString, 'base64');    
        await driver.findElement(By.css(".controls > .btn-primary")).click();

	while ((await driver.findElements(By.id("action"))).length == 0)
	{
	   await new Promise(r => setTimeout(r, 2000));
	   console.log("Wait 2 seconds for Action.");
	}

        //Edit Max Calibration Coeff decimal places for Sewing, but not Disk Drive Part Template - Issue #120
        await driver.findElement(By.id("action")).click();
	while ((await driver.findElements(By.linkText("Edit Part Template"))).length == 0)
	{
	   await new Promise(r => setTimeout(r, 2000));
	   console.log("Wait 2 seconds for Edit Part.");
	}
        await driver.findElement(By.linkText("Edit Part Template")).click();
	while ((await driver.findElements(By.id("id_cal_dec_places"))).length == 0)
	{
	   await new Promise(r => setTimeout(r, 2000));
	   console.log("Wait 2 seconds for Page Load.");
	}
        await driver.findElement(By.id("id_cal_dec_places")).clear();
        await driver.findElement(By.id("id_cal_dec_places")).sendKeys("20");
        await driver.findElement(By.css(".controls > .btn-primary")).click()
	while ((await driver.findElements(By.id("action"))).length == 0) //after page update
	{
	   await new Promise(r => setTimeout(r, 2000));
	   console.log("Wait 2 seconds for Action2.");
	}
        await driver.findElement(By.id("searchbar-query")).sendKeys("disk drive");
        await driver.findElement(By.id("searchbar-modelselect")).sendKeys("Part Templates");
        // 14 | click | css=.btn-outline-primary:nth-child(1) | 
        await driver.findElement(By.css(".btn-outline-primary:nth-child(1)")).click();
	while ((await driver.findElements(By.partialLinkText("100"))).length == 0)
	{
	   await new Promise(r => setTimeout(r, 2000));
	   console.log("Wait 2 seconds for Search2.");
	}
        await driver.findElement(By.partialLinkText("100")).click();
	while ((await driver.findElements(By.id("action"))).length == 0)
	{
	   await new Promise(r => setTimeout(r, 2000));
	   console.log("Wait 2 seconds for Action3.");
	}
        await driver.findElement(By.id("action")).click();
        await driver.findElement(By.linkText("Edit Part Template")).click();
	while ((await driver.findElements(By.id("id_part_number"))).length == 0)
	{
	   await new Promise(r => setTimeout(r, 2000));
	   console.log("Wait 2 seconds for Edit Part Template.");
	}
        try {
            await driver.findElement(By.id("id_cal_dec_places")).clear();
            console.log("Error: Max Calibration Coefficient decimal places should not be enabled for Disk Drive");
        }
        catch (NoSuchElementException) { } 

        // Navigate to Inventory Tree and click on associated Part Template - issue #147 cont.
        await driver.findElement(By.linkText("Inventory")).click();
	while ((await driver.findElements(By.xpath("//div[2]/ul/li[*]/a[text()='Test']"))).length == 0)
	{
	   await new Promise(r => setTimeout(r, 2000));
	   console.log("Wait 2 seconds for Navtree.");
	}
        if ((await driver.findElements(By.xpath("//div[2]/ul/li[*]/a[text()='Test']"))).length != 0) {
            // Expand Revision B and Sewing Template
            var j = 1;
            while (true) {
                if ((await driver.findElement(By.xpath("//div[2]/ul/li[" + j + "]/a")).getText()) == "Test") {
                    break;
                }
                j++;
            }
        }
        else
            console.log("Calibrations & Coefs failed: Test Location not found");

        await new Promise(r => setTimeout(r, 4000));
        await driver.findElement(By.xpath("//li[" + j + "]/i")).click();
        await new Promise(r => setTimeout(r, 4000));
        await driver.findElement(By.xpath("//li[" + j + "]/ul/li/i")).click();
	while ((await driver.findElements(By.partialLinkText("1232"))).length == 0)
	{
	   await new Promise(r => setTimeout(r, 2000));
	   console.log("Wait 2 seconds for Navtree2.");
	}
        await driver.findElement(By.partialLinkText("1232")).click();
	while ((await driver.findElements(By.id("action"))).length == 0)
	{
	   await new Promise(r => setTimeout(r, 2000));
	   console.log("Wait 2 seconds for Action4.");
	}
        await driver.findElement(By.id("action")).click()
        // 35 | click | id=add_constdefault_action |
	while ((await driver.findElements(By.id("add_coefficient_action"))).length == 0)
	{
	   await new Promise(r => setTimeout(r, 2000));
	   console.log("Wait 2 seconds for Add Coef.");
	}
        await driver.findElement(By.id("add_coefficient_action")).click();

	while ((await driver.findElements(By.id("id_user_draft"))).length == 0)
	{
	   await new Promise(r => setTimeout(r, 2000));
	   console.log("Wait 2 seconds for User.");
	}
        // 36 | addSelection | id=id_user_draft | label=admin
        {
            const dropdown = await driver.findElement(By.id("id_user_draft"))
//            await dropdown.findElement(By.xpath("//option[. = 'admin']")).click()
 	    await dropdown.findElement(By.xpath("//option[. = '" + user + "']")).click();
        }
        // 38 | type | id=id_constant_defaults-0-default_value | 1
        await driver.findElement(By.id("id_coefficient_value_sets-0-value_set")).sendKeys("55")
        await driver.findElement(By.id("id_coefficient_value_sets-1-value_set")).sendKeys("66")
        await driver.findElement(By.id("id_coefficient_value_sets-0-notes")).sendKeys("Notes for scalib1")
        await driver.findElement(By.id("id_coefficient_value_sets-1-notes")).sendKeys("Notes for scalib2")
        // 39 | click | css=.controls > .btn-primary | 
        await driver.findElement(By.css(".controls > .btn-primary")).click()
	while ((await driver.findElements(By.id("calibration-template-tab"))).length == 0)
	{
	   await new Promise(r => setTimeout(r, 2000));
	   console.log("Wait 2 seconds for Tab.");
	}
        // 40 | click | id=const_default-template-tab | 
        await driver.findElement(By.id("calibration-template-tab")).click()
	while ((await driver.findElements(By.css("#calibration-template .collapsed > .fa"))).length == 0)
	{
	   await new Promise(r => setTimeout(r, 2000));
	   console.log("Wait 2 seconds for Link.");
	}

        await driver.findElement(By.css("#calibration-template .collapsed > .fa")).click()
        await new Promise(r => setTimeout(r, 4000));
        // Verify values added in the History
        var bodyText = await driver.findElement(By.tagName("Body")).getText();
        assert(bodyText.includes("55"));
        assert(bodyText.includes("66"));
        assert(bodyText.includes("Calibration Event first added to RDB."));

        // Edit Coefficient Values and Metadata for Part Template on Inventory - Issues #151 and #96
        await driver.findElement(By.linkText("Edit Coefficient Values")).click();
	while ((await driver.findElements(By.id("id_coefficient_value_sets-0-value_set"))).length == 0)
	{
	   await new Promise(r => setTimeout(r, 2000));
	   console.log("Wait 2 seconds for Values.");
	}
        await driver.findElement(By.id("id_coefficient_value_sets-0-value_set")).clear();
        await driver.findElement(By.id("id_coefficient_value_sets-0-value_set")).sendKeys("555");
        await driver.findElement(By.id("id_coefficient_value_sets-0-notes")).clear();
        await driver.findElement(By.id("id_coefficient_value_sets-0-notes")).sendKeys("Updated Notes");
        await driver.findElement(By.css(".controls > .btn-primary")).click()
	while ((await driver.findElements(By.id("calibration-template-tab"))).length == 0)
	{
	   await new Promise(r => setTimeout(r, 2000));
	   console.log("Wait 2 seconds for Tab2.");
	}
        await driver.findElement(By.id("calibration-template-tab")).click()
	while ((await driver.findElements(By.css("#calibration-template .collapsed > .fa"))).length == 0)
	{
	   await new Promise(r => setTimeout(r, 2000));
	   console.log("Wait 2 seconds for Link.");
	}
        await driver.findElement(By.css("#calibration-template .collapsed > .fa")).click()
	while ((await driver.findElements(By.linkText("Edit Coefficient Metadata"))).length == 0)
	{
	   await new Promise(r => setTimeout(r, 2000));
	   console.log("Wait 2 seconds for Metadata.");
	}
        await driver.findElement(By.linkText("Edit Coefficient Metadata")).click();
	while ((await driver.findElements(By.id("id_coefficient_values-0-sigfig"))).length == 0)
	{
	   await new Promise(r => setTimeout(r, 2000));
	   console.log("Wait 2 seconds for Edit.");
	}
        await driver.findElement(By.id("id_coefficient_values-0-sigfig")).clear();
        await driver.findElement(By.id("id_coefficient_values-0-sigfig")).sendKeys("19");
        await driver.findElement(By.id("id_coefficient_values-0-notation_format")).sendKeys("Scientific");
        await driver.findElement(By.css(".controls > .btn-primary")).click()
   	while ((await driver.findElements(By.id("action"))).length == 0)  //after page update
	{
	   await new Promise(r => setTimeout(r, 2000));
	   console.log("Wait 2 seconds for Action5.");
	}

        // Copy Calibrations from one Part Template to Another - Issue #146
        await driver.findElement(By.id("searchbar-query")).sendKeys("pin");
        await driver.findElement(By.id("searchbar-modelselect")).sendKeys("Part Templates");
        // 14 | click | css=.btn-outline-primary:nth-child(1) | 
        await driver.findElement(By.css(".btn-outline-primary:nth-child(1)")).click();
	while ((await driver.findElements(By.partialLinkText("666"))).length == 0)
	{
	   await new Promise(r => setTimeout(r, 2000));
	   console.log("Wait 2 seconds for Search.");
	}
        await driver.findElement(By.partialLinkText("666")).click();
   	while ((await driver.findElements(By.linkText("Create Calibrations"))).length == 0)
	{
	   await new Promise(r => setTimeout(r, 2000));
	   console.log("Wait 2 seconds for Create Calib.");
	}
        await driver.findElement(By.linkText("Create Calibrations")).click();

	await new Promise(r => setTimeout(r, 6000)); // a wait for field present on screen causes fields not set, use timeout.

	// This screen is so tweeky! Works 2/3 times. Add some waits.
        {
            const dropdown = await driver.findElement(By.id("id_part_select"));
            await dropdown.findElement(By.xpath("//option[. = 'Sewing Template']")).click();
        }
	await new Promise(r => setTimeout(r, 4000));
        
//        await driver.findElement(By.id("id_user_draft")).sendKeys("admin");
	await driver.findElement(By.id("id_user_draft")).sendKeys(user);
	await new Promise(r => setTimeout(r, 4000));

	await driver.findElement(By.css(".controls > .btn-primary")).click();

   	while ((await driver.findElements(By.linkText("Calibrations"))).length == 0)
	{
	   await new Promise(r => setTimeout(r, 2000));
	   console.log("Wait 2 seconds for Calib.");
	}
        await driver.findElement(By.linkText("Calibrations")).click()
        await new Promise(r => setTimeout(r, 4000));

let encodedString = await driver.takeScreenshot();
await fs.writeFileSync('/tests/ccscreen.png', encodedString, 'base64');    
        // Verify values added in the History
        var bodyText = await driver.findElement(By.tagName("Body")).getText();
        assert(bodyText.includes("scalib1"));
        assert(bodyText.includes("scalib2"));

        // Search for Calibration Data, click on the resulting link and verify the "Calibration Coefficient History" Tab is populated - #Issue 109
        // 16 | select | id=searchbar-modelselect | label=-- Configs/Constants
        await driver.findElement(By.id("searchbar-modelselect")).sendKeys("-- Calibrations");
        // 18 | click | css=.btn-outline-primary:nth-child(1) | 
        await driver.findElement(By.css(".btn-outline-primary:nth-child(1)")).click()
   	while ((await driver.findElements(By.id("field-select_c_r0"))).length == 0)
	{
	   await new Promise(r => setTimeout(r, 2000));
	   console.log("Wait 2 seconds for Search3.");
	}
        // Search for Name
        await driver.findElement(By.id("field-select_c_r0")).click()
        // 20 | select | id=field-select_c_r0 | label=Inventory: Name
        {
            const dropdown = await driver.findElement(By.id("field-select_c_r0"))
            await dropdown.findElement(By.xpath("//option[. = 'Coefficient Name']")).click()
        }
        // 23 | type | id=field-query_c_r0 | scnst
        await driver.findElement(By.id("field-query_c_r0")).sendKeys("scalib1")
        // 24 | click | id=qfield-lookup_c_r0 | 
        {
            const dropdown = await driver.findElement(By.id("qfield-lookup_c_r0"))
            await dropdown.findElement(By.xpath("//option[. = 'Exact']")).click()
        }
        // 27 | click | id=searchform-submit-button | 
        await driver.findElement(By.id("searchform-submit-button")).click()
	while ((await driver.findElements(By.partialLinkText("1232"))).length == 0)
	{
	   await new Promise(r => setTimeout(r, 2000));
	   console.log("Wait 2 seconds for Search.");
	}
        await driver.findElement(By.partialLinkText("1232")).click();
	while ((await driver.findElements(By.id("calibration-template-tab"))).length == 0)
	{
	   await new Promise(r => setTimeout(r, 2000));
	   console.log("Wait 2 seconds for Tab3.");
	}
        await driver.findElement(By.id("calibration-template-tab")).click()
	while ((await driver.findElements(By.css("#calibration-template .collapsed > .fa"))).length == 0)
	{
	   await new Promise(r => setTimeout(r, 2000));
	   console.log("Wait 2 seconds for Link.");
	}
        await driver.findElement(By.css("#calibration-template .collapsed > .fa")).click()
        await new Promise(r => setTimeout(r, 4000));
        // Verify values added in the History
        var bodyText = await driver.findElement(By.tagName("Body")).getText();
        assert(bodyText.includes("scalib1"));
        assert(bodyText.includes("scalib2"));
        

        // Close browser window
        driver.quit();

    }
    catch (e) {
        console.log(e.message, e.stack);
        console.log("Calibrations and Coefficients failed.");
        return 1;
    }
    console.log("Calibrations and Coefficients completed.");
    return 0;

})();
