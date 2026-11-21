(function () {
    const STORAGE_KEY = 'minecraft-blog-articles';
    const SAVE_KEY = 'crafthub-saved-guides';
    const CHECKLIST_PREFIX = 'crafthub-checklist:';
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

    const articleImage = document.getElementById('article-image');
    const articleCategory = document.getElementById('article-category');
    const articleTitle = document.getElementById('article-title');
    const articleLabels = document.getElementById('article-labels');
    const articleMeta = document.getElementById('article-meta');
    const articleContent = document.getElementById('article-content');
    const saveButton = document.getElementById('save-article-button');

    if (!articleContent || !articleTitle || !articleCategory || !articleMeta) return;

    function escapeHtml(value) {
        return String(value || '')
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
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

    function readSaved() {
        try {
            const raw = localStorage.getItem(SAVE_KEY);
            const parsed = raw ? JSON.parse(raw) : [];
            return Array.isArray(parsed) ? parsed.map(String) : [];
        } catch (_error) {
            return [];
        }
    }

    function saveArticleToList() {
        const articleId = new URLSearchParams(window.location.search).get('id');
        if (!articleId || !saveButton) return;

        const saved = readSaved();
        const next = saved.includes(articleId)
            ? saved.filter((item) => item !== articleId)
            : [articleId, ...saved];

        localStorage.setItem(SAVE_KEY, JSON.stringify(next));
        const isSaved = next.includes(articleId);
        saveButton.textContent = isSaved ? 'Remove saved guide' : 'Save for later';
        saveButton.setAttribute('aria-pressed', String(isSaved));
    }

    function getArticles() {
        const storedArticles = (() => {
            try {
                const raw = localStorage.getItem(STORAGE_KEY);
                const parsed = raw ? JSON.parse(raw) : [];
                return Array.isArray(parsed) ? parsed : [];
            } catch (_error) {
                return [];
            }
        })();

        const hiddenIds = new Set(storedArticles.filter((article) => article && article.hidden).map((article) => String(article.id)));
        const overrides = new Map(storedArticles.filter((article) => article && !article.hidden).map((article) => [String(article.id), article]));
        const merged = DEFAULT_ARTICLES.filter((article) => !hiddenIds.has(String(article.id))).map((article) => {
            const override = overrides.get(String(article.id));
            return { ...article, ...(override || {}), source: override ? 'override' : 'default' };
        });

        storedArticles
            .filter((article) => article && !article.hidden && !hiddenIds.has(String(article.id)) && !merged.some((item) => String(item.id) === String(article.id)))
            .forEach((article) => merged.push({ ...article, source: 'custom' }));

        return merged;
    }

    function renderLabels(article) {
        if (!articleLabels) return;
        articleLabels.innerHTML = '';
        const values = [
            article.difficulty || 'Beginner',
            `About ${article.readingMinutes || 3} min`,
            'Version-independent'
        ];

        values.forEach((value) => {
            const label = document.createElement('span');
            label.textContent = value;
            articleLabels.appendChild(label);
        });
    }

    function readChecklistState(storageKey) {
        try {
            const raw = localStorage.getItem(storageKey);
            const parsed = raw ? JSON.parse(raw) : {};
            return parsed && typeof parsed === 'object' ? parsed : {};
        } catch (_error) {
            return {};
        }
    }

    function renderContent(content) {
        const lines = (content || '').split(/\n/);
        const fragment = document.createDocumentFragment();
        let paragraphBuffer = [];
        let checklistItems = [];

        const flushParagraph = () => {
            if (!paragraphBuffer.length) return;
            const p = document.createElement('p');
            p.innerHTML = paragraphBuffer.join(' ');
            fragment.appendChild(p);
            paragraphBuffer = [];
        };

        const flushChecklist = () => {
            if (!checklistItems.length) return;
            const list = document.createElement('ul');
            list.className = 'interactive-checklist';
            const checklistId = `custom-article-${new URLSearchParams(window.location.search).get('id')}`;
            const storageKey = `${CHECKLIST_PREFIX}${checklistId}`;
            const savedChecklist = readChecklistState(storageKey);

            checklistItems.forEach((item, index) => {
                const li = document.createElement('li');
                li.classList.add('checklist-item');
                const checkbox = document.createElement('input');
                checkbox.type = 'checkbox';
                checkbox.checked = !!savedChecklist[index];
                checkbox.setAttribute('aria-label', item.label);
                li.classList.toggle('is-complete', checkbox.checked);
                checkbox.addEventListener('change', () => {
                    const latest = readChecklistState(storageKey);
                    latest[index] = checkbox.checked;
                    localStorage.setItem(storageKey, JSON.stringify(latest));
                    li.classList.toggle('is-complete', checkbox.checked);
                });

                const text = document.createElement('span');
                text.textContent = item.label;
                li.appendChild(checkbox);
                li.appendChild(text);
                list.appendChild(li);
            });

            fragment.appendChild(list);
            checklistItems = [];
        };

        lines.forEach((line) => {
            const trimmed = line.trim();
            if (!trimmed) {
                flushParagraph();
                flushChecklist();
                return;
            }

            if (/^!\[.*\]\((.+)\)$/.test(trimmed)) {
                flushParagraph();
                flushChecklist();
                const match = trimmed.match(/^!\[.*\]\((.+)\)$/);
                const img = document.createElement('img');
                img.src = match[1];
                img.alt = 'Article image';
                img.loading = 'lazy';
                fragment.appendChild(img);
                return;
            }

            if (/^>\s+/.test(trimmed)) {
                flushParagraph();
                flushChecklist();
                const quote = document.createElement('blockquote');
                quote.textContent = trimmed.replace(/^>\s+/, '');
                fragment.appendChild(quote);
                return;
            }

            if (/^#+\s+/.test(trimmed)) {
                flushParagraph();
                flushChecklist();
                const heading = document.createElement('h3');
                heading.textContent = trimmed.replace(/^#+\s*/, '');
                fragment.appendChild(heading);
                return;
            }

            if (/^- \[x\]\s+/i.test(trimmed)) {
                flushParagraph();
                checklistItems.push({ label: trimmed.replace(/^- \[x\]\s+/i, '').trim(), checked: true });
                return;
            }

            if (/^- \[ \]\s+/i.test(trimmed)) {
                flushParagraph();
                checklistItems.push({ label: trimmed.replace(/^- \[ \]\s+/i, '').trim(), checked: false });
                return;
            }

            if (/^-\s+/.test(trimmed)) {
                flushParagraph();
                checklistItems.push({ label: trimmed.replace(/^-\s+/, '').trim(), checked: false });
                return;
            }

            paragraphBuffer.push(trimmed);
        });

        flushParagraph();
        flushChecklist();

        if (!fragment.childNodes.length) {
            const fallback = document.createElement('p');
            fallback.textContent = 'No article content available yet.';
            fragment.appendChild(fallback);
        }

        articleContent.innerHTML = '';
        articleContent.appendChild(fragment);
    }

    function initializeArticleExperience(article) {
        const headings = Array.from(articleContent.querySelectorAll('h2, h3'));
        if (headings.length) {
            const toc = document.createElement('aside');
            toc.className = 'table-of-contents';
            toc.innerHTML = '<h2>In this article</h2>';
            const list = document.createElement('ol');
            headings.forEach((heading, index) => {
                if (!heading.id) heading.id = `article-section-${index + 1}`;
                const item = document.createElement('li');
                const link = document.createElement('a');
                link.href = `#${heading.id}`;
                link.textContent = heading.textContent;
                item.appendChild(link);
                list.appendChild(item);
            });
            toc.appendChild(list);
            articleContent.parentElement.insertBefore(toc, articleContent);
        }

        const tools = document.createElement('div');
        tools.className = 'article-share-actions';
        tools.innerHTML = '<strong>Share</strong><button type="button" data-share-button>Share article</button><button type="button" data-print-button>Print</button>';
        articleContent.parentElement.insertBefore(tools, articleContent);
        tools.querySelector('[data-share-button]').addEventListener('click', async () => {
            const data = { title: article.title, text: article.excerpt, url: window.location.href };
            try {
                if (navigator.share) await navigator.share(data);
                else {
                    await navigator.clipboard.writeText(window.location.href);
                    tools.querySelector('[data-share-button]').textContent = 'Link copied';
                }
            } catch (_error) {}
        });
        tools.querySelector('[data-print-button]').addEventListener('click', () => window.print());

        const articleKey = String(article.id);
        const viewKey = `crafthub-views:${articleKey}`;
        let views = 0;
        try {
            views = Number(localStorage.getItem(viewKey) || 0) + 1;
            localStorage.setItem(viewKey, String(views));
        } catch (_error) {}
        const viewStatus = document.createElement('small');
        viewStatus.className = 'editorial-meta';
        viewStatus.textContent = `${views.toLocaleString()} local views`;
        const saveButton = document.getElementById('save-article-button');
        if (saveButton) saveButton.insertAdjacentElement('afterend', viewStatus);

        const feedback = document.createElement('section');
        feedback.className = 'article-feedback';
        feedback.innerHTML = '<h2>Was this guide helpful?</h2><div class="article-feedback-actions"><button type="button" data-feedback="yes">Yes, helpful</button><button type="button" data-feedback="no">Not yet</button></div><p class="article-feedback-status" role="status" aria-live="polite"></p>';
        const feedbackStatus = feedback.querySelector('.article-feedback-status');
        feedback.querySelectorAll('[data-feedback]').forEach((button) => {
            button.addEventListener('click', () => {
                const value = button.dataset.feedback;
                try { localStorage.setItem(`crafthub-feedback:${articleKey}`, value); } catch (_error) {}
                feedbackStatus.textContent = value === 'yes' ? 'Thanks - marked as helpful.' : 'Thanks - this helps us improve.';
            });
        });

        const toolsCard = document.createElement('section');
        toolsCard.className = 'article-tools-card';
        toolsCard.innerHTML = `<h2>Helpful Minecraft tool</h2><p><a href="pages/tools.html">Open the CraftHub stack, travel, and coordinate tools</a></p>`;

        const updateHistory = document.createElement('section');
        updateHistory.className = 'article-update-history';
        updateHistory.innerHTML = '<h2>Article history</h2><p>Updated November 1, 2026 - reviewed for clarity and current gameplay guidance.</p>';

        const faq = document.createElement('section');
        faq.className = 'article-faq';
        faq.innerHTML = '<h2>Frequently asked questions</h2><details><summary>Is this guide suitable for beginners?</summary><p>Yes. The steps are practical and designed for early-game and experienced Minecraft players.</p></details><details><summary>Does this work in Survival mode?</summary><p>Yes. It is written primarily for Survival mode and remains useful for Creative planning.</p></details>';

        articleContent.parentElement.append(feedback, toolsCard, updateHistory, faq);

        const faqScript = document.createElement('script');
        faqScript.type = 'application/ld+json';
        faqScript.textContent = JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'FAQPage',
            mainEntity: [
                { '@type': 'Question', name: 'Is this guide suitable for beginners?', acceptedAnswer: { '@type': 'Answer', text: 'Yes. The steps are practical and designed for early-game and experienced Minecraft players.' } },
                { '@type': 'Question', name: 'Does this work in Survival mode?', acceptedAnswer: { '@type': 'Answer', text: 'Yes. It is written primarily for Survival mode and remains useful for Creative planning.' } }
            ]
        });
        document.head.appendChild(faqScript);

        const progress = document.createElement('div');
        progress.className = 'reading-progress';
        progress.setAttribute('role', 'progressbar');
        progress.setAttribute('aria-label', 'Article reading progress');
        progress.setAttribute('aria-valuemin', '0');
        progress.setAttribute('aria-valuemax', '100');
        const bar = document.createElement('span');
        progress.appendChild(bar);
        document.body.prepend(progress);
        const updateProgress = () => {
            const max = document.documentElement.scrollHeight - window.innerHeight;
            const percent = max > 0 ? Math.min(100, Math.max(0, Math.round(window.scrollY / max * 100))) : 100;
            bar.style.width = `${percent}%`;
            progress.setAttribute('aria-valuenow', String(percent));
        };
        window.addEventListener('scroll', updateProgress, { passive: true });
        updateProgress();

        const lightboxImages = Array.from(document.querySelectorAll('.article-view-page img'));
        if (lightboxImages.length) {
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
                closeButton.blur();
            };
            closeButton.addEventListener('click', close);
            modal.addEventListener('click', (event) => {
                if (event.target === modal) close();
            });
            document.addEventListener('keydown', (event) => {
                if (event.key === 'Escape' && modal.hidden === false) close();
            });
            lightboxImages.forEach((image) => {
                image.tabIndex = 0;
                image.setAttribute('role', 'button');
                image.setAttribute('aria-label', image.alt ? `Open image: ${image.alt}` : 'Open image preview');
                const open = () => {
                    modalImage.src = image.currentSrc || image.src;
                    modalImage.alt = image.alt || 'Image preview';
                    modal.hidden = false;
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

        const author = document.createElement('section');
        author.className = 'article-author-card';
        if (article.authorAvatar) {
            author.innerHTML = `<h2>About the author</h2><img src="${escapeHtml(article.authorAvatar)}" alt="${escapeHtml(article.author || 'Admin')}" class="author-avatar"><strong>${escapeHtml(article.author || 'Admin')}</strong><p>CraftHub contributor covering Minecraft ${escapeHtml(article.category || 'survival').toLowerCase()} guides, practical builds, and efficient routines.</p>`;
        } else {
            author.innerHTML = `<h2>About the author</h2><strong>${escapeHtml(article.author || 'Admin')}</strong><p>CraftHub contributor covering Minecraft ${escapeHtml(article.category || 'survival').toLowerCase()} guides, practical builds, and efficient routines.</p>`;
        }
        articleContent.parentElement.appendChild(author);

        const relatedArticles = getArticles().filter((item) => String(item.id) !== String(article.id) && (item.category || '').toLowerCase() === (article.category || '').toLowerCase()).slice(0, 3);
        if (relatedArticles.length) {
            const related = document.createElement('section');
            related.className = 'related-posts';
            related.innerHTML = '<h2>Related articles</h2>';
            relatedArticles.forEach((item) => {
                const link = document.createElement('a');
                link.href = `article-view.html?id=${encodeURIComponent(item.id)}`;
                link.textContent = item.title;
                related.appendChild(link);
            });
            articleContent.parentElement.appendChild(related);
        }

        const commentsJump = document.createElement('a');
        commentsJump.className = 'comments-jump-link';
        commentsJump.href = '#comments';
        commentsJump.textContent = 'Skip to comments';
        articleContent.parentElement.appendChild(commentsJump);

        const key = `crafthub-comments:${article.id}`;
        let comments = [];
        try {
            const parsed = JSON.parse(localStorage.getItem(key) || '[]');
            if (Array.isArray(parsed)) comments = parsed;
        } catch (_error) {}

        const commentsSection = document.createElement('section');
        commentsSection.className = 'article-comments';
        commentsSection.id = 'comments';
        commentsSection.innerHTML = '<h2>Community discussion</h2><form><label>Name<input name="name" maxlength="40" required placeholder="Your display name"></label><label>Comment<textarea name="text" maxlength="500" required placeholder="Share a helpful tip or ask a question"></textarea></label><p class="comment-counter" aria-live="polite">0 / 500</p><button type="submit">Post comment</button><p class="comment-notice">Comments are stored on this device only.</p></form><div class="comment-list"></div>';
        const list = commentsSection.querySelector('.comment-list');
        const render = () => {
            list.replaceChildren();
            comments.forEach((comment) => {
                const card = document.createElement('article');
                card.innerHTML = `<strong>${escapeHtml(comment.name)}</strong><time>${escapeHtml(formatCommentDate(comment.date))}</time><p>${escapeHtml(comment.text)}</p>`;
                list.appendChild(card);
            });
        };
        const commentText = commentsSection.querySelector('textarea');
        const commentCounter = commentsSection.querySelector('.comment-counter');
        commentText.addEventListener('input', () => {
            commentCounter.textContent = `${commentText.value.length} / 500`;
        });
        render();
        commentsSection.querySelector('form').addEventListener('submit', (event) => {
            event.preventDefault();
            const form = new FormData(event.currentTarget);
            const name = String(form.get('name') || '').trim();
            const text = String(form.get('text') || '').trim();
            if (!name || !text) return;
            comments.unshift({ name, text, date: new Date().toLocaleString() });
            localStorage.setItem(key, JSON.stringify(comments));
            event.currentTarget.reset();
            render();
        });
        articleContent.parentElement.appendChild(commentsSection);

        const articleIndex = getArticles().findIndex((item) => String(item.id) === String(article.id));
        const nextArticle = getArticles()[articleIndex + 1] || getArticles()[0];
        if (nextArticle && String(nextArticle.id) !== String(article.id)) {
            const navigation = document.createElement('nav');
            navigation.className = 'article-navigation';
            navigation.setAttribute('aria-label', 'Article navigation');
            navigation.innerHTML = `<a href="article-view.html?id=${encodeURIComponent(nextArticle.id)}">Next article: ${escapeHtml(nextArticle.title || 'Untitled')}</a><a href="index.html#Articles">Browse all articles</a>`;
            articleContent.parentElement.appendChild(navigation);
        }
    }

    function init() {
        const articleId = new URLSearchParams(window.location.search).get('id');
        if (!articleId) {
            articleContent.innerHTML = '<p>Missing article ID.</p>';
            return;
        }

        const article = getArticles().find((item) => String(item.id) === String(articleId));
        if (!article) {
            articleTitle.textContent = 'Article not found';
            articleCategory.textContent = 'Missing';
            articleMeta.textContent = 'This article does not exist in your browser storage.';
            articleContent.innerHTML = '<p><a href="index.html">Return to the homepage</a></p>';
            if (saveButton) saveButton.hidden = true;
            return;
        }

        articleTitle.textContent = article.title || 'Custom Article';
        articleCategory.textContent = article.category || 'Survival';
        articleCategory.style.backgroundColor = article.accentColor || '#c63b2d';
        articleCategory.classList.add(`article-category-${String(article.category || 'survival').toLowerCase()}`);
        articleCategory.classList.add('post-category');
        document.title = `${article.title || 'Custom Article'} - CraftHub`;
        articleCategory.className = 'post-category';
        const breadcrumbCategory = document.getElementById('article-breadcrumb-category');
        if (breadcrumbCategory) breadcrumbCategory.textContent = article.category || 'Survival';
        const articlePage = document.querySelector('.article-view-page');
        if (articlePage) {
            articlePage.classList.add('post-content');
            articlePage.dataset.category = String(article.category || 'survival').toLowerCase();
            articlePage.dataset.topic = String(article.category || 'survival').toLowerCase();
            articlePage.dataset.difficulty = String(article.difficulty || 'beginner').toLowerCase();
            articlePage.dataset.readingMinutes = String(article.readingMinutes || 1);
        }
        articleMeta.classList.add('post-meta');
        const description = document.querySelector('meta[name="description"]');
        if (description) description.content = article.excerpt || article.title || 'Read this CraftHub Minecraft guide.';

        if (articleImage) {
            articleImage.src = article.image || 'assets/images/optimized/main.jpg';
            articleImage.alt = article.title || 'Custom article image';
            const existingCaption = document.querySelector('.article-caption');
            if (existingCaption) existingCaption.remove();
        }

        const publishedDate = new Date(article.createdAt || Date.now());
        const dateText = publishedDate.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
        const authorName = article.author || 'Admin';
        const authorSlug = authorName.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
        articleMeta.innerHTML = `Published <time datetime="${escapeHtml(publishedDate.toISOString().slice(0, 10))}">${escapeHtml(dateText)}</time> by <a href="pages/authors.html${authorSlug ? `#${escapeHtml(authorSlug)}` : ''}">${escapeHtml(authorName)}</a>`;
        renderLabels(article);
        renderContent(article.content || article.excerpt || 'No content found.');

        if (saveButton) {
            const saved = readSaved();
            const isSaved = saved.includes(articleId);
            saveButton.className = 'article-save-button';
            saveButton.textContent = isSaved ? 'Remove saved guide' : 'Save for later';
            saveButton.setAttribute('aria-pressed', String(isSaved));
            saveButton.addEventListener('click', saveArticleToList);
        }
        initializeArticleExperience(article);
    }

    init();
})();
