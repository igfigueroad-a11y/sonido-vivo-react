module.exports = function (config) {
  config.set({
    frameworks: ['jasmine', 'vite'],
    plugins: [
      'karma-jasmine',
      'karma-chrome-launcher',
      'karma-vite'
    ],
    files: [
      { pattern: 'src/**/*.test.tsx', type: 'module', watched: false }
    ],
    reporters: ['progress'],
    port: 9876,
    colors: true,
    logLevel: config.LOG_INFO,
    autoWatch: true,
    browsers: ['Chrome'],
    singleRun: false,
    concurrency: Infinity,
    vite: {
      config: {
        
      }
    }
  });
};