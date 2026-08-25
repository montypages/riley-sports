import { normalizeMlbGame, normalizeNflGame, todayStr, sortFavoritesFirst, flattenNflCalendar, findNflWeek } from '$lib/normalize.js';

// Simple in-memory cache — the season calendar barely changes, no need to refetch every request
let calendarCache = { weeks: null, fetchedAt: 0 };
const CALENDAR_TTL_MS = 6 * 60 * 60 * 1000; // 6 hours

async function getNflCalendar(fetch) {
	if (calendarCache.weeks && Date.now() - calendarCache.fetchedAt < CALENDAR_TTL_MS) {
		return calendarCache.weeks;
	}
	const res = await fetch('https://site.api.espn.com/apis/site/v2/sports/football/nfl/scoreboard');
	const data = await res.json();
	const weeks = flattenNflCalendar(data.leagues?.[0]?.calendar);
	calendarCache = { weeks, fetchedAt: Date.now() };
	return weeks;
}

export async function load({ url, fetch }) {
	const league = url.searchParams.get('league') ?? 'mlb';

	if (league === 'nfl') {
		const weeks = await getNflCalendar(fetch);
		const weekParam = url.searchParams.get('week');
		const idx = findNflWeek(weeks, weekParam);
		const week = weeks[idx];

		const games = await loadNflGames(fetch, week.startDate, week.endDate);

		return {
			league,
			weekLabel: week.label,
			weekParam: week.startDate,
			prevWeekParam: idx > 0 ? weeks[idx - 1].startDate : null,
			nextWeekParam: idx < weeks.length - 1 ? weeks[idx + 1].startDate : null,
			games
		};
	}

	const date = url.searchParams.get('date') ?? todayStr();
	const games = await loadMlbGames(fetch, date);
	return { league, date, games };
}

async function loadMlbGames(fetch, date) {
	const res = await fetch(
		`https://statsapi.mlb.com/api/v1/schedule?sportId=1&date=${date}&hydrate=linescore`
	);
	if (!res.ok) return [];
	const data = await res.json();
	const games = data.dates?.[0]?.games ?? [];
	return sortFavoritesFirst(games.map((g) => ({ id: g.gamePk, ...normalizeMlbGame(g) })));
}

async function loadNflGames(fetch, startDate, endDate) {
	const range = `${startDate.replaceAll('-', '')}-${endDate.replaceAll('-', '')}`;
	const res = await fetch(
		`https://site.api.espn.com/apis/site/v2/sports/football/nfl/scoreboard?dates=${range}`
	);
	if (!res.ok) return [];
	const data = await res.json();
	const events = data.events ?? [];
	return sortFavoritesFirst(events.map((e) => ({ id: e.id, ...normalizeNflGame(e) })));
}