
const path = require('path')

const config: any = {
  webpack: {
    alias: {
      '@': path.resolve(__dirname, './src')
    },
    resolve: {
      extensions: ['.ts', '.js', '.tsx']
    }
  }
}

export default config
