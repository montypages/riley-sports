<script>
	let { game } = $props();
</script>

<li class="game" class:live={game.isLive}>
	<a class="game-link" href={`/games/${game.id}?league=${game.league}`}>
		<div class="teams">
			<div class="away">
				<p class="team">{game.away.name} <span>({game.away.record})</span></p>
				<p class="score">{game.away.score ?? '–'}</p>
			</div>
			<div class="home">
				<p class="team">{game.home.name} <span>({game.home.record})</span></p>
				<p class="score">{game.home.score ?? '–'}</p>
			</div>
		</div>
		<div class="details">
			{#if game.isLive}<span class="live-dot"></span>{/if}
			{#each game.periodLines as line (line)}
				<p class="det">{line}</p>
			{/each}
		</div>
	</a>
</li>

<style>
	a {
		color: inherit;
		text-decoration: none;
	}

	li {
		width: min(98%, 800px);
		margin: 0.5em auto;
		padding: 0 1em;
		background-color: #222;
		border-radius: 1em;
		border: 1px solid #444;
	}

	.game-link {
		display: flex;
		justify-content: space-between;
	}

	.details {
		border-left: 1px solid #444;
		padding: 0 1em;
		position: relative;
	}

	.teams {
		display: flex;
		flex-direction: column;
		width: 100%;
	}

	.home,
	.away {
		display: flex;
		justify-content: space-between;
	}

	.score {
		margin-left: auto;
		padding: 0 1em;
	}

	li.live {
		border-color: var(--clr-accent, red);
	}

	.live-dot {
		display: inline-block;
		position: absolute;
		right: 0;
		top: 50%;
		width: 0.5em;
		height: 0.5em;
		border-radius: 50%;
		background: var(--clr-accent, red);
		transform: translate(100%, -50%);
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
