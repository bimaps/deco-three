"use strict";
// Run this file to test your environement with ifc-convert
// # npx ts-node ifc-test
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
var ifcConvert = require('ifc-convert');
let src = path_1.default.join(__dirname, '../_ifc_sources/0912106-02windows_placement_inside_wall_all_1.ifc');
let dest = path_1.default.join(__dirname, '../ignored/0912106-02windows_placement_inside_wall_all_1.obj');

try {
    fs_1.default.accessSync(dest, fs_1.default.constants.R_OK);
    // no error, the file exists => we cannot go on
    console.log('ERROR');
    console.log(`Destination file "${dest}" exists. Remove or rename before to try again.`);
    console.log('------');
    process.exit();
}
catch (error) {
    // if error, the file do not exist, we can go on
}
try {
    fs_1.default.accessSync(src, fs_1.default.constants.R_OK | fs_1.default.constants.W_OK);
    console.log('Start conversion ...');
    ifcConvert(src, dest)
        .then(function () {
        //Now you have a Collada file;)
        console.log('SUCCESS');
        console.log('File converted');
        console.log('------');
    }).catch((error) => {
        console.log('ERROR');
        console.log('Error with ifcConvert:');
        console.error(error);
        console.log('------');
    });
}
catch (error) {
    console.log('Source file not found or not accessible');
}
//# sourceMappingURL=ifc-test.js.map