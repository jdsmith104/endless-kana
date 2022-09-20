# Unit testing for Firestore

## Setup https://fireship.io/lessons/testing-cloud-functions-in-firebase/ && https://firebase.google.com/docs/functions/unit-testing#test-background

1. Go to directory `cd functions`
1. Install ts jest: `yarn add --dev jest ts-jest @types/jest` (src)[https://www.npmjs.com/package/ts-jest]
1. Add the following line to package.json (highest level)
   `"jest": { "transform": { "^.+\\.tsx?$": "ts-jest" }, "testRegex": "(/__tests__/.*|(\\.|/)(test|spec))\\.(jsx?|tsx?)$", "moduleFileExtensions": [ "ts", "tsx", "js", "jsx", "json", "node" ] }`
1. Create test directory: `mkdir test`
1. Setup admin sdk https://firebase.google.com/docs/admin/setup?authuser=1#windows
1. Add `"test": "jest --watchAll"` to package.json: scripts
1. Consider creating a test project for online testing

## Offline testing (HTTPS onRequest)

1. Watch tutorial - requires writing a normal test and using a dependency inject on the result
