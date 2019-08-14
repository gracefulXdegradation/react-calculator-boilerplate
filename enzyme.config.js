/* eslint import/no-extraneous-dependencies: [ "error", { devDependencies: true }] */
const enzyme = require('enzyme');
const Adapter = require('enzyme-adapter-react-16');
require('jest-enzyme/lib/index.js');

enzyme.configure({ adapter: new Adapter() });
