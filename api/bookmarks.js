import { pool } from './db.js';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { filter, archived, limit = '20', offset = '0' } = req.query;

  const conditions = [];

  // Archive filter (default: exclude archived)
  if (archived === 'true') {
    conditions.push('archived_at IS NOT NULL');
  } else {
    conditions.push('archived_at IS NULL');
  }

  // Type/status filters
  if (filter === 'unread') {
    conditions.push('read_at IS NULL');
  } else if (filter === 'x_article') {
    conditions.push("source_type = 'x_article'");
  } else if (filter === 'external') {
    conditions.push("source_type = 'external'");
  }

  const whereClause = 'WHERE ' + conditions.join(' AND ');

  const result = await pool.query(`
    SELECT * FROM personal.x_bookmarks
    ${whereClause}
    ORDER BY created_at DESC
    LIMIT $1 OFFSET $2
  `, [parseInt(limit), parseInt(offset)]);

  const countResult = await pool.query(`
    SELECT
      COUNT(*) as total,
      COUNT(*) FILTER (WHERE read_at IS NULL) as unread
    FROM personal.x_bookmarks
    ${whereClause}
  `);

  return res.json({
    data: result.rows,
    total: parseInt(countResult.rows[0].total),
    unread_count: parseInt(countResult.rows[0].unread)
  });
}
