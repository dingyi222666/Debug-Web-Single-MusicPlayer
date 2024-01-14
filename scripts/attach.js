var SHARE_SINGLE_DOWNLOAD_URL = null;
async function fetchWithTimeout(url, timeout = 2000) {
    return new Promise((resolve, reject) => {
        // 设置超时定时器
        const timeoutId = setTimeout(() => {
            reject(new Error('Request timed out'));
        }, timeout);

        fetch(url)
            .then(response => {
                clearTimeout(timeoutId);
                resolve(response);
            })
            .catch(err => {
                clearTimeout(timeoutId);
                reject(err);
            });
    });
}

const mid = (new URLSearchParams(window.location.hash.substring(1))).get('mid') || (new URLSearchParams(window.location.search)).get('mid') || '0';
// const jsonURL = `${window.location.origin}/?api=playerInfoGet&mid=${mid}`;
const jsonURL = `${window.location.origin}/attach.json#mid=${mid}`;
// 用法示例
fetchWithTimeout(jsonURL)
    .then(response => {
        if (!response.ok) {
            //使用默认数据
            return {
                backgroundImage: './images/background.png',
                coverImage: './images/cover.jpg',
                songTitle: 'Unkown Song',
                artistName: 'Unkown Artist',
                musicURL: './resources/sound'
            };
        }
        return response.json();
    })
    .then(data => {
        // 进行DOM更新或其他操作
        document.getElementById('blur-background').style.cssText = `
        background: url('${data.backgroundImage}') no-repeat center center;
        background-size: cover;
      `;
        document.getElementById('cover-image').src = data.coverImage;
        document.getElementById('song-title').textContent = `${data.songTitle}`;
        document.getElementById('artist-name').textContent = `${data.artistName}`;
        SHARE_SINGLE_DOWNLOAD_URL = data.musicURL;
    })
    .catch(error => {
    });
