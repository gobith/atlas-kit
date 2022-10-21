<script lang="ts">
	import { resetResize, attachResizeEvent, detachResizeEvent } from '../stores/world-state';
	import type { Session } from '../domain/session';

	import { onMount, onDestroy } from 'svelte';

	import DrawBackground from './DrawBackground.svelte';
  import Province from './Province.svelte';
  import Descriptions from './Descriptions.svelte';

	export let session: Session;

	onMount(() => {
		attachResizeEvent();
		resetResize();
	});

	onDestroy(() => {
		detachResizeEvent();
	});
</script>

<DrawBackground {session} />
<Province/>
<Descriptions {session} />

<style>
</style>
