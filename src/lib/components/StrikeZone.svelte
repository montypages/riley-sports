<script>
	let { playEvents } = $props();

	let displayedPitches = $state([]);

	$effect(() => {
		const filtered = playEvents?.filter((e) => e.isPitch) ?? [];
		if (filtered.length > 0) {
			displayedPitches = filtered;
		}
		// if empty, do nothing — keep showing whatever was there before
	});

	const HALF_WIDTH = 0.708;
</script>

<div class="strike-zone-container">
    <svg viewBox="-2 -5 4 5" class="strike-zone" >
	<g transform="scale(1, -1)">
		{#each displayedPitches as pitch}
			{@const { strikeZoneTop, strikeZoneBottom } = pitch.pitchData}
			<rect
				x={-HALF_WIDTH}
				y={strikeZoneBottom}
				width={HALF_WIDTH * 2}
				height={strikeZoneTop - strikeZoneBottom}
				fill="#333"
				stroke="var(--clr-accent)"
                stroke-width="0.03"
			/>
		{/each}

		{#each displayedPitches as pitch}
			{@const { pX, pZ } = pitch.pitchData.coordinates}
			<circle cx={pX} cy={pZ} r={0.12} fill={pitch.details.ballColor} />
		{/each}
	</g>
</svg>
</div>

<style>
    .strike-zone-container {
        width: min(95%, 12rem);
        margin: 0 auto;
        background-color: #222;
    }
</style>
