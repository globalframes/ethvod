#!/bin/bash

NAME="test1"
VIDEO_FILE_PATH="/Users/heeckhau/git/globalframes/samples/sample-5s.mp4"

# Step 1: Create a new Direct Upload URL
STEP1=$(curl --location --request POST 'https://livepeer.com/api/asset/request-upload' \
--header "Authorization: Bearer ${API_TOKEN}" \
--header 'Content-Type: application/json' \
--data-raw "{ \"name\":\"${NAME}\" }")

# echo ${STEP1} | jq

URL=$(echo ${STEP1} | jq '.url' | tr -d '"')

# Step 2: Upload the contents
STEP2=$(curl --location --request PUT "${URL}" \
 --header 'Content-Type: video/mp4' \
 --data-binary "@${VIDEO_FILE_PATH}")

 echo $STEP2 | jq