<script>
	let { game } = $props();
</script>

<li class="game" class:live={game.isLive}>
	<div class="teams">
		<p class="team">{game.away.name} <span>({game.away.record})</span></p>
		<p class="team">{game.home.name} <span>({game.home.record})</span></p>
	</div>
	<div class="scores">
		<p class="score">{game.away.score ?? '–'}</p>
		<p class="score">{game.home.score ?? '–'}</p>
	</div>
	<div class="details">
		{#if game.isLive}<span class="live-dot"></span>{/if}
		<p class="det">{game.period}</p>
	</div>
</li>

<style>
	li {
		width: min(98%, 800px);
		margin: 0.5em auto;
		padding: 0 1em;
		display: flex;
		justify-content: space-between;
		background-color: #222;
		border-radius: 1em;
		border: 1px solid #444;
	}

	.details {
		border-left: 1px solid #444;
		padding: 0 1em;
	}

	.scores {
		margin-left: auto;
		padding: 0 1em;
	}

	li.live {
		border-color: var(--clr-accent, red);
	}
	.live-dot {
		display: inline-block;
		width: 0.5em;
		height: 0.5em;
		border-radius: 50%;
		background: var(--clr-accent, red);
		margin-right: 0.4em;
		animation: pulse 1.5s ease-in-out infinite;
	}
	@keyframes pulse {
		0%,
		100% {
			opacity: 1;
		}
		50% {
			opacity: 0.3;
		}
	}
</style>
