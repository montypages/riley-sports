<script>
	let {
		homeTeam, // { id, abbreviation, color }  — color as hex without '#', e.g. "e31837"
		awayTeam, // { id, abbreviation, color }
		play      // { down, distance, yardsToEndzone, downDistanceText, team: { id } }
	} = $props();

	const offense = $derived(play.team.id === homeTeam.id ? homeTeam : awayTeam);
	const defense = $derived(play.team.id === homeTeam.id ? awayTeam : homeTeam);

	// 0 = offense's own goal line, 100 = opponent's goal line
	const ballPosition = $derived(100 - play.yardsToEndzone);
	const firstDownPosition = $derived(Math.min(ballPosition + play.distance, 100));

	// Yard numbers mirror at midfield, same as the paint on a real field
	const yardMarks = [10, 20, 30, 40, 50, 40, 30, 20, 10];
</script>

<div class="tracker">
	<p class="down-distance">
		<span class="poss-dot" style="background:#{offense.color}"></span>
		{play.downDistanceText}
	</p>

	<div class="field">
		<div class="endzone" style="background:#{offense.color}2a; border-color:#{offense.color}">
			{offense.abbreviation}
		</div>

		<div class="playfield">
			{#each yardMarks as mark, i (i)}
				<span class="yard-mark" style="left:{(i + 1) * 10}%">{mark}</span>
			{/each}
			<div class="first-down-line" style="left:{firstDownPosition}%"></div>
			<div class="line-of-scrimmage" style="left:{ballPosition}%"></div>
			<div class="ball" style="left:{ballPosition}%; background:#{offense.color}"></div>
		</div>

		<div class="endzone" style="background:#{defense.color}2a; border-color:#{defense.color}">
			{defense.abbreviation}
		</div>
	</div>
</div>

<style>
	.tracker {
		width: min(98%, 800px);
		margin: 0.5em auto;
	}

	.down-distance {
		display: flex;
		align-items: center;
		gap: 0.5em;
		font-size: 0.9rem;
		color: #ccc;
		margin: 0 0 0.4em;
	}

	.poss-dot {
		width: 0.6em;
		height: 0.6em;
		border-radius: 50%;
		flex-shrink: 0;
	}

	.field {
		display: flex;
		height: 5em;
		border-radius: 0.5em;
		overflow: hidden;
		border: 1px solid #444;
	}

	.endzone {
		width: 8%;
		flex-shrink: 0;
		display: flex;
		align-items: center;
		justify-content: center;
		font-size: 0.7rem;
		font-weight: bold;
		border: 3px solid;
		letter-spacing: 0.02em;
	}

	.playfield {
		position: relative;
		flex: 1;
		background: #1b3a1b;
		background-image: repeating-linear-gradient(
			90deg,
			rgba(255, 255, 255, 0.06) 0,
			rgba(255, 255, 255, 0.06) 1px,
			transparent 1px,
			transparent 10%
		);
	}

	.yard-mark {
		position: absolute;
		top: 0.3em;
		transform: translateX(-50%);
		font-size: 0.65rem;
		color: rgba(255, 255, 255, 0.5);
	}

	.first-down-line {
		position: absolute;
		top: 0;
		bottom: 0;
		width: 2px;
		background: #f4d03f;
		transform: translateX(-50%);
	}

	.line-of-scrimmage {
		position: absolute;
		top: 0;
		bottom: 0;
		width: 2px;
		background: #222;
		transform: translateX(-50%);
	}

	.ball {
		position: absolute;
		top: 50%;
		width: 0.9em;
		height: 0.5em;
		border-radius: 50%;
		transform: translate(-100%, -50%);
		box-shadow: 0 0 0 2px #111, 0 0 6px rgba(0, 0, 0, 0.6);
		transition: left 0.4s ease;
	}
</style>