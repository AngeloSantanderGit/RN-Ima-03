import OpenAI from "openai"
import Configuration from "openai"
import { readFile } from 'fs/promises';
import { join, extname } from 'path';
import { fileURLToPath } from 'url';
import path from 'path'
import express from "express";
import dotenv from "dotenv";

//app.use(cors());
//app.use(bodyParser.json());
//const __filename = fileURLToPath(import.meta.url);
//const __dirname = path.dirname(__filename);
dotenv.config();
const app = express();
const port = process.env.PORT || 3000;

const configuration = new Configuration({
    apiKey: process.env.API_URL,
    });

const openai = new OpenAI(configuration)
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function getImageMimeType(filePath) {
    const ext = path.extname(filePath).toLowerCase();
    switch (ext) {
        case '.png':
        return 'image/png';
        case '.jpg':
        case '.jpeg':
        return 'image/jpeg';
        case '.gif':
        return 'image/gif';
        case '.webp':
        return 'image/webp';
        default:
        throw new Error('Unsupported image format');
    }
    }

    async function main() {
    // Ruta a tu imagen local
    //const imagePath = path.join(__dirname, '../Factura-1-2048.webp');
    const imagePath = path.join(__dirname, '../Factura-1-2048.webp');
    // Leer la imagen y codificarla en base64
    const imageBuffer = await readFile(imagePath);
    const base64Image = imageBuffer.toString('base64');

    // Obtener el tipo MIME de la imagen
    const mimeType = await getImageMimeType(imagePath);

    const response = await openai.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [
        {
            role: "user",
            content: [
            { type: "text", text: "nececito extraer de la imagen los siguientes datos y que me los presentes en un formato json, nombre Proveedor, direccion, RTN, fecha factura dia mes año, numero factura, tipo de factura, cantidad producto, codigo producto, descripcion producto, precio producto, total por producto, sub total, isv, total factura " },
            {
                type: "image_url",
                image_url: {
                "url": `data:${mimeType};base64,${base64Image}`,
                },
            },
            ],
        },
        ],
    });

    console.log(response.choices[0]);

}
main()