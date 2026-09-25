import { error } from '@sveltejs/kit';
import sampleGame from '$lib/sampleGame.json';

const USE_SAMPLE_DATA = false;

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
	const [boxRes, lineRes, scheduleRes, playRes] = await Promise.all([
		fetch(`https://statsapi.mlb.com/api/v1/game/${gamePk}/boxscore`),
		fetch(`https://statsapi.mlb.com/api/v1/game/${gamePk}/linescore`),
		fetch(`https://statsapi.mlb.com/api/v1/schedule?gamePk=${gamePk}`),
		fetch(`https://statsapi.mlb.com/api/v1/game/${gamePk}/playByPlay`)
	]);
	const box = await boxRes.json();
	const line = await lineRes.json();
	const schedule = await scheduleRes.json();
	const playByPlay = await playRes.json();

	const away = box.teams.away,
		home = box.teams.home;
	const inning = `${line.inningState} ${line.currentInningOrdinal}`;
	const inningState = line.inningState;
	const offense = line.offense;
	const game = schedule.dates?.[0]?.games?.[0];
	const status = game?.status?.abstractGameState;
	const currentPlay = playByPlay.currentPlay;
	const isTopInning = line.isTopInning; // top = away batting, home pitching

	const battingTeam = isTopInning ? box.teams.away : box.teams.home;
	const pitchingTeam = isTopInning ? box.teams.home : box.teams.away;

	const batterId = currentPlay?.matchup?.batter?.id;
	const pitcherId = currentPlay?.matchup?.pitcher?.id;

	const batterData = battingTeam.players[`ID${batterId}`];
	const pitcherData = pitchingTeam.players[`ID${pitcherId}`];

	const atBat = {
		batter: {
			name: currentPlay?.matchup?.batter?.fullName,
			side: currentPlay?.matchup?.batSide?.code,
			gameHits: batterData?.stats?.batting?.hits ?? 0,
			gameAtBats: batterData?.stats?.batting?.atBats ?? 0,
			seasonAvg: batterData?.seasonStats?.batting?.avg
		},
		pitcher: {
			name: currentPlay?.matchup?.pitcher?.fullName,
			hand: currentPlay?.matchup?.pitchHand?.code,
			inningsPitched: pitcherData?.stats?.pitching?.inningsPitched,
			pitchCount: pitcherData?.stats?.pitching?.numberOfPitches,
			earnedRuns: pitcherData?.stats?.pitching?.earnedRuns,
			strikeOuts: pitcherData?.stats?.pitching?.strikeOuts,
			seasonEra: pitcherData?.seasonStats?.pitching?.era
		}
	};

	return {
		league: 'mlb',
		status: status,
		away: {
			name: away.team.name,
			abbreviation: away.team.abbreviation,
			score: line.teams?.away?.runs ?? 0
		},
		home: {
			name: home.team.name,
			abbreviation: home.team.abbreviation,
			score: line.teams?.home?.runs ?? 0
		},
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
		inningState: inningState,
		offense: {
			outs: line.outs,
			first: offense.first,
			second: offense.second,
			third: offense.third,
			balls: line.balls,
			strikes: line.strikes
		},
		playEvents: currentPlay?.playEvents ?? [],
		atBatIndex: currentPlay?.about?.atBatIndex,
		atBat: atBat
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
	const data = USE_SAMPLE_DATA ? sampleGame : await res.json();
	const competitors = data.header.competitions[0].competitors;
	const away = competitors.find((c) => c.homeAway === 'away');
	const home = competitors.find((c) => c.homeAway === 'home');
	const leaders = data.leaders;
	const homeLeaders = leaders[0].leaders;
	const awayLeaders = leaders[1].leaders;
	const compStatus = data.header.competitions[0].status;
	const status = compStatus?.type?.state === 'in' ? 'Live' : compStatus?.type?.description;
	const currentDrivePlays = data.drives?.current?.plays ?? [];
	const lastPreviousDrivePlays = data.drives?.previous?.at(-1)?.plays ?? [];
	const lastPlay = currentDrivePlays.at(-1) ?? lastPreviousDrivePlays.at(-1) ?? null;
	const currentPlay = lastPlay?.start ?? null;

	const periods = (away.linescores ?? []).map((ls, i) => ({
		label: `Q${i + 1}`,
		away: ls.displayValue,
		home: home.linescores?.[i]?.displayValue ?? '-'
	}));

	function getNflDrives(drives) {
		const previous = drives?.previous ?? [];
		const current = drives?.current;
		const all = current?.plays?.length ? [...previous, current] : previous;

		const seen = new Set();
		return all.filter((drive) => {
			if (seen.has(drive.id)) return false;
			seen.add(drive.id);
			return true;
		});
	}

	const TEAM_STAT_ROWS = [
		{ key: 'firstDowns', label: 'First Downs' },
		{ key: 'thirdDownEff', label: '3rd Down Efficiency' },
		{ key: 'fourthDownEff', label: '4th Down Efficiency' },
		{ key: 'totalYards', label: 'Total Yards' },
		{ key: 'netPassingYards', label: 'Passing Yards' },
		{ key: 'rushingYards', label: 'Rushing Yards' },
		{ key: 'totalOffensivePlays', label: 'Total Plays' }, // real key is totalOffensivePlays, not totalPlays
		{ key: 'turnovers', label: 'Turnovers' },
		{ key: 'totalPenaltiesYards', label: 'Penalties' },
		{ key: 'possessionTime', label: 'Time of Possession' }
	];

	function buildTeamStatsComparison(boxscoreTeams, awayId, homeId) {
		const byName = (teamId) =>
			Object.fromEntries(
				(boxscoreTeams?.find((t) => t.team.id === teamId)?.statistics ?? []).map((s) => [s.name, s.displayValue])
			);
		const awayStats = byName(awayId);
		const homeStats = byName(homeId);

		return TEAM_STAT_ROWS.map((row) => ({
			label: row.label,
			away: awayStats[row.key] ?? '-',
			home: homeStats[row.key] ?? '-'
		}));
	}

	return {
		league: 'nfl',
		away: {
			id: away.team.id,
			name: away.team.displayName,
			abbreviation: away.team.abbreviation,
			color: away.team.color,
			score: away.score
		},
		home: {
			id: home.team.id,
			name: home.team.displayName,
			abbreviation: home.team.abbreviation,
			color: home.team.color,
			score: home.score
		},
		periods,
		players: {
			away: extractNflPlayerStats(data.boxscore?.players, away.team.id),
			home: extractNflPlayerStats(data.boxscore?.players, home.team.id)
		},
		status: status,
		compStatus: compStatus,
		homeLeaders: homeLeaders,
		awayLeaders: awayLeaders,
		currentPlay: currentPlay,
		drives: getNflDrives(data.drives),
		teamStats: buildTeamStatsComparison(data.boxscore?.teams, away.team.id, home.team.id)
	};
}

function formatPlayerName(fullName) {
	const parts = fullName.trim().split(' ');
	if (parts.length < 2) return fullName;
	return `${parts[0][0]}. ${parts.slice(1).join(' ')}`;
}

function extractNflPlayerStats(boxscorePlayers, teamId) {
	const teamEntry = boxscorePlayers?.find((t) => t.team.id === teamId);
	if (!teamEntry) return [];
	return (teamEntry.statistics ?? []).map((category) => ({
		name: category.name, // "passing", "rushing", etc.
		label: category.text ?? category.name,
		labels: category.labels ?? [],
		athletes: (category.athletes ?? []).map((a) => ({
			name: formatPlayerName(a.athlete.displayName),
			stats: a.stats ?? []
		}))
	}));
}
