/* readthescripture.com — shared navigation with category dropdowns
   Drop  <script src="nav.js"></script>  as the FIRST child of <body>.
   The script injects the sticky nav + required CSS, then adds a body
   padding-top shim so page content is never hidden behind the bar.
*/
(function () {
  var BASE = '/';

    /* ── Page catalogue, organised by category ──────────────────────── */
  var CATEGORIES = [
    {
      label: 'Study Tools',
      pages: [
        { label: 'KJV Reader',           file: 'kjv_reader.html', tag: 'Read'            },
        { label: 'Strong\'s Concordance', file: 'strongs.html',    tag: 'Lexicon'         }
      ]
    },
    {
      label: 'Studies',
      pages: [
        { label: 'What God Is Like',          file: 'what_god_is_like.html',              tag: 'Character'              },
        { label: 'Mercy Extended',            file: 'mercy_extended.html',                tag: 'Grace'                  },
        { label: 'When God Relented',         file: 'relenting.html',                     tag: 'Exodus 32'              },
        { label: 'Woman at the Well',         file: 'samaritan_woman_at_the_well.html',   tag: 'John 4'                 },
        { label: 'When Faith Moves',          file: 'faith_in_action.html',               tag: 'Faith'                  },
        { label: 'When the Answer Was Silence', file: 'when_the_answer_was_silence.html', tag: 'Unanswered Prayer'      },
        { label: 'When the Rain Stopped',     file: 'when_the_rain_stopped.html',         tag: 'Elijah & Baal'          },
        { label: 'Water Before the Word',     file: 'water-before-the-word.html',         tag: 'Creation'               },
        { label: 'Water Withheld, Water Given', file: 'water_withheld_water_given.html',  tag: 'Drought & Living Water' },
        { label: 'Isaiah 7:14 / Immanuel',    file: 'isaiah_7_14_immanuel.html',          tag: 'Prophecy'               },
        { label: 'Hardening Pharaoh\'s Heart', file: 'hardening_pharaohs_heart.html',     tag: 'Exodus'                 },
        { label: 'Forfeited Access',          file: 'forfeited_access.html',              tag: 'Saul & David'           },
        { label: 'The Answer That Didn\'t Come True', file: 'the_answer_that_didnt_come_true.html', tag: 'Keilah · Inquiry' },
        { label: 'The Mercy He Feared',       file: 'jonah_the_mercy_he_feared.html',      tag: 'Jonah · Mercy'          },
        { label: 'How We Got the Bible',       file: 'history_of_the_bible.html',           tag: 'Canon · Transmission'   }
      ]
    },
    {
      label: 'Lexical',
      pages: [
        { label: 'Good, and Evil',                 file: 'good_and_evil_word_study.html',   tag: 'Word Study'   },
        { label: 'The LORD, the Gods & the Satan', file: 'lord_gods_and_the_satan.html',    tag: 'Unseen World' },
        { label: 'Sheol, Hades & Gehenna',         file: 'sheol_hades_gehenna.html',        tag: 'Eschatology'  }
      ]
    },
    {
      label: 'Critical',
      pages: [
        { label: 'After God\'s Own Heart',      file: 'david_saul_character_study.html',   tag: 'Saul & David · Character' },
        { label: 'The Indispensable Adversary', file: 'joab_indispensable_adversary.html', tag: 'Joab · The Court History' },
        { label: 'The Long Road to Canaan',     file: 'canaan_backdrop.html',              tag: 'Conquest · Part 1'        },
        { label: 'The Sword, Weighed',          file: 'canaan_conquest.html',              tag: 'Conquest · Part 2'        },
        { label: 'The True Word in a False Mouth', file: 'the_true_word_in_a_false_mouth.html', tag: '1 Kings 13 · Providence' }
      ]
    },
    {
      label: 'Marginalia',
      pages: [
        { label: 'Reading Jonah',                    file: 'jonah_marginalia.html',          tag: 'Labeled Opinion' },
        { label: 'Words That Mean Their Opposite',   file: 'contranyms_in_scripture.html',   tag: 'Labeled Opinion' },
        { label: 'The Indispensable Adversary: A Narrative', file: 'joab_from_gibeon_to_the_altar.html', tag: 'Labeled Opinion' },
        { label: 'A Hard Chapter, Read in the Open', file: 'a_hard_chapter_in_the_open.html', tag: 'Method · Companion' }
      ]
    },
    {
      label: 'Resources',
      pages: [
        { label: 'Gospel Timeline',        file: 'gospel_timeline.html',           tag: 'Four Gospels'    },
        { label: 'The Law',                file: 'the_law_resource.html',          tag: 'Torah'           },
        { label: 'Patriarchs & Covenants', file: 'patriarchs_covenants_map.html',  tag: 'History'         },
        { label: 'Judges → Kings',    file: 'judges_to_kings_timeline.html',  tag: 'The Backbone'    },
        { label: 'Lineage: Adam \u2192 Jesus', file: 'genealogy_adam_to_jesus.html', tag: 'Genealogy'    },
        { label: 'All 66 Books',           file: 'bible_book_summaries.html',      tag: 'Reference'       },
        { label: 'Language Guide',         file: 'bible_language_guide.html',       tag: 'Languages'       }
      ]
    },
    {
      label: 'Assessments',
      pages: [
        { label: 'Dispensationalism',    file: 'dispensationalism_test.html',    tag: 'Theology'        },
        { label: 'Spiritual Gifts',      file: 'spiritual_gifts.html',           tag: 'Self-Assessment' }
      ]
    },
    {
      label: 'The Method',
      pages: [
        { label: 'How This Project Works',   file: 'how_this_project_works.html',    tag: 'Original Language First' },
        { label: 'How We Grade, Blind',      file: 'how_we_grade.html',              tag: 'Transparency'            },
        { label: 'The Author & the Object',  file: 'author_and_the_object.html',     tag: 'God & Time'              },
        { label: 'Emotionally Charged Language', file: 'emotionally_charged_language.html', tag: 'Reading'         },
        { label: 'A Hard Chapter, Read in the Open', file: 'a_hard_chapter_in_the_open.html', tag: 'A Study, Built in the Open' }
      ]
    }
  ];

  var NAV_H = 54;   /* px — keep in sync with CSS */

  /* ── 1. Detect active page ─────────────────────────────────── */
  var here = window.location.pathname.split('/').pop() || 'index.html';

  /* ── 1b. JSON-LD structured data (Article / WebPage schema) ── */
  (function () {
    var PAGE_DATES = {
      'index.html':                          { pub: '2023-01-01', mod: '2026-07-02', type: 'WebSite'     },
      'what_god_is_like.html':               { pub: '2026-04-01', mod: '2026-07-01'                      },
      'mercy_extended.html':                 { pub: '2026-04-15', mod: '2026-07-14'                      },
      'relenting.html':                      { pub: '2026-03-15', mod: '2026-07-01'                      },
      'samaritan_woman_at_the_well.html':    { pub: '2026-03-01', mod: '2026-07-15'                      },
      'faith_in_action.html':                { pub: '2026-04-20', mod: '2026-07-02'                      },
      'isaiah_7_14_immanuel.html':           { pub: '2026-05-01', mod: '2026-07-01'                      },
      'sheol_hades_gehenna.html':            { pub: '2026-02-01', mod: '2026-07-15'                      },
      'lord_gods_and_the_satan.html':        { pub: '2026-05-15', mod: '2026-07-02'                      },
      'when_the_rain_stopped.html':          { pub: '2026-05-01', mod: '2026-07-01'                      },
      'when_the_answer_was_silence.html':    { pub: '2026-05-10', mod: '2026-06-22'                      },
      'water_withheld_water_given.html':     { pub: '2026-05-05', mod: '2026-07-01'                      },
      'good_and_evil_word_study.html':       { pub: '2026-04-01', mod: '2026-07-01'                      },
      'forfeited_access.html':               { pub: '2026-06-01', mod: '2026-06-22'                      },
      'david_saul_character_study.html':     { pub: '2026-06-18', mod: '2026-07-01'                      },
      'joab_indispensable_adversary.html':   { pub: '2026-06-16', mod: '2026-07-01'                      },
      'joab_from_gibeon_to_the_altar.html':  { pub: '2026-06-25', mod: '2026-07-01'                      },
      'canaan_backdrop.html':                { pub: '2026-06-09', mod: '2026-07-01'                      },
      'canaan_conquest.html':                { pub: '2026-06-09', mod: '2026-07-01'                      },
      'the_answer_that_didnt_come_true.html':{ pub: '2026-06-15', mod: '2026-06-22'                      },
      'jonah_the_mercy_he_feared.html':      { pub: '2026-06-24', mod: '2026-07-01'                      },
      'history_of_the_bible.html':           { pub: '2026-06-25', mod: '2026-07-14'                      },
      'jonah_marginalia.html':               { pub: '2026-06-24', mod: '2026-06-24', type: 'BlogPosting' },
      'contranyms_in_scripture.html':        { pub: '2026-06-25', mod: '2026-06-25', type: 'BlogPosting' },
      'the_true_word_in_a_false_mouth.html': { pub: '2026-06-28', mod: '2026-06-29'                      },
      'a_hard_chapter_in_the_open.html':     { pub: '2026-06-28', mod: '2026-06-28', type: 'BlogPosting' },
      'author_and_the_object.html':          { pub: '2026-03-15', mod: '2026-07-01'                      },
      'emotionally_charged_language.html':   { pub: '2026-04-01', mod: '2026-07-01'                      },
      'hardening_pharaohs_heart.html':       { pub: '2026-04-15', mod: '2026-07-02'                      },
      'water-before-the-word.html':          { pub: '2026-04-01', mod: '2026-07-02'                      },
      'gospel_timeline.html':                { pub: '2026-02-01', mod: '2026-06-22', type: 'WebPage'     },
      'the_law_resource.html':               { pub: '2026-02-15', mod: '2026-06-22', type: 'WebPage'     },
      'patriarchs_covenants_map.html':       { pub: '2026-03-01', mod: '2026-06-22', type: 'WebPage'     },
      'genealogy_adam_to_jesus.html':        { pub: '2026-03-01', mod: '2026-06-22', type: 'WebPage'     },
      'bible_book_summaries.html':           { pub: '2026-02-01', mod: '2026-06-22', type: 'WebPage'     },
      'spiritual_gifts.html':                { pub: '2026-02-01', mod: '2026-06-22', type: 'WebPage'     },
      'bible_language_guide.html':           { pub: '2026-02-15', mod: '2026-06-22', type: 'WebPage'     },
      'judges_to_kings_timeline.html':       { pub: '2026-06-15', mod: '2026-06-22', type: 'WebPage'     },
      'dispensationalism_test.html':         { pub: '2026-01-01', mod: '2026-06-09', type: 'WebPage'     },
      'how_this_project_works.html':         { pub: '2026-06-09', mod: '2026-07-14', type: 'WebPage'     },
      'how_we_grade.html':                   { pub: '2026-06-09', mod: '2026-07-14', type: 'WebPage'     },
      'about.html':                          { pub: '2023-01-01', mod: '2026-07-14', type: 'AboutPage'   },
      'strongs.html':                        { pub: '2026-01-01', mod: '2026-06-09', type: 'WebPage'     },
      'kjv_reader.html':                     { pub: '2026-01-01', mod: '2026-06-23', type: 'WebPage'     }
    };
    var m = PAGE_DATES[here];
    if (!m) return;
    var titleEl = document.querySelector('title');
    var descEl  = document.querySelector('meta[name="description"]');
    var canEl   = document.querySelector('link[rel="canonical"]');
    if (!titleEl || !descEl || !canEl) return;
    var ld = {
      '@context':     'https://schema.org',
      '@type':        m.type || 'Article',
      'headline':     titleEl.textContent.trim(),
      'description':  descEl.getAttribute('content'),
      'url':          canEl.getAttribute('href'),
      'datePublished': m.pub,
      'dateModified':  m.mod,
      'author':    { '@type': 'Person', 'name': 'Lee Sadler', 'url': 'https://readthescripture.com/about.html' },
      'publisher': { '@type': 'Organization', 'name': 'Read the Scripture', 'url': 'https://readthescripture.com' }
    };
    var s = document.createElement('script');
    s.type = 'application/ld+json';
    s.textContent = JSON.stringify(ld);
    document.head.appendChild(s);
  })();

  /* ── 2. Inject <style> into <head> ────────────────────────── */
  var css = [
    '@import url("https://fonts.googleapis.com/css2?family=Cinzel:wght@400;500;600&display=swap");',

    /* ── nav bar ─────────────────────────────────── */
    '#rts-nav {',
    '  position: fixed; top: 0; left: 0; right: 0; z-index: 99999;',
    '  height: ' + NAV_H + 'px;',
    '  background: #0E0A04;',
    '  border-bottom: 1px solid rgba(192,144,48,.20);',
    '  box-shadow: 0 2px 24px rgba(0,0,0,.55);',
    '  font-family: "Cinzel", serif;',
    '  overflow: visible;',   /* allow dropdowns to escape */
    '}',

    /* gold gradient line at bottom of bar */
    '#rts-nav::after {',
    '  content: "";',
    '  position: absolute; bottom: -1px; left: 0; right: 0; height: 1px;',
    '  background: linear-gradient(90deg, transparent, rgba(192,144,48,.55) 30%,',
    '    rgba(232,204,118,.80) 50%, rgba(192,144,48,.55) 70%, transparent);',
    '}',

    '#rts-nav-inner {',
    '  max-width: 1280px; margin: 0 auto;',
    '  height: 100%; padding: 0 20px;',
    '  display: flex; align-items: stretch; gap: 0;',
    '}',

    /* ── brand ───────────────────────────────────── */
    '#rts-nav .rts-brand {',
    '  display: flex; flex-direction: column; line-height: 1;',
    '  text-decoration: none; flex-shrink: 0;',
    '  justify-content: center;',
    '  margin-right: 18px; padding-right: 18px;',
    '  border-right: 1px solid rgba(192,144,48,.20);',
    '}',
    '#rts-nav .rts-brand-name {',
    '  font-size: 11px; font-weight: 600; letter-spacing: .15em;',
    '  text-transform: uppercase; color: #E8CC76;',
    '  transition: color .18s;',
    '}',
    '#rts-nav .rts-brand-sub {',
    '  font-family: Georgia, serif; font-style: italic;',
    '  font-size: 9px; color: rgba(232,204,118,.38);',
    '  margin-top: 2px; letter-spacing: .04em;',
    '}',
    '#rts-nav .rts-brand:hover .rts-brand-name { color: #fff; }',

    /* ── category buttons row ────────────────────── */
    '#rts-nav-cats {',
    '  display: flex; align-items: stretch; height: 100%; flex: 1; gap: 0;',
    '}',

    /* each category wrapper — position:relative anchors its dropdown */
    '.rts-cat {',
    '  position: relative;',
    '  display: flex; align-items: stretch;',
    '}',

    /* the button itself */
    '.rts-cat-btn {',
    '  display: flex; align-items: center; gap: 5px;',
    '  padding: 0 14px;',
    '  background: none; border: none; cursor: pointer;',
    '  border-bottom: 2px solid transparent;',
    '  transition: background .18s, border-color .18s;',
    '  white-space: nowrap;',
    '}',
    '.rts-cat-btn .rts-cat-label {',
    '  font-size: 9.5px; font-weight: 500; letter-spacing: .11em;',
    '  text-transform: uppercase; color: rgba(235,215,175,.62);',
    '  transition: color .18s;',
    '}',
    '.rts-cat-btn .rts-cat-arrow {',
    '  font-size: 7px; color: rgba(192,144,48,.45);',
    '  transition: transform .18s, color .18s;',
    '  line-height: 1;',
    '}',
    /* hover / open state */
    '.rts-cat:hover .rts-cat-btn,',
    '.rts-cat.rts-open .rts-cat-btn {',
    '  background: rgba(192,144,48,.07);',
    '  border-bottom-color: rgba(192,144,48,.35);',
    '}',
    '.rts-cat:hover .rts-cat-btn .rts-cat-label,',
    '.rts-cat.rts-open .rts-cat-btn .rts-cat-label { color: #E8CC76; }',
    '.rts-cat:hover .rts-cat-btn .rts-cat-arrow,',
    '.rts-cat.rts-open .rts-cat-btn .rts-cat-arrow {',
    '  color: #C09030; transform: rotate(180deg);',
    '}',
    /* active-category highlight */
    '.rts-cat.rts-active-cat .rts-cat-btn {',
    '  background: rgba(192,144,48,.10);',
    '  border-bottom-color: #C09030;',
    '}',
    '.rts-cat.rts-active-cat .rts-cat-btn .rts-cat-label { color: #E8CC76; }',
    '.rts-cat.rts-active-cat .rts-cat-btn .rts-cat-arrow { color: #C09030; }',

    /* ── dropdown panel ──────────────────────────── */
    '.rts-dropdown {',
    '  position: absolute; top: 100%; left: 0;',
    '  min-width: 220px;',
    '  background: #0E0A04;',
    '  border: 1px solid rgba(192,144,48,.22);',
    '  border-top: none;',
    '  box-shadow: 0 8px 32px rgba(0,0,0,.65);',
    '  opacity: 0; pointer-events: none;',
    '  transform: translateY(-4px);',
    '  transition: opacity .18s, transform .18s;',
    '  z-index: 100000;',
    '}',
    /* bottom gold line on panel */
    '.rts-dropdown::after {',
    '  content: "";',
    '  display: block; height: 1px;',
    '  background: linear-gradient(90deg, rgba(192,144,48,.50), transparent);',
    '}',
    '.rts-cat:hover .rts-dropdown,',
    '.rts-cat.rts-open .rts-dropdown {',
    '  opacity: 1; pointer-events: auto; transform: translateY(0);',
    '}',

    /* items inside dropdown */
    '.rts-dropdown a {',
    '  display: flex; flex-direction: column;',
    '  padding: 10px 16px;',
    '  text-decoration: none;',
    '  border-left: 2px solid transparent;',
    '  transition: background .14s, border-color .14s;',
    '}',
    '.rts-dropdown a + a {',
    '  border-top: 1px solid rgba(192,144,48,.08);',
    '}',
    '.rts-dropdown a .rts-dl {',
    '  font-size: 9.5px; font-weight: 500; letter-spacing: .10em;',
    '  text-transform: uppercase; color: rgba(235,215,175,.70);',
    '  transition: color .14s;',
    '}',
    '.rts-dropdown a .rts-dt {',
    '  font-family: Georgia, serif; font-style: italic;',
    '  font-size: 8.5px; color: rgba(192,144,48,.42);',
    '  margin-top: 2px; letter-spacing: .03em;',
    '  transition: color .14s;',
    '}',
    '.rts-dropdown a:hover {',
    '  background: rgba(192,144,48,.09);',
    '  border-left-color: rgba(192,144,48,.45);',
    '}',
    '.rts-dropdown a:hover .rts-dl { color: #E8CC76; }',
    '.rts-dropdown a:hover .rts-dt { color: rgba(232,204,118,.60); }',
    '.rts-dropdown a.rts-active {',
    '  background: rgba(192,144,48,.13);',
    '  border-left-color: #C09030;',
    '}',
    '.rts-dropdown a.rts-active .rts-dl { color: #E8CC76; }',
    '.rts-dropdown a.rts-active .rts-dt { color: rgba(232,204,118,.65); }',

    /* ── right-side home / about buttons ─────────── */
    '#rts-nav .rts-nav-right {',
    '  display: flex; align-items: center; gap: 6px;',
    '  margin-left: 12px; flex-shrink: 0;',
    '}',
    '#rts-nav .rts-home-btn,',
    '#rts-nav .rts-about-btn {',
    '  text-decoration: none;',
    '  font-size: 9px; letter-spacing: .12em; text-transform: uppercase;',
    '  padding: 6px 11px; border-radius: 3px;',
    '  border: 1px solid rgba(192,144,48,.18);',
    '  transition: all .18s;',
    '}',
    '#rts-nav .rts-home-btn {',
    '  color: rgba(192,144,48,.55);',
    '}',
    '#rts-nav .rts-about-btn {',
    '  color: rgba(192,144,48,.38);',
    '}',
    '#rts-nav .rts-home-btn:hover,',
    '#rts-nav .rts-about-btn:hover {',
    '  color: #E8CC76; border-color: rgba(192,144,48,.45);',
    '  background: rgba(192,144,48,.08);',
    '}',

    /* ── body shim ───────────────────────────────── */
    '#rts-body-shim { display: block; height: ' + NAV_H + 'px; }',

    /* ── hamburger (mobile only) ─────────────────── */
    '#rts-hamburger {',
    '  display: none; align-self: center; margin-left: auto; flex-shrink: 0;',
    '  width: 40px; height: 34px; padding: 0; cursor: pointer;',
    '  background: none; border: 1px solid rgba(192,144,48,.28); border-radius: 3px;',
    '  align-items: center; justify-content: center;',
    '}',
    '#rts-hamburger span, #rts-hamburger span::before, #rts-hamburger span::after {',
    '  display: block; width: 18px; height: 2px; background: #C09030; border-radius: 2px;',
    '}',
    '#rts-hamburger span { position: relative; }',
    '#rts-hamburger span::before, #rts-hamburger span::after { content: ""; position: absolute; left: 0; }',
    '#rts-hamburger span::before { top: -6px; }',
    '#rts-hamburger span::after { top: 6px; }',
    '#rts-hamburger:hover { border-color: rgba(192,144,48,.5); background: rgba(192,144,48,.08); }',

    /* ── mobile menu panel ───────────────────────── */
    '#rts-mobile-menu {',
    '  display: none;',
    '  position: fixed; top: ' + NAV_H + 'px; left: 0; right: 0;',
    '  max-height: calc(100vh - ' + NAV_H + 'px);',
    '  overflow-y: auto; -webkit-overflow-scrolling: touch;',
    '  background: #0E0A04;',
    '  border-bottom: 1px solid rgba(192,144,48,.30);',
    '  box-shadow: 0 12px 34px rgba(0,0,0,.7);',
    '  z-index: 99998;',
    '}',
    '#rts-mobile-menu.rts-mobile-open { display: block; }',
    '.rts-m-primary { display: flex; border-bottom: 1px solid rgba(192,144,48,.18); }',
    '.rts-m-primary a {',
    '  flex: 1; text-align: center; text-decoration: none;',
    '  font-family: "Cinzel", serif; font-size: 11px; letter-spacing: .14em; text-transform: uppercase;',
    '  color: #E8CC76; padding: 15px 8px;',
    '}',
    '.rts-m-primary a + a { border-left: 1px solid rgba(192,144,48,.15); }',
    '.rts-m-primary a:active { background: rgba(192,144,48,.10); }',
    '.rts-m-section-label {',
    '  font-family: "Cinzel", serif; font-size: 8.5px; font-weight: 600;',
    '  letter-spacing: .2em; text-transform: uppercase; color: rgba(192,144,48,.55);',
    '  padding: 13px 20px 6px; border-top: 1px solid rgba(192,144,48,.10);',
    '}',
    '.rts-m-link {',
    '  display: flex; flex-direction: column; padding: 11px 20px;',
    '  text-decoration: none; border-left: 2px solid transparent;',
    '}',
    '.rts-m-link .rts-m-l {',
    '  font-family: "Cinzel", serif; font-size: 11px; font-weight: 500; letter-spacing: .08em;',
    '  text-transform: uppercase; color: rgba(235,215,175,.78);',
    '}',
    '.rts-m-link .rts-m-t {',
    '  font-family: Georgia, serif; font-style: italic; font-size: 10px;',
    '  color: rgba(192,144,48,.45); margin-top: 2px;',
    '}',
    '.rts-m-link:active { background: rgba(192,144,48,.10); }',
    '.rts-m-link.rts-active { background: rgba(192,144,48,.12); border-left-color: #C09030; }',
    '.rts-m-link.rts-active .rts-m-l { color: #E8CC76; }',

    /* ── responsive switch ───────────────────────── */
    '@media (max-width: 720px) {',
    '  #rts-nav-cats { display: none !important; }',
    '  #rts-nav .rts-nav-right { display: none !important; }',
    '  #rts-hamburger { display: flex; }',
    '  #rts-nav .rts-brand { margin-right: 0; padding-right: 0; border-right: none; }',
    '}',
    '@media (min-width: 721px) {',
    '  #rts-mobile-menu { display: none !important; }',
    '}',

    /* ── site-wide credit / scripture notice ── */
    '#rts-credit {',
    '  background: #0E0A04; border-top: 1px solid rgba(192,144,48,.10);',
    '  padding: 16px 20px 22px; text-align: center;',
    '  font-family: "Cinzel", serif; font-size: 8.5px; line-height: 1.7;',
    '  letter-spacing: .14em; text-transform: uppercase;',
    '}',
    '#rts-credit a { color: rgba(232,204,118,.5); text-decoration: none; }',
    '#rts-credit a:hover { color: #E8CC76; }',
    '#rts-credit a.rts-support { color: #E8CC76; font-weight: 600; letter-spacing: .16em; }',
    '#rts-credit a.rts-support:hover { color: #fff; }',
    '#rts-credit .rts-cr-notice {',
    '  display: block; margin: 7px auto 0; max-width: 680px;',
    '  font-family: Georgia, serif; font-style: italic; font-size: 10px;',
    '  letter-spacing: .02em; text-transform: none; color: rgba(232,204,118,.26);',
    '}',

    /* ── newsletter signup (site-wide footer block) ── */
    '#rts-subscribe {',
    '  background: #0E0A04; border-top: 1px solid rgba(192,144,48,.10);',
    '  padding: 30px 20px 26px; text-align: center;',
    '}',
    '#rts-subscribe .rts-sub-h {',
    '  font-family: "Cinzel", serif; font-size: 13px; letter-spacing: .16em;',
    '  text-transform: uppercase; color: #E8CC76; margin: 0 0 6px;',
    '}',
    '#rts-subscribe .rts-sub-sub {',
    '  font-family: Georgia, serif; font-style: italic; font-size: 13px;',
    '  color: rgba(232,204,118,.55); margin: 0 auto 16px; max-width: 460px;',
    '}',
    '#rts-subscribe form {',
    '  display: flex; gap: 8px; justify-content: center; flex-wrap: wrap;',
    '  max-width: 460px; margin: 0 auto;',
    '}',
    '#rts-subscribe input[type=email] {',
    '  flex: 1 1 240px; min-width: 200px; padding: 10px 14px;',
    '  background: #FAF7F2; border: 1px solid #8A6018; border-radius: 4px;',
    '  font-family: Georgia, serif; font-size: 14px; color: #2C1E0A;',
    '}',
    '#rts-subscribe input[type=email]:focus {',
    '  outline: none; border-color: #C09030; box-shadow: 0 0 0 2px rgba(192,144,48,.3);',
    '}',
    '#rts-subscribe button {',
    '  padding: 10px 22px; cursor: pointer; border: none; border-radius: 4px;',
    '  background: linear-gradient(#E8CC76,#C09030); color: #181008;',
    '  font-family: "Cinzel", serif; font-size: 12px; font-weight: 600;',
    '  letter-spacing: .12em; text-transform: uppercase;',
    '}',
    '#rts-subscribe button:hover { background: linear-gradient(#F0DE9A,#D6A23C); }',
    '#rts-subscribe .rts-sub-fine {',
    '  display: block; margin-top: 12px; font-family: Georgia, serif;',
    '  font-size: 10.5px; color: rgba(232,204,118,.3);',
    '}',
    '#rts-subscribe .rts-sub-fine a { color: rgba(232,204,118,.45); }',

    /* ── site search ──────────────────────────────────── */
    '#rts-search-btn {',
    '  display: flex; align-items: center; justify-content: center;',
    '  width: 32px; height: 32px; padding: 0; cursor: pointer;',
    '  background: none; border: 1px solid rgba(192,144,48,.18); border-radius: 3px;',
    '  color: rgba(192,144,48,.55); font-size: 13px;',
    '  transition: all .18s; flex-shrink: 0;',
    '}',
    '#rts-search-btn:hover { color: #E8CC76; border-color: rgba(192,144,48,.45); background: rgba(192,144,48,.08); }',

    '#rts-search-overlay {',
    '  display: none; position: fixed;',
    '  top: ' + NAV_H + 'px; left: 0; right: 0;',
    '  background: #0E0A04; border-bottom: 1px solid rgba(192,144,48,.25);',
    '  box-shadow: 0 8px 28px rgba(0,0,0,.65);',
    '  z-index: 99997; padding: 12px 20px 10px;',
    '}',
    '#rts-search-overlay.rts-search-open { display: block; }',
    '#rts-search-input {',
    '  width: 100%; max-width: 640px; display: block; margin: 0 auto;',
    '  padding: 10px 14px; background: #FAF7F2;',
    '  border: 1px solid #8A6018; border-radius: 4px;',
    '  font-family: Georgia, serif; font-size: 15px; color: #2C1E0A;',
    '  box-sizing: border-box;',
    '}',
    '#rts-search-input:focus { outline: none; border-color: #C09030; box-shadow: 0 0 0 2px rgba(192,144,48,.28); }',
    '#rts-search-results {',
    '  max-width: 640px; margin: 8px auto 0;',
    '  display: none;',
    '}',
    '#rts-search-results.rts-has-results { display: block; }',
    '#rts-search-results a {',
    '  display: flex; justify-content: space-between; align-items: baseline;',
    '  padding: 9px 12px; text-decoration: none;',
    '  border-left: 2px solid transparent;',
    '  border-bottom: 1px solid rgba(192,144,48,.08);',
    '  transition: background .14s, border-color .14s;',
    '}',
    '#rts-search-results a:hover { background: rgba(192,144,48,.09); border-left-color: rgba(192,144,48,.45); }',
    '#rts-search-results .rts-sr-label {',
    '  font-family: "Cinzel", serif; font-size: 10px; font-weight: 500;',
    '  letter-spacing: .10em; text-transform: uppercase; color: rgba(235,215,175,.78);',
    '}',
    '#rts-search-results .rts-sr-tag {',
    '  font-family: Georgia, serif; font-style: italic; font-size: 10px;',
    '  color: rgba(192,144,48,.45);',
    '}',
    '#rts-search-no-results {',
    '  display: none; max-width: 640px; margin: 8px auto 0;',
    '  font-family: Georgia, serif; font-style: italic; font-size: 12px;',
    '  color: rgba(232,204,118,.35); padding: 6px 12px;',
    '}',
    '#rts-search-no-results.rts-visible { display: block; }'

  ].join('\n');

  var style = document.createElement('style');
  style.id  = 'rts-nav-styles';
  style.textContent = css;
  document.head.appendChild(style);

  /* ── 3. Build nav HTML ─────────────────────────────────────── */
  var nav = document.createElement('nav');
  nav.id = 'rts-nav';
  nav.setAttribute('role', 'navigation');
  nav.setAttribute('aria-label', 'Site navigation');

  var inner = document.createElement('div');
  inner.id = 'rts-nav-inner';

  /* brand */
  var brand = document.createElement('a');
  brand.className = 'rts-brand';
  brand.href = BASE + 'index.html';
  brand.innerHTML = '<span class="rts-brand-name">Read the Scripture</span>'
                  + '<span class="rts-brand-sub">readthescripture.com</span>';
  inner.appendChild(brand);

  /* category dropdowns */
  var catsRow = document.createElement('div');
  catsRow.id = 'rts-nav-cats';

  CATEGORIES.forEach(function (cat) {
    /* check if the active page lives in this category */
    var catIsActive = cat.pages.some(function (p) { return p.file === here; });

    var wrap = document.createElement('div');
    wrap.className = 'rts-cat' + (catIsActive ? ' rts-active-cat' : '');

    /* button */
    var btn = document.createElement('button');
    btn.className = 'rts-cat-btn';
    btn.setAttribute('aria-haspopup', 'true');
    btn.setAttribute('aria-expanded', 'false');
    btn.setAttribute('type', 'button');
    btn.innerHTML = '<span class="rts-cat-label">' + cat.label + '</span>'
                  + '<span class="rts-cat-arrow">▾</span>';

    /* dropdown panel */
    var panel = document.createElement('div');
    panel.className = 'rts-dropdown';
    panel.setAttribute('role', 'menu');

    cat.pages.forEach(function (p) {
      var a = document.createElement('a');
      a.href = BASE + p.file;
      a.setAttribute('role', 'menuitem');
      a.innerHTML = '<span class="rts-dl">' + p.label + '</span>'
                  + '<span class="rts-dt">' + p.tag  + '</span>';
      if (here === p.file) a.className = 'rts-active';
      panel.appendChild(a);
    });

    wrap.appendChild(btn);
    wrap.appendChild(panel);
    catsRow.appendChild(wrap);

    /* keyboard / touch toggle */
    btn.addEventListener('click', function () {
      var isOpen = wrap.classList.contains('rts-open');
      /* close all others */
      var allWraps = catsRow.querySelectorAll('.rts-cat');
      allWraps.forEach(function (w) {
        w.classList.remove('rts-open');
        w.querySelector('.rts-cat-btn').setAttribute('aria-expanded', 'false');
      });
      if (!isOpen) {
        wrap.classList.add('rts-open');
        btn.setAttribute('aria-expanded', 'true');
      }
    });
  });

  /* close all dropdowns when clicking outside */
  document.addEventListener('click', function (e) {
    if (!nav.contains(e.target)) {
      var allWraps = catsRow.querySelectorAll('.rts-cat');
      allWraps.forEach(function (w) {
        w.classList.remove('rts-open');
        var b = w.querySelector('.rts-cat-btn');
        if (b) b.setAttribute('aria-expanded', 'false');
      });
    }
  });

  inner.appendChild(catsRow);

  /* right-side home + about buttons */
  var right = document.createElement('div');
  right.className = 'rts-nav-right';

  /* search button */
  var searchBtn = document.createElement('button');
  searchBtn.id   = 'rts-search-btn';
  searchBtn.type = 'button';
  searchBtn.setAttribute('aria-label', 'Search');
  searchBtn.innerHTML = '&#9906;'; /* ⚲ search/pointer icon */
  right.appendChild(searchBtn);

  var aboutBtn = document.createElement('a');
  aboutBtn.className = 'rts-about-btn';
  aboutBtn.href = BASE + 'about.html';
  aboutBtn.textContent = 'About';
  right.appendChild(aboutBtn);

  var homeBtn = document.createElement('a');
  homeBtn.className = 'rts-home-btn';
  homeBtn.href = BASE + 'index.html';
  homeBtn.textContent = here === 'index.html' ? '✦ Home' : '← Home';
  right.appendChild(homeBtn);

  inner.appendChild(right);

  /* hamburger button (visible on mobile only) */
  var burger = document.createElement('button');
  burger.id = 'rts-hamburger';
  burger.setAttribute('type', 'button');
  burger.setAttribute('aria-label', 'Menu');
  burger.setAttribute('aria-expanded', 'false');
  burger.innerHTML = '<span></span>';
  inner.appendChild(burger);

  nav.appendChild(inner);

  /* ── Search overlay ─────────────────────────────────────────── */
  /* Curated search keywords per page: passage reference, key figures and
     places, and the phrases a reader is actually likely to type — not an
     index of every proper name in the article. Keyed by file so CATEGORIES
     stays readable. Keep in sync when a page's subject changes. */
  var PAGE_KEYWORDS = {
    'kjv_reader.html': 'king james version 1611 read bible online full text old new testament',
    'strongs.html': 'strongs concordance hebrew greek lexicon dictionary word numbers lookup original language definitions',
    'what_god_is_like.html': 'character of god divine attributes impassibility anthropopathism names of god yhwh self-descriptions',
    'mercy_extended.html': 'mercy grace genesis abraham intercession lot noah overflow sodom',
    'relenting.html': 'god relenting naham changing his mind exodus 32 numbers 14 impassibility moses intercession does god change his mind',
    'samaritan_woman_at_the_well.html': 'samaritan woman well john 4 living water jacobs well jesus samaritans',
    'faith_in_action.html': 'faith centurion matthew 8 canaanite woman hemorrhaging woman abram melchizedek faith moves',
    'when_the_answer_was_silence.html': 'gods silence unanswered prayer job psalm 88 habakkuk silent god',
    'when_the_rain_stopped.html': 'elijah baal mount carmel 1 kings 18 drought ahab jezebel fire from heaven',
    'water-before-the-word.html': 'water genesis 1 creation waters jacobs well living water',
    'water_withheld_water_given.html': 'drought living water covenant curse elijah 1 kings revelation 22 river of life',
    'isaiah_7_14_immanuel.html': 'isaiah 7:14 immanuel virgin birth almah parthenos messianic prophecy matthew 1:23 dual fulfillment',
    'hardening_pharaohs_heart.html': 'hardening pharaohs heart exodus plagues qashah chazaq kabad three hebrew words',
    'forfeited_access.html': 'saul forfeited access ephod oracle 1 samuel spirit of god david 16-31',
    'the_answer_that_didnt_come_true.html': 'keilah 1 samuel 23 averted oracle conditional prophecy david foreknowledge',
    'jonah_the_mercy_he_feared.html': 'jonah nineveh mercy raah wordplay relenting angry at mercy prophet',
    'history_of_the_bible.html': 'how we got the bible canon dead sea scrolls masoretic septuagint textual criticism manuscripts transmission nicaea',
    'good_and_evil_word_study.html': 'good and evil hebrew tov ra tree of knowledge genesis word study semantics',
    'lord_gods_and_the_satan.html': 'divine council el elohim yhwh the satan job sons of god monotheism deuteronomy 32:8 unseen world',
    'sheol_hades_gehenna.html': 'sheol hades gehenna hell afterlife underworld pit greek words for hell eschatology death',
    'david_saul_character_study.html': 'saul david character 1 samuel anointed king after gods own heart apology of david brueggemann alter',
    'joab_indispensable_adversary.html': 'joab davids general court history 2 samuel 1 kings meshal abner asahel',
    'canaan_backdrop.html': 'canaanite conquest background curse of canaan table of nations archaeology four hundred year clock',
    'canaan_conquest.html': 'canaanite conquest herem devotion destruction genocide jericho joshua divine violence',
    'the_true_word_in_a_false_mouth.html': '1 kings 13 man of god old prophet deception true word false mouth providence jeroboam altar bethel dan lion',
    'jonah_marginalia.html': 'jonah personal reading opinion mercy prophet believer reflection',
    'contranyms_in_scripture.html': 'contranyms barak bless curse opposite meanings wordplay peirazo tempt test semantic range',
    'joab_from_gibeon_to_the_altar.html': 'joab narrative gibeon altar retelling asahel abishai 2 samuel 1 kings story',
    'a_hard_chapter_in_the_open.html': 'bible study method transparent 1 kings 13 process difficult passage rigorous research',
    'gospel_timeline.html': 'gospel timeline four gospels matthew mark luke john harmony jesus chronology synoptic',
    'the_law_resource.html': 'law of moses torah commandments ceremonial moral civil mosaic law',
    'patriarchs_covenants_map.html': 'patriarchs covenants abraham isaac jacob abrahamic covenant genesis',
    'judges_to_kings_timeline.html': 'judges to kings timeline saul david solomon monarchy 1 samuel 2 samuel',
    'genealogy_adam_to_jesus.html': 'genealogy adam to jesus biblical genealogies table of nations abraham david lineage patriarchs',
    'bible_book_summaries.html': 'bible book summaries all 66 books old new testament overview reference what is each book',
    'bible_language_guide.html': 'biblical languages hebrew greek aramaic koine alphabet original languages',
    'dispensationalism_test.html': 'dispensationalism test covenant theology eschatology rapture israel and the church quiz',
    'spiritual_gifts.html': 'spiritual gifts assessment gifts of the spirit 1 corinthians 12 romans 12 ephesians 4 test',
    'how_this_project_works.html': 'how to study the bible original language methodology honest reading genesis 1 deir alla balaam',
    'how_we_grade.html': 'blind grading methodology reasoning quality transparent evaluation',
    'author_and_the_object.html': 'god and time outside time eternal transcendence timelessness author object analogy',
    'emotionally_charged_language.html': 'slavery emotionally charged language difficult texts doulos ebed eisegesis exegesis'
  };
  /* Build a flat list of all pages for searching */
  var searchIndex = [];
  CATEGORIES.forEach(function (cat) {
    cat.pages.forEach(function (p) {
      searchIndex.push({ label: p.label, tag: p.tag, file: p.file,
                         search: (p.label + ' ' + p.tag + ' ' + cat.label + ' ' + (PAGE_KEYWORDS[p.file] || '')).toLowerCase() });
    });
  });

  var searchOverlay = document.createElement('div');
  searchOverlay.id = 'rts-search-overlay';
  searchOverlay.setAttribute('role', 'dialog');
  searchOverlay.setAttribute('aria-modal', 'true');
  searchOverlay.setAttribute('aria-label', 'Site search');

  var searchInput = document.createElement('input');
  searchInput.id = 'rts-search-input';
  searchInput.type = 'text';
  searchInput.placeholder = 'Search pages — e.g. "Elijah", "1 Kings", "canon"…';
  searchInput.setAttribute('aria-label', 'Search site pages');
  searchInput.setAttribute('autocomplete', 'off');
  searchOverlay.appendChild(searchInput);

  var searchResults = document.createElement('div');
  searchResults.id = 'rts-search-results';
  searchOverlay.appendChild(searchResults);

  var searchNoResults = document.createElement('div');
  searchNoResults.id = 'rts-search-no-results';
  searchNoResults.textContent = 'No pages match.';
  searchOverlay.appendChild(searchNoResults);

  document.body.appendChild(searchOverlay);

  function runSearch(q) {
    q = q.trim().toLowerCase();
    searchResults.innerHTML = '';
    searchResults.classList.remove('rts-has-results');
    searchNoResults.classList.remove('rts-visible');
    if (!q) return;
    var words = q.split(/\s+/);
    var matches = searchIndex.filter(function (p) {
      return words.every(function (w) { return p.search.indexOf(w) !== -1; });
    }).slice(0, 10);
    if (!matches.length) { searchNoResults.classList.add('rts-visible'); return; }
    matches.forEach(function (p) {
      var a = document.createElement('a');
      a.href = BASE + p.file;
      a.innerHTML = '<span class="rts-sr-label">' + p.label + '</span>'
                  + '<span class="rts-sr-tag">'   + p.tag   + '</span>';
      searchResults.appendChild(a);
    });
    searchResults.classList.add('rts-has-results');
  }

  searchInput.addEventListener('input', function () { runSearch(this.value); });

  /* Focus trap: Tab cycles within the open overlay; Escape closes and
     returns focus to the search button. */
  searchOverlay.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') { closeSearch(true); return; }
    if (e.key !== 'Tab') return;
    var focusables = [searchInput].concat(
      Array.prototype.slice.call(searchResults.querySelectorAll('a')));
    var first = focusables[0];
    var last  = focusables[focusables.length - 1];
    if (e.shiftKey && document.activeElement === first) {
      e.preventDefault(); last.focus();
    } else if (!e.shiftKey && document.activeElement === last) {
      e.preventDefault(); first.focus();
    }
  });

  function openSearch() {
    searchOverlay.classList.add('rts-search-open');
    searchInput.value = '';
    searchResults.innerHTML = '';
    searchResults.classList.remove('rts-has-results');
    searchNoResults.classList.remove('rts-visible');
    setTimeout(function () { searchInput.focus(); }, 50);
  }
  function closeSearch(restoreFocus) {
    if (!searchOverlay.classList.contains('rts-search-open')) return;
    searchOverlay.classList.remove('rts-search-open');
    searchInput.blur();
    if (restoreFocus && searchBtn) searchBtn.focus();
  }

  searchBtn.addEventListener('click', function (e) {
    e.stopPropagation();
    if (searchOverlay.classList.contains('rts-search-open')) { closeSearch(); } else { openSearch(); }
  });
  document.addEventListener('click', function (e) {
    if (!searchOverlay.contains(e.target) && e.target !== searchBtn) {
      closeSearch();
    }
  });

  /* ── mobile menu panel — built from the same catalogue ─────── */
  var mobile = document.createElement('div');
  mobile.id = 'rts-mobile-menu';

  var mPrimary = document.createElement('div');
  mPrimary.className = 'rts-m-primary';
  var mHome = document.createElement('a');
  mHome.href = BASE + 'index.html';
  mHome.textContent = (here === 'index.html' ? '✦ Home' : 'Home');
  var mAbout = document.createElement('a');
  mAbout.href = BASE + 'about.html';
  mAbout.textContent = 'About';
  mPrimary.appendChild(mHome);
  mPrimary.appendChild(mAbout);
  mobile.appendChild(mPrimary);

  CATEGORIES.forEach(function (cat) {
    var lbl = document.createElement('div');
    lbl.className = 'rts-m-section-label';
    lbl.textContent = cat.label;
    mobile.appendChild(lbl);
    cat.pages.forEach(function (p) {
      var a = document.createElement('a');
      a.href = BASE + p.file;
      a.className = 'rts-m-link' + (here === p.file ? ' rts-active' : '');
      a.innerHTML = '<span class="rts-m-l">' + p.label + '</span>'
                  + '<span class="rts-m-t">' + p.tag + '</span>';
      mobile.appendChild(a);
    });
  });

  nav.appendChild(mobile);

  /* hamburger toggle + outside-tap close */
  burger.addEventListener('click', function (e) {
    e.stopPropagation();
    var open = mobile.classList.toggle('rts-mobile-open');
    burger.setAttribute('aria-expanded', open ? 'true' : 'false');
  });
  document.addEventListener('click', function (e) {
    if (!nav.contains(e.target)) {
      mobile.classList.remove('rts-mobile-open');
      burger.setAttribute('aria-expanded', 'false');
    }
  });

  /* ── 4. Insert nav + shim at top of <body> ─────────────────── */
  var shim = document.createElement('div');
  shim.id = 'rts-body-shim';

  document.body.insertBefore(shim, document.body.firstChild);
  document.body.insertBefore(nav,  document.body.firstChild);

  /* ── 4b. Site-wide newsletter signup (Buttondown embed) ── */
  var sub = document.createElement('div');
  sub.id = 'rts-subscribe';
  sub.innerHTML =
      '<p class="rts-sub-h">Read the Scripture</p>'
    + '<p class="rts-sub-sub">New studies and notes, sent as they’re published. '
    + 'Your reading of Scripture, tested rather than confirmed.</p>'
    + '<form action="https://buttondown.com/api/emails/embed-subscribe/readthescripture" '
    + 'method="post" class="embeddable-buttondown-form">'
    + '<label for="bd-email" style="position:absolute;width:1px;height:1px;'
    + 'overflow:hidden;clip:rect(0 0 0 0);">Enter your email</label>'
    + '<input type="email" name="email" id="bd-email" placeholder="you@example.com" required />'
    + '<button type="submit">Subscribe</button>'
    + '</form>'
    + '<span class="rts-sub-fine">No spam. Unsubscribe anytime. '
    + '<a href="https://buttondown.com/refer/readthescripture" target="_blank" rel="noopener">'
    + 'Powered by Buttondown.</a></span>';
  /* footer appended on DOM ready (see below) */

  /* ── 5. Site-wide credit line: About + Contact links + NRSVue notice ── */
  var credit = document.createElement('div');
  credit.id = 'rts-credit';
  credit.innerHTML = '<a href="' + BASE + 'about.html">About</a>'
    + ' &nbsp;·&nbsp; <a href="mailto:lee.sadler@readthescripture.com">Contact</a>'
    + ' &nbsp;·&nbsp; <a href="https://github.com/ostrakographos/readthescripture" target="_blank" rel="noopener">Public Record</a>'
    + ' &nbsp;·&nbsp; <a class="rts-support" href="https://ko-fi.com/readthescripture" target="_blank" rel="noopener">Support</a>'
    + '<span class="rts-cr-notice">Scripture quotations are taken from the New Revised Standard Version Updated Edition. '
    + 'Copyright © 2021 National Council of Churches of Christ in the United States of America. '
    + 'Used by permission. All rights reserved worldwide.</span>';
  /* footer appended on DOM ready (see below) */

  /* ── 6. GoatCounter analytics (privacy-first, cookieless) ── */
  var gc = document.createElement('script');
  gc.setAttribute('data-goatcounter', 'https://readthescripture.goatcounter.com/count');
  gc.async = true;
  gc.src = 'https://gc.zgo.at/count.js';
  function rtsAddFooter(){ document.body.appendChild(sub); document.body.appendChild(credit); document.body.appendChild(gc); }
  if (document.readyState === "loading") { document.addEventListener("DOMContentLoaded", rtsAddFooter); } else { rtsAddFooter(); }

})();