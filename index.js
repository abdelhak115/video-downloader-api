const express = require('express');
const YTDlpWrap = require('yt-dlp-wrap').default;
const cors = require('cors');

const app = express();
// Render provides the PORT environment variable
const port = process.env.PORT || 3000;

const ytDlpWrap = new YTDlpWrap();

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.send('الخادم يعمل بنجاح على Render!');
});

app.get('/fetch', async (req, res) => {
    const videoUrl = req.query.url;
    if (!videoUrl) {
        return res.status(400).json({ error: 'الرجاء توفير رابط الفيديو.' });
    }
    console.log(`جاري تحليل الرابط: ${videoUrl}`);
    try {
        const metadata = await ytDlpWrap.getVideoInfo(videoUrl);
        const formats = metadata.formats.map(f => ({
            format_id: f.format_id, ext: f.ext, resolution: f.resolution || 'Audio',
            vcodec: f.vcodec, acodec: f.acodec, filesize: f.filesize || f.filesize_approx, url: f.url,
        }));
        const result = { title: metadata.title, thumbnail: metadata.thumbnail, uploader: metadata.uploader, formats: formats };
        res.json(result);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'فشل جلب المعلومات. الفيديو قد يكون خاصاً أو غير مدعوم.' });
    }
});

app.listen(port, () => {
    console.log(`الخادم يستمع على المنفذ ${port}`);
});
