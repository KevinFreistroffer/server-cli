"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.askGithubCredentials = void 0;
const prompts_1 = require("@inquirer/prompts");
const fs = __importStar(require("fs"));
const askGithubCredentials = () => __awaiter(void 0, void 0, void 0, function* () {
    const folder = yield (0, prompts_1.input)({
        message: "What is the folder path ( eg. /auth or /auth/user)?",
    });
    if (!folder || folder.length === 0) {
        console.log("Folder path is required.");
        process.exit;
    }
    const routeType = yield (0, prompts_1.input)({
        message: "What is the route type (eg. get, post, put, delete)?",
    });
    if (!routeType || routeType.length === 0) {
        console.log("Route type is required.");
        process.exit;
    }
    const fileName = yield (0, prompts_1.input)({
        message: "What is the file name (eg. create.ts)?",
    });
    if (!fileName || fileName.length === 0) {
        console.log("File name is required.");
        process.exit;
    }
    const verifyToken = yield (0, prompts_1.input)({
        message: "Verify token (true/false)?",
    });
    if (!verifyToken || verifyToken.length === 0) {
        console.log("Verify token is required.");
        process.exit;
    }
    const verifyAccessKey = yield (0, prompts_1.input)({
        message: "Verify access key (true/false)?",
    });
    if (!verifyAccessKey || verifyAccessKey.length === 0) {
        console.log("Verify access key is required.");
        process.exit;
    }
    if (!fs.existsSync(folder)) {
        fs.mkdirSync(folder, { recursive: true });
    }
    const projectStructure = {
        src: [`router/routes/${folder}/${fileName}`],
    };
    function readWriteAsync() {
        try {
            fs.readFile("src/config/index.ts", "utf-8", function (err, data) {
                // console.log(data);
                if (err)
                    throw err;
                const match = data.match(/protectedRoutes: \[/gim);
                console.log(match);
                if (verifyToken === "true") {
                    console.log("verifyTokenValue is true writingFile");
                    fs.writeFile("src/config/index.ts", data.replace(
                    // /protectedRoutes: \[(\r\n|\r|\n)\s*"/gim,
                    /protectedRoutes: \[/gim, `protectedRoutes: ["${folder}/${fileName}",`), "utf-8", function (err) {
                        if (err)
                            throw err;
                        console.log("filelistAsync complete");
                    });
                }
                if (verifyAccessKey === "true") {
                    console.log("verifyAccessKeyValue is true writingFile");
                    fs.writeFile("src/config/index.ts", data.replace(
                    // /protectedRoutes: \[(\r\n|\r|\n)\s*"/gim,
                    /privateRoutes: \[/gim, `privateRoutes: ["${folder}/${fileName}",`), "utf-8", function (err) {
                        if (err)
                            throw err;
                        console.log("filelistAsync complete");
                    });
                }
            });
        }
        catch (error) {
            throw error;
        }
    }
    readWriteAsync();
    Object.entries(projectStructure).forEach(([dir, files]) => {
        // fs.mkdirSync(dir, { recursive: true }); // Create directories
        files.forEach((file) => fs.writeFileSync(`src/router/routes/${folder}/${fileName}`, (`
      "use strict";
      import * as express from "express";
      const router = express.Router();

      interface IRequestBody {}

      // const validatedFields = body([])
      //   .notEmpty()
      //   .bail()
      //   .isString()
      //   .bail()
      //   .escape();
` +
            "router." +
            routeType) +
            `(
        "/",
        //   validatedFields,
        async (req: express.Request, res: express.Response) => {
          try {
          } catch (error) {}
        }
      );

      module.exports = router;
    `)); // Create files
    });
});
exports.askGithubCredentials = askGithubCredentials;
(0, exports.askGithubCredentials)();
