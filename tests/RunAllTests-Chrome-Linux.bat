#!/bin/bash

set -e

# Runs all Roundabout Selenium Webdriver automated tests in linux Docker container. Takes about 14 minutes to run.
echo Running Chrome Tests

val=$(node AddEditLocations.js chrome headless admin)
echo $val 
if [[ "$val" == *"failed."* ]]; then
  exit 1
fi

val=$(node AddEditParts.js chrome headless admin)
echo $val
if [[ "$val" == *"failed."* ]]; then
  exit 1
fi

val=$(node AddEditAssemblies.js chrome headless admin)
echo $val
if [[ "$val" == *"failed."* ]]; then
  exit 1
fi

val=$(node AddEditInventory.js chrome headless admin)
echo $val
if [[ "$val" == *"failed."* ]]; then
  exit 1
fi

val=$(node ImportExportInventory.js chrome headless admin)
echo $val
if [[ "$val" == *"failed."* ]]; then
  exit 1
fi

val=$(node ExportCustomFields.js chrome headless admin)
echo $val
if [[ "$val" == *"failed."* ]]; then
  exit 1
fi

val=$(node AddBuilds.js chrome headless admin)
echo $val
if [[ "$val" == *"failed."* ]]; then
  exit 1
fi

val=$(node ConstantsConfigs.js chrome headless admin )
echo $val
if [[ "$val" == *"failed."* ]]; then
  exit 1
fi

val=$(node RetireBuilds.js chrome headless admin)
echo $val
if [[ "$val" == *"failed."* ]]; then
  exit 1
fi

val=$(node DeleteAssemblies.js chrome headless admin)
echo $val
if [[ "$val" == *"failed."* ]]; then
  exit 1
fi

val=$(node DeleteParts.js chrome headless admin)
echo $val
if [[ "$val" == *"failed."* ]]; then
  exit 1
fi

val=$(node DeleteLocations.js chrome headless admin)
echo $val
if [[ "$val" == *"failed."* ]]; then
  exit 1
fi

exit 0