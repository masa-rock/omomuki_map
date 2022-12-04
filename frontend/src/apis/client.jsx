import axios from 'axios'
import applyCaseMiddleware from 'axios-case-converter'

const options = {
  ignoreHeaders: true,
}

const client = applyCaseMiddleware(
  axios.create({
    baseURL: "http://0.0.0.0:3001/api/v1"    
  }),
  options
)

export default client
