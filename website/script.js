// State management
let currentView = 'home';
let allPosts = [];

// Initialize app
document.addEventListener('DOMContentLoaded', () => {
    loadInitialData();
    setupNavigation();
    handleRouting();
    initializeThemeToggle();
    initializeMobileMenu();
    initializeSmoothScrolling();
    
    // Listen for browser back/forward
    window.addEventListener('popstate', handleRouting);
    window.addEventListener('scroll', handleScrollNavigation);
});

async function loadInitialData() {
    await Promise.all([
        loadBlogPosts()
    ]);
}

function setupNavigation() {
    // Handle navigation clicks
    document.querySelectorAll('a[href^="#"]').forEach(link => {
        link.addEventListener('click', (e) => {
            const href = link.getAttribute('href');
            if (href.startsWith('#post/')) {
                e.preventDefault();
                const postId = href.replace('#post/', '');
                navigateToPost(postId);
            }
        });
    });
}

function handleRouting() {
    const hash = window.location.hash;
    
    if (hash.startsWith('#post/')) {
        const postId = hash.replace('#post/', '');
        showPost(postId);
    } else {
        showHome();
    }
}

function navigateToPost(postId) {
    window.location.hash = `#post/${postId}`;
    showPost(postId);
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

function navigateHome() {
    window.location.hash = '';
    showHome();
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

function showHome() {
    currentView = 'home';
    
    // Safely update hero title/subtitle if those elements exist
    const heroTitleEl = document.getElementById('heroTitle');
    const heroSubtitleEl = document.getElementById('heroSubtitle');
    if (heroTitleEl) heroTitleEl.textContent = "Hi, I'm Calum";
    if (heroSubtitleEl) heroSubtitleEl.textContent = "Cloud Architect & Full-Stack Developer building scalable solutions on the cloud";

    // Home template used for dynamic rendering or restoring static content
    const homeTemplate = `
        <section id="about">
                <h2>About Me</h2>
                <div class="about-content">
                    <img src="headshot.jpeg" alt="Your Name" class="profile-image">
                    <div class="about-text">
                        <p>I'm a recent graduate of the University of St Andrews. Currently working at Accenture as part of the Modern Engineering Graduate Scheme</p>
                        <p>With a strong foundation in software development, I enjoy tackling complex problems and transforming ideas into elegant, efficient code. I also have experience in Cybersecurity from an internship in the threat detection team at Lloyds Banking Group</p>
                        <p>My other interests are guitar, rugby and reading</p>
                        <a href="cv.pdf" class="cv-btn" download>
                            <span>📄</span> Download My CV
                        </a>
                    </div>
                </div>
            </section>

            <section id="projects">
                <h2>What I'm Working On</h2>
                <div class="projects-grid">
                    <div class="project-card">
                        <span class="project-status">In Progress</span>
                        <h3>Portfolio Website on OCI</h3>
                        <p>Building this website using modern web technologies and hosting it on Oracle Cloud Infrastructure. Implementing infrastructure as code with Terraform and automated deployments via CI/CD pipelines.</p>
                        <div class="skills">
                            <span class="skill-tag">HTML/CSS/JS</span>
                            <span class="skill-tag">OCI</span>
                            <span class="skill-tag">Terraform</span>
                            <span class="skill-tag">GitHub Actions</span>
                        </div>
                    </div>
                </div>
            </section>
            
            <section id="blog">
                <h2>Blog & Book Reviews</h2>
                <div class="blog-filters">
                    <button class="filter-btn active" data-filter="all">All Posts</button>
                    <button class="filter-btn" data-filter="technical">Technical</button>
                    <button class="filter-btn" data-filter="book-review">Book Reviews</button>
                </div>
                <div class="blog-posts" id="blogPosts">
                    <div class="loading">Loading posts...</div>
                </div>
            </section>

            <section id="technical">
                <h2>Technical Information</h2>
                <div class="tech-grid">
                    <div class="tech-card">
                        <h3>🏗️ Infrastructure</h3>
                        <ul>
                            <li><strong>Hosting:</strong> OCI Object Storage</li>
                            <li><strong>CDN:</strong> OCI Edge Services</li>
                            <li><strong>DNS:</strong> OCI DNS Management</li>
                            <li><strong>SSL/TLS:</strong> Let's Encrypt</li>
                        </ul>
                    </div>
                    <div class="tech-card">
                        <h3>⚙️ Deployment</h3>
                        <ul>
                            <li><strong>IaC:</strong> Terraform</li>
                            <li><strong>CI/CD:</strong> GitHub Actions</li>
                            <li><strong>Version Control:</strong> Git/GitHub</li>
                            <li><strong>Automation:</strong> Automated sync on push</li>
                        </ul>
                    </div>
                    <div class="tech-card">
                        <h3>📊 Monitoring</h3>
                        <ul>
                            <li><strong>Logging:</strong> OCI Logging</li>
                            <li><strong>Metrics:</strong> OCI Monitoring</li>
                            <li><strong>Uptime:</strong> Health checks</li>
                            <li><strong>Alerts:</strong> Custom notifications</li>
                        </ul>
                    </div>
                    <div class="tech-card">
                        <h3>💰 Cost Optimization</h3>
                        <ul>
                            <li><strong>Tier:</strong> Always Free eligible</li>
                            <li><strong>Storage:</strong> Object Storage (minimal)</li>
                            <li><strong>Bandwidth:</strong> CDN caching</li>
                            <li><strong>Estimate:</strong> ~$0-2/month</li>
                        </ul>
                    </div>
                </div>
            </section>

            <section id="github">
                <h2>GitHub Activity</h2>
                <div class="github-section">
                    <div class="github-stats">
                        <div class="github-card">
                            <h3>Contribution Graph</h3>
                            <p>My coding activity over the past year</p>
                            <img src="https://ghchart.rshah.org/2563eb/chall03" alt="GitHub Contribution Graph" class="contribution-graph">
                        </div>
                    </div>
                    <div class="github-link">
                        <a href="https://github.com/chall03" target="_blank" rel="noopener noreferrer" class="github-btn">
                            <span>🔗</span> View Full GitHub Profile
                        </a>
                    </div>
                </div>
            </section>
    `;

    // If a dynamic main container exists, populate it; otherwise restore the static container
    const mainContent = document.getElementById('mainContent');
    if (mainContent) {
        mainContent.innerHTML = homeTemplate;

        // Reload dynamic content
        loadBlogPosts();
        // Re-attach navigation and scrolling handlers for newly injected anchors
        setupNavigation();
        initializeSmoothScrolling();
    } else {
        // Restore the main static container content (best-effort)
        const firstSection = document.querySelector('main .container') || document.querySelector('main');
        if (firstSection) {
            firstSection.innerHTML = homeTemplate;
            // Render blog posts if already loaded
            renderBlogPosts(allPosts, 'all');
            setupBlogFilters(allPosts);
            // Re-attach navigation and scrolling handlers for the restored anchors
            setupNavigation();
            initializeSmoothScrolling();
        }
    }
}

function showPost(postId) {
    currentView = 'post';
    const post = allPosts.find(p => p.id === postId);
    
    if (!post) {
        showHome();
        return;
    }

    const heroTitleEl = document.getElementById('heroTitle');
    const heroSubtitleEl = document.getElementById('heroSubtitle');
    if (heroTitleEl) heroTitleEl.textContent = post.title;
    if (heroSubtitleEl) heroSubtitleEl.textContent = `${post.date} • ${post.readTime}`;

    const mainContent = document.getElementById('mainContent');
    if (mainContent) {
        mainContent.innerHTML = `
        <article class="blog-post-full">
            <button class="back-btn" onclick="navigateHome()">
                ← Back to Home
            </button>
            <div class="post-header">
                <span class="post-type">${post.type === 'technical' ? 'Technical' : 'Book Review'}</span>
                <h1>${post.title}</h1>
                <div class="post-meta">${post.date} • ${post.readTime}</div>
            </div>
            <div class="post-content">
                ${post.content}
            </div>
            <div class="post-footer">
                <button class="back-btn" onclick="navigateHome()">
                    ← Back to Home
                </button>
            </div>
        </article>
        `;
        // Attach click listeners to back buttons to ensure they work in all browsers/environments
        mainContent.querySelectorAll('.back-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                navigateHome();
            });
        });
    } else {
        // If no dynamic container, replace the first section content with the post (best-effort)
        const firstSection = document.querySelector('main .container') || document.querySelector('main');
        if (firstSection) {
            firstSection.innerHTML = `
                <article class="blog-post-full">
                    <button class="back-btn" onclick="navigateHome()">
                        ← Back to Home
                    </button>
                    <div class="post-header">
                        <span class="post-type">${post.type === 'technical' ? 'Technical' : 'Book Review'}</span>
                        <h1>${post.title}</h1>
                        <div class="post-meta">${post.date} • ${post.readTime}</div>
                    </div>
                    <div class="post-content">
                        ${post.content}
                    </div>
                    <div class="post-footer">
                        <button class="back-btn" onclick="navigateHome()">
                            ← Back to Home
                        </button>
                    </div>
                </article>
            `;
                // Attach click listeners to back buttons in the fallback rendering
                firstSection.querySelectorAll('.back-btn').forEach(btn => {
                    btn.addEventListener('click', (e) => {
                        e.preventDefault();
                        navigateHome();
                    });
                });
        }
    }
}

