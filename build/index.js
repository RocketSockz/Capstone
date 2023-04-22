"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.openJSONFile = exports.ListDirsInDir = exports.ListFilesInDir = exports.ListDir = exports.run = void 0;
const fs_1 = require("fs");
const json_schema_1 = require("@opscompass/json-schema");
const path_1 = require("path");
const perf_hooks_1 = require("perf_hooks");
function run() {
    const checksFolderPath = "./checks";
    const checkFolders = ListDirsInDir(checksFolderPath);
    for (const checkFolder of checkFolders) {
        const checkSchema = openJSONFile(path_1.join(checksFolderPath, checkFolder.name, "schema.json"));
        const checkAppliesTo = openJSONFile(path_1.join(checksFolderPath, checkFolder.name, "applies.json"));
        const passJSON = openJSONFile(path_1.join(checksFolderPath, checkFolder.name, "pass.json"));
        const failJSON = openJSONFile(path_1.join(checksFolderPath, checkFolder.name, "fail.json"));
        try {
            const failStart = perf_hooks_1.performance.now();
            const failSchema = new json_schema_1.Schema(checkSchema);
            const failApplies = new json_schema_1.Schema(checkAppliesTo);
            const failResult = checkExpectation(failJSON, failSchema, failApplies, false);
            const failEnd = perf_hooks_1.performance.now();
            const passStart = perf_hooks_1.performance.now();
            const passSchema = new json_schema_1.Schema(checkSchema);
            const passApplies = new json_schema_1.Schema(checkAppliesTo);
            const passResult = checkExpectation(passJSON, passSchema, passApplies, true);
            const passEnd = perf_hooks_1.performance.now();
            console.log("Pass Result: " + checkFolder.name + " Runtime " + (passEnd - passStart) + "ms");
            console.log("Fail Result: " + checkFolder.name + " Runtime " + (failEnd - failStart) + "ms");
            console.log("Total Time elapsed: " + (passEnd - failEnd));
        }
        catch (e) {
            logError(`Error while trying to open files in check ${path_1.join(checksFolderPath, checkFolder.name)} : ${e}`);
        }
    }
}
exports.run = run;
function ListDir(path) {
    return fs_1.readdirSync(path, { withFileTypes: true });
}
exports.ListDir = ListDir;
function ListFilesInDir(path) {
    return ListDir(path).filter((f) => f.isFile() && f.name.endsWith(".json"));
}
exports.ListFilesInDir = ListFilesInDir;
function ListDirsInDir(path) {
    return ListDir(path).filter((f) => f.isDirectory());
}
exports.ListDirsInDir = ListDirsInDir;
function openJSONFile(path, required) {
    try {
        return JSON.parse(fs_1.readFileSync(path).toString());
    }
    catch (e) {
        if (required) {
            throw e;
        }
        return {};
    }
}
exports.openJSONFile = openJSONFile;
function logError(message, errorsPresent = null) {
    console.error(message);
    // An empty array is truthy, so lets just check for both
    if (errorsPresent !== null) {
        console.error("Errors generated while verifying schema", errorsPresent);
    }
}
function openJsonFiles(filesToCheck, currentPath) {
    return filesToCheck.map((file) => { openJSONFile(path_1.join(currentPath, file.name)); });
}
function checkExpectation(testFile, schema, applies, expectation) {
    const appliesVerification = applies.verify(testFile);
    if (appliesVerification.valid && expectation !== null) {
        const result = schema.verify(testFile);
        return result;
    }
    return undefined;
}
run();
//# sourceMappingURL=index.js.map