import { pool } from '../../db.js';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { id } = req.query;

  const result = await pool.query(`
    UPDATE personal.x_bookmarks
    SET read_at = NOW(), updated_at = NOW()
    WHERE x_id = $1
    RETURNING read_at
  `, [id]);

  if (result.rowCount === 0) {
    return res.status(404).json({ error: 'Bookmark not found' });
  }

  return res.json({
    success: true,
    read_at: result.rows[0].read_at
  });
}
