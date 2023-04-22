/// <reference types="node" />
import { Dirent } from "fs";
export declare function run(): void;
export declare function ListDir(path: any): Dirent[];
export declare function ListFilesInDir(path: any): Dirent[];
export declare function ListDirsInDir(path: any): Dirent[];
export declare function openJSONFile(path: any, required?: any): any;
