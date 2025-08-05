(function($) {

    "use strict";

    $(document).ready(function() {

        // Inicialização segura dos dados com fallback
        let currentData = {
            djs: (typeof mockDjs !== 'undefined') ? mockDjs : [],
            artists: (typeof mockArtists !== 'undefined') ? mockArtists : [],
            playlists: (typeof mockPlaylists !== 'undefined') ? mockPlaylists : [],
            musics: (typeof mockMusics !== 'undefined') ? mockMusics : [],
            albums: (typeof mockAlbums !== 'undefined') ? mockAlbums : [],
            singles: (typeof mockSingles !== 'undefined') ? mockSingles : [],
            vinyls: (typeof mockVinyls !== 'undefined') ? mockVinyls : [],
            instrumental: (typeof mockInstrumental !== 'undefined') ? mockInstrumental : [],
            featured: (typeof mockFeatured !== 'undefined') ? mockFeatured : [],
            timeline: (typeof mockTimeline !== 'undefined') ? mockTimeline : []
        };

        // Backup dos dados originais para reset correto
        const originalData = {
            djs: (typeof mockDjs !== 'undefined') ? [...mockDjs] : [],
            artists: (typeof mockArtists !== 'undefined') ? [...mockArtists] : [],
            playlists: (typeof mockPlaylists !== 'undefined') ? [...mockPlaylists] : [],
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

        // DOM Elements com verificação de existência
        const $searchInput = $('#searchInput');
        const $navButtons = $('ul li a.nav-btn');
        const $tabContents = $('section .tab-content');

        // Variável para debounce
        let searchTimeout;

        // Initialize the app
        $(document).ready(function() {
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
            renderTimeline();
            renderMusics();
            renderAllSingles();
            renderAllVinyls();
            renderAllDjs();
            renderAllInstrumental();
            renderFeaturedAlbums();
            renderRecentlyPlayed();
            renderFeaturedDjs();
        }

        // Setup de event listeners section
        function setupEventListeners() {
            // Verificar se searchInput existe antes de adicionar listeners
            if ($searchInput.length) {
                // Usar debounce para melhor performance
                $searchInput.on('input', debouncedHandleSearch);

                // Também escutar evento de keypress para enter
                $searchInput.on('keypress', function(e) {
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
            $navButtons.each(function() {
                $(this).on('click', (e) => {
                    e.preventDefault();
                    const tab = $(this).data('tab');
                    if (tab) {
                        switchTab(tab);
                    }
                });
            });

            // Botões de volta com verificação
            $('#backToArtistsBtn').on('click', (e) => {
                e.preventDefault();
                switchTab('artists');
            });

            $('#backToTimelineBtn').on('click', (e) => {
                e.preventDefault();
                switchTab('timeline');
            });

            $('#instrumentalArtists, #djsArtists, #vinylsArtists, #singlesArtists, #albumsArtists, #playlistsArtists, #musicsArtists').on('click', (e) => {
                e.preventDefault();
                switchTab('artists');
            });
        }

        // ==================================================================
        // FUNÇÃO HANDLESEARCH PRINCIPAL
        // ==================================================================

        function handleSearch() {
            // Verificar se searchInput existe
            if (!$searchInput.length) {
                console.warn('Elemento searchInput não encontrado');
                return;
            }

            const searchTerm = $searchInput.val().toLowerCase().trim();

            if (searchTerm) {
                // Filtros seguros com verificações de propriedades
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
                // Reset seguro para dados originais usando cópia profunda
                currentData = {
                    albums: [...(originalData.albums || [])],
                    artists: [...(originalData.artists || [])],
                    playlists: [...(originalData.playlists || [])],
                    timeline: [...(originalData.timeline || [])],
                    musics: [...(originalData.musics || [])],
                    singles: [...(originalData.singles || [])],
                    vinyls: [...(originalData.vinyls || [])],
                    instrumental: [...(originalData.instrumental || [])],
                    djs: [...(originalData.djs || [])],
                    featured: [...(originalData.featured || [])]
                };
            }

            // Re-render com tratamento de erros
            try {
                updateStats();
                renderAllAlbums();
                renderAllArtists();
                renderAllPlaylists();
                renderTimeline();
                renderMusics();
                renderAllSingles();
                renderAllVinyls();
                renderAllDjs();
                renderAllInstrumental();
                renderFeaturedAlbums();
                renderFeaturedDjs();

                // Re-renderizar yearAlbums se estiver ativo
                const $yearAlbumsTab = $('#yearAlbums');
                if ($yearAlbumsTab.hasClass('active')) {
                    const $yearTitle = $('#yearAlbumsTitle');
                    if ($yearTitle.length) {
                        const yearMatch = $yearTitle.text().match(/\d{4}/);
                        if (yearMatch) {
                            renderAlbumsByYear(yearMatch[0]);
                        }
                    }
                }

                // Re-renderizar subalbums se estiver ativo  
                const $subAlbumsTab = $('#subalbums');
                if ($subAlbumsTab.hasClass('active')) {
                    const $artistTitle = $('#subalbumsTitle');
                    if ($artistTitle.length) {
                        const artistMatch = $artistTitle.text().match(/Álbuns de (.+)/);
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

        // Função de debounce para melhorar performance
        function debouncedHandleSearch() {
            clearTimeout(searchTimeout);
            searchTimeout = setTimeout(handleSearch, 300); // 300ms de delay
        }

        function switchTab(tabName) {
            // Remove active class from all nav buttons
            $navButtons.removeClass('active');
            $navButtons.filter(`[data-tab="${tabName}"]`).addClass('active');

            // Hide all tab contents
            $tabContents.removeClass('active');
            $tabContents.filter(`#${tabName}`).addClass('active');
        }

        function updateStats() {
            $('#albumCount').text((currentData.albums || []).length);
            $('#artistCount').text((currentData.artists || []).length);
            $('#playlistCount').text((currentData.playlists || []).length);
        }

        // ==================================================================
        // HOME FEATURED ALBUMS
        // ==================================================================

        // Funções de renderização
        function renderFeaturedAlbums() {
            const $container = $('#featuredAlbums');
            if (!$container.length) return;

            const $titleElement = $('#featuredTitle');
            if ($titleElement.length) {
                $titleElement.text('Álbuns em Destaque');
            }

            const featuredAlbums = (currentData.featured || [])
                .slice()
                .sort((a, b) => (b.id || 0) - (a.id || 0))
                .slice(0, 4);

            $container.html(featuredAlbums.map(item => `
				<div class="album-card" data-id="${item.id || ''}" data-type="featured">
					<article class="box post">
						<div class="content">
							<a href="#" class="image fit md-ripples ripples-light" data-position="center">
								<img src="${item.image || ''}" alt="${escapeHtml(item.title || '')}" loading="lazy">
							</a>
							<ul class="icons">
								<li><a href="#" class="icon solid fa-play"></a></li>
							</ul>
						</div>
			
						<header class="align-left">
							<h3 class="album-title">${escapeHtml(item.title || '')}</h3>
							<p class="album-artist">${escapeHtml(item.artist || '')}</p>
						</header>
					</article>
				</div>
			`).join(''));

            setupBannerFillColorEvents('featuredAlbums');

            // Adicionar event listeners para os cards
            $container.find('.album-card').on('click', function() {
                const id = parseInt($(this).data('id'));
                const type = $(this).data('type');
                if (!isNaN(id)) {
                    openPlayer(id, type);
                }
            });
        }

        // ==================================================================
        // HOME FEATURED DJS
        // ==================================================================

        // Render featured playlists
        function renderFeaturedDjs() {
            const $container = $('#featuredDjs');
            if (!$container.length) return;

            const $titleElement = $('#featuredDjsTitle');
            if ($titleElement.length) {
                $titleElement.text('Mix de DJs');
            }

            // 🔧 Filtrar apenas DJ Mix
            const featuredDjs = (currentData.featured || [])
                .filter(item => (item.format || '').toLowerCase().includes('dj'))
                .sort((a, b) => (b.id || 0) - (a.id || 0))
                .slice(0, 5);

            $container.html(featuredDjs.map(playlist => `
		<div class="album-card" data-id="${playlist.id || ''}" data-type="featured">
			<article class="box post">
				<div class="content">
					<a href="#" class="image fit avg md-ripples ripples-light" data-position="center">
						<img src="${playlist.image || ''}" alt="${escapeHtml(playlist.artist || '')}" loading="lazy">
					</a>
					<ul class="icons">
						<li><a href="#" class="icon solid fa-play"></a></li>
					</ul>
				</div>
				<header class="align-left">
					<h3 class="playlist-artist">${escapeHtml(playlist.artist || '')}</h3>
					<p class="playlist-title">${escapeHtml(playlist.title || '')}</p>
				</header>
			</article>
		</div>
	`).join(''));

            // Adicionar event listeners
            $container.find('.album-card').on('click', function(e) {
                e.stopPropagation();
                const id = parseInt($(this).data('id'));
                const type = $(this).data('type');
                if (!isNaN(id)) {
                    openPlayer(id, type);
                }
            });

            setupBannerFillColorEvents('featuredPlaylists');

            // Aplicar fillColor nos elementos com .avg
            $('.avg').fillColor({
                type: 'avg'
            });
        }

        // ==================================================================
        // HOME RECENT PLAYED
        // ==================================================================

        // Recent Played
        function renderRecentlyPlayed() {
            const $container = $('#recentlyPlayed');
            if (!$container.length) return;

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

                const $titleElement = $('#recentlyPlayedTitle');
                if ($titleElement.length) {
                    $titleElement.text('Recente');
                };

                let item = null;
                if (sourceTypes[entry.type]) {
                    item = sourceTypes[entry.type].find(i => i.id === entry.id);
                }

                if (!item) return '';

                const title = item.title || item.name || "Sem título";
                const artist = item.artist || "Vários Artistas";
                const image = item.image || "https://assets.audiomack.com/default-album-image.png";

                return `
				<div class="album-card" data-id="${item.id || ''}" data-type="${entry.type}">
					<article class="box post">
						<div class="content">
							<a href="#" class="image fit md-ripples ripples-light" data-position="center">
								<img src="${image}" alt="${escapeHtml(title)}" loading="lazy">
							</a>
							<ul class="icons">
								<li><a href="#" class="icon solid fa-play"></a></li>
							</ul>
						</div>
					
						<header class="align-left">
							<h3>${escapeHtml(title)}</h3>
							<p>${escapeHtml(artist)}</p>
						</header>
					
					</article>
				</div>
			`;
            }).join('');

            $container.html(html);

            // Adicionar event listeners
            $container.find('.album-card').on('click', function() {
                const id = parseInt($(this).data('id'));
                const type = $(this).data('type');
                if (!isNaN(id)) {
                    openPlayer(id, type);
                }
            });
        }

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

        // ==================================================================
        // INSTRUMENTALS
        // ==================================================================

        // Funções de renderização allInstrumental
        function renderAllInstrumental() {
            const $container = $('#allInstrumentals');
            if (!$container.length) return;

            const combinedInstrumentals = [
                ...(currentData.featured || []).filter(item =>
                    item.format?.toLowerCase().includes('instrumental')
                )
            ].sort((a, b) => (b.id || 0) - (a.id || 0));

            $container.html(combinedInstrumentals.map(inst => `
				<div class="album-card" data-id="${inst.id || ''}" data-type="featured">
					<article class="box post">
						<div class="content">
							<a href="#" class="image fit md-ripples ripples-light" data-position="center">
								<img src="${inst.image || ''}" alt="${escapeHtml(inst.title || '')}" loading="lazy">
							</a>
							<ul class="icons">
								<li><a href="#" class="icon solid fa-play"></a></li>
							</ul>
						</div>
						<header class="align-left">
							<h3 class="album-title">${escapeHtml(inst.title || '')}</h3>
							<p class="album-artist">${escapeHtml(inst.artist || '')}</p>
						</header>
					</article>
				</div>
			`).join(''));

            setupBannerFillColorEvents('allInstrumentals');

            $container.find('.album-card').on('click', function() {
                const id = parseInt($(this).data('id'));
                const type = $(this).data('type');
                if (!isNaN(id)) {
                    openPlayer(id, type);
                }
            });
        }

        // ==================================================================
        // DJ'S
        // ==================================================================

        // Funções de renderização allDjs
        function renderAllDjs() {
            const $container = $('#allDjs');
            if (!$container.length) return;

            const combinedDjs = [
                ...(currentData.featured || []).filter(item =>
                    item.format?.toLowerCase().includes('dj')
                )
            ].sort((a, b) => (b.id || 0) - (a.id || 0));

            $container.html(combinedDjs.map(dj => `
				<div class="album-card" data-id="${dj.id || ''}" data-type="featured">
					<article class="box post">
						<div class="content">
							<a href="#" class="image fit md-ripples ripples-light" data-position="center">
								<img src="${dj.image || ''}" alt="${escapeHtml(dj.title || '')}" loading="lazy">
							</a>
							<ul class="icons">
								<li><a href="#" class="icon solid fa-play"></a></li>
							</ul>
						</div>
						<header class="align-left">
							<h3 class="album-title">${escapeHtml(dj.title || '')}</h3>
							<p class="album-artist">${escapeHtml(dj.artist || '')}</p>
						</header>
					</article>
				</div>
			`).join(''));

            setupBannerFillColorEvents('allDjs');

            $container.find('.album-card').on('click', function() {
                const id = parseInt($(this).data('id'));
                const type = $(this).data('type');
                if (!isNaN(id)) {
                    openPlayer(id, type);
                }
            });
        }

        // ==================================================================
        // MUSICS
        // ==================================================================

        // Funções de renderização allMusics
        function renderMusics() {
            const $container = $('#allMusics');
            if (!$container.length) return;

            const sortedMusics = (currentData.featured || [])
                .filter(music => music.format === "Music") // 🔍 apenas músicas
                .sort((a, b) => (b.id || 0) - (a.id || 0))
                .slice(0, 500);

            if (sortedMusics.length === 0) {
                $container.html(`<p class="icon solid fa-record-vinyl empty-message"> Nenhuma música encontrada.</p>`);
                return;
            }

            const html = sortedMusics.map(music => {
                const id = music.id || '';
                const title = escapeHtml(music.title || 'Sem título');
                const artist = escapeHtml(music.artist || 'Desconhecido');
                const image = music.image || 'https://assets.audiomack.com/default-album-image.png';

                return `
            <div class="album-card md-ripples ripples-light" data-id="${id}" data-type="featured">
				<article class="box post">
						<div class="content">
							<a href="#" class="image fit md-ripples ripples-light" data-position="center">
								<img src="${image}" alt="${title} - ${artist}" alt="${escapeHtml(music.title || '')}" loading="lazy">
							</a>
							<ul class="icons">
								<li><a href="#" class="icon solid fa-play"></a></li>
							</ul>
						</div>
        
                <header class="align-left">
                    <h3 class="album-title">${title}</h3>
                    <p class="album-artist">${artist}</p>
                </header>
				</article>
            </div>
        `;
            }).join('');

            $container.html(html);

            setupBannerFillColorEvents('allMusics');

            $container.find('.album-card').on('click', function() {
                const id = parseInt($(this).data('id'));
                const type = $(this).data('type');
                if (!isNaN(id)) {
                    openPlayer(id, type);
                }
            });
        }

        // ==================================================================
        // ALBUMS
        // ==================================================================

        // Funções de renderização allAlbums
        function renderAllAlbums() {
            const $container = $('#allAlbums');
            if (!$container.length) return;

            const combinedAlbums = [
                ...(currentData.featured || []).filter(item =>
                    item.format?.toLowerCase().includes('album')
                )
            ].sort((a, b) => (b.id || 0) - (a.id || 0));

            $container.html(combinedAlbums.map(album => `
				<div class="album-card" data-id="${album.id || ''}" data-type="featured">
					<article class="box post">
						<div class="content">
							<a href="#" class="image fit md-ripples ripples-light" data-position="center">
								<img src="${album.image || ''}" alt="${escapeHtml(album.title || '')}" loading="lazy">
							</a>
							<ul class="icons">
								<li><a href="#" class="icon solid fa-play"></a></li>
							</ul>
						</div>
						<header class="align-left">
							<h3 class="album-title">${escapeHtml(album.title || '')}</h3>
							<p class="album-artist">${escapeHtml(album.artist || '')}</p>
						</header>
					</article>
				</div>
			`).join(''));

            setupBannerFillColorEvents('allAlbums');

            $container.find('.album-card').on('click', function() {
                const id = parseInt($(this).data('id'));
                const type = $(this).data('type');
                if (!isNaN(id)) {
                    openPlayer(id, type);
                }
            });
        }

        // ==================================================================
        //	ARTISTS
        // ==================================================================

        // Funções de renderização allArtists
        function renderAllArtists() {
            const $container = $('#allArtists');
            if (!$container.length) return;

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
                        image: album.image || 'https://assets.audiomack.com/default-album-image.png'
                    };
                }
                acc[album.artist].albumCount++;
                return acc;
            }, {});

            const subeAlbumYears = Object.values(albumsByTitle).reverse();

            $container.html(subeAlbumYears.map(artist => `
				<div class="artist-card" data-artist="${artist.name}">
					<article class="box post">
						<div class="content">
							<a href="#" class="image fit circles md-ripples ripples-light" data-position="center">
								<img src="${artist.image}" alt="${escapeHtml(artist.name)}" loading="lazy">
							</a>
						</div>
						<header class="align-center">
							<h3>${escapeHtml(artist.name)}</h3>
							<p>${artist.albumCount} Álbuns</p>
						</header>
					</article>
				</div>
			`).join(''));

            setupBannerFillColorEvents('allArtists');

            $container.find('.artist-card').on('click', function() {
                const artist = $(this).data('artist');
                renderSubAlbumsByArtist(artist);
            });

            // Aplicar fillColor nos elementos com .avg
            $('.avg').fillColor({
                type: 'avg'
            });
        }

        // ==================================================================
        // PLAYER RENDER ALBUMS
        // ==================================================================

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
                .slice(0, 1000);

            const albums = allAlbums.filter(album => album && album.artist === artist);
            const $container = $('#suballAlbums');
            const $title = $('#subalbumsTitle');

            if (!$container.length || !$title.length) return;

            $title.text(`Álbuns de ${artist}`);
            $container.html(albums.map(album => {
                let albumType = 'album';
                if ((currentData.singles || []).find(s => s.id === album.id)) albumType = 'singles';
                else if ((currentData.albums || []).find(v => v.id === album.id)) albumType = 'albums';
                else if ((currentData.vinyls || []).find(v => v.id === album.id)) albumType = 'vinyls';
                else if ((currentData.featured || []).find(f => f.id === album.id)) albumType = 'featured';

                return `
				<div class="album-card" data-id="${album.id || ''}" data-type="${albumType}">
					<article class="box post">
						<div class="content">
							<a href="#" class="image fit md-ripples ripples-light" data-position="center">
								<img src="${album.image || ''}" alt="${escapeHtml(album.title || '')}" loading="lazy">
							</a>
							<ul class="icons">
								<li><a href="#" class="icon solid fa-play"></a></li>
							</ul>
						</div>
						<header class="align-left">
							<h3 class="album-title">${escapeHtml(album.title || '')}</h3>
							<p class="album-artist">${escapeHtml(album.artist || '')}</p>
						</header>
					</article>
				</div>
			`;
            }).join(''));

            setupBannerFillColorEvents('suballAlbums');

            $container.find('.album-card').on('click', function(e) {
                e.preventDefault();
                const id = parseInt($(this).data('id'));
                const type = $(this).data('type');
                if (!isNaN(id)) {
                    openPlayer(id, type);
                }
            });

            switchTab('subalbums');
        }

        // ==================================================================
        // VINYLS
        // ==================================================================

        // Funções de renderização allVinyls
        function renderAllVinyls() {
            const $container = $('#allVinyls');
            if (!$container.length) return;

            const combinedVinyls = [
                ...(currentData.featured || []).filter(item =>
                    item.format?.toLowerCase().includes('vinyl')
                )
            ].sort((a, b) => (b.id || 0) - (a.id || 0));

            $container.html(combinedVinyls.map(album => `
				<div class="album-card" data-id="${album.id || ''}" data-type="featured">
					<article class="box post">
						<div class="content">
							<a href="#" class="image fit md-ripples ripples-light" data-position="center">
								<img src="${album.image || ''}" alt="${escapeHtml(album.title || '')}" loading="lazy">
							</a>
							<ul class="icons">
								<li><a href="#" class="icon solid fa-play"></a></li>
							</ul>
						</div>
						<header class="align-left">
							<h3 class="album-title">${escapeHtml(album.title || '')}</h3>
							<p class="album-artist">${escapeHtml(album.artist || '')}</p>
						</header>
					</article>
				</div>
			`).join(''));

            setupBannerFillColorEvents('allVinyls');

            $container.find('.album-card').on('click', function() {
                const id = parseInt($(this).data('id'));
                const type = $(this).data('type');
                if (!isNaN(id)) {
                    openPlayer(id, type);
                }
            });
        }

        // ==================================================================
        // SINGLES
        // ==================================================================

        // Funções de renderização allSingles
        function renderAllSingles() {
            const $container = $('#allSingles');
            if (!$container.length) return;

            const combinedSingles = [
                ...(currentData.featured || []).filter(item =>
                    item.format?.toLowerCase().includes('single')
                )
            ].sort((a, b) => (b.id || 0) - (a.id || 0));

            $container.html(combinedSingles.map(album => `
				<div class="album-card" data-id="${album.id || ''}" data-type="featured">
					<article class="box post">
						<div class="content">
							<a href="#" class="image fit md-ripples ripples-light" data-position="center">
								<img src="${album.image || ''}" alt="${escapeHtml(album.title || '')}" loading="lazy">
							</a>
							<ul class="icons">
								<li><a href="#" class="icon solid fa-play"></a></li>
							</ul>
						</div>
						<header class="align-left">
							<h3 class="album-title">${escapeHtml(album.title || '')}</h3>
							<p class="album-artist">${escapeHtml(album.artist || '')}</p>
						</header>
					</article>
				</div>
			`).join(''));

            setupBannerFillColorEvents('allSingles');

            $container.find('.album-card').on('click', function() {
                const id = parseInt($(this).data('id'));
                const type = $(this).data('type');
                if (!isNaN(id)) {
                    openPlayer(id, type);
                }
            });
        }

        // ==================================================================
        // PLAYLISTS
        // ==================================================================

        // Funções de renderização allPlaylists
        function renderAllPlaylists() {
            const $container = $('#allPlaylists');
            if (!$container.length) return;

            const combinedPlaylists = [
                ...(currentData.featured || []).filter(item =>
                    item.format?.toLowerCase().includes('playlist')
                )
            ].sort((a, b) => (b.id || 0) - (a.id || 0));

            $container.html(combinedPlaylists.map(playlist => `
				<div class="album-card" data-id="${playlist.id || ''}" data-type="featured">
					<article class="box post">
						<div class="content">
							<a href="#" class="image fit md-ripples ripples-light" data-position="center">
								<img src="${playlist.image || ''}" alt="${escapeHtml(playlist.title || '')}" loading="lazy">
							</a>
							<ul class="icons">
								<li><a href="#" class="icon solid fa-play"></a></li>
							</ul>
						</div>
						<header class="align-left">
							<h3 class="album-title">${escapeHtml(playlist.title || '')}</h3>
							<p class="album-artist">${escapeHtml(playlist.artist || '')}</p>
						</header>
					</article>
				</div>
			`).join(''));

            setupBannerFillColorEvents('allPlaylists');

            $container.find('.album-card').on('click', function() {
                const id = parseInt($(this).data('id'));
                const type = $(this).data('type');
                if (!isNaN(id)) {
                    openPlayer(id, type);
                }
            });
        }

        // ==================================================================
        // TIMELINE
        // ==================================================================

        // Timeline segura e ordenada corretamente
        function renderTimeline() {
            const $container = $('#allTimeline');
            if (!$container.length) return;

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
                    acc[yearStr] = {
                        name: yearStr,
                        albumCount: 0
                    };
                }
                acc[yearStr].albumCount++;
                return acc;
            }, {});

            const timelineYears = Object.values(albumsByYear)
                .sort((a, b) => parseInt(b.name) - parseInt(a.name));

            $container.html(timelineYears.map(year => `
				<div class="timeline-card md-ripples ripples-light" data-year="${year.name}">
					<h3>${year.name}</h3>
					<p>${year.albumCount} álbuns</p>
				</div>
			`).join(''));

            // Evento de clique para cada ano
            $container.find('.timeline-card').on('click', function() {
                const year = $(this).data('year');
                renderAlbumsByYear(year);
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
            ].sort((a, b) => (b.id || 0) - (a.id || 0));

            const albums = allAlbums.filter(album =>
                album && album.year?.toString() === year.toString()
            );

            const $container = $('#yearAlbumsList');
            const $title = $('#yearAlbumsTitle');
            if (!$container.length || !$title.length) return;

            $title.text(`Álbuns de ${year}`);
            $container.html(albums.map(album => {
                let albumType = 'albums';
                if ((currentData.singles || []).find(s => s.id === album.id)) albumType = 'singles';
                else if ((currentData.vinyls || []).find(v => v.id === album.id)) albumType = 'vinyls';
                else if ((currentData.featured || []).find(f => f.id === album.id)) albumType = 'featured';

                return `
				<div class="album-card" data-id="${album.id}" data-type="${albumType}">
					<article class="box post">
						<div class="content">
							<a href="#" class="image fit md-ripples ripples-light" data-position="center">
								<img src="${album.image}" alt="${escapeHtml(album.title)}" loading="lazy">
							</a>
							<ul class="icons">
								<li><a href="#" class="icon solid fa-play"></a></li>
							</ul>
						</div>
						<header class="align-left">
							<h3 class="album-title">${escapeHtml(album.title)}</h3>
							<p class="album-artist">${escapeHtml(album.artist)}</p>
						</header>
					</article>
				</div>
			`;
            }).join(''));

            $container.find('.album-card').on('click', function(e) {
                e.preventDefault();
                const id = parseInt($(this).data('id'));
                const type = $(this).data('type');
                if (!isNaN(id)) openPlayer(id, type);
            });

            setupBannerFillColorEvents('yearAlbumsList');

            switchTab('yearAlbums');

        }

        // ==================================================================
        // PLAYER
        // ==================================================================

        // Função openPlayer melhorada
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

            let item;
            if (type === 'featured') item = currentData.featured.find(x => x.id === id);
            else if (type === 'albums') item = currentData.albums.find(x => x.id === id);
            else if (type === 'singles') item = currentData.singles.find(x => x.id === id);
            else if (type === 'vinyls') item = currentData.vinyls.find(x => x.id === id);
            else if (type === 'djs') item = currentData.djs.find(x => x.id === id);
            else if (type === 'instrumental') item = currentData.instrumental.find(x => x.id === id);
            else if (type === 'playlists') item = currentData.playlists.find(x => x.id === id);

            if (!item || !item.embedUrl) return;

            // Atualiza o iframe do player
            const $iframe = $('.player-embed iframe');
            if ($iframe.length) {
                $iframe.attr('src', item.embedUrl);
            } else {
                const $embedContainer = $('.player-embed');
                $embedContainer.html(`<iframe src="${item.embedUrl}" frameborder="0" allow="autoplay" scrolling="no"></iframe>`);
            }

            // Mostrar outros álbuns do mesmo artista
            showRelatedAlbums(item.artist, id);

            $('#player-bar').addClass('active');

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

            // Se for Instrumental, adapte os campos
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
            $('#playerImage').attr('src', item.image || '');
            $('#playerTitle').text(item.title || '');
            $('#playerArtist').text(item.artist || '');
            $('#playerFrame').attr('src', item.embedUrl || '');

            // Atualiza detalhes
            $('#detailArtist').text(item.artist || '');
            $('#detailYear').text(item.year || '');
            $('#detailLabel').text(item.label || '');
            $('#detailCountry').text(item.country || '');
            $('#detailFormat').text(item.format || '');

            // Mostra a UI do player
            const $playerBar = $('#player-bar');
            if ($playerBar.length) {
                $playerBar.addClass('opened').css('display', 'block');
            }

            const $playerPage = $('#player-page');
            if ($playerPage.length && !$playerPage.hasClass('showmore')) {
                togglePlayerBody();
            }

            saveToRecentlyPlayed({
                id,
                type
            });
        }

        // ==================================================================
        // RELATED ALBUMS
        // ==================================================================

        // Related Albums
        function showRelatedAlbums(artist, excludeId) {
            const $container = $('#relatedAlbums');
            const $title = $('#relatedArtistName');

            if (!$container.length || !$title.length) return;

            // Combina todas as coleções
            const allItems = [
                ...(currentData.albums || []),
                ...(currentData.singles || []),
                ...(currentData.vinyls || []),
                ...(currentData.featured || []),
                ...(currentData.playlists || []),
                ...(currentData.djs || []),
                ...(currentData.instrumental || [])
            ];

            // Filtra por artista, excluindo o álbum atual
            const related = allItems.filter(item => item.artist === artist && item.id !== excludeId);

            $title.text(artist);

            if (related.length === 0) {
                $container.html('<p>Nenhum outro álbum encontrado.</p>');
                return;
            }

            $container.html(related.map(album => `
				<div class="album-card" data-id="${album.id}" data-type="featured">
					<article class="box post">
						<div class="contents">
							<a href="#" class="image fit md-ripples ripples-light" data-position="center">
								<img src="${album.image}" alt="${escapeHtml(album.title)}" loading="lazy">
							</a>
						</div>
						<header class="align-left">
							<h3 class="album-title">${escapeHtml(album.title)}</h3>
							<p class="album-artist">${escapeHtml(album.artist)}</p>
						</header>
					</article>
				</div>
			`).join(''));

            // Reaplica eventos de clique nos novos cards
            $container.find('.album-card').on('click', function() {
                const id = parseInt($(this).data('id'));
                const type = $(this).data('type');
                openPlayer(id, type);
            });

        }

        function toggleRelated(li) {
            const $relatedContainer = $('#relatedContainer');
            if (!$relatedContainer.length) return;

            $relatedContainer.slideToggle(300, () => {
                if ($relatedContainer.is(':visible')) {
                    $(li).removeClass('fa-list').addClass('fa-list');
                } else {
                    $(li).removeClass('fa-list').addClass('fa-list');
                }
            });
        }

        $(document).on("click", ".fa-list, .fa-list", function(e) {
            e.preventDefault();
            toggleRelated(this);
        });

        // Toggle Player Body
        function togglePlayerBody(li) {
            const $playerPage = $("#player-page");
            const $mainPanel = $("#main-panel");
            const $sidePanel = $("#side-panel");

            if (!$playerPage.length) return;

            $playerPage.toggleClass("showmore");

            const isOpen = $playerPage.hasClass("showmore");

            if ($mainPanel.length) $mainPanel.css('display', isOpen ? "block" : "none");
            if ($sidePanel.length) $sidePanel.css('display', isOpen ? "block" : "none");

            if (li) {
                $(li).toggleClass("fa-long-arrow-up", !isOpen);
                $(li).toggleClass("fa-long-arrow-down", isOpen);
            }
        }

        $(document).on("click", ".fa-long-arrow-up, .fa-long-arrow-down", function(event) {
            event.preventDefault();
            togglePlayerBody(this);
        });

        // Content transition
        $(document).on('click', function(e) {
            const target = $(e.target).closest('.album-card, .playlist-card, .artist-card, .genre-card');
            if (target.length) {
                target.css('transform', 'scale(0.98)');
                setTimeout(() => {
                    target.css('transform', '');
                }, 100);
            }
        });

        // Funções utilitárias adicionais
        function clearSearch() {
            if ($searchInput.length) {
                $searchInput.val('');
                handleSearch(); // Isso fará o reset dos dados
            }
        }

        function performSearch(term) {
            if ($searchInput.length) {
                $searchInput.val(term);
                handleSearch();
            }
        }

        function debugSearch(searchTerm = '') {
            console.log('=== DEBUG SEARCH ===');
            console.log('Search term:', searchTerm);
            console.log('Original data counts:', {
                albums: (originalData.albums || []).length,
                artists: (originalData.artists || []).length,
                playlists: (originalData.playlists || []).length,
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
                musics: (currentData.musics || []).length,
                singles: (currentData.singles || []).length,
                vinyls: (currentData.vinyls || []).length,
                instrumental: (currentData.instrumental || []).length,
                djs: (currentData.djs || []).length,
                featured: (currentData.featured || []).length
            });
            console.log('SearchInput element:', $searchInput);
        }

        // ==================================================================
        // BANNER
        // ==================================================================

        // Funções utilitárias adicionais a banner
        function setupBannerFillColorEvents(sectionId, cardSelector = '.album-card') {
            const $section = $('#' + sectionId);
            const $banner = $('.filtered');

            if (!$section.length || !$banner.length) return;

            // 1️Aplica a imagem da 1ª capa da seção no banner
            const $firstImage = $section.find(`${cardSelector} img`).first();
            if ($firstImage.length) {
                const src = $firstImage.attr('src');
                $banner.html(`<img src="${src}" alt="Banner">`);
                $banner.find('img').on('load', () => {
                    $banner.fillColor({
                        type: 'avgYUV'
                    });
                });
            }

            // 2️Adiciona evento de clique em cada card da seção
            $section.off('click.bannerFillColor').on('click.bannerFillColor', cardSelector, function() {
                const $img = $(this).find('img');
                if ($img.length) {
                    const src = $img.attr('src');
                    $banner.html(`<img src="${src}" alt="Banner">`);
                    $banner.find('img').on('load', () => {
                        $banner.fillColor({
                            type: 'avgYUV'
                        });
                    });
                }
            });
        }

    });

})(jQuery);
