import { error } from '@sveltejs/kit';

export async function load({ params, url, fetch, depends }) {
	const league = url.searchParams.get('league');

	if (league === 'mlb') {
		depends(`game:${params.id}`);
		return loadMlbGameDetail(fetch, params.id);
	}
	if (league === 'nfl') {
		depends(`game:${params.id}`);
		return loadNflGameDetail(fetch, params.id);
	}

	throw error(400, 'Missing or invalid league');
}

async function loadMlbGameDetail(fetch, gamePk) {
	const [boxRes, lineRes, scheduleRes] = await Promise.all([
		fetch(`https://statsapi.mlb.com/api/v1/game/${gamePk}/boxscore`),
		fetch(`https://statsapi.mlb.com/api/v1/game/${gamePk}/linescore`),
		fetch(`https://statsapi.mlb.com/api/v1/schedule?gamePk=${gamePk}`)
	]);
	const box = await boxRes.json();
	const line = await lineRes.json();
	const schedule = await scheduleRes.json();

	const away = box.teams.away, home = box.teams.home;
	const inning = `${line.inningState} ${line.currentInningOrdinal}`;
	const offense = line.offense;
	const game = schedule.dates?.[0]?.games?.[0];
	const status = game?.status?.abstractGameState; 

	return {
		league: 'mlb',
		status: status,
		away: { name: away.team.name, abbreviation: away.team.abbreviation, score: line.teams?.away?.runs ?? 0 },
		home: { name: home.team.name, abbreviation: home.team.abbreviation, score: line.teams?.home?.runs ?? 0 },
		periods: line.innings.map((inn) => ({
			label: inn.ordinalNum,
			away: inn.away?.runs ?? '-',
			home: inn.home?.runs ?? '-'
		})),
		players: {
			away: extractMlbPlayers(away),
			home: extractMlbPlayers(home)
		},
		inning: inning,
		offense: {
			outs: line.outs,
			first: offense.first,
			second: offense.second,
			third: offense.third
		}
	};
}

function extractMlbPlayers(team) {
	const players = team.players;

	const lineup = (team.battingOrder ?? [])
		.map((id) => players[`ID${id}`])
		.filter(Boolean)
		.map((p) => ({
			name: p.person.fullName,
			role: p.position?.abbreviation ?? '',
			summary: p.stats.batting?.summary || ''
		}));

	const pitchers = (team.pitchers ?? [])
		.map((id) => players[`ID${id}`])
		.filter(Boolean)
		.map((p) => ({
			name: p.person.fullName,
			role: p.position?.abbreviation ?? 'P',
			summary: p.stats.pitching?.summary || ''
		}));

	return { lineup, pitchers };
}

async function loadNflGameDetail(fetch, eventId) {
	const res = await fetch(
		`https://site.api.espn.com/apis/site/v2/sports/football/nfl/summary?event=${eventId}`
	);
	const data = await res.json();
	const competitors = data.header.competitions[0].competitors;
	const away = competitors.find((c) => c.homeAway === 'away');
	const home = competitors.find((c) => c.homeAway === 'home');

	const periods = (away.linescores ?? []).map((ls, i) => ({
		label: `Q${i + 1}`,
		away: ls.displayValue,
		home: home.linescores?.[i]?.displayValue ?? '-'
	}));

	return {
		league: 'nfl',
		away: { name: away.team.displayName, score: away.score },
		home: { name: home.team.displayName, score: home.score },
		periods,
		players: {
			away: extractNflPlayers(data.boxscore?.players, away.team.id),
			home: extractNflPlayers(data.boxscore?.players, home.team.id)
		}
	};
}

function extractNflPlayers(boxscorePlayers, teamId) {
	const teamEntry = boxscorePlayers?.find((t) => t.team.id === teamId);
	if (!teamEntry) return [];
	const rows = [];
	for (const category of teamEntry.statistics ?? []) {
		for (const athlete of category.athletes ?? []) {
			rows.push({
				name: athlete.athlete.displayName,
				role: category.name, // "passing", "rushing", etc.
				summary: athlete.stats?.join(', ') ?? ''
			});
		}
	}
	return rows;
}