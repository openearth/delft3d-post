import axios from 'axios'

const AWS_LAMBDA_GETSIGNEDURL_ENDPOINT = 'https://omyx3ve125.execute-api.eu-west-1.amazonaws.com/dev/delft3d-post'

export default {
  getSignedURL (file) {
    let endpoint = AWS_LAMBDA_GETSIGNEDURL_ENDPOINT
    let payload = {
      filePath: file.name,
      contentType: file.type
    }
    return axios.post(endpoint, payload)
      .then((res) => {
        return Promise.resolve(res.data.url || '/')
      })
      .catch((err) => {
        console.error(err)
        return Promise.reject(err)
      })
  }
}