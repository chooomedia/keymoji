// postcss.config.js
module.exports = {
  plugins: [
      require('tailwindcss'),
      require('autoprefixer'),
      process.env.NODE_ENV === 'production' 
          ? require('cssnano')({ 
              preset: ['default', {
                  discardComments: {
                      removeAll: true,
                  },
              }]
          }) 
          : false
  ].filter(Boolean)
}