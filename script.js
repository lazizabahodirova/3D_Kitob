// 1. Rasmlar va Musiqalar ro'yxati
const myImages = [
    'images/1.jpg', 
    'images/2.jpg', 
    'images/3.jpg',
    'images/4.jpg', 
    'images/5.jpg',  
    'images/9.jpg',
    'images/10.jpg',
    'images/11.jpg',
    'images/12.jpg',
    'images/13.jpg',
    'images/14.jpg',
    'images/15.jpg',
    'images/16.jpg',
    'images/17.jpg'
];

const musicList = [
    { name: "NAPIYOSUN YESELA", artist: "BLOK3", src: "music/1.mp3", art: "images/music1.jpg" },
    { name: "Him & I", artist: "G-Eazy & Halsey", src: "music/2.m4a", art: "images/music2.jpg" },
    { name: "KUSURAMA BAKMA", artist: "BLOK3", src: "music/3.mp3", art: "images/music3.jpg" }
];

let currentTrackIndex = 0;
const music = document.getElementById('bgMusic');
const playPauseBtn = document.getElementById('play-pause');
const trackArt = document.getElementById('track-art');
const bgBlur = document.getElementById('bg-blur');
const progressBar = document.getElementById('progress-bar');

// 2. Vaqtni formatlash (0:59 -> 1:00)
function formatTime(seconds) {
    if (isNaN(seconds)) return "0:00";
    let min = Math.floor(seconds / 60);
    let sec = Math.floor(seconds % 60);
    return `${min}:${sec < 10 ? '0' + sec : sec}`;
}

// 3. Musiqani yuklash funksiyasi
function loadTrack(index) {
    const track = musicList[index];
    music.src = track.src;
    trackArt.src = track.art;
    bgBlur.style.backgroundImage = `url(${track.art})`;
    document.getElementById('song-name').innerText = track.name;
    document.getElementById('artist-name').innerText = track.artist;
    
    music.onloadeddata = () => {
        document.getElementById('total-duration').innerText = formatTime(music.duration);
    };
}

// 4. Play / Pause boshqaruvi
playPauseBtn.onclick = (e) => {
    e.stopPropagation(); // Kitob varoqlanib ketmasligi uchun
    if (music.paused) {
        music.play();
        playPauseBtn.innerHTML = '<i class="fas fa-pause"></i>';
        trackArt.style.animationPlayState = 'running';
    } else {
        music.pause();
        playPauseBtn.innerHTML = '<i class="fas fa-play"></i>';
        trackArt.style.animationPlayState = 'paused';
    }
};

// 5. Musiqani o'tkazish funksiyalari (Next / Prev)
function nextTrack() {
    currentTrackIndex = (currentTrackIndex + 1) % musicList.length;
    loadTrack(currentTrackIndex);
    music.play();
    playPauseBtn.innerHTML = '<i class="fas fa-pause"></i>';
    trackArt.style.animationPlayState = 'running';
}

function prevTrack() {
    currentTrackIndex = (currentTrackIndex - 1 + musicList.length) % musicList.length;
    loadTrack(currentTrackIndex);
    music.play();
    playPauseBtn.innerHTML = '<i class="fas fa-pause"></i>';
    trackArt.style.animationPlayState = 'running';
}

// Tugmalarni JS orqali bog'lash
document.getElementById('next-btn').onclick = (e) => { e.stopPropagation(); nextTrack(); };
document.getElementById('prev-btn').onclick = (e) => { e.stopPropagation(); prevTrack(); };

// Musiqa tugasa o'zi keyingisiga o'tsin
music.onended = nextTrack;

// 6. Progress bar yangilanishi
music.ontimeupdate = () => {
    const progress = (music.currentTime / music.duration) * 100;
    progressBar.value = progress || 0;
    document.getElementById('current-time').innerText = formatTime(music.currentTime);
};

progressBar.oninput = () => {
    music.currentTime = (progressBar.value / 100) * music.duration;
};

// 7. Kitob sahifalarini generatsiya qilish
function generatePages() {
    const book = document.querySelector('#book');
    let html = '';
    const decors = `<div class="corner-decor top-right"></div><div class="corner-decor bottom-left"></div>`;

    // A) MUQOVA (ORQA FONDA RASM BILAN) - 'images/cover.jpg' o'rniga o'z rasmingiz yo'lini yozing
    html += `
        <div class="page">
            <div class="front cover-page" style="background-image: url('images/cover.jpg');">
                <div class="cover-content">
                    <h1>Kichik syurpriz ❤️</h1>
                </div>
            </div>
            <div class="back">
                ${decors}
                <div class="img-frame"><img src="${myImages[0]}"></div>
            </div>
        </div>
    `;

    // B) O'RTADAGI VAROQLAR
    for (let i = 1; i < myImages.length - 1; i += 2) {
        html += `
            <div class="page">
                <div class="front">${decors}<div class="img-frame"><img src="${myImages[i]}"></div></div>
                <div class="back">${decors}<div class="img-frame"><img src="${myImages[i+1]}"></div></div>
            </div>
        `;
    }

    // C) OXIRGI VAROQ (ORQA FONDA RASM BILAN) - 'images/end.jpg' o'rniga o'z rasmingiz yo'lini yozing
    html += `
        <div class="page">
            <div class="front">
                ${decors}
                <div class="img-frame"><img src="${myImages[myImages.length - 1]}"></div>
            </div>
            <div class="back cover-page" style="background-image: url('images/end.jpg');">
                <div class="cover-content">
                    <h1>Sani sevaman malikacham 🤗❤️</h1>
                </div>
            </div>
        </div>
    `;

    book.innerHTML = html;
    initBookLogic();
}

// 8. Kitob mantig'i (Z-index va o'tishlar)
function initBookLogic() {
    const pages = document.querySelectorAll('.page');
    
    pages.forEach((page, index) => {
        page.style.zIndex = pages.length - index;

        const front = page.querySelector('.front');
        const back = page.querySelector('.back');

        front.onclick = () => {
            page.classList.add('flipped');
            setTimeout(() => {
                page.style.zIndex = index + 1;
            }, 300);

            if (index === 0) {
                let shift = window.innerWidth < 768 ? "40%" : "50%";
                document.getElementById('book').style.transform = `translateX(${shift})`;
            }
        };

        back.onclick = () => {
            page.classList.remove('flipped');
            setTimeout(() => {
                page.style.zIndex = pages.length - index;
            }, 300);

            if (index === 0) {
                document.getElementById('book').style.transform = "translateX(0%)";
            }
        };
    });
}

// 9. Dasturni ishga tushirish
loadTrack(currentTrackIndex);
generatePages();