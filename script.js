// MonkMusic Script - CÓDIGO COMPLETO CORRIGIDO
// ==================================================================
// CORREÇÕES PRINCIPAIS:
// 1. Função handleSearch totalmente corrigida
// 2. Verificações de segurança em todo o código
// 3. Tratamento robusto de dados
// 4. Performance otimizada
// ==================================================================

// CORRIGIDO: Inicialização segura dos dados com fallback
let currentData = {
    djs: (typeof mockDjs !== 'undefined') ? mockDjs : [],
    artists: (typeof mockArtists !== 'undefined') ? mockArtists : [],
    playlists: (typeof mockPlaylists !== 'undefined') ? mockPlaylists : [],
    //genres: (typeof mockGenres !== 'undefined') ? mockGenres : [],
    musics: (typeof mockMusics !== 'undefined') ? mockMusics : [],
    albums: (typeof mockAlbums !== 'undefined') ? mockAlbums : [],
    singles: (typeof mockSingles !== 'undefined') ? mockSingles : [],
    vinyls: (typeof mockVinyls !== 'undefined') ? mockVinyls : [],
    instrumental: (typeof mockInstrumental !== 'undefined') ? mockInstrumental : [],
    featured: (typeof mockFeatured !== 'undefined') ? mockFeatured : [],
    timeline: (typeof mockTimeline !== 'undefined') ? mockTimeline : []
};

// CORRIGIDO: Backup dos dados originais para reset correto
const originalData = {
    djs: (typeof mockDjs !== 'undefined') ? [...mockDjs] : [],
    artists: (typeof mockArtists !== 'undefined') ? [...mockArtists] : [],
    playlists: (typeof mockPlaylists !== 'undefined') ? [...mockPlaylists] : [],
    //genres: (typeof mockGenres !== 'undefined') ? [...mockGenres] : [],
    musics: (typeof mockMusics !== 'undefined') ? [...mockMusics] : [],
    albums: (typeof mockAlbums !== 'undefined') ? [...mockAlbums] : [],
    singles: (typeof mockSingles !== 'undefined') ? [...mockSingles] : [],
    vinyls: (typeof mockVinyls !== 'undefined') ? [...mockVinyls] : [],
    instrumental: (typeof mockInstrumental !== 'undefined') ? [...mockInstrumental] : [],
    featured: (typeof mockFeatured !== 'undefined') ? [...mockFeatured] : [],
    timeline: (typeof mockTimeline !== 'undefined') ? [...mockTimeline] : []
};

// Escape HTML utilitário
function escapeHtml(str) {
    if (!str) return '';
    return String(str).replace(/&/g, '&amp;')
                      .replace(/"/g, '&quot;')
                      .replace(/</g, '&lt;')
                      .replace(/>/g, '&gt;');
}

// CORRIGIDO: DOM Elements com verificação de existência
const searchInput = document.getElementById('searchInput');
const navButtons = document.querySelectorAll('.nav-btn');
const tabContents = document.querySelectorAll('.tab-content');

// CORRIGIDO: Variável para debounce
let searchTimeout;

// Initialize the app
document.addEventListener('DOMContentLoaded', function() {
    console.log('MonkMusic: DOM loaded, inicializando...');
    try {
        initializeApp();
        setupEventListeners();
        console.log('MonkMusic: Inicialização concluída com sucesso');
    } catch (error) {
        console.error('Erro durante inicialização:', error);
    }
});

function initializeApp() {
    updateStats();
    renderAllAlbums();
    renderAllArtists();
    renderAllPlaylists();
    //renderGenres();
    renderTimeline();
    renderMusics();
    renderAllSingles();
    renderAllVinyls();
    renderAllDjs();
    renderAllInstrumental();
    renderFeaturedAlbums();
    renderRecentlyPlayed();
}

// CORRIGIDO: Setup de event listeners aprimorado
function setupEventListeners() {
    // Verificar se searchInput existe antes de adicionar listeners
    if (searchInput) {
        // Usar debounce para melhor performance
        searchInput.addEventListener('input', debouncedHandleSearch);
        
        // Também escutar evento de keypress para enter
        searchInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                e.preventDefault();
                handleSearch();
            }
        });
        
        console.log('Event listeners de busca configurados com sucesso');
    } else {
        console.warn('Elemento searchInput não encontrado. Verifique se o elemento com ID "searchInput" existe no DOM.');
    }
    
    // Configurar navegação entre tabs
    navButtons.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            const tab = btn.dataset.tab;
            if (tab) {
                switchTab(tab);
            }
        });
    });
    
    // CORRIGIDO: Botões de volta com verificação
    const backToArtistsBtn = document.getElementById('backToArtistsBtn');
    if (backToArtistsBtn) {
        backToArtistsBtn.addEventListener('click', (e) => {
            e.preventDefault();
            switchTab('artists');
        });
    }
    
    const backToTimelineBtn = document.getElementById('backToTimelineBtn');
    if (backToTimelineBtn) {
        backToTimelineBtn.addEventListener('click', (e) => {
            e.preventDefault();
            switchTab('timeline');
        });
    }
}

