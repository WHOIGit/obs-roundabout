rem Runs all Roundabout Selenium Webdriver automated tests in windows cmd prompt. Takes about 11 minutes to run. 
start cmd.exe /k "node AddEditLocations.js > RoundAboutTesting.log & node AddEditParts.js >> RoundAboutTesting.log & node AddEditAssemblies.js >> RoundAboutTesting.log & node AddEditInventory.js >> RoundAboutTesting.log & node AddBuilds.js >> RoundAboutTesting.log & node RetireBuilds.js >> RoundAboutTesting.log & node DeleteAssemblies.js >> RoundAboutTesting.log & node DeleteParts.js >> RoundAboutTesting.log & node DeleteLocations.js >> RoundAboutTesting.log"

