import { input } from "@inquirer/prompts";
import * as fs from "fs";

export const askGithubCredentials = async () => {
  const folder = await input({
    message: "What is the folder path ( eg. /auth or /auth/user)?",
  });

  if (!folder || folder.length === 0) {
    console.log("Folder path is required.");
    process.exit;
  }

  const routeType = await input({
    message: "What is the route type (eg. get, post, put, delete)?",
  });
  if (!routeType || routeType.length === 0) {
    console.log("Route type is required.");
    process.exit;
  }

  const fileName = await input({
    message: "What is the file name (eg. create.ts)?",
  });
  if (!fileName || fileName.length === 0) {
    console.log("File name is required.");
    process.exit;
  }

  const verifyToken = await input({
    message: "Verify token (true/false)?",
  });
  if (!verifyToken || verifyToken.length === 0) {
    console.log("Verify token is required.");
    process.exit;
  }

  const verifyAccessKey = await input({
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
        if (err) throw err;

        const match = data.match(/protectedRoutes: \[/gim);
        console.log(match);

        if (verifyToken === "true") {
          console.log("verifyTokenValue is true writingFile");
          fs.writeFile(
            "src/config/index.ts",
            data.replace(
              // /protectedRoutes: \[(\r\n|\r|\n)\s*"/gim,
              /protectedRoutes: \[/gim,
              `protectedRoutes: ["${folder}/${fileName}",`
            ),
            "utf-8",
            function (err) {
              if (err) throw err;
              console.log("filelistAsync complete");
            }
          );
        }

        if (verifyAccessKey === "true") {
          console.log("verifyAccessKeyValue is true writingFile");
          fs.writeFile(
            "src/config/index.ts",
            data.replace(
              // /protectedRoutes: \[(\r\n|\r|\n)\s*"/gim,
              /privateRoutes: \[/gim,
              `privateRoutes: ["${folder}/${fileName}",`
            ),
            "utf-8",
            function (err: any) {
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
        `src/router/routes/${folder}/${fileName}`,
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
          routeType) as string) +
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
};

askGithubCredentials();
