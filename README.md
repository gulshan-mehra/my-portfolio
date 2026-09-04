# Gulshan Mehra — Portfolio Website

Unity Game Developer portfolio built for GitHub Pages.

## Setup for GitHub Pages

1. Push this folder to a GitHub repo (e.g. `yourusername.github.io` or any repo)
2. Go to **Settings → Pages** → set source to `main` branch, `/ (root)` folder
3. Your site will be live at `https://yourusername.github.io/`

## Files to Update Before Publishing

| File/Folder | What to do |
|---|---|
| `assets/Gulshan-Mehra-Resume.pdf` | Place your resume PDF here |
| `videos/video1.mkv` | Convert to `video1.mp4` for browser compatibility. Update `<source>` tags in `index.html` |
| Asset Store links | Update `href` in featured project section once package is published |

## Converting video to MP4 (recommended)

```bash
ffmpeg -i video1.mkv -c:v libx264 -c:a aac video1.mp4
```

Then in `index.html` replace:
```html
<source src="./videos/video1.mkv" type="video/x-matroska"/>
```
with:
```html
<source src="./videos/video1.mp4" type="video/mp4"/>
```

## Contact

- Email: thegulshanmehra@gmail.com
- LinkedIn: https://in.linkedin.com/in/gulshan-mehra
- Behance: https://www.behance.net/gulshanmehra
