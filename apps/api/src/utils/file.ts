import { type Request } from 'express';

type MulterCallback = (error: Error | null, acceptFile: boolean) => void;
type FileNameCallback = (error: Error | null, filename: string) => void;

// Interface pour le fichier uploadé
interface MulterFile {
  buffer: Buffer;
  destination: string;
  encoding: string;
  fieldname: string;
  filename: string;
  mimetype: string;
  originalname: string;
  path: string;
  size: number;
}


export const fileNameEditor = (request: Request, file: MulterFile, callback: FileNameCallback) => {
  console.log("file editor name", file);
  callback(null, file.originalname);
};

export const fileFilter = (request: Request, file: MulterFile, callback: MulterCallback) => {
  console.log("file filter", file);
  if (!/\.(jpg|jpeg|png|gif)$/.test(file.originalname)) {
    return callback(new Error('Seuls les fichiers images sont autorisés!'), false);
  }
  callback(null, true);
};