import pool from "../db/db.js";

export const getJoyas = async (req, res) => {
  try {
    const { limits, page, order_by } = req.query;
    let limit = parseInt(limits) || 10;
    let offset = (parseInt(page) - 1) * limit || 0;
    let order = order_by ? order_by.split("_") : ["id", "ASC"];

    const result = await pool.query(
      `SELECT id, nombre, COALESCE(stock, 0) AS stock FROM inventario ORDER BY ${order[0]} ${order[1]} LIMIT $1 OFFSET $2`,
      [limit, offset]
    );
    //CALCULAR EL STOCK DE JOYAS
    const stockTotalJoyas = result.rows.reduce(
      (acc, curr) => acc + curr.stock,
      0
    );

    const data = {
      joyas: result.rows.map((joya) => ({
        nombre: joya.nombre,
        href: `/joyas/${joya.id}`,
      })),
      TotalJoyas: result.rowCount, //JOYAS POR PAGINA
      stockJoyas: stockTotalJoyas, //STOCK DE JOYAS
      totalPages: Math.ceil(result.rowCount / limit),
      currentPage: parseInt(page) || 1, //AGREGO HREF Y LO DEJO MAS PARECIDO A LOS REQUERIMIENTOS
    };

    res.json(data);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const getJoyasById = async (req, res) => {
  try {
    const { id } = req.params;

    const joyaId = parseInt(id);
    if (isNaN(joyaId)) {
      return res.status(400).json({ error: "ID must be an integer" }); //ALGUNAS VALIDACIONES
    }

    const query = "SELECT * FROM inventario WHERE id = $1";
    const result = await pool.query(query, [joyaId]);

    if (result.rowCount === 0) {
      return res.status(404).json({ error: "Joya not found" });
    }

    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal Server Error" });
  }
}; //AGREGO GET JOYASBYID PARA QUE AL CLICKEAR EN EL REF NO DE ERROR

// FILTROS
export const getJoyasByFilters = async (req, res) => {
  try {
    const { precio_min, precio_max, categoria, metal } = req.query;
    let query = "SELECT * FROM inventario WHERE 1=1";
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

    const result = await pool.query(query, queryParams);
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
