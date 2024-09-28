import OpenAI from "openai"
import Configuration from "openai"
import { readFile } from 'fs/promises';
import { fileURLToPath } from 'url';
import path from 'path'
import dotenv from "dotenv";
import mysql from 'mysql2/promise'
import {connect} from '../database.js'
dotenv.config();
const configuration = new Configuration({
    apiKey: process.env.API_URL,

});

//const connection = await connect();
// const connection = await mysql.createConnection ({
//     host : "localhost",
//     user : "root",
//     password : "Maconouchi",
//     database : "tasksdb"
// });


console.log('API Key:', process.env.apiKey);

const openai = new OpenAI(configuration)
// const __filename = fileURLToPath(import.meta.url);
// const __dirname = path.dirname(__filename);

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

const main = async (req, res) => {
    
        connection = await mysql.createConnection({
            host: process.env.DB_HOST,
            user: process.env.DB_USER,
            password: process.env.DB_PASSWORD,
            database: process.env.DB_NAME
        });
        const connection = await connect()

        // Ruta a tu imagen local
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
        console.log(content);

        const jsonMatch = content.match(/```json\n([\s\S]*?)\n```/);

        if (!jsonMatch) {
            console.error('No se pudo encontrar JSON válido en la respuesta');
            return;
        }
    
        const jsonString = jsonMatch[1];
        const jsonResult = JSON.parse(jsonString);
        
    }
    main()
    //const connection = config();


        // Insert into the invoices table
        // const fechaFactura = new Date(jsonResult.fecha_factura.año,
        //     getMesNumero(jsonResult.fecha_factura.mes) - 1,
        //     jsonResult.fecha_factura.dia);

        // const [invoiceResult] = await connection.execute(
        //     `INSERT INTO invoices (
        //         nombre_proveedor, direccion, rtn, fecha_factura, numero_factura, tipo_factura, 
        //         sub_total, isv, total_factura
        //     ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        //     [
        //         jsonResult.nombre_proveedor || null,
        //         jsonResult.direccion || null,
        //         jsonResult.rtn || null,
        //         fechaFactura,
        //         jsonResult.numero_factura || null,
        //         jsonResult.tipo_factura || null,
        //         jsonResult.sub_total || null,
        //         jsonResult.isv || null,
        //         jsonResult.total_factura || null
        //     ]
        // );

        //console.log('Factura guardada con ID:', invoiceResult.insertId);

        // Insert each product into the products table
//         for (const producto of jsonResult.productos) {
//             const [productResult] = await connection.execute(
//                 `INSERT INTO products (
//                     numero_factura, cantidad_producto, codigo_producto, descripcion_producto, 
//                     precio_producto, total_por_producto
//                 ) VALUES (?, ?, ?, ?, ?, ?)`,
//                 [
//                     jsonResult.numero_factura || null,
//                     producto.cantidad_producto || null,
//                     producto.codigo_producto || null,
//                     producto.descripcion_producto || null,
//                     producto.precio_producto || null,
//                     producto.total_por_producto || null
//                 ]
//             );

//             console.log('Producto guardado con ID:', productResult.insertId);
//         }

//         console.log('Todos los datos de la factura y productos han sido guardados');
//     } catch (error) {
//         console.error('Error al guardar en la base de datos:', error);
//     } finally {
//         //await connection.end();
//     }

//     function getMesNumero(mes) {
//         const meses = {
//             'enero': 1, 'febrero': 2, 'marzo': 3, 'abril': 4, 'mayo': 5, 'junio': 6,
//             'julio': 7, 'agosto': 8, 'septiembre': 9, 'octubre': 10, 'noviembre': 11, 'diciembre': 12
//         };
//         return meses[mes.toLowerCase()] || 1;
//     }
// }
    
//export default main;

    