// ==================================================================
// FUNÇÃO HANDLESEARCH PRINCIPAL - TOTALMENTE CORRIGIDA
// ==================================================================

function handleSearch() {
    // CORREÇÃO 1: Verificar se searchInput existe
    if (!searchInput) {
        console.warn('Elemento searchInput não encontrado');
        return;
    }
    
    const searchTerm = searchInput.value.toLowerCase().trim();
    
    if (searchTerm) {
        // CORREÇÃO 2: Filtros seguros com verificações de propriedades
        currentData = {
            albums: (originalData.albums || []).filter(album => {
                if (!album) return false;
                return (album.title && album.title.toLowerCase().includes(searchTerm)) ||
                       (album.artist && album.artist.toLowerCase().includes(searchTerm)) ||
                       (album.name && album.name.toLowerCase().includes(searchTerm));
            }),
            
            artists: (originalData.artists || []).filter(artist => {
                if (!artist) return false;
                return (artist.name && artist.name.toLowerCase().includes(searchTerm)) ||
                       (artist.title && artist.title.toLowerCase().includes(searchTerm));
            }),
            
            playlists: (originalData.playlists || []).filter(playlist => {
                if (!playlist) return false;
                return (playlist.name && playlist.name.toLowerCase().includes(searchTerm)) ||
                       (playlist.title && playlist.title.toLowerCase().includes(searchTerm));
            }),
            /*
            genres: (originalData.genres || []).filter(genre => {
                if (!genre) return false;
                return (genre.name && genre.name.toLowerCase().includes(searchTerm)) ||
                       (genre.title && genre.title.toLowerCase().includes(searchTerm));
            }),
            */
            timeline: (originalData.timeline || []).filter(time => {
                if (!time) return false;
                return (time.name && time.name.toLowerCase().includes(searchTerm)) ||
                       (time.title && time.title.toLowerCase().includes(searchTerm)) ||
                       (time.year && time.year.toString().includes(searchTerm));
            }),
            
            musics: (originalData.musics || []).filter(music => {
                if (!music) return false;
                return (music.title && music.title.toLowerCase().includes(searchTerm)) ||
                       (music.artist && music.artist.toLowerCase().includes(searchTerm)) ||
                       (music.name && music.name.toLowerCase().includes(searchTerm));
            }),
            
            singles: (originalData.singles || []).filter(single => {
                if (!single) return false;
                return (single.title && single.title.toLowerCase().includes(searchTerm)) ||
                       (single.artist && single.artist.toLowerCase().includes(searchTerm)) ||
                       (single.name && single.name.toLowerCase().includes(searchTerm));
            }),
            
            vinyls: (originalData.vinyls || []).filter(vinyl => {
                if (!vinyl) return false;
                return (vinyl.title && vinyl.title.toLowerCase().includes(searchTerm)) ||
                       (vinyl.artist && vinyl.artist.toLowerCase().includes(searchTerm)) ||
                       (vinyl.name && vinyl.name.toLowerCase().includes(searchTerm));
            }),
            
            instrumental: (originalData.instrumental || []).filter(inst => {
                if (!inst) return false;
                return (inst.title && inst.title.toLowerCase().includes(searchTerm)) ||
                       (inst.name && inst.name.toLowerCase().includes(searchTerm)) ||
                       (inst.artist && inst.artist.toLowerCase().includes(searchTerm));
            }),
            
            djs: (originalData.djs || []).filter(dj => {
                if (!dj) return false;
                return (dj.name && dj.name.toLowerCase().includes(searchTerm)) ||
                       (dj.title && dj.title.toLowerCase().includes(searchTerm));
            }),
            
            featured: (originalData.featured || []).filter(item => {
                if (!item) return false;
                return (item.title && item.title.toLowerCase().includes(searchTerm)) || 
                       (item.artist && item.artist.toLowerCase().includes(searchTerm)) ||
                       (item.name && item.name.toLowerCase().includes(searchTerm));
            })
        };
    } else {
        // CORREÇÃO 3: Reset seguro para dados originais usando cópia profunda
        currentData = {
            albums: [...(originalData.albums || [])],
            artists: [...(originalData.artists || [])],
            playlists: [...(originalData.playlists || [])],
            //genres: [...(originalData.genres || [])],
            timeline: [...(originalData.timeline || [])],
            musics: [...(originalData.musics || [])],
            singles: [...(originalData.singles || [])],
            vinyls: [...(originalData.vinyls || [])],
            instrumental: [...(originalData.instrumental || [])],
            djs: [...(originalData.djs || [])],
            featured: [...(originalData.featured || [])]
        };
    }

    // CORREÇÃO 4: Re-render com tratamento de erros
    try {
        updateStats();
        renderAllAlbums();
        renderAllArtists();
        renderAllPlaylists();
        //renderGenres();
        renderTimeline();
        renderMusics();
        renderAllSingles();
        renderAllVinyls();
        renderAllDjs();
        renderAllInstrumental();
        renderFeaturedAlbums();
        renderFeaturedPlaylists();
        
        // CORREÇÃO 5: Re-renderizar yearAlbums se estiver ativo
        const yearAlbumsTab = document.getElementById('yearAlbums');
        if (yearAlbumsTab && yearAlbumsTab.classList.contains('active')) {
            const yearTitle = document.getElementById('yearAlbumsTitle');
            if (yearTitle) {
                const yearMatch = yearTitle.textContent.match(/\d{4}/);
                if (yearMatch) {
                    renderAlbumsByYear(yearMatch[0]);
                }
            }
        }
        
        // CORREÇÃO 6: Re-renderizar subalbums se estiver ativo  
        const subAlbumsTab = document.getElementById('subalbums');
        if (subAlbumsTab && subAlbumsTab.classList.contains('active')) {
            const artistTitle = document.getElementById('subalbumsTitle');
            if (artistTitle) {
                const artistMatch = artistTitle.textContent.match(/Álbuns de (.+)/);
                if (artistMatch && artistMatch[1]) {
                    renderSubAlbumsByArtist(artistMatch[1]);
                }
            }
        }
        
        console.log('Busca realizada com sucesso:', searchTerm || 'reset');
        
    } catch (error) {
        console.error('Erro durante re-renderização após busca:', error);
    }
}

