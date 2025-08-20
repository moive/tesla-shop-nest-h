import { Request } from 'express';
import { v7 as uuid } from 'uuid';

export const renameFile = (
  req: Request,
  file: Express.Multer.File,
  cb: (error: any, acceptedFile: any) => void,
) => {
  if (!file) return cb(new Error('File is empty'), false);

  const fileExtension = file.mimetype.split('/')[1];
  const fileName = `${uuid()}.${fileExtension}`;

  cb(null, fileName);
};
