module.exports = {
  roots: ['<rootDir>'],
  transform: {
    '^.+\\.tsx?$': 'ts-jest',
  },
  'globals': {
    'NODE_ENV': 'test'
  }
}