// CORREÇÃO 7: Função de debounce para melhorar performance
function debouncedHandleSearch() {
    clearTimeout(searchTimeout);
    searchTimeout = setTimeout(handleSearch, 300); // 300ms de delay
}

function switchTab(tabName) {
    // Remove active class from all nav buttons
    navButtons.forEach(btn => {
        btn.classList.remove('active');
        if (btn.dataset.tab === tabName) {
            btn.classList.add('active');
        }
    });
    
    // Hide all tab contents
    tabContents.forEach(content => {
        content.classList.remove('active');
        if (content.id === tabName) {
            content.classList.add('active');
        }
    });
}

function updateStats() {
    const albumCountEl = document.getElementById('albumCount');
    const artistCountEl = document.getElementById('artistCount');
    const playlistCountEl = document.getElementById('playlistCount');
    const genreCountEl = document.getElementById('genreCount');
    
    if (albumCountEl) albumCountEl.textContent = (currentData.albums || []).length;
    if (artistCountEl) artistCountEl.textContent = (currentData.artists || []).length;
    if (playlistCountEl) playlistCountEl.textContent = (currentData.playlists || []).length;
    //if (genreCountEl) genreCountEl.textContent = (currentData.genres || []).length;
}

/*===============================================================================
=================================================================================*/

// Funções de renderização featuredAlbums
function renderFeaturedAlbums() {
    const container = document.getElementById('featuredAlbums');
    if (!container) return;
    
    const featuredAlbums = (currentData.featured || [])
        .slice()
        .sort((a, b) => (b.id || 0) - (a.id || 0))
        .slice(0, 4);
    
    container.innerHTML = featuredAlbums.map(item => `
        <div class="album-card" data-id="${item.id || ''}" data-type="featured">
            <img src="${item.image || ''}" alt="${escapeHtml(item.title || '')}" class="album-image">
            <div class="album-info">
                <h3 class="album-title">${escapeHtml(item.title || '')}</h3>
                <p class="album-artist">${escapeHtml(item.artist || '')}</p>
                <div class="album-details">
                    <div class="year-format">
                        <span class="year">${item.year || ''}</span>
                        <span class="format">${item.format || ''}</span>
                    </div>
                </div>
            </div>
        </div>
    `).join('');
	
	setupBannerFillColorEvents('featuredAlbums');
    
    // CORRIGIDO: Adicionar event listeners para os cards
    container.querySelectorAll('.album-card').forEach(card => {
        card.addEventListener('click', function() {
            const id = parseInt(this.dataset.id);
            const type = this.dataset.type;
            if (!isNaN(id)) {
                openPlayer(id, type);
            }
        });
    });

}

/*===============================================================================
=================================================================================*/

// Funções de renderização allInstrumental
function renderAllInstrumental() {
    const container = document.getElementById('allInstrumental');
    if (!container) return;
    
    const sortedInstrumental = (currentData.instrumental || [])
        .slice()
        .sort((a, b) => (b.id || 0) - (a.id || 0))
        .slice(0, 10);

    container.innerHTML = sortedInstrumental.map(inst => `
        <div class="album-card" data-id="${inst.id || ''}" data-type="instrumental">
            <img src="${inst.image || ''}" alt="${escapeHtml(inst.title || inst.name || '')}" class="album-image">
            <div class="album-info">
                <h3 class="album-title">${escapeHtml(inst.title || inst.name || '')}</h3>
                <p class="album-artist">${escapeHtml(inst.name || inst.artist || '')}</p>
            </div>
        </div>
    `).join('');
	
	setupBannerFillColorEvents('allInstrumental');
    
    // CORRIGIDO: Adicionar event listeners
    container.querySelectorAll('.album-card').forEach(card => {
        card.addEventListener('click', function() {
            const id = parseInt(this.dataset.id);
            const type = this.dataset.type;
            if (!isNaN(id)) {
                openPlayer(id, type);
            }
        });
    });
}

/*===============================================================================
=================================================================================*/

