import dotenv from "dotenv";
import OpenAI from "openai";
import path, { dirname } from 'path';
import Configuration from "openai"
import { readFile, } from 'fs/promises';
import mysql from 'mysql2/promise';
import fs from 'fs/promises';

dotenv.config({ path: path.join('../../../backend-task/.env') });
//para obtener la directorio actual
const configuration = new Configuration({
    apiKey: process.env.API_URL,

});
const openai = new OpenAI(configuration)

console.log({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE
});
//const filePath = path.join( '../Factura-1-2048.webp')
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

function getMesNumero(mes) {
    const meses = {
        'enero': 1, 'febrero': 2, 'marzo': 3, 'abril': 4, 'mayo': 5, 'junio': 6,
        'julio': 7, 'agosto': 8, 'septiembre': 9, 'octubre': 10, 'noviembre': 11, 'diciembre': 12
    };
    return meses[mes.toLowerCase()] || 0;
}

export const processInvoice = async (filePath) => {

    let connection
    try {

        await fs.access(filePath);
        console.log('File exists and is accessible');

        connection = await mysql.createConnection({
            host: process.env.DB_HOST,
            user: process.env.DB_USER,
            password: process.env.DB_PASSWORD,
            database: process.env.DB_NAME
        });

        console.log('Processing file at path:', filePath);
        const imageBuffer = await readFile(filePath);
        const base64Image = imageBuffer.toString('base64');
        const mimeType = await getImageMimeType(filePath);

        console.log('Base64 Image length:', base64Image.length);
        console.log('MIME Type:', mimeType);
        console.log('Base64 Image (first 100 characters):', base64Image.substring(0, 100));
        // Consulta Api OpenIA
        const response = await openai.chat.completions.create({
            model: "gpt-4o-mini",
            messages: [
                {
                    role: "user",
                    content: [
                        { type: "text", text: "nececito extraer de la imagen el detalle de todos los productos contenidos en cada fila y que me los presentes en un formato json, nombre_proveedor, direccion, rtn, fecha_factura dia mes año, numero factura, tipo_factura, cantidad_producto, codigo_producto, descripcion_producto, precio_producto, total_por_producto, sub_total, isv, total_factura" },
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

        const content = response.choices[0].message.content;
        console.log(response.choices[0]);
        const jsonMatch = content.match(/```json\n([\s\S]*?)\n```/);


        if (!jsonMatch) {
            throw new Error('No se pudo encontrar JSON válido en la respuesta');
        }

        const jsonString = jsonMatch[1];
        const jsonResult = JSON.parse(jsonString);

        const fechaFactura = new Date(jsonResult.fecha_factura.año,
            getMesNumero(jsonResult.fecha_factura.mes) - 1,
            jsonResult.fecha_factura.dia);

        const [invoiceResult] = await connection.execute(
            `INSERT INTO invoices (
                nombre_proveedor, direccion, rtn, fecha_factura, numero_factura, tipo_factura, 
                sub_total, isv, total_factura
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [
                jsonResult.nombre_proveedor || null,
                jsonResult.direccion || null,
                jsonResult.rtn || null,
                fechaFactura,
                jsonResult.numero_factura || null,
                jsonResult.tipo_factura || null,
                jsonResult.sub_total || null,
                jsonResult.isv || null,
                jsonResult.total_factura || null
            ]
        );

        for (const producto of jsonResult.productos) {
            await connection.execute(
                `INSERT INTO products (
                    numero_factura, cantidad_producto, codigo_producto, descripcion_producto, 
                    precio_producto, total_por_producto
                ) VALUES (?, ?, ?, ?, ?, ?)`,
                [
                    jsonResult.numero_factura || null,
                    producto.cantidad_producto || null,
                    producto.codigo_producto || null,
                    producto.descripcion_producto || null,
                    producto.precio_producto || null,
                    producto.total_por_producto || null
                ]
            );
        }

        return { success: true, message: 'Invoice processed successfully', invoiceId: invoiceResult.insertId };
    } catch (error) {
        console.error('Error al procesar la factura:', error);
        if (error.response) {
            console.error('Error de la API de OpenAI:', error.response.data);
        } else if (error.request) {
            console.error('No se recibió respuesta de la API de OpenAI');
        } else {
            console.error('Error al configurar la solicitud:', error.message);
        }
        return { success: false, message: error.message };
    } finally {
        if (connection) {
            await connection.end();
        }
    }
}

//processInvoice()


