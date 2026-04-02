(function($) {
    "use strict";

    $.fn.monkMusicPlugin = function(options) {
        const settings = $.extend({
            featuredData: (typeof mockFeatured !== 'undefined') ? mockFeatured : []
        }, options);

        return this.each(function() {
            const $root = $(this);

            let currentData = {
                featured: [...settings.featuredData]
            };
            const originalData = {
                featured: [...settings.featuredData]
            };

            function escapeHtml(str) {
                if (!str) return '';
                return String(str).replace(/&/g, '&amp;')
                    .replace(/"/g, '&quot;')
                    .replace(/</g, '&lt;')
                    .replace(/>/g, '&gt;');
            }

            const $searchInput = $root.find('#searchInput');
            const $navButtons = $root.find('ul li a.nav-btn');
            const $tabContents = $root.find('section .tab-content');

            let searchTimeout;

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

            function setupEventListeners() {
                if ($searchInput.length) {
                    $searchInput.on('input', debouncedHandleSearch);
                    $searchInput.on('keypress', function(event) {
                        if (event.key === 'Enter') {
                            event.preventDefault();
                            handleSearch();
                        }
                    });
                } else {
                    console.warn('Elemento searchInput não encontrado dentro do container.');
                }

                $navButtons.each(function() {
                    $(this).on('click', (event) => {
                        event.preventDefault();
                        const tab = $(this).data('tab');
                        if (tab) {
                            switchTab(tab);
                        }
                    });
                });

                $root.find('#backToArtistsBtn').on('click', (event) => {
                    event.preventDefault();
                    switchTab('artists');
                });

                $root.find('#backToTimelineBtn').on('click', (event) => {
                    event.preventDefault();
                    switchTab('timeline');
                });

                $root.find('#backToMusicsBtn, #backToPlaylistsBtn, #backToAlbunsBtn, #backToSingleBtn, #backToVinylBtn, #backToDjsBtn, #backToInstrumentaisBtn').on('click', (event) => {
                    event.preventDefault();
                    switchTab('artists');
                });

                // Toggle related container
                $root.on("click", ".fa-list", function(e) {
                    e.preventDefault();
                    toggleRelated(this);
                });

                // Toggle player body
                $root.on("click", "#player-bar .fa-long-arrow-down", function(e) {
                    e.preventDefault();
                    togglePlayerBody();
                });

                // Click on album-card to open player and show arrow down
                $root.on("click", ".album-card", function() {
                    const $playerPage = $root.find("#player-page");
                    const $arrow = $root.find("#player-bar .fa-long-arrow-down");

                    $playerPage.addClass("showmore");
                    $root.find("#main-panel, #side-panel").css('display', "block");
                    $arrow.addClass("rotated");
                });

                // Content transition effect
                $root.on('click', function(e) {
                    const target = $(e.target).closest('.album-card, .playlist-card, .artist-card, .genre-card');
                    if (target.length) {
                        target.css('transform', 'scale(0.98)');
                        setTimeout(() => {
                            target.css('transform', '');
                        }, 100);
                    }
                });
            }

            function handleSearch() {
                if (!$searchInput.length) {
                    console.warn('Elemento searchInput não encontrado');
                    return;
                }

                const searchTerm = $searchInput.val().toLowerCase().trim();

                currentData = {
                    featured: [...(originalData.featured || [])]
                };

                renderSearchDropdown(searchTerm);

                try {
                    renderFeaturedAlbums();
                    renderFeaturedDjs();
                    renderDailyHit();
                    renderDailyFeaturedTitles();
                } catch (error) {
                    console.error('Erro durante re-renderização após busca:', error);
                }
            }

            function renderSearchDropdown(searchTerm) {
                const $dropdown = $root.find('#searchDropdown');
                if (!$dropdown.length) return;

                if (!searchTerm) {
                    $dropdown.hide();
                    return;
                }

                const featuredResults = (originalData.featured || [])
                    .filter(item => item && (
                        (item.title && item.title.toLowerCase().includes(searchTerm)) ||
                        (item.artist && item.artist.toLowerCase().includes(searchTerm)) ||
                        (item.name && item.name.toLowerCase().includes(searchTerm)) ||
                        (item.year && item.year.toString().includes(searchTerm))
                    ))
                    .slice(0, 1000);

                if (!featuredResults.length) {
                    $dropdown.hide();
                    return;
                }

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

                $dropdown.find('.result-item').on('click', function() {
                    const id = parseInt($(this).data('id'));
                    const type = $(this).data('type');
                    if (!isNaN(id)) {
                        openPlayer(id, type);
                        $dropdown.hide();
                    }
                });
            }

            function debouncedHandleSearch() {
                clearTimeout(searchTimeout);
                searchTimeout = setTimeout(handleSearch, 300);
            }

            function switchTab(tabName) {
                $navButtons.removeClass('active');
                $navButtons.filter(`[data-tab="${tabName}"]`).addClass('active');

                $tabContents.removeClass('active');
                $tabContents.filter(`#${tabName}`).addClass('active');
            }

            function updateStats() {
                $root.find('#albumCount').text((currentData.albums || []).length);
                $root.find('#artistCount').text((currentData.artists || []).length);
                $root.find('#playlistCount').text((currentData.playlists || []).length);
            }

            function renderFeaturedAlbums() {
                const $container = $root.find('#featuredAlbums');
                if (!$container.length) return;

                const $titleElement = $root.find('#featuredTitle');
                if ($titleElement.length) {
                    $titleElement.text('Álbuns em Destaque');
                }

                const $banner = $root.find('.filtered');

                const featuredAlbums = (currentData.featured || [])
                    .slice()
                    .sort((a, b) => (b.id || 0) - (a.id || 0))
                    .slice(0, 20);

                $container.html(featuredAlbums.map(item => `
                    <div class="album-card" data-id="${item.id || ''}" data-type="featured">
                        <article class="box post">
                            <div class="content">
                                <div class="stack1"></div>
                                <div class="stack2"></div>
                                <div class="image fit md-ripples ripples-light" data-position="center">
                                    <img src="${item.image || ''}" alt="${escapeHtml(item.title || '')}" loading="lazy">
                                </div>
                                <ul class="icons">
                                    <li><a href="#" class="icon solid fa-play"></a></li>
                                </ul>
                            </div>
                            <header class="align-left">
                                <h3 class="album-artist">${escapeHtml(item.artist || '')}</h3>
                                <p class="album-title">${escapeHtml(item.title || '')}</p>
                            </header>
                        </article>
                    </div>
                `).join(''));

                function updateBannerFromSlide($slide) {
                    const imgUrl = $slide.find('img').attr('src');
                    if (imgUrl) {
                        $banner.html(`<img src="${imgUrl}" alt="Banner Image">`);
                        $banner.fillColor({
                            type: 'avgYUV'
                        });
                    }
                }

                if ($container.hasClass('slick-initialized')) {
                    $container.slick('unslick');
                }

                $container.slick({
                    focusOnSelect: true,
                    infinite: true,
                    slidesToShow: 4,
                    speed: 300,
                    slidesToScroll: 1,
                    appendArrows: $root.find('#new-slick-arrow'),
                    nextArrow: '<ul class="icons"><li><a class="icon solid fa-chevron-right md-ripples ripples-light"></a></li></ul>',
                    prevArrow: '<ul class="icons"><li><a class="icon solid fa-chevron-left md-ripples ripples-light"></a></li></ul>',
                    responsive: [{
                        breakpoint: 1280,
                        settings: {
                            slidesToShow: 3
                        }
                    }, {
                        breakpoint: 980,
                        settings: {
                            slidesToShow: 2
                        }
                    }, {
                        breakpoint: 736,
                        settings: {
                            slidesToShow: 2
                        }
                    }, {
                        breakpoint: 480,
                        settings: {
                            slidesToShow: 1
                        }
                    }]
                }).on('afterChange', function(event, slick, currentSlide) {
                    const $current = slick.$slides.eq(currentSlide);
                    updateBannerFromSlide($current);
                });

                setTimeout(() => {
                    const $firstSlide = $container.find('.slick-slide').not('.slick-cloned').eq(0);
                    updateBannerFromSlide($firstSlide);
                }, 50);

                $container.find('.album-card').on('click', function() {
                    const id = parseInt($(this).data('id'));
                    const type = $(this).data('type');
                    if (!isNaN(id)) {
                        openPlayer(id, type);
                    }
                });
            }

            function renderDailyHit(count = 5) {
                const $container = $root.find('#dailyHit');
                if (!$container.length) return;

                const $titleElement = $root.find('#dailyHitTitle');
                if ($titleElement.length) {
                    $titleElement.text('Hits de hoje');
                }

                const today = new Date().toISOString().slice(0, 10);

                let cachedData = localStorage.getItem('dailyHit');
                let dailyHits = [];

                if (cachedData) {
                    try {
                        cachedData = JSON.parse(cachedData);
                        if (cachedData.date === today) {
                            dailyHits = cachedData.items;
                        }
                    } catch (e) {
                        console.error('Erro ao ler cache de Hits do Dia:', e);
                    }
                }

                if (!dailyHits.length) {
                    const items = (currentData.featured || [])
                        .sort(() => Math.random() - 0.5)
                        .slice(0, count);

                    dailyHits = items;

                    localStorage.setItem('dailyHit', JSON.stringify({
                        date: today,
                        items: dailyHits
                    }));
                }

                if (!dailyHits.length) {
                    $container.html('<p>Nenhum hit disponível hoje.</p>');
                    return;
                }

                const html = dailyHits.map(item => `
                    <div class="album-card daily-hit" data-id="${item.id || ''}" data-type="featured">
                        <article class="box post">
                            <div class="content">
                                <div class="image fit md-ripples ripples-light" data-position="center">
                                    <img src="${item.image || ''}" alt="${escapeHtml(item.title || '')}" loading="lazy">
                                </div>
                                <ul class="icons">
                                    <li><a href="#" class="icon solid fa-play"></a></li>
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

                $container.find('.album-card').on('click', function() {
                    const id = parseInt($(this).data('id'));
                    const type = $(this).data('type');
                    if (!isNaN(id)) {
                        openPlayer(id, type);
                    }
                });
            }

            function shuffleArray(array) {
                for (let i = array.length - 1; i > 0; i--) {
                    const j = Math.floor(Math.random() * (i + 1));
                    [array[i], array[j]] = [array[j], array[i]];
                }
                return array;
            }

            function renderDailyFeaturedTitles() {
                const $container = $root.find('#dailyFeaturedTitles');
                const $titleElement = $root.find('#dailyFeaturedTitle');
                if (!$container.length) return;

                const today = new Date().toISOString().split('T')[0];
                const cacheKey = 'dailyFeaturedTitlesCache';
                const indexKey = 'dailyFeaturedIndex';

                const targetThemes = ["let me be", "i believe", "love", "hot", "energy", "party", "relax"];

                let selected = [];
                let currentIndex = parseInt(localStorage.getItem(indexKey)) || 0;
                let themeOfDay = "";

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

                if ($titleElement.length && themeOfDay) {
                    $titleElement.text('Especial > ' + themeOfDay);
                }

                const html = selected.map(item => `
                    <div class="album-card" data-id="${item.id || ''}" data-type="featured">
                        <article class="box post">
                            <div class="content">
                                <div class="image fit md-ripples ripples-light" data-position="center">
                                    <img src="${item.image || ''}" alt="${escapeHtml(item.title || '')}" loading="lazy">
                                </div>
                                <ul class="icons">
                                    <li><a href="#" class="icon solid fa-play"></a></li>
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

                $container.find('.album-card').on('click', function() {
                    const id = parseInt($(this).data('id'));
                    const type = $(this).data('type');
                    if (!isNaN(id)) openPlayer(id, type);
                });
            }

            function renderFeaturedDjs() {
                const $container = $root.find('#featuredDjs');
                if (!$container.length) return;

                const $titleElement = $root.find('#featuredDjsTitle');
                if ($titleElement.length) {
                    $titleElement.text('Mix de DJs');
                }

                const featuredDjs = (currentData.featured || [])
                    .filter(item => (item.format || '').toLowerCase().includes('dj'))
                    .sort((a, b) => (b.id || 0) - (a.id || 0))
                    .slice(0, 5);

                $container.html(featuredDjs.map(playlist => `
                    <div class="album-card" data-id="${playlist.id || ''}" data-type="featured">
                        <article class="box post">
                            <div class="content">
                                <div class="image fit md-ripples ripples-light" data-position="center">
                                    <img src="${playlist.image || ''}" alt="${escapeHtml(playlist.artist || '')}" loading="lazy">
                                </div>
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

                $container.find('.album-card').on('click', function(e) {
                    e.stopPropagation();
                    const id = parseInt($(this).data('id'));
                    const type = $(this).data('type');
                    if (!isNaN(id)) {
                        openPlayer(id, type);
                    }
                });

                setupBannerFillColorEvents('featuredPlaylists');
            }

            function renderRecentlyPlayed() {
                const $container = $root.find('#recentlyPlayed');
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

                    const $titleElement = $root.find('#recentlyPlayedTitle');
                    if ($titleElement.length) {
                        $titleElement.text('Recente');
                    }

                    let item = null;
                    if (sourceTypes[entry.type]) {
                        item = sourceTypes[entry.type].find(i => i.id === entry.id);
                    }

                    if (!item) return '';

                    const title = item.title || item.name || "Sem título";
                    const artist = item.artist || "Vários Artistas";
                    const image = item.image || "https://i.audiomack.com/play90music/20ed96ac4323fe0658b40ab17468c5668c319fec5d1e8c193c2d0ae25648922e.jpeg";

                    return `
            <div class="album-card" data-id="${item.id || ''}" data-type="${entry.type}">
                <article class="box post">
                    <div class="content">
                        <div class="image fit md-ripples ripples-light" data-position="center">
                            <img src="${image}" alt="${escapeHtml(title)}" loading="lazy">
                        </div>
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

                $container.find('.album-card').on('click', function() {
                    const id = parseInt($(this).data('id'));
                    const type = $(this).data('type');
                    if (!isNaN(id)) {
                        openPlayer(id, type);
                    }
                });
            }

            function saveToRecentlyPlayed(item) {
                const key = 'recentlyPlayed';
                const stored = JSON.parse(localStorage.getItem(key)) || [];

                // Remove duplicados (mesmo id e tipo)
                const filtered = stored.filter(entry => !(entry.id === item.id && entry.type === item.type));

                // Coloca o novo no topo
                filtered.unshift(item);

                // Limita a 5
                const updated = filtered.slice(0, 5);
                localStorage.setItem(key, JSON.stringify(updated));

                renderRecentlyPlayed();
            }

            function renderAllInstrumental() {
                const $container = $root.find('#allInstrumentals');
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
                                <div class="image fit md-ripples ripples-light" data-position="center">
                                    <img src="${inst.image || ''}" alt="${escapeHtml(inst.title || '')}" loading="lazy">
                                </div>
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

            function renderAllDjs() {
                const $container = $root.find('#allDjs');
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
                                <div class="image fit md-ripples ripples-light" data-position="center">
                                    <img src="${dj.image || ''}" alt="${escapeHtml(dj.title || '')}" loading="lazy">
                                </div>
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

            function renderMusics() {
                const $container = $root.find('#allMusics');
                if (!$container.length) return;

                const sortedMusics = (currentData.featured || [])
                    .filter(music => music.format === "Music")
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
                        <div class="album-card" data-id="${id}" data-type="featured">
                            <article class="box post">
                                <div class="content">
                                    <div class="image fit md-ripples ripples-light" data-position="center">
                                        <img src="${image}" alt="${title} - ${artist}" loading="lazy">
                                    </div>
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

            function renderAllAlbums() {
                const $container = $root.find('#allAlbums');
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
                                <div class="image fit md-ripples ripples-light" data-position="center">
                                    <img src="${album.image || ''}" alt="${escapeHtml(album.title || '')}" loading="lazy">
                                </div>
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

            function renderAllArtists() {
                const $container = $root.find('#allArtists');
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
                    <div class="artist-card" data-artist="${artist.name}">
                        <article class="box post">
                            <div class="content">
                                <div class="image fit circles md-ripples ripples-light" data-position="center">
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

                $container.find('.artist-card').on('click', function() {
                    const artist = $(this).data('artist');
                    renderSubAlbumsByArtist(artist);
                });
            }

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
                const $container = $root.find('#suballAlbums');
                const $title = $root.find('#subalbumsTitle');

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
                                    <div class="image fit md-ripples ripples-light" data-position="center">
                                        <img src="${album.image || ''}" alt="${escapeHtml(album.title || '')}" loading="lazy">
                                    </div>
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

            function renderAllVinyls() {
                const $container = $root.find('#allVinyls');
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
                                <div class="image fit md-ripples ripples-light" data-position="center">
                                    <img src="${album.image || ''}" alt="${escapeHtml(album.title || '')}" loading="lazy">
                                </div>
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

            function renderAllSingles() {
                const $container = $root.find('#allSingles');
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
                                <div class="image fit md-ripples ripples-light" data-position="center">
                                    <img src="${album.image || ''}" alt="${escapeHtml(album.title || '')}" loading="lazy">
                                </div>
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

            function renderAllPlaylists() {
                const $container = $root.find('#allPlaylists');
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
                                <div class="image fit md-ripples ripples-light" data-position="center">
                                    <img src="${playlist.image || ''}" alt="${escapeHtml(playlist.title || '')}" loading="lazy">
                                </div>
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

            function renderTimeline() {
                const $container = $root.find('#allTimeline');
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

                $container.find('.timeline-card').on('click', function() {
                    const year = $(this).data('year');
                    renderAlbumsByYear(year);
                });

                setupBannerFillColorEvents('allTimeline');
            }

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

                const $container = $root.find('#yearAlbumsList');
                const $title = $root.find('#yearAlbumsTitle');
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
                                    <div class="image fit md-ripples ripples-light" data-position="center">
                                        <img src="${album.image}" alt="${escapeHtml(album.title)}" loading="lazy">
                                    </div>
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

                const $iframe = $root.find('.player-embed iframe');
                if ($iframe.length) {
                    $iframe.attr('src', item.embedUrl);
                } else {
                    const $embedContainer = $root.find('.player-embed');
                    $embedContainer.html(`<iframe src="${item.embedUrl}" frameborder="0" allow="autoplay" scrolling="no"></iframe>`);
                }

                showRelatedAlbums(item.artist, id);

                $root.find('#player-bar').addClass('active');

                if (!item) {
                    for (let key in allSources) {
                        item = allSources[key].find(el => el.id === id);
                        if (item) {
                            console.warn(`Tipo original '${type}' não encontrou. Usando '${key}' para id=${id}`);
                            type = key;
                            break;
                        }
                    }
                }

                if (!item) {
                    console.error(`Item não encontrado: id=${id}, type=${type}`);
                    return;
                }

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

                $root.find('#playerImage').attr('src', item.image || '');
                $root.find('#playerTitle').text(item.title || '');
                $root.find('#playerArtist').text(item.artist || '');
                $root.find('#playerFrame').attr('src', item.embedUrl || '');

                $root.find('#detailArtist').text(item.artist || '');
                $root.find('#detailYear').text(item.year || '');
                $root.find('#detailLabel').text(item.label || '');
                $root.find('#detailCountry').text(item.country || '');
                $root.find('#detailFormat').text(item.format || '');
                $root.find('#detailGenre').text(item.genre || '');
                $root.find('#detailStyle').text(item.style || '');

                const $playerBar = $root.find('#player-bar');
                if ($playerBar.length) {
                    $playerBar.addClass('opened').css('display', 'block');
                }

                const $playerPage = $root.find('#player-page');
                if ($playerPage.length && !$playerPage.hasClass('showmore')) {
                    togglePlayerBody();
                }

                saveToRecentlyPlayed({
                    id,
                    type
                });
            }

            function showRelatedAlbums(artist, currentId) {
                const $container = $root.find('#relatedAlbums');
                const $title = $root.find('#relatedArtistName');

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

                const artistAlbums = allItems.filter(item => item.artist === artist);

                $title.text(artist);

                if (artistAlbums.length === 0) {
                    $container.html('<p>Nenhum álbum encontrado.</p>');
                    return;
                }

                $container.html(artistAlbums.map(album => `
                    <div class="album-card ${album.id === currentId ? 'current' : ''}" data-id="${album.id}" data-type="featured">
                        <article class="box post avg md-ripples ripples-light">
                            <div class="content">
                                <div class="image fit" data-position="center">
                                    <img src="${album.image}" alt="${escapeHtml(album.title)}" loading="lazy">
                                </div>
                                <ul class="icons">
                                    <li class="alt1"><a href="#" class="icon solid fa-play"></a></li>
                                    <li class="alt2"><a href="#" class="icon wave"><span></span><span></span><span></span></a></li>
                                </ul>
                            </div>
                            <header class="align-left">
                                <h3 class="album-artist">${escapeHtml(album.artist)}</h3>
                                <p class="album-title">${escapeHtml(album.title)}</p>
                            </header>
                        </article>
                    </div>
                `).join(''));

                $container.find('.avg').fillColor({
                    type: 'avg'
                });

                $container.find('.album-card').on('click', function() {
                    const id = parseInt($(this).data('id'));
                    const type = $(this).data('type');
                    openPlayer(id, type);
                });
            }

            function toggleRelated(li) {
                const $relatedContainer = $root.find('#relatedContainer');
                if (!$relatedContainer.length) return;

                $relatedContainer.slideToggle(300, () => {
                    if ($relatedContainer.is(':visible')) {
                        $(li).addClass('active');
                    } else {
                        $(li).removeClass('active');
                    }
                });
            }

            function togglePlayerBody() {
                const $playerPage = $root.find("#player-page");
                const $mainPanel = $root.find("#main-panel");
                const $sidePanel = $root.find("#side-panel");
                const $arrow = $root.find("#player-bar .fa-long-arrow-down");

                if (!$playerPage.length) return;

                $playerPage.toggleClass("showmore");
                const isOpen = $playerPage.hasClass("showmore");

                if ($mainPanel.length) $mainPanel.css('display', isOpen ? "block" : "none");
                if ($sidePanel.length) $sidePanel.css('display', isOpen ? "block" : "none");

                $arrow.toggleClass("rotated", isOpen);
            }

            function setupBannerFillColorEvents(sectionId, cardSelector = '.album-card') {
                const $section = $root.find('#' + sectionId);
                const $banner = $root.find('.filtered');

                if (!$section.length || !$banner.length) return;

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

            // Inicialização do plugin
            try {
                initializeApp();
                setupEventListeners();
                console.log('MonkMusic: Plugin inicializado com sucesso');
            } catch (error) {
                console.error('Erro durante inicialização do plugin:', error);
            }
        });
    };

})(jQuery);

/*

init Plugin

$(document).ready(function() {
    $('body').monkMusicPlugin({
        featuredData: mockFeatured
    });
});

*/
