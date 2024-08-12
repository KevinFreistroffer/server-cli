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

  const folder = process.argv.indexOf("-folder");
  const routeType = process.argv.indexOf("-routeType");
  const fileName = process.argv.indexOf("-fileName");
  const verifyToken = process.argv.indexOf("-verifyToken");
  const verifyAccessKey = process.argv.indexOf("-verifyAccessKey");

  let warning = "";
  const requiredArguments = [];

  if (folder === -1) {
    requiredArguments.push("folder");
  }

  if (routeType === -1) {
    requiredArguments.push("routeType");
  }

  if (fileName === -1) {
    requiredArguments.push("fileName");
  }

  if (verifyToken === -1) {
    requiredArguments.push("verifyToken");
  }

  if (verifyAccessKey === -1) {
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

  // ------------------------------------------------
  const folderIndex = process.argv.indexOf("-folder");
  let folderValue;

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
  }
  const routeTypeIndex = process.argv.indexOf("-routeType");
  let routeTypeValue: string;

  if (routeType > -1) {
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

  const fileNameIndex = process.argv.indexOf("-fileName");
  let fileNameValue;

  if (fileNameIndex > -1) {
    // Retrieve the value after --custom
    fileNameValue = process.argv[fileNameIndex + 1];

    if (!fileNameValue.endsWith(".js") && !fileNameValue.endsWith(".ts")) {
      console.log("The file name must end with '.js' or '.ts'.");
      process.exit();
    }
  }

  const verifyTokenIndex = process.argv.indexOf("-verifyToken");
  let verifyTokenValue;

  if (verifyTokenIndex > -1) {
    // Retrieve the value after --custom
    verifyTokenValue = process.argv[verifyTokenIndex + 1];
    console.log(
      "verifyTokenValue",
      verifyTokenValue,
      verifyTokenValue.toLowerCase() === "false",
      typeof verifyTokenValue
    );

    if (
      verifyTokenValue.toLowerCase() !== "true" &&
      verifyTokenValue.toLowerCase() !== "false"
    ) {
      console.log(
        "The value for 'verifyToken' must be either 'true' or 'false'."
      );
      process.exit();
    }
  }

  const verifyAccessKeyIndex = process.argv.indexOf("-verifyAccessKey");
  let verifyAccessKeyValue;

  if (folderIndex > -1) {
    // Retrieve the value after --custom
    verifyAccessKeyValue = process.argv[verifyAccessKeyIndex + 1];

    if (
      verifyAccessKeyValue.toLowerCase() !== "true" &&
      verifyAccessKeyValue.toLowerCase() !== "false"
    ) {
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
      fs.readFile(
        path.join(__dirname, "./config/index.ts"),
        "utf-8",
        function (err, data) {
          // console.log(data);
          if (err) throw err;

          const match = data.match(/protectedRoutes: \[/gim);
          console.log(match);

          var newValue = data.replace(
            // /protectedRoutes: \[(\r\n|\r|\n)\s*"/gim,
            /protectedRoutes: \[/gim,
            'protectedRoutes: ["/user/someRoute",'
          );

          fs.writeFile(
            path.join(__dirname, "./config/index.ts"),
            newValue,
            "utf-8",
            function (err) {
              if (err) throw err;
              console.log("filelistAsync complete");
            }
          );
        }
      );
    } catch (error: any) {
      throw error;
    }
  }

  readWriteAsync();

  Object.entries(projectStructure).forEach(([dir, files]) => {
    fs.mkdirSync(dir, { recursive: true }); // Create directories
    files.forEach((file) =>
      fs.writeFileSync(
        `${dir}/${file}`,
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
