#!/bin/bash

url=$(http post https://omyx3ve125.execute-api.eu-west-1.amazonaws.com/dev/delft3d-post contentType=text/plain filePath=test.txt | jq -r .url)
echo $url
http PUT $url content-type:text/plain < test.txt
