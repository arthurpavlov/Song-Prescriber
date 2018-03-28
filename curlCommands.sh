#!/bin/bash

read -p "Sending a request to register the user (No error)."

curl -v -H "Content-Type: application/json" -X POST -d '{"username":"1234567", "password":"1234567"}' http://localhost:3000/register

read -p "Trying to register with an existing username should have an error."

curl -v -H "Content-Type: application/json" -X POST -d '{"username": "1234567", "password":"123456789"}' http://localhost:3000/register

read -p "Trying to login with the wrong username/password."

curl -v -H "Content-Type: application/json" -X POST -d '{"username": "username234", "password":"123456789"}' http://localhost:3000/

read -p "Trying to login with the right username/password."

curl -v -H "Content-Type: application/json" -X POST -d '{"username": "1234567", "password":"1234567"}' http://localhost:3000/

read -p "Getting the info of user 1234567. No error."

curl -v -H "Content-Type: application/json" -X GET http://localhost:3000/userdata/1234567

read -p "Getting the info of a nonexistant user. We do not get anything."

curl -v -H "Content-Type: application/json" -X GET http://localhost:3000/userdata/Bob23456

read -p "get a track page with artist name. No errors. Gets the page."

curl -v -H "Content-Type: application/json" -X GET http://localhost:3000/songpage/Thriller/Michael%20Jackson

read -p "get a track page. No errors. Gets the page."

curl -v -H "Content-Type: application/json" -X GET http://localhost:3000/songpage/Thriller

read -p "Search for a nonexistant track. No track should be found."

curl -v -m 3 -H "Content-Type: application/json" -X GET http://localhost:3000/songpage/thisisnotasong/Someone

read -p "Finds the track on spotify. Returns the json information for the track."

curl -v -m 3 -H "Content-Type: application/json" -X GET http://localhost:3000/findsong/Thriller/Michael%20Jackson

read -p "Finds the track on spotify with no artist name. Returns the json information for the track."

curl -v -m 3 -H "Content-Type: application/json" -X GET http://localhost:3000/findsong/Thriller/


read -p "Finds a nonexistant track on spotify. Should not find anything."

curl -v -m 3 -H "Content-Type: application/json" -X GET http://localhost:3000/findsong/notasong/123456

read -p "Gets the profile page for the user."

curl -v -m 3 -H "Content-Type: application/json" -X GET http://localhost:3000/profile/1234567

read -p "Gets the dashboard for the user."

curl -v -m 3 -H "Content-Type: application/json" -X GET http://localhost:3000/dashboard/1234567