// Load blog posts from JSON
async function loadBlogPosts() {
    try {
        const response = await fetch('blog-posts.json');
        allPosts = await response.json();
        
        if (currentView === 'home') {
            renderBlogPosts(allPosts, 'all');
            setupBlogFilters(allPosts);
        }
    } catch (error) {
        const blogContainer = document.getElementById('blogPosts');
        if (blogContainer) {
            blogContainer.innerHTML = '<p class="error">Failed to load blog posts. Please try again later.</p>';
        }
        console.error('Error loading blog posts:', error);
    }
}

function renderBlogPosts(posts, filter = 'all') {
    const container = document.getElementById('blogPosts');
    if (!container) return;
    
    const filteredPosts = filter === 'all' ? posts : posts.filter(post => post.type === filter);
    
    if (filteredPosts.length === 0) {
        container.innerHTML = '<p class="no-posts">No posts found in this category.</p>';
        return;
    }

    container.innerHTML = filteredPosts.map(post => `
        <article class="blog-post">
            <span class="post-type">${post.type === 'technical' ? 'Technical' : 'Book Review'}</span>
            <h3>${post.title}</h3>
            <div class="post-meta">Published on ${post.date} • ${post.readTime}</div>
            <p>${post.excerpt}</p>
            <a href="#post/${post.id}" class="read-more">Read more →</a>
        </article>
    `).join('');
}

