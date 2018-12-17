<template>
  <div class="home">
    <vue-dropzone
      id="dropzone"
      :options="dropzoneOptions"
      ref="vueDropzone"
      :awss3="awsOptions"
      v-on:vdropzone-s3-upload-error="s3UploadError"
      v-on:vdropzone-s3-upload-success="s3UploadSuccess"
      ></vue-dropzone>
  </div>
</template>

<style>
  .home {
  width: 100%;
  }
</style>
<script>
// @ is an alias to /src
import VueDropzone from 'vue2-dropzone'
import 'vue2-dropzone/dist/vue2Dropzone.min.css'

export default {
  name: 'home',
  data () {
    return {
      awsOptions: {
        signingURL: 'https://omyx3ve125.execute-api.eu-west-1.amazonaws.com/dev/delft3d-post',
        headers: {},
        params: {},
        sendFileToServer: true,
        withCredentials: false
      },
      dropzoneOptions: {
        url: 'https://httpbin.org/post',
        maxFilesize: 500,
        addRemoveLinks: true
      }
    }
  },
  components: {
    VueDropzone
  },
  methods: {
    s3UploadError (errorMessage) {
      // get the error method
      console.log(this)
      let dropzone = this.$refs.vueDropzone.dropzone
      let error = dropzone.defaultOptions.error.bind(dropzone)
      // call the error function with the last file (how to know which file failed
      error(
        dropzone.files[dropzone.files.length - 1],
        { error: errorMessage }
      )
      console.warn(errorMessage)
    },
    s3UploadSuccess (s3ObjectLocation) {
      console.warn(s3ObjectLocation)
    }

  }
}
</script>