// Funções de renderização allDjs
function renderAllDjs() {
    const container = document.getElementById('allDjs');
    if (!container) return;
    
    const sortedDjs = (currentData.djs || [])
        .slice()
        .sort((a, b) => (b.id || 0) - (a.id || 0))
        .slice(0, 10);

    container.innerHTML = sortedDjs.map(dj => `
        <div class="album-card" data-id="${dj.id || ''}" data-type="djs">
            <img src="${dj.image || ''}" alt="${escapeHtml(dj.name || '')}" class="album-image">
            <div class="album-info">
                <h3 class="album-title">${escapeHtml(dj.name || '')}</h3>
            </div>
        </div>
    `).join('');
	
	setupBannerFillColorEvents('allDjs');
    
    // CORRIGIDO: Adicionar event listeners
    container.querySelectorAll('.album-card').forEach(card => {
        card.addEventListener('click', function() {
            const id = parseInt(this.dataset.id);
            const type = this.dataset.type;
            if (!isNaN(id)) {
                openPlayer(id, type);
            }
        });
    });
}

/*===============================================================================
=================================================================================*/

// Funções de renderização allMusics
function renderMusics() {
    const container = document.getElementById('allMusics');
    if (!container) return;
    
    const sortedMusics = (currentData.musics || [])
        .slice()
        .sort((a, b) => (b.id || 0) - (a.id || 0))
        .slice(0, 4);

    // Verifica se a lista está vazia
    if (sortedMusics.length === 0) {
        container.innerHTML = `<p class="icon solid fa-record-vinyl empty-message"> Nenhuma música encontrada.</p>`;
        return;
    }

    container.innerHTML = sortedMusics.map(music => `
        <div class="album-card" data-id="${music.id || ''}" data-type="musics">
            <img src="${music.image || ''}" alt="${escapeHtml(music.title || '')}" class="album-image">
            <div class="album-info">
                <h3 class="album-title">${escapeHtml(music.title || '')}</h3>
                <p class="album-artist">${escapeHtml(music.artist || '')}</p>
            </div>
        </div>
    `).join('');
	
	setupBannerFillColorEvents('allMusics');

    // Adicionar eventos
    container.querySelectorAll('.album-card').forEach(card => {
        card.addEventListener('click', function() {
            const id = parseInt(this.dataset.id);
            const type = this.dataset.type;
            if (!isNaN(id)) {
                openPlayer(id, type);
            }
        });
    });
}

/*===============================================================================
=================================================================================*/

// Funções de renderização allAlbums
function renderAllAlbums() {
    const container = document.getElementById('allAlbums');
    if (!container) return;

    const combinedAlbums = [
        ...(currentData.featured || []).filter(item =>
            item.format?.toLowerCase().includes('album')
        )
    ].sort((a, b) => (b.id || 0) - (a.id || 0));

    container.innerHTML = combinedAlbums.map(album => `
        <div class="album-card" data-id="${album.id || ''}" data-type="featured">
            <img src="${album.image || ''}" alt="${escapeHtml(album.title || '')}" class="album-image">
            <div class="album-info">
                <h3 class="album-title">${escapeHtml(album.title || '')}</h3>
                <p class="album-artist">${escapeHtml(album.artist || '')}</p>
            </div>
        </div>
    `).join('');

    setupBannerFillColorEvents('allAlbums');

    container.querySelectorAll('.album-card').forEach(card => {
        card.addEventListener('click', function () {
            const id = parseInt(this.dataset.id);
            const type = this.dataset.type;
            if (!isNaN(id)) {
                openPlayer(id, type);
            }
        });
    });
}


/*===============================================================================
=================================================================================*/

// Funções de renderização allArtists
function renderAllArtists() {
    const container = document.getElementById('allArtists');
    if (!container) return;

    const allAlbums = [
        ...(currentData.albums || []),
        ...(currentData.singles || []),
        ...(currentData.vinyls || []),
        ...(currentData.featured || [])
    ];

    const albumsByTitle = allAlbums.reduce((acc, album) => {
        if (!album || !album.artist) return acc;
        if (!acc[album.artist]) {
            acc[album.artist] = {
                name: album.artist,
                albumCount: 0,
                image: album.image || 'default-artist.jpg' // usa imagem do primeiro álbum ou padrão
            };
        }
        acc[album.artist].albumCount++;
        return acc;
    }, {});

    // const subeAlbumYears = Object.values(albumsByTitle);
	// Inverter a ordem dos artistas: o último vem primeiro
    const subeAlbumYears = Object.values(albumsByTitle).reverse();

    container.innerHTML = subeAlbumYears.map(artist => `
        <div class="artist-card" data-artist="${artist.name}">
            <img src="${artist.image}" alt="${escapeHtml(artist.name)}" class="artist-image">
            <div class="artist-info">
                <h3>${escapeHtml(artist.name)}</h3>
                <p>${artist.albumCount} Álbuns</p>
            </div>
        </div>
    `).join('');
	
	setupBannerFillColorEvents('allArtists');

    // Eventos de clique nos artistas
    container.querySelectorAll('.artist-card').forEach(card => {
        card.addEventListener('click', function() {
            const artist = this.dataset.artist;
            renderSubAlbumsByArtist(artist);
        });
    });
}