function setupBlogFilters(posts) {
    const filterButtons = document.querySelectorAll('.filter-btn');
    filterButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            filterButtons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            const filter = btn.getAttribute('data-filter');
            renderBlogPosts(posts, filter);
        });
    });
}

// Theme toggle functionality
function initializeThemeToggle() {
    const themeToggle = document.getElementById('themeToggle');
    const themeIcon = document.querySelector('.theme-icon');
    const html = document.documentElement;

    // Check for saved theme preference or default to light mode
    const currentTheme = localStorage.getItem('theme') || 'light';
    html.setAttribute('data-theme', currentTheme);
    updateThemeIcon(currentTheme);

    themeToggle.addEventListener('click', () => {
        const currentTheme = html.getAttribute('data-theme');
        const newTheme = currentTheme === 'light' ? 'dark' : 'light';
        
        html.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
        updateThemeIcon(newTheme);
    });

    function updateThemeIcon(theme) {
        themeIcon.textContent = theme === 'light' ? '🌙' : '☀️';
    }
}

// Mobile menu toggle
function initializeMobileMenu() {
    const mobileMenuBtn = document.getElementById('mobileMenuBtn');
    const navLinks = document.getElementById('navLinks');

    mobileMenuBtn.addEventListener('click', () => {
        navLinks.classList.toggle('active');
    });
}

// Smooth scrolling for navigation links
function initializeSmoothScrolling() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const href = this.getAttribute('href');
            
            // Don't interfere with blog post links
            if (href.startsWith('#post/')) {
                return;
            }
            
            e.preventDefault();
            const target = document.querySelector(href);
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
                // Close mobile menu if open
                const navLinks = document.getElementById('navLinks');
                navLinks.classList.remove('active');
            }
        });
    });
}

// Add active state to navigation based on scroll position
function handleScrollNavigation() {
    if (currentView !== 'home') return;
    
    const sections = document.querySelectorAll('section[id]');
    const scrollPos = window.scrollY + 100;

    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.offsetHeight;
        const sectionId = section.getAttribute('id');
        
        if (scrollPos >= sectionTop && scrollPos < sectionTop + sectionHeight) {
            document.querySelectorAll('.nav-links a').forEach(link => {
                link.style.color = '';
                if (link.getAttribute('href') === `#${sectionId}`) {
                    link.style.color = 'var(--primary)';
                }
            });
        }
    });
}