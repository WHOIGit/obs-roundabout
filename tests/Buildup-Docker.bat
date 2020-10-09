#!/bin/bash

set -e

# Runs all Roundabout Selenium Webdriver automated tests in linux Docker container to build up the test database.

val=$(node AddEditLocations.js chrome headless)
echo $val 
if [[ "$val" == *"failed."* ]]; then
  exit 1
fi

val=$(node AddEditParts.js chrome headless )
echo $val
if [[ "$val" == *"failed."* ]]; then
  exit 1
fi

val=$(node AddEditAssemblies.js chrome headless )
echo $val
if [[ "$val" == *"failed."* ]]; then
  exit 1
fi

val=$(node AddEditInventory.js chrome headless )
echo $val
if [[ "$val" == *"failed."* ]]; then
  exit 1
fi

val=$(node ImportExportInventory.js chrome headless )
echo $val
if [[ "$val" == *"failed."* ]]; then
  exit 1
fi

val=$(node ExportCustomFields.js chrome headless )
echo $val
if [[ "$val" == *"failed."* ]]; then
  exit 1
fi

val=$(node AddBuilds.js chrome headless )
echo $val
if [[ "$val" == *"failed."* ]]; then
  exit 1
fi


exit 0