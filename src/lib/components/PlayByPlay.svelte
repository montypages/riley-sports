<script>
	let {
		drives,   // chronological array (oldest first) of raw ESPN drive objects, each with .plays[]
		homeTeam, // { id, abbreviation, color }
		awayTeam  // { id, abbreviation, color }
	} = $props();

	const recentDrivesFirst = $derived([...drives].reverse());
	const mostRecentPlay = $derived(drives.at(-1)?.plays?.at(-1) ?? null);

	function teamFor(id) {
		return id === homeTeam.id ? homeTeam : id === awayTeam.id ? awayTeam : null;
	}
</script>

{#snippet playRow(play)}
	{@const team = teamFor(play.start?.team?.id)}
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
{/snippet}

<div class="play-by-play">
	{#if mostRecentPlay}
		<div class="featured">
			<p class="featured-label">Most Recent Play</p>
			<ul class="bare-list">
				{@render playRow(mostRecentPlay)}
			</ul>
		</div>
	{/if}

	<div class="drives">
		{#each recentDrivesFirst as drive (drive.id)}
			{@const team = teamFor(drive.team?.id)}
			<details class="drive">
				<summary>
					{#if team}
						<span class="poss-dot" style="background:#{team.color}"></span>
						<span class="team-abbr">{team.abbreviation}</span>
					{/if}
					<span class="drive-desc">{drive.description}</span>
					<span class="spacer"></span>
					{#if drive.result}
						<span class="result" class:scoring={drive.isScore}>{drive.shortDisplayResult ?? drive.result}</span>
					{/if}
				</summary>
				<ul class="play-list">
					{#each drive.plays ?? [] as play (play.id)}
						{@render playRow(play)}
					{/each}
				</ul>
			</details>
		{/each}
	</div>
</div>

<style>
	.play-by-play {
		width: min(98%, 800px);
		margin-inline: auto;
	}

	.bare-list,
	.play-list {
		list-style: none;
		margin: 0;
		padding: 0;
		display: flex;
		flex-direction: column;
		gap: 0.6em;
	}

	.featured-label {
		margin: 0 0 0.4em;
		font-size: 0.8rem;
		color: #888;
	}

	.featured {
		margin-bottom: 1.5em;
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

	.drives {
		display: flex;
		flex-direction: column;
		gap: 0.5em;
	}

	.drive {
		background-color: #1a1a1a;
		border: 1px solid #444;
		border-radius: 0.75em;
		overflow: hidden;
	}

	.drive summary {
		display: flex;
		align-items: center;
		gap: 0.5em;
		padding: 0.75em 1em;
		cursor: pointer;
		list-style: none;
	}

	.drive summary::-webkit-details-marker {
		display: none;
	}

	.drive-desc {
		color: #ccc;
		font-size: 0.9rem;
	}

	.result {
		font-size: 0.75rem;
		font-weight: bold;
		color: #aaa;
		border: 1px solid #444;
		border-radius: 1em;
		padding: 0.15em 0.7em;
	}

	.result.scoring {
		color: var(--clr-accent, red);
		border-color: var(--clr-accent, red);
	}

	.drive .play-list {
		padding: 0 1em 1em;
	}
</style>