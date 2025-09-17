(function($) {

    "use strict";

    $(document).ready(function() {

        // Inicialização segura dos dados com fallback
        let currentData = {
            featured: (typeof mockFeatured !== 'undefined') ? mockFeatured : []
        };

        // Backup dos dados originais para reset correto
        const originalData = {
            featured: (typeof mockFeatured !== 'undefined') ? [...mockFeatured] : []
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
            renderDailyHit();
            renderDailyFeaturedTitles();
        }

        // Setup de event listeners section
        function setupEventListeners() {
            // Verificar se searchInput existe antes de adicionar listeners
            if ($searchInput.length) {
                // Usar debounce para melhor performance
                $searchInput.on('input', debouncedHandleSearch);

                // Também escutar evento de keypress para enter
                $searchInput.on('keypress', function(event) {
                    if (event.key === 'Enter') {
                        event.preventDefault();
                        handleSearch();
                    }
                });

                console.log('Event listeners de busca configurados com sucesso');
            } else {
                console.warn('Elemento searchInput não encontrado. Verifique se o elemento com ID "searchInput" existe no DOM.');
            }

            // Configurar navegação entre tabs
            $navButtons.each(function() {
                $(this).on('click', (event) => {
                    event.preventDefault();
                    const tab = $(this).data('tab');
                    if (tab) {
                        switchTab(tab);
                    }
                });
            });

            // Botões de volta com verificação
            $('#backToArtistsBtn').on('click', (event) => {
                event.preventDefault();
                switchTab('artists');
            });

            $('#backToTimelineBtn').on('click', (event) => {
                event.preventDefault();
                switchTab('timeline');
            });
			
			$('#backToMusicsBtn, #backToPlaylistsBtn, #backToAlbunsBtn, #backToSingleBtn, #backToVinylBtn, #backToDjsBtn, #backToInstrumentaisBtn').on('click', (event) => {
                event.preventDefault();
                switchTab('artists');
            });
        }

        // ==================================================================
        // FUNÇÃO HANDLESEARCH + DROPDOWN SEARCH
        // ==================================================================

        function handleSearch() {
            if (!$searchInput.length) {
                console.warn('Elemento searchInput não encontrado');
                return;
            }

            const searchTerm = $searchInput.val().toLowerCase().trim();

            // Mantém currentData sempre com featured (opcional: já filtrado ou não)
            currentData = {
                featured: [...(originalData.featured || [])]
            };

            // Atualiza o dropdown de busca
            renderSearchDropdown(searchTerm);

            // Re-render de Featured (opcional: só se quiser que a aba também filtre)
            try {
                renderFeaturedAlbums();
                renderFeaturedDjs();
                renderDailyHit();
                renderDailyFeaturedTitles();
            } catch (error) {
                console.error('Erro durante re-renderização após busca:', error);
            }
        }

        // ==================================================================
        // DROPDOWN SEARCH
        // ==================================================================
        function renderSearchDropdown(searchTerm) {
            const $dropdown = $('#searchDropdown');
            if (!$dropdown.length) return;

            if (!searchTerm) {
                $dropdown.hide();
                return;
            }

            // Filtra apenas featured para o dropdown
            const featuredResults = (originalData.featured || [])
                .filter(item => item && (
                    (item.title && item.title.toLowerCase().includes(searchTerm)) ||
                    (item.artist && item.artist.toLowerCase().includes(searchTerm)) ||
                    (item.name && item.name.toLowerCase().includes(searchTerm)) ||
                    (item.year && item.year.toString().includes(searchTerm))
                ))
                .slice(0, 1000); // limitar resultados se necessário

            if (!featuredResults.length) {
                $dropdown.hide();
                return;
            }

            // Renderiza resultados
            $dropdown.html(featuredResults.map(item => `
				<div class="result-item md-ripples ripples-light" data-id="${item.id || ''}" data-type="featured">
					<img src="${item.image || ''}" alt="${escapeHtml(item.title || '')}" class="result-thumb">
					<header class="align-left">
						<h3>${escapeHtml(item.artist || '')}</h3>
						<p class="result-title">${escapeHtml(item.title || '')}</p>
					</header>
				</div>
			`).join(''));

            $dropdown.show();

            // Click nos itens do dropdown
            $dropdown.find('.result-item').on('click', function() {
                const id = parseInt($(this).data('id'));
                const type = $(this).data('type');
                if (!isNaN(id)) {
                    openPlayer(id, type);
                    $dropdown.hide();
                }
            });
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

        function renderFeaturedAlbums() {
            const $container = $('#featuredAlbums');
            if (!$container.length) return;

            const $titleElement = $('#featuredTitle');
            if ($titleElement.length) {
                $titleElement.text('Álbuns em Destaque');
            }

            const $banner = $('.filtered');

            const featuredAlbums = (currentData.featured || [])
                .slice()
                .sort((a, b) => (b.id || 0) - (a.id || 0))
                .slice(0, 20);

            $container.html(featuredAlbums.map(item => `
        <div class="album-card">
            <article class="box post">
                <div class="content">
                    <div class="stack1"></div>
                    <div class="stack2"></div>
                    <div class="image fit md-ripples ripples-light play-album" data-position="center" data-id="${item.id || ''}" data-type="featured">
                        <img src="${item.image || ''}" alt="${escapeHtml(item.title || '')}" loading="lazy">
                    </div>
                    <ul class="icons">
                        <li><a href="#" class="icon solid fa-play" data-id="${item.id || ''}" data-type="featured"></a></li>
                    </ul>
                </div>

                <header class="align-left">
                    <h3 class="album-artist">${escapeHtml(item.artist || '')}</h3>
                    <p class="album-title">${escapeHtml(item.title || '')}</p>
                </header>
            </article>
        </div>
    `).join(''));

            // =========================
            // FUNÇÃO ATUALIZAR BANNER
            // =========================
            function updateBannerFromSlide($slide) {
                const imgUrl = $slide.find('img').attr('src');
                if (imgUrl) {
                    $banner.html(`<img src="${imgUrl}" alt="Banner Image">`);
                    $banner.fillColor({
                        type: 'avgYUV'
                    });
                }
            }

            // =========================
            // INTEGRAÇÃO COM SLICK
            // =========================

            // destruir se já estiver iniciado
            if ($container.hasClass('slick-initialized')) {
                $container.slick('unslick');
            }

            $container.slick({
                    focusOnSelect: true,
                    infinite: true,
                    slidesToShow: 4,
                    speed: 300,
                    slidesToScroll: 1,
                    appendArrows: $('#new-slick-arrow'),
                    nextArrow: '<ul class="icons"><li><a class="icon solid fa-chevron-right md-ripples ripples-light"></a></li></ul>',
                    prevArrow: '<ul class="icons"><li><a class="icon solid fa-chevron-left md-ripples ripples-light"></a></li></ul>',
                    responsive: [{
						breakpoint: 1280, settings: { slidesToShow: 3 } }, {
						breakpoint: 980, settings: { slidesToShow: 2 } }, {
						breakpoint: 736, settings: { slidesToShow: 2 } }, {
						breakpoint: 480, settings: { slidesToShow: 1 } }
                    ]
                })
                .on('afterChange', function(event, slick, currentSlide) {
                    const $current = slick.$slides.eq(currentSlide);
                    updateBannerFromSlide($current);
                });

            // ⚠️ força carregar primeiro banner
            setTimeout(() => {
                const $firstSlide = $container.find('.slick-slide').not('.slick-cloned').eq(0);
                updateBannerFromSlide($firstSlide);
            }, 50);

            // =========================
            // EVENTOS DOS CARDS
            // =========================
            $container.find('.play-album, .fa-play').on('click', function() {
                const id = parseInt($(this).data('id'));
                const type = $(this).data('type');
                if (!isNaN(id)) {
                    openPlayer(id, type);
                }
            });

        }

        // ==================================================================
        // HOME FEATURED DAY HITS
        // ==================================================================

        function renderDailyHit(count = 6) {
            const $container = $('#dailyHit');
            if (!$container.length) return;

            const $titleElement = $('#dailyHitTitle');
            if ($titleElement.length) {
                $titleElement.text('Hits de hoje');
            }

            const today = new Date().toISOString().slice(0, 10); // AAAA-MM-DD

            // 🔹 Recupera do cache
            let cachedData = localStorage.getItem('dailyHit');
            let dailyHits = [];

            if (cachedData) {
                try {
                    cachedData = JSON.parse(cachedData);
                    // Só usa o cache se for do mesmo dia
                    if (cachedData.date === today) {
                        dailyHits = cachedData.items;
                    }
                } catch (e) {
                    console.error('Erro ao ler cache de Hits do Dia:', e);
                }
            }

            // 🔹 Se não houver cache válido, gera nova seleção
            if (!dailyHits.length) {
                const items = (currentData.featured || [])
                    .sort(() => Math.random() - 0.6) // embaralha
                    .slice(0, count); // pega a quantidade desejada

                dailyHits = items;

                // Salva no cache
                localStorage.setItem('dailyHit', JSON.stringify({
                    date: today,
                    items: dailyHits
                }));
            }

            // 🔹 Renderiza na tela
            if (!dailyHits.length) {
                $container.html('<p>Nenhum hit disponível hoje.</p>');
                return;
            }

            const html = dailyHits.map(item => `
        <div class="album-card daily-hit">
            <article class="box post">
                <div class="content">
                    <div class="image fit md-ripples ripples-light play-album" data-position="center" data-id="${item.id || ''}" data-type="featured">
                        <img src="${item.image || ''}" alt="${escapeHtml(item.title || '')}" loading="lazy">
                    </div>
                    <ul class="icons">
                        <li><a href="#" class="icon solid fa-play" data-id="${item.id || ''}" data-type="featured"></a></li>
                    </ul>
                </div>
                <header class="align-left">
                    <h3 class="album-artist">${escapeHtml(item.artist || '')}</h3>
					<p class="album-title">${escapeHtml(item.title || '')}</p>
                </header>
            </article>
        </div>
    `).join('');

            $container.html(html);

            // 🔹 Evento de clique para abrir player
            $container.find('.play-album, .fa-play').on('click', function() {
                const id = parseInt($(this).data('id'));
                const type = $(this).data('type');
                if (!isNaN(id)) {
                    openPlayer(id, type);
                }
            });
        }

        // ==================================================================
        // HOME FEATURED ESPECIAL TITULOS
        // ==================================================================

        // Função para embaralhar um array
        function shuffleArray(array) {
            for (let i = array.length - 1; i > 0; i--) {
                const j = Math.floor(Math.random() * (i + 1));
                [array[i], array[j]] = [array[j], array[i]];
            }
            return array;
        }

        function renderDailyFeaturedTitles() {
            const $container = $('#dailyFeaturedTitles');
            const $titleElement = $('#dailyFeaturedTitle');
            if (!$container.length) return;

            const today = new Date().toISOString().split('T')[0];
            const cacheKey = 'dailyFeaturedTitlesCache';
            const indexKey = 'dailyFeaturedIndex';

            const targetThemes = ["let me be", "i believe", "love", "hot", "energy", "party", "relax"];

            let selected = [];
            let currentIndex = parseInt(localStorage.getItem(indexKey)) || 0;
            let themeOfDay = "";

            // Limpa cache se a data mudou
            let cachedData = JSON.parse(localStorage.getItem(cacheKey)) || {};
            if (cachedData.date !== today) {
                localStorage.removeItem(cacheKey);
                cachedData = {};
            }

            if (cachedData.items && cachedData.items.length) {
                selected = cachedData.items;
                themeOfDay = cachedData.theme || "";
            } else {
                const total = targetThemes.length;
                let attempts = 0;

                while (attempts < total) {
                    themeOfDay = targetThemes[currentIndex % total];

                    // Filtra todos os itens com o tema do dia
                    const matchingItems = (currentData.featured || []).filter(item =>
                        item.theme && item.theme.toLowerCase() === themeOfDay.toLowerCase()
                    );

                    if (matchingItems.length > 0) {
                        selected = shuffleArray(matchingItems);

                        localStorage.setItem(indexKey, (currentIndex + 1) % total);
                        localStorage.setItem(cacheKey, JSON.stringify({
                            date: today,
                            theme: themeOfDay,
                            items: selected
                        }));

                        break;
                    } else {
                        currentIndex = (currentIndex + 1) % total;
                        attempts++;
                    }
                }
            }

            // Atualiza o título do dia
            if ($titleElement.length && themeOfDay) {
                $titleElement.text('Especial > ' + themeOfDay);
            }

            // Renderização dos cards
            const html = selected.map(item => `
        <div class="album-card">
            <article class="box post">
                <div class="content">
                    <div class="image fit md-ripples ripples-light play-album" data-position="center" data-id="${item.id || ''}" data-type="featured">
                        <img src="${item.image || ''}" alt="${escapeHtml(item.title || '')}" loading="lazy">
                    </div>
                    <ul class="icons">
                        <li><a href="#" class="icon solid fa-play" data-id="${item.id || ''}" data-type="featured"></a></li>
                    </ul>
                </div>
                <header class="align-left">
                    <h3 class="album-artist">${escapeHtml(item.artist || '')}</h3>
                    <p class="album-title">${escapeHtml(item.title || '')}</p>
                    <p class="album-theme">${escapeHtml(item.theme || '')}</p>
                </header>
            </article>
        </div>
    `).join('');

            $container.html(html);

            $container.find('.play-album, .fa-play').on('click', function() {
                const id = parseInt($(this).data('id'));
                const type = $(this).data('type');
                if (!isNaN(id)) openPlayer(id, type);
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
                .slice(0, 6);

            $container.html(featuredDjs.map(playlist => `
		<div class="album-card">
			<article class="box post">
				<div class="content">
					<div class="image fit md-ripples ripples-light play-album" data-position="center" data-id="${playlist.id || ''}" data-type="featured">
						<img src="${playlist.image || ''}" alt="${escapeHtml(playlist.artist || '')}" loading="lazy">
					</div>
					<ul class="icons">
						<li><a href="#" class="icon solid fa-play" data-id="${playlist.id || ''}" data-type="featured"></a></li>
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
            $container.find('.play-album, .fa-play').on('click', function(e) {
                e.stopPropagation();
                const id = parseInt($(this).data('id'));
                const type = $(this).data('type');
                if (!isNaN(id)) {
                    openPlayer(id, type);
                }
            });

            setupBannerFillColorEvents('featuredPlaylists');

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
                const image = item.image || "https://i.audiomack.com/play90music/20ed96ac4323fe0658b40ab17468c5668c319fec5d1e8c193c2d0ae25648922e.jpeg";

                return `
				<div class="album-card">
					<article class="box post">
						<div class="content">
							<div class="image fit md-ripples ripples-light play-album" data-position="center" data-id="${item.id || ''}" data-type="${entry.type}">
								<img src="${image}" alt="${escapeHtml(title)}" loading="lazy">
							</div>
							<ul class="icons">
								<li><a href="#" class="icon solid fa-play" data-id="${item.id || ''}" data-type="${entry.type}"></a></li>
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
            $container.find('.play-album, .fa-play').on('click', function() {
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
            const updated = filtered.slice(0, 6);
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
				<div class="album-card">
					<article class="box post">
						<div class="content">
							<div class="image fit md-ripples ripples-light play-album" data-position="center" data-id="${inst.id || ''}" data-type="featured">
								<img src="${inst.image || ''}" alt="${escapeHtml(inst.title || '')}" loading="lazy">
							</div>
							<ul class="icons">
								<li><a href="#" class="icon solid fa-play" data-id="${inst.id || ''}" data-type="featured"></a></li>
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

            $container.find('.play-album, .fa-play').on('click', function() {
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
				<div class="album-card">
					<article class="box post">
						<div class="content">
							<div class="image fit md-ripples ripples-light play-album" data-position="center" data-id="${dj.id || ''}" data-type="featured">
								<img src="${dj.image || ''}" alt="${escapeHtml(dj.title || '')}" loading="lazy">
							</div>
							<ul class="icons">
								<li><a href="#" class="icon solid fa-play" data-id="${dj.id || ''}" data-type="featured"></a></li>
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

            $container.find('.play-album, .fa-play').on('click', function() {
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
                const image = music.image || 'https://i.audiomack.com/play90music/20ed96ac4323fe0658b40ab17468c5668c319fec5d1e8c193c2d0ae25648922e.jpeg';

                return `
            <div class="album-card">
				<article class="box post">
						<div class="content">
							<div class="image fit md-ripples ripples-light play-album" data-position="center" data-id="${id}" data-type="featured">
								<img src="${image}" alt="${title} - ${artist}" alt="${escapeHtml(music.title || '')}" loading="lazy">
							</div>
							<ul class="icons">
								<li><a href="#" class="icon solid fa-play" data-id="${id}" data-type="featured"></a></li>
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

            $container.find('.play-album, .fa-play').on('click', function() {
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
				<div class="album-card">
					<article class="box post">
						<div class="content">
							<div class="image fit md-ripples ripples-light play-album" data-position="center" data-id="${album.id || ''}" data-type="featured">
								<img src="${album.image || ''}" alt="${escapeHtml(album.title || '')}" loading="lazy">
							</div>
							<ul class="icons">
								<li><a href="#" class="icon solid fa-play" data-id="${album.id || ''}" data-type="featured"></a></li>
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

            $container.find('.play-album, .fa-play').on('click', function() {
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
                        image: album.image || 'https://i.audiomack.com/play90music/20ed96ac4323fe0658b40ab17468c5668c319fec5d1e8c193c2d0ae25648922e.jpeg'
                    };
                }
                acc[album.artist].albumCount++;
                return acc;
            }, {});

            const subeAlbumYears = Object.values(albumsByTitle).reverse();

            $container.html(subeAlbumYears.map(artist => `
				<div class="artist-card">
					<article class="box post avg">
						<div class="content">
							<div class="image fit circles md-ripples ripples-light artist-show" data-position="center" data-artist="${artist.name}">
								<img src="${artist.image}" alt="${escapeHtml(artist.name)}" loading="lazy">
							</div>
						</div>
						<header class="align-center">
							<h3>${escapeHtml(artist.name)}</h3>
							<p>${artist.albumCount} Álbuns</p>
						</header>
					</article>
				</div>
			`).join(''));

            setupBannerFillColorEvents('allArtists');
			
			// Aplica fillColor apenas no container atual
            $container.find('.avg').fillColor({
                type: 'avg'
            });

            $container.find('.artist-show').on('click', function() {
                const artist = $(this).data('artist');
                renderSubAlbumsByArtist(artist);
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
				<div class="album-card">
					<article class="box post">
						<div class="content">
							<div class="image fit md-ripples ripples-light play-album" data-position="center" data-id="${album.id || ''}" data-type="${albumType}">
								<img src="${album.image || ''}" alt="${escapeHtml(album.title || '')}" loading="lazy">
							</div>
							<ul class="icons">
								<li><a href="#" class="icon solid fa-play" data-id="${album.id || ''}" data-type="${albumType}"></a></li>
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

            $container.find('.play-album, .fa-play').on('click', function(e) {
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
				<div class="album-card">
					<article class="box post">
						<div class="content">
							<div class="image fit md-ripples ripples-light play-album" data-position="center" data-id="${album.id || ''}" data-type="featured">
								<img src="${album.image || ''}" alt="${escapeHtml(album.title || '')}" loading="lazy">
							</div>
							<ul class="icons">
								<li><a href="#" class="icon solid fa-play" data-id="${album.id || ''}" data-type="featured"></a></li>
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

            $container.find('.play-album, .fa-play').on('click', function() {
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
				<div class="album-card">
					<article class="box post">
						<div class="content">
							<div class="image fit md-ripples ripples-light play-album" data-position="center" data-id="${album.id || ''}" data-type="featured">
								<img src="${album.image || ''}" alt="${escapeHtml(album.title || '')}" loading="lazy">
							</div>
							<ul class="icons">
								<li><a href="#" class="icon solid fa-play" data-id="${album.id || ''}" data-type="featured"></a></li>
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

            $container.find('.play-album, .fa-play').on('click', function() {
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
				<div class="album-card">
					<article class="box post">
						<div class="content">
							<div class="image fit md-ripples ripples-light play-album" data-position="center" data-id="${playlist.id || ''}" data-type="featured">
								<img src="${playlist.image || ''}" alt="${escapeHtml(playlist.title || '')}" loading="lazy">
							</div>
							<ul class="icons">
								<li><a href="#" class="icon solid fa-play" data-id="${playlist.id || ''}" data-type="featured"></a></li>
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

            $container.find('.play-album, .fa-play').on('click', function() {
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
				<div class="album-card">
					<article class="box post">
						<div class="content">
							<div class="image fit md-ripples ripples-light play-album" data-position="center" data-id="${album.id}" data-type="${albumType}">
								<img src="${album.image}" alt="${escapeHtml(album.title)}" loading="lazy">
							</div>
							<ul class="icons">
								<li><a href="#" class="icon solid fa-play" data-id="${album.id}" data-type="${albumType}"></a></li>
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

            $container.find('.play-album, .fa-play').on('click', function(e) {
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
            $('#detailGenre').text(item.genre || '');
            $('#detailStyle').text(item.style || '');

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
        function showRelatedAlbums(artist, currentId) {
            const $container = $('#relatedAlbums');
            const $title = $('#relatedArtistName');

            if (!$container.length || !$title.length) return;

            const allItems = [
                ...(currentData.albums || []),
                ...(currentData.singles || []),
                ...(currentData.vinyls || []),
                ...(currentData.featured || []),
                ...(currentData.playlists || []),
                ...(currentData.djs || []),
                ...(currentData.instrumental || [])
            ];

            // Todos os álbuns do artista
            const artistAlbums = allItems.filter(item => item.artist === artist);

            $title.text(artist);

            if (artistAlbums.length === 0) {
                $container.html('<p>Nenhum álbum encontrado.</p>');
                return;
            }

            $container.html(artistAlbums.map(album => `
        <div class="play-album ${album.id === currentId ? 'current' : ''}" data-id="${album.id}" data-type="featured">
            <article class="box post avg md-ripples ripples-light">
                <div class="content">
                    <div class="image fit" data-position="center">
                        <img src="${album.image}" alt="${escapeHtml(album.title)}" loading="lazy">
                    </div>
					<ul class="icons">
						<li class="alt1"><a href="#" class="icon solid fa-play" data-id="${album.id}" data-type="featured"></a></li>
						<li class="alt2"><a href="#" class="icon wave"><span></span><span></span><span></span></span></a></li>
					</ul>
                </div>
                <header class="align-left">
					<h3 class="album-artist">${escapeHtml(album.artist)}</h3>
                    <p class="album-title">${escapeHtml(album.title)}</p>
                </header>
            </article>
        </div>
    `).join(''));

            // Aplica fillColor apenas no container atual
            $container.find('.avg').fillColor({
                type: 'avg'
            });

            // Reaplica eventos de clique
            $container.find('.play-album, .fa-play').on('click', function() {
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
					$(li).addClass('active');   // marca como ativo
				} else {
					$(li).removeClass('active'); // remove ativo
				}
			});
		}

		$(document).on("click", ".fa-list", function(e) {
			e.preventDefault();
			toggleRelated(this);
		});

        // ==================================================================
        // ALTERNAR O CORPO DO PLAYER
        // ==================================================================

        // Alterna o corpo do player
        function togglePlayerBody() {
            const $playerPage = $("#player-page");
            const $mainPanel = $("#main-panel");
            const $sidePanel = $("#side-panel");
            const $arrow = $("#player-bar .fa-long-arrow-down"); // seta única

            if (!$playerPage.length) return;

            // alterna visibilidade do player
            $playerPage.toggleClass("showmore");
            const isOpen = $playerPage.hasClass("showmore");

            if ($mainPanel.length) $mainPanel.css('display', isOpen ? "block" : "none");
            if ($sidePanel.length) $sidePanel.css('display', isOpen ? "block" : "none");

            // alterna a rotação da seta
            $arrow.toggleClass("rotated", isOpen);
        }

        // Clique no ícone
        $(document).on("click", "#player-bar .fa-long-arrow-down", function(e) {
            e.preventDefault();
            togglePlayerBody();
        });

        // Quando clicar num album-card → abre player e garante seta pra baixo
        $(document).on("click", ".play-album, .fa-play", function() {
            const $playerPage = $("#player-page");
            const $arrow = $("#player-bar .fa-long-arrow-down");

            $playerPage.addClass("showmore");
            $("#main-panel, #side-panel").css('display', "block");
            $arrow.addClass("rotated"); // seta desce
        });

        // Content transition
        $(document).on('click', function(e) {
            const target = $(e.target).closest('.play-album, .playlist-card, .artist-show, .genre-card, .fa-play');
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
        function setupBannerFillColorEvents(sectionId, cardSelector = '.play-album, .fa-play') {
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

        // ==================================================================
        // PROGRESS BAR
        // ==================================================================

        // Cria progress-bar se não existir
        if (!$('#progress-bar').length) {
            $('body').prepend('<div id="progress-bar"></div>');
        }

        // Cria spinner dentro do player se não existir
        if (!$('#spinner').length) {
            $('.player-embed').prepend(`
				<div id="spinner" aria-label="Carregando">
					<div class="inner">
						<svg viewBox="0 0 50 50" class="spinner-svg">
							<circle class="spinner-path" cx="25" cy="25" r="20" fill="none" stroke-width="3"></circle>
						</svg>
					</div>
				</div>
			`);
        }

        // Estilo único para progress-bar e spinner
        const style = `
			<style>
				#progress-bar {position: fixed;top: 0;left: 0;height: 2px;width: 0%;background: #f00;z-index: 100001;opacity: 0;}.player-embed {position: relative;min-height: 300px;}#spinner {position: relative;background: #000;height: 100%;width: 100%;display: none;z-index: 1;}.inner {position: absolute;top: 50%;left: 50%;transform: translate(-50%, -50%);z-index: 10;}.spinner-svg {width: 48px;height: 48px;animation: rotate 2s linear infinite;}.spinner-path {stroke: #f00;stroke-linecap: round;animation: dash 1.5s ease-in-out infinite;}@keyframes rotate {100% {transform: rotate(360deg);}}@keyframes dash {0% {stroke-dasharray: 1, 150;stroke-dashoffset: 0;}50% {stroke-dasharray: 90, 150;stroke-dashoffset: -35;}100% {stroke-dasharray: 90, 150;stroke-dashoffset: -124;}}
			</style>
		`;
        $('head').append(style);

        // Funções de controle
        const startProgress = () => {
            $('#progress-bar')
                .stop(true, true)
                .css({
                    width: '0%',
                    opacity: 1,
                    display: 'block'
                })
                .animate({
                    width: '80%'
                }, 500);
        };

        const finishProgress = () => {
            $('#progress-bar')
                .stop(true)
                .animate({
                    width: '100%'
                }, 300, function() {
                    $(this).delay(100).fadeOut(400, () => {
                        $(this).css({
                            width: '0%',
                            display: 'none'
                        });
                    });
                });
        };

        // 1. Ao abrir o site
        startProgress();
        $(document).ready(function() {
            setTimeout(() => finishProgress(), 500);
        });

    });

})(jQuery);
