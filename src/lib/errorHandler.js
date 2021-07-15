import * as lib from "@codedrops/lib";
import notify from "./notify";
import * as Sentry from "@sentry/react";

const handleError = (error) => {
  lib.handleError(error);
  notify(error.message, "error");
  Sentry.captureException(error);
};

export default handleError;
