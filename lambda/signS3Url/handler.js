'use strict'

var AWS = require('aws-sdk')
var s3 = new AWS.S3()
var bucketName = process.env.AWS_BUCKET_NAME

console.log(process.env)

module.exports.signS3Url = async (event, context) => {
  if (!event.hasOwnProperty('contentType')) {
    context.fail({ err: 'Missing contentType' })
  }

  if (!event.hasOwnProperty('filePath')) {
    context.fail({ err: 'Missing filePath' })
  }

  var params = {
    Bucket: bucketName,
    Key: event.filePath,
    Expires: 3600,
    ContentType: event.contentType
  }

  console.log('params', params, 'event', event, 'context', context)
  s3.getSignedUrl('putObject', params, (err, url) => {
    console.log(err, url, params)
    if (err) {
      context.fail(JSON.stringify({
        stack: err.stack,
        err: err
      }))
    } else {
      const resp = {
        headers: {
          'Access-Control-Allow-Origin': 'http://localhost:8080',
          'Access-Control-Allow-Methods': 'POST',
          'Access-Control-Allow-Credentials': true,
        },
        url
      }
      context.succeed(resp)
    }
  })
}
