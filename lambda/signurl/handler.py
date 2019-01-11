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

    # or if not found:
    # get from json body
    if not key:
        obj = json.loads(event['body'])
        key = obj['key']
    
    # Generate the POST attributes
    post = s3.generate_presigned_post(
        Bucket=bucket,
        Key=key
    )

    response = {
        "statusCode": 200,
        "body": json.dumps(post)
    }

    return response

