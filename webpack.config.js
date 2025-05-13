const path = require('path');

module.exports = {
  entry: './src/index.js',  // Entry point for your application
  output: {
    filename: 'bundle.js',   // Output bundle filename
    path: path.resolve(__dirname, 'dist')  // Output directory
  },
  module: {
    rules: [
      {
        test: /\.scss$/,  // Match SCSS files
        use: [
          'style-loader',  // Inject styles into DOM
          'css-loader',    // Resolve CSS imports
          'sass-loader'    // Compile SCSS to CSS
        ]
      }
    ]
  },
  resolve: {
    extensions: ['.js', '.scss']  // Resolve these file extensions
  },
  devServer: {
    contentBase: path.join(__dirname, 'dist'),
    compress: true,
    port: 9000
  }
};
