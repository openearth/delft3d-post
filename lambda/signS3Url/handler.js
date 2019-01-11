'use strict'

const busboy = require('busboy')
const AWS = require('aws-sdk')
const qs = require('query-string')

const s3 = new AWS.S3()

const bucketName = process.env.AWS_BUCKET_NAME


function formData2Json(body, headers) {
  // The AWS event contains unparsed form data.
  // return a promise that parses the fields.

  const promise = new Promise((resolve, reject) => {
    const obj = {}
    if (headers.hasOwnProperty('Content-Type')) {
      // lowercase expected
      headers['content-type'] = headers['Content-Type']
    }

    const bb = new busboy({headers});
    bb
      .on(
        'field',
        (fieldname, val) => {
          obj[fieldname] = val
        }
      )
    bb.on('finish', () => resolve(obj))
    bb.end(body)
  })
  return promise
}


module.exports.signS3Url = async (event, context, callback) => {
  let form = await formData2Json(event.body, event.headers)


  let res = {
    statusCode: 200,
    headers: {}
  }

  if (!form.hasOwnProperty('contentType')) {
    res.body = 'Missing contentType'
    res.statusCode = 400
    callback(null, res)
  }

  if (!form.hasOwnProperty('filePath')) {
    res.body = 'Missing filePath'
    res.statusCode = 400
    callback(null, res)
  }

  var params = {
    Bucket: bucketName,
    Key: form.filePath,
    Expires: 3600,
    ContentType: form.contentType
  }

  // TODO, use a promise/callback for this, to capture error
  const url = s3.getSignedUrl('putObject', params)
  const obj = qs.parseUrl(url)
  const result = {
    signature: obj.query,
    postEndpoint: obj.url
  }

  res.headers = {
    'Access-Control-Allow-Origin': 'http://localhost:8080',
    'Access-Control-Allow-Methods': 'POST',
    'Access-Control-Allow-Credentials': true
  }
  res.body = JSON.stringify(result)
  callback(null, res)
}

module.exports.signS3Url2 = (event, context) => {
  console.log('event', event)
  console.log('context', context)
  const req = JSON.parse(event.body)
  if (!req.hasOwnProperty('contentType')) {
    context.fail('Missing contentType')
  }

  if (!req.hasOwnProperty('filePath')) {
    context.fail('Missing filePath')
  }

  console.log('check')
  var params = {
    Bucket: bucketName,
    Key: req.filePath,
    Expires: 3600,
    ContentType: req.contentType
  }

  const url = s3.getSignedUrl('putObject', params)
  const resp = {
    statusCode: 200,
    headers: {
      'Access-Control-Allow-Origin': 'http://localhost:8080',
      'Access-Control-Allow-Methods': 'POST',
      'Access-Control-Allow-Credentials': true
    },
    body: JSON.stringify({url})
  }
  console.log('resp', resp)
  context.succeed(resp)
}