// Funções de renderização suballAlbums
function renderSubAlbumsByArtist(artist) {
    const allAlbums = [
        ...(currentData.albums || []),
        ...(currentData.singles || []),
        ...(currentData.vinyls || []),
        ...(currentData.featured || [])
    ]
    .slice()
    .sort((a, b) => (b.id || 0) - (a.id || 0))
    .slice(0, 100);

    const albums = allAlbums.filter(album => album && album.artist === artist);
    const container = document.getElementById('suballAlbums');
    const title = document.getElementById('subalbumsTitle');

    if (!container || !title) return;

    title.textContent = `Álbuns de ${artist}`;
    container.innerHTML = albums.map(album => {
        let albumType = 'album';
        if ((currentData.singles || []).find(s => s.id === album.id)) albumType = 'singles';
        else if ((currentData.albums || []).find(v => v.id === album.id)) albumType = 'albums';
        else if ((currentData.vinyls || []).find(v => v.id === album.id)) albumType = 'vinyls';
        else if ((currentData.featured || []).find(f => f.id === album.id)) albumType = 'featured';

        return `
            <div class="album-card" data-id="${album.id || ''}" data-type="${albumType}">
                <img src="${album.image || ''}" alt="${escapeHtml(album.title || '')}" class="album-image">
                <div class="album-info">
                    <h3 class="album-title">${escapeHtml(album.title || '')}</h3>
                    <p class="album-artist">${escapeHtml(album.artist || '')}</p>
                    <div class="album-details">
                        <div class="artist-format">
                            <span class="artist">${album.artist || ''}</span>
                            <span class="format">${album.format || ''}</span>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }).join('');
	
	setupBannerFillColorEvents('suballAlbums');

    container.querySelectorAll('.album-card').forEach(card => {
        card.addEventListener('click', function(e) {
            e.preventDefault();
            const id = parseInt(this.dataset.id);
            const type = this.dataset.type;
            console.log(`Clicou no álbum: id=${id}, type=${type}`);
            if (!isNaN(id)) {
                openPlayer(id, type);
            }
        });
    });

    switchTab('subalbums');
}

/*===============================================================================
=================================================================================*/

// Funções de renderização allVinyls
function renderAllVinyls() {
    const container = document.getElementById('allVinyls');
    if (!container) return;

    const combinedVinyls = [
        ...(currentData.featured || []).filter(item =>
            item.format?.toLowerCase().includes('vinyl')
        )
    ].sort((a, b) => (b.id || 0) - (a.id || 0));

    container.innerHTML = combinedVinyls.map(album => `
        <div class="album-card" data-id="${album.id || ''}" data-type="featured">
            <img src="${album.image || ''}" alt="${escapeHtml(album.title || '')}" class="album-image">
            <div class="album-info">
                <h3 class="album-title">${escapeHtml(album.title || '')}</h3>
                <p class="album-artist">${escapeHtml(album.artist || '')}</p>
            </div>
        </div>
    `).join('');

    setupBannerFillColorEvents('allVinyls');

    container.querySelectorAll('.album-card').forEach(card => {
        card.addEventListener('click', function () {
            const id = parseInt(this.dataset.id);
            const type = this.dataset.type;
            if (!isNaN(id)) {
                openPlayer(id, type);
            }
        });
    });
}

/*===============================================================================
=================================================================================*/

// Funções de renderização allSingles
function renderAllSingles() {
    const container = document.getElementById('allSingles');
    if (!container) return;

    const combinedSingles = [
        ...(currentData.featured || []).filter(item =>
            item.format?.toLowerCase().includes('single')
        )
    ].sort((a, b) => (b.id || 0) - (a.id || 0));

    container.innerHTML = combinedSingles.map(album => `
        <div class="album-card" data-id="${album.id || ''}" data-type="featured">
            <img src="${album.image || ''}" alt="${escapeHtml(album.title || '')}" class="album-image">
            <div class="album-info">
                <h3 class="album-title">${escapeHtml(album.title || '')}</h3>
                <p class="album-artist">${escapeHtml(album.artist || '')}</p>
            </div>
        </div>
    `).join('');

    setupBannerFillColorEvents('allSingles');

    container.querySelectorAll('.album-card').forEach(card => {
        card.addEventListener('click', function () {
            const id = parseInt(this.dataset.id);
            const type = this.dataset.type;
            if (!isNaN(id)) {
                openPlayer(id, type);
            }
        });
    });
}

/*===============================================================================
=================================================================================*/

// Funções de renderização allPlaylists
function renderAllPlaylists() {
    const container = document.getElementById('allPlaylists');
    if (!container) return;
    
    const sortedPlaylists = (currentData.playlists || [])
        .slice()
        .sort((a, b) => (b.id || 0) - (a.id || 0))
        .slice(0, 10);
    
    container.innerHTML = sortedPlaylists.map(playlist => `
        <div class="playlist-card" data-id="${playlist.id || ''}" data-type="playlists">
            <img src="${playlist.image || ''}" alt="${escapeHtml(playlist.name || '')}" class="playlist-image">
            <div class="playlist-info">
                <h3 class="playlist-name">${escapeHtml(playlist.name || '')}</h3>
                <button class="playlist-play-btn" data-id="${playlist.id || ''}" data-type="playlist">
                    Play Mix
                </button>
            </div>
        </div>
    `).join('');
	
	setupBannerFillColorEvents('allPlaylists');
    
    // CORRIGIDO: Adicionar event listeners
    container.querySelectorAll('.playlist-play-btn').forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.stopPropagation();
            const id = parseInt(this.dataset.id);
            const type = this.dataset.type;
            if (!isNaN(id)) {
                openPlayer(id, type);
            }
        });
    });
}

/*===============================================================================
=================================================================================*/
/*
// Funções de renderização genres
function renderGenres() {
    const container = document.getElementById('genres');
    if (!container) return;
    
    container.innerHTML = (currentData.genres || []).map(genre => `
        <div class="genre-card">
            <h3 class="genre-name">${escapeHtml(genre.name || '')}</h3>
            <p class="genre-count">${genre.count || 0} faixas</p>
        </div>
    `).join('');
}
*/
/*===============================================================================
=================================================================================*/

// Timeline segura e ordenada corretamente
function renderTimeline() {
    const container = document.getElementById('allTimeline');
    if (!container) return;

    const allAlbums = [
        ...(currentData.albums || []),
        ...(currentData.singles || []),
        ...(currentData.vinyls || []),
        ...(currentData.featured || [])
    ];

    const albumsByYear = allAlbums.reduce((acc, album) => {
        if (!album || !album.year) return acc;
        const yearStr = album.year.toString();
        if (!acc[yearStr]) {
            acc[yearStr] = { name: yearStr, albumCount: 0 };
        }
        acc[yearStr].albumCount++;
        return acc;
    }, {});

    const timelineYears = Object.values(albumsByYear)
        .sort((a, b) => parseInt(b.name) - parseInt(a.name));

    container.innerHTML = timelineYears.map(year => `
        <div class="timeline-card" data-year="${year.name}">
            <h3>${year.name}</h3>
            <p>${year.albumCount} álbuns lançados</p>
        </div>
    `).join('');

    // Evento de clique para cada ano
    container.querySelectorAll('.timeline-card').forEach(card => {
        card.addEventListener('click', function () {
            const year = this.dataset.year;
            renderAlbumsByYear(year);
        });
    });

    setupBannerFillColorEvents('allTimeline');
}

// Lista de álbuns do ano clicado
function renderAlbumsByYear(year) {
    const allAlbums = [
        ...(currentData.albums || []),
        ...(currentData.singles || []),
        ...(currentData.vinyls || []),
        ...(currentData.featured || [])
    ].sort((a, b) => (b.id || 0) - (a.id || 0)); // Ordem decrescente por ID

    const albums = allAlbums.filter(album =>
        album && album.year?.toString() === year.toString()
    );

    const container = document.getElementById('yearAlbumsList');
    const title = document.getElementById('yearAlbumsTitle');
    if (!container || !title) return;

    title.textContent = `Álbuns de ${year}`;
    container.innerHTML = albums.map(album => {
        let albumType = 'albums';
        if ((currentData.singles || []).find(s => s.id === album.id)) albumType = 'singles';
        else if ((currentData.vinyls || []).find(v => v.id === album.id)) albumType = 'vinyls';
        else if ((currentData.featured || []).find(f => f.id === album.id)) albumType = 'featured';

        return `
            <div class="album-card" data-id="${album.id}" data-type="${albumType}">
                <img src="${album.image}" alt="${escapeHtml(album.title)}" class="album-image">
                <div class="album-info">
                    <h3 class="album-title">${escapeHtml(album.title)}</h3>
                    <p class="album-artist">${escapeHtml(album.artist)}</p>
                    <div class="album-details">
                        <div class="year-format">
                            <span class="year">${album.year}</span>
                            <span class="format">${album.format}</span>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }).join('');

    container.querySelectorAll('.album-card').forEach(card => {
        card.addEventListener('click', function (e) {
            e.preventDefault();
            const id = parseInt(this.dataset.id);
            const type = this.dataset.type;
            if (!isNaN(id)) openPlayer(id, type);
        });
    });

    setupBannerFillColorEvents('yearAlbumsList');
    switchTab('yearAlbums');
}

