// JavaScript source code
'use strict';
console.log("Running Add & Edit Assemblies Test.");

// Generated by Selenium IDE
const { Builder, By, Key, until, a, WebElement, promise, Capabilities } = require('selenium-webdriver');
const chrome = require('selenium-webdriver/chrome');
const firefox = require('selenium-webdriver/firefox');
const assert = require('assert');
const { exception } = require('console');
const fs = require('fs');

var driver;
var myArgs = process.argv.slice(2);
var user;
var password;

(async function addAssemblies() {

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

        // ADD ASSEMBLIES TEST

        // 10 | click | id=navbarAdminTools |
        await driver.findElement(By.id("navbarAdmintools")).click();
        // 11 | click | linkText=Locations | 
        await driver.findElement(By.linkText("Edit Assembly Types")).click();
        // 5 | click | linkText=Test | 

        // Add Computerized Assembly Type
        // 5 | click | linkText=Add Assembly Type | 
        await driver.findElement(By.linkText("Add Assembly Type")).click();
        // 7 | type | id=id_name | Electric
        await driver.findElement(By.id("id_name")).sendKeys("Electric");
        // 8 | click | css=.btn-primary | 
        await driver.findElement(By.css(".btn-primary")).click();

        // 10 | click | id=navbarTemplates |
        await new Promise(r => setTimeout(r, 6000));
        await driver.findElement(By.id("navbarTemplates")).click();

        // Add template with non null name and type
        // 5 | click | linkText=Assemblies |       
        await driver.findElement(By.linkText("Assemblies")).click();
        // 10 | click | linkText=Create New Assembly | 
        while ((await driver.findElements(By.linkText("Create New Assembly"))).length == 0) 
        {
            await new Promise(r => setTimeout(r, 2000));
            console.log("Wait 2 seconds for New Assembly1.");
        }
        await driver.wait(until.elementLocated(By.linkText("Create New Assembly")));
        await driver.findElement(By.linkText("Create New Assembly")).click();
        // 11 | type | id=id_name | Test Assembly
        await driver.wait(until.elementLocated(By.id("id_name")));
        await driver.findElement(By.id("id_name")).sendKeys("Test Assembly");
        // 12 | select | id=id_assembly_type | label=Electric
        {
            const dropdown = await driver.findElement(By.id("id_assembly_type"));
            await dropdown.findElement(By.xpath("//option[. = 'Electric']")).click();
        }
        // 13 | type | id=id_assembly_number | 123-001
        await driver.findElement(By.id("id_assembly_number")).sendKeys("123-001");

        await driver.switchTo().frame(0);       //required for the note found
        await driver.wait(until.elementLocated(By.css(".note-editable > p")));
        // 43 | click | css=.note-editable > p | 
        await driver.findElement(By.css(".note-editable > p")).click();
        // 44 | EditContent | css=.note-editable | This is a copy test assembly.
        {
            const element = await driver.findElement(By.css(".note-editable"));
            await driver.executeScript("if(arguments[0].contentEditable === 'true') {arguments[0].innerText = 'This is a copy test assembly.'}", element);
        }
        // 45 | selectFrame | relative=parent | 
        await driver.switchTo().defaultContent();
        // 17 | click | css=.controls > .btn | 
        await driver.findElement(By.css(".controls > .btn")).click();
        while ((await driver.findElements(By.linkText("Test Assembly"))).length == 0) 
        {
            await new Promise(r => setTimeout(r, 2000));
            console.log("Wait 2 seconds for New Assembly2.");
        }
        // Check if Test Assembly added
        await driver.findElement(By.linkText("Test Assembly"));

        //  Add template with null type
        // 19 | click | linkText=Create New Assembly |
        await driver.findElement(By.linkText("Create New Assembly")).click();
        // 20 | type | id=id_name | Test Assembly 2
        while ((await driver.findElements(By.id("id_name"))).length == 0) 
        {
            await new Promise(r => setTimeout(r, 2000));
            console.log("Wait 2 seconds for New Assembly2.");
        }
        await driver.findElement(By.id("id_name")).sendKeys("Test Assembly 2");
        // 21 | click | css=.controls > .btn | 
        await driver.findElement(By.css(".controls > .btn")).click();
        //await new Promise(r => setTimeout(r, 2000));
        while ((await driver.findElements(By.css("#div_id_assembly_type .ajax-error"))).length == 0) 
        {
            await new Promise(r => setTimeout(r, 2000));
            console.log("Wait 2 seconds for New Assembly Ajax Error.");
        }

        // 22 | verifyText | css=#div_id_assembly_type .ajax-error | This field is required.
        // Checks Test Assembly 2 with null type not added - Add Assembly button present
        assert(await driver.findElement(By.css("#div_id_assembly_type .ajax-error")).getText() == "This field is required.");
        // 25 | select | id=id_assembly_type | label=Electric
        {
            const dropdown = await driver.findElement(By.id("id_assembly_type"));
            await dropdown.findElement(By.xpath("//option[. = 'Electric']")).click();
        }
        // 26 | type | id=id_assembly_number | 123-002
        await driver.findElement(By.id("id_assembly_number")).sendKeys("123-002");
        // 27 | click | css=.controls > .btn | 
        await driver.findElement(By.css(".controls > .btn")).click();
        while ((await driver.findElements(By.linkText("Test Assembly 2"))).length == 0) 
        {
            await new Promise(r => setTimeout(r, 2000));
            console.log("Wait 2 seconds for New Assembly3.");
        }
        // Verify Test Assembly 2 added
        await driver.findElement(By.linkText("Test Assembly 2"));

        // Add template with null name
        // 29 | click | linkText=Create New Assembly |
        await new Promise(r => setTimeout(r, 2000));
        await driver.findElement(By.linkText("Create New Assembly")).click();
        while ((await driver.findElements(By.id("id_assembly_type"))).length == 0) 
        {
            await new Promise(r => setTimeout(r, 2000));
            console.log("Wait 2 seconds for New Assembly4.");
        }
        // 30 | select | id=id_assembly_type | label=Electric
        {
            const dropdown = await driver.findElement(By.id("id_assembly_type"));
            await dropdown.findElement(By.xpath("//option[. = 'Electric']")).click();
        }
        // 31 | click | css=.controls > .btn | 
        await driver.findElement(By.css(".controls > .btn")).click();
        await new Promise(r => setTimeout(r, 2000));

        // 32 | verifyText | css=#div_id_name .ajax-error | This field is required.
        // Checks null name not added - Add Assembly button present
        await new Promise(r => setTimeout(r, 2000));
        assert(await driver.findElement(By.css("#div_id_name .ajax-error")).getText() == "This field is required.");

        while ((await driver.findElements(By.linkText("Test Assembly"))).length == 0) 
        {
            await new Promise(r => setTimeout(r, 2000));
            console.log("Wait 2 seconds for Copy Assembly.");
        }
        // 35 | click | linkText=Test Assembly | 
        await driver.findElement(By.linkText("Test Assembly")).click();
        while ((await driver.findElements(By.id("action"))).length == 0) {
            await new Promise(r => setTimeout(r, 2000));
            console.log("Wait 2 seconds for Action.");
        }
        await driver.findElement(By.id("action")).click();
        await driver.wait(until.elementLocated(By.linkText("Copy Assembly Template")));
        await driver.findElement(By.linkText("Copy Assembly Template")).click();
        // 38 | type | id=id_name | Test Assembly 3
        while ((await driver.findElements(By.id("id_name"))).length == 0) {
            await new Promise(r => setTimeout(r, 2000));
            console.log("Wait 2 seconds for Name.");
        }
        await driver.findElement(By.id("id_name")).sendKeys("Test Assembly 3");
        // 39 | select | id=id_assembly_type | label=Electric
        {
            const dropdown = await driver.findElement(By.id("id_assembly_type"));
            await dropdown.findElement(By.xpath("//option[. = 'Electric']")).click();
        }
        // 40 | type | id=id_assembly_number |  
        await driver.findElement(By.id("id_assembly_number")).sendKeys(" ");
        // 41 | type | id=id_assembly_number | 123-003
        await driver.findElement(By.id("id_assembly_number")).sendKeys("123-003");
        // 42 | selectFrame | index=0 | 
        await driver.switchTo().frame(0);
        // 43 | click | css=.note-editable > p | 
        await driver.findElement(By.css(".note-editable > p")).click();
        // 44 | EditContent | css=.note-editable | This is a copy test assembly.
        {
            const element = await driver.findElement(By.css(".note-editable"));
            await driver.executeScript("if(arguments[0].contentEditable === 'true') {arguments[0].innerText = 'This is a copy test assembly.'}", element);
        }
        // 45 | selectFrame | relative=parent | 
        await driver.switchTo().defaultContent();
        // 46 | click | css=.controls > .btn | 
        await driver.findElement(By.css(".controls > .btn")).click();
        while ((await driver.findElements(By.linkText("Test Assembly 3"))).length == 0) 
        {
            await new Promise(r => setTimeout(r, 2000));
            console.log("Wait 2 seconds for New Assembly4.");
        }

        // Check Test Assembly 3 Added
        await driver.findElement(By.linkText("Test Assembly 3"));

        // Copy template with null name or type
        // 48 | click | id=action | 
        await new Promise(r => setTimeout(r, 2000));
        await driver.findElement(By.id("action")).click();
        // 49 | click | linkText=Copy Assembly Template | 
        await driver.findElement(By.linkText("Copy Assembly Template")).click();
        // 50 | type | id=id_name | copy
        while ((await driver.findElements(By.id("id_name"))).length == 0) 
        {
            await new Promise(r => setTimeout(r, 2000));
            console.log("Wait 2 seconds for Copy Template2.");
        }
        await driver.findElement(By.id("id_name")).sendKeys("copy");
        // 51 | click | css=.controls > .btn | 
        await driver.findElement(By.css(".controls > .btn")).click();
        await new Promise(r => setTimeout(r, 2000));

        // 52 | verifyText | css=#div_id_assembly_type .ajax-error | This field is required.
        await new Promise(r => setTimeout(r, 2000));
        assert(await driver.findElement(By.css("#div_id_assembly_type .ajax-error")).getText() == "This field is required.");

        // 53 | click | linkText=Test Assembly 3 | 

        while ((await driver.findElements(By.linkText("Test Assembly 3"))).length == 0) 
        {
            await new Promise(r => setTimeout(r, 2000));
            console.log("Wait 2 seconds for Copy Assembly3.");
        }
        await driver.findElement(By.linkText("Test Assembly 3")).click();
        // 54 | click | id=action | 
        while ((await driver.findElements(By.id("action"))).length == 0) {
            await new Promise(r => setTimeout(r, 2000));
            console.log("Wait 2 seconds for Create Revision3.");
        }
        await driver.findElement(By.id("action")).click();
        // 55 | click | linkText=Copy Assembly Template | 
        await new Promise(r => setTimeout(r, 2000));
        await driver.findElement(By.linkText("Copy Assembly Template")).click();
        while ((await driver.findElements(By.id("id_assembly_type"))).length == 0) {
            await new Promise(r => setTimeout(r, 2000));
            console.log("Wait 2 seconds for Assembly Type.");
        }
        // 56 | select | id=id_assembly_type | label=Electric
        {
            const dropdown = await driver.findElement(By.id("id_assembly_type"));
            await dropdown.findElement(By.xpath("//option[. = 'Electric']")).click();
        }
        // 57 | click | css=.controls > .btn | 
        await driver.findElement(By.css(".controls > .btn")).click();
        // Verify assembly name required error
        while ((await driver.findElements(By.css("#div_id_name .ajax-error"))).length == 0) 
        {
            await new Promise(r => setTimeout(r, 2000));
            console.log("Wait 2 seconds for Ajax Error.");
        }
        assert(await driver.findElement(By.css("#div_id_name .ajax-error")).getText() == "This field is required.");

        // EDIT ASSEMBLIES TEST

        // Create a New Assembly Template
        await driver.findElement(By.id("navbarTemplates")).click();
        // 4 | click | linkText=Assemblies | 
        await new Promise(r => setTimeout(r, 2000));
        await driver.findElement(By.linkText("Assemblies")).click();
        // 5 | click | linkText=Create New Assembly | 
        while ((await driver.findElements(By.linkText("Create New Assembly"))).length == 0) 
        {
            await new Promise(r => setTimeout(r, 2000));
            console.log("Wait 2 seconds for Create New Assembly5.");
        }
        await driver.findElement(By.linkText("Create New Assembly")).click();
        // 6 | type | id=id_name | Test Glider 1
        await driver.wait(until.elementLocated(By.id("id_name")));
        await driver.findElement(By.id("id_name")).sendKeys("Singer");
        // 7 | select | id=id_assembly_type | label=Glider
        {
            const dropdown = await driver.findElement(By.id("id_assembly_type"));
            await dropdown.findElement(By.xpath("//option[. = 'Electric']")).click();
        }
        // 8 | type | id=id_assembly_number | 000-654-987
        await driver.findElement(By.id("id_assembly_number")).sendKeys("000-654-987");
        // 9 | click | css=.controls > .btn | 
        await driver.findElement(By.css(".controls > .btn")).click();

        // Create a Revision of an Assembly Template
        // 10 | click | id=action | 
        while ((await driver.findElements(By.id("action"))).length == 0) {
            await new Promise(r => setTimeout(r, 2000));
            console.log("Wait 2 seconds for Create Revision4.");
        }
        await driver.findElement(By.id("action")).click();
        // 11 | click | linkText=Create New Revision | 
        await new Promise(r => setTimeout(r, 2000));
        await driver.findElement(By.linkText("Create New Revision")).click();
        // 12 | click | css=.controls > .btn | 
        while ((await driver.findElements(By.id("id_revision_code"))).length == 0) {
            await new Promise(r => setTimeout(r, 2000));
            console.log("Wait 2 seconds for Revision.");
        }
        // 13 | type | id=id_revision_code | B
        await driver.findElement(By.id("id_revision_code")).sendKeys("B");
        // 14 | click | css=.controls > .btn | 
        await driver.findElement(By.css(".controls > .btn")).click();

        // Add top level part with non null part type and part template
        // 15 | click | id=action | 
        while ((await driver.findElements(By.id("action"))).length == 0) {
            await new Promise(r => setTimeout(r, 2000));
            console.log("Wait 2 seconds for Add Top Level Part.");
        }
        await driver.findElement(By.id("action")).click();
        // 16 | click | linkText=Add Top Level Part | 
        await driver.findElement(By.linkText("Add Top Level Part")).click();
        // 18 | click | css=.controls > .btn-primary | 
        while ((await driver.findElements(By.css(".controls > .btn-primary"))).length == 0) 
        {
            await new Promise(r => setTimeout(r, 2000));
            console.log("Wait 2 seconds for Create Revision4.");
        }
        await driver.findElement(By.css(".controls > .btn-primary")).click();
        await new Promise(r => setTimeout(r, 2000));
        // 19 | select | id=id_part_type | label=-- Cable
        {
            const dropdown = await driver.findElement(By.id("id_part_type"));
            await dropdown.findElement(By.xpath("//option[. = '-- Sewing Machine']")).click();
        }

        // 21 | click | css=.controls > .btn-primary | 
        await driver.findElement(By.css(".controls > .btn-primary")).click();
        await new Promise(r => setTimeout(r, 4000));

        // 22 | verifyText | css=#div_id_part .ajax-error | Please select an item in the list.
        // Add top level part with null part type
        assert(await driver.findElement(By.css("#div_id_part .ajax-error")).getText() == "This field is required.");
        // 23 | click | id=div_id_parent | 
        await driver.findElement(By.id("div_id_parent")).click();
        // 24 | select | id=id_part | label=Sewing Template
        // Now specify non null part type
        {
            const dropdown = await driver.findElement(By.id("id_part"));
            await dropdown.findElement(By.xpath("//option[. = 'Sewing Template']")).click();
        }

        // 26 | click | css=.controls > .btn-primary | 
        await driver.findElement(By.css(".controls > .btn-primary")).click();
        while ((await driver.findElements(By.id("action"))).length == 0) {
            await new Promise(r => setTimeout(r, 2000));
            console.log("Wait 2 seconds for Add SubAssembly.");
        }
        // Add sub assembly part with non null selection
        // 27 | click | id=action |   
        await driver.findElement(By.id("action")).click();
        // 28 | click | linkText=Add New Sub-Assembly | 
        await new Promise(r => setTimeout(r, 2000));
        await driver.findElement(By.linkText("Add New Sub-Assembly")).click();
        while ((await driver.findElements(By.css(".controls > .btn-primary"))).length == 0) {
            await new Promise(r => setTimeout(r, 2000));
            console.log("Wait 2 seconds for Add New Sub-Assembly.");
        }
        await driver.findElement(By.css(".controls > .btn-primary")).click();
        while ((await driver.findElements(By.css("#div_id_part .ajax-error"))).length == 0) {
            await new Promise(r => setTimeout(r, 2000));
            console.log("Wait 2 seconds for Ajax Error.");
        }
        // Add sub assembly part with null selection part type
        assert(await driver.findElement(By.css("#div_id_part .ajax-error")).getText() == "This field is required.");

        // 30 | click | id=id_part_type | 
        await driver.findElement(By.id("id_part_type")).click();
        // 31 | select | id=id_part_type | label=-- Sewing Machine
        {
            const dropdown = await driver.findElement(By.id("id_part_type"));
            await dropdown.findElement(By.xpath("//option[. = '-- Sewing Machine']")).click();
        }

        await driver.findElement(By.css(".controls > .btn-primary")).click();
        while ((await driver.findElements(By.css("#div_id_part .ajax-error"))).length == 0) {
            await new Promise(r => setTimeout(r, 2000));
            console.log("Wait 2 seconds for Ajax Error.");
        }
        // Add sub assembly part with null selection part template
        assert(await driver.findElement(By.css("#div_id_part .ajax-error")).getText() == "This field is required.");

        // 34 | click | id=id_part | 
        await new Promise(r => setTimeout(r, 2000));
        await driver.findElement(By.id("id_part")).click();
        // 35 | select | id=id_part | label=Wheel Template
        {
            const dropdown = await driver.findElement(By.id("id_part"));
            await dropdown.findElement(By.xpath("//option[. = 'Wheel Template']")).click();
        }
        await new Promise(r => setTimeout(r, 2000));
        await driver.findElement(By.css(".controls > .btn-primary")).click();
        while ((await driver.findElements(By.linkText("Sewing Template"))).length == 0) // displayed after above command completes
        {
            await new Promise(r => setTimeout(r, 2000));
            console.log("Wait 2 seconds for Add Wheel Subassembly.");
        }

        if ((await driver.findElements(By.xpath("//div/div/ul/li[*]/a[text()='Electric']"))).length != 0) {
            // Expand Revision B and Sewing Template
            var j = 1;
            while (true) {
                if ((await driver.findElement(By.xpath("//div/div/ul/li[" + j + "]/a")).getText()) == "Electric") {
                    break;
                }
                j++;
            }
        }
        else
            console.log("Edit Assemblies failed: Electric type not found");

        await new Promise(r => setTimeout(r, 8000));
        await driver.findElement(By.xpath("//li[" + j + "]/ul/li/ul/li/i")).click();
        while ((await driver.findElements(By.linkText("sewing"))).length == 0) 
        {
            await new Promise(r => setTimeout(r, 2000));
            console.log("Wait 2 seconds for Expand Navtree.");
        }
        await driver.findElement(By.xpath("//li[" + j + "]/ul/li/ul/li/ul/li/i")).click();

        // Add Pin sub assembly part
        // 27 | click | id=action | 
        await new Promise(r => setTimeout(r, 2000));
        await driver.findElement(By.linkText("wheel"));
        await new Promise(r => setTimeout(r, 2000));
        await driver.findElement(By.id("action")).click();
        // 28 | click | linkText=Add New Sub-Assembly | 
        while ((await driver.findElements(By.linkText("Add New Sub-Assembly"))).length == 0) {
            await new Promise(r => setTimeout(r, 2000));
            console.log("Wait 2 seconds for Add SubAssembly2.");
        }
        await driver.findElement(By.linkText("Add New Sub-Assembly")).click();
        await new Promise(r => setTimeout(r, 4000));
        await driver.findElement(By.css(".controls > .btn-primary")).click();
        while ((await driver.findElements(By.id("id_part_type"))).length == 0) 
        {
            await new Promise(r => setTimeout(r, 2000));
            console.log("Wait 2 seconds for Add SubAssembly3.");
        }

        await driver.findElement(By.id("id_part_type")).click();
        // 31 | select | id=id_part_type | label=-- Sewing Machine
        {
            const dropdown = await driver.findElement(By.id("id_part_type"));
            await dropdown.findElement(By.xpath("//option[. = '-- Sewing Machine']")).click();
        }
        await driver.findElement(By.id("id_part")).click();
        // 35 | select | id=id_part | label=Wheel Template
        {
            const dropdown = await driver.findElement(By.id("id_part"));
            await new Promise(r => setTimeout(r, 4000));  //1.6 stale element, element not set
            await dropdown.findElement(By.xpath("//option[. = 'Pin Template']")).click();
        }
        await driver.findElement(By.css(".controls > .btn-primary")).click();

        // Verify Top Level Part and Sub Assembly created in tree
        while ((await driver.findElements(By.linkText("pin"))).length == 0) {
            await new Promise(r => setTimeout(r, 2000));
            console.log("Wait 2 seconds for Add SubAssembly4.");
        }
        await driver.findElement(By.linkText("sewing"));
        await driver.findElement(By.linkText("wheel"));
        await driver.findElement(By.linkText("pin"));

        // Add Reference Designator to Sewing Template Assembly
        await driver.findElement(By.linkText("sewing")).click();
        while ((await driver.findElements(By.linkText("1232"))).length == 0) {
            await new Promise(r => setTimeout(r, 2000));
            console.log("Wait 2 seconds for Page Load.");
        }
        await driver.findElement(By.id("action")).click();
        while ((await driver.findElements(By.linkText("Add Reference Designator"))).length == 0) {
            await new Promise(r => setTimeout(r, 2000));
            console.log("Wait 2 seconds for Add Reference Designator Menu Item.");
        }
        await driver.findElement(By.linkText("Add Reference Designator")).click();
        await new Promise(r => setTimeout(r, 2000));

        await driver.findElement(By.xpath("//option[contains(.,'admin')]")).click();
        await driver.findElement(By.id("id_refdes_name")).sendKeys("GA01SUMO-RII11-02-CTDMOQ011");
        await driver.findElement(By.id("id_toc_l1")).sendKeys("alpha");
        await driver.findElement(By.id("id_toc_l2")).sendKeys("beta");
        await driver.findElement(By.id("id_toc_l3")).sendKeys("gamma");
        await driver.findElement(By.id("id_instrument")).sendKeys("Buoy");
        await driver.findElement(By.id("id_manufacturer")).sendKeys("Floaty");
        await driver.findElement(By.id("id_model")).sendKeys("Sleek");
        await driver.findElement(By.id("id_min_depth")).sendKeys("0.00");
        await driver.findElement(By.id("id_max_depth")).sendKeys("100.00");
        await driver.findElement(By.css(".controls > .btn-primary")).click();

        //Verify Reference Designator Added
        while ((await driver.findElements(By.css("#reference_designator-template .collapsed:nth-child(1)"))).length == 0) {
            await new Promise(r => setTimeout(r, 2000));
            console.log("Wait 2 seconds for Ref Designator Link.");
        }
        // Click on Ref Designator Link and Verify our Ref Des is created
        await driver.findElement(By.css("#reference_designator-template .collapsed:nth-child(1)")).click();
        await new Promise(r => setTimeout(r, 2000));
        await driver.findElement(By.linkText("GA01SUMO-RII11-02-CTDMOQ011")).click();

        // Close browser window
        driver.quit();

    }
    catch (e) {
        console.log(e.message, e.stack);
        console.log("Add Edit Assemblies failed.");
        return 1;
    }

    console.log("Add Edit Assemblies completed.")
    return 0;

})();
