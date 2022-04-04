/**
 * Custom webpack configs
 *
 */

const path = require('path')

const config: any = {
  webpack: {
    experiments: {
      asset: true,
    },
    alias: {
      '@': path.resolve(__dirname, './src')
    },
    resolve: {
      extensions: ['.ts', '.js', '.tsx'],
    },
    configure: {
      module: {
        rules: [
          {
            test: /\.txt/,
            type: 'asset/source',
          }
        ],
      },
    },
  }
}

export default config
