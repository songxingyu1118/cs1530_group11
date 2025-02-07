#!/usr/bin/env bash

sudo apt-get update
sudo apt-get install -y sqlite3 libsqlite3-dev

cd src/backend ; mvn install ; cd ../..

cd src/frontend ; npm install ; cd ../..
