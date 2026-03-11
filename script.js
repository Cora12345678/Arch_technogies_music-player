// --- Data ---
const songsData = [
    {
        id: 1,
        title: "Tum Hi Ho",
        artist: "Arijit Singh",
        category: "Hindi",
        src: "assets/tum hi ho.mp3",
        cover: "https://images.unsplash.com/photo-1619983081563-430f63602796?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80",
        duration: "04:22",
        favorite: false
    },
    {
        id: 2,
        title: "Pasoori",
        artist: "Ali Sethi X Shae Gill",
        category: "Urdu",
        src: "assets/Pasoori - Ali Sethi.mp3",
        cover: "assets/Capture.PNG",
        duration: "03:44",
        favorite: false
    },
    {
        id: 3,
        title: "Blinding Lights",
        artist: "The Weeknd",
        category: "English",
        src: "assets/Blinding Lights.mp3",
        cover: "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80",
        duration: "03:20",
        favorite: false
    },
    {
        id: 4,
        title: "Tajdar-e-Haram",
        artist: "Atif Aslam",
        category: "Urdu",
        src: "assets/tajdar-e-haram.mp3",
        cover: "https://images.unsplash.com/photo-1528629297340-d1d466945dc5?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80",
        duration: "10:11",
        favorite: false
    },
    {
        id: 5,
        title: "Shape of You",
        artist: "Ed Sheeran",
        category: "English",
        src: "assets/Shape_Of_You.mp3",
        cover: "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80",
        duration: "03:53",
        favorite: false
    },
    {
        id: 6,
        title: "Chaleya",
        artist: "Arijit Singh",
        category: "Hindi",
        src: "assets/chaleya.mp3",
        cover: "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80",
        duration: "03:20",
        favorite: false
    }
];

// --- DOM Elements ---
const audio = document.getElementById('audio-element');
const playPauseBtn = document.getElementById('play-pause-btn');
const playIcon = document.getElementById('play-icon');
const prevBtn = document.getElementById('prev-btn');
const nextBtn = document.getElementById('next-btn');
const loopBtn = document.getElementById('loop-btn');
const shuffleBtn = document.getElementById('shuffle-btn');
const progressBar = document.getElementById('progress-bar');
const volumeSlider = document.getElementById('volume-slider');
const currentTimeEl = document.getElementById('current-time');
const durationEl = document.getElementById('duration');

const albumCover = document.getElementById('album-cover');
const songTitle = document.getElementById('song-title');
const songArtist = document.getElementById('song-artist');
const nowPlayingSection = document.querySelector('.now-playing-section');
const favoriteBtn = document.getElementById('favorite-btn');
const downloadBtn = document.getElementById('download-btn');

const playlistContainer = document.getElementById('playlist');
const searchInput = document.getElementById('search-input');
const categoryBtns = document.querySelectorAll('.category-btn');
const songCountEl = document.getElementById('song-count');

// Modal Elements
const welcomeModal = document.getElementById('welcome-modal');
const userNameInput = document.getElementById('user-name-input');
const favSongInput = document.getElementById('fav-song-input');
const startAppBtn = document.getElementById('start-app-btn');
const mainApp = document.getElementById('main-app');
const greetingText = document.getElementById('greeting-text');

// --- State Variables ---
let currentSongIndex = 0;
let isPlaying = false;
let isLooping = false;
let isShuffle = false;
let currentPlaylist = [...songsData];

// --- Initialization ---
function init() {
    renderPlaylist(currentPlaylist);
    loadSong(currentPlaylist[currentSongIndex]);
    changeVolume(); // Set initial volume
}

// --- Onboarding Logic ---
function startApp() {
    const userName = userNameInput.value.trim() || 'Guest';
    const favSong = favSongInput.value.trim();

    // Set Greeting
    greetingText.innerHTML = `Hi, <span>${userName}</span>!`;

    // Add their custom song if they entered one 
    // Since we don't have the audio file for whatever they type, we'll map a random internal mp3 to it
    if (favSong) {
        const newSong = {
            id: songsData.length + 1,
            title: favSong,
            artist: userName,
            category: "Favorites",
            src: "assets/song1.mp3", // Give them an internal song as a placeholder
            cover: "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80",
            duration: "04:22",
            favorite: true // Mark as their favorite automatically
        };
        songsData.unshift(newSong); // Add to beginning of library
        currentPlaylist = [...songsData];
        // Automatically load their new favorite song
        currentSongIndex = 0;
    }

    // Hide Modal & Remove Blur
    welcomeModal.classList.add('hidden');
    mainApp.classList.remove('blur-bg');

    // Re-initialize player with updated data
    init();
}

