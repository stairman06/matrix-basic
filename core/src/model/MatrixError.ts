import {
  MatrixError as MXTypesError,
  MatrixErrorCode,
} from "matrix-types/client/error";
export class MatrixError extends Error {
  error: MXTypesError;
  code: MatrixErrorCode;

  constructor(error: MXTypesError) {
    super(error.error);
    this.error = error;
    this.code = error.errcode;
  }
}
