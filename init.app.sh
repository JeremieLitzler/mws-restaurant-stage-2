#!/bin/bash

npm i #To kick off the installation of the dependencies.
npm i -g serve
npm i -g pump #Install Pump
npm i -g compression #Install Compression
npm i -g browser-sync
npm i -g babel-cli
npm i --save-dev critical --save-dev #Install Css critical finder
npm i -g gulp-cli #Install Gulp CLI
npm i --save-dev gulp -D #Install Gulp
npm i --save-dev gulp-eslint # Install Gulp Eslint
npm i --save gulp-responsive #Install Gulp responsive images
#npm install --save gulp-sourcemaps #Install Gulp sourcemaps
npm i --save-dev gulp-autoprefixer #Install Gulp autoprefixer
npm i --save-dev gulp-concat #Install Gulp concat
npm i --save-dev gulp-uglifycss #Install Gulp uglifycss
npm i --save-dev gulp-rename # Install Gulp rename
npm i --save-dev gulp-uglify-es #Install Gulp uglify for ES6
npm i --save-dev gulp-babel #Install Gulp Babel for ES6+ to ES5 transpilling
npm i --save-dev gulp-sourcemaps #Install Gulp Source maps to debug the javascript in production
gulp default #run the build process
serve -p 8000 -o #to launch the server
