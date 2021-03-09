// JavaScript source code
'use strict';
console.log("Running Constants and Configs Test.");

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


(async function constantsConfigs() {

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

        // CONSTANTS AND CONFIGS TEST

        // Test Approve, Edit, Add Self as Reviewer for Constants and Configs - Issue #123
        // Enable Constants and Configs for Part Type
        await driver.findElement(By.id("navbarAdmintools")).click();
        await driver.findElement(By.linkText("Edit Part Types")).click();
   	while ((await driver.findElements(By.linkText("Add Part Type"))).length == 0) //1.6 Add Button is on screen
	{
	   await new Promise(r => setTimeout(r, 2000));
	   console.log("Wait 2 seconds for Edit Defaults.");
	}

        // Get the index to the row Sewing Machine is displayed on screen
        await new Promise(r => setTimeout(r, 2000));

        if ((await driver.findElements(By.xpath("//tr[*]/td[text()='Sewing Machine']"))).length != 0) {
            var i = 1;
            while (true) {
                if ((await driver.findElement(By.xpath("//tr[" + i + "]/td")).getText()) == "Sewing Machine") {
                    break;
                }
                i++;
            }
        }
        else
            console.log("Edit Parts failed: Sewing Machine type not found");

        await new Promise(r => setTimeout(r, 2000));
        await driver.findElement(By.css("tr:nth-child(" + i + ") .btn-primary")).click();
        // 9 | click | id=id_ccc_toggle | 
        await driver.findElement(By.id("id_ccc_toggle")).click();
        // 11 | click | css=.btn-primary | 
        await driver.findElement(By.css(".btn-primary")).click();
   	while ((await driver.findElements(By.linkText("Add Part Type"))).length == 0) // Add Button when done
	{
	   await new Promise(r => setTimeout(r, 2000));
	   console.log("Wait 2 seconds for Edit Defaults Complete.");
	}
       
        // 13 | type | id=searchbar-query | sewing
        await driver.findElement(By.id("searchbar-query")).sendKeys("sewing");
        // 14 | click | css=.btn-outline-primary:nth-child(1) | 
        await driver.findElement(By.css(".btn-outline-primary:nth-child(1)")).click();
   	while ((await driver.findElements(By.linkText("1232"))).length == 0) 
	{
	   await new Promise(r => setTimeout(r, 2000));
	   console.log("Wait 2 seconds for Part.");
	}
        // 15 | click | linkText=1232 | 
        await driver.findElement(By.linkText("1232")).click();
   	while ((await driver.findElements(By.linkText("Create Configurations / Constants"))).length == 0)
	{
	   await new Promise(r => setTimeout(r, 2000));
	   console.log("Wait 2 seconds for Create CC.");
	}
        // Create Configurations / Constants | 
        await driver.findElement(By.linkText("Create Configurations / Constants")).click();
//	while ((await driver.findElements(By.id("add_button"))).length == 0)  //stale element v1.7.0
	{
	   await new Promise(r => setTimeout(r, 2000));
//	   console.log("Wait 2 seconds for Add Row.");
	}
        await driver.findElement(By.id("add_button")).click();
        await new Promise(r => setTimeout(r, 2000));
        await driver.findElement(By.id("add_button")).click();
        await new Promise(r => setTimeout(r, 2000));
        await driver.findElement(By.id("add_button")).click();
        await new Promise(r => setTimeout(r, 2000));
        await driver.findElement(By.id("add_button")).click();
        // 23 | type | id=id_config_names-0-name | scon1
       
        // 24 | click | linkText=Add Configurations/Constants | 
        await new Promise(r => setTimeout(r, 2000));

        await driver.findElement(By.id("id_config_names-0-config_type")).sendKeys("Constants"); //dropdown doesn't work here
        await driver.findElement(By.id("id_config_names-1-config_type")).sendKeys("Constants");
        await driver.findElement(By.id("id_config_names-2-config_type")).sendKeys("Configuration");
        await driver.findElement(By.id("id_config_names-3-config_type")).sendKeys("Configuration");
       
        await new Promise(r => setTimeout(r, 2000));
        // 27 | click | id=id_config_names-1-config_type | 
        await driver.findElement(By.id("id_config_names-0-name")).sendKeys("scnst1");
        await driver.findElement(By.id("id_config_names-1-name")).sendKeys("scnst11");
        await driver.findElement(By.id("id_config_names-2-name")).sendKeys("sconf1");
        await driver.findElement(By.id("id_config_names-3-name")).sendKeys("sconf11");

        await new Promise(r => setTimeout(r, 2000));
        // 21 | addSelection | id=id_user_draft | label=admin
        {
            const dropdown = await driver.findElement(By.id("id_user_draft"));
//            await dropdown.findElement(By.xpath("//option[. = 'admin']")).click();
            await dropdown.findElement(By.xpath("//option[. = '" + user + "']")).click();
        }
        await new Promise(r => setTimeout(r, 4000));

        //let encodedString = await driver.takeScreenshot();
        //await fs.writeFileSync('/tests/cscreen.png', encodedString, 'base64');       
        // 30 | click | css=.controls > .btn-primary |
        await driver.findElement(By.css(".controls > .btn-primary")).click();

        // 36 | click | linkText=Edit Configurations / Constants |
   	while ((await driver.findElements(By.linkText("Edit Configurations / Constants"))).length == 0)
	{
	   await new Promise(r => setTimeout(r, 2000));
	   console.log("Wait 2 seconds for Edit CC.");
	}
        await driver.findElement(By.linkText("Edit Configurations / Constants")).click();

        // Causing Stale Element
	//while ((await driver.findElements(By.id("id_config_names-3-name"))).length == 0)
	//{
	//   await new Promise(r => setTimeout(r, 2000));
	//   console.log("Wait 2 seconds for Config Name.");
	//} 
	var bodyText;
	for (var j = 0; j < 5; j++)
	{
	   bodyText = await driver.findElement(By.tagName("Body")).getText();
           if (bodyText.includes("Configurations/Constants"))
	   {
		break;
	   }
	   else
           {
		await new Promise(r => setTimeout(r, 2000));
	        console.log("Wait 2 seconds for Config Name.");
           }     
	}
	
	await new Promise(r => setTimeout(r, 2000));   //waits inbetween these items required to set fields
        await driver.findElement(By.id("id_config_names-3-name")).clear(); 
        await new Promise(r => setTimeout(r, 2000));
        await driver.findElement(By.id("id_config_names-3-name")).sendKeys("sconf12"); //stale element
        await new Promise(r => setTimeout(r, 2000));
        await driver.findElement(By.id("id_config_names-1-name")).clear();
        await new Promise(r => setTimeout(r, 2000));
        await driver.findElement(By.id("id_config_names-1-name")).sendKeys("scnst12");

	await new Promise(r => setTimeout(r, 2000));  
        // 46 | click | css=.controls > .btn-primary | 
let encodedString = await driver.takeScreenshot();
await fs.writeFileSync('/tests/cscreen.png', encodedString, 'base64');   
        await driver.findElement(By.css(".controls > .btn-primary")).click();  //not attached to page
  
   	while ((await driver.findElements(By.linkText("Configurations / Constants"))).length == 0)
	{
	   await new Promise(r => setTimeout(r, 2000));
	   console.log("Wait 2 seconds for Link3.");
	}
	await driver.findElement(By.linkText("Configurations / Constants")).click();

        // Verify Approvers; blank, Reviewers: admin
        await new Promise(r => setTimeout(r, 2000));
        var bodyText = await driver.findElement(By.tagName("Body")).getText();
        assert(bodyText.includes("Approvers:"));        
//        assert(bodyText.includes("Reviewers: admin"));
        assert(bodyText.includes("Reviewers: " + user));
        assert(bodyText.includes("sconf12"));
        assert(bodyText.includes("scnst12"));

       
        // UPDATE CONSTANT & CONFIG DEFAULTS - ISSUE#133
        // Navigate to Assembly Item & Part in Assembly Tree
        await driver.findElement(By.id("navbarTemplates")).click()
        // 4 | click | linkText=Assemblies | 
        await driver.findElement(By.linkText("Assemblies")).click()

   	while ((await driver.findElements(By.linkText("Electrics"))).length == 0)
	{
	   await new Promise(r => setTimeout(r, 2000));
	   console.log("Wait 2 seconds for Electrics.");
	}
        if ((await driver.findElements(By.xpath("//div/div/ul/li[*]/a[text()='Electrics']"))).length != 0) {
            // Expand Revision B and Sewing Template
            var j = 1;
            while (true) {
                if ((await driver.findElement(By.xpath("//div/div/ul/li[" + j + "]/a")).getText()) == "Electrics") {
                    break;
                }
                j++;
            }
        }
        else
            console.log("Constants & Configs failed: Electrics type not found");

        await new Promise(r => setTimeout(r, 4000));
        await driver.findElement(By.xpath("//li[" + j + "]/i")).click();
        await new Promise(r => setTimeout(r, 4000));
        await driver.findElement(By.xpath("//li[" + j + "]/ul/li/i")).click();
        await new Promise(r => setTimeout(r, 6000));
        await driver.findElement(By.xpath("//li[" + j + "]/ul/li/ul/li/i")).click(); 
   	while ((await driver.findElements(By.partialLinkText("sewing"))).length == 0)
	{
	   await new Promise(r => setTimeout(r, 2000));
	   console.log("Wait 2 seconds for Search.");
	}
        await driver.findElement(By.partialLinkText("sewing")).click();
   	while ((await driver.findElements(By.id("action"))).length == 0)
	{
	   await new Promise(r => setTimeout(r, 2000));
	   console.log("Wait 2 seconds for Action.");
	}
        await driver.findElement(By.id("action")).click()
   	while ((await driver.findElements(By.id("add_configdefault_action"))).length == 0)
	{
	   await new Promise(r => setTimeout(r, 2000));
	   console.log("Wait 2 seconds for Add CC Default.");
	}
        await driver.findElement(By.id("add_configdefault_action")).click()
	await new Promise(r => setTimeout(r, 2000));

        // 14 | addSelection | id=id_user_draft | label=admin
        {
            const dropdown = await driver.findElement(By.id("id_user_draft"))
//            await dropdown.findElement(By.xpath("//option[. = 'admin']")).click()
            await dropdown.findElement(By.xpath("//option[. = '" + user + "']")).click();
        }

        // 16 | type | id=id_config_defaults-0-default_value | 1
        await driver.findElement(By.id("id_config_defaults-0-default_value")).sendKeys("1")
        // 17 | click | css=.controls > .btn-primary | 
        await driver.findElement(By.css(".controls > .btn-primary")).click()

	while ((await driver.findElements(By.linkText("Edit Configuration Defaults"))).length == 0)
	{
	   await new Promise(r => setTimeout(r, 2000));
	   console.log("Wait 2 seconds for Edit Defaults.");
	}
        // Edit Defaults Again
        await driver.findElement(By.linkText("Edit Configuration Defaults")).click()
	await new Promise(r => setTimeout(r, 2000));
        await driver.findElement(By.id("id_config_defaults-1-default_value")).sendKeys("12")
        await driver.findElement(By.css(".controls > .btn-primary")).click();

	while ((await driver.findElements(By.css(".collapsed > .fa"))).length == 0)
	{
	   await new Promise(r => setTimeout(r, 2000));
	   console.log("Wait 2 seconds for Link4.");
	}
        await driver.findElement(By.css(".collapsed > .fa")).click()
        // Verify values added
        await new Promise(r => setTimeout(r, 4000));
        var bodyText = await driver.findElement(By.tagName("Body")).getText();
        assert(bodyText.includes("1"));
        assert(bodyText.includes("12"));
 

        // Tests defaults on Inventory Items with multiple assemblies - issue #141
        await driver.findElement(By.linkText("Inventory")).click();
	while ((await driver.findElements(By.linkText("Test"))).length == 0)
	{
	   await new Promise(r => setTimeout(r, 2000));
	   console.log("Wait 2 seconds for Inventory.");
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
            console.log("Constants & Configs failed: Test Location not found");

        await new Promise(r => setTimeout(r, 4000));
        await driver.findElement(By.xpath("//li[" + j + "]/i")).click();
        await new Promise(r => setTimeout(r, 4000));
        await driver.findElement(By.xpath("//li[" + j + "]/ul/li/i")).click();
	while ((await driver.findElements(By.partialLinkText("sewing - 1232"))).length == 0)
	{
	   await new Promise(r => setTimeout(r, 2000));
	   console.log("Wait 2 seconds for Navtree.");
	}
        await driver.findElement(By.partialLinkText("sewing - 1232")).click();
	while ((await driver.findElements(By.id("action"))).length == 0)
	{
	   await new Promise(r => setTimeout(r, 2000));
	   console.log("Wait 2 seconds for Action.");
	}
        await driver.findElement(By.id("action")).click()
	await new Promise(r => setTimeout(r, 2000));
	//let encodedString = await driver.takeScreenshot();
 	//await fs.writeFileSync('/tests/cscreen1.png', encodedString, 'base64');    
        await driver.findElement(By.id("add_constdefault_action")).click()
        await new Promise(r => setTimeout(r, 2000));
        // 36 | addSelection | id=id_user_draft | label=admin
        {
            const dropdown = await driver.findElement(By.id("id_user_draft"))
//            await dropdown.findElement(By.xpath("//option[. = 'admin']")).click()
            await dropdown.findElement(By.xpath("//option[. = '" + user + "']")).click();
        }
        // 38 | type | id=id_constant_defaults-0-default_value | 1
        await driver.findElement(By.id("id_constant_defaults-0-default_value")).sendKeys("657")
        // 39 | click | css=.controls > .btn-primary | 
        await driver.findElement(By.css(".controls > .btn-primary")).click()

   	while ((await driver.findElements(By.id("const_default-template-tab"))).length == 0)
	{
	   await new Promise(r => setTimeout(r, 2000));
	   console.log("Wait 2 seconds for Tab.");
	}
        // 40 | click | id=const_default-template-tab | 
        await driver.findElement(By.id("const_default-template-tab")).click()

        // Edit Defaults Again
   	while ((await driver.findElements(By.linkText("Edit Constant Defaults"))).length == 0)
	{
	   await new Promise(r => setTimeout(r, 2000));
	   console.log("Wait 2 seconds for Edit Defaults.");
	}
        await driver.findElement(By.linkText("Edit Constant Defaults")).click()
   	while ((await driver.findElements(By.id("id_constant_defaults-1-default_value"))).length == 0)
	{
	   await new Promise(r => setTimeout(r, 2000));
	   console.log("Wait 2 seconds for Edit Defaults Value.");
	}
        await driver.findElement(By.id("id_constant_defaults-1-default_value")).click()
        // 43 | type | id=id_constant_defaults-1-default_value | 12
        await driver.findElement(By.id("id_constant_defaults-1-default_value")).sendKeys("983")
        // 44 | click | css=.controls > .btn-primary 
        await driver.findElement(By.css(".controls > .btn-primary")).click()

   	while ((await driver.findElements(By.linkText("Constant Defaults"))).length == 0)
	{
	   await new Promise(r => setTimeout(r, 2000));
	   console.log("Wait 2 seconds for Constant Defaults.");
	}

        await driver.findElement(By.linkText("Constant Defaults")).click()
   	while ((await driver.findElements(By.linkText("Defaults"))).length == 0)
	{
	   await new Promise(r => setTimeout(r, 2000));
	   console.log("Wait 2 seconds for Defaults.");
	}
        await driver.findElement(By.linkText("Defaults")).click();
        // Verify values added
        await new Promise(r => setTimeout(r, 4000));
        var bodyText = await driver.findElement(By.tagName("Body")).getText();
        assert(bodyText.includes("657"));
        assert(bodyText.includes("983"));

        // Test Cal/Const/Config Tab on Inventory Item assigned to a Build - Issue #145
        // Verify the absence of the Calibration Tab, the above tests verifys the presence of the Constants Default Tab
        try {
            await driver.findElement(By.linkText("Configuration History"));
            console.log("Constants Error: Configuration History tab visible when no configs are defined.");
        }
        catch (NoSuchElementException) { } 
       
        //Create Constant Value (on a Deployed Build) and Search for Name, Value, Date, Reviewers, Approval Flag
        await driver.findElement(By.id("action")).click()
        await driver.findElement(By.id("add_const_action")).click()
        await new Promise(r => setTimeout(r, 4000));
        await driver.findElement(By.id("id_deployment")).sendKeys("7 - Test");
        // 9 | addSelection | id=id_user_draft | label=admin
        {
            const dropdown = await driver.findElement(By.id("id_user_draft"))
//            await dropdown.findElement(By.xpath("//option[. = 'admin']")).click()
            await dropdown.findElement(By.xpath("//option[. = '" + user + "']")).click();
        }

        // 13 | click | css=.controls > .btn-primary | 
        await driver.findElement(By.css(".controls > .btn-primary")).click()

   	while ((await driver.findElements(By.linkText("Constant History"))).length == 0)
	{
	   await new Promise(r => setTimeout(r, 2000));
	   console.log("Wait 2 seconds for History.");
	}

        //Verify link name on Constant History tab is not TBD anymore
        await driver.findElement(By.linkText("Constant History")).click();
        try {
            await driver.findElement(By.partialLinkText("TBD"));
            console.log("Constants Error: Configuration History tab link has TBD in name.");
        }
        catch (NoSuchElementException) { }

  
        // 16 | select | id=searchbar-modelselect | label=-- Configs/Constants
        await driver.findElement(By.id("searchbar-modelselect")).sendKeys("-- Configs/Constants");
        // 18 | click | css=.btn-outline-primary:nth-child(1) | 
        await driver.findElement(By.css(".btn-outline-primary:nth-child(1)")).click()
        await new Promise(r => setTimeout(r, 2000));
        // 19 | click | id=field-select_c_r0 |

        // Name
        await driver.findElement(By.id("field-select_c_r0")).click()
        // 20 | select | id=field-select_c_r0 | label=Inventory: Name
        {
            const dropdown = await driver.findElement(By.id("field-select_c_r0"))
            await dropdown.findElement(By.xpath("//option[. = 'Config/Const Name']")).click()
        }
        // 23 | type | id=field-query_c_r0 | scnst
        await driver.findElement(By.id("field-query_c_r0")).sendKeys("scnst1")
        // 24 | click | id=qfield-lookup_c_r0 | 
        {
            const dropdown = await driver.findElement(By.id("qfield-lookup_c_r0"))
            await dropdown.findElement(By.xpath("//option[. = 'Exact']")).click()
        }
        // 27 | click | id=searchform-submit-button | 
        await driver.findElement(By.id("searchform-submit-button")).click()
        await new Promise(r => setTimeout(r, 2000));
        await driver.findElement(By.partialLinkText("1232"));

        // Value
        // 35 | select | id=field-select_c_r0 | label=Value
        {
            const dropdown = await driver.findElement(By.id("field-select_c_r0"))
            await dropdown.findElement(By.xpath("//option[. = 'Value']")).click()
        }
        await driver.findElement(By.id("field-query_c_r0")).clear();
        // 39 | type | id=field-query_c_r0 | 657
        await driver.findElement(By.id("field-query_c_r0")).sendKeys("657")
        // 40 | click | id=searchform-submit-button | 
        await driver.findElement(By.id("searchform-submit-button")).click()
   	while ((await driver.findElements(By.partialLinkText("1232"))).length == 0)
	{
	   await new Promise(r => setTimeout(r, 2000));
	   console.log("Wait 2 seconds for Approved.");
	}
        await driver.findElement(By.partialLinkText("1232"));

        //Approved Flag
        {
            const dropdown = await driver.findElement(By.id("field-select_c_r0"))
            await dropdown.findElement(By.xpath("//option[. = 'Config/Const Event: Approved Flag']")).click()
        }
        await driver.findElement(By.id("field-query_c_r0")).clear();
        // 39 | type | id=field-query_c_r0 | 657
        await driver.findElement(By.id("field-query_c_r0")).sendKeys("False")
        // 40 | click | id=searchform-submit-button | 
        await driver.findElement(By.id("searchform-submit-button")).click()
   	while ((await driver.findElements(By.partialLinkText("1232"))).length == 0)
	{
	   await new Promise(r => setTimeout(r, 2000));
	   console.log("Wait 2 seconds for Approved.");
	}
        await driver.findElement(By.partialLinkText("1232"));

        // Close browser window
        driver.quit();

    }
    catch (e) {
        console.log(e.message, e.stack);
        console.log("Constants and Configs failed.");
        return 1;
    }
    console.log("Constants and Configs completed.");
    return 0;

})();
