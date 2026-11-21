(() => {
    const STORAGE_KEYS = {
        saved: 'crafthub-saved-guides',
        recent: 'crafthub-recent-guides',
        checklistPrefix: 'crafthub-checklist:',
        customArticles: 'minecraft-blog-articles'
    };

    function escapeHtml(value) {
        return String(value || '')
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/\"/g, '&quot;')
            .replace(/'/g, '&#039;');
    }

    function formatCommentDate(value) {
        const date = new Date(value);
        if (Number.isNaN(date.getTime())) return String(value || '');
        return date.toLocaleString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric',
            hour: 'numeric',
            minute: '2-digit'
        });
    }

    function readCustomArticles() {
        try {
            const raw = window.localStorage.getItem(STORAGE_KEYS.customArticles);
            const parsed = raw ? JSON.parse(raw) : [];
            return Array.isArray(parsed) ? parsed : [];
        } catch (error) {
            return [];
        }
    }

    function readArticleOverrides() {
        const stored = readCustomArticles();
        const map = new Map();
        stored.forEach((article) => {
            if (!article || !article.id) return;
            map.set(String(article.id), article);
        });
        return map;
    }

    function readHiddenArticleIds() {
        return new Set(
            readCustomArticles()
                .filter((article) => article && article.id && article.hidden)
                .map((article) => String(article.id))
        );
    }

    function applyArticleOverrides() {
        const overrides = readArticleOverrides();
        const hiddenIds = readHiddenArticleIds();

        guideCards.forEach((card) => {
            if (!card || !card.dataset || !card.dataset.href) return;
            const articleId = String(card.dataset.href).replace(/\.html$/i, '').replace(/^articles\//, '').replace(/^article-view\.html\?id=/, '');
            const override = overrides.get(articleId);
            const isHidden = hiddenIds.has(articleId) || override?.hidden;
            if (isHidden) {
                card.hidden = true;
                return;
            }
            card.hidden = false;
            if (!override) return;
            const title = card.querySelector('h3 a');
            const meta = card.querySelector('p');
            const image = card.querySelector('img');
            if (title && override.title) title.textContent = override.title;
            if (image && override.image) image.src = override.image;
            if (override.category) {
                card.dataset.category = override.category.toLowerCase();
                const catLink = card.querySelector('.post-category');
                if (catLink) {
                    catLink.textContent = override.category;
                    catLink.href = `pages/categories.html#${override.category.toLowerCase()}`;
                }
            }
            if (override.difficulty) card.dataset.difficulty = override.difficulty.toLowerCase();
            if (override.readingMinutes) card.dataset.readingMinutes = String(override.readingMinutes);
            if (override.excerpt && meta) meta.textContent = override.excerpt;
            if (override.accentColor) {
                const categoryLink = card.querySelector('.post-category');
                if (categoryLink) categoryLink.style.backgroundColor = override.accentColor;
            }
        });
    }

    function renderCustomArticleCards() {
        const container = document.getElementById('post-list');
        if (!container) return;

        const customArticles = readCustomArticles()
            .filter((article) => article && !article.hidden)
            .slice()
            .sort((first, second) => {
                const featuredDiff = Number(Boolean(second.featured)) - Number(Boolean(first.featured));
                if (featuredDiff !== 0) return featuredDiff;
                return new Date(second.createdAt || 0).getTime() - new Date(first.createdAt || 0).getTime();
            });

        if (!customArticles.length) return;

        customArticles.forEach((article) => {
            const articleKey = String(article.id || '');
            if (!articleKey) return;

            const existingCard = container.querySelector(`[data-custom-id="${CSS.escape(articleKey)}"]`);
            if (existingCard) return;

            const card = document.createElement('article');
            card.className = 'post-card custom-article-card';
            card.dataset.customId = articleKey;
            card.dataset.href = `article-view.html?id=${encodeURIComponent(articleKey)}`;
            card.dataset.category = (article.category || 'survival').toLowerCase();
            card.dataset.topic = (article.category || 'survival').toLowerCase();
            card.dataset.difficulty = (article.difficulty || 'beginner').toLowerCase();
            card.dataset.mode = 'survival';
            card.dataset.version = 'general';
            card.dataset.tags = [article.category || 'survival', ...(article.tags || [])].join(' ').toLowerCase();
            card.dataset.readingMinutes = String(article.readingMinutes || 3);
            card.dataset.author = (article.author || 'admin').toLowerCase().replace(/\s+/g, '-');
            card.dataset.search = `${article.title || ''} ${article.excerpt || ''} ${article.content || ''}`.toLowerCase();

            const imageSrc = article.image || 'assets/images/optimized/main.jpg';
            const articleHref = `article-view.html?id=${encodeURIComponent(articleKey)}`;
            const accentColor = article.accentColor || '#5D9C3E';
            const safeTitle = escapeHtml(article.title || 'Custom Article');
            const safeExcerpt = escapeHtml(article.excerpt || 'This article was added from the admin panel.');
            const safeCategory = escapeHtml(article.category || 'Survival');
            const safeAuthor = escapeHtml(article.author || 'Admin');
            const safeDifficulty = escapeHtml(article.difficulty || 'Beginner');
            const safeMinutes = escapeHtml(article.readingMinutes || 3);

            card.innerHTML = `
                <a class="post-image-link" href="${articleHref}" aria-label="Read ${safeTitle}">
                    <img src="${imageSrc}" alt="${safeTitle}" width="450" height="250" loading="lazy" decoding="async">
                </a>
                <a class="post-category" href="pages/categories.html#${(article.category || 'survival').toLowerCase()}" style="background-color:${accentColor};">${safeCategory}</a>
                <h3><a href="${articleHref}">${safeTitle}</a></h3>
                <p class="post-labels"><span>${safeDifficulty}</span><span>About ${safeMinutes} min</span><span>Version-independent</span></p>
                <p class="post-meta">Published <time datetime="${new Date(article.createdAt || Date.now()).toISOString()}">${new Date(article.createdAt || Date.now()).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</time> by <a href="pages/authors.html#${escapeHtml((article.author || 'admin').toLowerCase().replace(/\s+/g, '-'))}">${safeAuthor}</a></p>
                <p>${safeExcerpt}</p>
                <div class="post-card-actions">
                    <a class="read-more" href="${articleHref}">Read article</a>
                    <button class="save-button" type="button" data-save-href="${escapeHtml(articleKey)}">Save for later</button>
                </div>
            `;
            container.appendChild(card);
            guideCards.push(card);
        });
    }

    const guideCards = Array.from(document.querySelectorAll('.post-card'));
    renderCustomArticleCards();
    applyArticleOverrides();

    const currentGuide = document.querySelector('[data-article-guide]');
    const status = createStatus();

    const guideCatalog = [
        {
            href: 'article-first-night.html',
            title: '5 Essential Tips to Survive Your First Night in Minecraft',
            category: 'survival',
            tags: ['survival', 'beginner', 'starter']
        },
        {
            href: 'article-survival-base.html',
            title: 'The Ultimate Minecraft Survival Guide: From Dirt Shack to Mega Base',
            category: 'building',
            tags: ['survival', 'building', 'base', 'planning']
        },
        {
            href: 'article-auto-farms.html',
            title: 'Essential Minecraft Auto Farms: 3 Beginner Projects',
            category: 'farming',
            tags: ['survival', 'farming', 'redstone', 'automation', 'beginner']
        },
        {
            href: 'article-iron-tools.html',
            title: "A Beginner's Guide to Finding and Using Iron",
            category: 'survival',
            tags: ['survival', 'beginner', 'mining', 'iron', 'tools']
        },
        {
            href: 'article-caving-safely.html',
            title: 'How to Explore Caves More Safely',
            category: 'survival',
            tags: ['survival', 'mining', 'caves', 'caving', 'safety']
        },
        {
            href: 'article-food-storage.html',
            title: 'Reliable Food for a Long Minecraft Journey',
            category: 'farming',
            tags: ['survival', 'food', 'farming', 'crops', 'cooking']
        },
        {
            href: 'article-enchanting-setup.html',
            title: 'Build a Practical Enchanting Corner',
            category: 'building',
            tags: ['building', 'enchanting', 'bookshelves', 'experience', 'survival']
        },
        {
            href: 'article-nether-preparation.html',
            title: 'Prepare for Your First Nether Trip',
            category: 'survival',
            tags: ['survival', 'nether', 'portal', 'preparation', 'exploration']
        },
        {
            href: 'article-village-trading.html',
            title: 'Set Up a Safe Village Trading Route',
            category: 'survival',
            tags: ['survival', 'village', 'trading', 'villagers', 'safety']
        },
        {
            href: 'article-lighting-builds.html',
            title: 'Light a Build Without Losing Its Atmosphere',
            category: 'building',
            tags: ['building', 'lighting', 'decoration', 'creative', 'survival']
        },
        {
            href: 'article-compost-farm.html',
            title: 'Turn Spare Crops into Useful Bone Meal',
            category: 'farming',
            tags: ['farming', 'compost', 'crops', 'bonemeal', 'survival']
        },
        {
            href: 'article-organized-storage.html',
            title: 'Organize Storage That Can Grow with Your Base',
            category: 'building',
            tags: ['building', 'storage', 'organization', 'chests', 'base']
        },
        {
            href: 'article-early-game-transport.html',
            title: 'Build Paths and Bridges for Easier Travel',
            category: 'building',
            tags: ['building', 'transport', 'paths', 'bridges', 'survival', 'travel']
        }
    ];

    // PAGE MESSAGES
    // Show feature messages in one accessible place.
    function createStatus() {
        const main = document.querySelector('main');
       if (!main) return null;
        const message = document.createElement('p'); 
        message.className = 'site-status';
        message.setAttribute('role', 'status');
        message.setAttribute('aria-live', 'polite');
        message.hidden = true;
        main.prepend(message);
        return message;
    }

    function announce(message) {
        if (!status) return;
        status.textContent = message;
        status.hidden = false;
    }

    function readValue(key, fallback, isValid) {
        let stored;
        try {
            stored = window.localStorage.getItem(key);
        } catch (error) {
            announce('Browser storage is unavailable. Saved guides and checklist progress may not persist on this device.');
            return fallback;
        }
        if (stored === null) return fallback;
        let parsed;
        try {
            parsed = JSON.parse(stored);
        } catch (error) {
            announce('Saved CraftHub data is corrupted and could not be loaded.');
            return fallback;
        }
        if (!isValid(parsed)) {
            announce('Some saved CraftHub data is invalid and could not be loaded.');
            return fallback;
        }
        return parsed;
    }

    function writeValue(key, value) {
        try {
            window.localStorage.setItem(key, JSON.stringify(value));
            return true;
        } catch (error) {
            announce('CraftHub could not save this change in browser storage. Check your browser storage settings and available space.');
            return false;
        }
    }

    function readGuideList(key) {
        return readValue(key, [], (value) => Array.isArray(value) && value.every((item) => typeof item === 'string'));
    }

    function getHref() {
        return window.location.pathname.split('/').pop();
    }

    function getCatalog() {
        const hiddenIds = readHiddenArticleIds();
        const cardsByHref = new Map(guideCards
            .filter((card) => !hiddenIds.has(resolveCardArticleId(card)))
            .map((card) => [card.dataset.href, card]));
        return guideCatalog
            .filter((guide) => !hiddenIds.has(String(guide.href).replace(/\.html$/i, '').replace(/^articles\//, '')))
            .map((guide) => {
                const card = cardsByHref.get(guide.href);
                return card ? {
                    ...guide,
                    title: card.querySelector('h3 a').textContent.trim(),
                    category: card.dataset.category,
                    tags: card.dataset.tags.split(/\s+/)
                } : guide;
            });
    }

    function getCustomArticleCatalog() {
        return readCustomArticles()
            .filter((article) => article && !article.hidden)
            .map((article) => ({
                href: `article-view.html?id=${article.id}`,
                title: article.title || 'Custom Article',
                category: (article.category || 'survival').toLowerCase(),
                tags: [...(article.tags || []), (article.category || 'survival')],
                isCustom: true,
                customId: article.id
            }));
    }

    function findGuideByHref(href) {
        const normalized = String(href);
        const catalog = [...getCatalog(), ...getCustomArticleCatalog()];
        return catalog.find((item) => item.href === normalized || item.customId === normalized || item.href.endsWith(`id=${normalized}`));
    }

    function renderGuideList(container, emptyMessage, hrefs, removable) {
        if (!container) return;
        const catalog = [...getCatalog(), ...getCustomArticleCatalog()];
        container.replaceChildren();
        let renderedCount = 0;

        hrefs.forEach((href) => {
            const guide = catalog.find((item) => item.href === String(href) || item.customId === String(href) || item.href.endsWith(`id=${String(href)}`));
            if (!guide) return;
            const item = document.createElement('li');
            const link = document.createElement('a');
            link.href = guide.href;
            link.textContent = guide.title;
            item.append(link);

            if (removable) {
                const removeButton = document.createElement('button');
                removeButton.type = 'button';
                removeButton.className = 'remove-saved-button';
                removeButton.dataset.removeSavedHref = String(href);
                removeButton.textContent = 'Remove';
                removeButton.setAttribute('aria-label', `Remove ${guide.title} from saved guides`);
                item.append(removeButton);
            }

            container.append(item);
            renderedCount += 1;
        });

        if (emptyMessage) emptyMessage.hidden = renderedCount > 0;
    }

    function syncSaveButtons() {
        const saved = readGuideList(STORAGE_KEYS.saved);
        document.querySelectorAll('[data-save-href]').forEach((button) => {
            const saveHref = String(button.dataset.saveHref);
            const isSaved = saved.includes(saveHref);
            button.textContent = isSaved ? 'Remove saved guide' : 'Save for later';
            button.setAttribute('aria-pressed', String(isSaved));
        });
    }

    function renderSavedAndRecent() {
        renderGuideList(
            document.getElementById('saved-list'),
            document.getElementById('saved-empty'),
            readGuideList(STORAGE_KEYS.saved),
            true
        );
        renderGuideList(
            document.getElementById('recent-list'),
            document.getElementById('recent-empty'),
            readGuideList(STORAGE_KEYS.recent),
            false
        );
        const continueList = document.getElementById('continue-reading-list');
        if (continueList) {
            const recent = readGuideList(STORAGE_KEYS.recent).slice(0, 3);
            if (recent.length) {
                continueList.replaceChildren();
                recent.forEach((href) => {
                    const match = guideCatalog.find((guide) => guide.href === href || href.endsWith(`/${guide.href}`));
                    if (!match) return;
                    const item = document.createElement('li');
                    const link = document.createElement('a');
                    link.href = href.startsWith('article-') ? `articles/${href}` : href;
                    link.textContent = match.title;
                    item.appendChild(link);
                    continueList.appendChild(item);
                });
            }
        }
        syncSaveButtons();
    }

    function recordCurrentGuide() {
        if (!currentGuide) return;
        const historyEnabled = readValue('crafthub-reading-history-enabled', true, (value) => typeof value === 'boolean');
        if (!historyEnabled) return;
        const href = getHref();
        const recent = readGuideList(STORAGE_KEYS.recent).filter((item) => item !== href);
        recent.unshift(href);
        if (writeValue(STORAGE_KEYS.recent, recent.slice(0, 5))) {
            announce('Added to your recently viewed guides.');
        }
    }

    function resolveCardArticleId(card) {
        const href = card && card.dataset ? String(card.dataset.href || '') : '';
        if (!href) return '';
        if (href.startsWith('article-view.html?id=')) return decodeURIComponent(href.replace(/^article-view\.html\?id=/i, ''));
        return href.replace(/\.html$/i, '').replace(/^articles\//, '');
    }

    function matchesSelectedFilters(card, filters) {
        return filters.every((filter) => {
            const value = filter.value;
            if (value === 'all') return true;

            const dataKey = filter.id.replace('-filter', '');
            const cardValue = card.dataset[dataKey];
            if (dataKey === 'mode' && value !== 'both') {
                return cardValue === value || cardValue === 'both';
            }
            return cardValue === value;
        });
    }

    function initializeFilters() {
        if (guideCards.length === 0) return;
        const searchInput = document.getElementById('post-search');
        const sortSelect = document.getElementById('sort-posts');
        const filterIds = ['category', 'difficulty', 'topic', 'mode', 'version'];
        const filters = filterIds
            .map((id) => document.getElementById(`${id}-filter`))
            .filter((filter) => filter);
        const postCount = document.getElementById('post-count');
        const noPostsMessage = document.getElementById('no-posts');
        let selectedAuthor = new URLSearchParams(window.location.search).get('author');
        let currentPage = 1;
        const pageSize = 6;

        function sortCards(sortMode) {
            const container = document.getElementById('post-list');
            if (!container) return;
            const sorted = guideCards.slice().sort((first, second) => {
                if (sortMode === 'title') {
                    return (first.querySelector('h3')?.textContent || '').localeCompare(second.querySelector('h3')?.textContent || '');
                }
                if (sortMode === 'quick') {
                    return Number(first.dataset.readingMinutes || 99) - Number(second.dataset.readingMinutes || 99);
                }
                if (sortMode === 'newest') {
                    const firstDate = first.querySelector('time')?.dateTime || '';
                    const secondDate = second.querySelector('time')?.dateTime || '';
                    return secondDate.localeCompare(firstDate);
                }
                return Number(Boolean(second.dataset.featured)) - Number(Boolean(first.dataset.featured));
            });
            sorted.forEach((card) => container.appendChild(card));
        }

        function renderPagination(visibleCards) {
            const pagination = document.getElementById('post-pagination');
            if (!pagination) return;
            const pageCount = Math.ceil(visibleCards.length / pageSize);
            if (currentPage > pageCount) currentPage = Math.max(1, pageCount);
            const start = (currentPage - 1) * pageSize;
            visibleCards.forEach((card, index) => {
                card.hidden = index < start || index >= start + pageSize;
            });
            pagination.replaceChildren();
            if (pageCount <= 1) return;

            for (let page = 1; page <= pageCount; page += 1) {
                const button = document.createElement('button');
                button.type = 'button';
                button.textContent = String(page);
                button.classList.toggle('active', page === currentPage);
                button.setAttribute('aria-label', `Go to article page ${page}`);
                button.addEventListener('click', () => {
                    currentPage = page;
                    renderPagination(visibleCards);
                    document.getElementById('post-list')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
                });
                pagination.appendChild(button);
            }
        }

        function filterPosts() {
            const searchTerm = searchInput ? searchInput.value.trim().toLowerCase() : '';
            const hiddenIds = readHiddenArticleIds();
            let visibleCount = 0;
            sortCards(sortSelect ? sortSelect.value : 'featured');

            guideCards.forEach((card) => {
                const articleId = resolveCardArticleId(card);
                const isHidden = hiddenIds.has(articleId) || card.hidden && !articleId;
                const matchesAuthor = !selectedAuthor || card.dataset.author === selectedAuthor;
                const searchText = `${card.dataset.search} ${card.textContent}`.toLowerCase();
                const matchesSearch = searchText.includes(searchTerm);
                const matchesFilters = matchesSelectedFilters(card, filters);
                const visible = !isHidden && matchesAuthor && matchesSearch && matchesFilters;
                card.hidden = !visible;
                if (visible) visibleCount += 1;
            });

            const visibleCards = guideCards.filter((card) => !card.hidden);
            if (visibleCards.length) {
                visibleCards.forAll = undefined;
            }
            renderPagination(visibleCards);
            if (postCount) postCount.textContent = `Showing ${visibleCount} ${visibleCount === 1 ? 'article' : 'articles'}`;
            if (noPostsMessage) noPostsMessage.hidden = visibleCount > 0;
        }

        const params = new URLSearchParams(window.location.search);
        filters.forEach((filter) => {
            const param = filter.id.replace('-filter', '');
            const requested = params.get(param);
            if (Array.from(filter.options).some((option) => option.value === requested)) {
                filter.value = requested;
            }
            filter.addEventListener('change', filterPosts);
        });
        if (searchInput) searchInput.addEventListener('input', filterPosts);
        if (sortSelect) sortSelect.addEventListener('change', () => {
            currentPage = 1;
            filterPosts();
        });
        filterPosts();

        const resetButton = document.getElementById('reset-filters');
        if (resetButton) {
            resetButton.addEventListener('click', () => {
                if (searchInput) searchInput.value = '';
                filters.forEach((filter) => {
                    filter.value = 'all';
                });
                if (sortSelect) sortSelect.value = 'featured';
                currentPage = 1;
                selectedAuthor = null;

                const params = new URLSearchParams(window.location.search);
                [...filterIds, 'author'].forEach((param) => params.delete(param));
                const query = params.toString();
                const nextUrl = `${window.location.pathname}${query ? `?${query}` : ''}${window.location.hash}`;
                window.history.replaceState(null, '', nextUrl);
                filterPosts();
            });
        }

        const surpriseButton = document.getElementById('surprise-button');
        if (surpriseButton) {
            surpriseButton.addEventListener('click', () => {
                const visibleCards = guideCards.filter((card) => !card.hidden);
                if (visibleCards.length === 0) {
                    announce('No guides match the selected filters. Adjust your filters and try again.');
                    return;
                }
                const chosen = visibleCards[Math.floor(Math.random() * visibleCards.length)];
                const readMoreLink = chosen ? chosen.querySelector('.read-more') : null;
                const targetHref = readMoreLink && readMoreLink.getAttribute('href')
                    ? readMoreLink.getAttribute('href')
                    : chosen && chosen.dataset.href.startsWith('article-view.html')
                        ? chosen.dataset.href
                        : chosen && chosen.dataset.href
                            ? `articles/${chosen.dataset.href}`
                            : 'index.html';
                window.location.href = targetHref;
            });
        }
    }

    function initializeSaving() {
        syncSaveButtons();
        document.addEventListener('click', (event) => {
            const target = event.target;
            if (!(target instanceof Element)) return;

            const saveButton = target.closest('[data-save-href]');
            if (saveButton) {
                const href = saveButton.dataset.saveHref;
                const saved = readGuideList(STORAGE_KEYS.saved);
                const next = saved.includes(href)
                    ? saved.filter((item) => item !== href)
                    : [href, ...saved];
                if (writeValue(STORAGE_KEYS.saved, next)) {
                    announce(next.includes(href) ? 'Guide saved for later.' : 'Guide removed from saved guides.');
                    renderSavedAndRecent();
                }
                return;
            }

            const removeButton = target.closest('[data-remove-saved-href]');
            if (removeButton) {
                const href = removeButton.dataset.removeSavedHref;
                const next = readGuideList(STORAGE_KEYS.saved).filter((item) => item !== href);
                if (writeValue(STORAGE_KEYS.saved, next)) {
                    announce('Guide removed from saved guides.');
                    renderSavedAndRecent();
                }
            }
        });
    }

    function initializeRelatedGuides() {
        if (!currentGuide) return;
        const section = document.querySelector('[data-related-guides]');
        if (!section) return;

        const currentTags = new Set(currentGuide.dataset.tags.split(/\s+/));
        const currentHref = getHref();
        const suggestions = getCatalog()
            .filter((guide) => guide.href !== currentHref)
            .map((guide) => ({
                ...guide,
                score: guide.tags.filter((tag) => currentTags.has(tag)).length +
                    (guide.category === currentGuide.dataset.category ? 2 : 0)
            }))
            .filter((guide) => guide.score > 0)
            .sort((first, second) => second.score - first.score)
            .slice(0, 3);

        section.querySelectorAll('a').forEach((link) => link.remove());
        if (suggestions.length === 0) return;
        suggestions.forEach((guide) => {
            const link = document.createElement('a');
            link.href = guide.href;
            link.textContent = guide.title;
            section.append(link);
        });
    }

    function initializeGuideLabels() {
        document.querySelectorAll('.post-card, [data-article-guide]').forEach((guide) => {
            const labels = guide.querySelector('.post-labels');
            if (!labels) return;
            const versionLabel = guide.dataset.version === 'general'
                ? 'Version-independent'
                : guide.dataset.version;
            const values = [
                guide.dataset.difficulty,
                `About ${guide.dataset.readingMinutes} min`,
                versionLabel
            ];
            labels.replaceChildren(...values.map((value) => {
                const label = document.createElement('span');
                label.textContent = value.charAt(0).toUpperCase() + value.slice(1);
                return label;
            }));
        });
    }

    function initializeReadingProgress() {
        if (!currentGuide) return;
        const wordCount = currentGuide.textContent.trim().split(/\s+/).length;
        const imageCount = currentGuide.querySelectorAll('img').length;
        if (wordCount < 250 && imageCount < 5) return;

        const progress = document.createElement('div');
        progress.className = 'reading-progress';
        progress.setAttribute('role', 'progressbar');
        progress.setAttribute('aria-label', 'Article reading progress');
        progress.setAttribute('aria-valuemin', '0');
        progress.setAttribute('aria-valuemax', '100');
        const bar = document.createElement('span');
        progress.append(bar);
        document.body.prepend(progress);

        function updateProgress() {
            const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
            const percent = maxScroll > 0
                ? Math.min(100, Math.max(0, Math.round((window.scrollY / maxScroll) * 100)))
                : 100;
            bar.style.width = `${percent}%`;
            progress.setAttribute('aria-valuenow', String(percent));
        }
        window.addEventListener('scroll', updateProgress, { passive: true });
        window.addEventListener('resize', updateProgress);
        updateProgress();
    }

    function initializeChecklists() {
        const pageId = getHref();
        const lists = Array.from(document.querySelectorAll('.interactive-checklist'));
        document.querySelectorAll('.post-content h4').forEach((heading) => {
            const label = heading.textContent.trim().toLowerCase();
            if (label !== 'materials' && label !== 'basic steps') return;
            const list = heading.nextElementSibling;
            if (list && (list.tagName === 'UL' || list.tagName === 'OL')) {
                list.classList.add('interactive-checklist');
                list.dataset.checklistId = `${label.replace(/\s+/g, '-')}-${lists.length}`;
                lists.push(list);
            }
        });

        lists.forEach((list) => {
            const checklistId = list.dataset.checklistId || 'tutorial';
            const storageKey = `${STORAGE_KEYS.checklistPrefix}${pageId}`;
            const saved = readValue(storageKey, {}, (value) => value !== null && typeof value === 'object' && !Array.isArray(value));

            Array.from(list.children).filter((item) => item.tagName === 'LI').forEach((item, index) => {
                if (item.querySelector(':scope > input[type="checkbox"]')) return;
                const checkbox = document.createElement('input');
                checkbox.type = 'checkbox';
                checkbox.className = 'checklist-checkbox';
                checkbox.dataset.checklistKey = `${checklistId}-${index}`;
                checkbox.setAttribute('aria-label', `Mark complete: ${item.textContent.trim()}`);
                checkbox.checked = saved[checkbox.dataset.checklistKey] === true;
                item.classList.add('checklist-item');
                item.classList.toggle('is-complete', checkbox.checked);
                item.prepend(checkbox);
                checkbox.addEventListener('change', () => {
                    item.classList.toggle('is-complete', checkbox.checked);
                    const latest = readValue(storageKey, {}, (value) => value !== null && typeof value === 'object' && !Array.isArray(value));
                    latest[checkbox.dataset.checklistKey] = checkbox.checked;
                    if (writeValue(storageKey, latest)) {
                        announce(checkbox.checked ? 'Checklist item marked complete.' : 'Checklist item marked incomplete.');
                    }
                });
            });
        });
    }

    function initializeNewsletter() {
        const form = document.getElementById('newsletter-form');
        if (!form) return;
        const status = document.getElementById('newsletter-status');
        form.addEventListener('submit', (event) => {
            event.preventDefault();
            const input = document.getElementById('newsletter-email');
            const email = input ? input.value.trim() : '';
            if (!email) return;
            if (writeValue('crafthub-newsletter-email', email)) {
                if (status) status.textContent = 'Saved in this browser only. This site does not send emails.';
                form.reset();
            }
        });
    }

    function initializeBackToTop() {
        const button = document.createElement('button');
        button.type = 'button';
        button.className = 'back-to-top';
        button.textContent = 'Back to top';
        button.setAttribute('aria-label', 'Back to top');
        button.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
        document.body.appendChild(button);
        window.addEventListener('scroll', () => button.classList.toggle('visible', window.scrollY > 500), { passive: true });
    }

    function initializeArticleTools() {
        if (!currentGuide) return;
        const headings = Array.from(currentGuide.querySelectorAll('h2, h3'));
        if (headings.length > 1) {
            const toc = document.createElement('aside');
            toc.className = 'table-of-contents';
            const title = document.createElement('h2');
            title.textContent = 'In this article';
            const list = document.createElement('ol');
            headings.forEach((heading, index) => {
                if (!heading.id) heading.id = `${heading.textContent.trim().toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '') || `section-${index}`}`;
                const item = document.createElement('li');
                const link = document.createElement('a');
                link.href = `#${heading.id}`;
                link.textContent = heading.textContent.trim();
                item.appendChild(link);
                list.appendChild(item);
            });
            toc.append(title, list);
            currentGuide.insertBefore(toc, currentGuide.children[1]?.nextSibling || currentGuide.firstChild);
        }

        const actions = document.createElement('div');
        actions.className = 'article-share-actions';
        const shareLabel = document.createElement('strong');
        shareLabel.textContent = 'Share';
        actions.appendChild(shareLabel);

        const shareButton = document.createElement('button');
        shareButton.type = 'button';
        shareButton.textContent = 'Share article';
        shareButton.addEventListener('click', async () => {
            const shareData = { title: document.title, text: currentGuide.querySelector('h2')?.textContent || document.title, url: window.location.href };
            try {
                if (navigator.share) {
                    await navigator.share(shareData);
                } else {
                    await navigator.clipboard.writeText(window.location.href);
                    announce('Article link copied.');
                    shareButton.textContent = 'Link copied';
                }
            } catch (_error) {
                // Native sharing can be cancelled without an application error.
            }
        });
        const printButton = document.createElement('button');
        printButton.type = 'button';
        printButton.textContent = 'Print';
        printButton.addEventListener('click', () => window.print());
        actions.append(shareButton, printButton);
        currentGuide.insertBefore(actions, currentGuide.querySelector('.post-meta')?.nextSibling || currentGuide.firstChild);

        const commentsJump = document.createElement('a');
        commentsJump.className = 'comments-jump-link';
        commentsJump.href = '#comments';
        commentsJump.textContent = 'Skip to comments';
        currentGuide.insertBefore(commentsJump, actions.nextSibling);

        const postMeta = currentGuide.querySelector('.post-meta');
        if (postMeta) {
            const editorialMeta = document.createElement('small');
            editorialMeta.className = 'editorial-meta';
            editorialMeta.textContent = 'Edited by the CraftHub editorial team';
            postMeta.insertAdjacentElement('afterend', editorialMeta);
        }

        const primaryImage = currentGuide.querySelector(':scope > img');
        if (primaryImage && primaryImage.alt) {
            const caption = document.createElement('p');
            caption.className = 'article-caption';
            caption.textContent = primaryImage.alt;
            primaryImage.insertAdjacentElement('afterend', caption);
        }

        const authorLink = currentGuide.querySelector('.post-meta a');
        if (authorLink) {
            const authorCard = document.createElement('section');
            authorCard.className = 'article-author-card';
            authorCard.innerHTML = `<h2>About the author</h2><strong>${escapeHtml(authorLink.textContent.trim())}</strong><p>CraftHub contributor sharing practical Minecraft guides, tested build ideas, and survival knowledge.</p>`;
            const profileLink = document.createElement('a');
            profileLink.href = authorLink.href;
            profileLink.textContent = 'View author profile';
            authorCard.appendChild(profileLink);
            currentGuide.appendChild(authorCard);
        }

        const pageKey = getHref();
        const commentsKey = `crafthub-comments:${pageKey}`;
        const comments = readValue(commentsKey, [], (value) => Array.isArray(value));
        const section = document.createElement('section');
        section.className = 'article-comments';
        section.id = 'comments';
        section.innerHTML = '<h2>Community discussion</h2><form><label for="comment-name">Name</label><input id="comment-name" maxlength="40" required placeholder="Your display name"><label for="comment-text">Comment</label><textarea id="comment-text" maxlength="500" required placeholder="Share a helpful tip or ask a question"></textarea><p class="comment-counter" aria-live="polite">0 / 500</p><button type="submit">Post comment</button><p class="comment-notice">Comments are stored on this device only.</p></form><div class="comment-list"></div>';
        const list = section.querySelector('.comment-list');
        const renderComments = () => {
            list.replaceChildren();
            comments.forEach((comment) => {
                const card = document.createElement('article');
                card.innerHTML = `<strong>${escapeHtml(comment.name)}</strong><time>${escapeHtml(formatCommentDate(comment.date))}</time><p>${escapeHtml(comment.text)}</p>`;
                list.appendChild(card);
            });
        };
        const commentText = section.querySelector('#comment-text');
        const commentCounter = section.querySelector('.comment-counter');
        commentText.addEventListener('input', () => {
            commentCounter.textContent = `${commentText.value.length} / 500`;
        });
        renderComments();
        section.querySelector('form').addEventListener('submit', (event) => {
            event.preventDefault();
            const name = section.querySelector('#comment-name').value.trim();
            const text = section.querySelector('#comment-text').value.trim();
            if (!name || !text) return;
            comments.unshift({ name, text, date: new Date().toLocaleString() });
            writeValue(commentsKey, comments);
            event.currentTarget.reset();
            renderComments();
        });
        currentGuide.appendChild(section);
    }

    function initializeMobileNavigation() {
        document.querySelectorAll('nav[aria-label="Main navigation"]').forEach((nav) => {
            if (nav.querySelector('.nav-toggle')) return;
            const button = document.createElement('button');
            button.type = 'button';
            button.className = 'nav-toggle';
            button.setAttribute('aria-expanded', 'false');
            button.setAttribute('aria-controls', `nav-menu-${document.querySelectorAll('.nav-toggle').length}`);
            button.textContent = 'Menu';
            const list = nav.querySelector('ul');
            if (list) {
                const id = `nav-menu-${document.querySelectorAll('.nav-toggle').length + 1}`;
                list.id = id;
                button.setAttribute('aria-controls', id);
            }
            button.addEventListener('click', () => {
                const open = nav.classList.toggle('menu-open');
                button.setAttribute('aria-expanded', String(open));
                button.textContent = open ? 'Close menu' : 'Menu';
            });
            nav.prepend(button);
        });
    }

    function initializeImageLightbox() {
        const images = Array.from(document.querySelectorAll('.post-content img, #article-content img, .current-article img'));
        if (!images.length) return;

        const modal = document.createElement('div');
        modal.className = 'image-lightbox';
        modal.setAttribute('role', 'dialog');
        modal.setAttribute('aria-modal', 'true');
        modal.setAttribute('aria-label', 'Image preview');
        modal.hidden = true;
        modal.innerHTML = '<button class="image-lightbox-close" type="button">Close</button><img alt="">';
        document.body.appendChild(modal);
        const modalImage = modal.querySelector('img');
        const closeButton = modal.querySelector('.image-lightbox-close');
        const close = () => {
            modal.hidden = true;
            document.body.classList.remove('lightbox-open');
        };

        closeButton.addEventListener('click', close);
        modal.addEventListener('click', (event) => {
            if (event.target === modal) close();
        });
        document.addEventListener('keydown', (event) => {
            if (event.key === 'Escape' && !modal.hidden) close();
        });
        images.forEach((image) => {
            image.setAttribute('tabindex', '0');
            image.setAttribute('role', 'button');
            image.setAttribute('aria-label', image.alt ? `Open image: ${image.alt}` : 'Open image preview');
            const open = () => {
                modalImage.src = image.currentSrc || image.src;
                modalImage.alt = image.alt || 'Image preview';
                modal.hidden = false;
                document.body.classList.add('lightbox-open');
                closeButton.focus();
            };
            image.addEventListener('click', open);
            image.addEventListener('keydown', (event) => {
                if (event.key === 'Enter' || event.key === ' ') {
                    event.preventDefault();
                    open();
                }
            });
        });
    }

    function initializeArticleFinalPolish() {
        if (!currentGuide) return;
        const articleKey = getHref();
        const category = (currentGuide.dataset.category || 'survival').toLowerCase();

        const viewKey = `crafthub-views:${articleKey}`;
        const views = readValue(viewKey, 0, (value) => typeof value === 'number') + 1;
        writeValue(viewKey, views);
        const viewStatus = document.createElement('small');
        viewStatus.className = 'editorial-meta';
        viewStatus.textContent = `${views.toLocaleString()} local views`;
        const editorialMeta = currentGuide.querySelector('.editorial-meta');
        if (editorialMeta) editorialMeta.insertAdjacentElement('afterend', viewStatus);

        const feedback = document.createElement('section');
        feedback.className = 'article-feedback';
        feedback.innerHTML = '<h2>Was this guide helpful?</h2><div class="article-feedback-actions"><button type="button" data-feedback="yes">Yes, helpful</button><button type="button" data-feedback="no">Not yet</button></div><p class="article-feedback-status" role="status" aria-live="polite"></p>';
        const feedbackKey = `crafthub-feedback:${articleKey}`;
        const savedFeedback = readValue(feedbackKey, '', (value) => typeof value === 'string');
        const status = feedback.querySelector('.article-feedback-status');
        if (savedFeedback) status.textContent = savedFeedback === 'yes' ? 'Thanks - marked as helpful.' : 'Thanks - this helps us improve.';
        feedback.querySelectorAll('[data-feedback]').forEach((button) => {
            button.addEventListener('click', () => {
                const value = button.dataset.feedback;
                writeValue(feedbackKey, value);
                status.textContent = value === 'yes' ? 'Thanks - marked as helpful.' : 'Thanks - this helps us improve.';
            });
        });
        currentGuide.parentElement.insertBefore(feedback, document.querySelector('.related-posts'));

        const tools = document.createElement('section');
        tools.className = 'article-tools-card';
        const toolLinks = category === 'farming'
            ? '<a href="../pages/tools.html">Open the CraftHub tools</a>'
            : category === 'building'
                ? '<a href="../pages/tools.html">Use the stack and coordinate tools</a>'
                : '<a href="../pages/tools.html">Convert Nether and Overworld coordinates</a>';
        tools.innerHTML = `<h2>Helpful Minecraft tool</h2><p>${toolLinks}</p>`;
        feedback.insertAdjacentElement('afterend', tools);

        const updateHistory = document.createElement('section');
        updateHistory.className = 'article-update-history';
        updateHistory.innerHTML = '<h2>Article history</h2><p>Updated November 1, 2026 - reviewed for clarity and current gameplay guidance.</p>';
        tools.insertAdjacentElement('afterend', updateHistory);

        const faq = document.createElement('section');
        faq.className = 'article-faq';
        faq.innerHTML = '<h2>Frequently asked questions</h2><details><summary>Is this guide suitable for beginners?</summary><p>Yes. The steps are written for early-game players and use practical, version-independent guidance.</p></details><details><summary>Does this work in Survival mode?</summary><p>The guide is designed around Survival mode, with notes for creative planning where applicable.</p></details>';
        updateHistory.insertAdjacentElement('afterend', faq);

        const faqScript = document.createElement('script');
        faqScript.type = 'application/ld+json';
        faqScript.textContent = JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'FAQPage',
            mainEntity: [
                { '@type': 'Question', name: 'Is this guide suitable for beginners?', acceptedAnswer: { '@type': 'Answer', text: 'Yes. The steps are written for early-game players and use practical, version-independent guidance.' } },
                { '@type': 'Question', name: 'Does this work in Survival mode?', acceptedAnswer: { '@type': 'Answer', text: 'The guide is designed around Survival mode, with notes for creative planning where applicable.' } }
            ]
        });
        document.head.appendChild(faqScript);
    }

    function initializeReadingHistoryPreference() {
        const footer = document.querySelector('footer');
        if (!footer) return;
        const button = document.createElement('button');
        button.type = 'button';
        button.className = 'reading-history-preference';
        const enabled = readValue('crafthub-reading-history-enabled', true, (value) => typeof value === 'boolean');
        button.textContent = enabled ? 'Reading history: On' : 'Reading history: Off';
        button.setAttribute('aria-pressed', String(enabled));
        button.addEventListener('click', () => {
            const next = !readValue('crafthub-reading-history-enabled', true, (value) => typeof value === 'boolean');
            writeValue('crafthub-reading-history-enabled', next);
            button.textContent = next ? 'Reading history: On' : 'Reading history: Off';
            button.setAttribute('aria-pressed', String(next));
            if (!next) {
                writeValue(STORAGE_KEYS.recent, []);
                const recentList = document.getElementById('recent-list');
                const recentEmpty = document.getElementById('recent-empty');
                if (recentList) recentList.replaceChildren();
                if (recentEmpty) recentEmpty.hidden = false;
            }
        });
        footer.appendChild(button);
    }

    if (currentGuide) recordCurrentGuide();
    initializeNewsletter();
    initializeBackToTop();
    initializeArticleTools();
    initializeFilters();
    initializeSaving();
    initializeRelatedGuides();
    initializeGuideLabels();
    initializeReadingProgress();
    initializeChecklists();
    renderSavedAndRecent();
    initializeMobileNavigation();
    initializeImageLightbox();
    initializeArticleFinalPolish();
    initializeReadingHistoryPreference();
})();
