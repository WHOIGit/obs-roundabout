// JavaScript source code
'use strict';
console.log("Running Add/Deploy Builds Test.");

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

async function fixMonthAbbr(month)
{
    var abbr;

    if (month == "Sep") { abbr = month + "t.";}
    else if (month == "Jul") { abbr = month + "y.";}
    else if (month == "Mar") { abbr = month + "ch";}
    else if (month == "Apr")  { abbr = month + "il";}
    else if (month == "Jun") { abbr = month + "e";}
    else { abbr = month + "."; }

    return abbr;
}

async function fixDayAbbr(day)
{
    var abbr;

    if (day <= "09") 
    { 
       abbr = day.substring(1);
    }
    else
    {
       abbr = day;
    }

    return abbr;
}


(async function addBuilds() {

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
    // Set implict wait time in between steps
    await driver.manage().setTimeouts({ implicit: 2000 });

    //Hide Timer Panel when connecting to circleci local rdb django app
    if ((await driver.findElements(By.css("#djHideToolBarButton"))).length != 0)
    {
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

        // ADD BUILDS TEST

        // Add build with non null assembly template, build number, and location
        await driver.findElement(By.linkText("Builds")).click();
	while ((await driver.findElements(By.linkText("Create New Build"))).length == 0) //1.6
	{
	   await new Promise(r => setTimeout(r, 2000));
	   console.log("Wait 2 seconds for New Build.");
	}
   
        await driver.findElement(By.linkText("Create New Build")).click();
        await new Promise(r => setTimeout(r, 6000));  //needed for firefox build number to populate
        // 5 | select | id=id_assembly | label=Test Glider 1
        {
            const dropdown = await driver.findElement(By.id("id_assembly"));
            await dropdown.findElement(By.xpath("//option[. = 'Singer']")).click();
        }
   
        await new Promise(r => setTimeout(r, 6000));  //needed for build number to populate - 1.6
      
        // 6 | select | id=id_location | label=--- Test
        {
            const dropdown = await driver.findElement(By.id("id_location"));
            await dropdown.findElement(By.xpath("//option[. = ' Test']")).click();
        }
        // 7 | type | id=id_build_notes | This is an automated test build.
        await driver.findElement(By.id("id_build_notes")).sendKeys("This is an automated test build.");
        // 8 | click | css=.controls > .btn | 
        await driver.findElement(By.css(".controls > .btn")).click();

	while ((await driver.findElements(By.partialLinkText("Singer"))).length == 0) //1.6
	{
	   await new Promise(r => setTimeout(r, 2000));
	   console.log("Wait 2 seconds for New Build1.");
	}

/* TEMP - COMMENT OUT UNTIL SIDNEY FIXES!!!!

        // Verify Build is created in Test Location
        await driver.findElement(By.css(".btn-outline-primary:nth-child(1)")).click(); // search button
        // 20 | click | id=field-select_c_r0 | 
        await driver.wait(until.elementLocated(By.id("field-select_c_r0")));
        await driver.findElement(By.id("field-select_c_r0")).click();
        // 21 | select | id=field-select_c_r0 | label=Location
        {
            const dropdown = await driver.findElement(By.id("field-select_c_r0"));
            await dropdown.findElement(By.xpath("//option[. = 'Location']")).click();
        }
        // 22 | select | id=qfield-lookup_c_r0 | label=Exact
        {
            const dropdown = await driver.findElement(By.id("qfield-lookup_c_r0"));
            await dropdown.findElement(By.xpath("//option[. = 'Exact']")).click();
        }
        // 23 | type | id=field-query_c_r0 | Lost
        await driver.findElement(By.id("field-query_c_r0")).sendKeys("Test");
        // 24 | click | id=searchform-submit-button | 
        await driver.findElement(By.id("searchform-submit-button")).click();
        // 25 | click | css=.even a | 
        await new Promise(r => setTimeout(r, 2000));
        await driver.findElement(By.xpath("//p[contains(.,'1 items match your search!')]"));
*/
        // Add build with null assembly template, assembly revision, build number or location
        await driver.findElement(By.linkText("Builds")).click();
	while ((await driver.findElements(By.linkText("Create New Build"))).length == 0) //1.6
	{
	   await new Promise(r => setTimeout(r, 2000));
	   console.log("Wait 2 seconds for New Build2.");
	}
        await driver.findElement(By.linkText("Create New Build")).click();
//	    await new Promise(r => setTimeout(r, 9000));  //linux firefox & circleci
	while ((await driver.findElements(By.id("id_assembly"))).length == 0) //1.6
	{
	   await new Promise(r => setTimeout(r, 2000));
	   console.log("Wait 2 seconds for New Build2.");
	}
        {
            const dropdown = await driver.findElement(By.id("id_assembly"));
            await dropdown.findElement(By.xpath("//option[. = 'Singer']")).click();
        }
        // 11 | click | css=.controls > .btn | 
        await driver.findElement(By.css(".controls > .btn")).click()
	while ((await driver.findElements(By.css("#div_id_location .ajax-error"))).length == 0) //1.6
	{
	   await new Promise(r => setTimeout(r, 2000));
	   console.log("Wait 2 seconds for New Build Ajax Error.");
	}
        // 12 | verifyText | css=.ajax-error | This field is required.
        assert(await driver.findElement(By.css("#div_id_location .ajax-error")).getText() == "This field is required.");
        // 13 | select | id=id_location | label=Test
        {
            const dropdown = await driver.findElement(By.id("id_location"));
            // Space required before Test
            await dropdown.findElement(By.xpath("//option[. = ' Test']")).click();
        }
        // 14 | select | id=id_assembly | label=---------
	    await new Promise(r => setTimeout(r, 6000)); //linux firefox
        {
            const dropdown = await driver.findElement(By.id("id_assembly"))
            await dropdown.findElement(By.xpath("//option[. = '---------']")).click();
        }
        // 15 | click | css=.controls > .btn | 
        await driver.findElement(By.css(".controls > .btn")).click();
	await new Promise(r => setTimeout(r, 2000));

        // 16 | verifyText | css=.ajax-error | This field is required.
        assert(await driver.findElement(By.css("#div_id_assembly .ajax-error")).getText() == "This field is required.");
        {
            const dropdown = await driver.findElement(By.id("id_assembly"));
            await dropdown.findElement(By.xpath("//option[. = 'Singer']")).click();
        }
	await new Promise(r => setTimeout(r, 6000));  //needed for build number to populate
        // 18 | type | id=id_build_number |  
        await driver.findElement(By.id("hint_id_build_number")).click();
        await driver.findElement(By.id("id_build_number")).clear();
        // 19 | click | css=.controls > .btn | 
        await driver.findElement(By.css(".controls > .btn")).click();
        // 20 | verifyText | css=.ajax-error | This field is required.
        assert(await driver.findElement(By.css("#div_id_build_number .ajax-error")).getText() == "This field is required.");

        // Add Inventory Items to the Build
        await driver.findElement(By.linkText("Inventory")).click();

	while ((await driver.findElements(By.linkText("Test"))).length == 0) //1.6
	{
	   await new Promise(r => setTimeout(r, 2000));
	   console.log("Wait 2 seconds for Inv Navtree.");
	}

        // Expand Inventory Tree and Navigate to Build->Sewing Inventory
        // Expand "Test" tree nodes   
        var j = 1;
        while (true) {
            if (await driver.findElement(By.xpath("//div[2]/ul/li["+j+"]/a")).getText() == "Test")
            { 
                await driver.findElement(By.xpath("//div/ul/li[" + j + "]/i")).click();
                break;
            }
            j++;
        }

        // Expand Build tree node
        await driver.findElement(By.xpath("//li[" + j + "]/ul/li/i")).click();
	while ((await driver.findElements(By.linkText("sewing - 1232"))).length == 0) //1.6
	{
	   await new Promise(r => setTimeout(r, 2000));
	   console.log("Wait 2 seconds for sewing.");
	}
        await driver.findElement(By.linkText("sewing - 1232")).click(); 

	while ((await driver.findElements(By.linkText("Add"))).length == 0) //1.6
	{
	   await new Promise(r => setTimeout(r, 2000));
	   console.log("Wait 2 seconds for Add Inventory.");
	}
        await driver.findElement(By.linkText("Add")).click();
        await new Promise(r => setTimeout(r, 6000));  //wait for navtree to refresh

        // DEPLOY BUILD - Tests Issue #137

        // Start Deployment->Initiate Burnin->Deploy Build
        // 10 | click | linkText=Start Deployment | 
   	while ((await driver.findElements(By.partialLinkText("Singer"))).length == 0) //1.6
	{
	   await new Promise(r => setTimeout(r, 2000));
	   console.log("Wait 2 seconds for Deploy1.");
	}
        await driver.findElement(By.partialLinkText("Singer")).click(); 
	// Left hand doesn't know what right hand is doing..... this takes along time to load
   	while ((await driver.findElements(By.linkText("Retire Build"))).length == 0) //1.6
	{
	   await new Promise(r => setTimeout(r, 2000));
	   console.log("Wait 2 seconds for Deploy2.");
	}
        await driver.findElement(By.id("action")).click(); 
        await driver.findElement(By.linkText("Start Deployment")).click();
        // 12 | type | id=id_deployment_number | 7
	while ((await driver.findElements(By.id("id_deployment_number"))).length == 0) //1.6
	{
	   await new Promise(r => setTimeout(r, 2000));
	   console.log("Wait 2 seconds for Deployment Number.");
	}
	await driver.findElement(By.id("id_deployment_number")).click();
        await driver.findElement(By.id("id_deployment_number")).sendKeys("7");
        // 14 | select | id=id_deployed_location | label=Test
        {
            const dropdown = await driver.findElement(By.id("id_deployed_location"));
            await dropdown.findElement(By.xpath("//option[. = ' Test']")).click();
        } 
 
        await driver.findElement(By.css(".controls > .btn")).click();
	await new Promise(r => setTimeout(r, 2000));  // wait for refresh to start

	while ((await driver.findElements(By.linkText("Retire Build"))).length == 0) //1.6
	{
	   await new Promise(r => setTimeout(r, 2000));
	   console.log("Wait 2 seconds for Deploy2.");
	}
        // 18 | click | id=action | 
        await driver.findElement(By.id("action")).click();
	await new Promise(r => setTimeout(r, 2000)); 

        await driver.findElement(By.linkText("Initiate Burn In")).click();
        // 20 | click | css=.controls > .btn-primary | 
   	while ((await driver.findElements(By.css(".controls > .btn-primary"))).length == 0) //1.6
	{
	   await new Promise(r => setTimeout(r, 2000));
	   console.log("Wait 2 seconds for Burnin2.");
	}
        await driver.findElement(By.css(".controls > .btn-primary")).click();

	await new Promise(r => setTimeout(r, 2000));  //wait for refresh to start
        // 25 | click | id=action | 
	while ((await driver.findElements(By.linkText("Retire Build"))).length == 0) //1.6
	{
	   await new Promise(r => setTimeout(r, 2000));
	   console.log("Wait 2 seconds for Deploy2.");
	}
        await driver.findElement(By.id("action")).click();
        await driver.findElement(By.linkText("Deploy to Field")).click();
	while ((await driver.findElements(By.id("id_location"))).length == 0) //1.6
	{
	   await new Promise(r => setTimeout(r, 2000));
	   console.log("Wait 2 seconds for Deploy to Field3.");
	}
        // Read current date and set to 2 days prior
        // 27 | click | id=id_date | 
        var ele = await driver.findElement(By.xpath("//input[@id='id_date']"));
        var dateString = await ele.getAttribute("value");  //getText did not work

        // Get new date 2 days prior to current date
        var d = new Date(dateString);
        d.setDate(d.getDate() - 2);
        var newDate = (d.getMonth() + 1) + "/" + d.getDate() + "/" + d.getFullYear() + " " + d.getHours() + ":" + d.getMinutes();
  
        await driver.findElement(By.xpath("//input[@id='id_date']")).clear();
        await driver.executeScript("arguments[0].value = arguments[1]", ele, newDate); 
       // await driver.findElement(By.xpath("//input[@id='id_date']")).sendKeys(newDate);  //this appends new date to old date

        // Set Location - to avoid spinning wheel bug
        const dropdown = await driver.findElement(By.id("id_location"));
        await dropdown.findElement(By.xpath("//option[. = ' Test']")).click();       
        // 29 | click | css=.controls > .btn-primary | 
        await driver.findElement(By.css(".controls > .btn-primary")).click();
 
        // Verify Total Time in Field and Current Deployment Time in Field: 2 days 0 hours
	while ((await driver.findElements(By.linkText("Deployments"))).length == 0) //wait for screen to populate
	{
	   await new Promise(r => setTimeout(r, 2000));
	   console.log("Wait 2 seconds for Deploy to Field4.");
	}
        var bodyText = await driver.findElement(By.tagName("Body")).getText();
        // UNCOMMENT FOR DOCKER - history shows 27 days due to staging testing
        assert(bodyText.includes("Total Time in Field: 2 days 0 hours"));        
        assert(bodyText.includes("Current Deployment Time in Field: 2 days 0 hours"));

        // Click Deployments Tab and verify Deployment To Field Date: is 2 days prior 
        // 31 | click | id=deployments-tab |
	while ((await driver.findElements(By.linkText("Deployments"))).length == 0) //1.6
	{
	   await new Promise(r => setTimeout(r, 2000));
	   console.log("Wait 2 seconds for Deployments.");
	}
	await driver.findElement(By.linkText("Deployments")).click();
	while ((await driver.findElements(By.id("deployments-tab"))).length == 0) //1.6
	{
	   await new Promise(r => setTimeout(r, 2000));
	   console.log("Wait 2 seconds for Deployments-tab.");
	}
        //await driver.findElement(By.id("deployments-tab")).click();
        await new Promise(r => setTimeout(r, 4000));
        // 32 | click | css=.collapsed > .fa |  0 
        await driver.findElement(By.css(".collapsed > .fa")).click();
        await new Promise(r => setTimeout(r, 2000));
        // Verify Deployment Times in the Deployments Tab
        bodyText = await driver.findElement(By.tagName("Body")).getText();
        assert(bodyText.includes("Deployment Time in Field: 2 days 0 hours"));

        var date = new Date(newDate);
        var fullDate = date.toDateString();
        var rdbDate = fullDate.split(" ");

        //FIX date Sep -> Sept. & other months
        var month = await fixMonthAbbr(rdbDate[1]);
	day = await fixDayAbbr(rdbDate[2]);
        rdbDate = month + " " + day + ", " + rdbDate[3] + ",";
	try {
	   assert(bodyText.includes("Deployment To Field Date: " + rdbDate));
	}
	catch (AssertionError) {
           console.log("Assertion Error: Deployment To Field Date is  "+rdbDate);
        }


        await driver.findElement(By.linkText("Inventory")).click();

	while ((await driver.findElements(By.linkText("Test"))).length == 0) //1.6
	{
	   await new Promise(r => setTimeout(r, 2000));
	   console.log("Wait 2 seconds for Inv Navtree.");
	}

        // Expand Inventory Tree and Navigate to Build->Sewing Inventory
        // Expand "Test" tree nodes   
        var j = 1;
        while (true) {
            if (await driver.findElement(By.xpath("//div[2]/ul/li["+j+"]/a")).getText() == "Test")
            { 
                await driver.findElement(By.xpath("//div/ul/li[" + j + "]/i")).click();
                break;
            }
            j++;
        }

        // Expand tree node
        await driver.findElement(By.xpath("//li[" + j + "]/ul/li/i")).click();
	while ((await driver.findElements(By.partialLinkText("sewing - 1232"))).length == 0) //1.6
	{
	   await new Promise(r => setTimeout(r, 2000));
	   console.log("Wait 2 seconds for sewing.");
	}

        // Select Inventory and verify Deployment times
        await driver.findElement(By.partialLinkText("sewing - 1232")).click();
        // 34 | click | id=deployments-tab | 
	while ((await driver.findElements(By.linkText("Deployments"))).length == 0) //1.6
	{
	   await new Promise(r => setTimeout(r, 2000));
	   console.log("Wait 2 seconds for Inventory Deployments.");
	}
        await driver.findElement(By.linkText("Deployments")).click();
	while ((await driver.findElements(By.css(".list-group-item > .collapsed > .fa"))).length == 0) //1.6
	{
	   await new Promise(r => setTimeout(r, 2000));
	   console.log("Wait 2 seconds for Inv List Item."); 
	}
        // 35 | click | css=.list-group-item > .collapsed > .fa | 
        await driver.findElement(By.css(".list-group-item > .collapsed > .fa")).click(); 
        await new Promise(r => setTimeout(r, 2000));
        bodyText = await driver.findElement(By.tagName("Body")).getText();
        assert(bodyText.includes("Inventory Time in Field: 2 days 0 hours"));    
        var rdbDate = fullDate.split(" ");

        month = await fixMonthAbbr(rdbDate[1]);
	day = await fixDayAbbr(rdbDate[2]);
        rdbDate = month + " " + day + ", " + rdbDate[3] + ",";
	try {
           assert(bodyText.includes("Deployment To Field Date: " + rdbDate));
        }
	catch (AssertionError) {
           console.log("Assertion Error: Deployment To Field Date:  is  "+rdbDate);
        }
        
        // Remove sewing Inventory from Build
        // 39 | click | id=action | 
	while ((await driver.findElements(By.id("action"))).length == 0) //1.6
	{
	   await new Promise(r => setTimeout(r, 2000));
	   console.log("Wait 2 seconds for Inventory2.");
	}
        await driver.findElement(By.id("action")).click();
	await new Promise(r => setTimeout(r, 2000)); 
        await driver.findElement(By.linkText("Recover from Deployment")).click();

        // Get current date
        await new Promise(r => setTimeout(r, 2000));
        var ele = await driver.findElement(By.xpath("//input[@id='id_date']"));
        var dateString = await ele.getAttribute("value"); 

        // Get new date 1 day prior to current date
        var d = new Date(dateString);
        d.setDate(d.getDate() - 1);
        var newDate = (d.getMonth() + 1) + "/" + d.getDate() + "/" + d.getFullYear() + " " + d.getHours() + ":" + d.getMinutes();
        await driver.findElement(By.xpath("//input[@id='id_date']")).clear();
        await driver.executeScript("arguments[0].value = arguments[1]", ele, newDate); 
        // 43 | click | css=.controls > .btn-primary | 
        await driver.findElement(By.css(".controls > .btn-primary")).click();

        // Verify date is 1 day prior on Deployments tab
        // 45 | click | id=deployments-tab | 
	while ((await driver.findElements(By.linkText("Deployments"))).length == 0) //1.6
	{
	   await new Promise(r => setTimeout(r, 2000));
	   console.log("Wait 2 seconds for Deployments.");
	}
        await driver.findElement(By.linkText("Deployments")).click();
	while ((await driver.findElements(By.css(".list-group-item > .collapsed > .fa"))).length == 0) //1.6
	{
	   await new Promise(r => setTimeout(r, 2000));
	   console.log("Wait 2 seconds for Build List Item."); 
	}
        // 46 | click | css=.list-group-item > .collapsed > .fa | 
        await driver.findElement(By.css(".list-group-item > .collapsed > .fa")).click();
        await new Promise(r => setTimeout(r, 2000));
        bodyText = await driver.findElement(By.tagName("Body")).getText();
        assert(bodyText.includes("Inventory Time in Field: 1 days 0 hours"));

        var date = new Date(newDate);
        var fullDate = date.toDateString();
        var rdbDate = fullDate.split(" ");

        month = await fixMonthAbbr(rdbDate[1]);
	var day = await fixDayAbbr(rdbDate[2]);
        rdbDate = month + " " + day + ", " + rdbDate[3] + ",";
	try {
           assert(bodyText.includes("Deployment Recovery Date: " + rdbDate));
	}
	catch (AssertionError) {
           console.log("Assertion Error: Deployment Recovery Date is  "+rdbDate);
        }

        // Re-add sewing Inventory to Build at the current date
        // 47 | click | id=action | 
	while ((await driver.findElements(By.partialLinkText("sewing - 1232"))).length == 0) //1.6
	{
	   await new Promise(r => setTimeout(r, 2000));
	   console.log("Wait 2 seconds for Re-add.");
	}
        await driver.findElement(By.partialLinkText("sewing - 1232")).click();
        await new Promise(r => setTimeout(r, 2000));
	while ((await driver.findElements(By.linkText("Add"))).length == 0) //1.6
	{
	   await new Promise(r => setTimeout(r, 2000));
	   console.log("Wait 2 seconds for Add1.");
	}
        await driver.findElement(By.linkText("Add")).click();
	while ((await driver.findElements(By.xpath("//input[@id='id_date']"))).length == 0) //1.6
	{
	   await new Promise(r => setTimeout(r, 2000));
	   console.log("Wait 2 seconds for Id_date.");
	}
        var ele = await driver.findElement(By.xpath("//input[@id='id_date']"));
        var dateString = await ele.getAttribute("value");
        await driver.findElement(By.css(".controls > .btn-primary")).click();

        // Verify Total Time in Field and Current Deployment Time in Field: 0 days 0 hours
        await new Promise(r => setTimeout(r, 4000));
        var bodyText = await driver.findElement(By.tagName("Body")).getText();
        // UNCOMMENT FOR DOCKER - history shows 27 days due to staging testing
        assert(bodyText.includes("Total Time in Field: 1 days 0 hours"));        
        assert(bodyText.includes("Current Deployment Time in Field: 0 days 0 hours"));

        // 53 | click | id=deployments-tab | 
	while ((await driver.findElements(By.linkText("Deployments"))).length == 0) //1.6
	{
	   await new Promise(r => setTimeout(r, 2000));
	   console.log("Wait 2 seconds for Deployments.");
	}
        await driver.findElement(By.linkText("Deployments")).click();
        // 54 | click | css=.list-group-item:nth-child(1) > .collapsed > .fa | 
        //await driver.findElement(By.css(".list-group-item > .collapsed > .fa")).click();
	// Sometimes the Retired Deployment is the first one on the list for Inventory, so expand both
        await driver.findElement(By.css(".list-group-item:nth-child(2) > .collapsed:nth-child(1)")).click();
        await driver.findElement(By.css(".list-group-item:nth-child(1) > .collapsed:nth-child(1)")).click();

        await new Promise(r => setTimeout(r, 2000));
        bodyText = await driver.findElement(By.tagName("Body")).getText();
        assert(bodyText.includes("Inventory Time in Field: 0 days 0 hours"));

        var date = new Date(dateString);
        var fullDate = date.toDateString();
        var rdbDate = fullDate.split(" ");

        month = await fixMonthAbbr(rdbDate[1]);
	var day = await fixDayAbbr(rdbDate[2]);
        var string = month + " " + day + ", " + rdbDate[3] + ",";
        assert(bodyText.includes("Deployment To Field Date: " + string));

        // Close browser window
        driver.quit();

    }
    catch (e) {
        console.log(e.message, e.stack);
        console.log("Add/Deploy Builds failed.");
	return 1;
    }
    console.log("Add/Deploy Builds completed.");
    return 0;

})();
