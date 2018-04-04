/*eslint-env node */

const gulp = require("gulp");
const browserSync = require("browser-sync").create();
//const sourcemaps = require('gulp-sourcemaps');
const concat = require("gulp-concat");
let rename = require("gulp-rename");
let uglify = require("gulp-uglify-es").default;

const eslint = require("gulp-eslint");
gulp.task("js-lint", () => {
    // ESLint ignores files with "node_modules" paths.
    // So, it's best to have gulp ignore the directory as well.
    // Also, Be sure to return the stream from the task;
    // Otherwise, the task may end before the stream has finished.
    return (
        gulp
            .src([
                "**/*.js",
                "!node_modules/**",
                "!build/js/**",
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

const $ = require("gulp-load-plugins")();
gulp.task("images", () => {
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

const pump = require("pump");

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

//https://stackoverflow.com/a/28460016
gulp.task("default", [
    //"js-lint",
    "images",
    "optim-css",
    "optim-js-index-page",
    "optim-js-restaurant-page"
]);
