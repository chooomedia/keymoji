const production = process.env.NODE_ENV === 'production';

module.exports = {
  plugins: {
    'tailwindcss': {},
    'autoprefixer': {},
    ...(production ? {
      'cssnano': {
        preset: ['default', {
          discardComments: { removeAll: true },
          normalizeWhitespace: false,
          colormin: false,
          minifyFontValues: false
        }]
      }
    } : {})
  }
};