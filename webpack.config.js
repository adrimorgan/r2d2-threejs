// imports
var webpack = require('webpack');
var path = require('path');

// rutas
var entry = './src/js/app.js';
var include = path.join(__dirname, 'src/js');
var nodeModules = path.join(__dirname, 'node_modules');
var outputPath = path.join(__dirname, 'src/public/assets/js');

// entorno
var PROD = JSON.parse(process.env.NODE_ENV || 0);

// entorno desarrollo
var env = 'dev',
    time = Date.now(),
    devtool = 'eval',
    mode = 'development';

// entorno producción
if(PROD){
  env = 'prod';
  devtool = 'none';
  mode = 'production';
  outputPath = __dirname + '/build/public/assets/js';
}

console.log('Webpack build - ENV: ' + env);
console.log('    - outputPath ', outputPath);
console.log('    - include', include);
console.log('    nodeModules', nodeModules);

module.exports = {

  entry: [
    entry
  ],

  output: {
    path: outputPath,
    publicPath: 'assets/js',
    filename: 'app.js'
  },

  mode: mode,

  module: {
    rules: [
      {
        test: /\.js?$/,
        use: {
          loader: 'babel-loader',
        },
        include: include,
        exclude: nodeModules,
      },
      {
        test: /\.(png|jp(e*)g|svg)$/, //Para cualquier fichero con esta extension
        use: [{
            loader: 'url-loader', //utilizar este loader (imagenes)
            options: {
                limit: 8000, // Convert images < 8kb to base64 strings
                name: 'src/public/assets/images/[hash]-[name].[ext]'
            }
        }]
      }
    ]
  },

  resolve: {
    modules: [
      'node_modules',
      path.resolve(__dirname, 'app')
    ],
    extensions: ['.js', '.json', '.css'],
  },

  performance: {
    hints: 'warning'
  },

  devtool: devtool,

  devServer: {
    contentBase: 'src/public'
  }
};
