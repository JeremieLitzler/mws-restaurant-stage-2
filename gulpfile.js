/*eslint-env node */

const gulp = require("gulp");
const browserSync = require("browser-sync").create();
//const sourcemaps = require('gulp-sourcemaps');
const concat = require("gulp-concat");
let rename = require("gulp-rename");

/**
 * ESlint task checks the javascript files found in ./assets/js folder and subfolders.
 * The lazysizes files and node_modules are excluded.
 */
const eslint = require("gulp-eslint");
gulp.task("js-lint", () => {
    // ESLint ignores files with "node_modules" paths.
    // So, it's best to have gulp ignore the directory as well.
    // Also, Be sure to return the stream from the task;
    // Otherwise, the task may end before the stream has finished.
    return (
        gulp
            .src([
                "./assets/js/*.js",
                "!node_modules/**",
                "!assets/js/lazysizes**"
            ])
            // eslint() attaches the lint output to the "eslint" property
            // of the file object so it can be used by other modules.
            .pipe(eslint())
            // eslint.format() outputs the lint results to the console.
            // Alternatively use eslint.formatEach() (see Docs).
            .pipe(eslint.format())
            // To have the process exit with an error code (1) on
            // lint error, return the stream and pipe to failAfterError last.
            .pipe(eslint.failAfterError())
    );
});

/**
 * Copy the any files at the root of the project into the root of build folder
 */
gulp.task("copy-root", () => {
    gulp.src(["./sw.js", "./favicon.ico"]).pipe(gulp.dest("./build"));
});
/**
 * Copy the html source files into the root of build folder
 */
gulp.task("copy-html", () => {
    gulp
        .src(["./index.html", "./restaurant.html", "./assets/offline.html"])
        .pipe(gulp.dest("./build"));
});

/**
 * Copy the json data file into the build folder
 */
gulp.task("copy-json", () => {
    gulp.src(["./data/restaurants.json"]).pipe(gulp.dest("./build/data"));
});

/**
 * Copy the icons into the build folder
 */
gulp.task("copy-icons", () => {
    gulp
        .src([".assets/img/icons/*.svg", "./assets/img/icons/*.png"])
        .pipe(gulp.dest("./build/img/icons"));
});
/**
 * Copy the image placeholders into the build folder
 */
gulp.task("copy-img-ph", () => {
    //As long as the svg files are the image placeholders, this is fine.
    gulp.src("./assets/img/*.svg").pipe(gulp.dest("./build/img"));
});

gulp.task("copy-all", [
    "copy-root",
    "copy-html",
    "copy-json",
    "copy-icons",
    "copy-img-ph"
]);
/**
 * Images task takes care of transforming the original images into the optimised images and creates the requested sizes for better responsiveness
 */
const $ = require("gulp-load-plugins")();
gulp.task("optim-images", () => {
    return gulp
        .src("assets/img/*.{jpg,png}")
        .pipe(
            $.responsive(
                {
                    // Resize all JPG images to three different sizes: 200, 500, and 630 pixels
                    "*.jpg": [
                        { width: 64, rename: { suffix: "-64w" } },
                        { width: 128, rename: { suffix: "-128w" } },
                        { width: 360, rename: { suffix: "-360w" } },
                        { width: 480, rename: { suffix: "-480w" } },
                        {
                            // Compress, strip metadata, and rename original image //used for the index.html across all viewports // //used for the index.html across all viewports
                            rename: { suffix: "-800w" }
                        }
                    ]
                },
                {
                    // Global configuration for all images
                    // The output quality for JPEG, WebP and TIFF output formats
                    quality: 70,
                    progressive: true,
                    withMetadata: false
                }
            )
        ) // Use progressive (interlace) scan for JPEG and PNG output // Strip all metadata
        .pipe(gulp.dest("build/img"));
});

/**
 * Optimize the css by:
 *     - adding the browser specific prefixes.
 *     - minifying the css.
 */
const autoprefixer = require("gulp-autoprefixer");
const uglifycss = require("gulp-uglifycss");
gulp.task("optim-css", () => {
    gulp
        .src("assets/css/**/*.css")
        //.pipe(sourcemaps.init())
        .pipe(autoprefixer())
        .pipe(
            uglifycss({
                maxLineLen: 80,
                uglyComments: true
            })
        )
        .pipe(concat("styles.css"))
        //.pipe(sourcemaps.write('.'))
        .pipe(gulp.dest("build/css"));
});

/**
 * Optimize the javascript for the index page by:
 *     - declaring the files in the proper order.
 *     - minifying the javascript code.
 */
const pump = require("pump");
let uglify = require("gulp-uglify-es").default;
/**
 * jsCommonFiles is the list of javascript files that are common to both index and restaurant pages.
 */
let jsCommonFiles = [
    "./assets/js/app.js",
    "./assets/js/lazysizes.min.js",
    "./assets/js/dbhelper.js",
    "./assets/js/focus.handler.js"
];

let jsFilesIndexPage = [
    "./assets/js/select.change.handler.js",
    "./assets/js/main.js"
];

const finalJsFilesIndexPage = [...jsCommonFiles, ...jsFilesIndexPage];
console.log("JS files to optimise for index page", finalJsFilesIndexPage);
gulp.task("optim-js-index-page", errorHandle => {
    pump(
        [
            gulp.src(finalJsFilesIndexPage),
            concat("index.bundle.js"),
            uglify(),
            rename("index.bundle.min.js"),
            gulp.dest("build/js"),
            browserSync.reload({ stream: true })
        ],
        errorHandle
    );
});

/**
 * Optimize the javascript for the restaurant page by:
 *     - declaring the files in the proper order.
 *     - minifying the javascript code.
 */
let jsFilesRestaurantPage = ["assets/js/restaurant_info.js"];
const finalJsFilesRestaurantPage = [...jsCommonFiles, ...jsFilesRestaurantPage];
console.log("JS files to optimise for index page", finalJsFilesRestaurantPage);
gulp.task("optim-js-restaurant-page", errorHandle => {
    pump(
        [
            gulp.src(finalJsFilesRestaurantPage),
            concat("restaurant.bundle.js"),
            uglify(),
            rename("restaurant.bundle.min.js"),
            gulp.dest("build/js"),
            browserSync.reload({ stream: true })
        ],
        errorHandle
    );
});

/**
 * Default gulp task for development environnement that includes:
 *     - copying all the static files
 *     - optimize the images
 *     - optimize the css
 *     - optimize the javascript
 *
 * Finally, some watches allow to run the css and javascript tasks as changes happen and browsersync automatically refreshes the current pageg.
 *
 */
//https://stackoverflow.com/a/28460016
gulp.task(
    "default",
    [
        //"js-lint",
        "copy-all",
        "optim-images",
        "optim-css",
        "optim-js-index-page",
        "optim-js-restaurant-page"
    ],
    () => {
        gulp.watch("./assets/js/**/*.js", ["js-lint"]);
        gulp.watch("./assets/css/**/*.css", ["optim-css"]);
        browserSync.init({
            files: ["build/**/*.*"],
            server: {
                baseDir: "./build"
            },
            port: 8001
        });
    }
);

/**
 * Default gulp task for development environnement that includes:
 *     - copying all the static files
 *     - optimize the images
 *     - optimize the css
 *     - optimize the javascript
 *
 * On the dev environnement, some watches allow to run the css and javascript tasks.
 *
 */
//https://stackoverflow.com/a/28460016
gulp.task("default-prod", [
    //"js-lint",
    "copy-all",
    "optim-images",
    "optim-css",
    "optim-js-index-page",
    "optim-js-restaurant-page"
]);
