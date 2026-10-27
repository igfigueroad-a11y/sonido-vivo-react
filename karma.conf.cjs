module.exports = function (config) {
  config.set({
    basePath: '',

    frameworks: ['vite', 'jasmine'],

    plugins: [
      'karma-jasmine',
      'karma-chrome-launcher',
      'karma-vite',
    ],

    files: [
      {
        pattern: 'src/test/**/*.test.tsx',
        type: 'module',
        watched: false,
        served: false,
      },
    ],

    reporters: ['progress'],

    port: 9876,
    colors: true,
    logLevel: config.LOG_INFO,

    autoWatch: true,
    browsers: ['Chrome'],
    singleRun: false,
    concurrency: Infinity,

    client: {
      clearContext: false,
    },

  vite: {
  config: {
    configFile: './vite.config.ts',

    server: {
      preTransformRequests: false,
    },
  },
},
  })
}