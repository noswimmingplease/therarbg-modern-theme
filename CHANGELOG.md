# Changelog

## 0.2.2 - 2026-09-10

- Keep search suggestions below the search controls across themed pages and screen sizes so they cannot cover the text being entered.

## 0.2.1 - 2026-08-24

- Condense the README feature summary to the most useful end-user highlights.

## 0.2.0 - 2026-08-22

- Standardise pagination buttons and their bottom spacing across every themed route, including poster-card listings.
- Restyle Movie and TV catalogue result pages with themed filters and responsive contained result cards.
- Increase text contrast on catalogue genre and Movie/TV selector buttons.
- Capitalise catalogue genre labels and expand hyphenated names for display.
- Give the active Movie/TV catalogue selector a distinct high-contrast state.
- Apply the shared palette, search controls, footer and responsive tile styling to `/main-page-list`.
- Theme Hot Picks, Top Ten, Latest Trailers and Box Office using shared dashboard or poster-card treatments.
- Remove the Original RARBG tile from `/main-page-list`.
- Restore and clearly label the compact Type indicator column on homepage torrent tables.
- Remove the redundant homepage Category column and result-count line.
- Apply equal visible padding around each homepage table.
- Singularise Movie, Documentary, Game, App and Book homepage section headings.
- Style `/trending` routes like `/get-posts` results pages.
- Keep hovered cover previews above sticky table headers without clipping.
- Keep dashboard filenames to one line with ellipsis and abbreviate hours/minutes.
- Constrain dashboard tables to their cards while the File column uses the remaining width.
- Centre Type, Added, Time, Size, Se. and Le. dashboard columns.
- Apply consistent padding around `/get-posts` and trending results tables.
- Add the missing inset inside the generated DataTables results wrapper.
- Centre results metadata columns and abbreviate their Time Since values.
- Abbreviate week, month and year units across every Time or Time Since column.
- Abbreviate day values, expand S./L. to SE./LE. and space sorting arrows across all tables.
- Remove leading Font Awesome and literal down arrows without suppressing DataTables sorting indicators.

## 0.1.9 - 2026-08-22

- Collapse the Clear filters action and its empty row until the filter panel is opened.
- Remove the redundant per-table search boxes from the ten-item homepage category cards.
- Remove the cryptic `C` type column and improve table-header spacing around sort controls.

## 0.1.8 - 2026-08-22

- Rename the userscript to **TheRARBG Tampermonkey Theme**.
- Extend the responsive palette theming to torrent-detail pages, including download controls, metadata, images, technical descriptions, similar posts, files, comments and modals.
- Condense the shared footer into a single responsive desktop row.

## 0.1.7 - 2026-08-21

- Hide, disable and clear the XXX search filter whenever the global XXX content switch is off.
- Clear the stored XXX filter state without changing any other saved search filters.
- Recalculate the poster carousel immediately when thumbnails are revealed after hidden initialisation.

## 0.1.6 - 2026-08-21

- Use the available width on the homepage for a responsive two-column category dashboard.
- Pair Movies with Documentaries, TV with Anime, Games with Apps, and Music with Books.
- Keep the XXX category in a full-width final row and preserve all existing table controls and links.
- Keep paired category cards equal in height and align their action buttons along the bottom.
- Scale each card's three action buttons evenly across the available width.
- Switch to a single-column dashboard based on usable content width and remove the redundant side navigation from narrow windows.
- Simplify very narrow tables to the file and availability columns to avoid horizontal scrolling.
- Let the search form fill the available row width and stack cleanly below the XXX control on narrow screens.
- Expand the category and size filter panel across the complete form width.
- Resize the filter controls from eight to four, two or one column according to the form's usable width.
- Present category filters as responsive selection tiles in a single full-width search card.
- Replace the cryptic filter arrow and Reset labels with **Filters**, **Hide filters** and **Clear filters**.
- Make the XXX visibility switch prominent and show its current state.
- Rename the extras control to **Show thumbnails** and **Hide thumbnails**.
- Replace the unclear **C** table heading with **Type** and add accessible names to the search and content-type controls.

## 0.1.5 - 2026-08-21

- Restrict the userscript to its supported home, results and catalogue routes.
- Add explicit Tampermonkey update, download, project and support addresses.
- Expand the installation, usage, update, removal, privacy and troubleshooting guidance.

## 0.1.4 - 2026-08-10

- Add 12 persistent dark colour palettes.
- Improve layout, typography, contrast and responsive result tables.
- Add the optional extras control for secondary page sections.
