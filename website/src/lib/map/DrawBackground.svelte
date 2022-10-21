<script lang="ts">
	import { onMount, onDestroy } from 'svelte';
	import {
		resize,
		scale,
		offset,
		clicked,
		settings,
		selection,
		attachEvents,
		detachEvents
	} from '../stores/world-state';
	import type { Session } from '../domain/session';
	import type { ProvinceArea, Domain } from '../domain/domain';

	import { createProvince } from '../domain/build';

	export let session: Session;
	let canvas: HTMLCanvasElement;
	let ctx: CanvasRenderingContext2D;

	onMount(() => {
		attachEvents(canvas);
		ctx = canvas.getContext('2d')!;

		resize.subscribe((resize) => {
			drawBackground();
		});

		scale.subscribe((scaleNumber) => {
			drawBackground();
		});

		offset.subscribe((offsetPoint) => {
			drawBackground();
		});

		clicked.subscribe((point) => {
			if (point.x === 0 && point.y === 0) {
				return;
			}
			pointClicked(point);
		});

		selection.subscribe((sel) => {
			drawBackground();
		});

		settings.subscribe((set) => {
			drawBackground();
		});
	});

	onDestroy(() => {
		detachEvents(canvas);
	});

	const shadowBlur = (): number => {
		return $settings.shadowBlur ? $scale : 0;
	};

	const drawBackground = () => {
		canvas.height = $resize.height;
		canvas.width = window.innerWidth;

		ctx.clearRect(0, 0, canvas.width, canvas.height);
		ctx.save();
		ctx.translate($offset.x, $offset.y);
		ctx.scale($scale, $scale);

		ctx.lineCap = 'round';

		drawIslands(ctx);
		drawWoods(ctx);
		drawMountains(ctx);

		if ($settings.showRealms) {
			drawRealmBorders(ctx);
		}

		if ($settings.showProvinces) {
			drawProvinceBorders(ctx);
		}

		drawProvinceCenter(ctx);
		drawSelection(ctx);

		ctx.restore();
	};

	const drawProvinceCenter = (ctx: CanvasRenderingContext2D) => {
		session.provinceAreas.forEach((area: ProvinceArea) => {
			// if (area.province && area.province.name === "Tenarien") {
			//   const center = area.labelPoint;
			//   const bounds = area.polygon.bounds;
			//   ctx.beginPath();
			//   ctx.arc(center.x, center.y, 15, 15, 0, 2 * Math.PI, false);
			//   ctx.rect(bounds.x, bounds.y, bounds.width, bounds.height);
			//   ctx.stroke();
			// }
		});
	};

	const drawIslands = (ctx: CanvasRenderingContext2D) => {
		ctx.shadowColor = 'rgba(255 , 255, 255 , 0.4)';
		ctx.shadowBlur = 50 * shadowBlur();
		ctx.fillStyle = '#EEE8AA';
		ctx.fill(session.islandsPath);
		ctx.stroke(session.islandsPath);
		ctx.shadowBlur = 0;
	};

	const drawWoods = (ctx: CanvasRenderingContext2D) => {
		ctx.globalAlpha = 0.8;
		ctx.shadowColor = 'darkgreen';
		ctx.shadowBlur = 50 * shadowBlur();
		ctx.clip(session.islandsPath);
		ctx.fillStyle = '#228B22';
		ctx.strokeStyle = 'darkgreen';
		ctx.lineWidth = 2;
		ctx.fill(session.woodsPath);
		ctx.stroke(session.woodsPath);
		ctx.globalAlpha = 1;
		ctx.shadowBlur = 0;
	};

	const drawMountains = (ctx: CanvasRenderingContext2D) => {
		ctx.globalAlpha = 0.3;
		ctx.shadowColor = '#654321';
		ctx.shadowBlur = 50 * shadowBlur();
		ctx.fillStyle = '#796342';

		ctx.strokeStyle = '#796342';
		ctx.lineWidth = 2;
		ctx.fill(session.mountainsPath);
		ctx.globalAlpha = 1;
		ctx.shadowBlur = 0;
	};

	const drawRealmBorders = (ctx: CanvasRenderingContext2D) => {
		ctx.strokeStyle = '#654321';
		ctx.fillStyle = 'black';
		ctx.lineWidth = 2;

		session.domains.forEach((domain: Domain) => {
			if (domain.realmArea) {
				//  ctx.fill(domain.realmArea.path);
				ctx.stroke(domain.realmArea.path);
			}
		});

		//ctx.stroke(session.realmBordersPath);
		ctx.lineWidth = 4;
		ctx.stroke(session.islandsPath);
		// ctx.shadowBlur = 0;
	};

	const drawProvinceBorders = (ctx: CanvasRenderingContext2D) => {
		ctx.lineWidth = 1;
		ctx.strokeStyle = '#654321';
		ctx.setLineDash([10, 6]);
		ctx.lineWidth = 1;
		ctx.stroke(session.provinceBordersPath);
		ctx.setLineDash([0, 0]);
		ctx.shadowBlur = 0;
	};

	const drawSelection = (ctx: CanvasRenderingContext2D) => {
		if (!$selection) {
			return;
		}

		ctx.setLineDash([0, 0]);
		ctx.shadowBlur = 0;
		ctx.lineWidth = 5;
		ctx.fillStyle = 'rgba(220, 20, 60 , 0.6)';
		ctx.strokeStyle = 'rgba(220, 20, 60 , 0.8)';

		// ctx.fill($selection.path);
		// ctx.stroke($selection.path);

		$selection.areas().forEach((area: ProvinceArea) => {
			ctx.fill(area.path!);
			ctx.stroke(area.path!);
		});
	};

	const pointClicked = (point: { x: number; y: number }) => {
		let selectedArea: ProvinceArea | null = null;

		ctx.save();
		ctx.translate($offset.x, $offset.y);
		ctx.scale($scale, $scale);

		session.provinceAreas.forEach((area: ProvinceArea) => {
			if (ctx.isPointInPath(area.path!, point.x, point.y)) {
				selectedArea = $selection === area.province ? null : area;
			}
		});
		ctx.restore();

		if (selectedArea) {
			selection.set(selectedArea.province);
		} else {
			console.log('nothing selected', point);

			selection.set(createProvince(point, session));
		}
	};
</script>

<canvas bind:this={canvas} />

<style>
	canvas {
		background-color: #006994;
		position: absolute;
		top: 0px;
		left: 0px;
	}
</style>
