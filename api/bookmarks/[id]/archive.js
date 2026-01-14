import { pool } from '../../db.js';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { id } = req.query;

  const result = await pool.query(`
    UPDATE personal.x_bookmarks
    SET archived_at = NOW(), updated_at = NOW()
    WHERE x_id = $1
    RETURNING archived_at
  `, [id]);

  if (result.rowCount === 0) {
    return res.status(404).json({ error: 'Bookmark not found' });
  }

  return res.json({ success: true, archived_at: result.rows[0].archived_at });
}
