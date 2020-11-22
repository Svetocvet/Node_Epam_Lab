Delivery Service Api

## Summary

This project is api witch provides delivery service created with express and mongoDB. There are 2 type of users(drivers and shippers) who can create loads and deliver them.

<ins>There some specific features developed:</ins><br />
Any system user can easily reset his password using 'forgot password' option;<br />
User is able to attach a photo to his profile;<br />
Ability to filter loads by status;<br />
Pagination for loads;<br />
The most important functionality covered with unit and acceptance tests;<br />
Any system user can get notifications through the email about shipment updates;<br />


## Installation
To install the project clone it from repo and install all required packages by npm:
```
$ git clone https://gitlab.com/Svetocvet/nodejs_hw3.git
$ npm install
```

## Basic use
Express server started on your localhost, so you can use it sending requests to http://localhost:8080/
```
$ npm start
```

## API 
Full API documentation is in api_doc.yaml file which was provided by Swagger.  

## Tests
There are tests provided by mocha and supertest, which can be ran by command below: 
```
$ npm test
```

## Contributors
Serhii Yashchuk

## License
MIT
