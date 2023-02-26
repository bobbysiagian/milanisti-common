import { RequestHandler } from 'express';
import * as multer from 'multer';

export const DEFAULT_FILE_FIELD_NAME = 'files';

export const UploadMiddleware = (): RequestHandler => {
    return multer().array(DEFAULT_FILE_FIELD_NAME);
};

export default UploadMiddleware;
