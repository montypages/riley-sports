<script>
    const offense = {
        balls: 0,
        strikes: 3,
        outs: 0
    }
</script>




<div class="count-container">
    <div class="balls">
        <p>B</p>
        <div class:is-ball={offense.balls > 0 && offense.balls !== 4} class="ball"></div>
        <div class:is-ball={offense.balls > 1 && offense.balls !== 4} class="ball"></div>
        <div class:is-ball={offense.balls > 2 && offense.balls !== 4} class="ball"></div>
    </div>
    <div class="strikes">
        <p>S</p>
        <div class:is-strike={offense.strikes > 0 && offense.strikes !== 3} class="strike"></div>
        <div class:is-strike={offense.strikes === 2} class="strike"></div>
    </div>
    <div class="outs">
        <p>O</p>
        <div class:is-out={offense.outs > 0 && offense.outs !== 3} class="out"></div>
        <div class:is-out={offense.outs === 2} class="out"></div>
    </div>
</div>

<style>
    .ball, .strike, .out {
        aspect-ratio: 1;
        width: 10px;
        background-color: var(--clr-light, white);
        opacity: 0.3;
        border-radius: 100vw;
    }

    .balls, .strikes, .outs {
        display: flex;
        align-items: center;
        gap: 2px;
    }

    .count-container {
        display: flex;
        justify-content: center;
        gap: 1rem;
    }

    .is-out, .is-strike, .is-ball {
        background-color: var(--clr-accent, green);
        opacity: 1;
    }
</style>