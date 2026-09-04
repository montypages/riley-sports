<script>
    let { offense } = $props();
</script>

<div class="base-bug-container">
    <div class="base-container">
        <div class:on-base={offense.second != null} class="base" id="second"></div>
        <div class:on-base={offense.first != null} class="base" id="first"></div>
        <div class:on-base={offense.third != null} class="base" id="third"></div>
    </div>
    <div class="outs">
        <div class:is-out={3 > offense.outs > 0} class="out" id="out1"></div>
        <div class:is-out={offense.outs === 2} class="out" id="out2"></div>
    </div>
</div>

<style>
    .base {
        background-color: var(--clr-light, white);
        aspect-ratio: 1;
        width: 10px;
        opacity: 0.3;
    }

    .on-base {
        background-color: var(--clr-accent, green);
        opacity: 1;
    }

    .base-container {
        display: grid;
        grid-template-columns: 1fr 1fr;
        grid-template-rows: 1fr 1fr;
        width: fit-content;
        gap: 3px;
        rotate: 45deg;
    }

    .base-bug-container {
        display: grid;
        width: fit-content;
        justify-content: center;
    }

    .out {
        aspect-ratio: 1;
        width: 10px;
        background-color: var(--clr-light, white);
        border-radius: 100vw;
        opacity: 0.3;
    }

    .is-out {
        background-color: var(--clr-accent, green);
        opacity: 1;
    }

    .outs {
        display: flex;
        justify-content: space-between;
    }
</style>