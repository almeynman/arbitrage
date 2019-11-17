const common = [
  'pair-trader.feature', // Specify our feature files
  '--require-module ts-node/register', // Load TypeScript module
  '--require pair-trader.steps.ts', // Load step definitions
  '--format progress-bar', // Load custom formatter
  '--format node_modules/cucumber-pretty' // Load custom formatter
].join(' ');

module.exports = {
  default: common
};
