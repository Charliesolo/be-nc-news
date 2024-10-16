# Northcoders News API

This is an API built for the purpose of accessing application data programmatically. The intention here is to mimic the a real world backend service (such as Reddit) which would provide this information to the front end architecture.

A hosted version of the API can be found here: https://charlies-nc-news.onrender.com/api

## Cloning this Repo

In order to clone this repo. Navigate to your destination directory and run:

> git clone https://github.com/Charliesolo/be-nc-news.git

## Installing Dependencies

In order to run this API you will require npm and certain dependencies. In your terminal run: 

> npm install --dev

## Setting up Databases
In order to set up the databases to run this .api you will need to add 2 .env files to the root of the directory: 
* .env.development
* .env.test

These files should contain:
> PGDATABASE=nc_news

and 

> PGDATABASE=nc_news_test

respectively

Once these files are in place run: 

> npm run setup-dbs


## Seeding Databases

In order to seed the development database run:

 > npm run seed

 ## Host Locally

 In order to host the API locally run:

 > npm run start

 ## Testing

 The test suite can be run with:

 > npm test app 

## Using the API
A list of all endpoints and their functions can be found [here](https://github.com/Charliesolo/be-nc-news.git)

## Minimum Requirements

In order to run this API you must have minimum version of node of 6.9.0 and a minimum version of PSQL of 16.4

--- 

This portfolio project was created as part of a Digital Skills Bootcamp in Software Engineering provided by [Northcoders](https://northcoders.com/)
