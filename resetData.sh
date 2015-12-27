#!/bin/bash


echo "Connecting to: mongodb://localhost:27001/development"

# This is confusing, it changes the current working directory to the directory of this file
cd ${0%/*}

echo "Resetting database"
echo 'db.dropDatabase();' | mongo 'mongodb://localhost:27001/development'


mongoCollections=($( echo 'show collections;' | mongo --quiet $DBConnString | grep -v 'system' ))
for collection in "${mongoCollections[@]}"; do
	echo "Deleting collection: $collection"
	echo "db.$collection.drop();" | mongo --quiet $DBConnString
done

# Load all the scripts from the data dir
mongo $DBConnString ./collections/*

