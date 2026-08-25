// lib/normalize.js

function mapMlbStatus(abstractGameState) {
	switch (abstractGameState) {
		case 'Live': return 'live';
		case 'Final': return 'final';
		default: return 'pre'; // 'Preview'
	}
}

function mapNflStatus(state) {
	switch (state) {
		case 'in': return 'live';
		case 'post': return 'final';
		default: return 'pre'; // 'pre'
	}
}


export function normalizeMlbGame(g) {
	const away = g.teams.away, home = g.teams.home;
	const status = mapMlbStatus(g.status.abstractGameState);

	let periodLines = [g.status.detailedState];
	if (status === 'live') {
		const half = g.linescore?.inningState ?? '';
		const inning = g.linescore?.currentInning ?? '';
		const outs = g.linescore?.outs ?? 0;
		periodLines = [`${half} ${inning}`.trim(), `${outs} Out${outs === 1 ? '' : 's'}`];
	}

	return {
		away: {
			name: away.team.name,
			record: `${away.leagueRecord.wins}-${away.leagueRecord.losses}`,
			score: away.score ?? null
		},
		home: {
			name: home.team.name,
			record: `${home.leagueRecord.wins}-${home.leagueRecord.losses}`,
			score: home.score ?? null
		},
		periodLines,
		status,
		isLive: status === 'live'
	};
}

export function normalizeNflGame(event) {
	const comp = event.competitions[0];
	const away = comp.competitors.find((c) => c.homeAway === 'away');
	const home = comp.competitors.find((c) => c.homeAway === 'home');
	const status = mapNflStatus(event.status.type.state);

	let periodLines = [event.status.type.shortDetail];
	if (status === 'live') {
		const quarter = event.status.period;
		const clock = event.status.displayClock;
		const qLabel = quarter > 4 ? 'OT' : `${quarter}${['st', 'nd', 'rd', 'th'][quarter - 1] ?? 'th'}`;
		periodLines = [qLabel, clock];
	}

	return {
		away: { name: away.team.displayName, record: away.records?.[0]?.summary ?? '', score: away.score ?? null },
		home: { name: home.team.displayName, record: home.records?.[0]?.summary ?? '', score: home.score ?? null },
		periodLines,
		status,
		isLive: status === 'live'
	};
}

// Given any date, return the Thursday that starts its NFL week.
// Thu/Fri/Sat/Sun/Mon all belong to the week starting that Thursday.
// Tue/Wed (the "gap" after Monday night) roll forward to the next Thursday.
export function getNflWeekStart(dateStr) {
	const d = new Date(dateStr + 'T00:00:00');
	const day = d.getDay(); // 0=Sun ... 4=Thu ... 6=Sat

	if (day === 2 || day === 3) {
		d.setDate(d.getDate() + (4 - day)); // roll forward to Thursday
	} else {
		const diff = (day - 4 + 7) % 7; // days since most recent Thursday
		d.setDate(d.getDate() - diff);
	}
	return d.toISOString().slice(0, 10);
}

export function todayStr() {
	// Pacific-time "today" regardless of server timezone
	const parts = new Intl.DateTimeFormat('en-CA', {
		timeZone: 'America/Los_Angeles',
		year: 'numeric',
		month: '2-digit',
		day: '2-digit'
	}).formatToParts(new Date());

	const map = Object.fromEntries(parts.map((p) => [p.type, p.value]));
	return `${map.year}-${map.month}-${map.day}`; // YYYY-MM-DD, still your internal format
}

export function formatDisplayDate(dateStr) {
	const [y, m, d] = dateStr.split('-');
	return `${m}-${d}-${y}`;
}

export function addDays(dateStr, days) {
	const d = new Date(dateStr + 'T00:00:00');
	d.setDate(d.getDate() + days);
	return d.toISOString().slice(0, 10);
}

const FAVORITE_TEAMS = ['Seattle Mariners', 'Seattle Seahawks'];

export function sortFavoritesFirst(games) {
	return [...games].sort((a, b) => {
		const aFav = FAVORITE_TEAMS.includes(a.away.name) || FAVORITE_TEAMS.includes(a.home.name);
		const bFav = FAVORITE_TEAMS.includes(b.away.name) || FAVORITE_TEAMS.includes(b.home.name);
		return aFav === bFav ? 0 : aFav ? -1 : 1;
	});
}