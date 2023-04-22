import { readdirSync, readFileSync } from "fs";
import { Schema } from "@opscompass/json-schema";
import { Dirent } from "fs";
import { join } from "path";
import { performance } from 'perf_hooks';


export function run() {
    const checksFolderPath = "./checks";
    const checkFolders = ListDirsInDir(checksFolderPath);
    for (const checkFolder of checkFolders) {
      const checkSchema = openJSONFile(join(checksFolderPath, checkFolder.name, "schema.json"));
      const checkAppliesTo = openJSONFile(join(checksFolderPath, checkFolder.name, "applies.json"));
      const passJSON = openJSONFile(join(checksFolderPath, checkFolder.name, "pass.json"));
      const failJSON = openJSONFile(join(checksFolderPath, checkFolder.name, "fail.json"));

      try {
        const failStart = performance.now();
        const failSchema = new Schema(checkSchema);
        const failApplies = new Schema(checkAppliesTo);
        const failResult = checkExpectation(failJSON, failSchema, failApplies, false);
        const failEnd = performance.now(); 

        const passStart = performance.now();
        const passSchema = new Schema(checkSchema);
        const passApplies = new Schema(checkAppliesTo);
        const passResult = checkExpectation(passJSON,  passSchema, passApplies, true);
        const passEnd = performance.now();
        
        console.log("Pass Result: " +  checkFolder.name + " Runtime " + (passEnd-passStart) + "ms");
        console.log("Fail Result: " +  checkFolder.name + " Runtime " + (failEnd-failStart) + "ms");
        console.log("Total Time elapsed: " + (passEnd - failEnd));

      } catch (e) {
        logError(`Error while trying to open files in check ${join(checksFolderPath, checkFolder.name)} : ${e}`);
      }
    }
  }
  
export function ListDir(path) {
    return readdirSync(path, { withFileTypes: true });
}

export function ListFilesInDir(path) {
    return ListDir(path).filter((f) => f.isFile() && f.name.endsWith(".json"));
}

export function ListDirsInDir(path) {
    return ListDir(path).filter((f) => f.isDirectory());
}

export function openJSONFile(path, required?) {
    try {
        return JSON.parse(readFileSync(path).toString());
    }
    catch (e) {
        if (required) {
            throw e;
        }
        return {};
    }
}

function logError(message, errorsPresent = null) {
    console.error(message);
    // An empty array is truthy, so lets just check for both
    if (errorsPresent !== null) {
      console.error("Errors generated while verifying schema", errorsPresent);
    }
  }


function openJsonFiles(filesToCheck: any[], currentPath: string) : any[] {
    return filesToCheck.map((file) => {openJSONFile(join(currentPath, file.name)) });
}

function checkExpectation(testFile: any, schema: Schema, applies: Schema, expectation: boolean | null) {
    const appliesVerification = applies.verify(testFile);
    if (appliesVerification.valid && expectation !== null) {
    const result = schema.verify(testFile);
    return result;
    }
    return undefined;
}
  
  run()