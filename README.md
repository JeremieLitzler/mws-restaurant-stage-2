# Udacity Nanodegree and Google Challenge "Mobile Web Specialist"

## Project Overview: Stage 2

The API is available at the Udacity repository: https://github.com/udacity/mws-restaurant-stage-2
Follow the installation instruction before launching the PWA.

The application falls back the static json file of stage 1 if the API is not available. Therefore, the restaurants will always be available.

In addition, the strategy used:

* Read the IDB database first.
* Read the API, even if IDB returned results, and cache the API response in IDB (to keep up to date the data).
* Read the JSON file if the API in unavailable, and also cache the data in IDB.

### Installation

_IMPORTANT:_ Gulp is required to generate the responsive images.

Pre-requisites :

* Latest LTS NodeJS with npm

Then run the following commands:

* first, install the dependencies: `bash init.app.sh`
* then, build the app in production mode: `gulp go-live`
* navigate the built app: `cd build/`
* finally, launch the app in your default browser (**Chrome is recommended ;)**): `serve -o`
