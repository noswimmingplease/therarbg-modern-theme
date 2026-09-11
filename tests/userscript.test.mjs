import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';

const sourceUrl = new URL('../therarbg-modern-theme.user.js', import.meta.url);
const source = await readFile(sourceUrl, 'utf8');

function metadataValues(name) {
  const escapedName = name.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  return [...source.matchAll(new RegExp(`^// @${escapedName}\\s+(.+)$`, 'gm'))].map(
    ([, value]) => value.trim(),
  );
}

test('userscript metadata is safe and release-ready', () => {
  assert.deepEqual(metadataValues('name'), ['TheRARBG Tampermonkey Theme']);
  assert.deepEqual(metadataValues('version'), ['0.2.3']);
  assert.deepEqual(metadataValues('grant'), ['none']);
  assert.deepEqual(metadataValues('match'), [
    'https://therarbg.com/',
    'https://therarbg.com/get-posts*',
    'https://therarbg.com/trending*',
    'https://therarbg.com/main-page-list*',
    'https://therarbg.com/hot-pick-post/*',
    'https://therarbg.com/top-ten-post/*',
    'https://therarbg.com/latest-trailer*',
    'https://therarbg.com/box-office*',
    'https://therarbg.com/catalog*',
    'https://therarbg.com/post-detail/*',
  ]);
  assert.deepEqual(metadataValues('require'), []);
  assert.deepEqual(metadataValues('connect'), []);

  const expectedSourceUrl =
    'https://raw.githubusercontent.com/noswimmingplease/therarbg-modern-theme/main/therarbg-modern-theme.user.js';
  assert.deepEqual(metadataValues('updateURL'), [expectedSourceUrl]);
  assert.deepEqual(metadataValues('downloadURL'), [expectedSourceUrl]);
});

