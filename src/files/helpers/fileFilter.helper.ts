import { Request } from 'express';

export const fileFilter = (
  req: Request,
  file: Express.Multer.File,
  cb: (error: any, acceptedFile: boolean) => void,
) => {
  console.log({ file });
  if (!file) return cb(new Error('File is empty'), false);

  const fileExtension = file.mimetype.split('/')[1];
  const validExtensions = ['jpeg', 'jpg', 'png', 'gif'];

  if (validExtensions.includes(fileExtension)) {
    return cb(null, true);
  }

  cb(null, false);
};
