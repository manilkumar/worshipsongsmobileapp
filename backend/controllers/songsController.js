import connectMySQLDB from "../dbconfig/sqlitedb.js";

let db;
(async () => {
    db = await connectMySQLDB();
})();

export async function getSongs(req, res) {
    console.log('Received request for all songs');
    try {
        const [rows] = await db.query(`SELECT * FROM SONGS ORDER BY Title ASC`);
        console.log(rows);
        res.status(200).json(rows);
    } catch (error) {
        console.error('Error fetching songs:', error);
        res.status(500).json({ error: 'Failed to fetch songs' });
    }
};

export async function getSongByTitle(req, res) {
    const title = req.params.title;
    console.log(`Received request for song with Title: ${title}`);
    try {
        const [rows] = await db.query(
            `SELECT * FROM SONGS WHERE LOWER(Title) LIKE ?`,
            [`%${title.toLowerCase()}%`]
        );
        if (rows.length === 0) {
            return res.status(404).json({ error: 'Song not found' });
        }
        res.status(200).json(rows[0]);
    } catch (error) {
        console.error('Error fetching song:', error);
        res.status(500).json({ error: 'Failed to fetch song' });
    }
}

export async function getSongByDate(req, res) {
    const date = req.params.date;
    console.log(`Received request for songs with date: ${date}`);
    try {
        const [rows] = await db.query(
            `SELECT SundaySongs.ID AS SongId,SONGS.* FROM SONGS
             INNER JOIN SundaySongs ON SONGS.ID = SundaySongs.SongId
             WHERE SundaySongs.Date = ?`,
            [date]
        );
        if (rows.length === 0) {
            return res.status(404).json({ error: 'Songs not found' });
        }
        res.status(200).json(rows);
    } catch (error) {
        console.error('Error fetching songs:', error);
        res.status(500).json({ error: 'Failed to fetch songs' });
    }
}

export async function addNewSong(req, res) {
    console.log('Received request to add a new song:', req.body);
    // Validate request body
    const { title, youtubeLink, lyrics, scale } = req.body;
    try {
        if (!title || !youtubeLink || !lyrics || !scale) {
            console.error('Validation failed: All fields are required');
            return res.status(400).json({ error: 'All fields are required' });
        }
        const [result] = await db.query(
            `INSERT INTO SONGS (Title, YoutubeLink, Lyrics, Scale) VALUES (?, ?, ?, ?)`,
            [title, youtubeLink, lyrics, scale]
        );
        // Fetch the inserted row
        const [rows] = await db.query('SELECT * FROM SONGS WHERE ID = ?', [result.insertId]);
        res.status(201).json(rows[0]);
    } catch (error) {
        console.error('Error inserting song:', error);
        res.status(500).json({ error: 'Failed to insert song' });
    }
}

export async function addSongToDate(req, res) {
    console.log('Received request to add a song to particular date:', req.body);
    // Validate request body
    const { songId, date } = req.body;
    try {
        if (!songId || !date) {
            console.error('Validation failed: All fields are required');
            return res.status(400).json({ error: 'All fields are required' });
        }
        const [result] = await db.query(
            `INSERT INTO SundaySongs (SongId, Date) VALUES (?, ?)`,
            [songId, date]
        );
        // Fetch the inserted row
        const [rows] = await db.query('SELECT * FROM SundaySongs WHERE ID = ?', [result.insertId]);
        res.status(201).json(rows[0]);
    } catch (error) {
        console.error('Error inserting song:', error);
        res.status(500).json({ error: 'Failed to insert song' });
    }
}

export async function updateSong(req, res) {
    const { id } = req.params;
    const { title, youtubeLink, lyrics, scale } = req.body;

    console.log(`Received request to update song with ID: ${id}`, req.body);
    try {
        const [result] = await db.query(
            `UPDATE SONGS SET Title = ?, YoutubeLink = ?, Lyrics = ?, Scale = ? WHERE ID = ?`,
            [title, youtubeLink, lyrics, scale, id]
        );
        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'Song not found' });
        }
        // Fetch the updated row
        const [rows] = await db.query('SELECT * FROM SONGS WHERE ID = ?', [id]);
        res.status(200).json(rows[0]);
    } catch (error) {
        console.error('Error updating song:', error);
        res.status(500).json({ error: 'Failed to update song' });
    }
}

export async function deleteSong(req, res) {
    const { id } = req.params;
    console.log(`Received request to delete song with ID: ${id}`);
    try {
        const [result] = await db.query(
            `DELETE FROM SONGS WHERE ID = ?`,
            [id]
        );
        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'Song not found' });
        }
        res.status(200).json({ message: 'Song deleted successfully' });
    } catch (error) {
        console.error('Error deleting song:', error);
        res.status(500).json({ error: 'Failed to delete song' });
    }
}

export async function deleteSongFromDate(req, res) {
    const { id } = req.params;
    console.log(`Received request to delete song from date with ID: ${id}`);
    try {
        const [result] = await db.query(
            `DELETE FROM SundaySongs WHERE ID = ?`,
            [id]
        );
        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'Song not found' });
        }
        res.status(200).json({ message: 'Song deleted successfully' });
    } catch (error) {
        console.error('Error deleting song:', error);
        res.status(500).json({ error: 'Failed to delete song' });
    }
}