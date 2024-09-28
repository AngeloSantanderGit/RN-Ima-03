import multer from 'multer';
import fs from 'fs';
import path from 'path';
import { processInvoice } from './processInvoice.js'; // Make sure to import processInvoice
import { fileURLToPath } from 'url'; 
import { dirname, join } from 'path'; 


// Obtener __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const fileFilter = (req, file, cb) => {
    const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg', 'image/webp'];
    if (allowedTypes.includes(file.mimetype)) {
        cb(null, true);
    } else {
        cb(new Error('Tipo de archivo no permitido'), false);
    }
};

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, path.resolve('uploads'))
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + path.extname(file.originalname));
    }
});

const upload = multer({
    storage: storage,
    fileFilter: fileFilter,
    limits: { fileSize: 50 * 1024 * 1024 }
});

export const saveImage = async (req, res) => {

    upload.single('image')(req, res, async (err) => {
        if (err) {
            console.error(err);
            return res.status(500).send('Error al subir el archivo');
        }

        if (!req.file) {
            return res.status(400).send('No se ha subido ningún archivo');
        }

        console.log('Archivo subido:', req.file);
        console.log('Current directory:', __dirname);
        console.log('Uploaded file path:', req.file.path);
        //const filePath = path.join(__dirname, '..', '..', 'uploads', req.file.filename);
        //const filePath = path.resolve(__dirname, '../uploads', req.file.filename);
        const filePath = path.resolve(__dirname, '../uploads', req.file.path)
        console.log('Procesando archivo en la ruta:', filePath); // Log para verificar la ruta completa

        // Check if the file exists
        try {
            await fs.promises.access(filePath, fs.constants.F_OK);
        } catch {
            console.error(`El archivo no existe en la ruta: ${filePath}`);
            return res.status(404).send(`El archivo no existe en la ruta: ${filePath}`);
        }
        // Process the invoice after saving the image

        try {

            //const filePath = req.file.path; // Full path to the uploaded file
            console.log('Procesando archivo en la ruta:', filePath);
            ////const result = await processInvoice(req.file.filename);
            const result = await processInvoice(filePath)
            if (result.success) {
                res.status(200).json({
                    message: 'Imagen guardada y procesada correctamente',
                    filename: req.file.filename,
                    ...result
                });
            } else {
                res.status(500).json({
                    message: 'Imagen guardada, pero hubo un error al procesar la factura',
                    error: result.message
                });
            }
        } catch (processError) {
            console.error('Error processing invoice:', processError);
            res.status(500).json({
                message: 'Imagen guardada, pero hubo un error al procesar la factura',
                error: processError.message
            });
        }
    });
}

