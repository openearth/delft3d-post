import axios from 'axios'

const AWS_LAMBDA_GETSIGNEDURL_ENDPOINT = 'https://6r52av33yb.execute-api.eu-west-1.amazonaws.com/dev/delft3d-post'

export default {
  getSignedURL (file) {
    let endpoint = AWS_LAMBDA_GETSIGNEDURL_ENDPOINT
    let payload = {
      key: file.name
    }
    return axios.post(endpoint, payload)
      .then((res) => {
        return Promise.resolve(res.data || '/')
      })
      .catch((err) => {
        console.error(err)
        return Promise.reject(err)
      })
  }
}