test('userscript remains presentation-only', () => {
  const disallowedCapabilities = [
    /\bfetch\s*\(/,
    /\bXMLHttpRequest\b/,
    /\bWebSocket\b/,
    /\bunsafeWindow\b/,
    /\bGM_[A-Za-z0-9_]+\b/,
    /\beval\s*\(/,
    /\bnew\s+Function\s*\(/,
  ];

  for (const pattern of disallowedCapabilities) {
    assert.doesNotMatch(source, pattern);
  }
});

test('all palette choices are unique and have CSS definitions', () => {
  const optionsBlock = source.match(/const PALETTE_OPTIONS = \[([\s\S]*?)\n  \];/);
  assert.ok(optionsBlock, 'PALETTE_OPTIONS was not found');

  const options = [...optionsBlock[1].matchAll(/\['([^']+)',\s*'([^']+)'\]/g)].map(
    ([, value, label]) => ({ value, label }),
  );
  assert.equal(options.length, 12);
  assert.equal(new Set(options.map(({ value }) => value)).size, options.length);
  assert.equal(new Set(options.map(({ label }) => label)).size, options.length);

  for (const { value } of options) {
    if (value === 'midnight') continue;
    assert.match(source, new RegExp(`data-tm-rarbg-palette="${value}"`));
  }
});

test('every referenced theme variable is declared', () => {
  const declarations = new Set([...source.matchAll(/(--tm-[a-z0-9-]+)\s*:/g)].map(([, name]) => name));
  const references = new Set([...source.matchAll(/var\((--tm-[a-z0-9-]+)\)/g)].map(([, name]) => name));

  assert.ok(declarations.size > 30, 'Unexpectedly few theme variables were found');
  assert.deepEqual([...references].filter((name) => !declarations.has(name)), []);
});

test('homepage categories use the intended dashboard order', () => {
  const layoutBlock = source.match(/const HOME_SECTION_LAYOUT = \[([\s\S]*?)\n  \];/);
  assert.ok(layoutBlock, 'HOME_SECTION_LAYOUT was not found');

  const selectors = [...layoutBlock[1].matchAll(/\['([^']+)',\s*'[^']+',\s*'[^']+'\]/g)].map(
    ([, selector]) => selector,
  );

  assert.deepEqual(selectors, [
    '.isMovies',
    '.isDocumentaries',
    '.isTV',
    '.isAnime',
    '.isGames',
    '.isApps',
    '.isMusic',
    '.isBooks',
    '.isXXX',
  ]);
  assert.match(source, /if \(name === 'xxx'\) element\.classList\.add\('tm-rarbg-home-category-wide'\)/);
});

test('selected homepage category headings use singular nouns', () => {
  for (const [selector, name, label] of [
    ['.isMovies', 'movies', 'Movie'],
    ['.isDocumentaries', 'documentaries', 'Documentary'],
    ['.isGames', 'games', 'Game'],
    ['.isApps', 'apps', 'App'],
    ['.isBooks', 'books', 'Book'],
  ]) {
    assert.match(source, new RegExp(`\\['${selector.replace('.', '\\.')}', '${name}', '${label}'\\]`));
  }
  assert.match(source, /heading\.textContent = `Top \$\{singularLabel\} Torrents`/);
});

test('trending routes receive get-posts results theming', () => {
  assert.match(source, /@match\s+https:\/\/therarbg\.com\/trending\*/);
  assert.match(source, /isTrendingPage;/);
  assert.match(source, /root\.classList\.toggle\(HOME_PAGE_CLASS, isHomePage \|\| isTopTenPage\)/);
  assert.match(
    source,
    /isTrendingPage \? 'table\.sortableTable, table\.dataTable' : 'table\.sortableTable2'/,
  );
  assert.match(source, /table\?\.closest\(isTrendingPage \? '\.row' : '\.row\.p-1'\)/);
  assert.doesNotMatch(source, /isTrendingDetailPage/);
});

test('compact main-page navigation receives isolated responsive theming', () => {
  assert.match(source, /@match\s+https:\/\/therarbg\.com\/main-page-list\*/);
  assert.match(source, /const isMainPageList = normalisedPath === '\/main-page-list'/);
  assert.match(source, /root\.classList\.toggle\(MAIN_PAGE_LIST_CLASS, isMainPageList\)/);
  assert.match(source, /function markMainPageList\(postContainer\)/);
  assert.match(source, /postContainer\.querySelector\('\.tileCont'\)\?\.classList\.add\('tm-rarbg-main-list-tiles'\)/);
  assert.match(
    source,
    /\.tm-rarbg-main-list-tiles \{[\s\S]*?grid-template-columns: repeat\(3, minmax\(0, 1fr\)\);/,
  );
  assert.match(source, /'\.postContUp, \.tm-rarbg-main-list-header'/);
  assert.match(
    source,
    /querySelector\('\.tile a\[href="\/get-posts\/user:ORARBG\/"\]'\)[\s\S]*?\.remove\(\)/,
  );
});

test('movie and TV catalogue listings use contained responsive result cards', () => {
  assert.match(source, /normalisedPath === '\/catalog\/movie'/);
  assert.match(source, /normalisedPath\.startsWith\('\/catalog\/tv\/'\)/);
  assert.match(source, /root\.classList\.toggle\(CATALOG_LIST_PAGE_CLASS, isCatalogListPage\)/);
  assert.match(source, /function markCatalogListPage\(postContainer\)/);
  assert.match(source, /row\.classList\.add\('tm-rarbg-catalog-result'\)/);
  assert.match(
    source,
    /\.tm-rarbg-catalog-result \{[\s\S]*?grid-template-columns: minmax\(150px, 190px\) minmax\(0, 1fr\);/,
  );
  assert.match(
    source,
    /\.tm-rarbg-catalog-result table\.table \{[\s\S]*?min-width: 720px;/,
  );
  assert.match(
    source,
    /a\.btn-primary\.buttonalink \{[\s\S]*?color: var\(--tm-text-on-accent\) !important;[\s\S]*?font-weight: 700;/,
  );
  for (const [sourceLabel, displayLabel] of [
    ['game-show', 'Game Show'],
    ['reality-tv', 'Reality TV'],
    ['sci-fi', 'Sci-Fi'],
    ['talk-show', 'Talk Show'],
    ['film-noir', 'Film Noir'],
  ]) {
    assert.match(source, new RegExp(`'${sourceLabel}': '${displayLabel}'`));
  }
  assert.match(source, /\.replace\(\/\-\/g, ' '\)/);
  assert.match(source, /const activeCatalogKind = normalisedPath\.startsWith\('\/catalog\/tv'\) \? 'tv' : 'movie'/);
  assert.match(source, /link\.classList\.toggle\('tm-rarbg-catalog-kind-active', isActive\)/);
  assert.match(source, /if \(isActive\) link\.setAttribute\('aria-current', 'page'\)/);
  assert.match(
    source,
    /\.tm-rarbg-catalog-kind-active,[\s\S]*?box-shadow: inset 0 -3px 0 var\(--tm-focus\), 0 0 0 2px var\(--tm-accent-soft\) !important;/,
  );
});

test('feature listing routes share themed poster cards and video modals', () => {
  for (const route of ['hot-pick-post/\\*', 'latest-trailer\\*', 'box-office\\*']) {
    assert.match(source, new RegExp(`@match\\s+https:\\/\\/therarbg\\.com\\/${route}`));
  }
  assert.match(source, /root\.classList\.toggle\(FEATURE_LIST_PAGE_CLASS, isFeatureListPage\)/);
  assert.match(source, /function markFeatureListPage\(postContainer\)/);
  assert.match(source, /card\.classList\.add\('tm-rarbg-feature-card'\)/);
  assert.match(
    source,
    /\.tm-rarbg-feature-card \{[\s\S]*?background: var\(--tm-panel-raised\) !important;/,
  );
  assert.match(source, /\.\$\{FEATURE_LIST_PAGE_CLASS\} \.modal-content \{/);
});

test('top-ten routes reuse the responsive homepage dashboard', () => {
  assert.match(source, /@match\s+https:\/\/therarbg\.com\/top-ten-post\/\*/);
  assert.match(source, /root\.classList\.toggle\(HOME_PAGE_CLASS, isHomePage \|\| isTopTenPage\)/);
  assert.match(source, /const isToolbarPage = isHomePage \|\| isResultsPage \|\| isTopTenPage/);
  assert.match(source, /if \(postContainer && \(isHomePage \|\| isTopTenPage\)\)/);
});

test('results tables have consistent container padding', () => {
  assert.match(
    source,
    /\.tm-rarbg-results-row \{[\s\S]*?box-sizing: border-box;[\s\S]*?padding: 12px !important;[\s\S]*?background: var\(--tm-panel\);/,
  );
  assert.match(
    source,
    /\.tm-rarbg-results-row > \.dataTables_wrapper \{[\s\S]*?box-sizing: border-box;[\s\S]*?padding: 12px !important;/,
  );
});

test('pagination styling is consistent across every themed page', () => {
  assert.match(
    source,
    /html\.\$\{ROOT_CLASS\} \.pagination \{[\s\S]*?display: flex !important;[\s\S]*?padding: 0 0 16px !important;[\s\S]*?gap: 6px;/,
  );
  assert.match(
    source,
    /html\.\$\{ROOT_CLASS\} \.pagination \.page-item > \.page-link,[\s\S]*?border-radius: 8px !important;/,
  );
  assert.match(
    source,
    /html\.\$\{ROOT_CLASS\} \.pagination \.page-item\.active > \.page-link,[\s\S]*?background: var\(--tm-accent-strong\) !important;/,
  );
  assert.match(source, /function markPagination\(container\)/);
  assert.match(source, /markPagination\(document\)/);
});

test('results metadata columns are centred while File remains left-aligned', () => {
  assert.match(
    source,
    /\.tm-rarbg-results-row table th:nth-child\(1\),[\s\S]*?\.tm-rarbg-results-row table th:nth-child\(8\) \{[\s\S]*?padding: 12px 16px !important;[\s\S]*?text-align: center !important;/,
  );
  assert.match(
    source,
    /\.tm-rarbg-results-row table td:nth-child\(1\),[\s\S]*?\.tm-rarbg-results-row table td:nth-child\(8\) \{\s*text-align: center !important;/,
  );
});

test('paired homepage cards stretch to equal row heights', () => {
  assert.match(
    source,
    /\.tm-rarbg-home-grid \{[\s\S]*?align-items: stretch;/,
  );
  assert.match(
    source,
    /\.tm-rarbg-home-category \{[\s\S]*?display: flex;[\s\S]*?height: 100%;[\s\S]*?flex-direction: column;/,
  );
  assert.match(
    source,
    /\.tm-rarbg-home-actions \{[\s\S]*?grid-template-columns: repeat\(3, minmax\(0, 1fr\)\);[\s\S]*?margin-top: auto;/,
  );
});

test('homepage dashboard adapts to constrained windows', () => {
  assert.match(source, /container-name: rarbg-home;/);
  assert.match(source, /@container rarbg-home \(max-width: 1500px\)/);
  assert.match(source, /@media \(max-width: 1699\.98px\)/);
  assert.match(
    source,
    /@media \(max-width: 1100px\) \{[\s\S]*?\.leftNav \{\s*display: none !important;/,
  );
  assert.match(
    source,
    /@media \(max-width: 575\.98px\) \{[\s\S]*?\.tm-rarbg-home-actions \{\s*grid-template-columns: minmax\(0, 1fr\);/,
  );
  assert.match(
    source,
    /@media \(max-width: 575\.98px\) \{[\s\S]*?table\.dataTable \{\s*table-layout: fixed !important;/,
  );
  assert.match(source, /classList\.add\('tm-rarbg-home-actions'\)/);
  assert.match(
    source,
    /\.tm-rarbg-home-actions \.btn-small \{[\s\S]*?width: 100%;[\s\S]*?height: 100%;/,
  );
  assert.match(
    source,
    /@media \(max-width: 991\.98px\) \{[\s\S]*?\.tm-rarbg-home-category:not\(\.tm-rarbg-home-category-wide\)[\s\S]*?table\.dataTable \{\s*min-width: 0;/,
  );
});

test('search controls use available width and expose clear states', () => {
  assert.match(
    source,
    /\.tm-rarbg-search-section \{[\s\S]*?display: grid !important;[\s\S]*?grid-template-columns: minmax\(0, 1fr\) auto;/,
  );
  assert.match(
    source,
    /\.searchSec \{[\s\S]*?width: 100% !important;[\s\S]*?max-width: none !important;/,
  );
  assert.match(source, /\.tm-rarbg-adult-control/);
  assert.match(source, /adultToggle\?\.setAttribute\('aria-label', 'Show XXX content'\)/);
  assert.match(source, /isOpen \? 'Hide thumbnails' : 'Show thumbnails'/);
  assert.match(
    source,
    /#filterOption \{[\s\S]*?width: 100% !important;[\s\S]*?max-width: none !important;[\s\S]*?grid-template-columns: repeat\(4, minmax\(0, 1fr\)\) !important;/,
  );
  assert.match(source, /#filterOption > div:nth-last-child\(-n \+ 2\) \{\s*grid-column: span 2;/);
  assert.match(source, /container-name: rarbg-search;/);
  assert.match(source, /@container rarbg-search \(min-width: 1400px\)/);
  assert.match(source, /@container rarbg-search \(max-width: 700px\)/);
  assert.match(source, /@container rarbg-search \(max-width: 360px\)/);
  assert.match(source, /display: contents !important;/);
  assert.match(source, /isOpen \? 'Hide filters' : 'Filters'/);
  assert.match(source, /resetButton\.textContent = 'Clear filters'/);
  assert.match(
    source,
    /#form_search > div:last-of-type \{[\s\S]*?display: none !important;/,
  );
  assert.match(
    source,
    /#form_search:has\(#filterBtn\.open\) > div:last-of-type \{\s*display: flex !important;/,
  );
  assert.match(source, /searchInput\.setAttribute\('aria-label', 'Search by title or IMDb ID'\)/);
  assert.match(source, /#filterOption > div:nth-child\(-n \+ 8\):has\(input:checked\)/);
});

test('type indicator columns remain visible and are labelled clearly', () => {
  assert.doesNotMatch(source, /tm-rarbg-hide-type-column/);
  assert.doesNotMatch(source, /hideTypeIndicatorColumns/);
  assert.match(source, /C: 'Type'/);
  assert.match(source, /heading\.setAttribute\('aria-label', 'Torrent type'\)/);
  assert.match(source, /labelTableColumns\(document\)/);
});

test('literal down arrows are removed while DataTables sorting indicators retain spacing', () => {
  assert.match(source, /'S\.': 'SE\.'/);
  assert.match(source, /'L\.': 'LE\.'/);
  assert.match(source, /originalLabel\.replace\(\/\^↓\\s\*\/, ''\)/);
  assert.match(source, /if \(label !== originalLabel\) heading\.textContent = label/);
  assert.match(source, /hideKnownClickCatchers\(\);\s*labelTableColumns\(document\);/);
  assert.match(
    source,
    /table\.dataTable thead > tr > th\.sorting_desc \{[\s\S]*?padding-right: 30px !important;/,
  );
  assert.match(
    source,
    /table\.dataTable thead > tr > th\.sorting_desc::after \{[\s\S]*?right: 8px !important;/,
  );
  assert.match(
    source,
    /table thead th a > i\.fa-arrow-down \{\s*display: none !important;/,
  );
});

test('sortable table headings reserve padding for labels and sort controls', () => {
  assert.match(
    source,
    /table\.sortableTable thead th,[\s\S]*?table\.sortableTable2 thead th,[\s\S]*?table\.dataTable thead th \{[\s\S]*?padding: 12px 24px 12px 12px !important;/,
  );
});

test('homepage tables have equal visible padding around the DataTables wrapper', () => {
  assert.match(
    source,
    /\.tm-rarbg-home-category \.dataTables_wrapper \{[\s\S]*?padding: 12px !important;[\s\S]*?background: var\(--tm-table\);/,
  );
});

test('homepage tables omit their redundant category column', () => {
  assert.match(
    source,
    /\.tm-rarbg-home-category table th:nth-child\(3\),[\s\S]*?\.tm-rarbg-home-category table td:nth-child\(3\) \{\s*display: none !important;/,
  );
});

test('hover previews render above sticky table headers without clipping', () => {
  assert.match(
    source,
    /\.tm-rarbg-home-category \.dataTables_wrapper \{[\s\S]*?overflow: visible !important;/,
  );
  assert.match(
    source,
    /table\.dataTable tbody tr:hover \{[\s\S]*?position: relative;[\s\S]*?z-index: 50;/,
  );
  assert.match(
    source,
    /table\.dataTable \.wrapper:hover \.tooltip \{[\s\S]*?z-index: 80 !important;/,
  );
});

test('dashboard filenames stay on one line with ellipsis without clipping previews', () => {
  assert.match(
    source,
    /td\.cellName \.wrapper \{[\s\S]*?display: flex;[\s\S]*?overflow: visible;[\s\S]*?white-space: nowrap;/,
  );
  assert.match(
    source,
    /\.wrapper\s*> a:first-child \{[\s\S]*?overflow: hidden;[\s\S]*?text-overflow: ellipsis;[\s\S]*?white-space: nowrap;/,
  );
});

test('dashboard tables stay inside their cards while File uses remaining width', () => {
  assert.match(
    source,
    /\.tm-rarbg-home-category table\.dataTable \{[\s\S]*?max-width: 100% !important;[\s\S]*?min-width: 0 !important;[\s\S]*?table-layout: fixed !important;/,
  );
  assert.match(
    source,
    /table th:nth-child\(2\),[\s\S]*?table td:nth-child\(2\) \{\s*width: auto !important;/,
  );
  assert.match(
    source,
    /\.tm-rarbg-home-category \.dataTables_wrapper \{[\s\S]*?max-width: 100%;/,
  );
});

test('dashboard metadata columns are centred without shifting sort labels', () => {
  assert.match(
    source,
    /table th:nth-child\(1\),[\s\S]*?table th:nth-child\(8\) \{[\s\S]*?padding: 12px 16px !important;[\s\S]*?text-align: center !important;/,
  );
  assert.match(
    source,
    /table td:nth-child\(1\),[\s\S]*?table td:nth-child\(8\) \{\s*text-align: center !important;/,
  );
});

test('all Time columns use compact time-unit abbreviations', () => {
  assert.match(source, /function abbreviateTableTimes\(container\)/);
  assert.match(source, /container\.querySelectorAll\('table'\)/);
  assert.match(source, /\^\(\?:time\|time since\)\$\/i/);
  for (const [unit, label] of [
    ['minute', 'm'],
    ['minutes', 'm'],
    ['hour', 'hr'],
    ['hours', 'hrs'],
    ['day', 'd'],
    ['days', 'd'],
    ['week', 'wk'],
    ['weeks', 'wks'],
    ['month', 'mo'],
    ['months', 'mos'],
    ['year', 'yr'],
    ['years', 'yrs'],
  ]) {
    assert.match(source, new RegExp(`${unit}: '${label}'`));
  }
  assert.match(source, /abbreviateTableTimes\(document\)/);
});

test('adult-content visibility is synchronised with the XXX search filter', () => {
  assert.match(source, /const adultFilterCheckbox = postContainer\.querySelector\('#radXXX'\)/);
  assert.match(source, /adultFilter\.hidden = !isAdultContentVisible/);
  assert.match(source, /adultFilterCheckbox\.disabled = !isAdultContentVisible/);
  assert.match(source, /adultFilterCheckbox\.checked = false/);
  assert.match(source, /savedFilters\.xxx = 'false'/);
  assert.match(source, /adultToggle\.addEventListener\('change', synchroniseAdultFilter\)/);
  assert.match(source, /\.tm-rarbg-adult-filter\[hidden\] \{\s*display: none !important;/);
});

test('showing thumbnails refreshes a carousel initialised while hidden', () => {
  assert.match(source, /#mySlides1\.slick-initialized/);
  assert.match(source, /carousel\.slick\('setPosition'\)/);
  assert.match(source, /if \(isOpen\) refreshThumbnailCarousel\(\)/);
});

test('homepage category cards omit redundant ten-row table searches', () => {
  assert.match(
    source,
    /\.tm-rarbg-home-category \.dataTables_filter \{\s*display: none !important;/,
  );
});

test('homepage category cards omit redundant ten-row table counts', () => {
  assert.match(
    source,
    /\.tm-rarbg-home-category \.dataTables_info \{\s*display: none !important;/,
  );
});

test('footer uses a borderless desktop row with a narrow-screen fallback', () => {
  assert.match(source, /function markFooter\(\)/);
  assert.match(source, /footer\.classList\.remove\('row', 'align-center'\)/);
  assert.match(source, /footer\.classList\.add\('tm-rarbg-footer'\)/);
  assert.match(source, /\.tm-rarbg-footer \{[\s\S]*?display: flex !important;[\s\S]*?flex-wrap: nowrap;[\s\S]*?border: 0 !important/);
  assert.match(source, /\.tm-rarbg-footer-donation \{[\s\S]*?flex: 1 1 auto/);
  assert.match(source, /\.tm-rarbg-footer-copyright \{[\s\S]*?margin-left: auto !important;[\s\S]*?text-align: right !important/);
  assert.match(
    source,
    /@media \(max-width: 1099\.98px\) \{[\s\S]*?\.tm-rarbg-footer \{[\s\S]*?flex-direction: column/,
  );
  assert.match(source, /\n    markFooter\(\);\n/);
});

test('torrent-detail pages use isolated responsive theming', () => {
  assert.match(source, /const POST_DETAIL_PAGE_CLASS = 'tm-rarbg-post-detail-page'/);
  assert.match(
    source,
    /normalisedPath === '\/post-detail' \|\| normalisedPath\.startsWith\('\/post-detail\/'\)/,
  );
  assert.match(source, /root\.classList\.toggle\(POST_DETAIL_PAGE_CLASS, isPostDetailPage\)/);
  assert.match(source, /function markPostDetailPage\(postContainer\)/);
  assert.match(source, /detailTable\.classList\.add\('tm-rarbg-detail-table'\)/);
  assert.match(source, /\.tm-rarbg-detail-row-description/);
  assert.match(source, /\.similar-posts-container[\s\S]*?table\.sortableTable2/);
  assert.match(source, /\.tm-rarbg-detail-row-trackers[\s\S]*?--bs-table-accent-bg: transparent/);
  assert.match(source, /\.tm-rarbg-detail-row-trackers[\s\S]*?tbody \{[\s\S]*?background: var\(--tm-table\) !important/);
  assert.match(source, /\.tm-rarbg-detail-table \.text-muted/);
  assert.match(source, /\.comment-section \.text-muted/);
  assert.match(source, /\.comment-form \.comment-btn \{[\s\S]*?margin-top: 10px !important/);
  assert.match(source, /\.tm-rarbg-detail-back-row \{[\s\S]*?padding: 18px 0 12px !important/);
  assert.match(source, /classList\.add\('tm-rarbg-detail-back-row'\)/);
  assert.match(source, /\.modal-dialog table\.table \{/);
  assert.match(source, /\.vote-button\.active\.upvote/);
  assert.match(source, /\.comment-btn:disabled/);
  assert.match(source, /\.comment-thread\.depth-1/);
  assert.doesNotMatch(source, /\.comment-thread\[class\*="depth-"\]/);
  assert.match(source, /if \(postContainer && isPostDetailPage\) markPostDetailPage\(postContainer\)/);
});