/*===============================================================================
=================================================================================*/

// CORRIGIDO: Função openPlayer melhorada
function openPlayer(id, type) {
    const allSources = {
        album: currentData.albums || [],
        albums: currentData.albums || [],
        playlist: currentData.playlists || [],
        playlists: currentData.playlists || [],
        instrumental: currentData.instrumental || [],
        djs: currentData.djs || [],
        vinyls: currentData.vinyls || [],
        singles: currentData.singles || [],
        musics: currentData.musics || [],
        featured: currentData.featured || []
    };

    let item = (allSources[type] || []).find(el => el.id === id);

    // Tentar buscar em outros arrays como fallback
    if (!item) {
        for (let key in allSources) {
            item = allSources[key].find(el => el.id === id);
            if (item) {
                console.warn(`Tipo original '${type}' não encontrou. Usando '${key}' para id=${id}`);
                type = key; // Atualiza o tipo para correto
                break;
            }
        }
    }

    if (!item) {
        console.error(`Item não encontrado: id=${id}, type=${type}`);
        return;
    }

    // Se for playlist, adapte os campos
    if (type === 'playlist' || type === 'playlists') {
        item = {
            ...item,
            title: item.name || item.title,
            artist: "Vários Artistas",
            year: "2025",
            label: "Play 90 Studio",
            country: "Brasil",
            format: "Playlist"
        };
    }

    // Se for DJ, adapte os campos
    if (type === 'djs') {
        item = {
            ...item,
            title: item.name || item.title,
            artist: "DJ Mix",
            year: "2025",
            label: "Play 90 Studio",
            country: "Brasil",
            format: "Mix"
        };
    }
    
    // Se for Intrumental, adapte os campos
    if (type === 'instrumental') {
        item = {
            ...item,
            title: item.title || item.name,
            artist: "Vários artistas",
            year: "todos os tempos",
            label: "Play 90 Studio",
            country: "Várias cidades",
            format: "Playlists"
        };
    }

    // Atualiza o player UI
    const playerImage = document.getElementById('playerImage');
    const playerTitle = document.getElementById('playerTitle');
    const playerArtist = document.getElementById('playerArtist');
    const playerFrame = document.getElementById('playerFrame');
    
    if (playerImage) playerImage.src = item.image || '';
    if (playerTitle) playerTitle.textContent = item.title || '';
    if (playerArtist) playerArtist.textContent = item.artist || '';
    if (playerFrame) playerFrame.src = item.embedUrl || '';

    // Atualiza detalhes
    const detailArtist = document.getElementById('detailArtist');
    const detailYear = document.getElementById('detailYear');
    const detailLabel = document.getElementById('detailLabel');
    const detailCountry = document.getElementById('detailCountry');
    const detailFormat = document.getElementById('detailFormat');
    
    if (detailArtist) detailArtist.textContent = item.artist || '';
    if (detailYear) detailYear.textContent = item.year || '';
    if (detailLabel) detailLabel.textContent = item.label || '';
    if (detailCountry) detailCountry.textContent = item.country || '';
    if (detailFormat) detailFormat.textContent = item.format || '';

    // Mostra a UI do player
    const playerBar = document.getElementById('player-bar');
    if (playerBar) {
        playerBar.classList.add('opened');
        playerBar.style.display = 'block';
    }

    const playerPage = document.getElementById('player-page');
    if (playerPage && !playerPage.classList.contains('showmore')) {
        togglePlayerBody();
    }

    saveToRecentlyPlayed({ id, type });
}