startAppBtn.addEventListener('click', startApp);

// --- Player Functions ---
function loadSong(song) {
    if (!song) return;
    audio.src = song.src;
    songTitle.textContent = song.title;
    songArtist.textContent = song.artist;
    albumCover.src = song.cover;
    durationEl.textContent = song.duration;

    // Highlight in playlist
    const allItems = document.querySelectorAll('.playlist-item');
    allItems.forEach(item => item.classList.remove('active'));

    const activeItem = document.querySelector(`.playlist-item[data-id="${song.id}"]`);
    if (activeItem) {
        activeItem.classList.add('active');
        activeItem.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }

    // Update Favorite Icon
    updateFavoriteIcon(song);

    if (isPlaying) {
        audio.play();
    }
}

function updateFavoriteIcon(song) {
    if (song.favorite) {
        favoriteBtn.innerHTML = '<i class="fa-solid fa-heart"></i>';
        favoriteBtn.classList.add('liked');
    } else {
        favoriteBtn.innerHTML = '<i class="fa-regular fa-heart"></i>';
        favoriteBtn.classList.remove('liked');
    }
}

function toggleFavorite() {
    const song = currentPlaylist[currentSongIndex];
    if (song) {
        song.favorite = !song.favorite;
        updateFavoriteIcon(song);
        renderPlaylist(currentPlaylist); // re-render to update the list if sorting by favorites
    }
}

function downloadSong() {
    const song = currentPlaylist[currentSongIndex];
    if (!song) return;

    const a = document.createElement('a');
    a.href = song.src;
    a.download = `${song.title} - ${song.artist}.mp3`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
}

function playSong() {
    isPlaying = true;
    audio.play();
    playIcon.className = 'fa-solid fa-pause';
    nowPlayingSection.classList.add('playing');
}

function pauseSong() {
    isPlaying = false;
    audio.pause();
    playIcon.className = 'fa-solid fa-play';
    nowPlayingSection.classList.remove('playing');
}

function prevSong() {
    currentSongIndex--;
    if (currentSongIndex < 0) {
        currentSongIndex = currentPlaylist.length - 1;
    }
    loadSong(currentPlaylist[currentSongIndex]);
    if (isPlaying) playSong();
}

function nextSong() {
    if (isShuffle) {
        let newIndex = currentSongIndex;
        while (newIndex === currentSongIndex && currentPlaylist.length > 1) {
            newIndex = Math.floor(Math.random() * currentPlaylist.length);
        }
        currentSongIndex = newIndex;
    } else {
        currentSongIndex++;
        if (currentSongIndex > currentPlaylist.length - 1) {
            currentSongIndex = 0;
        }
    }
    loadSong(currentPlaylist[currentSongIndex]);
    if (isPlaying) playSong();
}

function toggleLoop() {
    isLooping = !isLooping;
    audio.loop = isLooping;
    loopBtn.classList.toggle('active', isLooping);
}

function toggleShuffle() {
    isShuffle = !isShuffle;
    shuffleBtn.classList.toggle('active', isShuffle);
}

// --- Progress & Time ---
function updateProgressBar(e) {
    if (!audio.duration) return;
    const { duration, currentTime } = audio;
    const progressPercent = (currentTime / duration) * 100;
    progressBar.value = progressPercent;

    // format time
    currentTimeEl.textContent = formatTime(currentTime);
    if (!isNaN(duration)) {
        durationEl.textContent = formatTime(duration);
    }

    updateBackgroundSize(progressBar);
}

function setProgressBar(e) {
    const width = this.clientWidth;
    const clickX = e.offsetX;
    const duration = audio.duration;
    if (duration) {
        audio.currentTime = (clickX / width) * duration;
    }
}

function updateBackgroundSize(input) {
    const min = input.min || 0;
    const max = input.max || 100;
    const value = input.value;
    const percentage = ((value - min) / (max - min)) * 100;
    input.style.backgroundSize = `${percentage}% 100%`;
}

