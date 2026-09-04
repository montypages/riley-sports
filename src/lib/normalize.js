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
		league: 'mlb',
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
		league: 'nfl',
		away: { name: away.team.displayName, record: away.records?.[0]?.summary ?? '', score: away.score ?? null },
		home: { name: home.team.displayName, record: home.records?.[0]?.summary ?? '', score: home.score ?? null },
		periodLines,
		status,
		isLive: status === 'live'
	};
}


export function toPacificDateStr(isoUtc) {
	const parts = new Intl.DateTimeFormat('en-CA', {
		timeZone: 'America/Los_Angeles',
		year: 'numeric',
		month: '2-digit',
		day: '2-digit'
	}).formatToParts(new Date(isoUtc));
	const map = Object.fromEntries(parts.map((p) => [p.type, p.value]));
	return `${map.year}-${map.month}-${map.day}`;
}



// Flattens ESPN's calendar (grouped by season type) into one chronological list
export function flattenNflCalendar(calendar) {
	const weeks = [];
	for (const group of calendar ?? []) {
		for (const entry of group.entries ?? []) {
			weeks.push({
				label: entry.label, // e.g. "Preseason Week 2", "Wild Card"
				startDate: toPacificDateStr(entry.startDate),
				endDate: toPacificDateStr(entry.endDate)
			});
		}
	}
	return weeks; // already in chronological order
}

// Finds the week entry for a given Pacific date string, or the current/next week if omitted
export function findNflWeek(weeks, weekParam) {
	if (weekParam) {
		const idx = weeks.findIndex((w) => w.startDate === weekParam);
		if (idx !== -1) return idx;
	}
	const today = todayStr();
	let idx = weeks.findIndex((w) => today >= w.startDate && today <= w.endDate);
	if (idx === -1) idx = weeks.findIndex((w) => w.startDate > today);
	if (idx === -1) idx = weeks.length - 1; // season over, show last week
	return idx;
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