/*===============================================================================
=================================================================================*/

// Save Recent Played
function saveToRecentlyPlayed(item) {
    const key = 'recentlyPlayed';
    const stored = JSON.parse(localStorage.getItem(key)) || [];

    // Remove duplicados (mesmo id e tipo)
    const filtered = stored.filter(entry => !(entry.id === item.id && entry.type === item.type));

    // Coloca o novo no topo
    filtered.unshift(item);

    // Limita a 4
    const updated = filtered.slice(0, 4);
    localStorage.setItem(key, JSON.stringify(updated));

    renderRecentlyPlayed();
}

// Recent Played
function renderRecentlyPlayed() {
    const container = document.getElementById('recentlyPlayed');
    if (!container) return;

    const stored = JSON.parse(localStorage.getItem('recentlyPlayed')) || [];
    
    const html = stored.map(entry => {
        const sourceTypes = {
            album: currentData.albums || [],
            albums: currentData.albums || [],
            playlist: currentData.playlists || [],
            playlists: currentData.playlists || [],
            instrumental: currentData.instrumental || [],
            djs: currentData.djs || [],
            vinyls: currentData.vinyls || [],
            singles: currentData.singles || [],
            musics: currentData.musics || [],
            featured: currentData.featured || []
        };

        let item = null;
        if (sourceTypes[entry.type]) {
            item = sourceTypes[entry.type].find(i => i.id === entry.id);
        }

        if (!item) return '';

        const title = item.title || item.name || "Sem título";
        const artist = item.artist || "Vários Artistas";
        const image = item.image || "https://placehold.co/300x300?text=Música";

        return `
            <div class="album-card" data-id="${item.id || ''}" data-type="${entry.type}">
                <img src="${image}" alt="${escapeHtml(title)}" class="album-image">
                <div class="album-info">
                    <h3>${escapeHtml(title)}</h3>
                    <p>${escapeHtml(artist)}</p>
                </div>
            </div>
        `;
    }).join('');

    container.innerHTML = html;
    
    // CORRIGIDO: Adicionar event listeners
    container.querySelectorAll('.album-card').forEach(card => {
        card.addEventListener('click', function() {
            const id = parseInt(this.dataset.id);
            const type = this.dataset.type;
            if (!isNaN(id)) {
                openPlayer(id, type);
            }
        });
    });
}

/*===============================================================================
=================================================================================*/

