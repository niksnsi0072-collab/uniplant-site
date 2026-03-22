// ===== Dynamic News Loading =====
// Загружает новости из API и рендерит на страницу

async function loadNews() {
  try {
    const res = await fetch('api/news.php');
    const news = await res.json();

    if (!news.length) return;

    // Featured — первая новость
    const featured = news[0];
    const featuredEl = document.getElementById('featuredNews');
    if (featuredEl && featured) {
      featuredEl.innerHTML = renderFeatured(featured);
    }

    // Grid — остальные новости
    const gridEl = document.getElementById('newsGrid');
    if (gridEl && news.length > 1) {
      gridEl.innerHTML = news.slice(1).map(renderCard).join('');
    }

    // На главной — последние 3
    const homeGrid = document.getElementById('homeNewsGrid');
    if (homeGrid) {
      homeGrid.innerHTML = news.slice(0, 3).map(renderHomeCard).join('');
      // Re-init GSAP animations for new cards
      if (typeof animateCards === 'function') animateCards('.news-card');
    }

    lucide.createIcons();
  } catch (e) {
    // API недоступен — оставляем статический контент
  }
}

function renderFeatured(item) {
  const cover = item.cover ? 'uploads/' + item.cover : 'img/about-hero.png';
  return `
    <a href="article-dynamic.html?id=${item.id}" class="news-featured">
      <div class="news-featured-img"><img src="${cover}" alt=""></div>
      <div class="news-featured-content">
        <div class="news-featured-meta">
          ${item.tag ? `<span class="news-tag">${item.tag}</span>` : ''}
          <span class="news-date-label">${item.date_display || item.date}</span>
        </div>
        <h2 class="news-featured-title">${item.title}</h2>
        <p class="news-featured-desc">${item.description || ''}</p>
        <span class="news-read-more">Читать далее <i data-lucide="arrow-right"></i></span>
      </div>
    </a>`;
}

function renderCard(item) {
  const cover = item.cover ? 'uploads/' + item.cover : 'img/solution-sim.png';
  return `
    <a href="article-dynamic.html?id=${item.id}" class="news-card">
      <div class="news-img"><img src="${cover}" alt=""></div>
      <div class="news-body">
        <div class="news-card-meta">
          ${item.tag ? `<span class="news-tag news-tag--sm">${item.tag}</span>` : ''}
          <span class="news-date">${item.date_display || item.date}</span>
        </div>
        <h3 class="news-title">${item.title}</h3>
        <p class="news-desc">${item.description || ''}</p>
        <span class="news-read-more">Читать далее <i data-lucide="arrow-right"></i></span>
      </div>
    </a>`;
}

function renderHomeCard(item) {
  const cover = item.cover ? 'uploads/' + item.cover : 'img/solution-sim.png';
  return `
    <a href="article-dynamic.html?id=${item.id}" class="news-card">
      <div class="news-img"><img src="${cover}" alt=""></div>
      <div class="news-body">
        <span class="news-date">${item.date_display || item.date}</span>
        <h3 class="news-title">${item.title}</h3>
        <p class="news-desc">${item.description || ''}</p>
      </div>
    </a>`;
}

document.addEventListener('DOMContentLoaded', loadNews);
