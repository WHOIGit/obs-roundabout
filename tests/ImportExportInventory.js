// JavaScript source code
'use strict';
console.log("Running Import/Export Inventory Test.");

// Generated by Selenium IDE
const { Builder, By, Key, until, a, WebElement, promise, Capabilities } = require('selenium-webdriver');
const chrome = require('selenium-webdriver/chrome');
const firefox = require('selenium-webdriver/firefox');
const assert = require('assert');
const { exception } = require('console');

var driver;
var myArgs = process.argv.slice(2);
var user;
var password;

(async function importInventory() {

    let chromeCapabilities = Capabilities.chrome();
    var firefoxOptions = new firefox.Options();

    // Docker linux chrome will only run headless
    if ((myArgs[1] == 'headless') && (myArgs.length !=0)) {
    
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

   if (myArgs[2] == 'admin')
    {
        await driver.get("http://localhost:8000/");
        user = "admin";
        password = "admin";
    }
    else
    {
//        await driver.get("https://ooi-cgrdb-staging.whoi.net/");
        await driver.get("https://rdb-testing.whoi.edu/");
        user = "jkoch";
        password = "Automatedtests";
    }

    // 2 | setWindowSize | 1304x834 | 
    await driver.manage().window().setRect({ width: 1304, height: 834 });

    //Hide Timer Panel when connecting to circleci local rdb django app
    if ((await driver.findElements(By.css("#djHideToolBarButton"))).length != 0)
    {
       await driver.findElement(By.css("#djHideToolBarButton")).click();
       await new Promise(r => setTimeout(r, 4000));
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

        // IMPORT INVENTORY TEST

        // Create a Custom Field
        // 10 | click | id=navbarAdminTools |
        await driver.findElement(By.id("navbarAdmintools")).click();
         // 4 | click | linkText=Custom Fields | 
        await driver.findElement(By.linkText("Custom Fields")).click();
	while ((await driver.findElements(By.linkText("Add Custom Field"))).length == 0) // 1.6
	{
	   await new Promise(r => setTimeout(r, 2000));
	   console.log("Wait 2 seconds for Add Custom Field.");
	}
        await driver.findElement(By.linkText("Add Custom Field")).click();
	while ((await driver.findElements(By.id("id_field_name"))).length == 0) // 1.6
	{
	   await new Promise(r => setTimeout(r, 2000));
	   console.log("Wait 2 seconds for Add Custom Field1.");
	}
        await driver.findElement(By.id("id_field_name")).click();
        // 7 | type | id=id_field_name | Condition
        await driver.findElement(By.id("id_field_name")).sendKeys("Condition");
        // 8 | click | id=id_field_description | 
        await driver.findElement(By.id("id_field_description")).click();
        // 9 | type | id=id_field_description | Inventory Condition
        await driver.findElement(By.id("id_field_description")).sendKeys("Inventory Condition");
        // 10 | click | id=id_field_type | 
        await driver.findElement(By.id("id_field_type")).click();
        // 11 | select | id=id_field_type | label=Dropdown Field
         {
            const dropdown = await driver.findElement(By.id("id_field_type"));
            await dropdown.findElement(By.xpath("//option[. = 'Dropdown Field']")).click();
         }

        // 13 | click | id=id_choice_field_options | 
        await driver.findElement(By.id("id_choice_field_options")).click();
        // 14 | type | id=id_choice_field_options | New|New\nGood|Good\nFair|Fair\nJunk|Junk
        await driver.findElement(By.id("id_choice_field_options")).sendKeys("New|New\nGood|Good\nFair|Fair\nJunk|Junk");
       // 15 | click | id=id_field_default_value | 
        await driver.findElement(By.id("id_field_default_value")).click();
        // 16 | type | id=id_field_default_value | Good
        await driver.findElement(By.id("id_field_default_value")).sendKeys("Good");
        // 17 | click | id=id_global_for_part_types_6 | 
//      await driver.findElement(By.id("id_global_for_part_types_6")).click();
        // 18 | click | css=.btn-primary | 
        await driver.findElement(By.css(".btn-primary")).click();

        // Import Valid Inventory Item
	await new Promise(r => setTimeout(r, 2000));
        await driver.findElement(By.id("navbarAdmintools")).click();
        // 4 | click | linkText=Bulk Upload Tool | 
        await driver.findElement(By.linkText("Bulk Upload Tool")).click();

	if (myArgs[1] == 'headless')
	{
		var filename = process.cwd()+"//inventory-import-successful.csv";
	}
	else
	{
	        var filename = process.cwd()+"\\inventory-import-successful.csv";
	}

	while ((await driver.findElements(By.id("id_document"))).length == 0) // 1.6
	{
	   await new Promise(r => setTimeout(r, 2000));
	   console.log("Wait 2 seconds for Bulk Upload.");
	}

        // 6 | type | id=id_document | C:\fakepath\inventory-import-successful.csv
        await driver.findElement(By.id("id_document")).sendKeys(filename);
        // 7 | click | css=.controls > .btn | 
        await driver.findElement(By.css(".controls > .btn")).click();
        // 8 | click | linkText=Import Valid! Click here to complete | 
	while ((await driver.findElements(By.partialLinkText("Click here"))).length == 0) // 1.6
	{
	   await new Promise(r => setTimeout(r, 2000));
	   console.log("Wait 2 seconds for Preview Import.");
	}
        await driver.findElement(By.linkText("Import Valid! Click here to complete")).click();
        // 9 | click | id=navbarAdmintools | 

        // Import Invalid Inventory Item
	await new Promise(r => setTimeout(r, 2000));
        await driver.findElement(By.id("navbarAdmintools")).click();
        // 10 | click | linkText=Bulk Upload Tool | 
        await driver.findElement(By.linkText("Bulk Upload Tool")).click();

	if (myArgs[1] == 'headless')
	{
		filename = process.cwd()+"//inventory-import-unsuccessful.csv";
	}
	else
	{
	        filename = process.cwd()+"\\inventory-import-unsuccessful.csv";
	}

	while ((await driver.findElements(By.id("id_document"))).length == 0) // 1.6
	{
	   await new Promise(r => setTimeout(r, 2000));
	   console.log("Wait 2 seconds for Bulk Upload1.");
	}

        // 12 | type | id=id_document | C:\fakepath\inventory-import-unsuccessful.csv
        await driver.findElement(By.id("id_document")).sendKeys(filename);
        // 13 | click | css=.controls > .btn | 
        await driver.findElement(By.css(".controls > .btn")).click();

        assert(await driver.findElement(By.css("td:nth-child(1) > .alert")).getText() == "ERROR. Serial Number already exists.");
        assert(await driver.findElement(By.css("td:nth-child(2) > .alert")).getText() == "ERROR. No matching Part Number. Check if Part Template exists.");
        assert(await driver.findElement(By.css("td:nth-child(3) > .alert")).getText() == "ERROR. No matching Location. Check if Location exists.");
        assert(await driver.findElement(By.css("td:nth-child(5) > .alert")).getText() == "ERROR. No matching Custom Field. Check if Field exists.");                

        // EXPORT INVENTORY TEST

        // Search for and Export Inventory Item
        // 3 | click | id=searchbar-query | 
        await driver.findElement(By.id("searchbar-query")).click();
        // 4 | type | id=searchbar-query | sewing
        await driver.findElement(By.id("searchbar-query")).sendKeys("456-654-321");
        // 5 | click | css=.btn:nth-child(1) | 
        await driver.findElement(By.css(".btn:nth-child(1)")).click()

        // Downloads to Downloads Folder
	while ((await driver.findElements(By.id("search--download-csv-button"))).length == 0) // 1.6
	{
	   await new Promise(r => setTimeout(r, 2000));
	   console.log("Wait 2 seconds for Search Download CSV.");
	}
        // 10 | click | id=search--download-csv-button |
        await driver.findElement(By.id("search--download-csv-button")).click();
        // 11 | click | linkText=All (Include Hidden Columns) | 
        await driver.findElement(By.linkText("All (Include Hidden Columns)")).click();

        // Read RDB_Inventory.csv and verify Serial Number, Part Number, Location, Notes, and Condition Custom Field
        var fs = require('fs');
        const jsdom = require("jsdom");
        const { JSDOM } = jsdom;
        const { window } = new JSDOM(`...`);
        var $ = require('jquery')(window);
        $.csv = require('jquery-csv');
        var data;

	if (myArgs[1] == 'headless')
	{
		// Docker/Circleci puts file in the current dir
		var rdb_inv = process.cwd()+"//RDB_Inventory.csv";
	}
	else
	{
		// Windows command line puts file in the User's default Downloads dir
 		const execSync = require('child_process').execSync;
        	var username = execSync('echo %username%', { encoding: 'utf-8' });
        	username = username.replace(/[\n\r]+/g, '');
        	var rdb_inv = "C:\\Users\\" + username + "\\Downloads\\RDB_Inventory.csv";
	}

	await new Promise(r => setTimeout(r, 6000));  //wait for file download
     	
        var csv = fs.readFileSync(rdb_inv,'utf8');
        var data = $.csv.toArrays(csv);
        for (var i = 0, len = data[0].length; i < len; i++) {
            if (data[0][i] == "Serial Number")
            {
                var serial_number = data[1][i];
            }
            if (data[0][i] == "Part Number")
            {
                var part_number = data[1][i];
            }
            if (data[0][i] == "Location")
            {
                var location = data[1][i];
            }
            if (data[0][i] == "Latest Action: Notes")
            {
                var notes = data[1][i];
            }
            if (data[0][i] == "Condition")
            {
                var condition = data[1][i];
            }
        } 

        // Verify exported Inventory fields match those in import csv file
	if (myArgs[1] == 'headless')
	{
		var import_inv = process.cwd()+"//inventory-import-successful.csv";
	}
	else
	{
	        var import_inv = process.cwd()+"\\inventory-import-successful.csv";
	}
        
        data = fs.readFileSync(import_inv, 'utf8');
        if (data.includes(serial_number))
	{
            console.log("Import/Export Serial Number matches.");
        }
	else
        {
	    throw new error("Import/Export Serial Number does not match.");
        }

        if (data.includes(part_number)) 
	{
            console.log("Import/Export Part Number matches.");
        }
	else
	{
            throw new error("Import/Export Part Number does not match.");
        }

        if (data.includes(location)) 
	{
            console.log("Import/Export Location matches.");
        }
	else
	{
            throw new error("Import/Export Location does not match.");
        }

        if (data.includes(notes))
	{
            console.log("Import/Export Notes matches.");
        }
	else
	{
            throw new error("Import/Export Notes does not match."); 
        }

        if (data.includes(condition)) 
	{
            console.log("Import/Export Condition matches.");
        }
	else
	{
            throw new error("Import/Export Condition does not match");
        }

	    
        // Close browser window
        driver.quit();

    }
    catch (e) {
        console.log(e.message, e.stack);
        console.log("Import/Export Inventory failed.");
	return 1;
    } 

    console.log("Import/Export Inventory completed.")
    return 0;

})();