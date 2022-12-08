// JavaScript source code
'use strict';
console.log("Running API Test.");

// Generated by Selenium IDE
const { Builder, By, Key, until, a, WebElement, promise, Capabilities } = require('selenium-webdriver');
const chrome = require('selenium-webdriver/chrome');
const firefox = require('selenium-webdriver/firefox');
const assert = require('assert');
const fs = require('fs');
const { Http2ServerRequest } = require('http2');


var myArgs = process.argv.slice(2);
var rsp;
var json;
var token;


(async function api() {

    let chromeCapabilities = Capabilities.chrome();
    var firefoxOptions = new firefox.Options();


    try {


        // API TEST
        // This test performs API Get Requests on the known data created by all the other Automated Tests.
        // The data returned from the Get Request is checked against the test data that was created.

        // method and body defined, but headers not defined. had to define headers here
        const fetch = require('node-fetch');
        global.fetch = fetch;
        global.headers = fetch.headers;

        const jsdom = require("jsdom");
        const { JSDOM } = jsdom;
        // Required to prevent Error: Cross origin null forbidden thrown by JSDOM
        const { window } = new JSDOM('', {
            url: "http://localhost:8000",
            referrer: "http://localhost:8000",
            contentType: "text/html",
            userAgent: "node.js",
            includeNodeLocations: true
        });

        var $ = require('jquery')(window);
        
        const url = 'http://localhost:8000/api/v1/';

        // Login and get Api Token
        await $.post(url + 'api-token-auth/', { "username": "admin", "password": "admin" }, function (data) {
            token = data.token;
            console.log("Got Token.");
        });

        const header = {
            'Authorization': 'Token '+token,
            'Accept': 'application/json, text/plain',
            'Content-Type': 'application/json;charset=UTF-8'
        }

        // LOCATIONS
        // Get 4 Test Locations and get the 2 children of the Test Location
        // Test API Name filter
        rsp = await fetch(url + 'locations/?name=Test', {
            method: 'GET',
            headers: header,
        });
        json = await rsp.json();
        if (rsp.ok) {
            if (json.length == 4) {
                var j = 0;
                for (var i = 0; i < json.length; i++) {
                    if ((json[i].name.includes("Test")) || (json[i].name.includes("Test1")) ||
                        (json[i].name.includes("Test Child")) || (json[i].name.includes("Test Child1"))) {
                        j++;
                    }
                }
                if (j != json.length) {
                    console.log("API failed: 4 Locations not returned.");
                    console.log(json);
                }
		else
		    console.log("Get Locations.");
            }
            else {
                console.log("API failed: 4 Locations not returned.");
                console.log(json);
            }
        }
        else
            console.log(rsp.statusText, "  ", json);

        // Test API has children filter
        rsp = await fetch(url + 'locations/?has_children=true', {
            method: 'GET',
            headers: header,
        });
        json = await rsp.json();
        if (rsp.ok) {
            for (var i = 0; i < json.length; i++) {
              if ((json[i].children.length != 2) && (json[i].name == 'Test')) { 
                console.log("API failed: 2 Test Child Locations not returned.");
                console.log(json);
              }
          }
        }
        else
            console.log(rsp.statusText, "  ", json);

        // PARTS
        // Get the Coastal Mooring, Surface Buoy, Wifi, Disk Drive and ADCPS-J Part Templates
        // Test API filter by name
        rsp = await fetch(url + 'part-templates/parts/?fields=name', {
            method: 'GET',
            headers: header,
        });
        json = await rsp.json();
        if (rsp.ok) {
            if (json.length == 5) {
                var j = 0;
                for (var i = 0; i < json.length; i++) {
                    if ((json[i].name.includes("Disk Drive")) || (json[i].name.includes("Wifi Template")) ||
                        (json[i].name.includes("Coastal Mooring")) || (json[i].name.includes("Surface Buoy")) ||
                        (json[i].name.includes("ADCPS-J"))) {
                        j++;
                    }
                }
                if (j != json.length) {
                    console.log("API failed: 5 Part Templates not returned.");
                    console.log(json);
                }
            }
            else {
                console.log("API failed: 5 Part Templates not returned.");
                console.log(json);
            }
        }
        else
            console.log(rsp.statusText, "  ", json);

        //Get Part Types - Structural, Computerized
        // Test API Omit keyword, returning just the name
        rsp = await fetch(url + 'part-templates/part-types/?omit=id,url,parent,children,parts', {
            method: 'GET',
            headers: header,
        });
        json = await rsp.json();
        if (rsp.ok) {
            if (json.length > 0) {
                var j = 0;
                for (var i = 0; i < json.length; i++) {
                    if ((json[i].name.includes("Structural")) || (json[i].name.includes("Computerized"))) {
                        j++;
                    }
                }
                if (j != 2) {
                    console.log("API failed: 2 Part Types not returned.");
                    console.log(json);
                }
		else
		    console.log("Get Parts.");
            }
            else {
                console.log("API failed: 2 Part Types not returned.");
                console.log(json);
            }
        }
        else
            console.log(rsp.statusText, "  ", json);

        // ASSEMBLIES
        // Get the 3 Assembly Parts under the Salty Reef Assembly
        // Test API Expand key word 
        rsp = await fetch(url + 'assembly-templates/assemblies/?name=Salty Reef&expand=assembly_revisions&fields=assembly_revisions.assembly_parts', {
            method: 'GET',
            headers: header,
        });
        json = await rsp.json();
        if (rsp.ok) {
            if (json.length > 0) {
                var j = 0;
                for (var i = 0; i < json[0].assembly_revisions.length; i++) {
                    if (json[0].assembly_revisions[i].assembly_parts.length == 3) {
                        j++;
                    }
                }
                if (j != 1) {
                    console.log("API failed: 3 Assembly Parts not returned.");
                    console.log(json);
                }
		else
		    console.log("Get Assemblies.");
            }
            else {
                console.log("API failed: 3 Assembly Parts not returned.");
                console.log(json);
            }
        }
        else
            console.log(rsp.statusText, "  ", json);


        // INVENTORY
        // Get all Inventory items that are the root of an assembly
        rsp = await fetch(url + 'inventory/?is_root=true&has_children=true', {
            method: 'GET',
            headers: header,
        });
        json = await rsp.json();
        if (rsp.ok) {
            if (json.length > 0) {
                // Verify serial number
                if (json[0].serial_number == '1232-20001') {
                    var childurl = json[0].children[0];   //json first index zero, 1 item returned, is this an issue?
                    // Get child and verify serial number
                    rsp = await fetch(childurl, {
                        method: 'GET',
                        headers: header,
                    });
                    json = await rsp.json();
                    if (rsp.ok) {
                        if (json.serial_number == '555-456-789-20001') {
                            // Get child and verify serial number
                            var childurl = json.children[0];   //no json first index
                            // Get child and verify serial number
                            rsp = await fetch(childurl, {
                                method: 'GET',
                                headers: header,
                            });
                            json = await rsp.json();
                            if (rsp.ok) {
                                if (json.serial_number != '3604-00131-00001-20004') {
                                    console.log("API failed: Inventory has wrong serial number.");
                                    console.log(json);
                                }
				else
		                    console.log("Get Inventory.");
                            }
                            else {
                                console.log("API failed: Inventory child not returned.");
                                console.log(json);
                            }
                        }
                        else {
                            console.log("API failed: Inventory has wrong serial number.");
                            console.log(json);
                        }
                    }
                    else {
                        console.log("API failed: Inventory Child not returned.");
                        console.log(json);
                    }
                }
                else {
                    console.log("API failed: Inventory has wrong serial number.");
                    console.log(json);
                }
            }
            else {
                    console.log("API failed: Inventory Items not returned.");
                    console.log(json);
                }
        }
        else
            console.log(rsp.statusText, "  ", json);

        // BUILDS
        // Get Deployments
        rsp = await fetch(url + 'deployments', {
            method: 'GET',
            headers: header,
        });
        json = await rsp.json();
        if (rsp.ok) {
            if (json.length > 0) {
                if (json[0].deployment_number != 7) {
                    console.log("API failed: Deployment Number is not 7.");
                    console.log(json);
                }
		else
		    console.log("Get Deployments.");
            }
            else {
                console.log("API failed: Deployment not returned.");
                console.log(json);
            }
        }
        else
            console.log(rsp.statusText, "  ", json);

        // CRUISES
        // There are 11 pages of cruises, get the header link field and verify 10 pages returned
        var link = ' ';
        rsp = await fetch(url + 'cruises', {
            method: 'GET',
            headers: header,
        });
        json = await rsp.json();
        if (rsp.ok) {
           for (let [key, value] of rsp.headers) {
                if (key == 'link') {
                    link = value;
                }
            }        

            if (link.includes("page=11")) {
                // Get the last Cruise Page
                rsp = await fetch(url + 'cruises/?page=10', {
                    method: 'GET',
                    headers: header,
                });
                json = await rsp.json();
                if (rsp.ok) {
                    if (json.length == 0) {
                        console.log("API failed: Cruise Page 11 data not returned.");
                        console.log(json);
                    }
		    else
		        console.log("Get Cruises.");
                }
                else {
                    console.log(rsp.statusText, "  ", json);
                }
            }
            else {
                console.log("API failed: 11 Cruise Pages not returned.");
                console.log(json);
            }
        }
        else
            console.log(rsp.statusText, "  ", json);

        // CUSTOM FIELDS
        // Get Custom Field "Condition" defined for 5 Inventory Items
        rsp = await fetch(url + 'inventory/?field_name=Condition', {
            method: 'GET',
            headers: header,
        });
        json = await rsp.json();
        if (rsp.ok) {
            if (json.length != 5) { 
                console.log("API failed: 5 Inventory Items with Condition Custom Field not returned.");
                console.log(json);
            }
	    else
		console.log("Get Custom Fields.");
        }
        else
            console.log(rsp.statusText, "  ", json);


        // CONSTANTS & CONFIGS
        rsp = await fetch(url + 'configs-constants/config-names', {
            method: 'GET',
            headers: header,
        });
        json = await rsp.json();
        if (rsp.ok) {
            if (json.length != 4) {
                console.log("API failed: 4 Configs/Constants not returned.");
                console.log(json);
            }
	    else
		console.log("Get Configs/Constants.");
        }
        else
            console.log(rsp.statusText, "  ", json);


        // CALIBRATIONS - some parts are null - is this a bug
        rsp = await fetch(url + 'calibrations/coefficent-names/', {
            method: 'GET',
            headers: header,
        });
        json = await rsp.json();
        if (rsp.ok) {
            if (json.length != 6) {
                console.log("API failed: 6 Calibrations/Coefficents not returned.");
                console.log(json);
            }
	    else
		console.log("Get Calibrations/Coefficents.");
        }
        else
            console.log(rsp.statusText, "  ", json);


        // STRESS TEST - run GETS in a loop
	// User “throttling” enabled on the API. So a single user can only make 1000 number of requests in a 24 hour period.
	// This is working - comment out - there is no need to run this every time.
/*        var start = new Date().getTime();
        for (var i = 0; i < 1000; i++) {
            rsp = await fetch(url + 'vessels/', {
                method: 'GET',
                headers: header,
            });
            json = await rsp.json();
            if (rsp.ok) {
                if (json.length == 0) {
                    console.log("API failed: Vessels not returned.");
                    console.log(json);
                }
                else {
                    if (i % 100 == 0)
                        console.log("Vessel Get Request: ", i)
                }
            }
            else
                console.log(rsp.statusText, "  ", json);
        }
        var end = new Date().getTime();
        console.log("Time to fetch 1000 items in minutes:", (end - start)/60000);
*/

 
    }
    catch (e) {
        console.log(e.message, e.stack);
        console.log("API failed.");
        return Promise.resolve(1);
    }
    console.log("API completed.");
    return Promise.resolve(0);

})();
