module.exports = {
  default: {
    paths: ['features/**/*.feature'],
    require: ['features/step_definitions/**/*.ts', 'features/step_definitions/**/*.cjs'],
    requireModule: ['ts-node/register'],
    format: ['summary']
  }
};