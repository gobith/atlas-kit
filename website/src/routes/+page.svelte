<script lang="ts">
	import session from '$lib/stores/session-store';
	import Map from '$lib/map/Map.svelte';
	import Navigation from '$lib/navigation/Navigation.svelte';
	import DrawMap from '$lib/map/DrawMap.svelte';

	const draw = false;
</script>

{#if $session}
	{#if draw}
		<DrawMap session={$session} />
    <Navigation />
	{:else}
		<Map session={$session} />
		<Navigation />
		<!-- <Searchlist world={$world}/> -->
	{/if}
{/if}

<style>
	:global(body) {
		overflow: hidden;
		margin: 0;
		padding: 0;
		box-sizing: border-box;
		background-color: #006994;
		position: relative;
		font-family: 'calibri';
	}
</style>
