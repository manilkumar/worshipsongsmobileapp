const express = require('express');
const { getSongs, getSongByTitle, addNewSong, updateSong,
     addSongToDate, getSongByDate,deleteSong } = require('./controllers/songsController');
const router = express.Router();

router.get('/', getSongs);
router.get('/songsbydate/:date', getSongByDate);
router.post('/newsong', addNewSong);
router.post('/songtodate', addSongToDate);
router.put('/updateSong/:id', updateSong);
router.delete('/deleteSong/:id', deleteSong); 
router.get('/:title', getSongByTitle);


module.exports = router;