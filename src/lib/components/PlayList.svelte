<script>
	let {
		plays,    // chronological array (oldest first) of raw ESPN play objects
		homeTeam, // { id, abbreviation, color }
		awayTeam  // { id, abbreviation, color }
	} = $props();

	const recentFirst = $derived([...plays].reverse());

	function possessionTeam(play) {
		const teamId = play.start?.team?.id;
		return teamId === homeTeam.id ? homeTeam : teamId === awayTeam.id ? awayTeam : null;
	}
</script>

<ul class="play-list">
	{#each recentFirst as play (play.id)}
		{@const team = possessionTeam(play)}
		<li class="play" class:scoring={play.scoringPlay}>
			<div class="play-meta">
				{#if team}
					<span class="poss-dot" style="background:#{team.color}"></span>
					<span class="team-abbr">{team.abbreviation}</span>
				{/if}
				<span class="type">{play.type?.text}</span>
				<span class="spacer"></span>
				<span class="clock">Q{play.period?.number} · {play.clock?.displayValue}</span>
			</div>

			{#if play.start?.downDistanceText}
				<p class="down-distance">{play.start.downDistanceText}</p>
			{/if}

			<p class="desc">{play.text}</p>

			<p class="score">
				<span class:leading={play.awayScore > play.homeScore}>{awayTeam.abbreviation} {play.awayScore}</span>
				–
				<span class:leading={play.homeScore > play.awayScore}>{homeTeam.abbreviation} {play.homeScore}</span>
			</p>
		</li>
	{/each}
</ul>

<style>
	.play-list {
		list-style: none;
		margin: 0;
		padding: 0;
		width: min(98%, 800px);
		margin-inline: auto;
		display: flex;
		flex-direction: column;
		gap: 0.6em;
	}

	.play {
		background-color: #222;
		border: 1px solid #444;
		border-radius: 0.75em;
		padding: 0.75em 1em;
	}

	.play.scoring {
		border-color: var(--clr-accent, red);
	}

	.play-meta {
		display: flex;
		align-items: center;
		gap: 0.5em;
		font-size: 0.8rem;
		color: #aaa;
		margin-bottom: 0.35em;
	}

	.poss-dot {
		width: 0.6em;
		height: 0.6em;
		border-radius: 50%;
		flex-shrink: 0;
	}

	.team-abbr {
		font-weight: bold;
		color: #ddd;
	}

	.spacer {
		flex: 1;
	}

	.down-distance {
		margin: 0 0 0.25em;
		font-size: 0.85rem;
		color: #ccc;
	}

	.desc {
		margin: 0 0 0.5em;
		line-height: 1.4;
	}

	.score {
		margin: 0;
		font-size: 0.8rem;
		color: #aaa;
		display: flex;
		gap: 0.4em;
	}

	.score .leading {
		color: #fff;
		font-weight: bold;
	}
</style>