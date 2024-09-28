import {connect} from '../database.js'


export const getInvo = async (req, res) => {
    const connection = await connect();
    const[rows] = await connection.query('SELECT * FROM invoices')
    console.log(rows)
    // res.send("hi world")
    res.json(rows)
}

export const getProd = async (req, res) => {
    const connection = await connect();
    const[rows] = await connection.query('SELECT * FROM products')
    console.log(rows)
    // res.send("hi world")
    res.json(rows)
}

export const getInvoId = async (req, res) => {
    const connection = await connect();
    const [rows] = await connection.query('SELECT * FROM Invoices WHERE id = ?', [
        req.params.id,
    ]);
    res.json(rows[0])
    //console.log(rows[0]);
}

export const getProdByInvo = async (req, res) => {
    try {
        const connection = await connect();
        const numeroFactura = req.params.numero_factura;
        console.log('Número de factura recibido:', numeroFactura);
        const [productos] = await connection.query(
            'SELECT codigo_producto, cantidad_producto, descripcion_producto, precio_producto, total_por_producto FROM products JOIN invoices ON products.numero_factura = invoices.numero_factura',
            [numeroFactura] 
        );
        console.log('Productos obtenidos:', productos);
        if (productos.length === 0) {
            return res.status(404).json({ message: "No se encontraron productos para esta factura" });
        }
        
        res.json(productos);
        console.log('Productos obtenidos:', productos);
    } catch (error) {
        console.error('Error al obtener productos:', error);
        res.status(500).json({ message: "Ocurrió un error al obtener los productos" });
    }
};



