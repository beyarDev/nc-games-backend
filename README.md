# Northcoders House of Games API

project link
https://nc-games-social.onrender.com/api

project front-end
https://fe-nc-games-social.vercel.app/

An API for a social game reviews application,
where users can add, edit and delete reviews and comment on each other’s reviews

## Background

This project has been built using Node.js, Express, Node-Postgres, dotenv and pg-format,
all the routes have been tested using Jest, Jest-Sorted and Supertest.
All posible errors have been handled with apropriate message and status code

## Installation

First clone this repository to your local machine: `git clone https://github.com/beyarDev/nc-games-backend.git`
cd into NC-GAMES-BACKEND (root directory);
open a new terminal and write `pwd`, make sure you are in the right directory.
Run the command `npm install` which will install all the dependencies in the package.json file including the devDependencies.

First step setup your environment variables:
You will need to create two `.env` files `.env.test` and `.env.development`. Into each, add `PGDATABASE=<database_name_here>`, with the correct database name for that environment (see `/db/setup.sql` for the database names). Double check that these .env files are gitignored. If you are on linux you will also need to add these two environments variables to your .env files
`PGUSER=<database_use_name>` and `PGPASSWORD=<database_user_password>`.

Assuming you already have postgresql in your machine if not you will need to install it.
Run the script setup-dbs by writing the command `npm run setup-dbs`
which will create two databases nc_games for development
and nc_games_test for testing.
Now we need to connect to our databases.
When your create a new instance of pg Pool class it search in the enviroment variables
for databse name, user name and password, host and port they have default values.
in the `connection.js` file you need to configure dotenv to connect to the right database.
declare a new variable `ENV`;

`const ENV = process.env.NODE_ENV || "development"`

`require("dotenv").config({path:${__dirname}/../.env.${ENV}})`

the path is referreing to your .env file, so if there is no process.env.NODE_ENV enviroment varialbe
it will default to development.
when you run jest it sets process.env.NODE_ENV to test.
to seed development database run the script `npm run seed`
when you test your app it will seed the test database.
to test your app run `npm test`
if you want just to test app.test.js file run `npm test app`

## project requirements

postgresql v14 and Node.js v18.
