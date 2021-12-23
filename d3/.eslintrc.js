module.exports = {
    "env": {
        "browser": true,
        "es6": true,
        "mocha": true
    },
    "plugins": ["mocha"],
    "extends": "eslint:recommended",
    "parserOptions": {
        "sourceType": "module"
    },
    "globals" :{
        "d3":true,
        "moment":true
    },
    "rules": {
        "indent": [
            "error",
            2
        ],
        "quotes": [
            "error",
            "single"
        ],
        "semi": [
            "error",
            "always"
        ]
    }
};
