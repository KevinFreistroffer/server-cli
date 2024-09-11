#!/usr/bin/env node

import { verify } from "crypto";
import fs from "fs";
import path from "path";

interface IArgs {
  folder: string;
  routeType: string;
  fileName: string;
  verifyToken: boolean;
  verifyAccessKey: boolean;
}

const validFolders = ["auth", "user", "journal"];
const validRouteTypes = ["get", "post", "put", "delete"];

try {
  const args = process.argv.slice(2);

  // All arguments missing.
  if (!args.length) {
    console.log(
      "The arguments 'folder', 'fileName', 'verifyToken' and 'verifyAccessKey' are required."
    );
    console.log(
      "Example: create-route -folder user -fileName bulkCreate.ts -verifyToken false -verifyAccessKey true"
    );
    process.exit();
  }

  const folderIndex = process.argv.indexOf("-folder");
  const routeTypeIndex = process.argv.indexOf("-routeType");
  const fileNameIndex = process.argv.indexOf("-fileName");
  const verifyTokenIndex = process.argv.indexOf("-verifyToken");
  const verifyAccessKeyIndex = process.argv.indexOf("-verifyAccessKey");

  let warning = "";
  const requiredArguments = [];

  if (folderIndex === -1) {
    requiredArguments.push("folder");
  }

  if (routeTypeIndex === -1) {
    requiredArguments.push("routeType");
  }

  if (fileNameIndex === -1) {
    requiredArguments.push("fileName");
  }

  if (verifyTokenIndex === -1) {
    requiredArguments.push("verifyToken");
  }

  if (verifyAccessKeyIndex === -1) {
    requiredArguments.push("verifyAccessKey");
  }

  if (requiredArguments.length) {
    warning = `The argument${
      requiredArguments.length > 1 ? "s" : ""
    } ${requiredArguments
      .map((arg, index) => {
        if (
          requiredArguments.length > 1 &&
          index === requiredArguments.length - 1
        ) {
          return `and '${arg}'`;
        }
        return `'${arg}'`;
      })
      .join(", ")} ${requiredArguments.length > 1 ? "are" : "is"} required.`;
  }

  if (warning.length) {
    console.log(warning);
    process.exit();
  }

  // ------------------------------------------------s
  let folderValue!: string;

  if (folderIndex > -1) {
    // Retrieve the value after --custom
    folderValue = process.argv[folderIndex + 1];

    if (!validFolders.includes(folderValue)) {
      console.log(
        `The folder '${folderValue}' is invalid. Valid folders are: ${validFolders.join(
          ", "
        )}`
      );
      process.exit();
    }

    if (!folderValue.startsWith("/")) {
      console.log(`The folder must start with a forward slash '/'`);
      process.exit();
    }
  }
  let routeTypeValue: string;
  if (routeTypeIndex > -1) {
    // Retrieve the value after --custom
    routeTypeValue = process.argv[routeTypeIndex + 1];

    if (!validRouteTypes.includes(routeTypeValue)) {
      console.log(
        `The method '${routeTypeValue}' is invalid. Valid methods are: ${validRouteTypes.join(
          ", "
        )}`
      );
      process.exit();
    }
  }

  let fileNameValue!: string;
  if (fileNameIndex > -1) {
    // Retrieve the value after --custom
    fileNameValue = process.argv[fileNameIndex + 1];

    if (!fileNameValue.endsWith(".js") && !fileNameValue.endsWith(".ts")) {
      console.log("The file name must end with '.js' or '.ts'.");
      process.exit();
    }
  }

  let verifyTokenValue!: string;
  if (verifyTokenIndex > -1) {
    verifyTokenValue = process.argv[verifyTokenIndex + 1].toLowerCase();
    if (verifyTokenValue !== "true" && verifyTokenValue !== "false") {
      console.log(
        "The value for 'verifyToken' must be either 'true' or 'false'."
      );
      process.exit();
    }
  }

  let verifyAccessKeyValue!: string;
  if (folderIndex > -1) {
    // Retrieve the value after --custom
    verifyAccessKeyValue = process.argv[verifyAccessKeyIndex + 1].toLowerCase();

    if (verifyAccessKeyValue !== "true" && verifyAccessKeyValue !== "false") {
      console.log(
        "The value for 'verifyAccessKey' must be either 'true' or 'false'."
      );
      process.exit();
    }
  }

  // Define the project structure: directories and their respective files

  const projectStructure = {
    src: [`router/routes/${folderValue}/${fileNameValue}`],
  };

  function readWriteAsync() {
    try {
      fs.readFile("src/config/index.ts", "utf-8", function (err, data) {
        // console.log(data);
        if (err) throw err;

        const match = data.match(/protectedRoutes: \[/gim);
        console.log(match);

        if (verifyTokenValue === "true") {
          console.log("verifyTokenValue is true writingFile");
          fs.writeFile(
            "src/config/index.ts",
            data.replace(
              // /protectedRoutes: \[(\r\n|\r|\n)\s*"/gim,
              /protectedRoutes: \[/gim,
              `protectedRoutes: ["${folderValue}/${fileNameValue}",`
            ),
            "utf-8",
            function (err) {
              if (err) throw err;
              console.log("filelistAsync complete");
            }
          );
        }

        if (verifyAccessKeyValue === "true") {
          console.log("verifyAccessKeyValue is true writingFile");
          fs.writeFile(
            "src/config/index.ts",
            data.replace(
              // /protectedRoutes: \[(\r\n|\r|\n)\s*"/gim,
              /privateRoutes: \[/gim,
              `privateRoutes: ["${folderValue}/${fileNameValue}",`
            ),
            "utf-8",
            function (err) {
              if (err) throw err;
              console.log("filelistAsync complete");
            }
          );
        }
      });
    } catch (error: any) {
      throw error;
    }
  }

  readWriteAsync();
  Object.entries(projectStructure).forEach(([dir, files]) => {
    // fs.mkdirSync(dir, { recursive: true }); // Create directories
    files.forEach((file) =>
      fs.writeFileSync(
        `src/router/routes/${folderValue}/${fileNameValue}`,
        ((`
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
          routeTypeValue) as string) +
          `(
        "/",
        //   validatedFields,
        async (req: express.Request, res: express.Response) => {
          try {
          } catch (error) {}
        }
      );

      module.exports = router;
    `
      )
    ); // Create files
  });

  console.log("Project structure created successfully!");
} catch (error) {
  console.error("An error occurred:", error);
  process.exit();
}
