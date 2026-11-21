(function () {
    const STORAGE_KEY = 'minecraft-blog-articles';
    const DRAFT_KEY = 'craft-hub-author-draft';
    const AUTHOR_STUDIO_NAME = 'Anthony Combalicer';
    const AUTHOR_STUDIO_PAGE = /author-studio\.html$/i.test(window.location.pathname || '');
    const DEFAULT_ARTICLES = [
        { id: 'article-first-night', title: '5 Essential Tips to Survive Your First Night in Minecraft', category: 'Survival', difficulty: 'Beginner', author: 'Anthony Combalicer', readingMinutes: 1, excerpt: 'Starting a new world is exciting, but the first night can be brutal. Get ready with wood, tools, food, shelter, and light.', content: 'Starting a new world is exciting, but the first night can be brutal. Gather wood, craft tools, find food, build a shelter, and light up the area to stay safe.', tags: ['survival', 'beginner', 'starter'], image: 'assets/images/survivenight_skeleton.avif', accentColor: '#c63b2d' },
        { id: 'article-survival-base', title: 'The Ultimate Minecraft Survival Guide: From Dirt Shack to Mega Base', category: 'Building', difficulty: 'Intermediate', author: 'Joezyl Guillermo', readingMinutes: 1, excerpt: 'Plan your base around safety, storage, and future growth.', content: 'Plan your base around safety, storage, and future growth while keeping your early setup efficient.', tags: ['survival', 'building', 'base'], image: 'assets/images/optimized/noobtomega.jpg', accentColor: '#c63b2d' },
        { id: 'article-auto-farms', title: 'Essential Minecraft Auto Farms: 3 Beginner Projects', category: 'Farming', difficulty: 'Beginner', author: 'Anthony Combalicer', readingMinutes: 3, excerpt: 'Set up useful auto farms for crops and resources.', content: 'Use simple redstone mechanics to make a few beginner-friendly farms.', tags: ['farming', 'redstone'], image: 'assets/images/farm.png', accentColor: '#c63b2d' },
        { id: 'article-iron-tools', title: "A Beginner's Guide to Finding and Using Iron", category: 'Survival', difficulty: 'Beginner', author: 'Anthony Combalicer', readingMinutes: 3, excerpt: 'Iron is one of the biggest upgrades in the early game.', content: 'Search caves and ravines for iron, then craft better gear and tools.', tags: ['survival', 'mining', 'iron'], image: 'assets/images/stonetools.png', accentColor: '#c63b2d' },
        { id: 'article-caving-safely', title: 'How to Explore Caves More Safely', category: 'Survival', difficulty: 'Intermediate', author: 'Anthony Combalicer', readingMinutes: 4, excerpt: 'Caves can be profitable, but not if you rush in blindly.', content: 'Bring food, light, and a safe retreat plan before exploring deep cave systems.', tags: ['caving', 'survival'], image: 'assets/images/stone.png', accentColor: '#c63b2d' },
        { id: 'article-food-storage', title: 'Reliable Food for a Long Minecraft Journey', category: 'Farming', difficulty: 'Beginner', author: 'Anthony Combalicer', readingMinutes: 2, excerpt: 'A steady food supply keeps your world sustainable.', content: 'Grow crops, breed animals, and keep a backup stock ready for long survival sessions.', tags: ['food', 'farming'], image: 'assets/images/food.png', accentColor: '#c63b2d' },
        { id: 'article-enchanting-setup', title: 'Build a Practical Enchanting Corner', category: 'Building', difficulty: 'Intermediate', author: 'Anthony Combalicer', readingMinutes: 3, excerpt: 'Create a simple enchanting area that does not take over your base.', content: 'Set up bookshelves, tables, and storage to keep your enchanting station efficient.', tags: ['building', 'enchanting'], image: 'assets/images/house.png', accentColor: '#c63b2d' },
        { id: 'article-nether-preparation', title: 'Prepare for Your First Nether Trip', category: 'Survival', difficulty: 'Intermediate', author: 'Anthony Combalicer', readingMinutes: 4, excerpt: 'A few smart preparations can make your first Nether trip much safer.', content: 'Gather gear, food, portal materials, and emergency supplies before entering the Nether.', tags: ['portal', 'nether'], image: 'assets/images/light.png', accentColor: '#c63b2d' },
        { id: 'article-village-trading', title: 'Set Up a Safe Village Trading Route', category: 'Survival', difficulty: 'Beginner', author: 'Anthony Combalicer', readingMinutes: 3, excerpt: 'Use villagers to build a sustainable trading route.', content: 'Protect villagers, set up your trading hall, and manage your goods and emeralds efficiently.', tags: ['village', 'trading'], image: 'assets/images/farm2.png', accentColor: '#c63b2d' },
        { id: 'article-lighting-builds', title: 'Light a Build Without Losing Its Atmosphere', category: 'Building', difficulty: 'Intermediate', author: 'Anthony Combalicer', readingMinutes: 3, excerpt: 'Good lighting keeps mobs away without ruining the mood of your build.', content: 'Use a mix of glowstone, torches, and strategic placement to light large builds.', tags: ['building', 'lighting'], image: 'assets/images/light.png', accentColor: '#c63b2d' },
        { id: 'article-compost-farm', title: 'Turn Spare Crops into Useful Bone Meal', category: 'Farming', difficulty: 'Beginner', author: 'Anthony Combalicer', readingMinutes: 3, excerpt: 'Composting helps turn crop waste into something useful.', content: 'Set up a compost bin and gather materials to support crop growth.', tags: ['farming', 'compost'], image: 'assets/images/farm.png', accentColor: '#c63b2d' },
        { id: 'article-organized-storage', title: 'Organize Storage That Can Grow with Your Base', category: 'Building', difficulty: 'Beginner', author: 'Anthony Combalicer', readingMinutes: 3, excerpt: 'Good storage keeps your base efficient and clean.', content: 'Create dedicated storage rooms and chest systems for resources and tools.', tags: ['building', 'storage'], image: 'assets/images/house.png', accentColor: '#c63b2d' },
        { id: 'article-early-game-transport', title: 'Build Paths and Bridges for Easier Travel', category: 'Building', difficulty: 'Beginner', author: 'Anthony Combalicer', readingMinutes: 2, excerpt: 'Before large projects, make travel easier and safer.', content: 'Build simple bridges, paths, and road systems to improve movement around your world.', tags: ['building', 'travel'], image: 'assets/images/biome.png', accentColor: '#c63b2d' }
    ];

    const titleInput = document.getElementById('title');
    const categoryInput = document.getElementById('category');
    const difficultyInput = document.getElementById('difficulty');
    const authorInput = document.getElementById('author');
    const readingMinutesInput = document.getElementById('readingMinutes');
    const subtitleInput = document.getElementById('subtitle');
    const accentColorInput = document.getElementById('accentColor');
    const excerptInput = document.getElementById('excerpt');
    const contentInput = document.getElementById('content');
    const tagsInput = document.getElementById('tags');
    const imageInput = document.getElementById('image');
    const authorAvatarInput = document.getElementById('authorAvatar');
    const featuredInput = document.getElementById('featured');
    const statusInput = document.getElementById('status');
    const idInput = document.getElementById('article-id');
    const form = document.getElementById('article-form');
    const list = document.getElementById('article-list');
    const emptyState = document.getElementById('empty-state');
    const submitButton = document.getElementById('submit-button');
    const cancelButton = document.getElementById('cancel-edit');
    const newArticleButton = document.getElementById('new-article-btn');
    const previewSiteButton = document.getElementById('preview-site-btn');
    const previewCategory = document.getElementById('preview-category');
    const previewTitle = document.getElementById('preview-title');
    const previewExcerpt = document.getElementById('preview-excerpt');
    const previewMeta = document.getElementById('preview-meta');
    const publishChecklist = document.getElementById('publish-checklist');
    const recentActivity = document.getElementById('recent-activity');
    const articleSearch = document.getElementById('article-search');
    const articleStatusFilter = document.getElementById('article-status-filter');
    const saveDraftButton = document.getElementById('save-draft-btn');
    const clearDraftButton = document.getElementById('clear-draft-btn');
    const articleImageUpload = document.getElementById('article-image-upload');
    const imageUploadTrigger = document.querySelector('[data-image-upload-trigger]');
    const articleSort = document.getElementById('article-sort');
    const selectAllButton = document.getElementById('select-all-button');
    const bulkDeleteButton = document.getElementById('bulk-delete-button');
    const selectedArticleIds = new Set();

    if (!form || !list) return;

    function normalizeAuthorName(value) {
        return String(value || '').trim().toLowerCase();
    }

    function getStoredArticles() {
        try {
            const raw = localStorage.getItem(STORAGE_KEY);
            const parsed = raw ? JSON.parse(raw) : [];
            return Array.isArray(parsed) ? parsed : [];
        } catch (_error) {
            return [];
        }
    }

    function setStoredArticles(articles) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(articles));
    }

    function getAuthorStudioArticles() {
        return getStoredArticles()
            .filter((article) => article && !article.hidden && normalizeAuthorName(article.author) === normalizeAuthorName(AUTHOR_STUDIO_NAME))
            .map((article) => ({ ...article, source: article.source || 'custom' }))
            .sort((first, second) => new Date(second.updatedAt || second.createdAt || 0).getTime() - new Date(first.updatedAt || first.createdAt || 0).getTime());
    }

    function getVisibleArticles() {
        return AUTHOR_STUDIO_PAGE ? getAuthorStudioArticles() : getArticles();
    }

    function getFilteredArticles() {
        const sourceArticles = getVisibleArticles();
        const searchTerm = (articleSearch?.value || '').trim().toLowerCase();
        const statusFilter = articleStatusFilter?.value || 'all';
        const sortValue = articleSort?.value || 'newest';

        const filtered = sourceArticles.filter((article) => {
            const matchesSearch = !searchTerm || [
                article.title,
                article.category,
                article.author,
                article.excerpt,
                article.content,
                article.status || 'Draft'
            ].join(' ').toLowerCase().includes(searchTerm);

            const matchesStatus = statusFilter === 'all' || (article.status || 'Draft') === statusFilter;
            return matchesSearch && matchesStatus;
        });

        filtered.sort((first, second) => {
            if (sortValue === 'oldest') {
                return new Date(first.createdAt || 0).getTime() - new Date(second.createdAt || 0).getTime();
            }

            if (sortValue === 'title') {
                return (first.title || '').localeCompare(second.title || '');
            }

            if (sortValue === 'featured') {
                const featuredDiff = Number(Boolean(second.featured)) - Number(Boolean(first.featured));
                if (featuredDiff !== 0) return featuredDiff;
                return new Date(second.updatedAt || second.createdAt || 0).getTime() - new Date(first.updatedAt || first.createdAt || 0).getTime();
            }

            return new Date(second.updatedAt || second.createdAt || 0).getTime() - new Date(first.updatedAt || first.createdAt || 0).getTime();
        });

        return filtered;
    }

    function getBuiltInArticles() {
        return DEFAULT_ARTICLES.map((article) => ({ ...article, source: 'default' }));
    }

    function getArticles() {
        const stored = getStoredArticles();
        const overrideMap = new Map(
            stored
                .filter((article) => article && !article.hidden && article.id)
                .map((article) => [String(article.id), article])
        );
        const merged = [];

        getBuiltInArticles().forEach((article) => {
            if (stored.some((item) => String(item.id) === String(article.id) && item.hidden)) return;
            const override = overrideMap.get(String(article.id));
            merged.push({ ...article, ...(override || {}), source: override ? 'override' : 'default' });
        });

        stored
            .filter((article) => article && article.id && !article.hidden)
            .forEach((article) => {
                if (merged.some((item) => String(item.id) === String(article.id))) return;
                merged.push({ ...article, source: 'custom' });
            });

        return merged;
    }

    function escapeHtml(value) {
        return String(value || '')
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/\"/g, '&quot;')
            .replace(/'/g, '&#039;');
    }

    function buildSlug(title) {
        return String(title || '')
            .trim()
            .toLowerCase()
            .replace(/[^a-z0-9\s-]/g, '')
            .replace(/\s+/g, '-')
            .replace(/-+/g, '-')
            .slice(0, 60) || `custom-article-${Date.now()}`;
    }

    function formatTags(value) {
        return String(value || '')
            .split(',')
            .map((tag) => tag.trim())
            .filter(Boolean)
            .map((tag) => tag.toLowerCase());
    }

    function renderStats() {
        const articles = getVisibleArticles();
        const filteredArticles = getFilteredArticles();
        const total = articles.length;
        const customCount = articles.filter((article) => String(article.source || '') === 'custom' || String(article.source || '') === 'override').length;
        const featuredCount = articles.filter((article) => article.featured).length;
        const publishedCount = articles.filter((article) => (article.status || 'Draft') === 'Published').length;
        const draftCount = articles.filter((article) => (article.status || 'Draft') === 'Draft').length;
        const weekAgo = Date.now() - (7 * 24 * 60 * 60 * 1000);
        const editedThisWeek = articles.filter((article) => {
            const timestamp = Date.parse(article.updatedAt || article.createdAt || '');
            return Number.isFinite(timestamp) && timestamp >= weekAgo;
        }).length;

        const totalMetric = document.getElementById('metric-total');
        const customMetric = document.getElementById('metric-custom');
        const featuredMetric = document.getElementById('metric-featured');
        const draftMetric = document.getElementById('metric-drafts');
        const weekMetric = document.getElementById('metric-week');

        if (totalMetric) totalMetric.textContent = String(total);
        if (customMetric) customMetric.textContent = String(publishedCount || (AUTHOR_STUDIO_PAGE ? customCount : 0));
        if (featuredMetric) featuredMetric.textContent = String(featuredCount);
        if (draftMetric) draftMetric.textContent = String(draftCount);
        if (weekMetric) weekMetric.textContent = String(editedThisWeek);
        if (bulkDeleteButton) {
            const selectionVisible = filteredArticles.some((article) => selectedArticleIds.has(String(article.id)));
            bulkDeleteButton.hidden = !selectionVisible;
        }
        updatePublishChecklist();
    }

    function updatePublishChecklist() {
        if (!publishChecklist) return;

        const rows = Array.from(publishChecklist.querySelectorAll('li'));
        if (!rows.length) return;

        const checks = {
            title: Boolean(titleInput.value.trim()),
            excerpt: Boolean(excerptInput.value.trim()),
            image: Boolean(imageInput.value.trim()),
            content: Boolean(contentInput.value.trim())
        };

        rows.forEach((row, index) => {
            const label = row.textContent.trim();
            const isDone = {
                0: checks.title,
                1: checks.excerpt,
                2: checks.image,
                3: checks.content
            }[index] ?? false;

            row.classList.toggle('done', isDone);
            row.setAttribute('aria-label', `${label} ${isDone ? 'completed' : 'not completed'}`);
        });
    }

    function readRecentActivity() {
        const activityKey = 'craft-hub-recent-activity';
        try {
            const raw = localStorage.getItem(activityKey);
            const parsed = raw ? JSON.parse(raw) : [];
            return Array.isArray(parsed) ? parsed : [];
        } catch (_error) {
            return [];
        }
    }

    function writeRecentActivity(items) {
        try {
            localStorage.setItem('craft-hub-recent-activity', JSON.stringify(items.slice(0, 5)));
        } catch (_error) {
            // Ignore storage failures from restricted browser environments.
        }
    }

    function recordRecentActivity(action, title) {
        const entries = readRecentActivity();
        const nextEntry = {
            action,
            title: title || 'Untitled article',
            time: new Date().toISOString()
        };

        const updatedEntries = [nextEntry, ...entries.filter((entry) => !(entry && entry.title === nextEntry.title && entry.action === nextEntry.action))].slice(0, 5);
        writeRecentActivity(updatedEntries);
        renderRecentActivity();
    }

    function renderRecentActivity() {
        const entries = readRecentActivity();
        const activityLists = document.querySelectorAll('.recent-activity');
        if (!entries.length) {
            activityLists.forEach((list) => {
                list.innerHTML = '<li>No recent changes yet.</li>';
            });
            return;
        }

        const activityMarkup = entries.map((entry) => {
            const time = entry?.time ? new Date(entry.time).toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' }) : 'just now';
            return `<li><strong>${escapeHtml(entry.action || 'Updated')}</strong> <span>${escapeHtml(entry.title || 'Untitled article')}</span><small>${escapeHtml(time)}</small></li>`;
        }).join('');
        document.querySelectorAll('.recent-activity').forEach((list) => {
            list.innerHTML = activityMarkup;
        });
    }

    function updateSelectionControls() {
        if (bulkDeleteButton) {
            bulkDeleteButton.hidden = selectedArticleIds.size === 0;
        }

        const visibleIds = new Set(getFilteredArticles().map((article) => String(article.id)));
        if (selectAllButton) {
            const allVisibleSelected = visibleIds.size > 0 && [...visibleIds].every((id) => selectedArticleIds.has(id));
            selectAllButton.textContent = allVisibleSelected ? 'Clear selection' : 'Select all';
        }
    }

    function handleSelectionChange(event) {
        const checkbox = event.target.closest('[data-select-id]');
        if (!checkbox) return;

        const articleId = String(checkbox.dataset.selectId);
        if (checkbox.checked) {
            selectedArticleIds.add(articleId);
        } else {
            selectedArticleIds.delete(articleId);
        }

        updateSelectionControls();
    }

    function bulkDeleteSelected() {
        if (!selectedArticleIds.size) return;

        const idsToDelete = Array.from(selectedArticleIds);
        idsToDelete.forEach((articleId) => {
            deleteArticle(articleId);
            selectedArticleIds.delete(articleId);
        });

        updateSelectionControls();
    }

    function selectAllVisible() {
        const visibleIds = getFilteredArticles().map((article) => String(article.id));
        const allSelected = visibleIds.length > 0 && visibleIds.every((id) => selectedArticleIds.has(id));

        if (allSelected) {
            visibleIds.forEach((id) => selectedArticleIds.delete(id));
        } else {
            visibleIds.forEach((id) => selectedArticleIds.add(id));
        }

        renderArticles();
        updateSelectionControls();
    }

    function renderArticles() {
        const articles = getFilteredArticles();
        list.innerHTML = '';

        if (!articles.length) {
            emptyState.hidden = false;
            renderStats();
            return;
        }

        emptyState.hidden = true;
        articles.forEach((article) => {
            const item = document.createElement('li');
            const articleStatus = article.status || 'Draft';
            const articleId = String(article.id);
            const isSelected = selectedArticleIds.has(articleId);
            const coverImage = article.image
                ? `<img class="admin-list-thumb" src="${escapeHtml(article.image)}" alt="">`
                : '<div class="admin-list-thumb placeholder-thumb">No image</div>';
            const modified = article.updatedAt
                ? new Date(article.updatedAt).toLocaleDateString([], { month: 'short', day: 'numeric', year: 'numeric' })
                : 'Not edited yet';
            item.innerHTML = `
                <div class="admin-list-header">
                    <label class="list-select">
                        <input type="checkbox" data-select-id="${escapeHtml(articleId)}" ${isSelected ? 'checked' : ''}>
                    </label>
                    <h3>${escapeHtml(article.title || 'Untitled article')}</h3>
                </div>
                <div class="admin-list-content">${coverImage}</div>
                <p class="admin-article-meta">${escapeHtml(article.category || 'Uncategorized')} • ${escapeHtml(article.difficulty || 'Beginner')} • ${escapeHtml(article.author || 'Unknown')} • ${escapeHtml(article.readingMinutes || 3)} min</p>
                <p class="admin-status-badge ${articleStatus === 'Published' ? 'status-published' : 'status-draft'}">${escapeHtml(articleStatus)}</p>
                <p>${escapeHtml(article.excerpt || article.content || 'No excerpt provided.')}</p>
                <small class="admin-list-modified">Updated ${escapeHtml(modified)}</small>
                <div class="admin-article-actions">
                    <button type="button" data-action="edit" data-id="${escapeHtml(articleId)}">Edit</button>
                    <button type="button" data-action="preview" data-id="${escapeHtml(articleId)}" class="secondary">Preview</button>
                    <button type="button" data-action="duplicate" data-id="${escapeHtml(articleId)}" class="secondary">Duplicate</button>
                    <button type="button" data-action="delete" data-id="${escapeHtml(articleId)}" class="secondary">Delete</button>
                </div>
            `;
            list.appendChild(item);
        });

        renderStats();
    }

    function convertMarkdownToHtml(markdown) {
        if (!markdown || !markdown.trim()) {
            return '<p>Start writing your article to see the live preview.</p>';
        }

        const blocks = markdown
            .replace(/\r\n/g, '\n')
            .split(/\n{2,}/)
            .map((block) => block.trim())
            .filter(Boolean);

        const rendered = blocks.map((block) => {
            if (/^!\[[^\]]*\]\((.*?)\)$/.test(block)) {
                const match = block.match(/^!\[[^\]]*\]\((.*?)\)$/);
                const imageUrl = match ? match[1] : '';
                return `<img src="${escapeHtml(imageUrl)}" alt="Article preview image">`;
            }

            if (/^#{1,3}\s+/.test(block)) {
                const match = block.match(/^(#{1,3})\s+(.*)$/);
                if (!match) return `<p>${escapeHtml(block)}</p>`;
                const level = match[1].length;
                const text = match[2];
                const tagName = level === 1 ? 'h2' : level === 2 ? 'h3' : 'h4';
                return `<${tagName}>${escapeHtml(text)}</${tagName}>`;
            }

            if (/^(?:[-*]\s+\[[ xX]\]\s+.+|[-*]\s+.+)$/m.test(block)) {
                const items = block
                    .split(/\n/)
                    .filter((line) => /^[-*]\s+/.test(line.trim()))
                    .map((line) => {
                        const checked = /^[-*]\s+\[[xX]\]\s+/i.test(line.trim());
                        const content = line.replace(/^[-*]\s+\[[ xX]\]\s+/i, '').replace(/^[-*]\s+/, '').trim();
                        if (content) {
                            return `<li class="checklist-item${checked ? ' is-complete' : ''}"><input type="checkbox" ${checked ? 'checked' : ''} disabled><span>${escapeHtml(content)}</span></li>`;
                        }
                        return '';
                    })
                    .filter(Boolean)
                    .join('');

                if (!items) return `<ul><li>${escapeHtml(block)}</li></ul>`;
                return `<ul class="interactive-checklist">${items}</ul>`;
            }

            if (/^\d+\.\s+/.test(block)) {
                const items = block
                    .split(/\n/)
                    .filter((line) => /^\d+\.\s+/.test(line.trim()))
                    .map((line) => {
                        const content = line.replace(/^\d+\.\s+/, '').trim();
                        return `<li>${escapeHtml(content)}</li>`;
                    })
                    .join('');
                return `<ol>${items}</ol>`;
            }

            return `<p>${block
                .split(/\n/)
                .map((line) => escapeHtml(line))
                .join('<br>')}</p>`;
        });

        return rendered.join('');
    }

    function markdownFromArticleElement(articleElement) {
        const parts = [];
        const children = Array.from(articleElement.children);

        children.forEach((element, index) => {
            if (element.matches('.post-category, .post-labels, .post-meta, .article-save-button')) return;

            if (element.matches('img')) {
                if (index === children.findIndex((child) => child.matches('img'))) return;
                const imagePath = element.getAttribute('src') || '';
                const normalizedPath = imagePath.replace(/^(\.\.\/)+/, '').replace(/^\.\//, '');
                parts.push(`![${element.getAttribute('alt') || 'Article image'}](${normalizedPath})`);
                return;
            }

            if (element.matches('h3, h4')) {
                const level = element.tagName === 'H3' ? '##' : '###';
                parts.push(`${level} ${element.textContent.trim()}`);
                return;
            }

            if (element.matches('p')) {
                const text = element.textContent.trim();
                if (text) parts.push(text);
                return;
            }

            if (!element.matches('ul, ol')) return;

            const isInteractive = element.classList.contains('interactive-checklist');
            const previousHeading = element.previousElementSibling;
            const headingLabel = previousHeading && previousHeading.matches('h4')
                ? previousHeading.textContent.trim().toLowerCase()
                : '';
            const isMaterialsOrSteps = headingLabel === 'materials' || headingLabel === 'basic steps';
            const items = Array.from(element.children).filter((child) => child.matches('li'));

            if (element.classList.contains('illustrated-steps')) {
                items.forEach((item) => {
                    const heading = item.querySelector('h3');
                    if (heading) parts.push(`- [ ] ${heading.textContent.trim()}`);
                    item.querySelectorAll('p, img').forEach((detail) => {
                        if (detail.matches('p')) {
                            const text = detail.textContent.trim();
                            if (text) parts.push(text);
                        } else {
                            const imagePath = (detail.getAttribute('src') || '').replace(/^(\.\.\/)+/, '').replace(/^\.\//, '');
                            parts.push(`![${detail.getAttribute('alt') || 'Article image'}](${imagePath})`);
                        }
                    });
                });
                return;
            }

            const listItems = items.map((item, itemIndex) => {
                const text = item.textContent.trim();
                if (isInteractive || isMaterialsOrSteps) return `- [ ] ${text}`;
                return element.tagName === 'OL' ? `${itemIndex + 1}. ${text}` : `- ${text}`;
            });
            if (listItems.length) parts.push(listItems.join('\n'));
        });

        return parts.join('\n\n');
    }

    async function loadOriginalArticleContent(articleId) {
        const response = await fetch(`articles/${encodeURIComponent(articleId)}.html`);
        if (!response.ok) {
            throw new Error(`Could not load original article (${response.status}).`);
        }

        const sourceDocument = new DOMParser().parseFromString(await response.text(), 'text/html');
        const sourceArticle = sourceDocument.querySelector('.post-content');
        if (!sourceArticle) {
            throw new Error('The original article content could not be found.');
        }

        return markdownFromArticleElement(sourceArticle);
    }

    function updatePreview() {
        if (!previewCategory || !previewTitle || !previewExcerpt || !previewMeta) return;

        const title = titleInput.value.trim() || 'Your article title';
        const category = categoryInput.value || 'Survival';
        const difficulty = difficultyInput.value || 'Beginner';
        const minutes = Number(readingMinutesInput.value) || 3;
        const excerpt = excerptInput.value.trim() || 'Short summary appears here.';
        const subtitle = subtitleInput.value.trim();
        const author = authorInput.value.trim() || 'Unknown author';

        previewCategory.textContent = category;
        previewTitle.textContent = title;
        previewExcerpt.textContent = excerpt;
        previewMeta.textContent = `${difficulty} • ${minutes} min`;

        const livePreview = document.getElementById('live-article-preview');
        if (!livePreview) return;
        const coverImage = imageInput.value.trim()
            ? `<img class="live-article-cover" src="${escapeHtml(imageInput.value.trim())}" alt="${escapeHtml(title)}">`
            : '';
        const avatarImage = authorAvatarInput.value.trim()
            ? `<img class="live-author-avatar" src="${escapeHtml(authorAvatarInput.value.trim())}" alt="${escapeHtml(author)}">`
            : '';

        livePreview.innerHTML = `
            <article class="live-article article-content">
                <header class="live-article-header">
                    <span class="preview-tag">${escapeHtml(category)}</span>
                    <h2>${escapeHtml(title)}</h2>
                    ${subtitle ? `<p class="live-article-subtitle">${escapeHtml(subtitle)}</p>` : ''}
                    <div class="live-author-row">
                        ${avatarImage}
                        <span><strong>${escapeHtml(author)}</strong><br>${escapeHtml(`${difficulty} • ${minutes} min`)}</span>
                    </div>
                </header>
                ${coverImage}
                <p class="live-article-excerpt">${escapeHtml(excerpt)}</p>
                ${convertMarkdownToHtml(contentInput.value)}
            </article>
        `;

        const words = contentInput.value.trim()
            ? contentInput.value.trim().split(/\s+/).filter(Boolean).length
            : 0;
        const wordCount = document.getElementById('word-count');
        const healthReadingTime = document.getElementById('health-reading-time');
        if (wordCount) wordCount.textContent = `${words} ${words === 1 ? 'word' : 'words'}`;
        if (healthReadingTime) healthReadingTime.textContent = `${minutes} min`;
    }

    function saveDraftState() {
        const draft = {
            title: titleInput.value,
            category: categoryInput.value,
            difficulty: difficultyInput.value,
            author: authorInput.value,
            readingMinutes: readingMinutesInput.value,
            subtitle: subtitleInput.value,
            accentColor: accentColorInput.value,
            excerpt: excerptInput.value,
            content: contentInput.value,
            tags: tagsInput.value,
            image: imageInput.value,
            authorAvatar: authorAvatarInput.value,
            featured: featuredInput.checked,
            status: statusInput ? statusInput.value : 'Draft'
        };

        try {
            localStorage.setItem(DRAFT_KEY, JSON.stringify(draft));
            const now = new Date();
            const savedTime = now.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' });
            const autosaveStatus = document.getElementById('autosave-status');
            const saveBarStatus = document.getElementById('save-bar-status');
            const lastSaved = document.getElementById('last-saved');
            if (autosaveStatus) {
                autosaveStatus.className = 'autosave-status is-saved';
                autosaveStatus.textContent = `Saved at ${savedTime}`;
            }
            if (saveBarStatus) saveBarStatus.textContent = `Saved at ${savedTime}`;
            if (lastSaved) lastSaved.textContent = savedTime;
        } catch (_error) {
            // Ignore storage failures in restricted browser environments.
        }
    }

    function loadDraftState() {
        try {
            const raw = localStorage.getItem(DRAFT_KEY);
            if (!raw) return false;
            const draft = JSON.parse(raw);
            if (!draft || typeof draft !== 'object') return false;

            titleInput.value = draft.title || '';
            categoryInput.value = draft.category || 'Survival';
            difficultyInput.value = draft.difficulty || 'Beginner';
            authorInput.value = draft.author || AUTHOR_STUDIO_NAME;
            readingMinutesInput.value = draft.readingMinutes || '3';
            subtitleInput.value = draft.subtitle || '';
            accentColorInput.value = draft.accentColor || '#c63b2d';
            excerptInput.value = draft.excerpt || '';
            contentInput.value = draft.content || '';
            tagsInput.value = draft.tags || '';
            imageInput.value = draft.image || '';
            authorAvatarInput.value = draft.authorAvatar || '';
            featuredInput.checked = !!draft.featured;
            if (statusInput) statusInput.value = draft.status || 'Draft';
            updatePreview();
            updatePublishChecklist();
            return true;
        } catch (_error) {
            return false;
        }
    }

    function clearDraftState() {
        try {
            localStorage.removeItem(DRAFT_KEY);
        } catch (_error) {
            // Ignore storage failures in restricted browser environments.
        }
    }

    function resetForm() {
        form.reset();
        idInput.value = '';
        submitButton.textContent = 'Add article';
        cancelButton.hidden = true;
        categoryInput.value = 'Survival';
        difficultyInput.value = 'Beginner';
        authorInput.value = AUTHOR_STUDIO_PAGE ? AUTHOR_STUDIO_NAME : (authorInput.value || 'Anthony Combalicer');
        if (AUTHOR_STUDIO_PAGE) authorInput.setAttribute('readonly', 'readonly');
        else authorInput.removeAttribute('readonly');
        readingMinutesInput.value = '3';
        accentColorInput.value = '#c63b2d';
        featuredInput.checked = false;
        if (statusInput) statusInput.value = 'Draft';
        clearDraftState();
        updatePreview();
        updatePublishChecklist();
    }

    function fillForm(article) {
        if (AUTHOR_STUDIO_PAGE && normalizeAuthorName(article.author) !== normalizeAuthorName(AUTHOR_STUDIO_NAME)) return;
        idInput.value = article.id || '';
        titleInput.value = article.title || '';
        categoryInput.value = article.category || 'Survival';
        difficultyInput.value = article.difficulty || 'Beginner';
        authorInput.value = AUTHOR_STUDIO_PAGE ? AUTHOR_STUDIO_NAME : (article.author || 'Anthony Combalicer');
        if (AUTHOR_STUDIO_PAGE) authorInput.setAttribute('readonly', 'readonly');
        else authorInput.removeAttribute('readonly');
        readingMinutesInput.value = article.readingMinutes || 3;
        subtitleInput.value = article.subtitle || '';
        accentColorInput.value = article.accentColor || '#c63b2d';
        excerptInput.value = article.excerpt || '';
        contentInput.value = article.content || '';
        tagsInput.value = (article.tags || []).join(', ');
        imageInput.value = article.image || '';
        authorAvatarInput.value = article.authorAvatar || '';
        featuredInput.checked = !!article.featured;
        if (statusInput) statusInput.value = article.status || 'Draft';
        submitButton.textContent = 'Update article';
        cancelButton.hidden = false;
        updatePreview();
    }

    const articleTemplates = {
        guide: {
            title: 'How to Prepare for a Survival Session',
            category: 'Survival',
            difficulty: 'Beginner',
            minutes: 4,
            excerpt: 'A simple checklist for a safer and better Minecraft survival run.',
            tags: 'survival, starter, basics',
            content: '# How to Prepare for a Survival Session\n\nStarting a new world is exciting, but your first few hours matter. A little planning can help you avoid danger and save time.\n\n## Gather your essentials\n\n- [ ] Gather wood for tools and shelter\n- [ ] Find food before night starts\n- [ ] Build a safe place to sleep\n- [ ] Light the area around your base\n\n![Minecraft survival setup](assets/images/survivenight_skeleton.avif)\n\n## Keep your early game simple\n\nFocus on tools, food, and shelter before you start bigger projects. The fastest route to success is usually the safest route.\n\n### Pro tips\n\n- Keep your first base close to resources\n- Save extra food for emergencies\n- Always carry a light source when exploring\n'
        },
        farm: {
            title: 'Beginner Farming Setup That Actually Helps',
            category: 'Farming',
            difficulty: 'Beginner',
            minutes: 5,
            excerpt: 'A practical farming layout to help you collect food and crops without wasting time.',
            tags: 'farming, food, beginner',
            content: '# Beginner Farming Setup That Actually Helps\n\nA small farm can make survival much smoother. You do not need a huge build to get useful food and materials.\n\n## What to build first\n\n- [ ] Clear a small flat area\n- [ ] Place crop rows for wheat and carrots\n- [ ] Add a chest to store harvests\n- [ ] Keep extra water nearby\n\n![Simple Minecraft farm](assets/images/farm.png)\n\n## Best beginner strategy\n\nChoose crops that grow quickly and are easy to repeat. A small, reliable farm is better than a large, messy one.\n\n### Quick reminder\n\n- Make your farm close to home\n- Keep it protected from mobs\n- Harvest often to stay efficient\n'
        },
        build: {
            title: 'Small Build That Makes Your Base Better',
            category: 'Building',
            difficulty: 'Intermediate',
            minutes: 4,
            excerpt: 'Create a simple structure that improves your base without taking over the whole world.',
            tags: 'building, base, design',
            content: '# Small Build That Makes Your Base Better\n\nA nice base does not need to be huge. A small, organized build can improve storage, comfort, and survival.\n\n## Start with the essentials\n\n- [ ] Add a crafting area\n- [ ] Keep a chest room nearby\n- [ ] Leave room for future upgrades\n- [ ] Use lighting to keep it safe\n\n![Minecraft base build](assets/images/house.png)\n\n## Why this works\n\nSimple layouts are easier to maintain and easier to expand. That makes them better for long-term survival.\n\n### Final tip\n\nPlan your base around comfort and utility, not just looks.\n'
        }
    };

    function insertTextAtCursor(text) {
        if (!contentInput) return;

        const start = contentInput.selectionStart;
        const end = contentInput.selectionEnd;
        const currentValue = contentInput.value;
        contentInput.value = `${currentValue.slice(0, start)}${text}${currentValue.slice(end)}`;
        contentInput.selectionStart = start + text.length;
        contentInput.selectionEnd = start + text.length;
        contentInput.dispatchEvent(new Event('input', { bubbles: true }));
        contentInput.focus();
    }

    function applyTemplate(templateName) {
        const template = articleTemplates[templateName];
        if (!template) return;

        if (!titleInput.value.trim()) titleInput.value = template.title;
        categoryInput.value = template.category || categoryInput.value;
        difficultyInput.value = template.difficulty || difficultyInput.value;
        if (!readingMinutesInput.value || Number(readingMinutesInput.value) < 1) readingMinutesInput.value = String(template.minutes || 3);
        if (!excerptInput.value.trim()) excerptInput.value = template.excerpt;
        if (!tagsInput.value.trim()) tagsInput.value = template.tags;

        if (!contentInput.value.trim()) {
            contentInput.value = template.content;
        } else {
            insertTextAtCursor(`\n\n${template.content}\n\n`);
        }

        updatePreview();
        updatePublishChecklist();
    }

    function insertQuickBlock(type) {
        const snippets = {
            heading: '\n\n## New Section\n\n',
            checklist: '\n\n- [ ] Gather your materials\n- [ ] Build the main structure\n- [ ] Test the result\n- [ ] Improve the final detail\n\n',
            image: '\n\n![Minecraft article image](assets/images/example.png)\n\n',
            tips: '\n\n### Quick tips\n\n- Keep it simple\n- Save resources for upgrades\n- Focus on safety and efficiency\n\n'
        };

        const snippet = snippets[type];
        if (!snippet) return;

        insertTextAtCursor(snippet);
    }

    function initializeAdminFeatures() {
        document.querySelectorAll('[data-admin-panel]').forEach((panel) => {
            panel.hidden = panel.dataset.adminPanel !== 'overview';
        });
        const overviewTab = document.querySelector('[data-admin-tab="overview"]');
        if (overviewTab) overviewTab.classList.add('active');

        document.querySelectorAll('[data-admin-tab]').forEach((tab) => {
            tab.addEventListener('click', () => {
                const selectedTab = tab.dataset.adminTab;
                document.querySelectorAll('[data-admin-tab]').forEach((item) => {
                    const active = item.dataset.adminTab === selectedTab;
                    item.classList.toggle('active', active);
                    item.setAttribute('aria-selected', String(active));
                });
                document.querySelectorAll('[data-admin-panel]').forEach((panel) => {
                    panel.hidden = panel.dataset.adminPanel !== selectedTab;
                });
                if (selectedTab === 'media') renderMediaLibrary();
            });
        });

        document.querySelectorAll('[data-editor-tab]').forEach((tab) => {
            tab.addEventListener('click', () => {
                const selectedTab = tab.dataset.editorTab;
                document.querySelectorAll('[data-editor-tab]').forEach((item) => {
                    const active = item.dataset.editorTab === selectedTab;
                    item.classList.toggle('active', active);
                    item.setAttribute('aria-selected', String(active));
                });
                document.querySelectorAll('[data-editor-section]').forEach((section) => {
                    const sections = (section.dataset.editorSection || '').split(/\s+/);
                    section.hidden = !sections.includes(selectedTab);
                });
            });
        });

        document.querySelectorAll('[data-editor-section]').forEach((section) => {
            const sections = (section.dataset.editorSection || '').split(/\s+/);
            section.hidden = !sections.includes('content');
        });

        const publishButton = document.getElementById('publish-button');
        const publishDialog = document.getElementById('publish-dialog');
        if (publishButton && publishDialog) {
            publishButton.addEventListener('click', () => openPublishDialog(publishDialog));
        }

        const bottomDraftButton = document.getElementById('save-draft-bottom');
        if (bottomDraftButton) bottomDraftButton.addEventListener('click', saveDraftState);

        const settingsButton = document.getElementById('save-settings-button');
        if (settingsButton) {
            settingsButton.addEventListener('click', () => {
                const author = document.getElementById('default-author');
                const readingTime = document.getElementById('default-reading-time');
                localStorage.setItem('craft-hub-admin-settings', JSON.stringify({
                    author: author ? author.value : AUTHOR_STUDIO_NAME,
                    readingTime: readingTime ? readingTime.value : '3'
                }));
                const status = document.getElementById('settings-status');
                if (status) status.textContent = 'Settings saved.';
            });
        }

        try {
            const settings = JSON.parse(localStorage.getItem('craft-hub-admin-settings') || '{}');
            const defaultAuthor = document.getElementById('default-author');
            const defaultReadingTime = document.getElementById('default-reading-time');
            if (defaultAuthor && settings.author) defaultAuthor.value = settings.author;
            if (defaultReadingTime && settings.readingTime) defaultReadingTime.value = settings.readingTime;
        } catch (_error) {
            // Keep the form defaults when settings cannot be read.
        }

        const mediaSearch = document.getElementById('media-search');
        if (mediaSearch) mediaSearch.addEventListener('input', renderMediaLibrary);

        const mediaGrid = document.getElementById('media-grid');
        if (mediaGrid) {
            mediaGrid.addEventListener('click', (event) => {
                const button = event.target.closest('[data-media-select]');
                if (!button) return;
                mediaGrid.querySelectorAll('.media-item').forEach((item) => item.classList.remove('selected'));
                button.closest('.media-item')?.classList.add('selected');
            });
        }

        const useCoverButton = document.getElementById('media-use-cover');
        if (useCoverButton) {
            useCoverButton.addEventListener('click', () => {
                const selected = document.querySelector('.media-item.selected');
                if (!selected) {
                    const status = document.getElementById('settings-status');
                    if (status) status.textContent = 'Select a media item first.';
                    return;
                }
                const index = Number(selected.dataset.mediaIndex);
                const item = readMediaLibrary()[index];
                if (item && imageInput) {
                    imageInput.value = item.src;
                    updatePreview();
                    updatePublishChecklist();
                }
            });
        }

        document.addEventListener('keydown', (event) => {
            const modifier = event.ctrlKey || event.metaKey;
            if (modifier && event.key.toLowerCase() === 's') {
                event.preventDefault();
                saveDraftState();
            } else if (modifier && event.key.toLowerCase() === 'n') {
                event.preventDefault();
                resetForm();
                titleInput.focus();
            } else if (modifier && event.key === 'Enter') {
                event.preventDefault();
                const dialog = document.getElementById('publish-dialog');
                if (dialog) openPublishDialog(dialog);
            } else if (modifier && event.key.toLowerCase() === 'p') {
                event.preventDefault();
                document.getElementById('article-preview-panel')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
            } else if (!modifier && event.key === '/' && !['INPUT', 'TEXTAREA', 'SELECT'].includes(document.activeElement?.tagName)) {
                event.preventDefault();
                articleSearch?.focus();
            }
        });

        const confirmButton = document.getElementById('confirm-publish-button');
        if (confirmButton && publishDialog) {
            confirmButton.addEventListener('click', (event) => {
                event.preventDefault();
                if (confirmButton.disabled) return;
                if (statusInput) statusInput.value = 'Published';
                publishDialog.close();
                form.requestSubmit();
            });
        }
    }

    function openPublishDialog(dialog) {
        const summary = document.getElementById('publish-summary');
        const validation = document.getElementById('publish-validation');
        const rawTitle = titleInput.value.trim();
        const title = rawTitle || 'Untitled article';
        const excerpt = excerptInput.value.trim();
        const content = contentInput.value.trim();
        const image = imageInput.value.trim();
        const warnings = [
            !rawTitle ? 'Add an article title.' : '',
            !excerpt ? 'Add an excerpt.' : '',
            !image ? 'Add a cover image.' : '',
            !content ? 'Add article content.' : ''
        ].filter(Boolean);

        if (summary) {
            summary.innerHTML = `
                <strong>${escapeHtml(title)}</strong>
                <span>${escapeHtml(categoryInput.value)} • ${escapeHtml(difficultyInput.value)} • ${escapeHtml(authorInput.value)}</span>
                <span>${escapeHtml(`${Number(readingMinutesInput.value) || 3} min read`)}</span>
            `;
        }
        if (validation) {
            validation.innerHTML = warnings.length
                ? warnings.map((warning) => `<li>${escapeHtml(warning)}</li>`).join('')
                : '<li>All required publishing details are complete.</li>';
        }
        const confirmButton = document.getElementById('confirm-publish-button');
        if (confirmButton) confirmButton.disabled = warnings.length > 0;
        if (typeof dialog.showModal === 'function') dialog.showModal();
    }

    function readMediaLibrary() {
        try {
            const parsed = JSON.parse(localStorage.getItem('craft-hub-media-library') || '[]');
            return Array.isArray(parsed) ? parsed : [];
        } catch (_error) {
            return [];
        }
    }

    function renderMediaLibrary() {
        const grid = document.getElementById('media-grid');
        const empty = document.getElementById('media-empty');
        if (!grid) return;
        const search = document.getElementById('media-search');
        const term = search ? search.value.trim().toLowerCase() : '';
        const items = readMediaLibrary().filter((item) => !term || item.name.toLowerCase().includes(term));
        grid.innerHTML = items.map((item, index) => `
            <div class="media-item" data-media-index="${index}">
                <img src="${escapeHtml(item.src)}" alt="${escapeHtml(item.name)}">
                <button type="button" class="secondary" data-media-select="${index}" title="Use in article">Select</button>
            </div>
        `).join('');
        if (empty) empty.hidden = items.length > 0;
    }

    function addMediaFile(name, src) {
        const items = readMediaLibrary();
        items.unshift({ name, src, addedAt: new Date().toISOString() });
        localStorage.setItem('craft-hub-media-library', JSON.stringify(items.slice(0, 30)));
        renderMediaLibrary();
    }

    function bindPreviewUpdates() {
        [titleInput, categoryInput, difficultyInput, readingMinutesInput, excerptInput, authorInput, imageInput, contentInput].forEach((field) => {
            if (!field) return;
            field.addEventListener('input', () => {
                updatePreview();
                updatePublishChecklist();
            });
            field.addEventListener('change', () => {
                updatePreview();
                updatePublishChecklist();
            });
        });

        document.querySelectorAll('[data-open]').forEach((button) => {
            button.addEventListener('click', () => {
                const target = button.getAttribute('data-open');
                if (target) window.location.href = target;
            });
        });

        document.querySelectorAll('[data-template]').forEach((button) => {
            button.addEventListener('click', () => {
                applyTemplate(button.dataset.template);
            });
        });

        document.querySelectorAll('[data-insert]').forEach((button) => {
            button.addEventListener('click', () => {
                insertQuickBlock(button.dataset.insert);
            });
        });

        if (saveDraftButton) {
            saveDraftButton.addEventListener('click', () => {
                saveDraftState();
                saveDraftButton.textContent = 'Draft saved';
                setTimeout(() => {
                    saveDraftButton.textContent = 'Save draft';
                }, 1200);
            });
        }

        if (clearDraftButton) {
            clearDraftButton.addEventListener('click', () => {
                clearDraftState();
                resetForm();
            });
        }

        document.querySelectorAll('[data-image-upload-trigger]').forEach((trigger) => {
            trigger.addEventListener('click', () => articleImageUpload && articleImageUpload.click());
        });
        if (articleImageUpload) {
            articleImageUpload.addEventListener('change', async () => {
                const file = articleImageUpload.files && articleImageUpload.files[0];
                if (!file) return;

                const reader = new FileReader();
                reader.onload = () => {
                    const result = String(reader.result || '');
                    if (!result) return;
                    insertTextAtCursor(`\n\n![${escapeHtml(file.name.replace(/\.[^.]+$/, ''))}](${result})\n\n`);
                    imageInput.value = result;
                    addMediaFile(file.name, result);
                    articleImageUpload.value = '';
                    updatePreview();
                    updatePublishChecklist();
                };
                reader.readAsDataURL(file);
            });
        }
    }

    function normalizeAssetPath(value) {
        return String(value || '').trim();
    }

    function saveArticle(event) {
        event.preventDefault();

        const trimmedTitle = titleInput.value.trim();
        const trimmedContent = contentInput.value.trim();
        if (!trimmedTitle || !trimmedContent) return;

        const articleId = idInput.value || `custom-${Date.now()}`;
        const stored = getStoredArticles();
        const existingArticle = stored.find((item) => String(item.id) === String(articleId));
        const authorName = AUTHOR_STUDIO_PAGE ? AUTHOR_STUDIO_NAME : (authorInput.value.trim() || AUTHOR_STUDIO_NAME);
        if (AUTHOR_STUDIO_PAGE && existingArticle && normalizeAuthorName(existingArticle.author) !== normalizeAuthorName(AUTHOR_STUDIO_NAME)) {
            return;
        }

        const nextArticle = {
            id: articleId,
            title: trimmedTitle,
            subtitle: subtitleInput.value.trim(),
            slug: buildSlug(trimmedTitle),
            category: categoryInput.value,
            difficulty: difficultyInput.value,
            author: authorName,
            readingMinutes: Number(readingMinutesInput.value) || 3,
            excerpt: excerptInput.value.trim(),
            content: trimmedContent,
            tags: formatTags(tagsInput.value),
            image: normalizeAssetPath(imageInput.value),
            authorAvatar: normalizeAssetPath(authorAvatarInput.value),
            accentColor: accentColorInput.value || '#c63b2d',
            featured: !!featuredInput.checked,
            status: statusInput ? (statusInput.value || 'Draft') : 'Draft',
            hidden: false,
            createdAt: existingArticle?.createdAt || new Date().toISOString(),
            updatedAt: new Date().toISOString()
        };

        const idx = stored.findIndex((item) => String(item.id) === String(articleId));
        if (idx >= 0) {
            stored[idx] = { ...stored[idx], ...nextArticle };
        } else {
            stored.push(nextArticle);
        }

        const autosaveStatus = document.getElementById('autosave-status');
        try {
            setStoredArticles(stored);
        } catch (_error) {
            if (autosaveStatus) {
                autosaveStatus.className = 'autosave-status is-error';
                autosaveStatus.textContent = 'Could not save the article in browser storage. Check your browser storage settings and available space.';
            }
            return;
        }
        if (autosaveStatus) {
            autosaveStatus.className = 'autosave-status is-saved';
            autosaveStatus.textContent = `Saved in this browser as ${nextArticle.status}.`;
        }

        clearDraftState();
        const actionLabel = existingArticle ? 'Updated' : 'Created';
        recordRecentActivity(actionLabel, trimmedTitle);
        renderArticles();
        resetForm();
    }

    function deleteArticle(id) {
        const stored = getStoredArticles();
        const existing = stored.find((item) => String(item.id) === String(id));

        if (existing) {
            const next = stored.map((item) => String(item.id) === String(id)
                ? { ...item, hidden: true, updatedAt: new Date().toISOString() }
                : item);
            setStoredArticles(next);
        } else {
            const defaultArticle = getBuiltInArticles().find((item) => String(item.id) === String(id));
            if (defaultArticle) {
                const next = [
                    ...stored,
                    {
                        ...defaultArticle,
                        id: defaultArticle.id,
                        hidden: true,
                        source: 'deleted',
                        updatedAt: new Date().toISOString(),
                        createdAt: new Date().toISOString()
                    }
                ];
                setStoredArticles(next);
            } else {
                setStoredArticles(stored.filter((item) => String(item.id) !== String(id)));
            }
        }

        const deletedArticle = stored.find((item) => String(item.id) === String(id)) || getBuiltInArticles().find((item) => String(item.id) === String(id));
        if (deletedArticle?.title) {
            recordRecentActivity('Deleted', deletedArticle.title);
        }
        renderArticles();
        if (String(idInput.value) === String(id)) resetForm();
    }

    initializeAdminFeatures();
    bindPreviewUpdates();
    form.addEventListener('submit', saveArticle);
    cancelButton.addEventListener('click', resetForm);
    if (newArticleButton) newArticleButton.addEventListener('click', resetForm);
    if (previewSiteButton) previewSiteButton.addEventListener('click', () => window.location.href = 'index.html');

    list.addEventListener('click', async (event) => {
        const button = event.target.closest('[data-action]');
        if (!button) return;
        const { action, id } = button.dataset;
        const article = getVisibleArticles().find((item) => String(item.id) === String(id));
        if (!article) return;

        if (action === 'preview') {
            const previewUrl = String(article.id).startsWith('custom-')
                ? `article-view.html?id=${encodeURIComponent(article.id)}`
                : `articles/${encodeURIComponent(article.id)}.html`;
            window.open(previewUrl, '_blank');
            return;
        }

        if (action === 'duplicate') {
            const stored = getStoredArticles();
            const duplicate = {
                ...article,
                id: `custom-${Date.now()}`,
                title: `${article.title || 'Untitled article'} (Copy)`,
                status: 'Draft',
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
                source: 'custom'
            };
            stored.push(duplicate);
            setStoredArticles(stored);
            recordRecentActivity('Duplicated', article.title);
            renderArticles();
            return;
        }

        if (action === 'delete') {
            deleteArticle(id);
            selectedArticleIds.delete(String(id));
            return;
        }

        if (action === 'edit') {
            button.disabled = true;
            try {
                const defaultArticle = DEFAULT_ARTICLES.find((item) => String(item.id) === String(article.id));
                const editableArticle = defaultArticle && (
                    article.source === 'default' || article.content === defaultArticle.content
                )
                    ? { ...article, content: await loadOriginalArticleContent(article.id) }
                    : article;
                fillForm(editableArticle);
            } catch (error) {
                console.error('Unable to load the original article for editing.', error);
                fillForm(article);
                const livePreview = document.getElementById('live-article-preview');
                if (livePreview) {
                    const message = document.createElement('p');
                    message.className = 'article-load-error';
                    message.textContent = 'Could not load the original article content. Check that the site files are available, then try again.';
                    livePreview.prepend(message);
                }
            } finally {
                button.disabled = false;
            }
        }
    });

    list.addEventListener('change', handleSelectionChange);

    if (articleSearch) {
        articleSearch.addEventListener('input', () => {
            renderArticles();
            updateSelectionControls();
        });
    }

    if (articleStatusFilter) {
        articleStatusFilter.addEventListener('change', () => {
            renderArticles();
            updateSelectionControls();
        });
    }

    if (articleSort) {
        articleSort.addEventListener('change', () => {
            renderArticles();
            updateSelectionControls();
        });
    }

    if (selectAllButton) {
        selectAllButton.addEventListener('click', selectAllVisible);
    }

    if (bulkDeleteButton) {
        bulkDeleteButton.addEventListener('click', bulkDeleteSelected);
    }

    window.CraftHubBlog = window.CraftHubBlog || {};
    window.CraftHubBlog.getArticles = getArticles;
    window.CraftHubBlog.setStoredArticles = setStoredArticles;

    let autosaveTimer = null;
    [titleInput, categoryInput, difficultyInput, readingMinutesInput, subtitleInput, accentColorInput, excerptInput, contentInput, tagsInput, imageInput, authorAvatarInput, featuredInput, statusInput].forEach((field) => {
        if (!field) return;
        field.addEventListener('input', () => {
            const autosaveStatus = document.getElementById('autosave-status');
            if (autosaveStatus) {
                autosaveStatus.className = 'autosave-status is-saving';
                autosaveStatus.textContent = 'Saving...';
            }
            clearTimeout(autosaveTimer);
            autosaveTimer = setTimeout(saveDraftState, 600);
        });
        field.addEventListener('change', saveDraftState);
    });

    renderRecentActivity();
    if (!loadDraftState()) {
        resetForm();
    } else {
        updatePreview();
        updatePublishChecklist();
    }
    renderArticles();
})();