function formatTime(seconds) {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
}

// --- Volume Control ---
function changeVolume() {
    audio.volume = volumeSlider.value;
    updateBackgroundSize(volumeSlider);

    const volIcon = document.getElementById('vol-icon');
    if (audio.volume === 0) {
        volIcon.className = 'fa-solid fa-volume-xmark';
    } else if (audio.volume < 0.5) {
        volIcon.className = 'fa-solid fa-volume-low';
    } else {
        volIcon.className = 'fa-solid fa-volume-high';
    }
}

// --- Playlist & Filtering ---
function renderPlaylist(songs) {
    playlistContainer.innerHTML = '';
    songCountEl.textContent = `${songs.length} songs`;

    if (songs.length === 0) {
        playlistContainer.innerHTML = `<li style="text-align:center; padding: 20px; color: var(--text-muted);">No songs found</li>`;
        return;
    }

    songs.forEach((song, index) => {
        const li = document.createElement('li');
        li.className = `playlist-item ${currentPlaylist[currentSongIndex]?.id === song.id ? 'active' : ''}`;
        li.dataset.id = song.id;

        li.innerHTML = `
            <img src="${song.cover}" alt="${song.title}" class="item-img">
            <div class="item-info">
                <h4>${song.title}</h4>
                <p>${song.artist} • ${song.category}</p>
            </div>
            <div class="item-duration">${song.duration}</div>
        `;

        li.addEventListener('click', () => {
            currentPlaylist = songs; // update current playlist context
            currentSongIndex = index;
            loadSong(currentPlaylist[currentSongIndex]);
            playSong();
        });

        playlistContainer.appendChild(li);
    });
}

function filterSongs() {
    const searchTerm = searchInput.value.toLowerCase();
    const activeCategoryBtn = document.querySelector('.category-btn.active');
    const categoryFilter = activeCategoryBtn.dataset.category;

    let filteredSongs = songsData;

    // Filter by category
    if (categoryFilter === 'Favorites') {
        filteredSongs = filteredSongs.filter(song => song.favorite);
    } else if (categoryFilter !== 'All') {
        filteredSongs = filteredSongs.filter(song => song.category === categoryFilter);
    }

    // Filter by search
    if (searchTerm) {
        filteredSongs = filteredSongs.filter(song =>
            song.title.toLowerCase().includes(searchTerm) ||
            song.artist.toLowerCase().includes(searchTerm)
        );
    }

    renderPlaylist(filteredSongs);
}

// --- Event Listeners ---
playPauseBtn.addEventListener('click', () => {
    if (isPlaying) pauseSong();
    else playSong();
});

favoriteBtn.addEventListener('click', toggleFavorite);
downloadBtn.addEventListener('click', downloadSong);

prevBtn.addEventListener('click', prevSong);
nextBtn.addEventListener('click', nextSong);
audio.addEventListener('timeupdate', updateProgressBar);
audio.addEventListener('ended', nextSong);

progressBar.addEventListener('click', setProgressBar);
progressBar.addEventListener('input', () => {
    updateBackgroundSize(progressBar);
    if (audio.duration) {
        audio.currentTime = (progressBar.value / 100) * audio.duration;
    }
});

volumeSlider.addEventListener('input', changeVolume);
loopBtn.addEventListener('click', toggleLoop);
shuffleBtn.addEventListener('click', toggleShuffle);

searchInput.addEventListener('input', filterSongs);

categoryBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        // Remove active class from all
        categoryBtns.forEach(b => b.classList.remove('active'));
        // Add active class to clicked
        btn.classList.add('active');
        filterSongs();
    });
});

// Setup metadata loaded for accurate duration if not hardcoded
audio.addEventListener('loadedmetadata', () => {
    durationEl.textContent = formatTime(audio.duration);
});

// Remove loader when DOM is ready and reveal the modal
document.addEventListener('DOMContentLoaded', () => {
    // Adding a slight delay to let the user see the cool animation layout
    setTimeout(() => {
        const loader = document.getElementById('loader-wrapper');
        if (loader) loader.classList.add('hidden');

        // Remove 'hidden' from modal to fade it in nicely
        welcomeModal.classList.remove('hidden');
    }, 1500);
});
