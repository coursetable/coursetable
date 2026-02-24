# Locations

<!-- This section outlines the process for retrieving a Yale building's coordinates and adding it to the coordinate JSON file -->

## Part 1: Getting a Location's Coordinates

Given:

1. `building_code` (eg. ABC): the Yale building code for your new location
2. `building_name` (eg. Advanced Biosciences Center): the name of your new location

Steps:

1. Search for `building_name` on [Google Maps](https://www.google.com/maps), preferably on a desktop
2. On the displayed map, hover over the red pin of the location, and right-click
3. A coordinate (eg. `41.25689..., -72.98969...`) will show. Click this to copy to clipboard
4. The first number (eg. `41.25689...`) is the location's `latitude`
5. The second number (eg. `-72.98969...)` is the location's `longitude`

## Part 2: Adding a Location to the JSON File

Given:

1. `building_code` [*type: String*] (eg. ABC): the Yale building code for your new location.
2. `building_name` [*type: String*] (eg. Advanced Biosciences Center): the name of your new location
3. `latitude` [*type: float*] (eg. 41.25689) of the location from Part 1
4. `longitude` [*type: float*] (eg. -72.98969) of the location from Part 1

Steps:

1. Open [`coursetable/frontend/src/data/buildingCoordinates.json`](https://github.com/coursetable/coursetable/blob/master/frontend/src/data/buildingCoordinates.json) in an editor
2. Before the last `}`, insert
   ```json
   "building_code": {
       "lat": latitude,
       "lng": longitude,
       "name": "building_name"
     }
   ```
   replacing `"building_code"`, `latitude`, `longitude`, and `"building_name"` with the valid strings and floats
3. Save the file and appropriately deploy the frontend. Any courses with a location at `building_code` will show on the Map.

## Part 3: Updating Walking Time Calculations

> Note: Currently, this step requires using GCP and will involve recalculating the entire dataset of location walking times.

Prerequisites:

1. A Google Cloud Platform account with valid credits and/or billing set up, with a Google Maps `API key`
2. a complete and valid [`buildingCoordinates.json`](https://github.com/coursetable/coursetable/blob/master/frontend/src/data/buildingCoordinates.json) file

Setup:

1. Clone the [coursetable/locations repository](https://github.com/coursetable/locations) by running `git clone https://github.com/coursetable/locations.git`.

   After cloning, cd to the repository. We'll assume the repository folder name is `locations/`.

2. Copy [`coursetable/frontend/src/data/buildingCoordinates.json`](https://github.com/coursetable/coursetable/blob/master/frontend/src/data/buildingCoordinates.json) to `locations/`.

3. Install all dependencies of the Python files.

4. Set environmental variable for your Google Maps API Key. Run

   ```sh
   export GOOGLE_MAPS_API_KEY="API Key"
   ```

   Replacing `API Key` with your Google Maps API Key.

5. In `locations/` on your terminal, run:

   ```sh
   python3 walking_matrix_gmaps.py --in buildingCoordinates.json --out walkingETAs.json --resume --block-size 10
   ```

6. In `locations/`, you should see a file named `walkingETAs.json`. Check for errors.

7. (optional) to test, run

   ```sh
   python3 lookup-time.py --file walkingETAs.json ABC BK
   ```

   example output:

   ```sh
   126 mins
   ```

   replace `ABC` and `BK` with any valid building codes in `buildingCoordinate.json` to test.

8. Copy `walkingETAs.json` to `coursetable/frontend/src/data/walkingETAs.json`, replacing the older file.
