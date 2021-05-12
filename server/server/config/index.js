const config = {
  db: {
    url: process.env.DB_USER + ':' + process.env.DB_PASSWORD +'@' + process.env.DB_HOST + ':' + process.env.DB_PORT,
    name: process.env.DB_NAME
  }
}


export default config
