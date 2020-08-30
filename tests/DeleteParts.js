// JavaScript source code
'use strict';
console.log("Running Delete Parts Test.");

// Generated by Selenium IDE
const { Builder, By, Key, until, a, WebElement, promise, Capabilities } = require('selenium-webdriver');
const chrome = require('selenium-webdriver/chrome');
const firefox = require('selenium-webdriver/firefox');

var driver;
var myArgs = process.argv.slice(2);

(async function testParts() {

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

    // Step # | name | target | value
    if (myArgs[1] == 'headless')
    {
        await driver.get("http://localhost:8000/");   
    }
    else
    {
        // 1 | open | https://ooi-cgrdb-staging.whoi.net/ | 
        await driver.get("https://ooi-cgrdb-staging.whoi.net/");
    }

    // 2 | setWindowSize | 1304x834 | 
    await driver.manage().window().setRect({ width: 1304, height: 834 });
    // Set implict wait time in between steps
    await driver.manage().setTimeouts({ implicit: 4000 });

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
        await driver.findElement(By.id("id_login")).sendKeys("admin");
        await driver.findElement(By.id("id_password")).sendKeys("admin");
        await driver.findElement(By.css(".primaryAction")).click();

        // Delete Part Types, Part Templates and Inventory created running automated tests.
        // 10 | click | id=navbarTemplates |
        await driver.findElement(By.id("navbarTemplates")).click();
        await driver.findElement(By.id("navbarAdmintools")).click();
        // 5 | click | linkText=Test |
        await driver.findElement(By.linkText("Edit Part Types")).click();


	if ((await driver.findElements(By.xpath("//tr[*]/td[text()='Sewing Machine']"))).length != 0)
	{
            var i = 1;
            while (true) {
                if ((await driver.findElement(By.xpath("//tr[" + i + "]/td")).getText()) == "Sewing Machine") {
                    break;
                } 
                i++;
            }

//	    await new Promise(r => setTimeout(r, 2000));  //circleci
console.log("btn-danger 1.");
            var element = await driver.findElement(By.css("tr:nth-child(" + i + ") .btn-danger"));
            await driver.executeScript("arguments[0].click();", element);
//            await driver.findElement(By.css("tr:nth-child(" + i + ") .btn-danger")).click();

            // 6 | click | css=.btn-danger | 
//	    await new Promise(r => setTimeout(r, 4000));  //circleci
console.log("btn-danger 2.");
	    var element = await driver.findElement(By.css(".btn-danger"));
            await driver.executeScript("arguments[0].click();", element);
//await driver.findElement(By.css(".btn-danger")).click();
	}
	else
            console.log("Delete Parts failed: Sewing Machine type not found");

        // Delete Computerized Part Type
        if ((await driver.findElements(By.xpath("//tr[*]/td[text()='Computerized']"))).length != 0) {
            var i = 1;
            while (true) {
                if ((await driver.findElement(By.xpath("//tr[" + i + "]/td")).getText()) == "Computerized") {
                    break;
                }
                i++;
            }
//           await new Promise(r => setTimeout(r, 4000));  //circleci
console.log("btn-danger 3.");
	    var element = await driver.findElement(By.css("tr:nth-child(" + i + ") .btn-danger"));
            await driver.executeScript("arguments[0].click();", element);
//	    await driver.findElement(By.css("tr:nth-child(" + i + ") .btn-danger")).click();

            // 6 | click | css=.btn-danger | 
//	    await new Promise(r => setTimeout(r, 4000));  //circleci
console.log("btn-danger 4.");
	    var element = await driver.findElement(By.css(".btn-danger"));
            await driver.executeScript("arguments[0].click();", element);
//            await driver.findElement(By.css(".btn-danger")).click();
        }
        else
            console.log("Delete Parts failed: Computerized type not found");

	await new Promise(r => setTimeout(r, 4000));  //circleci firefox
        // 7 | click | id=navbarTemplates | 
        await driver.findElement(By.id("navbarTemplates")).click();
        // 8 | click | linkText=Parts | 
        await driver.findElement(By.linkText("Parts")).click();
        // 9 | click | id=searchbar-query | 
        await driver.findElement(By.id("searchbar-query")).click();
        // 10 | type | id=searchbar-query | Sewing Template
        await driver.findElement(By.id("searchbar-query")).sendKeys("Sewing Template");
        // 11 | click | css=.btn-outline-primary:nth-child(1) | 
        await driver.findElement(By.css(".btn-outline-primary:nth-child(1)")).click();
        // 12 | click | linkText=1232 | 
        await new Promise(r => setTimeout(r, 2000));

	if ((await driver.findElements(By.linkText("1232"))).length != 0)
	{
            await driver.findElement(By.linkText("1232")).click();
            // 13 | click | linkText=Delete | 
            await driver.findElement(By.linkText("Delete")).click();
            // 14 | click | css=.btn-danger | 
            await new Promise(r => setTimeout(r, 8000)); //circleci firefox
console.log("btn-danger 5.");
	    var element = await driver.findElement(By.xpath("//input[3]"));
            await driver.executeScript("arguments[0].click();", element);
//            await driver.findElement(By.css(".btn-danger")).click();
	}
	else
	    console.log("Delete Parts failed: Sewing Template not found");

        // 7 | click | id=navbarTemplates | 
        await driver.findElement(By.id("navbarTemplates")).click();
        // 8 | click | linkText=Parts | 
        await driver.findElement(By.linkText("Parts")).click();
        // 9 | click | id=searchbar-query | 
        await driver.findElement(By.id("searchbar-query")).click();
        // 10 | type | id=searchbar-query | Sewing Template
        await driver.findElement(By.id("searchbar-query")).sendKeys("Wheel Template");
        // 11 | click | css=.btn-outline-primary:nth-child(1) | 
        await driver.findElement(By.css(".btn-outline-primary:nth-child(1)")).click();
        // 12 | click | linkText=1232 | 
        await new Promise(r => setTimeout(r, 2000));

	if ((await driver.findElements(By.linkText("555-456-789"))).length != 0)
	{
            await driver.findElement(By.linkText("555-456-789")).click();
            // 13 | click | linkText=Delete | 
            await driver.findElement(By.linkText("Delete")).click();
            // 14 | click | css=.btn-danger | 
            await new Promise(r => setTimeout(r, 8000));  //circleci firefox
console.log("btn-danger 6.");
            var element = await driver.findElement(By.xpath("//input[3]"));
            await driver.executeScript("arguments[0].click();", element);
//            await driver.findElement(By.css(".btn-danger")).click();
	}
	else
	    console.log("Delete Parts failed: Wheel Template not found");

        // 7 | click | id=navbarTemplates | 
        await driver.findElement(By.id("navbarTemplates")).click();
        // 8 | click | linkText=Parts | 
        await driver.findElement(By.linkText("Parts")).click();
        // 9 | click | id=searchbar-query | 
        await driver.findElement(By.id("searchbar-query")).click();
        // 10 | type | id=searchbar-query | Sewing Template
        await driver.findElement(By.id("searchbar-query")).sendKeys("Pin Template");
        // 11 | click | css=.btn-outline-primary:nth-child(1) | 
        await driver.findElement(By.css(".btn-outline-primary:nth-child(1)")).click();
        // 12 | click | linkText=1232 | 
        await new Promise(r => setTimeout(r, 2000));

	if ((await driver.findElements(By.linkText("666-456-789"))).length != 0)
	{
            await driver.findElement(By.linkText("666-456-789")).click();
            // 13 | click | linkText=Delete | 
            await driver.findElement(By.linkText("Delete")).click();
            // 14 | click | css=.btn-danger | 
            await new Promise(r => setTimeout(r, 8000));  //circleci firefox keeps failing here
console.log("btn-danger 7.");
	    var element = await driver.findElement(By.xpath("//input[3]"));
            await driver.executeScript("arguments[0].click();", element);
//            await driver.findElement(By.css(".btn-danger")).click();
	}
	else
	    console.log("Delete Parts failed: Pin Template not found");


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
