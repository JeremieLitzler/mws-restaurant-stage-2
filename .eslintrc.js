module.exports = {
    env: {
        browser: true,
        es6: true
    },
    extends: "eslint:recommended",
    parserOptions: {
        sourceType: "module"
    },
    rules: {
        indent: ["error", 4],
        "linebreak-style": ["warn", "unix"],
        quotes: ["error", "double"],
        semi: ["error", "always"],
        "no-console": 0
    }
};
