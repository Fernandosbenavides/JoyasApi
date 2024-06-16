import pool from '../db/db.js';
// QUERY STRINGS EN LOS PARAMS
export const getJoyas = async (req, res) => {
  try {
    const { limits, page, order_by } = req.query;
    let limit = parseInt(limits) || 10;
    let offset = (parseInt(page) - 1) * limit || 0;
    let order = order_by ? order_by.split('_') : ['id', 'ASC'];
    
    const result = await pool.query(`SELECT * FROM inventario ORDER BY ${order[0]} ${order[1]} LIMIT $1 OFFSET $2`, [limit, offset]); //CONSULTA PARAMETRIZADA
    const countResult = await pool.query('SELECT COUNT(*) FROM inventario');
    const totalItems = parseInt(countResult.rows[0].count);
    const totalPages = Math.ceil(totalItems / limit);
// ESTRUCTURA HATEOAS
    const data = {
      joyas: result.rows,
      totalItems,
      totalPages,
      currentPage: parseInt(page) || 1,
      _links: {
        self: `/joyas?limits=${limit}&page=${page}&order_by=${order_by}`,
        next: `/joyas?limits=${limit}&page=${(parseInt(page) || 1) + 1}&order_by=${order_by}`,
        prev: `/joyas?limits=${limit}&page=${(parseInt(page) || 1) - 1}&order_by=${order_by}`
      }
    };
// TRY Y CATCH PARA ERRORES
    res.json(data);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};
// FILTROS PARA EL INVENTARIO
export const getJoyasByFilters = async (req, res) => {
  try {
    const { precio_min, precio_max, categoria, metal } = req.query;
    let query = 'SELECT * FROM inventario WHERE 1=1';
    let queryParams = [];
    
    if (precio_min) {
      queryParams.push(precio_min);
      query += ` AND precio >= $${queryParams.length}`;
    }
    if (precio_max) {
      queryParams.push(precio_max);
      query += ` AND precio <= $${queryParams.length}`;
    }
    if (categoria) {
      queryParams.push(categoria);
      query += ` AND categoria = $${queryParams.length}`;
    }
    if (metal) {
      queryParams.push(metal);
      query += ` AND metal = $${queryParams.length}`;
    }
// TRY Y CATCH PARA ERRORES
    const result = await pool.query(query, queryParams); //CONSULTA PARAMETRIZADA
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};