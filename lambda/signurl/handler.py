import os
import json

import boto3

def sign(event, context):
    # Get the service client
    s3 = boto3.client('s3')
    
    bucket = os.environ.get('AWS_BUCKET_NAME', 'delft3d-post')

    print('event', event)

    # get from headers
    key = event.get('key')
    content_type = event.get('contentType')


    # or if not found:
    # get from json body
    if not key:
        try:
            obj = json.loads(event['body'])
            key = obj['key']
            content_type = obj['contentType']
        except JSONDecodeError:
            raise ValueError("missing key in event and no json input")
        
    
    # Generate the POST attributes
    post = s3.generate_presigned_post(
        Bucket=bucket,
        Key=key,
        Fields={
            'Content-Type': content_type
        },
        Conditions=[
            ["starts-with", "$Content-Type", ""]
        ]
    )

    response = {
        "statusCode": 200,
        "headers": {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Credentials': True
        },
        "body": json.dumps(post)
    }

    return response

