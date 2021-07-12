import * as lib from "@codedrops/lib";
import notify from "./notify";

const handleError = (error) => {
  lib.handleError(error);
  notify(error.message, "error");
};

export default handleError;
