import express from 'express';
import {
    getSongs,
    getSongByTitle,
    addNewSong,
    updateSong,
    addSongToDate,
    getSongByDate,
    deleteSong,
    deleteSongFromDate
} from './controllers/songsController.js';

const router = express.Router();

router.get('/', getSongs);
router.get('/songsbydate/:date', getSongByDate);
router.post('/newsong', addNewSong);
router.post('/songtodate', addSongToDate);
router.put('/updateSong/:id', updateSong);
router.delete('/deleteSong/:id', deleteSong);
router.delete('/deleteSongFromDate/:id', deleteSongFromDate);
router.get('/:title', getSongByTitle);

export default router;