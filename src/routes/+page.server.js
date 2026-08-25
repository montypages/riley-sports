import { normalizeMlbGame, normalizeNflGame, todayStr, getNflWeekStart, addDays, sortFavoritesFirst } from '$lib/normalize.js';


export async function load({ url, fetch }) {
	const league = url.searchParams.get('league') ?? 'mlb';
	const rawDate = url.searchParams.get('date') ?? todayStr();

	if (league === 'nfl') {
		const weekStart = getNflWeekStart(rawDate);
		const games = await loadNflGames(fetch, weekStart);
		return { league, date: weekStart, weekEnd: addDays(weekStart, 4), games };
	}

	const games = await loadMlbGames(fetch, rawDate);
	return { league, date: rawDate, games };
}

async function loadMlbGames(fetch, date) {
	const res = await fetch(`https://statsapi.mlb.com/api/v1/schedule?sportId=1&date=${date}`);
	if (!res.ok) return [];
	const data = await res.json();
	const games = data.dates?.[0]?.games ?? [];
	return sortFavoritesFirst(games.map((g) => ({ id: g.gamePk, ...normalizeMlbGame(g) })));
}

async function loadNflGames(fetch, weekStart) {
	const weekEnd = addDays(weekStart, 4);
	const range = `${weekStart.replaceAll('-', '')}-${weekEnd.replaceAll('-', '')}`;
	const res = await fetch(
		`https://site.api.espn.com/apis/site/v2/sports/football/nfl/scoreboard?dates=${range}`
	);
	if (!res.ok) return [];
	const data = await res.json();
	const events = data.events ?? [];
	return sortFavoritesFirst(events.map((e) => ({ id: e.id, ...normalizeNflGame(e) })));
}