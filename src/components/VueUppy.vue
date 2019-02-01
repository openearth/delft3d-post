<template>
<div>
  <div class="dashboard"></div>
  <div class="progress"></div>
</div>

</template>
<script>

import Uppy from '@uppy/core'
import AwsS3 from '@uppy/aws-s3'
import Dashboard from '@uppy/dashboard'
import ProgressBar from '@uppy/progress-bar'

import ms from 'ms'

import '@uppy/core/dist/style.css'
import '@uppy/dashboard/dist/style.css'

export default {
  props: {
    url: {
      type: String
    }
  },
  mounted () {

    // use
    this.uppy.use(AwsS3, {
      limit: 2,
      timeout: ms('1 minute'),
      serverUrl: this.url,
      getUploadParameters: (file) => {
        // Send a request to our PHP signing endpoint.
        return fetch(
          this.url,
          {
            method: 'post',
            // Send and receive JSON.
            headers: {
              accept: 'application/json',
              'content-type': 'application/json'
            },
            body: JSON.stringify({
              key: file.name,
              contentType: file.type
            })
          })
          .then((response) => {
            // Parse the JSON response.
            return response.json()
          })
          .then((data) => {
            // Return an object in the correct shape.
            return {
              method: 'POST',
              url: data.url,
              fields: data.fields
            }
          })
          .catch((resp) => {
            console.log('error', resp)
          })
      }
    })

    this.uppy.use(Dashboard, {
      height: '300px',
      inline: true,
      target: '.dashboard'
    })
  },
  data () {
    return {
      uppy: Uppy()
    }
  }
}
</script>
