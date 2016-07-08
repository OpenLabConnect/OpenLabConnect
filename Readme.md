<p align="center">
    <img src="https://img.shields.io/badge/OpenLabConnect-Open%20%20Laboratory%20%20Connector-brightgreen.svg?style=flat-square" height="32px" />
</p>

The open source is to interface with analyzer machine in order to automatically transfer test results into a laboratory information system. It also uses another open source (**[OpenHIM](http://openhim.org/)**) as a mediator to transfer test results into LIMS.

### There are 2 parts of the application:
-          Server side is using NodeJS to monitor data from serial port of analyzer machine, process data and insert into MongoDB.
-          Clide side is a web-based application which is using AngularJS to allow end-users to check/ view test results which are transferred from analyzer, then users can transfer test results to a LIMS.

### Technologies used in the project:

* **[NodeJS](https://nodejs.org)**
* **[AngularJS](https://angularjs.org/)**
* **[Express](https://github.com/strongloop/express) server** with nested routing architecture.
* **[Nodemon](https://github.com/remy/nodemon)** with **[LiveReload](https://github.com/vohof/gulp-livereload)** for the development process.
* **Automatic bower dependencies injection** on package install.
* **Test suite** — Unit tests with [Karma](https://karma-runner.github.io) & [Mocha](http://mochajs.org).
* **[JSHint](https://github.com/jshint/jshint)** integration.
* **[Sass](https://github.com/sass/sass)** support.
* **Authentication system**, with [Passport](https://github.com/jaredhanson/passport).
* **MongoDB**, with [Mongoose ODM](https://github.com/learnboost/mongoose).

![logos](logos/logos-sprite.png  "logos")



### Project information:
*  Project sponsor: Association of Public Health Laboratories (APHL)
*  Project owner: Huy Doan
*  Project leaders: Ninh Pham, Ha Le
*  Project contributors: Reshma Kakkar, Jan Flowers
*  Project members:
    * Dev: Trung Tran, Tin Pham, Ninh Pham, Hung Bui, Ha Le
    * QC: Hoa Tran