// Toggle Player Body
function togglePlayerBody(li) {
    const playerPage = document.getElementById("player-page");
    const mainPanel = document.getElementById("main-panel");
    const sidePanel = document.getElementById("side-panel");

    if (!playerPage) return;

    playerPage.classList.toggle("showmore");

    const isOpen = playerPage.classList.contains("showmore");

    if (mainPanel) mainPanel.style.display = isOpen ? "block" : "none";
    if (sidePanel) sidePanel.style.display = isOpen ? "block" : "none";

    if (li) {
        li.classList.toggle("fa-long-arrow-down", !isOpen);
        li.classList.toggle("fa-long-arrow-up", isOpen);
    }
}

/*===============================================================================
=================================================================================*/

// Content transition - CORRIGIDO
document.addEventListener('click', function(e) {
    const target = e.target.closest('.album-card, .playlist-card, .artist-card, .genre-card');
    if (target) {
        target.style.transform = 'scale(0.98)';
        setTimeout(() => {
            target.style.transform = '';
        }, 150);
    }
});

// CORRIGIDO: Render featured playlists
function renderFeaturedPlaylists() {
    const container = document.getElementById('featuredPlaylists');
    if (!container) return;
    
    const featuredPlaylists = (currentData.playlists || []).slice(0, 10);
    
    container.innerHTML = featuredPlaylists.map(playlist => `
        <div class="playlist-card" data-id="${playlist.id || ''}" data-type="playlist">
            <img src="${playlist.image || ''}" alt="${escapeHtml(playlist.name || '')}" class="playlist-image">
            <div class="playlist-info">
                <h3 class="playlist-name">${escapeHtml(playlist.name || '')}</h3>
                <button class="playlist-play-btn" data-id="${playlist.id || ''}" data-type="playlist">
                    Play Mix
                </button>
            </div>
        </div>
    `).join('');
    
    // CORRIGIDO: Adicionar event listeners
    container.querySelectorAll('.playlist-play-btn').forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.stopPropagation();
            const id = parseInt(this.dataset.id);
            const type = this.dataset.type;
            if (!isNaN(id)) {
                openPlayer(id, type);
            }
        });
    });
}

// ==================================================================
// FUNÇÕES UTILITÁRIAS ADICIONAIS
// ==================================================================

// CORREÇÃO: Função para limpar busca (útil para botão de reset)
function clearSearch() {
    if (searchInput) {
        searchInput.value = '';
        handleSearch(); // Isso fará o reset dos dados
    }
}

// CORREÇÃO: Função para busca programática (útil para testes)
function performSearch(term) {
    if (searchInput) {
        searchInput.value = term;
        handleSearch();
    }
}

// CORREÇÃO: Função utilitária para debug da busca
function debugSearch(searchTerm = '') {
    console.log('=== DEBUG SEARCH ===');
    console.log('Search term:', searchTerm);
    console.log('Original data counts:', {
        albums: (originalData.albums || []).length,
        artists: (originalData.artists || []).length,
        playlists: (originalData.playlists || []).length,
        //genres: (originalData.genres || []).length,
        musics: (originalData.musics || []).length,
        singles: (originalData.singles || []).length,
        vinyls: (originalData.vinyls || []).length,
        instrumental: (originalData.instrumental || []).length,
        djs: (originalData.djs || []).length,
        featured: (originalData.featured || []).length
    });
    console.log('Current data counts:', {
        albums: (currentData.albums || []).length,
        artists: (currentData.artists || []).length,
        playlists: (currentData.playlists || []).length,
        //genres: (currentData.genres || []).length,
        musics: (currentData.musics || []).length,
        singles: (currentData.singles || []).length,
        vinyls: (currentData.vinyls || []).length,
        instrumental: (currentData.instrumental || []).length,
        djs: (currentData.djs || []).length,
        featured: (currentData.featured || []).length
    });
    console.log('SearchInput element:', searchInput);
}

// ==================================================================
// INSTRUÇÕES DE USO E DEBUGGING:
//
// Para debug da busca: debugSearch('termo_de_busca')
// Para limpar busca: clearSearch()
// Para busca programática: performSearch('termo')
//
// Console logs disponíveis:
// - Inicialização: "MonkMusic: DOM loaded, inicializando..."
// - Event listeners: "Event listeners de busca configurados com sucesso"
// - Busca: "Busca realizada com sucesso: [termo]"
// - Erros: Todos os erros são logados no console
// ==================================================================

function setupBannerFillColorEvents(sectionId, cardSelector = '.album-card') {
	const $section = $('#' + sectionId);
	const $banner = $('#banner');

	if (!$section.length || !$banner.length) return;

	// 1️⃣ Aplica a imagem da 1ª capa da seção no banner
	const $firstImage = $section.find(`${cardSelector} img`).first();
	if ($firstImage.length) {
		const src = $firstImage.attr('src');
		$banner.html(`<img src="${src}" alt="Banner">`);
		$banner.find('img').on('load', () => {
			$banner.fillColor({ type: 'avgYUV' });
		});
	}

	// 2️⃣ Adiciona evento de clique em cada card da seção
	$section.off('click.bannerFillColor').on('click.bannerFillColor', cardSelector, function () {
		const $img = $(this).find('img');
		if ($img.length) {
			const src = $img.attr('src');
			$banner.html(`<img src="${src}" alt="Banner">`);
			$banner.find('img').on('load', () => {
				$banner.fillColor({ type: 'avgYUV' });
			});
		}
	});
}
