<template>
  <div class="home" >
    <vue-uppy id="v-uppy" :url="url"></vue-uppy>
  </div>
</template>

<style>
  .home {
  width: 100%;
  }
</style>
<script>
// @ is an alias to /src
import VueUppy from '@/components/VueUppy'

import lambda from '@/lambda'

export default {
  name: 'home',
  data () {
    return {
      url: lambda.AWS_LAMBDA_GETSIGNEDURL_ENDPOINT
    }
  },
  components: {
    'vue-uppy': VueUppy
  },
  methods: {

  }
}
</script>
