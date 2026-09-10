// ==UserScript==
// @name         TheRARBG Tampermonkey Theme
// @namespace    local.therarbg.theme
// @version      0.2.2
// @description  A cleaner, page-aware dark theme for TheRARBG.
// @author       Citizen
// @homepageURL  https://github.com/Ci303/therarbg-modern-theme
// @supportURL   https://github.com/Ci303/therarbg-modern-theme/issues
// @updateURL    https://raw.githubusercontent.com/Ci303/therarbg-modern-theme/main/therarbg-modern-theme.user.js
// @downloadURL  https://raw.githubusercontent.com/Ci303/therarbg-modern-theme/main/therarbg-modern-theme.user.js
// @match        https://therarbg.com/
// @match        https://therarbg.com/get-posts*
// @match        https://therarbg.com/trending*
// @match        https://therarbg.com/main-page-list*
// @match        https://therarbg.com/hot-pick-post/*
// @match        https://therarbg.com/top-ten-post/*
// @match        https://therarbg.com/latest-trailer*
// @match        https://therarbg.com/box-office*
// @match        https://therarbg.com/catalog*
// @match        https://therarbg.com/post-detail/*
// @run-at       document-start
// @grant        none
// @noframes
// ==/UserScript==

(function () {
  'use strict';

  const ROOT_CLASS = 'tm-rarbg-theme';
  const SHOW_EXTRAS_CLASS = 'tm-rarbg-show-extras';
  const CATEGORY_PAGE_CLASS = 'tm-rarbg-category-page';
  const HOME_PAGE_CLASS = 'tm-rarbg-home-page';
  const MAIN_PAGE_LIST_CLASS = 'tm-rarbg-main-page-list';
  const FEATURE_LIST_PAGE_CLASS = 'tm-rarbg-feature-list-page';
  const CATALOG_LIST_PAGE_CLASS = 'tm-rarbg-catalog-list-page';
  const POST_DETAIL_PAGE_CLASS = 'tm-rarbg-post-detail-page';
  const EXTRAS_STORAGE_KEY = 'tmRarbgShowExtras';
  const PALETTE_STORAGE_KEY = 'tmRarbgPalette';
  const DEFAULT_PALETTE = 'midnight';
  const PALETTE_OPTIONS = [
    ['midnight', 'Midnight'],
    ['black', 'Black'],
    ['slate', 'Slate'],
    ['blue', 'Blue'],
    ['teal', 'Teal'],
    ['emerald', 'Emerald'],
    ['olive', 'Olive'],
    ['amber', 'Amber'],
    ['crimson', 'Crimson'],
    ['magenta', 'Magenta'],
    ['purple', 'Purple'],
    ['espresso', 'Espresso'],
  ];
  const PALETTES = new Set(PALETTE_OPTIONS.map(([value]) => value));

  const root = document.documentElement;
  const normalisedPath = location.pathname.replace(/\/+$/, '') || '/';
  const isHomePage = normalisedPath === '/';
  const isTrendingPage =
    normalisedPath === '/trending' || normalisedPath.startsWith('/trending/');
  const isResultsPage =
    normalisedPath === '/get-posts' ||
    normalisedPath.startsWith('/get-posts/') ||
    isTrendingPage;
  const isCatalogPage = normalisedPath === '/catalog';
  const isCatalogListPage =
    normalisedPath === '/catalog/movie' ||
    normalisedPath.startsWith('/catalog/movie/') ||
    normalisedPath === '/catalog/tv' ||
    normalisedPath.startsWith('/catalog/tv/');
  const isMainPageList = normalisedPath === '/main-page-list';
  const isTopTenPage =
    normalisedPath === '/top-ten-post' || normalisedPath.startsWith('/top-ten-post/');
  const isFeatureListPage =
    normalisedPath === '/hot-pick-post' ||
    normalisedPath.startsWith('/hot-pick-post/') ||
    normalisedPath === '/latest-trailer' ||
    normalisedPath === '/box-office';
  const isPostDetailPage =
    normalisedPath === '/post-detail' || normalisedPath.startsWith('/post-detail/');
  const isToolbarPage = isHomePage || isResultsPage || isTopTenPage;

  root.classList.add(ROOT_CLASS);
  root.classList.toggle(HOME_PAGE_CLASS, isHomePage || isTopTenPage);
  root.classList.toggle(MAIN_PAGE_LIST_CLASS, isMainPageList);
  root.classList.toggle(FEATURE_LIST_PAGE_CLASS, isFeatureListPage);
  root.classList.toggle(CATALOG_LIST_PAGE_CLASS, isCatalogListPage);
  root.classList.toggle(POST_DETAIL_PAGE_CLASS, isPostDetailPage);

  function normalisePalette(value) {
    return PALETTES.has(value) ? value : DEFAULT_PALETTE;
  }

  function readPalette() {
    try {
      return normalisePalette(localStorage.getItem(PALETTE_STORAGE_KEY));
    } catch {
      return DEFAULT_PALETTE;
    }
  }

  function applyPalette(value, persist = false) {
    const palette = normalisePalette(value);
    root.dataset.tmRarbgPalette = palette;

    if (persist) {
      try {
        localStorage.setItem(PALETTE_STORAGE_KEY, palette);
      } catch {
        // The selected palette still applies for this page when storage is unavailable.
      }
    }

    return palette;
  }

  const initialPalette = applyPalette(readPalette());

  try {
    root.classList.toggle(
      SHOW_EXTRAS_CLASS,
      localStorage.getItem(EXTRAS_STORAGE_KEY) === 'true',
    );
  } catch {
    // Storage can be unavailable in restrictive browsing modes. The theme
    // still works; the extras preference simply will not persist.
  }

  const styles = `
    :root {
      color-scheme: dark;
      --tm-bg: #070b14;
      --tm-panel: #101827;
      --tm-panel-raised: #151f32;
      --tm-panel-soft: #19253a;
      --tm-panel-glass: rgba(16, 24, 39, 0.9);
      --tm-panel-glass-strong: rgba(16, 24, 39, 0.94);
      --tm-input: #0b1220;
      --tm-control: #1c2a43;
      --tm-control-hover: #1b2941;
      --tm-filter: #111b2c;
      --tm-filter-hover: #18253a;
      --tm-table: #0c1422;
      --tm-table-head: #1b2b48;
      --tm-row: #0e1726;
      --tm-row-alt: #111c2d;
      --tm-row-hover: #182742;
      --tm-border: #293852;
      --tm-border-strong: #3b4e70;
      --tm-cell-border: rgba(41, 56, 82, 0.48);
      --tm-cell-border-strong: rgba(41, 56, 82, 0.62);
      --tm-text: #e8eef8;
      --tm-text-soft: #c4cee0;
      --tm-text-subtle: #cbd5e7;
      --tm-text-link: #b8ccff;
      --tm-text-link-hover: #e0e8ff;
      --tm-text-on-accent: #fff;
      --tm-muted: #95a4ba;
      --tm-placeholder: #7888a1;
      --tm-accent: #648dff;
      --tm-accent-strong: #3f6fe8;
      --tm-accent-soft: rgba(100, 141, 255, 0.14);
      --tm-accent-border: rgba(100, 141, 255, 0.7);
      --tm-accent-border-soft: rgba(100, 141, 255, 0.32);
      --tm-focus: #9bb6ff;
      --tm-scrollbar: #405274;
      --tm-selection: rgba(100, 141, 255, 0.55);
      --tm-overlay: rgba(9, 15, 27, 0.55);
      --tm-page-background:
        radial-gradient(circle at 18% 0%, rgba(69, 103, 181, 0.24), transparent 36%),
        radial-gradient(circle at 88% 12%, rgba(89, 63, 155, 0.16), transparent 32%),
        linear-gradient(180deg, #0b1120 0%, var(--tm-bg) 48%, #05080e 100%);
      --tm-toolbar-background:
        linear-gradient(110deg, rgba(55, 89, 170, 0.26), var(--tm-panel-glass-strong) 54%),
        var(--tm-panel-raised);
      --tm-primary-background: linear-gradient(135deg, #315fc9, var(--tm-accent-strong));
      --tm-primary-background-hover: linear-gradient(135deg, #3d6bd5, #456bc6);
      --tm-logo-shadow: drop-shadow(0 5px 14px rgba(74, 112, 214, 0.35));
      --tm-success: #69d39b;
      --tm-warning: #f3c969;
      --tm-danger: #ff7c8b;
      --tm-shadow: 0 18px 55px rgba(0, 0, 0, 0.38);
    }

    html.${ROOT_CLASS}[data-tm-rarbg-palette="black"] {
      --tm-bg: #000204;
      --tm-panel: #0a0d12;
      --tm-panel-raised: #11161d;
      --tm-panel-soft: #181f28;
      --tm-panel-glass: rgba(10, 13, 18, 0.9);
      --tm-panel-glass-strong: rgba(10, 13, 18, 0.95);
      --tm-input: #06090d;
      --tm-control: #1a212b;
      --tm-control-hover: #242e3b;
      --tm-filter: #11171f;
      --tm-filter-hover: #1d2733;
      --tm-table: #080c11;
      --tm-table-head: #1a222d;
      --tm-row: #0b1016;
      --tm-row-alt: #10161e;
      --tm-row-hover: #1b2632;
      --tm-border: #29323e;
      --tm-border-strong: #465364;
      --tm-cell-border: rgba(52, 64, 78, 0.48);
      --tm-cell-border-strong: rgba(52, 64, 78, 0.62);
      --tm-text: #eef2f7;
      --tm-text-soft: #cbd3de;
      --tm-text-subtle: #d4dae3;
      --tm-text-link: #bfd0ff;
      --tm-text-link-hover: #e2e9ff;
      --tm-muted: #9ba7b6;
      --tm-placeholder: #758191;
      --tm-accent: #88a8ff;
      --tm-accent-strong: #4264ad;
      --tm-accent-soft: rgba(136, 168, 255, 0.14);
      --tm-accent-border: rgba(136, 168, 255, 0.72);
      --tm-accent-border-soft: rgba(136, 168, 255, 0.3);
      --tm-focus: #aac0ff;
      --tm-scrollbar: #465364;
      --tm-selection: rgba(136, 168, 255, 0.5);
      --tm-overlay: rgba(3, 5, 8, 0.72);
      --tm-page-background:
        radial-gradient(circle at 18% 0%, rgba(72, 86, 108, 0.2), transparent 36%),
        radial-gradient(circle at 88% 12%, rgba(52, 60, 75, 0.15), transparent 32%),
        linear-gradient(180deg, #090c11 0%, var(--tm-bg) 52%, #000 100%);
      --tm-toolbar-background:
        linear-gradient(110deg, rgba(65, 78, 99, 0.28), var(--tm-panel-glass-strong) 58%),
        var(--tm-panel-raised);
      --tm-primary-background: linear-gradient(135deg, #4a68ba, var(--tm-accent-strong));
      --tm-primary-background-hover: linear-gradient(135deg, #4e68b5, #5673c0);
      --tm-logo-shadow: drop-shadow(0 5px 14px rgba(102, 126, 190, 0.3));
    }

    html.${ROOT_CLASS}[data-tm-rarbg-palette="blue"] {
      --tm-bg: #04101e;
      --tm-panel: #0a1a2d;
      --tm-panel-raised: #102640;
      --tm-panel-soft: #183352;
      --tm-panel-glass: rgba(10, 26, 45, 0.9);
      --tm-panel-glass-strong: rgba(10, 26, 45, 0.95);
      --tm-input: #061425;
      --tm-control: #18385d;
      --tm-control-hover: #214a75;
      --tm-filter: #102944;
      --tm-filter-hover: #1a3b60;
      --tm-table: #07182a;
      --tm-table-head: #173b62;
      --tm-row: #0a1b2f;
      --tm-row-alt: #0e233b;
      --tm-row-hover: #173b61;
      --tm-border: #294a6d;
      --tm-border-strong: #3e6d99;
      --tm-cell-border: rgba(41, 74, 109, 0.48);
      --tm-cell-border-strong: rgba(41, 74, 109, 0.62);
      --tm-text: #eaf4ff;
      --tm-text-soft: #c5d8eb;
      --tm-text-subtle: #cfdfef;
      --tm-text-link: #acd2ff;
      --tm-text-link-hover: #e0efff;
      --tm-muted: #9bb0c7;
      --tm-placeholder: #7890aa;
      --tm-accent: #58a6ff;
      --tm-accent-strong: #245f99;
      --tm-accent-soft: rgba(88, 166, 255, 0.14);
      --tm-accent-border: rgba(88, 166, 255, 0.72);
      --tm-accent-border-soft: rgba(88, 166, 255, 0.3);
      --tm-focus: #9dcbff;
      --tm-scrollbar: #3e6d99;
      --tm-selection: rgba(88, 166, 255, 0.5);
      --tm-overlay: rgba(3, 13, 25, 0.68);
      --tm-page-background:
        radial-gradient(circle at 18% 0%, rgba(41, 111, 186, 0.28), transparent 36%),
        radial-gradient(circle at 88% 12%, rgba(32, 83, 142, 0.2), transparent 32%),
        linear-gradient(180deg, #071a2d 0%, var(--tm-bg) 50%, #020a13 100%);
      --tm-toolbar-background:
        linear-gradient(110deg, rgba(38, 99, 164, 0.3), var(--tm-panel-glass-strong) 58%),
        var(--tm-panel-raised);
      --tm-primary-background: linear-gradient(135deg, #2469b8, var(--tm-accent-strong));
      --tm-primary-background-hover: linear-gradient(135deg, #2869a8, #2f73b5);
      --tm-logo-shadow: drop-shadow(0 5px 14px rgba(46, 124, 207, 0.35));
    }

    html.${ROOT_CLASS}[data-tm-rarbg-palette="purple"] {
      --tm-bg: #0b0612;
      --tm-panel: #180f23;
      --tm-panel-raised: #241633;
      --tm-panel-soft: #302040;
      --tm-panel-glass: rgba(24, 15, 35, 0.9);
      --tm-panel-glass-strong: rgba(24, 15, 35, 0.95);
      --tm-input: #10091a;
      --tm-control: #35204b;
      --tm-control-hover: #462961;
      --tm-filter: #251732;
      --tm-filter-hover: #382249;
      --tm-table: #120b1b;
      --tm-table-head: #3a2351;
      --tm-row: #160d20;
      --tm-row-alt: #1d1229;
      --tm-row-hover: #332044;
      --tm-border: #49335d;
      --tm-border-strong: #6c4d84;
      --tm-cell-border: rgba(73, 51, 93, 0.48);
      --tm-cell-border-strong: rgba(73, 51, 93, 0.62);
      --tm-text: #f3ecfa;
      --tm-text-soft: #dacde4;
      --tm-text-subtle: #e0d5e8;
      --tm-text-link: #d8bdff;
      --tm-text-link-hover: #f1e5ff;
      --tm-muted: #b2a0bf;
      --tm-placeholder: #8e789e;
      --tm-accent: #b184ff;
      --tm-accent-strong: #8a59dc;
      --tm-accent-soft: rgba(177, 132, 255, 0.14);
      --tm-accent-border: rgba(177, 132, 255, 0.72);
      --tm-accent-border-soft: rgba(177, 132, 255, 0.3);
      --tm-focus: #d0b1ff;
      --tm-scrollbar: #6c4d84;
      --tm-selection: rgba(177, 132, 255, 0.5);
      --tm-overlay: rgba(12, 5, 19, 0.7);
      --tm-page-background:
        radial-gradient(circle at 18% 0%, rgba(124, 73, 170, 0.28), transparent 36%),
        radial-gradient(circle at 88% 12%, rgba(78, 44, 112, 0.22), transparent 32%),
        linear-gradient(180deg, #180c24 0%, var(--tm-bg) 50%, #050208 100%);
      --tm-toolbar-background:
        linear-gradient(110deg, rgba(112, 66, 151, 0.32), var(--tm-panel-glass-strong) 58%),
        var(--tm-panel-raised);
      --tm-primary-background: linear-gradient(135deg, #7140b3, var(--tm-accent-strong));
      --tm-primary-background-hover: linear-gradient(135deg, #8650c7, #7e4cc0);
      --tm-logo-shadow: drop-shadow(0 5px 14px rgba(139, 87, 191, 0.35));
    }

    html.${ROOT_CLASS}[data-tm-rarbg-palette="slate"] {
      --tm-bg: #0b0f14;
      --tm-panel: #141a21;
      --tm-panel-raised: #1b232c;
      --tm-panel-soft: #242e39;
      --tm-panel-glass: rgba(20, 26, 33, 0.9);
      --tm-panel-glass-strong: rgba(20, 26, 33, 0.95);
      --tm-input: #0d1218;
      --tm-control: #26313d;
      --tm-control-hover: #303e4c;
      --tm-filter: #1a222b;
      --tm-filter-hover: #25313d;
      --tm-table: #10161c;
      --tm-table-head: #2a3744;
      --tm-row: #131a21;
      --tm-row-alt: #182129;
      --tm-row-hover: #263441;
      --tm-border: #354454;
      --tm-border-strong: #526579;
      --tm-cell-border: rgba(53, 68, 84, 0.48);
      --tm-cell-border-strong: rgba(53, 68, 84, 0.62);
      --tm-text: #edf1f5;
      --tm-text-soft: #cbd4dd;
      --tm-text-subtle: #d5dde5;
      --tm-text-link: #b8d3ee;
      --tm-text-link-hover: #e5f2ff;
      --tm-muted: #9facb9;
      --tm-placeholder: #7c8a98;
      --tm-accent: #7da8d1;
      --tm-accent-strong: #3d6388;
      --tm-accent-soft: rgba(125, 168, 209, 0.14);
      --tm-accent-border: rgba(125, 168, 209, 0.72);
      --tm-accent-border-soft: rgba(125, 168, 209, 0.3);
      --tm-focus: #aacbed;
      --tm-scrollbar: #526579;
      --tm-selection: rgba(125, 168, 209, 0.5);
      --tm-overlay: rgba(8, 12, 16, 0.68);
      --tm-page-background:
        radial-gradient(circle at 18% 0%, rgba(89, 112, 136, 0.24), transparent 36%),
        radial-gradient(circle at 88% 12%, rgba(60, 76, 93, 0.18), transparent 32%),
        linear-gradient(180deg, #111820 0%, var(--tm-bg) 52%, #06090c 100%);
      --tm-toolbar-background:
        linear-gradient(110deg, rgba(73, 95, 118, 0.28), var(--tm-panel-glass-strong) 58%),
        var(--tm-panel-raised);
      --tm-primary-background: linear-gradient(135deg, #345a7e, var(--tm-accent-strong));
      --tm-primary-background-hover: linear-gradient(135deg, #3a6084, #456b90);
      --tm-logo-shadow: drop-shadow(0 5px 14px rgba(94, 126, 156, 0.32));
    }

    html.${ROOT_CLASS}[data-tm-rarbg-palette="emerald"] {
      --tm-bg: #04110d;
      --tm-panel: #0b1d16;
      --tm-panel-raised: #10291f;
      --tm-panel-soft: #183629;
      --tm-panel-glass: rgba(11, 29, 22, 0.9);
      --tm-panel-glass-strong: rgba(11, 29, 22, 0.95);
      --tm-input: #061711;
      --tm-control: #183e2e;
      --tm-control-hover: #21523d;
      --tm-filter: #102d22;
      --tm-filter-hover: #1b4433;
      --tm-table: #071a13;
      --tm-table-head: #174b36;
      --tm-row: #0a1d16;
      --tm-row-alt: #0e271d;
      --tm-row-hover: #174531;
      --tm-border: #285944;
      --tm-border-strong: #3d7a5e;
      --tm-cell-border: rgba(40, 89, 68, 0.48);
      --tm-cell-border-strong: rgba(40, 89, 68, 0.62);
      --tm-text: #e9f7ef;
      --tm-text-soft: #c3ddcf;
      --tm-text-subtle: #cee7d8;
      --tm-text-link: #a9e7bd;
      --tm-text-link-hover: #ddf9e9;
      --tm-muted: #96b8a5;
      --tm-placeholder: #739680;
      --tm-accent: #49c979;
      --tm-accent-strong: #237044;
      --tm-accent-soft: rgba(73, 201, 121, 0.14);
      --tm-accent-border: rgba(73, 201, 121, 0.72);
      --tm-accent-border-soft: rgba(73, 201, 121, 0.3);
      --tm-focus: #9be2b5;
      --tm-scrollbar: #3d7a5e;
      --tm-selection: rgba(73, 201, 121, 0.5);
      --tm-overlay: rgba(2, 14, 10, 0.7);
      --tm-page-background:
        radial-gradient(circle at 18% 0%, rgba(38, 125, 79, 0.28), transparent 36%),
        radial-gradient(circle at 88% 12%, rgba(24, 88, 58, 0.2), transparent 32%),
        linear-gradient(180deg, #071c14 0%, var(--tm-bg) 52%, #010906 100%);
      --tm-toolbar-background:
        linear-gradient(110deg, rgba(35, 109, 72, 0.3), var(--tm-panel-glass-strong) 58%),
        var(--tm-panel-raised);
      --tm-primary-background: linear-gradient(135deg, #246b49, var(--tm-accent-strong));
      --tm-primary-background-hover: linear-gradient(135deg, #2c754f, #347e58);
      --tm-logo-shadow: drop-shadow(0 5px 14px rgba(54, 151, 93, 0.34));
    }

    html.${ROOT_CLASS}[data-tm-rarbg-palette="teal"] {
      --tm-bg: #031216;
      --tm-panel: #081f25;
      --tm-panel-raised: #0d2b33;
      --tm-panel-soft: #143943;
      --tm-panel-glass: rgba(8, 31, 37, 0.9);
      --tm-panel-glass-strong: rgba(8, 31, 37, 0.95);
      --tm-input: #05181d;
      --tm-control: #16414b;
      --tm-control-hover: #1c5562;
      --tm-filter: #0c3037;
      --tm-filter-hover: #164852;
      --tm-table: #061b20;
      --tm-table-head: #124d58;
      --tm-row: #082028;
      --tm-row-alt: #0c2931;
      --tm-row-hover: #134851;
      --tm-border: #235a65;
      --tm-border-strong: #397c89;
      --tm-cell-border: rgba(35, 90, 101, 0.48);
      --tm-cell-border-strong: rgba(35, 90, 101, 0.62);
      --tm-text: #e8f7f8;
      --tm-text-soft: #c0dadd;
      --tm-text-subtle: #cae4e6;
      --tm-text-link: #9de5eb;
      --tm-text-link-hover: #daf9fb;
      --tm-muted: #94b7ba;
      --tm-placeholder: #72969a;
      --tm-accent: #42cbd6;
      --tm-accent-strong: #166d78;
      --tm-accent-soft: rgba(66, 203, 214, 0.14);
      --tm-accent-border: rgba(66, 203, 214, 0.72);
      --tm-accent-border-soft: rgba(66, 203, 214, 0.3);
      --tm-focus: #91e7ed;
      --tm-scrollbar: #397c89;
      --tm-selection: rgba(66, 203, 214, 0.5);
      --tm-overlay: rgba(2, 14, 18, 0.7);
      --tm-page-background:
        radial-gradient(circle at 18% 0%, rgba(30, 126, 139, 0.3), transparent 36%),
        radial-gradient(circle at 88% 12%, rgba(18, 84, 96, 0.22), transparent 32%),
        linear-gradient(180deg, #061e24 0%, var(--tm-bg) 52%, #01090b 100%);
      --tm-toolbar-background:
        linear-gradient(110deg, rgba(27, 112, 124, 0.3), var(--tm-panel-glass-strong) 58%),
        var(--tm-panel-raised);
      --tm-primary-background: linear-gradient(135deg, #17646f, var(--tm-accent-strong));
      --tm-primary-background-hover: linear-gradient(135deg, #1b6d78, #227783);
      --tm-logo-shadow: drop-shadow(0 5px 14px rgba(42, 151, 164, 0.34));
    }

    html.${ROOT_CLASS}[data-tm-rarbg-palette="crimson"] {
      --tm-bg: #14070a;
      --tm-panel: #251014;
      --tm-panel-raised: #32171d;
      --tm-panel-soft: #422129;
      --tm-panel-glass: rgba(37, 16, 20, 0.9);
      --tm-panel-glass-strong: rgba(37, 16, 20, 0.95);
      --tm-input: #1a090d;
      --tm-control: #4b2029;
      --tm-control-hover: #612a36;
      --tm-filter: #35171e;
      --tm-filter-hover: #4c2029;
      --tm-table: #1d0b0f;
      --tm-table-head: #5b2430;
      --tm-row: #210d12;
      --tm-row-alt: #2a1117;
      --tm-row-hover: #4c1d27;
      --tm-border: #65313c;
      --tm-border-strong: #8a4958;
      --tm-cell-border: rgba(101, 49, 60, 0.48);
      --tm-cell-border-strong: rgba(101, 49, 60, 0.62);
      --tm-text: #fbecef;
      --tm-text-soft: #e5cbd1;
      --tm-text-subtle: #edd5da;
      --tm-text-link: #ffb7c5;
      --tm-text-link-hover: #ffe4e9;
      --tm-muted: #bca0a7;
      --tm-placeholder: #95747d;
      --tm-accent: #ff617b;
      --tm-accent-strong: #9c3047;
      --tm-accent-soft: rgba(255, 97, 123, 0.14);
      --tm-accent-border: rgba(255, 97, 123, 0.72);
      --tm-accent-border-soft: rgba(255, 97, 123, 0.3);
      --tm-focus: #ffadbc;
      --tm-scrollbar: #8a4958;
      --tm-selection: rgba(255, 97, 123, 0.5);
      --tm-overlay: rgba(18, 4, 7, 0.72);
      --tm-page-background:
        radial-gradient(circle at 18% 0%, rgba(150, 39, 63, 0.3), transparent 36%),
        radial-gradient(circle at 88% 12%, rgba(100, 28, 44, 0.22), transparent 32%),
        linear-gradient(180deg, #250b12 0%, var(--tm-bg) 52%, #0a0204 100%);
      --tm-toolbar-background:
        linear-gradient(110deg, rgba(133, 37, 57, 0.32), var(--tm-panel-glass-strong) 58%),
        var(--tm-panel-raised);
      --tm-primary-background: linear-gradient(135deg, #8a283d, var(--tm-accent-strong));
      --tm-primary-background-hover: linear-gradient(135deg, #983046, #a63850);
      --tm-logo-shadow: drop-shadow(0 5px 14px rgba(179, 53, 79, 0.34));
    }

    html.${ROOT_CLASS}[data-tm-rarbg-palette="amber"] {
      --tm-bg: #100d07;
      --tm-panel: #1e1a12;
      --tm-panel-raised: #292319;
      --tm-panel-soft: #352d21;
      --tm-panel-glass: rgba(30, 26, 18, 0.9);
      --tm-panel-glass-strong: rgba(30, 26, 18, 0.95);
      --tm-input: #151109;
      --tm-control: #413721;
      --tm-control-hover: #54462a;
      --tm-filter: #2d2618;
      --tm-filter-hover: #45391f;
      --tm-table: #18140c;
      --tm-table-head: #554522;
      --tm-row: #1b170e;
      --tm-row-alt: #231d12;
      --tm-row-hover: #46391f;
      --tm-border: #5e4d2d;
      --tm-border-strong: #80683b;
      --tm-cell-border: rgba(94, 77, 45, 0.48);
      --tm-cell-border-strong: rgba(94, 77, 45, 0.62);
      --tm-text: #f7f1e3;
      --tm-text-soft: #ddd2bc;
      --tm-text-subtle: #e7dcc6;
      --tm-text-link: #f0d49b;
      --tm-text-link-hover: #fff0ce;
      --tm-muted: #b9aa8d;
      --tm-placeholder: #8d7d61;
      --tm-accent: #e8ad3e;
      --tm-accent-strong: #805613;
      --tm-accent-soft: rgba(232, 173, 62, 0.14);
      --tm-accent-border: rgba(232, 173, 62, 0.72);
      --tm-accent-border-soft: rgba(232, 173, 62, 0.3);
      --tm-focus: #f5d182;
      --tm-scrollbar: #80683b;
      --tm-selection: rgba(232, 173, 62, 0.5);
      --tm-overlay: rgba(15, 11, 4, 0.72);
      --tm-page-background:
        radial-gradient(circle at 18% 0%, rgba(145, 99, 28, 0.28), transparent 36%),
        radial-gradient(circle at 88% 12%, rgba(94, 69, 25, 0.2), transparent 32%),
        linear-gradient(180deg, #201907 0%, var(--tm-bg) 52%, #070502 100%);
      --tm-toolbar-background:
        linear-gradient(110deg, rgba(124, 88, 28, 0.3), var(--tm-panel-glass-strong) 58%),
        var(--tm-panel-raised);
      --tm-primary-background: linear-gradient(135deg, #745014, var(--tm-accent-strong));
      --tm-primary-background-hover: linear-gradient(135deg, #805817, #8c621b);
      --tm-logo-shadow: drop-shadow(0 5px 14px rgba(172, 120, 34, 0.34));
    }

    html.${ROOT_CLASS}[data-tm-rarbg-palette="magenta"] {
      --tm-bg: #130714;
      --tm-panel: #251025;
      --tm-panel-raised: #331735;
      --tm-panel-soft: #432147;
      --tm-panel-glass: rgba(37, 16, 37, 0.9);
      --tm-panel-glass-strong: rgba(37, 16, 37, 0.95);
      --tm-input: #19091b;
      --tm-control: #4a204f;
      --tm-control-hover: #602965;
      --tm-filter: #351738;
      --tm-filter-hover: #4c2050;
      --tm-table: #1c0b1e;
      --tm-table-head: #5a2860;
      --tm-row: #200d22;
      --tm-row-alt: #29112c;
      --tm-row-hover: #4b2050;
      --tm-border: #613467;
      --tm-border-strong: #854b8c;
      --tm-cell-border: rgba(97, 52, 103, 0.48);
      --tm-cell-border-strong: rgba(97, 52, 103, 0.62);
      --tm-text: #faedf9;
      --tm-text-soft: #e2cde1;
      --tm-text-subtle: #ecd7ea;
      --tm-text-link: #f4b9f0;
      --tm-text-link-hover: #ffe5fc;
      --tm-muted: #bba1ba;
      --tm-placeholder: #917492;
      --tm-accent: #ec73e2;
      --tm-accent-strong: #8a3e87;
      --tm-accent-soft: rgba(236, 115, 226, 0.14);
      --tm-accent-border: rgba(236, 115, 226, 0.72);
      --tm-accent-border-soft: rgba(236, 115, 226, 0.3);
      --tm-focus: #f3aff0;
      --tm-scrollbar: #854b8c;
      --tm-selection: rgba(236, 115, 226, 0.5);
      --tm-overlay: rgba(17, 4, 18, 0.72);
      --tm-page-background:
        radial-gradient(circle at 18% 0%, rgba(139, 50, 137, 0.3), transparent 36%),
        radial-gradient(circle at 88% 12%, rgba(93, 32, 98, 0.22), transparent 32%),
        linear-gradient(180deg, #230b25 0%, var(--tm-bg) 52%, #09020a 100%);
      --tm-toolbar-background:
        linear-gradient(110deg, rgba(126, 45, 128, 0.32), var(--tm-panel-glass-strong) 58%),
        var(--tm-panel-raised);
      --tm-primary-background: linear-gradient(135deg, #7c3578, var(--tm-accent-strong));
      --tm-primary-background-hover: linear-gradient(135deg, #8a3d86, #954693);
      --tm-logo-shadow: drop-shadow(0 5px 14px rgba(166, 65, 162, 0.34));
    }

    html.${ROOT_CLASS}[data-tm-rarbg-palette="olive"] {
      --tm-bg: #0d1006;
      --tm-panel: #191d0f;
      --tm-panel-raised: #242a15;
      --tm-panel-soft: #30371d;
      --tm-panel-glass: rgba(25, 29, 15, 0.9);
      --tm-panel-glass-strong: rgba(25, 29, 15, 0.95);
      --tm-input: #121508;
      --tm-control: #384123;
      --tm-control-hover: #49542c;
      --tm-filter: #282f17;
      --tm-filter-hover: #3c4622;
      --tm-table: #14180b;
      --tm-table-head: #485424;
      --tm-row: #171b0d;
      --tm-row-alt: #1e2411;
      --tm-row-hover: #3b461f;
      --tm-border: #505d2e;
      --tm-border-strong: #718046;
      --tm-cell-border: rgba(80, 93, 46, 0.48);
      --tm-cell-border-strong: rgba(80, 93, 46, 0.62);
      --tm-text: #f3f5e8;
      --tm-text-soft: #d5dbc2;
      --tm-text-subtle: #dfe5cd;
      --tm-text-link: #d5e69c;
      --tm-text-link-hover: #f0f8cf;
      --tm-muted: #adb68e;
      --tm-placeholder: #828b68;
      --tm-accent: #b5cc55;
      --tm-accent-strong: #637326;
      --tm-accent-soft: rgba(181, 204, 85, 0.14);
      --tm-accent-border: rgba(181, 204, 85, 0.72);
      --tm-accent-border-soft: rgba(181, 204, 85, 0.3);
      --tm-focus: #d5e888;
      --tm-scrollbar: #718046;
      --tm-selection: rgba(181, 204, 85, 0.5);
      --tm-overlay: rgba(11, 14, 3, 0.72);
      --tm-page-background:
        radial-gradient(circle at 18% 0%, rgba(101, 119, 38, 0.28), transparent 36%),
        radial-gradient(circle at 88% 12%, rgba(72, 85, 29, 0.2), transparent 32%),
        linear-gradient(180deg, #1b2108 0%, var(--tm-bg) 52%, #060802 100%);
      --tm-toolbar-background:
        linear-gradient(110deg, rgba(91, 108, 34, 0.3), var(--tm-panel-glass-strong) 58%),
        var(--tm-panel-raised);
      --tm-primary-background: linear-gradient(135deg, #596a22, var(--tm-accent-strong));
      --tm-primary-background-hover: linear-gradient(135deg, #647326, #6c7929);
      --tm-logo-shadow: drop-shadow(0 5px 14px rgba(128, 147, 52, 0.34));
    }

    html.${ROOT_CLASS}[data-tm-rarbg-palette="espresso"] {
      --tm-bg: #100a07;
      --tm-panel: #1f1510;
      --tm-panel-raised: #2a1d16;
      --tm-panel-soft: #38271e;
      --tm-panel-glass: rgba(31, 21, 16, 0.9);
      --tm-panel-glass-strong: rgba(31, 21, 16, 0.95);
      --tm-input: #150d09;
      --tm-control: #422c21;
      --tm-control-hover: #573a2b;
      --tm-filter: #2f2017;
      --tm-filter-hover: #473024;
      --tm-table: #180f0b;
      --tm-table-head: #543728;
      --tm-row: #1b120d;
      --tm-row-alt: #241811;
      --tm-row-hover: #483025;
      --tm-border: #5d4032;
      --tm-border-strong: #7f5a48;
      --tm-cell-border: rgba(93, 64, 50, 0.48);
      --tm-cell-border-strong: rgba(93, 64, 50, 0.62);
      --tm-text: #f6eee9;
      --tm-text-soft: #ddcec4;
      --tm-text-subtle: #e7d8cf;
      --tm-text-link: #e8c2a8;
      --tm-text-link-hover: #fce5d6;
      --tm-muted: #b8a294;
      --tm-placeholder: #91796c;
      --tm-accent: #d59a72;
      --tm-accent-strong: #7a4b30;
      --tm-accent-soft: rgba(213, 154, 114, 0.14);
      --tm-accent-border: rgba(213, 154, 114, 0.72);
      --tm-accent-border-soft: rgba(213, 154, 114, 0.3);
      --tm-focus: #efc3a5;
      --tm-scrollbar: #7f5a48;
      --tm-selection: rgba(213, 154, 114, 0.5);
      --tm-overlay: rgba(14, 7, 4, 0.72);
      --tm-page-background:
        radial-gradient(circle at 18% 0%, rgba(117, 72, 46, 0.28), transparent 36%),
        radial-gradient(circle at 88% 12%, rgba(82, 51, 35, 0.22), transparent 32%),
        linear-gradient(180deg, #21130c 0%, var(--tm-bg) 52%, #070301 100%);
      --tm-toolbar-background:
        linear-gradient(110deg, rgba(105, 66, 43, 0.3), var(--tm-panel-glass-strong) 58%),
        var(--tm-panel-raised);
      --tm-primary-background: linear-gradient(135deg, #6d432c, var(--tm-accent-strong));
      --tm-primary-background-hover: linear-gradient(135deg, #784a30, #835238);
      --tm-logo-shadow: drop-shadow(0 5px 14px rgba(140, 87, 57, 0.34));
    }

    html.${ROOT_CLASS} {
      min-height: 100%;
      background: var(--tm-bg) !important;
      scrollbar-color: var(--tm-scrollbar) var(--tm-bg);
      scrollbar-width: thin;
    }

    html.${ROOT_CLASS},
    html.${ROOT_CLASS} body,
    html.${ROOT_CLASS} body * {
      box-sizing: border-box;
    }

    html.${ROOT_CLASS} body.postBody.container {
      width: calc(100% - 32px) !important;
      max-width: 1540px !important;
      min-height: 100vh;
      margin: 16px auto !important;
      padding: 0 !important;
      color: var(--tm-text) !important;
      background: transparent !important;
      font-family: Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont,
        "Segoe UI", sans-serif !important;
      font-size: 14px;
      line-height: 1.45;
    }

    html.${ROOT_CLASS}.${HOME_PAGE_CLASS} body.postBody.container {
      max-width: 2400px !important;
    }

    html.${ROOT_CLASS}.${HOME_PAGE_CLASS} .postCont {
      container-name: rarbg-home;
      container-type: inline-size;
    }

    html.${ROOT_CLASS} body.postBody.container > div[style*="bknd_body.jpg"] {
      background: var(--tm-page-background) !important;
    }

    html.${ROOT_CLASS} ::selection {
      color: var(--tm-text-on-accent);
      background: var(--tm-selection);
    }

    html.${ROOT_CLASS} :focus-visible {
      outline: 2px solid var(--tm-focus) !important;
      outline-offset: 2px !important;
    }

    /* Applied only after the bounded JavaScript check validates a known host. */
    html.${ROOT_CLASS} .tm-rarbg-known-click-catcher {
      display: none !important;
      pointer-events: none !important;
    }

    html.${ROOT_CLASS} a {
      color: var(--tm-accent);
      text-decoration: none;
      transition: color 140ms ease, background-color 140ms ease, border-color 140ms ease;
    }

    html.${ROOT_CLASS} a:hover {
      color: var(--tm-focus);
      text-decoration: none;
    }

    /* Overall shell and header */
    html.${ROOT_CLASS} .topnav {
      width: 100% !important;
      margin: 0 !important;
      padding: 0 !important;
      overflow: visible !important;
      background: transparent !important;
    }

    html.${ROOT_CLASS} .topnav > div:first-child {
      position: relative;
      display: flex;
      min-height: 74px;
      align-items: center;
      gap: 16px;
      margin-bottom: 14px;
      padding: 10px 14px;
      overflow: visible;
      border: 1px solid var(--tm-border);
      border-radius: 15px;
      background: var(--tm-panel-glass) !important;
      box-shadow: var(--tm-shadow);
      backdrop-filter: blur(14px);
    }

    html.${ROOT_CLASS} .logo {
      display: block;
      width: 146px !important;
      max-width: 32vw;
      height: auto !important;
      margin: 0 !important;
      filter: var(--tm-logo-shadow);
    }

    html.${ROOT_CLASS} .postContUp {
      display: flex !important;
      width: auto !important;
      margin: 0 0 0 auto !important;
      padding: 0 !important;
      align-items: center;
      justify-content: flex-end;
      flex-wrap: wrap;
      gap: 7px;
      background: transparent !important;
    }

    html.${ROOT_CLASS} .tm-rarbg-palette-control {
      display: inline-flex;
      min-height: 38px;
      padding-left: 10px;
      align-items: center;
      gap: 8px;
      flex: 0 0 auto;
      border: 1px solid var(--tm-border);
      border-radius: 9px;
      color: var(--tm-muted);
      background: var(--tm-panel-raised);
      font-size: 11px;
      font-weight: 750;
      line-height: 1;
      white-space: nowrap;
    }

    html.${ROOT_CLASS} .tm-rarbg-palette-select {
      width: auto;
      min-width: 92px;
      height: 36px;
      margin: 0;
      padding: 0 28px 0 10px;
      border: 0;
      border-left: 1px solid var(--tm-border);
      border-radius: 0 8px 8px 0;
      color: var(--tm-text);
      background-color: var(--tm-input);
      font: inherit;
      font-size: 12px;
      cursor: pointer;
      color-scheme: dark;
    }

    html.${ROOT_CLASS} .tm-rarbg-palette-select:hover {
      background-color: var(--tm-control-hover);
    }

    html.${ROOT_CLASS} .postContUp button,
    html.${ROOT_CLASS} .leftNav button,
    html.${ROOT_CLASS} #myLinks button {
      min-height: 38px;
      margin: 0 !important;
      padding: 0 !important;
      overflow: hidden;
      border: 1px solid var(--tm-border) !important;
      border-radius: 9px !important;
      background: var(--tm-panel-raised) !important;
      box-shadow: none !important;
      transition: transform 140ms ease, border-color 140ms ease, background-color 140ms ease;
    }

    html.${ROOT_CLASS} .postContUp button:hover,
    html.${ROOT_CLASS} .leftNav button:hover,
    html.${ROOT_CLASS} #myLinks button:hover {
      transform: translateY(-1px);
      border-color: var(--tm-border-strong) !important;
      background: var(--tm-control-hover) !important;
    }

    html.${ROOT_CLASS} .postContUp button.btn-secondary,
    html.${ROOT_CLASS} .leftNav button.btn-secondary,
    html.${ROOT_CLASS} #myLinks button.btn-secondary {
      border-color: var(--tm-accent-border) !important;
      background: var(--tm-primary-background) !important;
    }

    html.${ROOT_CLASS} .postContUp button a,
    html.${ROOT_CLASS} .leftNav button a,
    html.${ROOT_CLASS} #myLinks button a {
      display: flex;
      width: 100%;
      min-height: 36px;
      padding: 8px 11px;
      align-items: center;
      justify-content: center;
      gap: 7px;
      color: var(--tm-text) !important;
      font-size: 13px;
      font-weight: 650;
      line-height: 1;
      white-space: nowrap;
    }

    html.${ROOT_CLASS} .postContUp button.logout-btn {
      padding: 8px 11px !important;
      color: var(--tm-text) !important;
      font-size: 13px;
      font-weight: 650;
      white-space: nowrap;
    }

    html.${ROOT_CLASS} .topnav > .row {
      display: grid !important;
      grid-template-columns: 126px minmax(0, 1fr);
      margin: 0 !important;
      align-items: flex-start;
      gap: 14px;
    }

    html.${ROOT_CLASS} .leftNav {
      position: sticky;
      top: 12px;
      z-index: 30;
      display: flex !important;
      width: 126px !important;
      max-width: 126px !important;
      padding: 10px !important;
      flex: 0 0 126px !important;
      flex-direction: column;
      gap: 7px;
      grid-column: 1;
      grid-row: 1;
      border: 1px solid var(--tm-border);
      border-radius: 14px;
      background: var(--tm-panel-glass-strong) !important;
      box-shadow: var(--tm-shadow);
      backdrop-filter: blur(14px);
    }

    html.${ROOT_CLASS} .leftNav button {
      width: 100% !important;
    }

    html.${ROOT_CLASS} .leftNav button a {
      justify-content: flex-start;
    }

    html.${ROOT_CLASS} .postCont,
    html.${ROOT_CLASS} .postContL {
      width: auto !important;
      max-width: none !important;
      min-width: 0;
      margin: 0 !important;
      padding: 16px !important;
      flex: 1 1 auto !important;
      grid-column: 2;
      grid-row: 1;
      border: 1px solid var(--tm-border);
      border-radius: 15px;
      background: var(--tm-panel-glass-strong) !important;
      box-shadow: var(--tm-shadow);
    }

    html.${ROOT_CLASS} .topnav > .adCont {
      width: 100% !important;
      max-width: none !important;
      margin: 0 !important;
      grid-column: 1 / -1;
      grid-row: 2;
    }

    html.${ROOT_CLASS} .postCont > br,
    html.${ROOT_CLASS} .postContL > br {
      display: none !important;
    }

    /* Theme toolbar */
    html.${ROOT_CLASS} .tm-rarbg-toolbar {
      display: flex;
      min-height: 70px;
      margin: 0 0 14px;
      padding: 14px 16px;
      align-items: center;
      justify-content: space-between;
      gap: 18px;
      border: 1px solid var(--tm-accent-border-soft);
      border-radius: 13px;
      background: var(--tm-toolbar-background);
    }

    html.${ROOT_CLASS} .tm-rarbg-heading {
      min-width: 0;
    }

    html.${ROOT_CLASS} .tm-rarbg-kicker {
      display: block;
      margin-bottom: 2px;
      color: var(--tm-accent);
      font-size: 10px;
      font-weight: 800;
      letter-spacing: 0.16em;
      text-transform: uppercase;
    }

    html.${ROOT_CLASS} .tm-rarbg-title {
      margin: 0;
      color: var(--tm-text);
      font-size: clamp(18px, 2vw, 24px);
      font-weight: 760;
      line-height: 1.15;
    }

    html.${ROOT_CLASS} .tm-rarbg-context {
      display: block;
      margin-top: 4px;
      color: var(--tm-muted);
      font-size: 12px;
    }

    html.${ROOT_CLASS} .tm-rarbg-extras-toggle {
      display: inline-flex;
      min-height: 38px;
      padding: 8px 13px;
      align-items: center;
      justify-content: center;
      gap: 7px;
      flex: 0 0 auto;
      border: 1px solid var(--tm-border-strong);
      border-radius: 9px;
      color: var(--tm-text);
      background: var(--tm-overlay);
      font: inherit;
      font-size: 12px;
      font-weight: 700;
      cursor: pointer;
    }

    html.${ROOT_CLASS} .tm-rarbg-extras-toggle:hover {
      border-color: var(--tm-accent);
      background: var(--tm-accent-soft);
    }

    html.${ROOT_CLASS}:not(.${SHOW_EXTRAS_CLASS}) .tm-rarbg-extra-section {
      display: none !important;
    }

    /* Main search */
    html.${ROOT_CLASS} .tm-rarbg-search-section {
      display: grid !important;
      grid-template-columns: minmax(0, 1fr) auto;
      gap: 12px;
      margin: 0 0 14px !important;
      padding: 14px !important;
      align-items: start;
      border: 1px solid var(--tm-border);
      border-radius: 12px;
      background: var(--tm-panel-raised);
      container-name: rarbg-search;
      container-type: inline-size;
    }

    html.${ROOT_CLASS} .tm-rarbg-search-section > .row {
      width: 100% !important;
      margin: 0 0 8px !important;
      color: var(--tm-muted);
    }

    html.${ROOT_CLASS} .searchSec {
      display: contents !important;
    }

    html.${ROOT_CLASS} .tm-rarbg-adult-control {
      display: flex !important;
      width: auto !important;
      margin: 0 !important;
      grid-column: 2;
      grid-row: 1;
      justify-content: flex-end;
    }

    html.${ROOT_CLASS} .tm-rarbg-adult-control .form-check {
      margin: 0 !important;
      padding: 0 !important;
    }

    html.${ROOT_CLASS} .tm-rarbg-adult-control label[for="adultContentToggle"] {
      display: flex;
      min-height: 42px;
      margin: 0 !important;
      padding: 7px 10px;
      align-items: center;
      gap: 8px;
      border: 1px solid var(--tm-border-strong);
      border-radius: 9px;
      color: var(--tm-text-soft);
      background: var(--tm-input);
      font-size: 12px;
      font-weight: 750;
      white-space: nowrap;
      cursor: pointer;
    }

    html.${ROOT_CLASS} .tm-rarbg-adult-control label[for="adultContentToggle"]::before {
      content: "18+";
      padding: 3px 6px;
      border-radius: 999px;
      color: var(--tm-text-on-accent);
      background: var(--tm-danger);
      font-size: 10px;
      line-height: 1;
    }

    html.${ROOT_CLASS} .tm-rarbg-adult-control label[for="adultContentToggle"]::after {
      content: "Hidden";
      order: 2;
      color: var(--tm-muted);
      font-size: 10px;
      text-transform: uppercase;
    }

    html.${ROOT_CLASS}
      .tm-rarbg-adult-control
      label[for="adultContentToggle"]:has(#adultContentToggle:checked) {
      border-color: var(--tm-accent);
      background: var(--tm-accent-soft);
    }

    html.${ROOT_CLASS}
      .tm-rarbg-adult-control
      label[for="adultContentToggle"]:has(#adultContentToggle:checked)::after {
      content: "Visible";
      color: var(--tm-focus);
    }

    html.${ROOT_CLASS} .tm-rarbg-adult-control #adultContentToggle {
      margin: 0 !important;
      order: 3;
      float: none !important;
      cursor: pointer;
    }

    html.${ROOT_CLASS} #form_search {
      display: contents;
    }

    html.${ROOT_CLASS} #form_search .search {
      display: flex !important;
      width: 100% !important;
      height: auto !important;
      margin: 0 !important;
      align-items: stretch;
      gap: 7px;
      grid-column: 1;
      grid-row: 1;
    }

    html.${ROOT_CLASS} #keywords,
    html.${ROOT_CLASS} #flist,
    html.${ROOT_CLASS} #form_search input[type="number"],
    html.${ROOT_CLASS} #form_search input[type="text"] {
      min-width: 0;
      height: 42px !important;
      padding: 9px 12px !important;
      border: 1px solid var(--tm-border-strong) !important;
      border-radius: 9px !important;
      color: var(--tm-text) !important;
      background: var(--tm-input) !important;
      box-shadow: none !important;
      font: inherit !important;
      font-size: 13px !important;
    }

    html.${ROOT_CLASS} #keywords {
      width: auto !important;
      flex: 1 1 auto;
    }

    html.${ROOT_CLASS} #keywords:focus,
    html.${ROOT_CLASS} #flist:focus,
    html.${ROOT_CLASS} #form_search input:focus {
      border-color: var(--tm-accent) !important;
      box-shadow: 0 0 0 3px var(--tm-accent-soft) !important;
    }

    html.${ROOT_CLASS} #keywords::placeholder,
    html.${ROOT_CLASS} #flist::placeholder {
      color: var(--tm-placeholder) !important;
      opacity: 1;
    }

    html.${ROOT_CLASS} .searchButton,
    html.${ROOT_CLASS} #filterBtn,
    html.${ROOT_CLASS} #form_search button[type="reset"] {
      display: inline-flex !important;
      width: 42px !important;
      min-width: 42px;
      height: 42px !important;
      padding: 0 !important;
      align-items: center;
      justify-content: center;
      border: 1px solid var(--tm-border-strong) !important;
      border-radius: 9px !important;
      color: var(--tm-text) !important;
      background: var(--tm-control) !important;
      box-shadow: none !important;
      cursor: pointer;
    }

    html.${ROOT_CLASS} .searchButton:hover,
    html.${ROOT_CLASS} #filterBtn:hover,
    html.${ROOT_CLASS} #form_search button[type="reset"]:hover {
      border-color: var(--tm-accent) !important;
      background: var(--tm-accent-strong) !important;
    }

    html.${ROOT_CLASS} #form_search > div:last-of-type {
      display: none !important;
      align-items: center;
      justify-content: flex-end;
      gap: 8px;
    }

    html.${ROOT_CLASS} #form_search:has(#filterBtn.open) > div:last-of-type {
      display: flex !important;
    }

    html.${ROOT_CLASS} #form_search button[type="reset"] {
      width: auto !important;
      padding: 0 13px !important;
      color: var(--tm-muted) !important;
      background: transparent !important;
    }

    html.${ROOT_CLASS} #filterBtn {
      width: auto !important;
      min-width: 78px;
      padding: 0 13px !important;
    }

    html.${ROOT_CLASS} #filterOption {
      width: 100% !important;
      max-width: none !important;
      min-width: 0;
      margin: 0 !important;
      padding: 12px !important;
      grid-template-columns: repeat(4, minmax(0, 1fr)) !important;
      gap: 10px !important;
      grid-column: 1 / -1;
      grid-row: 2;
      border: 1px solid var(--tm-border);
      border-radius: 10px;
      background: var(--tm-input) !important;
    }

    html.${ROOT_CLASS} #filterOption > div:nth-child(-n + 8) {
      display: flex;
      min-width: 0;
      min-height: 40px;
      padding: 8px 10px;
      align-items: center;
      gap: 8px;
      border: 1px solid var(--tm-border);
      border-radius: 9px;
      color: var(--tm-text-soft);
      background: var(--tm-filter);
    }

    html.${ROOT_CLASS} #filterOption > div:nth-child(-n + 8):has(input:checked) {
      border-color: var(--tm-accent);
      color: var(--tm-text-on-accent);
      background: var(--tm-accent-soft);
    }

    html.${ROOT_CLASS} #filterOption > .tm-rarbg-adult-filter[hidden] {
      display: none !important;
    }

    html.${ROOT_CLASS} #filterOption > div:nth-child(-n + 8) input {
      margin: 0;
      flex: 0 0 auto;
    }

    html.${ROOT_CLASS} #filterOption > div:nth-child(-n + 8) label {
      min-width: 0;
      margin: 0;
      flex: 1 1 auto;
      cursor: pointer;
    }

    html.${ROOT_CLASS} #filterOption > div:nth-child(-n + 8) label a {
      display: block;
      color: inherit !important;
      font-weight: 700;
    }

    html.${ROOT_CLASS} #filterOption > div:nth-last-child(-n + 2) {
      grid-column: span 2;
    }

    @container rarbg-search (min-width: 1400px) {
      html.${ROOT_CLASS} #filterOption {
        grid-template-columns: repeat(8, minmax(0, 1fr)) !important;
      }

      html.${ROOT_CLASS} #filterOption > div:nth-child(9) {
        grid-column: 3 / span 2;
      }

      html.${ROOT_CLASS} #filterOption > div:nth-child(10) {
        grid-column: 5 / span 2;
      }
    }

    @container rarbg-search (max-width: 700px) {
      html.${ROOT_CLASS} #filterOption {
        grid-template-columns: repeat(2, minmax(0, 1fr)) !important;
      }

      html.${ROOT_CLASS} #filterOption > div:nth-last-child(-n + 2) {
        grid-column: span 1;
      }
    }

    @container rarbg-search (max-width: 360px) {
      html.${ROOT_CLASS} #filterOption {
        grid-template-columns: minmax(0, 1fr) !important;
      }
    }

    html.${ROOT_CLASS} #filterOption label[for="sizeMin"],
    html.${ROOT_CLASS} #filterOption label[for="sizeMax"] {
      display: block !important;
      width: 100%;
    }

    html.${ROOT_CLASS} #form_search > div:last-of-type {
      grid-column: 1 / -1;
      grid-row: 3;
    }

    html.${ROOT_CLASS} .search-result-pop {
      /* Keep suggestions in the shared layout instead of the site's absolute overlay. */
      position: static !important;
      inset: auto !important;
      grid-column: 1 / -1;
      grid-row: 4;
    }

    html.${ROOT_CLASS} #sizeMin,
    html.${ROOT_CLASS} #sizeMax {
      width: 100% !important;
      padding: 9px 38px !important;
      -moz-appearance: textfield;
      appearance: textfield;
    }

    html.${ROOT_CLASS} #sizeMin::placeholder,
    html.${ROOT_CLASS} #sizeMax::placeholder {
      color: transparent !important;
      opacity: 0;
    }

    html.${ROOT_CLASS} #sizeMin::-webkit-inner-spin-button,
    html.${ROOT_CLASS} #sizeMin::-webkit-outer-spin-button,
    html.${ROOT_CLASS} #sizeMax::-webkit-inner-spin-button,
    html.${ROOT_CLASS} #sizeMax::-webkit-outer-spin-button {
      margin: 0;
      -webkit-appearance: none;
      appearance: none;
    }

    html.${ROOT_CLASS} #filterOption label[for="sizeMin"] > span,
    html.${ROOT_CLASS} #filterOption label[for="sizeMax"] > span {
      top: 50% !important;
      z-index: 1;
      transform: translateY(-50%);
      color: var(--tm-focus) !important;
      pointer-events: none;
    }

    html.${ROOT_CLASS} #filterOption label[for="sizeMin"] > span:first-child,
    html.${ROOT_CLASS} #filterOption label[for="sizeMax"] > span:first-child {
      left: 10px !important;
    }

    html.${ROOT_CLASS} #filterOption label[for="sizeMin"] > span:last-child,
    html.${ROOT_CLASS} #filterOption label[for="sizeMax"] > span:last-child {
      right: 10px !important;
    }

    html.${ROOT_CLASS} .form-check-input,
    html.${ROOT_CLASS} input[type="checkbox"] {
      accent-color: var(--tm-accent-strong);
    }

    html.${ROOT_CLASS} #searchList {
      overflow: hidden;
      border: 1px solid var(--tm-border) !important;
      border-radius: 10px !important;
      color: var(--tm-text) !important;
      background: var(--tm-panel) !important;
      box-shadow: var(--tm-shadow) !important;
    }

    html.${ROOT_CLASS} #searchList .nav-item {
      border-color: var(--tm-border) !important;
      color: var(--tm-text) !important;
      background: transparent !important;
    }

    html.${ROOT_CLASS} #searchList .nav-item:hover {
      background: var(--tm-accent-soft) !important;
    }

    /* Optional recommendation and tag sections */
    html.${ROOT_CLASS} .banner-box.movie,
    html.${ROOT_CLASS} .tm-rarbg-extra-section {
      margin: 0 0 14px !important;
      padding: 12px !important;
      border: 1px solid var(--tm-border);
      border-radius: 12px;
      background: var(--tm-panel-raised) !important;
    }

    html.${ROOT_CLASS} .banner-box.movie {
      width: 100% !important;
      height: auto !important;
      overflow: hidden;
    }

    html.${ROOT_CLASS} .banner-box.movie img {
      border-radius: 8px;
      box-shadow: 0 8px 22px rgba(0, 0, 0, 0.38);
    }

    html.${ROOT_CLASS} #searchTags {
      display: flex;
      width: 100%;
      align-items: center;
      justify-content: center;
      flex-wrap: wrap;
      gap: 7px;
    }

    html.${ROOT_CLASS} #searchTags .badge {
      margin: 0 !important;
      padding: 7px 10px !important;
      border: 1px solid var(--tm-border) !important;
      color: var(--tm-text-subtle) !important;
      background: var(--tm-panel-soft) !important;
      font-size: 11px;
      font-weight: 650;
    }

    html.${ROOT_CLASS} #searchTags a:hover .badge {
      border-color: var(--tm-accent) !important;
      color: var(--tm-text-on-accent) !important;
      background: var(--tm-accent-soft) !important;
    }

    html.${ROOT_CLASS} .recent-search-wrapper,
    html.${ROOT_CLASS} .recent-search-container {
      width: 100% !important;
      height: auto !important;
      margin: 0 !important;
      padding: 0 !important;
      color: var(--tm-muted) !important;
      background: transparent !important;
    }

    /* Results controls */
    html.${ROOT_CLASS} .tm-rarbg-results-row {
      display: block !important;
      box-sizing: border-box;
      width: 100% !important;
      margin: 0 !important;
      padding: 12px !important;
      border-radius: 12px;
      background: var(--tm-panel);
    }

    html.${ROOT_CLASS} .tm-rarbg-filter-bar {
      display: flex !important;
      width: 100%;
      min-height: 58px;
      margin: 0 0 11px !important;
      padding: 10px 12px !important;
      align-items: center;
      justify-content: space-between !important;
      flex-wrap: wrap;
      gap: 10px 14px;
      border: 1px solid var(--tm-border);
      border-radius: 11px;
      color: var(--tm-muted);
      background: var(--tm-panel-raised);
    }

    html.${ROOT_CLASS} #flist {
      width: min(320px, 100%) !important;
      flex: 1 1 220px;
    }

    html.${ROOT_CLASS} .tm-rarbg-filter-bar > div {
      display: flex;
      align-items: center;
      flex-wrap: wrap;
      gap: 6px;
      margin: 0 !important;
    }

    html.${ROOT_CLASS} .tm-rarbg-filter-bar label {
      display: inline-flex;
      min-height: 30px;
      margin: 0 !important;
      padding: 5px 8px;
      align-items: center;
      gap: 5px;
      border: 1px solid var(--tm-border);
      border-radius: 8px;
      color: var(--tm-text-soft);
      background: var(--tm-filter);
      cursor: pointer;
    }

    html.${ROOT_CLASS} .tm-rarbg-filter-bar label:hover {
      border-color: var(--tm-border-strong);
      background: var(--tm-filter-hover);
    }

    html.${ROOT_CLASS} .tm-rarbg-filter-bar label:has(input:checked) {
      border-color: var(--tm-accent);
      color: var(--tm-text-on-accent);
      background: var(--tm-accent-soft);
    }

    /* Results table */
    html.${ROOT_CLASS} .dataTables_wrapper {
      width: 100% !important;
      overflow: visible !important;
      border: 1px solid var(--tm-border);
      border-radius: 12px;
      background: var(--tm-table);
      scrollbar-color: var(--tm-scrollbar) var(--tm-input);
      scrollbar-width: thin;
    }

    html.${ROOT_CLASS} .tm-rarbg-results-row > .dataTables_wrapper {
      box-sizing: border-box;
      padding: 12px !important;
    }

    html.${ROOT_CLASS} .tm-rarbg-results-row table th:nth-child(1),
    html.${ROOT_CLASS} .tm-rarbg-results-row table th:nth-child(4),
    html.${ROOT_CLASS} .tm-rarbg-results-row table th:nth-child(5),
    html.${ROOT_CLASS} .tm-rarbg-results-row table th:nth-child(6),
    html.${ROOT_CLASS} .tm-rarbg-results-row table th:nth-child(7),
    html.${ROOT_CLASS} .tm-rarbg-results-row table th:nth-child(8) {
      padding: 12px 16px !important;
      text-align: center !important;
    }

    html.${ROOT_CLASS} .tm-rarbg-results-row table td:nth-child(1),
    html.${ROOT_CLASS} .tm-rarbg-results-row table td:nth-child(4),
    html.${ROOT_CLASS} .tm-rarbg-results-row table td:nth-child(5),
    html.${ROOT_CLASS} .tm-rarbg-results-row table td:nth-child(6),
    html.${ROOT_CLASS} .tm-rarbg-results-row table td:nth-child(7),
    html.${ROOT_CLASS} .tm-rarbg-results-row table td:nth-child(8) {
      text-align: center !important;
    }

    html.${ROOT_CLASS} .dataTables_filter {
      display: flex;
      float: none !important;
      padding: 10px;
      justify-content: flex-start;
    }

    html.${ROOT_CLASS} .dataTables_filter label {
      width: min(300px, 100%);
      margin: 0;
    }

    html.${ROOT_CLASS} .dataTables_filter input[type="search"] {
      width: 100% !important;
      height: 38px !important;
      margin: 0 !important;
      padding: 8px 10px !important;
      border: 1px solid var(--tm-border-strong) !important;
      border-radius: 8px !important;
      color: var(--tm-text) !important;
      background: var(--tm-input) !important;
      box-shadow: none !important;
      font: inherit !important;
    }

    html.${ROOT_CLASS} .dataTables_filter input[type="search"]:focus {
      border-color: var(--tm-accent) !important;
      box-shadow: 0 0 0 3px var(--tm-accent-soft) !important;
    }

    /* Wide-screen home dashboard */
    html.${ROOT_CLASS}.${HOME_PAGE_CLASS} .tm-rarbg-home-grid {
      display: grid;
      grid-template-columns: repeat(2, minmax(0, 1fr));
      gap: 18px;
      margin-top: 18px;
      align-items: stretch;
    }

    html.${ROOT_CLASS}.${HOME_PAGE_CLASS} .tm-rarbg-home-category {
      display: flex;
      min-width: 0;
      height: 100%;
      padding: 14px;
      flex-direction: column;
      overflow: visible;
      border: 1px solid var(--tm-border);
      border-radius: 13px;
      background: var(--tm-panel-soft);
      box-shadow: var(--tm-shadow);
    }

    html.${ROOT_CLASS}.${HOME_PAGE_CLASS} .tm-rarbg-home-actions {
      display: grid;
      grid-template-columns: repeat(3, minmax(0, 1fr));
      gap: 8px;
      margin-top: auto;
      padding: 12px 0 0 !important;
    }

    html.${ROOT_CLASS}.${HOME_PAGE_CLASS} .tm-rarbg-home-actions > a {
      display: flex;
      min-width: 0;
    }

    html.${ROOT_CLASS}.${HOME_PAGE_CLASS} .tm-rarbg-home-actions .btn-small {
      width: 100%;
      height: 100%;
      min-height: 42px;
      margin: 0 !important;
      padding: 8px 10px !important;
      white-space: normal;
      line-height: 1.25;
    }

    html.${ROOT_CLASS}.${HOME_PAGE_CLASS} .tm-rarbg-home-category > h2 {
      margin: 0 0 10px !important;
      font-size: 18px;
      line-height: 1.25;
    }

    html.${ROOT_CLASS}.${HOME_PAGE_CLASS} .tm-rarbg-home-category > .row {
      margin-right: 0 !important;
      margin-left: 0 !important;
      padding: 0 !important;
    }

    html.${ROOT_CLASS}.${HOME_PAGE_CLASS} .tm-rarbg-home-category .dataTables_wrapper {
      box-sizing: border-box;
      width: 100% !important;
      max-width: 100%;
      padding: 12px !important;
      overflow: visible !important;
      border-radius: 10px;
      background: var(--tm-table);
    }

    html.${ROOT_CLASS}.${HOME_PAGE_CLASS} .tm-rarbg-home-category .dataTables_filter {
      display: none !important;
    }

    html.${ROOT_CLASS}.${HOME_PAGE_CLASS} .tm-rarbg-home-category .dataTables_info {
      display: none !important;
    }

    html.${ROOT_CLASS}.${HOME_PAGE_CLASS} .tm-rarbg-home-category table th:nth-child(3),
    html.${ROOT_CLASS}.${HOME_PAGE_CLASS} .tm-rarbg-home-category table td:nth-child(3) {
      display: none !important;
    }

    html.${ROOT_CLASS}.${HOME_PAGE_CLASS} .tm-rarbg-home-category table.dataTable {
      width: 100% !important;
      max-width: 100% !important;
      min-width: 0 !important;
      table-layout: fixed !important;
    }

    html.${ROOT_CLASS}.${HOME_PAGE_CLASS} .tm-rarbg-home-category table th:nth-child(1),
    html.${ROOT_CLASS}.${HOME_PAGE_CLASS} .tm-rarbg-home-category table td:nth-child(1) {
      width: 68px !important;
    }

    html.${ROOT_CLASS}.${HOME_PAGE_CLASS} .tm-rarbg-home-category table th:nth-child(2),
    html.${ROOT_CLASS}.${HOME_PAGE_CLASS} .tm-rarbg-home-category table td:nth-child(2) {
      width: auto !important;
    }

    html.${ROOT_CLASS}.${HOME_PAGE_CLASS} .tm-rarbg-home-category table th:nth-child(4),
    html.${ROOT_CLASS}.${HOME_PAGE_CLASS} .tm-rarbg-home-category table td:nth-child(4) {
      width: 86px !important;
    }

    html.${ROOT_CLASS}.${HOME_PAGE_CLASS} .tm-rarbg-home-category table td.cellName .wrapper {
      display: flex;
      min-width: 0;
      align-items: center;
      overflow: visible;
      white-space: nowrap;
    }

    html.${ROOT_CLASS}.${HOME_PAGE_CLASS}
      .tm-rarbg-home-category
      table
      td.cellName
      .wrapper
      > a:first-child {
      display: block;
      min-width: 0;
      overflow: hidden;
      flex: 1 1 auto;
      text-overflow: ellipsis;
      white-space: nowrap;
    }

    html.${ROOT_CLASS}.${HOME_PAGE_CLASS}
      .tm-rarbg-home-category
      table
      td.cellName
      .wrapper
      > a:not(:first-child) {
      flex: 0 0 auto;
    }

    html.${ROOT_CLASS}.${HOME_PAGE_CLASS} .tm-rarbg-home-category table th:nth-child(5),
    html.${ROOT_CLASS}.${HOME_PAGE_CLASS} .tm-rarbg-home-category table td:nth-child(5) {
      width: 72px !important;
      white-space: nowrap;
    }

    html.${ROOT_CLASS}.${HOME_PAGE_CLASS} .tm-rarbg-home-category table th:nth-child(6),
    html.${ROOT_CLASS}.${HOME_PAGE_CLASS} .tm-rarbg-home-category table td:nth-child(6) {
      width: 78px !important;
    }

    html.${ROOT_CLASS}.${HOME_PAGE_CLASS} .tm-rarbg-home-category table th:nth-child(7),
    html.${ROOT_CLASS}.${HOME_PAGE_CLASS} .tm-rarbg-home-category table td:nth-child(7),
    html.${ROOT_CLASS}.${HOME_PAGE_CLASS} .tm-rarbg-home-category table th:nth-child(8),
    html.${ROOT_CLASS}.${HOME_PAGE_CLASS} .tm-rarbg-home-category table td:nth-child(8) {
      width: 56px !important;
    }

    html.${ROOT_CLASS}.${HOME_PAGE_CLASS} .tm-rarbg-home-category table th:nth-child(1),
    html.${ROOT_CLASS}.${HOME_PAGE_CLASS} .tm-rarbg-home-category table th:nth-child(4),
    html.${ROOT_CLASS}.${HOME_PAGE_CLASS} .tm-rarbg-home-category table th:nth-child(5),
    html.${ROOT_CLASS}.${HOME_PAGE_CLASS} .tm-rarbg-home-category table th:nth-child(6),
    html.${ROOT_CLASS}.${HOME_PAGE_CLASS} .tm-rarbg-home-category table th:nth-child(7),
    html.${ROOT_CLASS}.${HOME_PAGE_CLASS} .tm-rarbg-home-category table th:nth-child(8) {
      padding: 12px 16px !important;
      text-align: center !important;
    }

    html.${ROOT_CLASS}.${HOME_PAGE_CLASS} .tm-rarbg-home-category table td:nth-child(1),
    html.${ROOT_CLASS}.${HOME_PAGE_CLASS} .tm-rarbg-home-category table td:nth-child(4),
    html.${ROOT_CLASS}.${HOME_PAGE_CLASS} .tm-rarbg-home-category table td:nth-child(5),
    html.${ROOT_CLASS}.${HOME_PAGE_CLASS} .tm-rarbg-home-category table td:nth-child(6),
    html.${ROOT_CLASS}.${HOME_PAGE_CLASS} .tm-rarbg-home-category table td:nth-child(7),
    html.${ROOT_CLASS}.${HOME_PAGE_CLASS} .tm-rarbg-home-category table td:nth-child(8) {
      text-align: center !important;
    }

    html.${ROOT_CLASS}.${HOME_PAGE_CLASS} .tm-rarbg-home-category-wide {
      grid-column: 1 / -1;
    }

    html.${ROOT_CLASS}.${HOME_PAGE_CLASS}
      .tm-rarbg-home-category:not(.tm-rarbg-home-category-wide)
      table.dataTable {
      min-width: 760px;
    }

    html.${ROOT_CLASS} table.sortableTable2,
    html.${ROOT_CLASS} table.dataTable {
      width: 100% !important;
      min-width: 900px;
      margin: 0 !important;
      border: 0 !important;
      border-collapse: separate !important;
      border-spacing: 0 !important;
      color: var(--tm-text) !important;
      background: transparent !important;
    }

    html.${ROOT_CLASS} table.sortableTable thead th,
    html.${ROOT_CLASS} table.sortableTable2 thead th,
    html.${ROOT_CLASS} table.dataTable thead th {
      position: sticky;
      top: 0;
      z-index: 20;
      padding: 12px 24px 12px 12px !important;
      border-top: 0 !important;
      border-right: 1px solid var(--tm-border) !important;
      border-bottom: 1px solid var(--tm-border-strong) !important;
      color: var(--tm-text) !important;
      background-color: var(--tm-table-head) !important;
      font-size: 11px;
      font-weight: 800;
      letter-spacing: 0.045em;
      line-height: 1.2;
      text-transform: uppercase;
      white-space: nowrap;
    }

    html.${ROOT_CLASS} table.sortableTable thead th:last-child,
    html.${ROOT_CLASS} table.sortableTable2 thead th:last-child,
    html.${ROOT_CLASS} table.dataTable thead th:last-child {
      border-right: 0 !important;
    }

    html.${ROOT_CLASS} table.dataTable thead > tr > th.sorting,
    html.${ROOT_CLASS} table.dataTable thead > tr > th.sorting_asc,
    html.${ROOT_CLASS} table.dataTable thead > tr > th.sorting_desc {
      padding-right: 30px !important;
    }

    html.${ROOT_CLASS} table.dataTable thead > tr > th.sorting::before,
    html.${ROOT_CLASS} table.dataTable thead > tr > th.sorting::after,
    html.${ROOT_CLASS} table.dataTable thead > tr > th.sorting_asc::before,
    html.${ROOT_CLASS} table.dataTable thead > tr > th.sorting_asc::after,
    html.${ROOT_CLASS} table.dataTable thead > tr > th.sorting_desc::before,
    html.${ROOT_CLASS} table.dataTable thead > tr > th.sorting_desc::after {
      right: 8px !important;
    }

    html.${ROOT_CLASS} table thead th a > i.fa-arrow-down {
      display: none !important;
    }

    html.${ROOT_CLASS} table.sortableTable2 tbody tr,
    html.${ROOT_CLASS} table.dataTable tbody tr {
      color: var(--tm-text) !important;
      background: var(--tm-row) !important;
      transition: background-color 120ms ease, box-shadow 120ms ease;
    }

    html.${ROOT_CLASS} table.sortableTable2 tbody tr:nth-child(even),
    html.${ROOT_CLASS} table.dataTable tbody tr:nth-child(even) {
      background: var(--tm-row-alt) !important;
    }

    html.${ROOT_CLASS} table.sortableTable2 tbody tr:hover,
    html.${ROOT_CLASS} table.dataTable tbody tr:hover {
      position: relative;
      z-index: 50;
      background: var(--tm-row-hover) !important;
      box-shadow: inset 3px 0 0 var(--tm-accent);
    }

    html.${ROOT_CLASS} table.sortableTable .wrapper:hover,
    html.${ROOT_CLASS} table.sortableTable2 .wrapper:hover,
    html.${ROOT_CLASS} table.dataTable .wrapper:hover {
      position: relative;
      z-index: 70;
    }

    html.${ROOT_CLASS} table.sortableTable .wrapper:hover .tooltip,
    html.${ROOT_CLASS} table.sortableTable2 .wrapper:hover .tooltip,
    html.${ROOT_CLASS} table.dataTable .wrapper:hover .tooltip {
      z-index: 80 !important;
    }

    html.${ROOT_CLASS} table.sortableTable2 tbody td,
    html.${ROOT_CLASS} table.dataTable tbody td {
      padding: 10px !important;
      border-top: 0 !important;
      border-right: 1px solid var(--tm-cell-border) !important;
      border-bottom: 1px solid var(--tm-cell-border-strong) !important;
      color: var(--tm-text-soft) !important;
      background: transparent !important;
      box-shadow: none !important;
      font-size: 13px;
      line-height: 1.4;
      vertical-align: middle;
    }

    html.${ROOT_CLASS} table.sortableTable2 tbody td:last-child,
    html.${ROOT_CLASS} table.dataTable tbody td:last-child {
      border-right: 0 !important;
    }

    html.${ROOT_CLASS} table.sortableTable2 th:nth-child(2),
    html.${ROOT_CLASS} table.sortableTable2 td:nth-child(2) {
      width: 52%;
    }

    html.${ROOT_CLASS} table.sortableTable2 td.cellName a,
    html.${ROOT_CLASS} table.sortableTable td.cellName a {
      display: inline;
      color: var(--tm-text-link) !important;
      font-size: 14px;
      font-weight: 690 !important;
      line-height: 1.38;
      overflow-wrap: anywhere;
    }

    html.${ROOT_CLASS} table.sortableTable2 td.cellName a:hover,
    html.${ROOT_CLASS} table.sortableTable td.cellName a:hover {
      color: var(--tm-text-link-hover) !important;
    }

    html.${ROOT_CLASS} table.sortableTable2 td:not(.cellName),
    html.${ROOT_CLASS} table.sortableTable2 th:not(:nth-child(2)) {
      white-space: nowrap;
    }

    html.${ROOT_CLASS} table.sortableTable2 td.sizeCell {
      color: var(--tm-text-subtle) !important;
      font-variant-numeric: tabular-nums;
    }

    html.${ROOT_CLASS} table.sortableTable2 td:nth-child(7) {
      color: var(--tm-success) !important;
      font-weight: 800;
      font-variant-numeric: tabular-nums;
    }

    html.${ROOT_CLASS} table.sortableTable2 td:nth-child(8) {
      color: var(--tm-danger) !important;
      font-weight: 750;
      font-variant-numeric: tabular-nums;
    }

    html.${ROOT_CLASS} table.sortableTable td:nth-child(7) {
      color: var(--tm-success) !important;
      font-weight: 800;
      font-variant-numeric: tabular-nums;
    }

    html.${ROOT_CLASS} table.sortableTable td:nth-child(8) {
      color: var(--tm-danger) !important;
      font-weight: 750;
      font-variant-numeric: tabular-nums;
    }

    html.${ROOT_CLASS} table.sortableTable .tooltip img,
    html.${ROOT_CLASS} table.sortableTable2 .tooltip img,
    html.${ROOT_CLASS} table.dataTable .tooltip img {
      overflow: hidden;
      border: 1px solid var(--tm-border-strong);
      border-radius: 8px;
      background: var(--tm-panel);
      box-shadow: var(--tm-shadow);
    }

    html.${ROOT_CLASS}.${CATEGORY_PAGE_CLASS} table.sortableTable th:nth-child(1),
    html.${ROOT_CLASS}.${CATEGORY_PAGE_CLASS} table.sortableTable td:nth-child(1),
    html.${ROOT_CLASS}.${CATEGORY_PAGE_CLASS} table.sortableTable th:nth-child(3),
    html.${ROOT_CLASS}.${CATEGORY_PAGE_CLASS} table.sortableTable td:nth-child(3),
    html.${ROOT_CLASS}.${CATEGORY_PAGE_CLASS} table.sortableTable2 th:nth-child(1),
    html.${ROOT_CLASS}.${CATEGORY_PAGE_CLASS} table.sortableTable2 td:nth-child(1),
    html.${ROOT_CLASS}.${CATEGORY_PAGE_CLASS} table.sortableTable2 th:nth-child(3),
    html.${ROOT_CLASS}.${CATEGORY_PAGE_CLASS} table.sortableTable2 td:nth-child(3),
    html.${ROOT_CLASS}.${CATEGORY_PAGE_CLASS} table.dataTable th:nth-child(1),
    html.${ROOT_CLASS}.${CATEGORY_PAGE_CLASS} table.dataTable td:nth-child(1),
    html.${ROOT_CLASS}.${CATEGORY_PAGE_CLASS} table.dataTable th:nth-child(3),
    html.${ROOT_CLASS}.${CATEGORY_PAGE_CLASS} table.dataTable td:nth-child(3) {
      display: none !important;
    }

    html.${ROOT_CLASS} .dataTables_info,
    html.${ROOT_CLASS} .dataTables_empty {
      padding: 12px !important;
      color: var(--tm-muted) !important;
      font-size: 13px;
    }

    /* Pagination */
    html.${ROOT_CLASS} .tm-rarbg-pagination-row {
      margin: 12px 0 !important;
    }

    html.${ROOT_CLASS} .pagination {
      display: flex !important;
      margin: 0 !important;
      padding: 0 0 16px !important;
      align-items: center;
      justify-content: center;
      flex-wrap: wrap;
      gap: 6px;
      list-style: none;
    }

    html.${ROOT_CLASS} .pagination > .page-item {
      margin: 0 !important;
    }

    html.${ROOT_CLASS} .pagination .page-item > .page-link,
    html.${ROOT_CLASS} .pagination > .page-link {
      display: inline-flex;
      min-width: 36px;
      min-height: 38px;
      padding: 7px 10px !important;
      align-items: center;
      justify-content: center;
      border: 1px solid var(--tm-border) !important;
      border-radius: 8px !important;
      color: var(--tm-text-subtle) !important;
      background: var(--tm-panel-raised) !important;
      box-shadow: none !important;
      text-align: center;
    }

    html.${ROOT_CLASS} .pagination .page-item > .page-link:hover,
    html.${ROOT_CLASS} .pagination > .page-link:hover {
      border-color: var(--tm-accent) !important;
      color: var(--tm-text-on-accent) !important;
      background: var(--tm-accent-soft) !important;
    }

    html.${ROOT_CLASS} .pagination .page-item.active > .page-link,
    html.${ROOT_CLASS} .pagination > .page-link.active,
    html.${ROOT_CLASS} .pagination > .page-link[aria-current="page"] {
      border-color: var(--tm-accent) !important;
      color: var(--tm-text-on-accent) !important;
      background: var(--tm-accent-strong) !important;
    }

    html.${ROOT_CLASS} .pagination .page-item.disabled > .page-link,
    html.${ROOT_CLASS} .pagination > .page-link.disabled {
      color: var(--tm-muted) !important;
      background: var(--tm-panel) !important;
      opacity: 0.55;
      pointer-events: none;
    }

    html.${ROOT_CLASS} .pagination > span:not(.page-link) {
      align-self: center;
      padding: 0 2px;
      color: var(--tm-muted);
    }

    html.${ROOT_CLASS} .pagination > .page-item:empty {
      display: none;
    }

    /* Root catalogue */
    html.${ROOT_CLASS} .tm-rarbg-catalog-title {
      display: flex !important;
      width: 100%;
      min-height: 58px;
      margin: 0 0 14px !important;
      padding: 14px 16px !important;
      align-items: center;
      border: 1px solid var(--tm-accent-border-soft);
      border-radius: 12px;
      background: var(--tm-toolbar-background);
    }

    html.${ROOT_CLASS} .tm-rarbg-catalog-title > b {
      margin: 0 !important;
      color: var(--tm-text) !important;
      font-size: 20px !important;
      font-weight: 760;
      line-height: 1.2;
    }

    html.${ROOT_CLASS} .tm-rarbg-catalog-picker,
    html.${ROOT_CLASS} .tm-rarbg-catalog-links {
      width: 100%;
      margin: 0 0 14px !important;
      padding: 18px !important;
      border: 1px solid var(--tm-border);
      border-radius: 12px;
      background: var(--tm-panel-raised);
      text-align: center;
    }

    html.${ROOT_CLASS} .tm-rarbg-catalog-picker {
      display: block !important;
    }

    html.${ROOT_CLASS} .tm-rarbg-catalog-picker h2,
    html.${ROOT_CLASS} .tm-rarbg-catalog-links h2 {
      margin: 0 0 14px !important;
      color: var(--tm-text) !important;
      font-size: 18px !important;
      font-weight: 750 !important;
      line-height: 1.25;
    }

    html.${ROOT_CLASS} .tm-rarbg-catalog-picker table {
      margin: 0 auto;
      border-collapse: separate;
      border-spacing: 8px 0;
    }

    html.${ROOT_CLASS} .tm-rarbg-catalog-picker td {
      padding: 0;
    }

    html.${ROOT_CLASS} .tm-rarbg-catalog-picker br {
      display: none;
    }

    html.${ROOT_CLASS} .tm-rarbg-catalog-picker .buttonalink {
      display: inline-flex !important;
      min-width: 104px;
      min-height: 42px;
      padding: 9px 16px !important;
      align-items: center;
      justify-content: center;
      border: 1px solid var(--tm-accent-border) !important;
      border-radius: 9px !important;
      color: var(--tm-text-on-accent) !important;
      background: var(--tm-primary-background) !important;
      box-shadow: none !important;
      font-size: 13px;
      font-weight: 720;
      transition: transform 140ms ease, border-color 140ms ease, background-color 140ms ease;
    }

    html.${ROOT_CLASS} .tm-rarbg-catalog-picker .buttonalink:hover {
      transform: translateY(-1px);
      border-color: var(--tm-focus) !important;
      background: var(--tm-primary-background-hover) !important;
    }

    html.${ROOT_CLASS} .tm-rarbg-catalog-links {
      display: flex;
      align-items: center;
      justify-content: center;
      flex-wrap: wrap;
      gap: 8px;
    }

    html.${ROOT_CLASS} .tm-rarbg-catalog-links > div:first-child {
      flex: 0 0 100%;
    }

    html.${ROOT_CLASS} .tm-rarbg-catalog-links > a {
      display: inline-flex;
      max-width: 100%;
    }

    html.${ROOT_CLASS} .tm-rarbg-catalog-links .badge {
      display: inline-flex;
      min-height: 32px;
      margin: 0 !important;
      padding: 7px 11px !important;
      align-items: center;
      border: 1px solid var(--tm-border-strong) !important;
      border-radius: 999px !important;
      color: var(--tm-text-subtle) !important;
      background: var(--tm-panel-soft) !important;
      font-size: 12px !important;
      font-weight: 700;
      line-height: 1.2;
      overflow-wrap: anywhere;
      text-align: left;
    }

    html.${ROOT_CLASS} .tm-rarbg-catalog-links a:hover .badge {
      border-color: var(--tm-accent) !important;
      color: var(--tm-text-on-accent) !important;
      background: var(--tm-accent-soft) !important;
    }

    html.${ROOT_CLASS} .tm-rarbg-empty-catalog-row {
      display: none !important;
    }

    /* Movie and TV catalogue listings */
    html.${ROOT_CLASS}.${CATALOG_LIST_PAGE_CLASS} .tm-rarbg-catalog-filter {
      display: flex !important;
      margin: 0 0 16px !important;
      padding: 14px !important;
      align-items: center;
      flex-wrap: wrap;
      gap: 12px;
      border: 1px solid var(--tm-border);
      border-radius: 12px;
      background: var(--tm-panel-raised);
    }

    html.${ROOT_CLASS}.${CATALOG_LIST_PAGE_CLASS} .tm-rarbg-catalog-filter > h1 {
      margin: 0 !important;
      color: var(--tm-text) !important;
      font-size: 18px !important;
    }

    html.${ROOT_CLASS}.${CATALOG_LIST_PAGE_CLASS} .tm-rarbg-catalog-filter > form {
      display: flex !important;
      min-width: 0;
      margin: 0 !important;
      align-items: center;
      flex: 1 1 620px;
      flex-wrap: wrap;
      gap: 8px;
    }

    html.${ROOT_CLASS}.${CATALOG_LIST_PAGE_CLASS} .dropdown-filter {
      margin: 0 !important;
    }

    html.${ROOT_CLASS}.${CATALOG_LIST_PAGE_CLASS} .dropdown-filter > .dropdown-toggle {
      min-height: 38px;
      padding: 8px 34px 8px 12px !important;
      border: 1px solid var(--tm-border) !important;
      border-radius: 9px !important;
      color: var(--tm-text-soft) !important;
      background: var(--tm-input) !important;
    }

    html.${ROOT_CLASS}.${CATALOG_LIST_PAGE_CLASS} .dropdown-filter > .dropdown-toggle:hover,
    html.${ROOT_CLASS}.${CATALOG_LIST_PAGE_CLASS} .dropdown-filter > .dropdown-toggle.show {
      border-color: var(--tm-accent) !important;
      color: var(--tm-text) !important;
      background: var(--tm-control-hover) !important;
    }

    html.${ROOT_CLASS}.${CATALOG_LIST_PAGE_CLASS} .dropdown-menu {
      border: 1px solid var(--tm-border-strong) !important;
      border-radius: 10px !important;
      color: var(--tm-text) !important;
      background: var(--tm-panel) !important;
      box-shadow: var(--tm-shadow);
    }

    html.${ROOT_CLASS}.${CATALOG_LIST_PAGE_CLASS} .dropdown-menu .form-check-label,
    html.${ROOT_CLASS}.${CATALOG_LIST_PAGE_CLASS} .dropdown-menu .form-label,
    html.${ROOT_CLASS}.${CATALOG_LIST_PAGE_CLASS} .dropdown-menu .text-current {
      color: var(--tm-text-soft) !important;
    }

    html.${ROOT_CLASS}.${CATALOG_LIST_PAGE_CLASS} .dropdown-menu .btn-theme {
      border-color: var(--tm-accent-border) !important;
      color: var(--tm-text-on-accent) !important;
      background: var(--tm-primary-background) !important;
    }

    html.${ROOT_CLASS}.${CATALOG_LIST_PAGE_CLASS} a.btn-primary.buttonalink {
      border: 1px solid var(--tm-accent-border) !important;
      color: var(--tm-text-on-accent) !important;
      background: var(--tm-primary-background) !important;
      font-weight: 700;
      opacity: 1 !important;
      text-shadow: 0 1px 1px rgba(0, 0, 0, 0.35);
    }

    html.${ROOT_CLASS}.${CATALOG_LIST_PAGE_CLASS} a.btn-primary.buttonalink:hover,
    html.${ROOT_CLASS}.${CATALOG_LIST_PAGE_CLASS} a.btn-primary.buttonalink:focus {
      border-color: var(--tm-focus) !important;
      color: var(--tm-text-on-accent) !important;
      background: var(--tm-primary-background-hover) !important;
    }

    html.${ROOT_CLASS}.${CATALOG_LIST_PAGE_CLASS} .tm-rarbg-catalog-kind-toggle {
      border-color: var(--tm-border-strong) !important;
      color: var(--tm-text-soft) !important;
      background: var(--tm-panel-raised) !important;
      text-shadow: none;
    }

    html.${ROOT_CLASS}.${CATALOG_LIST_PAGE_CLASS} .tm-rarbg-catalog-kind-toggle:hover,
    html.${ROOT_CLASS}.${CATALOG_LIST_PAGE_CLASS} .tm-rarbg-catalog-kind-toggle:focus {
      color: var(--tm-text) !important;
      background: var(--tm-control-hover) !important;
    }

    html.${ROOT_CLASS}.${CATALOG_LIST_PAGE_CLASS} .tm-rarbg-catalog-kind-active,
    html.${ROOT_CLASS}.${CATALOG_LIST_PAGE_CLASS} .tm-rarbg-catalog-kind-active:hover,
    html.${ROOT_CLASS}.${CATALOG_LIST_PAGE_CLASS} .tm-rarbg-catalog-kind-active:focus {
      border-color: var(--tm-focus) !important;
      color: var(--tm-text-on-accent) !important;
      background: var(--tm-primary-background) !important;
      box-shadow: inset 0 -3px 0 var(--tm-focus), 0 0 0 2px var(--tm-accent-soft) !important;
      cursor: default;
    }

    html.${ROOT_CLASS}.${CATALOG_LIST_PAGE_CLASS} .tm-rarbg-catalog-result {
      display: grid !important;
      grid-template-columns: minmax(150px, 190px) minmax(0, 1fr);
      gap: 16px;
      margin: 0 0 14px !important;
      padding: 14px !important;
      border: 1px solid var(--tm-border) !important;
      border-radius: 12px;
      color: var(--tm-text-soft) !important;
      background: var(--tm-panel-raised) !important;
      box-shadow: var(--tm-shadow);
    }

    html.${ROOT_CLASS}.${CATALOG_LIST_PAGE_CLASS} .tm-rarbg-catalog-result > div {
      width: 100% !important;
      min-width: 0;
      padding: 0 !important;
    }

    html.${ROOT_CLASS}.${CATALOG_LIST_PAGE_CLASS}
      .tm-rarbg-catalog-result
      > div:first-child
      > img {
      display: block;
      width: 100% !important;
      max-width: 190px;
      aspect-ratio: 2 / 3;
      object-fit: cover;
      border: 1px solid var(--tm-border);
      border-radius: 9px;
      background: var(--tm-input);
    }

    html.${ROOT_CLASS}.${CATALOG_LIST_PAGE_CLASS}
      .tm-rarbg-catalog-result
      > div:first-child
      > br {
      display: none !important;
    }

    html.${ROOT_CLASS}.${CATALOG_LIST_PAGE_CLASS}
      .tm-rarbg-catalog-result
      > div:first-child
      > a {
      display: block;
      max-width: 190px;
      margin-top: 10px;
    }

    html.${ROOT_CLASS}.${CATALOG_LIST_PAGE_CLASS}
      .tm-rarbg-catalog-result
      > div:first-child
      .btn-small {
      width: 100%;
      min-height: 38px;
      padding: 8px 10px !important;
      border: 1px solid var(--tm-accent-border) !important;
      border-radius: 8px !important;
      color: var(--tm-text-on-accent) !important;
      background: var(--tm-primary-background) !important;
      text-align: center !important;
    }

    html.${ROOT_CLASS}.${CATALOG_LIST_PAGE_CLASS} .tm-rarbg-catalog-result .title {
      margin: 0 0 10px !important;
      padding: 10px 12px !important;
      border: 1px solid var(--tm-border);
      border-radius: 9px;
      color: var(--tm-text-soft) !important;
      background: var(--tm-panel-soft);
      line-height: 1.45;
      text-align: left !important;
    }

    html.${ROOT_CLASS}.${CATALOG_LIST_PAGE_CLASS} .tm-rarbg-catalog-result .title a {
      color: var(--tm-text-link) !important;
    }

    html.${ROOT_CLASS}.${CATALOG_LIST_PAGE_CLASS} .tm-rarbg-catalog-result table.table {
      display: table;
      width: 100% !important;
      min-width: 720px;
      margin: 0 !important;
      border-collapse: separate !important;
      border-spacing: 0;
      color: var(--tm-text-soft) !important;
      background: var(--tm-table) !important;
    }

    html.${ROOT_CLASS}.${CATALOG_LIST_PAGE_CLASS}
      .tm-rarbg-catalog-result
      > div:last-child {
      overflow-x: auto;
      scrollbar-color: var(--tm-scrollbar) var(--tm-input);
      scrollbar-width: thin;
    }

    html.${ROOT_CLASS}.${CATALOG_LIST_PAGE_CLASS} .tm-rarbg-catalog-result table.table td {
      padding: 10px !important;
      border-color: var(--tm-cell-border) !important;
      color: var(--tm-text-soft) !important;
      background: var(--tm-row) !important;
      vertical-align: middle;
    }

    html.${ROOT_CLASS}.${CATALOG_LIST_PAGE_CLASS}
      .tm-rarbg-catalog-result
      table.table
      tr:nth-child(even)
      td {
      background: var(--tm-row-alt) !important;
    }

    @media (max-width: 767.98px) {
      html.${ROOT_CLASS}.${CATALOG_LIST_PAGE_CLASS} .tm-rarbg-catalog-filter {
        align-items: stretch;
        flex-direction: column;
      }

      html.${ROOT_CLASS}.${CATALOG_LIST_PAGE_CLASS} .tm-rarbg-catalog-filter > form {
        flex-basis: auto;
      }

      html.${ROOT_CLASS}.${CATALOG_LIST_PAGE_CLASS} .tm-rarbg-catalog-result {
        grid-template-columns: minmax(120px, 150px) minmax(0, 1fr);
        padding: 12px !important;
      }
    }

    @media (max-width: 575.98px) {
      html.${ROOT_CLASS}.${CATALOG_LIST_PAGE_CLASS} .tm-rarbg-catalog-result {
        grid-template-columns: minmax(0, 1fr);
      }

      html.${ROOT_CLASS}.${CATALOG_LIST_PAGE_CLASS}
        .tm-rarbg-catalog-result
        > div:first-child
        > img,
      html.${ROOT_CLASS}.${CATALOG_LIST_PAGE_CLASS}
        .tm-rarbg-catalog-result
        > div:first-child
        > a {
        margin-right: auto;
        margin-left: auto;
      }
    }

    /* Compact main-page navigation */
    html.${ROOT_CLASS}.${MAIN_PAGE_LIST_CLASS} body.postBody.container {
      max-width: 1180px !important;
    }

    html.${ROOT_CLASS}.${MAIN_PAGE_LIST_CLASS} .tm-rarbg-main-list-shell {
      display: flex;
      min-height: 0 !important;
      flex-direction: column;
      gap: 12px;
      text-align: left !important;
    }

    html.${ROOT_CLASS}.${MAIN_PAGE_LIST_CLASS} .tm-rarbg-main-list-shell > br {
      display: none !important;
    }

    html.${ROOT_CLASS}.${MAIN_PAGE_LIST_CLASS} .tm-rarbg-main-list-header {
      display: flex;
      min-height: 76px;
      padding: 12px 16px;
      align-items: center;
      justify-content: space-between;
      gap: 16px;
      border: 1px solid var(--tm-border);
      border-radius: 14px;
      background: var(--tm-panel);
      box-shadow: var(--tm-shadow);
    }

    html.${ROOT_CLASS}.${MAIN_PAGE_LIST_CLASS} .tm-rarbg-main-list-logo-link {
      display: inline-flex;
      align-items: center;
    }

    html.${ROOT_CLASS}.${MAIN_PAGE_LIST_CLASS} .tm-rarbg-main-list-logo-link .logo {
      width: 140px !important;
      margin: 0 !important;
    }

    html.${ROOT_CLASS}.${MAIN_PAGE_LIST_CLASS} .tm-rarbg-main-list-panel {
      display: block !important;
      width: 100% !important;
      padding: 18px !important;
      border: 1px solid var(--tm-border) !important;
      border-radius: 14px !important;
      background: var(--tm-panel) !important;
      box-shadow: var(--tm-shadow);
      text-align: left !important;
    }

    html.${ROOT_CLASS}.${MAIN_PAGE_LIST_CLASS} .tm-rarbg-main-list-panel > br {
      display: none !important;
    }

    html.${ROOT_CLASS}.${MAIN_PAGE_LIST_CLASS} .tm-rarbg-main-list-panel .tm-rarbg-adult-control {
      margin: 0 0 12px !important;
      justify-content: flex-end;
    }

    html.${ROOT_CLASS}.${MAIN_PAGE_LIST_CLASS} .tm-rarbg-main-list-search {
      display: block !important;
      margin: 0 0 18px !important;
      padding: 14px !important;
      border: 1px solid var(--tm-border);
      border-radius: 12px;
      background: var(--tm-panel-raised);
    }

    html.${ROOT_CLASS}.${MAIN_PAGE_LIST_CLASS} .tm-rarbg-main-list-search #form_search {
      display: grid;
      grid-template-columns: minmax(0, 1fr);
      gap: 10px;
    }

    html.${ROOT_CLASS}.${MAIN_PAGE_LIST_CLASS} .tm-rarbg-main-list-search #filterOption,
    html.${ROOT_CLASS}.${MAIN_PAGE_LIST_CLASS}
      .tm-rarbg-main-list-search
      #form_search
      > div:last-of-type {
      grid-column: 1;
      grid-row: auto;
    }

    html.${ROOT_CLASS}.${MAIN_PAGE_LIST_CLASS} .tm-rarbg-main-list-tiles {
      display: grid !important;
      grid-template-columns: repeat(3, minmax(0, 1fr));
      gap: 10px;
      width: 100% !important;
    }

    html.${ROOT_CLASS}.${MAIN_PAGE_LIST_CLASS} .tm-rarbg-main-list-tiles .tile {
      width: auto !important;
      min-width: 0;
      min-height: 98px;
      margin: 0 !important;
      padding: 0 !important;
      border: 0 !important;
      background: transparent !important;
    }

    html.${ROOT_CLASS}.${MAIN_PAGE_LIST_CLASS} .tm-rarbg-main-list-tiles .tile > a {
      display: flex;
      width: 100%;
      height: 100%;
      min-height: 98px;
      padding: 16px;
      align-items: center;
      justify-content: center;
      flex-direction: column;
      gap: 8px;
      border: 1px solid var(--tm-accent-border-soft);
      border-radius: 11px;
      color: var(--tm-text) !important;
      background: var(--tm-primary-background) !important;
      font-size: 16px;
      font-weight: 700;
      text-align: center;
      transition: transform 140ms ease, border-color 140ms ease, background-color 140ms ease;
    }

    html.${ROOT_CLASS}.${MAIN_PAGE_LIST_CLASS} .tm-rarbg-main-list-tiles .tile > a:hover {
      transform: translateY(-2px);
      border-color: var(--tm-accent) !important;
      background: var(--tm-control-hover) !important;
    }

    html.${ROOT_CLASS}.${MAIN_PAGE_LIST_CLASS} .tm-rarbg-main-list-tiles .tile i {
      color: var(--tm-focus);
      font-size: 18px;
    }

    /* Poster-card feature listings */
    html.${ROOT_CLASS}.${FEATURE_LIST_PAGE_CLASS} .tm-rarbg-feature-title {
      margin: 0 0 18px !important;
      padding: 4px 2px 14px !important;
      border-bottom: 1px solid var(--tm-border);
      color: var(--tm-text) !important;
      font-size: clamp(22px, 2.2vw, 32px) !important;
      line-height: 1.25;
    }

    html.${ROOT_CLASS}.${FEATURE_LIST_PAGE_CLASS} .postCont > .row.p-4 {
      margin: 0 !important;
      padding: 0 !important;
    }

    html.${ROOT_CLASS}.${FEATURE_LIST_PAGE_CLASS} [class*="col-"]:has(> .tm-rarbg-feature-card) {
      display: flex;
    }

    html.${ROOT_CLASS}.${FEATURE_LIST_PAGE_CLASS} .tm-rarbg-feature-card {
      display: flex;
      width: 100%;
      height: 100%;
      overflow: hidden;
      flex-direction: column;
      border: 1px solid var(--tm-border) !important;
      border-radius: 12px !important;
      color: var(--tm-text) !important;
      background: var(--tm-panel-raised) !important;
      box-shadow: var(--tm-shadow) !important;
      cursor: pointer;
      transition: transform 140ms ease, border-color 140ms ease;
    }

    html.${ROOT_CLASS}.${FEATURE_LIST_PAGE_CLASS} .tm-rarbg-feature-card:hover {
      transform: translateY(-2px);
      border-color: var(--tm-accent) !important;
    }

    html.${ROOT_CLASS}.${FEATURE_LIST_PAGE_CLASS} .tm-rarbg-feature-card > a,
    html.${ROOT_CLASS}.${FEATURE_LIST_PAGE_CLASS} .tm-rarbg-feature-card > img {
      display: block;
      width: 100%;
    }

    html.${ROOT_CLASS}.${FEATURE_LIST_PAGE_CLASS} .tm-rarbg-feature-card img.img-fluid {
      width: 100%;
      aspect-ratio: 2 / 3;
      object-fit: cover;
      background: var(--tm-input);
    }

    html.${ROOT_CLASS}.${FEATURE_LIST_PAGE_CLASS} .tm-rarbg-feature-card > .p-4 {
      display: flex;
      padding: 14px !important;
      flex: 1 1 auto;
      flex-direction: column;
      gap: 10px;
    }

    html.${ROOT_CLASS}.${FEATURE_LIST_PAGE_CLASS} .tm-rarbg-feature-card h5 {
      margin: 0 !important;
      font-size: 15px;
      line-height: 1.35;
    }

    html.${ROOT_CLASS}.${FEATURE_LIST_PAGE_CLASS} .tm-rarbg-feature-card .text-dark,
    html.${ROOT_CLASS}.${FEATURE_LIST_PAGE_CLASS} .tm-rarbg-feature-card h5 a {
      color: var(--tm-text-link) !important;
    }

    html.${ROOT_CLASS}.${FEATURE_LIST_PAGE_CLASS} .tm-rarbg-feature-card .text-muted {
      display: -webkit-box;
      overflow: hidden;
      color: var(--tm-muted) !important;
      -webkit-box-orient: vertical;
      -webkit-line-clamp: 4;
    }

    html.${ROOT_CLASS}.${FEATURE_LIST_PAGE_CLASS} .tm-rarbg-feature-card .bg-light {
      margin-top: auto !important;
      border: 1px solid var(--tm-border);
      color: var(--tm-text-soft) !important;
      background: var(--tm-input) !important;
    }

    html.${ROOT_CLASS}.${FEATURE_LIST_PAGE_CLASS} .tm-rarbg-feature-card .badge-danger,
    html.${ROOT_CLASS}.${FEATURE_LIST_PAGE_CLASS} .tm-rarbg-feature-card .badge.badge-danger {
      color: var(--tm-text-on-accent) !important;
      background: var(--tm-danger) !important;
    }

    html.${ROOT_CLASS}.${FEATURE_LIST_PAGE_CLASS} .modal-content {
      overflow: hidden;
      border: 1px solid var(--tm-border-strong) !important;
      border-radius: 12px !important;
      color: var(--tm-text) !important;
      background: var(--tm-panel) !important;
      box-shadow: var(--tm-shadow);
    }

    html.${ROOT_CLASS}.${FEATURE_LIST_PAGE_CLASS} .modal-header {
      border-bottom-color: var(--tm-border) !important;
      background: var(--tm-panel-raised) !important;
    }

    html.${ROOT_CLASS}.${FEATURE_LIST_PAGE_CLASS} .modal-body {
      background: var(--tm-bg) !important;
    }

    @media (max-width: 767.98px) {
      html.${ROOT_CLASS}.${MAIN_PAGE_LIST_CLASS} .tm-rarbg-main-list-tiles {
        grid-template-columns: repeat(2, minmax(0, 1fr));
      }

      html.${ROOT_CLASS}.${MAIN_PAGE_LIST_CLASS} .tm-rarbg-main-list-header,
      html.${ROOT_CLASS}.${MAIN_PAGE_LIST_CLASS} .tm-rarbg-main-list-panel {
        padding: 12px !important;
      }
    }

    @media (max-width: 479.98px) {
      html.${ROOT_CLASS}.${MAIN_PAGE_LIST_CLASS} .tm-rarbg-main-list-header {
        align-items: stretch;
        flex-direction: column;
      }

      html.${ROOT_CLASS}.${MAIN_PAGE_LIST_CLASS} .tm-rarbg-main-list-header .tm-rarbg-palette-control {
        width: 100%;
      }

      html.${ROOT_CLASS}.${MAIN_PAGE_LIST_CLASS} .tm-rarbg-main-list-header .tm-rarbg-palette-select {
        flex: 1 1 auto;
      }

      html.${ROOT_CLASS}.${MAIN_PAGE_LIST_CLASS} .tm-rarbg-main-list-tiles {
        grid-template-columns: minmax(0, 1fr);
      }
    }

    /* Torrent detail page */
    html.${ROOT_CLASS}.${POST_DETAIL_PAGE_CLASS} .tm-rarbg-detail-supporting-section {
      margin: 0 0 14px !important;
      padding: 12px !important;
      border: 1px solid var(--tm-border);
      border-radius: 12px;
      background: var(--tm-panel-raised);
    }

    html.${ROOT_CLASS}.${POST_DETAIL_PAGE_CLASS} .tm-rarbg-detail-title {
      margin: 0 0 14px !important;
      padding: 16px 18px !important;
      border: 1px solid var(--tm-accent-border-soft);
      border-radius: 12px;
      color: var(--tm-text) !important;
      background: var(--tm-toolbar-background);
      font-size: clamp(18px, 2vw, 24px) !important;
      font-weight: 760 !important;
      line-height: 1.3;
      overflow-wrap: anywhere;
      text-align: left !important;
    }

    html.${ROOT_CLASS}.${POST_DETAIL_PAGE_CLASS} .tm-rarbg-detail-table-wrapper {
      width: 100%;
      overflow-x: auto;
      border: 1px solid var(--tm-border);
      border-radius: 12px;
      background: var(--tm-table);
      scrollbar-color: var(--tm-scrollbar) var(--tm-input);
      scrollbar-width: thin;
    }

    html.${ROOT_CLASS}.${POST_DETAIL_PAGE_CLASS} .tm-rarbg-detail-table {
      width: 100% !important;
      margin: 0 !important;
      border: 0 !important;
      border-collapse: separate !important;
      border-spacing: 0 !important;
      color: var(--tm-text) !important;
      background: var(--tm-table) !important;
      table-layout: auto;
    }

    html.${ROOT_CLASS}.${POST_DETAIL_PAGE_CLASS}
      .tm-rarbg-detail-table
      > tbody
      > tr
      > th {
      width: 180px;
      min-width: 150px;
      padding: 12px !important;
      border: 0 !important;
      border-right: 1px solid var(--tm-cell-border-strong) !important;
      border-bottom: 1px solid var(--tm-cell-border-strong) !important;
      color: var(--tm-text-subtle) !important;
      background: var(--tm-panel-soft) !important;
      font-size: 12px;
      font-weight: 780;
      line-height: 1.35;
      overflow-wrap: anywhere;
      text-align: left !important;
      vertical-align: top;
    }

    html.${ROOT_CLASS}.${POST_DETAIL_PAGE_CLASS}
      .tm-rarbg-detail-table
      > tbody
      > tr
      > td {
      min-width: 0;
      padding: 12px !important;
      border: 0 !important;
      border-bottom: 1px solid var(--tm-cell-border-strong) !important;
      color: var(--tm-text-soft) !important;
      background: var(--tm-row) !important;
      font-size: 13.5px;
      line-height: 1.5;
      overflow-wrap: anywhere;
      text-align: left;
      vertical-align: top;
    }

    html.${ROOT_CLASS}.${POST_DETAIL_PAGE_CLASS}
      .tm-rarbg-detail-table
      > tbody
      > tr:nth-child(even)
      > td {
      background: var(--tm-row-alt) !important;
    }

    html.${ROOT_CLASS}.${POST_DETAIL_PAGE_CLASS}
      .tm-rarbg-detail-table
      > tbody
      > tr:last-child
      > th,
    html.${ROOT_CLASS}.${POST_DETAIL_PAGE_CLASS}
      .tm-rarbg-detail-table
      > tbody
      > tr:last-child
      > td {
      border-bottom: 0 !important;
    }

    html.${ROOT_CLASS}.${POST_DETAIL_PAGE_CLASS} #lnk-warning > th {
      color: var(--tm-text-on-accent) !important;
      background: var(--tm-danger) !important;
    }

    html.${ROOT_CLASS}.${POST_DETAIL_PAGE_CLASS} #lnk-warning > td {
      border-left: 4px solid var(--tm-danger) !important;
      color: var(--tm-danger) !important;
      background: var(--tm-panel-raised) !important;
      font-weight: 700;
    }

    html.${ROOT_CLASS}.${POST_DETAIL_PAGE_CLASS} .tm-rarbg-detail-table .text-muted,
    html.${ROOT_CLASS}.${POST_DETAIL_PAGE_CLASS} .comment-section .text-muted {
      color: var(--tm-muted) !important;
      opacity: 1 !important;
    }

    html.${ROOT_CLASS}.${POST_DETAIL_PAGE_CLASS} .comment-section .text-danger {
      color: var(--tm-danger) !important;
      opacity: 1 !important;
    }

    html.${ROOT_CLASS}.${POST_DETAIL_PAGE_CLASS} .tm-rarbg-detail-table .text-primary {
      color: var(--tm-accent) !important;
    }

    html.${ROOT_CLASS}.${POST_DETAIL_PAGE_CLASS} .download-options,
    html.${ROOT_CLASS}.${POST_DETAIL_PAGE_CLASS} .download-primary,
    html.${ROOT_CLASS}.${POST_DETAIL_PAGE_CLASS} .download-secondary,
    html.${ROOT_CLASS}.${POST_DETAIL_PAGE_CLASS} .report-buttons {
      display: flex;
      min-width: 0;
      align-items: center;
      flex-wrap: wrap;
      gap: 9px;
    }

    html.${ROOT_CLASS}.${POST_DETAIL_PAGE_CLASS} .download-options {
      align-items: stretch;
      flex-direction: column;
    }

    html.${ROOT_CLASS}.${POST_DETAIL_PAGE_CLASS} .download-primary,
    html.${ROOT_CLASS}.${POST_DETAIL_PAGE_CLASS} .download-secondary {
      width: 100%;
    }

    html.${ROOT_CLASS}.${POST_DETAIL_PAGE_CLASS} .btn-download,
    html.${ROOT_CLASS}.${POST_DETAIL_PAGE_CLASS} .postContL .btn-small,
    html.${ROOT_CLASS}.${POST_DETAIL_PAGE_CLASS} .comment-btn {
      display: inline-flex !important;
      min-height: 40px;
      margin: 0 !important;
      padding: 8px 13px !important;
      align-items: center;
      justify-content: center;
      gap: 7px;
      border: 1px solid var(--tm-border-strong) !important;
      border-radius: 9px !important;
      color: var(--tm-text) !important;
      background: var(--tm-control) !important;
      box-shadow: none !important;
      font: inherit;
      font-size: 12.5px;
      font-weight: 720;
      line-height: 1.2;
      cursor: pointer;
      transition: transform 140ms ease, border-color 140ms ease, background-color 140ms ease;
    }

    html.${ROOT_CLASS}.${POST_DETAIL_PAGE_CLASS} .btn-download {
      min-height: 44px;
      border-color: var(--tm-accent-border) !important;
      color: var(--tm-text-on-accent) !important;
      background: var(--tm-primary-background) !important;
    }

    html.${ROOT_CLASS}.${POST_DETAIL_PAGE_CLASS} .btn-download:hover,
    html.${ROOT_CLASS}.${POST_DETAIL_PAGE_CLASS} .postContL .btn-small:hover,
    html.${ROOT_CLASS}.${POST_DETAIL_PAGE_CLASS} .comment-btn:hover {
      transform: translateY(-1px);
      border-color: var(--tm-focus) !important;
      color: var(--tm-text-on-accent) !important;
      background: var(--tm-primary-background-hover) !important;
    }

    html.${ROOT_CLASS}.${POST_DETAIL_PAGE_CLASS} .torrent-info {
      display: inline-flex;
      min-width: 0;
      min-height: 40px;
      padding: 8px 11px;
      align-items: center;
      flex: 1 1 300px;
      flex-wrap: wrap;
      gap: 5px 8px;
      border: 1px solid var(--tm-border);
      border-radius: 9px;
      color: var(--tm-text-soft);
      background: var(--tm-input);
    }

    html.${ROOT_CLASS}.${POST_DETAIL_PAGE_CLASS} .info-hash-label {
      color: var(--tm-muted);
      font-size: 11px;
      font-weight: 780;
      letter-spacing: 0.04em;
      text-transform: uppercase;
    }

    html.${ROOT_CLASS}.${POST_DETAIL_PAGE_CLASS} .info-hash-value {
      min-width: 0;
      color: var(--tm-text-subtle);
      font-family: ui-monospace, SFMono-Regular, Consolas, "Liberation Mono", monospace;
      font-size: 12px;
      overflow-wrap: anywhere;
    }

    html.${ROOT_CLASS}.${POST_DETAIL_PAGE_CLASS} .report-buttons {
      margin-top: 2px;
    }

    html.${ROOT_CLASS}.${POST_DETAIL_PAGE_CLASS}
      .tm-rarbg-detail-row-images
      > td
      > .row {
      display: grid !important;
      margin: 0 !important;
      grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
      gap: 12px;
    }

    html.${ROOT_CLASS}.${POST_DETAIL_PAGE_CLASS}
      .tm-rarbg-detail-row-images
      > td
      > .row
      > .col {
      width: auto !important;
      max-width: none !important;
      margin: 0 !important;
      padding: 0 !important;
    }

    html.${ROOT_CLASS}.${POST_DETAIL_PAGE_CLASS} .tm-rarbg-detail-row-images img {
      display: block;
      width: 100%;
      max-height: 620px;
      margin: 0 !important;
      object-fit: contain;
      border: 1px solid var(--tm-border-strong);
      border-radius: 10px !important;
      background: var(--tm-input);
      box-shadow: 0 10px 28px rgba(0, 0, 0, 0.32);
      cursor: zoom-in;
    }

    html.${ROOT_CLASS}.${POST_DETAIL_PAGE_CLASS}
      .tm-rarbg-detail-row-description
      > td
      > div {
      max-height: min(68vh, 680px);
      padding: 14px !important;
      overflow: auto;
      border: 1px solid var(--tm-border);
      border-radius: 10px;
      color: var(--tm-text-soft) !important;
      background: var(--tm-input) !important;
      font-family: ui-monospace, SFMono-Regular, Consolas, "Liberation Mono", monospace;
      font-size: 12.5px;
      line-height: 1.55;
      scrollbar-color: var(--tm-scrollbar) var(--tm-input);
      scrollbar-width: thin;
      tab-size: 2;
    }

    html.${ROOT_CLASS}.${POST_DETAIL_PAGE_CLASS} #filelist {
      margin: 0 !important;
      padding: 5px 12px !important;
      border: 1px solid var(--tm-border);
      border-radius: 10px;
      color: var(--tm-text-soft) !important;
      background: var(--tm-input) !important;
    }

    html.${ROOT_CLASS}.${POST_DETAIL_PAGE_CLASS} #filelist ol {
      margin: 0 !important;
      padding-left: 24px !important;
    }

    html.${ROOT_CLASS}.${POST_DETAIL_PAGE_CLASS} #filelist li {
      padding: 9px 4px;
      border-bottom: 1px solid var(--tm-cell-border);
    }

    html.${ROOT_CLASS}.${POST_DETAIL_PAGE_CLASS} #filelist li:last-child {
      border-bottom: 0;
    }

    html.${ROOT_CLASS}.${POST_DETAIL_PAGE_CLASS} #filelist .file-name {
      color: var(--tm-text-subtle);
      overflow-wrap: anywhere;
    }

    html.${ROOT_CLASS}.${POST_DETAIL_PAGE_CLASS} #filelist .file-size {
      margin-left: 8px;
      color: var(--tm-muted);
      white-space: nowrap;
    }

    html.${ROOT_CLASS}.${POST_DETAIL_PAGE_CLASS}
      .tm-rarbg-detail-row-trackers
      .table-responsive,
    html.${ROOT_CLASS}.${POST_DETAIL_PAGE_CLASS} .similar-posts-container .table-responsive {
      overflow-x: auto;
      border: 1px solid var(--tm-border);
      border-radius: 10px;
      background: var(--tm-table);
      scrollbar-color: var(--tm-scrollbar) var(--tm-input);
      scrollbar-width: thin;
    }

    html.${ROOT_CLASS}.${POST_DETAIL_PAGE_CLASS} .tm-rarbg-detail-row-trackers table.table {
      --bs-table-bg: transparent;
      --bs-table-accent-bg: transparent;
      --bs-table-striped-bg: transparent;
      --bs-table-hover-bg: var(--tm-row-hover);
      width: 100%;
      min-width: 560px;
      margin: 0 !important;
      border: 0 !important;
      border-collapse: separate;
      border-spacing: 0;
      color: var(--tm-text-soft) !important;
      background: var(--tm-table) !important;
    }

    html.${ROOT_CLASS}.${POST_DETAIL_PAGE_CLASS}
      .tm-rarbg-detail-row-trackers
      table.table
      th,
    html.${ROOT_CLASS}.${POST_DETAIL_PAGE_CLASS}
      .tm-rarbg-detail-row-trackers
      table.table
      td {
      padding: 9px 10px !important;
      border: 0 !important;
      border-right: 1px solid var(--tm-cell-border) !important;
      border-bottom: 1px solid var(--tm-cell-border) !important;
      color: var(--tm-text-soft) !important;
      background: transparent !important;
      box-shadow: none !important;
    }

    html.${ROOT_CLASS}.${POST_DETAIL_PAGE_CLASS}
      .tm-rarbg-detail-row-trackers
      table.table
      thead {
      color: var(--tm-text) !important;
      background: var(--tm-table-head) !important;
    }

    html.${ROOT_CLASS}.${POST_DETAIL_PAGE_CLASS}
      .tm-rarbg-detail-row-trackers
      table.table
      tbody {
      background: var(--tm-table) !important;
    }

    html.${ROOT_CLASS}.${POST_DETAIL_PAGE_CLASS}
      .tm-rarbg-detail-row-trackers
      table.table
      tbody
      tr {
      background: var(--tm-row) !important;
    }

    html.${ROOT_CLASS}.${POST_DETAIL_PAGE_CLASS}
      .tm-rarbg-detail-row-trackers
      table.table
      tbody
      tr:nth-child(even) {
      background: var(--tm-row-alt) !important;
    }

    html.${ROOT_CLASS}.${POST_DETAIL_PAGE_CLASS}
      .tm-rarbg-detail-row-trackers
      table.table-hover
      tbody
      tr:hover
      > * {
      --bs-table-accent-bg: transparent;
      color: var(--tm-text) !important;
      background: var(--tm-row-hover) !important;
      box-shadow: none !important;
    }

    html.${ROOT_CLASS}.${POST_DETAIL_PAGE_CLASS} .similar-posts-container {
      width: 100%;
      min-width: 0;
    }

    html.${ROOT_CLASS}.${POST_DETAIL_PAGE_CLASS}
      .similar-posts-container
      table.sortableTable2 {
      min-width: 720px;
    }

    html.${ROOT_CLASS}.${POST_DETAIL_PAGE_CLASS}
      .similar-posts-container
      table.sortableTable2
      th:nth-child(1),
    html.${ROOT_CLASS}.${POST_DETAIL_PAGE_CLASS}
      .similar-posts-container
      table.sortableTable2
      td:nth-child(1) {
      width: 50% !important;
      white-space: normal !important;
    }

    html.${ROOT_CLASS}.${POST_DETAIL_PAGE_CLASS}
      .similar-posts-container
      table.sortableTable2
      th:nth-child(2),
    html.${ROOT_CLASS}.${POST_DETAIL_PAGE_CLASS}
      .similar-posts-container
      table.sortableTable2
      td:nth-child(2) {
      width: 12% !important;
    }

    html.${ROOT_CLASS}.${POST_DETAIL_PAGE_CLASS}
      .similar-posts-container
      table.sortableTable2
      th:nth-child(3),
    html.${ROOT_CLASS}.${POST_DETAIL_PAGE_CLASS}
      .similar-posts-container
      table.sortableTable2
      td:nth-child(3) {
      width: 14% !important;
    }

    html.${ROOT_CLASS}.${POST_DETAIL_PAGE_CLASS}
      .similar-posts-container
      table.sortableTable2
      th:nth-child(4),
    html.${ROOT_CLASS}.${POST_DETAIL_PAGE_CLASS}
      .similar-posts-container
      table.sortableTable2
      td:nth-child(4),
    html.${ROOT_CLASS}.${POST_DETAIL_PAGE_CLASS}
      .similar-posts-container
      table.sortableTable2
      th:nth-child(5),
    html.${ROOT_CLASS}.${POST_DETAIL_PAGE_CLASS}
      .similar-posts-container
      table.sortableTable2
      td:nth-child(5) {
      width: 6% !important;
      text-align: center;
    }

    html.${ROOT_CLASS}.${POST_DETAIL_PAGE_CLASS}
      .similar-posts-container
      table.sortableTable2
      th:nth-child(6),
    html.${ROOT_CLASS}.${POST_DETAIL_PAGE_CLASS}
      .similar-posts-container
      table.sortableTable2
      td:nth-child(6) {
      width: 12% !important;
    }

    html.${ROOT_CLASS}.${POST_DETAIL_PAGE_CLASS}
      .similar-posts-container
      table.sortableTable2
      td:first-child
      a {
      color: var(--tm-text-link) !important;
      font-size: 13.5px;
      font-weight: 690;
      line-height: 1.4;
      overflow-wrap: anywhere;
    }

    html.${ROOT_CLASS}.${POST_DETAIL_PAGE_CLASS}
      .similar-posts-container
      table.sortableTable2
      td:nth-child(4) {
      color: var(--tm-success) !important;
      font-weight: 800;
    }

    html.${ROOT_CLASS}.${POST_DETAIL_PAGE_CLASS}
      .similar-posts-container
      table.sortableTable2
      td:nth-child(5) {
      color: var(--tm-danger) !important;
      font-weight: 750;
    }

    html.${ROOT_CLASS}.${POST_DETAIL_PAGE_CLASS} .detailTable .badge {
      border: 1px solid var(--tm-accent-border-soft) !important;
      color: var(--tm-text-on-accent) !important;
      background: var(--tm-accent-strong) !important;
      font-size: 10px;
    }

    html.${ROOT_CLASS}.${POST_DETAIL_PAGE_CLASS}
      .similar-posts-container
      .dataTables_wrapper {
      border: 0;
      border-radius: 0;
      background: transparent;
    }

    html.${ROOT_CLASS}.${POST_DETAIL_PAGE_CLASS} .comment-section {
      --comment-bg: var(--tm-panel-raised);
      --comment-border: var(--tm-border);
      --comment-hover: var(--tm-row-hover);
      --comment-text: var(--tm-text-soft);
      --comment-meta: var(--tm-muted);
      --primary-color: var(--tm-accent);
      --secondary-color: var(--tm-muted);
      --success-color: var(--tm-success);
      --upvote-color: var(--tm-warning);
      --downvote-color: var(--tm-accent);
      --thread-line-color: var(--tm-border-strong);
      width: 100%;
      max-width: none !important;
      margin: 16px 0 0 !important;
      padding: 0 !important;
      border: 1px solid var(--tm-border);
      border-radius: 12px;
      color: var(--tm-text-soft) !important;
      background: var(--tm-panel) !important;
    }

    html.${ROOT_CLASS}.${POST_DETAIL_PAGE_CLASS} .comment-section > .container {
      width: 100% !important;
      max-width: none !important;
      margin: 0 !important;
      padding: 16px !important;
    }

    html.${ROOT_CLASS}.${POST_DETAIL_PAGE_CLASS} .comment-section hr {
      display: none;
    }

    html.${ROOT_CLASS}.${POST_DETAIL_PAGE_CLASS} .comment-heading {
      margin: 0 0 14px !important;
      padding: 0 0 10px !important;
      border-bottom: 1px solid var(--tm-border) !important;
      color: var(--tm-text) !important;
      font-size: 20px;
    }

    html.${ROOT_CLASS}.${POST_DETAIL_PAGE_CLASS} .comment-form,
    html.${ROOT_CLASS}.${POST_DETAIL_PAGE_CLASS} .comment,
    html.${ROOT_CLASS}.${POST_DETAIL_PAGE_CLASS} .reply-form {
      border: 1px solid var(--tm-border) !important;
      border-radius: 10px !important;
      color: var(--tm-text-soft) !important;
      background: var(--tm-panel-raised) !important;
      box-shadow: none !important;
    }

    html.${ROOT_CLASS}.${POST_DETAIL_PAGE_CLASS} .comment-form {
      margin-bottom: 18px !important;
      padding: 14px !important;
    }

    html.${ROOT_CLASS}.${POST_DETAIL_PAGE_CLASS} .comment-form .comment-btn {
      margin-top: 10px !important;
    }

    html.${ROOT_CLASS}.${POST_DETAIL_PAGE_CLASS} .tm-rarbg-detail-back-row {
      width: 100%;
      margin: 0 !important;
      padding: 18px 0 12px !important;
      justify-content: center;
    }

    html.${ROOT_CLASS}.${POST_DETAIL_PAGE_CLASS} .tm-rarbg-detail-back-row > div {
      width: auto !important;
      margin: 0 !important;
      padding: 0 !important;
    }

    html.${ROOT_CLASS}.${POST_DETAIL_PAGE_CLASS} .comment-form label,
    html.${ROOT_CLASS}.${POST_DETAIL_PAGE_CLASS} .comment-username,
    html.${ROOT_CLASS}.${POST_DETAIL_PAGE_CLASS} .comment-body,
    html.${ROOT_CLASS}.${POST_DETAIL_PAGE_CLASS} .vote-count {
      color: var(--tm-text-soft) !important;
    }

    html.${ROOT_CLASS}.${POST_DETAIL_PAGE_CLASS} .comment-time,
    html.${ROOT_CLASS}.${POST_DETAIL_PAGE_CLASS} .comment-action,
    html.${ROOT_CLASS}.${POST_DETAIL_PAGE_CLASS} .vote-button {
      color: var(--tm-muted) !important;
    }

    html.${ROOT_CLASS}.${POST_DETAIL_PAGE_CLASS} .comment-action:hover,
    html.${ROOT_CLASS}.${POST_DETAIL_PAGE_CLASS} .vote-button:hover {
      color: var(--tm-focus) !important;
    }

    html.${ROOT_CLASS}.${POST_DETAIL_PAGE_CLASS} .vote-button.upvote:hover,
    html.${ROOT_CLASS}.${POST_DETAIL_PAGE_CLASS} .vote-button.active.upvote {
      color: var(--upvote-color) !important;
    }

    html.${ROOT_CLASS}.${POST_DETAIL_PAGE_CLASS} .vote-button.downvote:hover,
    html.${ROOT_CLASS}.${POST_DETAIL_PAGE_CLASS} .vote-button.active.downvote {
      color: var(--downvote-color) !important;
    }

    html.${ROOT_CLASS}.${POST_DETAIL_PAGE_CLASS} .comment-btn:disabled,
    html.${ROOT_CLASS}.${POST_DETAIL_PAGE_CLASS} .comment-btn:disabled:hover {
      transform: none;
      border-color: var(--tm-border) !important;
      color: var(--tm-muted) !important;
      background: var(--tm-panel-soft) !important;
      opacity: 0.65;
      cursor: not-allowed;
    }

    html.${ROOT_CLASS}.${POST_DETAIL_PAGE_CLASS} .comment-textarea,
    html.${ROOT_CLASS}.${POST_DETAIL_PAGE_CLASS} .modal-dialog .form-control {
      width: 100%;
      min-height: 42px;
      padding: 10px 12px !important;
      border: 1px solid var(--tm-border-strong) !important;
      border-radius: 9px !important;
      color: var(--tm-text) !important;
      background: var(--tm-input) !important;
      box-shadow: none !important;
      font: inherit;
      resize: vertical;
      color-scheme: dark;
    }

    html.${ROOT_CLASS}.${POST_DETAIL_PAGE_CLASS} .comment-textarea:focus,
    html.${ROOT_CLASS}.${POST_DETAIL_PAGE_CLASS} .modal-dialog .form-control:focus {
      border-color: var(--tm-accent) !important;
      box-shadow: 0 0 0 3px var(--tm-accent-soft) !important;
    }

    html.${ROOT_CLASS}.${POST_DETAIL_PAGE_CLASS} .modal-backdrop.show {
      background: var(--tm-bg) !important;
      opacity: 0.8 !important;
    }

    html.${ROOT_CLASS}.${POST_DETAIL_PAGE_CLASS} .modal-dialog .modal-content {
      overflow: hidden;
      border: 1px solid var(--tm-border-strong) !important;
      border-radius: 12px !important;
      color: var(--tm-text-soft) !important;
      background: var(--tm-panel-raised) !important;
      box-shadow: var(--tm-shadow) !important;
    }

    html.${ROOT_CLASS}.${POST_DETAIL_PAGE_CLASS} .modal-dialog table.table {
      --bs-table-color: var(--tm-text-soft);
      --bs-table-bg: transparent;
      --bs-table-accent-bg: transparent;
      --bs-table-striped-bg: transparent;
      --bs-table-border-color: var(--tm-cell-border);
      --bs-table-hover-color: var(--tm-text);
      --bs-table-hover-bg: var(--tm-row-hover);
      width: 100%;
      margin: 0 !important;
      color: var(--tm-text-soft) !important;
      background: var(--tm-table) !important;
    }

    html.${ROOT_CLASS}.${POST_DETAIL_PAGE_CLASS} .modal-dialog table.table th,
    html.${ROOT_CLASS}.${POST_DETAIL_PAGE_CLASS} .modal-dialog table.table td {
      padding: 9px 10px !important;
      border-color: var(--tm-cell-border) !important;
      color: var(--tm-text-soft) !important;
      background: transparent !important;
      box-shadow: none !important;
    }

    html.${ROOT_CLASS}.${POST_DETAIL_PAGE_CLASS} .modal-dialog table.table thead {
      color: var(--tm-text) !important;
      background: var(--tm-table-head) !important;
    }

    html.${ROOT_CLASS}.${POST_DETAIL_PAGE_CLASS} .modal-dialog table.table tbody {
      background: var(--tm-table) !important;
    }

    html.${ROOT_CLASS}.${POST_DETAIL_PAGE_CLASS} .modal-dialog table.table tbody tr {
      background: var(--tm-row) !important;
    }

    html.${ROOT_CLASS}.${POST_DETAIL_PAGE_CLASS}
      .modal-dialog
      table.table
      tbody
      tr:nth-child(even) {
      background: var(--tm-row-alt) !important;
    }

    html.${ROOT_CLASS}.${POST_DETAIL_PAGE_CLASS} .modal-dialog table.table tbody tr:hover > * {
      --bs-table-accent-bg: transparent;
      color: var(--tm-text) !important;
      background: var(--tm-row-hover) !important;
      box-shadow: none !important;
    }

    html.${ROOT_CLASS}.${POST_DETAIL_PAGE_CLASS} .modal-dialog table.table .table-danger,
    html.${ROOT_CLASS}.${POST_DETAIL_PAGE_CLASS} .modal-dialog table.table tr.table-danger,
    html.${ROOT_CLASS}.${POST_DETAIL_PAGE_CLASS} .modal-dialog table.table tr.table-danger > * {
      color: var(--tm-danger) !important;
      background: var(--tm-panel-soft) !important;
    }

    html.${ROOT_CLASS}.${POST_DETAIL_PAGE_CLASS} .modal-header,
    html.${ROOT_CLASS}.${POST_DETAIL_PAGE_CLASS} .modal-footer {
      border-color: var(--tm-border) !important;
      background: var(--tm-panel) !important;
    }

    html.${ROOT_CLASS}.${POST_DETAIL_PAGE_CLASS} .modal-title {
      color: var(--tm-text) !important;
    }

    html.${ROOT_CLASS}.${POST_DETAIL_PAGE_CLASS} .modal-header .close {
      color: var(--tm-text) !important;
      text-shadow: none !important;
      opacity: 0.8;
    }

    html.${ROOT_CLASS}.${POST_DETAIL_PAGE_CLASS} .modal-footer .btn:not(.btn-small) {
      min-height: 40px;
      padding: 8px 13px !important;
      border: 1px solid var(--tm-border-strong) !important;
      border-radius: 9px !important;
      color: var(--tm-text) !important;
      background: var(--tm-control) !important;
      box-shadow: none !important;
      font-weight: 700;
    }

    html.${ROOT_CLASS}.${POST_DETAIL_PAGE_CLASS} .modal-body .alert {
      border: 1px solid var(--tm-accent-border-soft) !important;
      color: var(--tm-text-soft) !important;
      background: var(--tm-accent-soft) !important;
    }

    html.${ROOT_CLASS}.${POST_DETAIL_PAGE_CLASS} #imgModal img.modal-content {
      border: 1px solid var(--tm-border-strong);
      border-radius: 10px;
      background: var(--tm-input);
      box-shadow: var(--tm-shadow);
    }

    /* Footer */
    html.${ROOT_CLASS} .adCont,
    html.${ROOT_CLASS} footer {
      color: var(--tm-muted) !important;
      background: transparent !important;
    }

    html.${ROOT_CLASS} .tm-rarbg-footer {
      display: flex !important;
      width: 100% !important;
      margin: 18px 0 0 !important;
      padding: 14px 16px !important;
      align-items: center;
      flex-wrap: nowrap;
      gap: 16px;
      border: 0 !important;
      color: var(--tm-muted) !important;
      background: transparent !important;
    }

    html.${ROOT_CLASS} .tm-rarbg-footer > br,
    html.${ROOT_CLASS} .tm-rarbg-footer-section > br {
      display: none !important;
    }

    html.${ROOT_CLASS} .tm-rarbg-footer-section {
      width: auto !important;
      margin: 0 !important;
      padding: 0 !important;
      color: var(--tm-muted) !important;
      font-size: 11px !important;
      line-height: 1.4;
    }

    html.${ROOT_CLASS} .tm-rarbg-footer-links {
      flex: 0 0 auto;
      text-align: left !important;
      white-space: nowrap;
    }

    html.${ROOT_CLASS} .tm-rarbg-footer-donation {
      min-width: 0;
      flex: 1 1 auto;
      color: var(--tm-text-soft) !important;
      font-family: ui-monospace, SFMono-Regular, Consolas, "Liberation Mono", monospace;
      font-variant-numeric: tabular-nums;
      text-align: center !important;
      white-space: nowrap;
    }

    html.${ROOT_CLASS} .tm-rarbg-footer-copyright {
      margin-left: auto !important;
      flex: 0 0 auto;
      text-align: right !important;
      white-space: nowrap;
    }

    html.${ROOT_CLASS} .tm-rarbg-footer-copyright p {
      margin: 0 !important;
    }

    html.${ROOT_CLASS} .tm-rarbg-footer a {
      color: var(--tm-text-subtle) !important;
      text-decoration: none !important;
    }

    html.${ROOT_CLASS} .tm-rarbg-footer a:hover {
      color: var(--tm-focus) !important;
      text-decoration: underline !important;
    }

    @container rarbg-home (max-width: 1500px) {
      html.${ROOT_CLASS}.${HOME_PAGE_CLASS} .tm-rarbg-home-grid {
        grid-template-columns: minmax(0, 1fr);
      }

      html.${ROOT_CLASS}.${HOME_PAGE_CLASS} .tm-rarbg-home-category-wide {
        grid-column: auto;
      }
    }

    /* Fallback for browsers without container-query support. */
    @media (max-width: 1699.98px) {
      html.${ROOT_CLASS}.${HOME_PAGE_CLASS} .tm-rarbg-home-grid {
        grid-template-columns: minmax(0, 1fr);
      }

      html.${ROOT_CLASS}.${HOME_PAGE_CLASS} .tm-rarbg-home-category-wide {
        grid-column: auto;
      }
    }

    @media (max-width: 1100px) {
      html.${ROOT_CLASS} .topnav > .row {
        display: block !important;
      }

      html.${ROOT_CLASS} .leftNav {
        display: none !important;
      }

      html.${ROOT_CLASS} .postCont,
      html.${ROOT_CLASS} .postContL {
        width: 100% !important;
      }

      html.${ROOT_CLASS} table.sortableTable2 th:nth-child(4),
      html.${ROOT_CLASS} table.sortableTable2 td:nth-child(4) {
        display: none !important;
      }

      html.${ROOT_CLASS}.${POST_DETAIL_PAGE_CLASS}
        .similar-posts-container
        table.sortableTable2
        th:nth-child(4),
      html.${ROOT_CLASS}.${POST_DETAIL_PAGE_CLASS}
        .similar-posts-container
        table.sortableTable2
        td:nth-child(4) {
        display: table-cell !important;
      }

      html.${ROOT_CLASS} table.sortableTable2,
      html.${ROOT_CLASS} table.dataTable {
        min-width: 760px;
      }
    }

    @media (max-width: 575.98px) {
      html.${ROOT_CLASS}.${HOME_PAGE_CLASS} .tm-rarbg-home-category {
        padding: 10px;
      }

      html.${ROOT_CLASS}.${HOME_PAGE_CLASS} .tm-rarbg-home-actions {
        grid-template-columns: minmax(0, 1fr);
      }

      html.${ROOT_CLASS}.${HOME_PAGE_CLASS} .tm-rarbg-home-category table.dataTable {
        table-layout: fixed !important;
      }

      html.${ROOT_CLASS}.${HOME_PAGE_CLASS} .tm-rarbg-home-category table.dataTable th:nth-child(6),
      html.${ROOT_CLASS}.${HOME_PAGE_CLASS} .tm-rarbg-home-category table.dataTable td:nth-child(6) {
        display: none !important;
      }

      html.${ROOT_CLASS}.${HOME_PAGE_CLASS} .tm-rarbg-home-category table.dataTable th:nth-child(2),
      html.${ROOT_CLASS}.${HOME_PAGE_CLASS} .tm-rarbg-home-category table.dataTable td:nth-child(2) {
        width: auto !important;
      }

      html.${ROOT_CLASS}.${HOME_PAGE_CLASS} .tm-rarbg-home-category table.dataTable th:nth-child(7),
      html.${ROOT_CLASS}.${HOME_PAGE_CLASS} .tm-rarbg-home-category table.dataTable td:nth-child(7),
      html.${ROOT_CLASS}.${HOME_PAGE_CLASS} .tm-rarbg-home-category table.dataTable th:nth-child(8),
      html.${ROOT_CLASS}.${HOME_PAGE_CLASS} .tm-rarbg-home-category table.dataTable td:nth-child(8) {
        width: 42px !important;
      }
    }

    @media (max-width: 1099.98px) {
      html.${ROOT_CLASS} .tm-rarbg-footer {
        padding: 12px !important;
        align-items: center;
        flex-direction: column;
        flex-wrap: wrap;
        gap: 6px;
      }

      html.${ROOT_CLASS} .tm-rarbg-footer-section,
      html.${ROOT_CLASS} .tm-rarbg-footer-links,
      html.${ROOT_CLASS} .tm-rarbg-footer-donation,
      html.${ROOT_CLASS} .tm-rarbg-footer-copyright {
        max-width: 100%;
        margin: 0 !important;
        flex: 0 1 auto;
        overflow-wrap: anywhere;
        text-align: center !important;
        white-space: normal;
      }
    }

    @media (max-width: 991.98px) {
      html.${ROOT_CLASS} .tm-rarbg-search-section {
        grid-template-columns: minmax(0, 1fr);
      }

      html.${ROOT_CLASS} #form_search .search {
        grid-column: 1;
        grid-row: 2;
      }

      html.${ROOT_CLASS} .tm-rarbg-adult-control {
        width: 100% !important;
        grid-column: 1;
        grid-row: 1;
      }

      html.${ROOT_CLASS} #filterOption {
        grid-row: 3;
      }

      html.${ROOT_CLASS} #form_search > div:last-of-type {
        grid-row: 4;
      }

      html.${ROOT_CLASS} .search-result-pop {
        grid-row: 5;
      }

      html.${ROOT_CLASS} table.sortableTable2 .hideCell,
      html.${ROOT_CLASS} table.sortableTable .hideCell {
        display: none !important;
      }

      html.${ROOT_CLASS} table.sortableTable2,
      html.${ROOT_CLASS} table.dataTable {
        min-width: 0;
      }

      html.${ROOT_CLASS}.${POST_DETAIL_PAGE_CLASS}
        .similar-posts-container
        table.sortableTable2 {
        min-width: 540px;
      }

      html.${ROOT_CLASS}.${POST_DETAIL_PAGE_CLASS}
        .similar-posts-container
        table.sortableTable2
        th:nth-child(1),
      html.${ROOT_CLASS}.${POST_DETAIL_PAGE_CLASS}
        .similar-posts-container
        table.sortableTable2
        td:nth-child(1) {
        width: auto !important;
      }

      html.${ROOT_CLASS}.${POST_DETAIL_PAGE_CLASS}
        .similar-posts-container
        table.sortableTable2
        th:nth-child(3),
      html.${ROOT_CLASS}.${POST_DETAIL_PAGE_CLASS}
        .similar-posts-container
        table.sortableTable2
        td:nth-child(3) {
        width: 110px !important;
      }

      html.${ROOT_CLASS}.${POST_DETAIL_PAGE_CLASS}
        .similar-posts-container
        table.sortableTable2
        th:nth-child(4),
      html.${ROOT_CLASS}.${POST_DETAIL_PAGE_CLASS}
        .similar-posts-container
        table.sortableTable2
        td:nth-child(4),
      html.${ROOT_CLASS}.${POST_DETAIL_PAGE_CLASS}
        .similar-posts-container
        table.sortableTable2
        th:nth-child(5),
      html.${ROOT_CLASS}.${POST_DETAIL_PAGE_CLASS}
        .similar-posts-container
        table.sortableTable2
        td:nth-child(5) {
        width: 52px !important;
      }

      html.${ROOT_CLASS}.${HOME_PAGE_CLASS}
        .tm-rarbg-home-category:not(.tm-rarbg-home-category-wide)
        table.dataTable {
        min-width: 0;
      }

      html.${ROOT_CLASS} table.sortableTable2 tbody td,
      html.${ROOT_CLASS} table.dataTable tbody td {
        padding: 10px 8px !important;
      }
    }

    @media (max-width: 767.98px) {
      html.${ROOT_CLASS} body.postBody.container {
        width: calc(100% - 14px) !important;
        margin: 7px auto !important;
      }

      html.${ROOT_CLASS} .topnav > div:first-child {
        min-height: 62px;
        margin-bottom: 8px;
        padding: 9px 11px;
        flex-wrap: wrap;
      }

      html.${ROOT_CLASS} .logo {
        width: 122px !important;
      }

      html.${ROOT_CLASS} .postContUp {
        display: flex !important;
        width: 100% !important;
        margin: 0 !important;
        padding: 2px 0 4px !important;
        order: 3;
        flex: 1 0 100%;
        flex-wrap: nowrap;
        justify-content: flex-start;
        overflow-x: auto;
        scrollbar-color: var(--tm-scrollbar) transparent;
        scrollbar-width: thin;
      }

      html.${ROOT_CLASS} .icon.showMob {
        margin-left: auto;
      }

      html.${ROOT_CLASS} #myLinks {
        width: 100%;
        order: 4;
        flex: 1 0 100%;
      }

      html.${ROOT_CLASS} #myLinks button {
        width: 100% !important;
        margin-top: 6px !important;
      }

      html.${ROOT_CLASS} .topnav > .row {
        display: block;
      }

      html.${ROOT_CLASS} .leftNav {
        display: none !important;
      }

      html.${ROOT_CLASS} .postCont,
      html.${ROOT_CLASS} .postContL {
        width: 100% !important;
        padding: 9px !important;
        border-radius: 12px;
      }

      html.${ROOT_CLASS}.${POST_DETAIL_PAGE_CLASS} .tm-rarbg-detail-title {
        margin-bottom: 9px !important;
        padding: 12px !important;
        font-size: 17px !important;
      }

      html.${ROOT_CLASS}.${POST_DETAIL_PAGE_CLASS}
        .tm-rarbg-detail-table
        > tbody
        > tr
        > th {
        width: 108px;
        min-width: 96px;
        padding: 10px 8px !important;
        font-size: 11px;
      }

      html.${ROOT_CLASS}.${POST_DETAIL_PAGE_CLASS}
        .tm-rarbg-detail-table
        > tbody
        > tr
        > td {
        padding: 10px !important;
        font-size: 13px;
      }

      html.${ROOT_CLASS}.${POST_DETAIL_PAGE_CLASS} .download-primary,
      html.${ROOT_CLASS}.${POST_DETAIL_PAGE_CLASS} .download-secondary {
        align-items: stretch;
        flex-direction: column;
      }

      html.${ROOT_CLASS}.${POST_DETAIL_PAGE_CLASS} .btn-download,
      html.${ROOT_CLASS}.${POST_DETAIL_PAGE_CLASS} .download-secondary > .btn-small,
      html.${ROOT_CLASS}.${POST_DETAIL_PAGE_CLASS} .torrent-info {
        width: 100%;
      }

      html.${ROOT_CLASS}.${POST_DETAIL_PAGE_CLASS} .torrent-info {
        flex-basis: auto;
      }

      html.${ROOT_CLASS}.${POST_DETAIL_PAGE_CLASS}
        .tm-rarbg-detail-row-description
        > td
        > div {
        max-height: 62vh;
        padding: 10px !important;
        font-size: 11.5px;
      }

      html.${ROOT_CLASS}.${POST_DETAIL_PAGE_CLASS}
        .tm-rarbg-detail-row-images
        > td
        > .row {
        grid-template-columns: minmax(0, 1fr);
      }

      html.${ROOT_CLASS}.${POST_DETAIL_PAGE_CLASS} .comment-section > .container {
        padding: 12px !important;
      }

      html.${ROOT_CLASS}.${POST_DETAIL_PAGE_CLASS} .comment-form {
        padding: 12px !important;
      }

      html.${ROOT_CLASS}.${POST_DETAIL_PAGE_CLASS} .comment-thread.depth-1 {
        margin-left: 16px !important;
      }

      html.${ROOT_CLASS}.${POST_DETAIL_PAGE_CLASS} .comment-thread.depth-2 {
        margin-left: 32px !important;
      }

      html.${ROOT_CLASS}.${POST_DETAIL_PAGE_CLASS} .comment-thread.depth-3,
      html.${ROOT_CLASS}.${POST_DETAIL_PAGE_CLASS} .comment-thread.depth-4,
      html.${ROOT_CLASS}.${POST_DETAIL_PAGE_CLASS} .comment-thread.depth-5 {
        margin-left: 48px !important;
      }

      html.${ROOT_CLASS} .tm-rarbg-toolbar {
        min-height: 0;
        padding: 12px;
        align-items: flex-start;
      }

      html.${ROOT_CLASS} .tm-rarbg-context {
        display: none;
      }

      html.${ROOT_CLASS} .tm-rarbg-extras-toggle {
        min-height: 34px;
        padding: 7px 10px;
      }

      html.${ROOT_CLASS} .tm-rarbg-search-section {
        padding: 10px !important;
      }

      html.${ROOT_CLASS} #form_search .search {
        gap: 5px;
      }

      html.${ROOT_CLASS} .tm-rarbg-filter-bar {
        padding: 9px !important;
      }

      html.${ROOT_CLASS} #flist {
        width: 100% !important;
        flex-basis: 100%;
      }

      html.${ROOT_CLASS} .tm-rarbg-filter-bar > div {
        width: 100%;
      }

      html.${ROOT_CLASS} .tm-rarbg-catalog-title,
      html.${ROOT_CLASS} .tm-rarbg-catalog-picker,
      html.${ROOT_CLASS} .tm-rarbg-catalog-links {
        margin-bottom: 9px !important;
        padding: 12px !important;
      }

      html.${ROOT_CLASS} .tm-rarbg-catalog-picker table {
        width: 100%;
      }

      html.${ROOT_CLASS} .tm-rarbg-catalog-picker td {
        width: 50%;
      }

      html.${ROOT_CLASS} .tm-rarbg-catalog-picker .buttonalink {
        width: 100%;
        min-width: 0;
      }

      html.${ROOT_CLASS} .tm-rarbg-catalog-links {
        gap: 6px;
      }

      html.${ROOT_CLASS} table.sortableTable2,
      html.${ROOT_CLASS} table.dataTable {
        min-width: 0;
      }

      html.${ROOT_CLASS} .page-item .page-link,
      html.${ROOT_CLASS} .pagination > .page-link {
        min-width: 32px;
        min-height: 32px;
        padding: 6px 8px !important;
      }
    }

    @media (prefers-reduced-motion: reduce) {
      html.${ROOT_CLASS} *,
      html.${ROOT_CLASS} *::before,
      html.${ROOT_CLASS} *::after {
        scroll-behavior: auto !important;
        transition-duration: 0.01ms !important;
        animation-duration: 0.01ms !important;
        animation-iteration-count: 1 !important;
      }
    }
  `;

  const styleElement = document.createElement('style');
  styleElement.id = 'tm-rarbg-modern-theme-styles';
  styleElement.textContent = styles;
  (document.head || document.documentElement).append(styleElement);

  function decodePathValue(value) {
    try {
      return decodeURIComponent(value).replace(/\+/g, ' ');
    } catch {
      return value.replace(/\+/g, ' ');
    }
  }

  function describeTimeWindow(rawValue) {
    const match = /^(\d+)([HDWMY])$/i.exec(rawValue || '');
    if (!match) return '';

    const amount = Number(match[1]);
    const unitNames = {
      H: ['hour', 'hours'],
      D: ['day', 'days'],
      W: ['week', 'weeks'],
      M: ['month', 'months'],
      Y: ['year', 'years'],
    };
    const names = unitNames[match[2].toUpperCase()];
    if (!names) return '';

    return `Last ${amount} ${amount === 1 ? names[0] : names[1]}`;
  }

  function readPageContext() {
    if (isHomePage) {
      root.classList.remove(CATEGORY_PAGE_CLASS);
      return {
        title: 'Latest torrents',
        context: 'Top 10 by category',
      };
    }

    if (isTopTenPage) {
      root.classList.remove(CATEGORY_PAGE_CLASS);
      return {
        title: 'Top torrents',
        context: 'Top 10 by category',
      };
    }

    if (isTrendingPage) {
      const [, count = '', category = ''] = normalisedPath.split('/').filter(Boolean);
      root.classList.toggle(CATEGORY_PAGE_CLASS, Boolean(category));
      return {
        title: category ? `Trending ${decodePathValue(category)} torrents` : 'Trending torrents',
        context: count ? `Top ${decodePathValue(count)}` : 'TheRARBG trending',
      };
    }

    const categoryMatch = /(?:^|[/:])category:([^/:]+)/i.exec(location.pathname);
    const timeMatch = /(?:^|:)time:([^/:]+)/i.exec(location.pathname);
    const keywordMatch = /(?:^|\/)keywords:([^/:]+)/i.exec(location.pathname);

    const category = categoryMatch ? decodePathValue(categoryMatch[1]) : '';
    const timeWindow = timeMatch ? describeTimeWindow(decodePathValue(timeMatch[1])) : '';
    const keyword = keywordMatch ? decodePathValue(keywordMatch[1]) : '';

    root.classList.toggle(CATEGORY_PAGE_CLASS, Boolean(category));

    const title =
      category && keyword
        ? `${category} torrents matching “${keyword}”`
        : category
          ? `${category} torrents`
          : keyword
            ? `Results for “${keyword}”`
            : 'Torrent results';

    return {
      title,
      context: timeWindow || 'TheRARBG listing',
    };
  }

  function makeElement(tagName, className, text) {
    const element = document.createElement(tagName);
    if (className) element.className = className;
    if (text) element.textContent = text;
    return element;
  }

  function addPaletteControl() {
    const headerNavigation = document.querySelector(
      '.postContUp, .tm-rarbg-main-list-header',
    );
    if (!headerNavigation || document.getElementById('tm-rarbg-palette-select')) return;

    const control = makeElement('label', 'tm-rarbg-palette-control');
    const caption = makeElement('span', 'tm-rarbg-palette-label', 'Colour');
    const select = makeElement('select', 'tm-rarbg-palette-select');
    select.id = 'tm-rarbg-palette-select';
    select.setAttribute('aria-label', 'Dark colour palette');

    for (const [value, label] of PALETTE_OPTIONS) {
      const option = makeElement('option', '', label);
      option.value = value;
      select.append(option);
    }

    select.value = initialPalette;
    select.addEventListener('change', () => {
      select.value = applyPalette(select.value, true);
    });

    control.append(caption, select);
    headerNavigation.append(control);
  }

  function markFooter() {
    const footer = document.querySelector('footer');
    if (!footer) return;

    footer.classList.remove('row', 'align-center');
    footer.classList.add('tm-rarbg-footer');

    const sections = [...footer.children].filter((element) => element.tagName === 'DIV');
    const sectionClasses = [
      'tm-rarbg-footer-links',
      'tm-rarbg-footer-donation',
      'tm-rarbg-footer-copyright',
    ];

    sections.forEach((section, index) => {
      section.classList.add('tm-rarbg-footer-section');
      if (sectionClasses[index]) section.classList.add(sectionClasses[index]);
    });
  }

  function prepareSearchControls(postContainer) {
    postContainer.querySelector('#form_search')?.closest('.row')?.classList.add('tm-rarbg-search-section');

    const adultToggle = postContainer.querySelector('#adultContentToggle');
    adultToggle?.closest('.row')?.classList.add('tm-rarbg-adult-control');
    adultToggle?.setAttribute('aria-label', 'Show XXX content');

    const adultFilterCheckbox = postContainer.querySelector('#radXXX');
    const adultFilter = adultFilterCheckbox?.closest('#filterOption > div');

    if (adultToggle && adultFilterCheckbox && adultFilter) {
      adultFilter.classList.add('tm-rarbg-adult-filter');

      const synchroniseAdultFilter = () => {
        const isAdultContentVisible = adultToggle.checked;
        adultFilter.hidden = !isAdultContentVisible;
        adultFilter.setAttribute('aria-hidden', String(!isAdultContentVisible));
        adultFilterCheckbox.disabled = !isAdultContentVisible;

        if (isAdultContentVisible) return;

        adultFilterCheckbox.checked = false;

        try {
          const savedFilters = JSON.parse(localStorage.getItem('checkedSearches'));
          if (savedFilters && typeof savedFilters === 'object' && savedFilters.xxx !== 'false') {
            savedFilters.xxx = 'false';
            localStorage.setItem('checkedSearches', JSON.stringify(savedFilters));
          }
        } catch {
          // Invalid or unavailable site storage must not stop the theme.
        }
      };

      synchroniseAdultFilter();
      window.setTimeout(synchroniseAdultFilter, 0);
      adultToggle.addEventListener('change', synchroniseAdultFilter);
    }
  }

  function markSections(postContainer) {
    postContainer.querySelector('.banner-box.movie')?.classList.add('tm-rarbg-extra-section');
    postContainer.querySelector('#searchTags')?.closest('.row')?.classList.add('tm-rarbg-extra-section');
    postContainer
      .querySelector('.recent-search-wrapper')
      ?.closest('.row')
      ?.classList.add('tm-rarbg-extra-section');

    prepareSearchControls(postContainer);

    const table = postContainer.querySelector(
      isTrendingPage ? 'table.sortableTable, table.dataTable' : 'table.sortableTable2',
    );
    const resultsRow = table?.closest(isTrendingPage ? '.row' : '.row.p-1');
    resultsRow?.classList.add('tm-rarbg-results-row');

    if (resultsRow) {
      const filterBar = [...resultsRow.children].find((child) => child.querySelector?.('#flist'));
      filterBar?.classList.add('tm-rarbg-filter-bar');
    }

    const extraSections = [...postContainer.querySelectorAll('.tm-rarbg-extra-section')];
    extraSections.forEach((section, index) => {
      if (!section.id) section.id = `tm-rarbg-extra-section-${index + 1}`;
    });

    return extraSections;
  }

  function markPagination(container) {
    container.querySelectorAll('.pagination').forEach((pagination) => {
      pagination.closest('.row')?.classList.add('tm-rarbg-pagination-row');
    });
  }

  function markPostDetailPage(postContainer) {
    prepareSearchControls(postContainer);

    postContainer
      .querySelector('#searchTags')
      ?.closest('.row')
      ?.classList.add('tm-rarbg-detail-supporting-section');
    postContainer
      .querySelector('.recent-search-wrapper')
      ?.closest('.row')
      ?.classList.add('tm-rarbg-detail-supporting-section');

    postContainer
      .querySelector('.comment-section + .row .btn-small')
      ?.closest('.row')
      ?.classList.add('tm-rarbg-detail-back-row');

    const detailTable = postContainer.querySelector('.detailTable');
    if (!detailTable) return;

    detailTable.classList.add('tm-rarbg-detail-table');

    const tableWrapper = detailTable.closest('.table-responsive');
    tableWrapper?.classList.add('tm-rarbg-detail-table-wrapper');

    const title = tableWrapper?.previousElementSibling;
    if (title?.matches('h1, h2, h3, h4, h5, h6')) {
      title.classList.add('tm-rarbg-detail-title');
    }

    const rowClassByLabel = new Map([
      ['images', 'tm-rarbg-detail-row-images'],
      ['description', 'tm-rarbg-detail-row-description'],
      ['tracker data', 'tm-rarbg-detail-row-trackers'],
    ]);

    for (const row of detailTable.rows) {
      const labelCell = row.cells[0];
      if (labelCell?.tagName !== 'TH') continue;

      const label = labelCell.textContent.trim().replace(/:$/, '').toLowerCase();
      const rowClass = rowClassByLabel.get(label);
      if (rowClass) row.classList.add(rowClass);
    }
  }

  function markCatalogPage(postContainer) {
    const catalogTitle = postContainer.querySelector(':scope > .row > b');
    catalogTitle?.parentElement?.classList.add('tm-rarbg-catalog-title');

    const [pickerHeading, listsHeading] = postContainer.querySelectorAll('h2');
    pickerHeading?.closest('.row')?.classList.add('tm-rarbg-catalog-picker');
    listsHeading?.parentElement?.parentElement?.classList.add('tm-rarbg-catalog-links');

    const genre = postContainer.querySelector('.catalog-genre');
    if (genre && !genre.textContent.trim() && genre.children.length === 0) {
      genre.closest('.row')?.classList.add('tm-rarbg-empty-catalog-row');
    }
  }

  function markCatalogListPage(postContainer) {
    prepareSearchControls(postContainer);
    postContainer.querySelector('.layout-filter')?.classList.add('tm-rarbg-catalog-filter');

    const activeCatalogKind = normalisedPath.startsWith('/catalog/tv') ? 'tv' : 'movie';
    postContainer
      .querySelectorAll('a[href="/catalog/movie/"], a[href="/catalog/tv/"]')
      .forEach((link) => {
        const linkKind = link.getAttribute('href').includes('/tv/') ? 'tv' : 'movie';
        const isActive = linkKind === activeCatalogKind;
        link.classList.add('tm-rarbg-catalog-kind-toggle');
        link.classList.toggle('tm-rarbg-catalog-kind-active', isActive);
        if (isActive) link.setAttribute('aria-current', 'page');
      });

    const specialGenreLabels = {
      'game-show': 'Game Show',
      'reality-tv': 'Reality TV',
      'sci-fi': 'Sci-Fi',
      'talk-show': 'Talk Show',
      'film-noir': 'Film Noir',
    };
    postContainer
      .querySelectorAll('.catalog-genre > a.buttonalink, .form-category .form-check-label')
      .forEach((label) => {
        const originalLabel = label.textContent.trim();
        const normalisedLabel = originalLabel.toLowerCase();
        label.textContent =
          specialGenreLabels[normalisedLabel] ||
          normalisedLabel
            .replace(/-/g, ' ')
            .replace(/\b\w/g, (letter) => letter.toUpperCase());
      });

    postContainer.querySelectorAll('.row.py-3').forEach((row) => {
      const hasPosterColumn = row.querySelector(':scope > .col-md-2 > img');
      const hasTorrentTable = row.querySelector(':scope > .col-md-10 table.table');
      if (hasPosterColumn && hasTorrentTable) row.classList.add('tm-rarbg-catalog-result');
    });
  }

  function markMainPageList(postContainer) {
    const shell = postContainer.parentElement;
    if (!shell) return;

    shell.classList.add('tm-rarbg-main-list-shell');
    postContainer.classList.add('tm-rarbg-main-list-panel');
    postContainer.querySelector('.searchSec')?.classList.add('tm-rarbg-main-list-search');
    postContainer.querySelector('.tileCont')?.classList.add('tm-rarbg-main-list-tiles');
    postContainer
      .querySelector('.tile a[href="/get-posts/user:ORARBG/"]')
      ?.closest('.tile')
      ?.remove();
    prepareSearchControls(postContainer);

    const logoLink = [...shell.children].find(
      (element) => element.matches('a') && element.querySelector(':scope > .logo'),
    );
    if (!logoLink || shell.querySelector(':scope > .tm-rarbg-main-list-header')) return;

    const header = makeElement('header', 'tm-rarbg-main-list-header');
    logoLink.classList.add('tm-rarbg-main-list-logo-link');
    logoLink.before(header);
    header.append(logoLink);
  }

  function markFeatureListPage(postContainer) {
    postContainer.querySelector(':scope > h1')?.classList.add('tm-rarbg-feature-title');
    postContainer.querySelectorAll('.bg-white.rounded.shadow-sm').forEach((card) => {
      card.classList.add('tm-rarbg-feature-card');
    });
  }

  const HOME_SECTION_LAYOUT = [
    ['.isMovies', 'movies', 'Movie'],
    ['.isDocumentaries', 'documentaries', 'Documentary'],
    ['.isTV', 'tv', 'TV'],
    ['.isAnime', 'anime', 'Anime'],
    ['.isGames', 'games', 'Game'],
    ['.isApps', 'apps', 'App'],
    ['.isMusic', 'music', 'Music'],
    ['.isBooks', 'books', 'Book'],
    ['.isXXX', 'xxx', 'XXX'],
  ];

  function arrangeHomeSections(postContainer) {
    if (!(isHomePage || isTopTenPage) || postContainer.querySelector('.tm-rarbg-home-grid')) return;

    const sections = HOME_SECTION_LAYOUT.map(([selector, name, singularLabel]) => ({
      element: postContainer.querySelector(selector),
      name,
      singularLabel,
    })).filter(({ element }) => element);

    if (sections.length === 0) return;

    const grid = makeElement('div', 'tm-rarbg-home-grid');
    grid.setAttribute('aria-label', 'Top torrents by category');
    sections[0].element.before(grid);

    for (const { element, name, singularLabel } of sections) {
      element.classList.add('tm-rarbg-home-category', `tm-rarbg-home-category-${name}`);
      const heading = element.querySelector(':scope > h2');
      if (heading) heading.textContent = `Top ${singularLabel} Torrents`;
      element
        .querySelector(':scope > .text-start:last-child')
        ?.classList.add('tm-rarbg-home-actions');
      if (name === 'xxx') element.classList.add('tm-rarbg-home-category-wide');
      grid.append(element);
    }
  }

  function labelSearchControls(container) {
    const searchInput = container.querySelector('#keywords');
    if (searchInput && !searchInput.hasAttribute('aria-label')) {
      searchInput.setAttribute('aria-label', 'Search by title or IMDb ID');
    }

    const searchButton = container.querySelector('#form_search .searchButton');
    if (searchButton && !searchButton.hasAttribute('aria-label')) {
      searchButton.setAttribute('aria-label', 'Search');
    }

    const filterButton = container.querySelector('#filterBtn');
    if (!filterButton) return;

    filterButton.setAttribute('aria-label', 'Toggle search filters');
    filterButton.setAttribute('aria-controls', 'filterOption');

    const updateExpandedState = () => {
      const isOpen = filterButton.classList.contains('open');
      filterButton.setAttribute('aria-expanded', String(isOpen));
      filterButton.textContent = isOpen ? 'Hide filters' : 'Filters';
    };

    updateExpandedState();
    window.setTimeout(updateExpandedState, 0);
    filterButton.addEventListener('click', () => {
      window.requestAnimationFrame(updateExpandedState);
    });

    const resetButton = container.querySelector('#form_search button[type="reset"]');
    if (resetButton) {
      resetButton.textContent = 'Clear filters';
      resetButton.setAttribute('aria-label', 'Clear search filters');
    }
  }

  function labelTableColumns(container) {
    container.querySelectorAll('table thead th').forEach((heading) => {
      const originalLabel = heading.textContent.trim();
      const labelWithoutDownArrow = originalLabel.replace(/^↓\s*/, '');
      const match = /^(C\.?|S\.|L\.)$/i.exec(labelWithoutDownArrow);
      const labelByValue = {
        C: 'Type',
        'C.': 'Type',
        'S.': 'SE.',
        'L.': 'LE.',
      };
      const label = match
        ? labelByValue[match[1].toUpperCase()]
        : labelWithoutDownArrow;

      if (label !== originalLabel) heading.textContent = label;

      if (label === 'Type') {
        heading.setAttribute('title', 'Torrent type');
        heading.setAttribute('aria-label', 'Torrent type');
      }
    });
  }

  function abbreviateTableTimes(container) {
    const unitLabels = {
      minute: 'm',
      minutes: 'm',
      hour: 'hr',
      hours: 'hrs',
      day: 'd',
      days: 'd',
      week: 'wk',
      weeks: 'wks',
      month: 'mo',
      months: 'mos',
      year: 'yr',
      years: 'yrs',
    };

    container.querySelectorAll('table').forEach((table) => {
      const headings = [...table.querySelectorAll('thead th')];
      const timeColumnIndex = headings.findIndex((heading) =>
        /^(?:time|time since)$/i.test(heading.textContent.trim()),
      );
      if (timeColumnIndex < 0) return;

      table.querySelectorAll('tbody tr').forEach((row) => {
        const cell = row.cells[timeColumnIndex];
        if (!cell) return;

        const value = cell.textContent.trim().replace(
          /\b(\d+)\s+(minutes?|hours?|days?|weeks?|months?|years?)\b/gi,
          (_, amount, unit) => {
            const label = unitLabels[unit.toLowerCase()];
            return label === 'm' || label === 'd'
              ? `${amount}${label}`
              : `${amount} ${label}`;
          },
        );

        const valueElement = cell.querySelector('div');
        if (valueElement) valueElement.textContent = value;
        else cell.textContent = value;
      });
    });
  }

  function addToolbar(postContainer, extraSections) {
    if (!isToolbarPage || document.getElementById('tm-rarbg-theme-toolbar')) return;

    const pageContext = readPageContext();
    const toolbar = makeElement('section', 'tm-rarbg-toolbar');
    toolbar.id = 'tm-rarbg-theme-toolbar';
    toolbar.setAttribute('aria-label', 'TheRARBG theme controls');

    const heading = makeElement('div', 'tm-rarbg-heading');
    const titleTag = postContainer.querySelector('h1') ? 'h2' : 'h1';
    heading.append(
      makeElement('span', 'tm-rarbg-kicker', 'TheRARBG'),
      makeElement(titleTag, 'tm-rarbg-title', pageContext.title),
      makeElement('span', 'tm-rarbg-context', pageContext.context),
    );

    const extrasButton = makeElement('button', 'tm-rarbg-extras-toggle');
    extrasButton.type = 'button';
    extrasButton.setAttribute('aria-controls', extraSections.map((section) => section.id).join(' '));

    const refreshThumbnailCarousel = () => {
      const slider = postContainer.querySelector('#mySlides1.slick-initialized');
      const pageJQuery = window.jQuery;
      if (!slider || typeof pageJQuery !== 'function') return;

      window.requestAnimationFrame(() => {
        const carousel = pageJQuery(slider);
        if (typeof carousel.slick === 'function') carousel.slick('setPosition');
      });
    };

    const updateExtrasButton = () => {
      const isOpen = root.classList.contains(SHOW_EXTRAS_CLASS);
      extrasButton.textContent = isOpen ? 'Hide thumbnails' : 'Show thumbnails';
      extrasButton.setAttribute('aria-expanded', String(isOpen));
    };

    extrasButton.addEventListener('click', () => {
      const isOpen = root.classList.toggle(SHOW_EXTRAS_CLASS);
      try {
        localStorage.setItem(EXTRAS_STORAGE_KEY, String(isOpen));
      } catch {
        // See the storage note near initialisation.
      }
      updateExtrasButton();
      if (isOpen) refreshThumbnailCarousel();
    });

    updateExtrasButton();
    toolbar.append(heading);
    if (extraSections.length > 0) toolbar.append(extrasButton);
    postContainer.prepend(toolbar);
  }

  const knownAdHosts = [
    'discussioncomperesteel.com',
    'portalfluently.com',
    'grop.net',
  ];

  function isKnownAdHost(hostname) {
    const normalisedHost = hostname.toLowerCase();
    return knownAdHosts.some(
      (knownHost) => normalisedHost === knownHost || normalisedHost.endsWith(`.${knownHost}`),
    );
  }

  function hideKnownClickCatchers() {
    if (!document.body) return;

    for (const element of [...document.body.children]) {
      if (element.classList.contains('topnav')) continue;

      const computedStyle = getComputedStyle(element);
      const zIndex = Number.parseInt(computedStyle.zIndex, 10);
      const bounds = element.getBoundingClientRect();
      const coversViewport =
        bounds.width >= window.innerWidth * 0.8 && bounds.height >= window.innerHeight * 0.8;

      if (computedStyle.position !== 'fixed' || zIndex < 1000000 || !coversViewport) continue;

      const hasKnownAdLink = [...element.querySelectorAll('a[href]')].some((link) => {
        try {
          return isKnownAdHost(new URL(link.href, location.href).hostname);
        } catch {
          return false;
        }
      });

      if (hasKnownAdLink) element.classList.add('tm-rarbg-known-click-catcher');
    }
  }

  function initialiseTheme() {
    const postContainer = document.querySelector(isPostDetailPage ? '.postContL' : '.postCont');

    if (postContainer && isMainPageList) markMainPageList(postContainer);
    if (postContainer && isFeatureListPage) markFeatureListPage(postContainer);
    addPaletteControl();
    markFooter();
    markPagination(document);
    labelSearchControls(document);
    labelTableColumns(document);
    window.addEventListener('load', () => labelTableColumns(document), { once: true });

    if (postContainer && isCatalogPage) markCatalogPage(postContainer);
    if (postContainer && isCatalogListPage) markCatalogListPage(postContainer);
    if (postContainer && isPostDetailPage) markPostDetailPage(postContainer);

    if (postContainer && isToolbarPage) {
      const extraSections = markSections(postContainer);
      addToolbar(postContainer, extraSections);
    }

    if (postContainer && (isHomePage || isTopTenPage)) {
      arrangeHomeSections(postContainer);
    }

    abbreviateTableTimes(document);
    window.addEventListener('load', () => abbreviateTableTimes(document), { once: true });

    hideKnownClickCatchers();

    // Advertising click-catchers can be injected shortly after page load.
    // Check for a bounded ten-second window instead of keeping a permanent
    // MutationObserver or timer alive for the entire session.
    let checksRemaining = 20;
    const overlayTimer = window.setInterval(() => {
      hideKnownClickCatchers();
      labelTableColumns(document);
      abbreviateTableTimes(document);
      checksRemaining -= 1;
      if (checksRemaining <= 0) window.clearInterval(overlayTimer);
    }, 500);

    window.addEventListener('pagehide', () => window.clearInterval(overlayTimer), { once: true });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initialiseTheme, { once: true });
  } else {
    initialiseTheme();
  }
})();
