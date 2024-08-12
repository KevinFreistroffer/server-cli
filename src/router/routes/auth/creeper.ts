
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
router.get(
        "/",
        //   validatedFields,
        async (req: express.Request, res: express.Response) => {
          try {
          } catch (error) {}
        }
      );

      module.exports = router;
    