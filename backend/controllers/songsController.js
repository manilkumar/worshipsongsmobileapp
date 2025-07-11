import connectSQLiteDB  from "../dbconfig/sqlitedb.js";

let db;
(async () => {
    db = await connectSQLiteDB();
    await db.run(`
        CREATE TABLE IF NOT EXISTS SONGS (
            ID INTEGER PRIMARY KEY AUTOINCREMENT,
            Title TEXT NOT NULL,
            YoutubeLink TEXT NOT NULL,
            Lyrics TEXT NOT NULL,
            Scale TEXT NOT NULL
        )
    `);

    await db.run(`
        CREATE TABLE IF NOT EXISTS SundaySongs (
            ID INTEGER PRIMARY KEY AUTOINCREMENT,
            Date TEXT NOT NULL,  -- Use TEXT for date in SQLite
            SongId INTEGER NOT NULL
        )
    `);
})();

export async function getSongs(req, res) {
        console.log('Received request for all songs');
        try {
            const result = await db.all(`SELECT * FROM SONGS ORDER BY Title ASC`);
            console.log(result);
            res.status(200).json(result);
        } catch (error) {
            console.error('Error fetching songs:', error);
            res.status(500).json({ error: 'Failed to fetch songs' });
        }
};

export async function getSongByTitle(req, res) {
    const title = req.params.title;
    console.log(`Received request for song with Title: ${title}`);
    try {
        const result = await db.all(
            `SELECT * FROM SONGS WHERE LOWER(Title) LIKE ?`,
            [`%${title.toLowerCase()}%`]
        );
        if (result.length === 0) {
            return res.status(404).json({ error: 'Song not found' });
        }
        res.status(200).json(result[0]);
    } catch (error) {
        console.error('Error fetching song:', error);
        res.status(500).json({ error: 'Failed to fetch song' });
    }
}

export async function getSongByDate(req, res) {
    const date = req.params.date;
    console.log(`Received request for songs with date: ${date}`);
    try {
        const result = await db.all(
            `SELECT SONGS.* FROM SONGS
             INNER JOIN SundaySongs ON SONGS.ID = SundaySongs.SongId
             WHERE SundaySongs.Date = ?`,
            [date]
        );
        if (result.length === 0) {
            return res.status(404).json({ error: 'Songs not found' });
        }
        res.status(200).json(result);
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
        const result = await db.run(
            `INSERT INTO SONGS (Title, YoutubeLink, Lyrics, Scale) VALUES (?, ?, ?, ?)`,
            [title, youtubeLink, lyrics, scale]
        );
        // Fetch the inserted row
        res.status(201).json(result[0]);
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
        const result = await db.run(
            `INSERT INTO SundaySongs (SongId, Date) VALUES (?, ?)`,
            [songId, date]
        );
        // Fetch the inserted row
        res.status(201).json(result[0]);
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
        const result = await db.all(
            `UPDATE SONGS SET Title = ?, YoutubeLink = ?, Lyrics = ?, Scale = ? WHERE ID = ? RETURNING *`,
            [title, youtubeLink, lyrics, scale, id]
        );
        if (result.length === 0) {
            return res.status(404).json({ error: 'Song not found' });
        }
        res.status(200).json(result[0]);
    } catch (error) {
        console.error('Error updating song:', error);
        res.status(500).json({ error: 'Failed to update song' });
    }
}

export async function deleteSong(req, res) {
    const { id } = req.params;
    console.log(`Received request to delete song with ID: ${id}`);
    try {
        const result = await db.run(
            `DELETE FROM SONGS WHERE ID = ?`,
            [id]
        );
        if (result.changes === 0) {
            return res.status(404).json({ error: 'Song not found' });
        }
        res.status(200).json({ message: 'Song deleted successfully' });
    } catch (error) {
        console.error('Error deleting song:', error);
        res.status(500).json({ error: 'Failed to delete song' });
    }
}