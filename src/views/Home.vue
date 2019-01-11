<template>
  <div class="home">
    <v-dropzone></v-dropzone>
  </div>
</template>

<style>
  .home {
  width: 100%;
  }
</style>
<script>
// @ is an alias to /src
import VDropzone from '@/components/VDropzone'

console.log(VDropzone)
export default {
  name: 'home',
  data () {
    return {

    }
  },
  components: {
    'v-dropzone': VDropzone
  },
  methods: {

  }
}
</script>
