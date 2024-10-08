# ProfilePage

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 18.2.7.

# Prerequisites

Make sure you have the following installed:

Node.js (>= v18.x)
Angular CLI (>= v18.2.7)
JSON Server (for mocking APIs)

# Running the Development Server

To run the development server along with the mock API server, use the following command:

Copy code
`npm run start:dev`

This will start the Angular development server on `http://localhost:4200`.
It will also start json-server on `http://localhost:3000` to serve data from db.json.
The application will automatically reload if you change any of the source files.

# If npm run start:dev doesn't work, you can manually start both the Angular app and the mock API server in separate terminals:

Start the Angular app:
Copy code
`ng serve`

Start the mock API server:
Copy code
`json-server --watch db.json`

# Running Unit Tests

To run unit tests with Karma:

Copy code
`npm run test`
The test runner will automatically launch a browser to execute the tests.

# If npm run test doesn't work, you can manually run unit tests

Copy code
`ng test`
this executes the unit tests via [Karma](https://karma-runner.github.io).

## Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory.

## Further help

To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI Overview and Command Reference](https://angular.dev/tools/cli) page.
