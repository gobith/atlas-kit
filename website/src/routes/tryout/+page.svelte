<script lang="ts">
	import { onMount } from 'svelte';
	import { catmullRom2bezier } from '$lib/utils/catmull-rom';

	let canvas: HTMLCanvasElement;

	const points: number[] = [];

	onMount(() => {
		const ctx = canvas.getContext('2d')!;
		canvas.height = window.innerHeight;
		canvas.width = window.innerWidth;
		ctx.restore();
		ctx.strokeStyle = 'black';
		ctx.lineWidth = 1;
		ctx.globalAlpha = 1;

		//const rp =  randomPolyline(100, 100, 400, 400 , 20);
        // const rp = randomLine([100 , 100 , 100 , 300 , 200 , 200])

        // rp.forEach((p) => {
        //     points.push(p);
        // });

        [100, 100, 1000, 1000].forEach((p) => {
            points.push(p);
        });

        canvas.onpointerup = (e) => {
            points.push(e.offsetX, e.offsetY);
            draw();
        }

        draw();
	});

	const draw = () => {
		canvas.height = window.innerHeight;
		canvas.width = window.innerWidth;
		const ctx = canvas.getContext('2d')!;

		ctx.clearRect(0, 0, canvas.width, canvas.height);

        const randomPoints = randomLine(points);
        console.log("random points: " ,  randomPoints);
		ctx.stroke(new Path2D(catmullRom2bezier(randomPoints)));
       
       // draw circle for each point
        ctx.fillStyle = 'red';
        console.log("points" , points);
        points.forEach((p, i) => {
            
                ctx.beginPath();
                ctx.arc(p, points[i + 1], 5, 0, 2 * Math.PI);
                ctx.fill();
            
        });
	};

   // distance between 2 points
    const distance = (x1: number, y1: number, x2: number, y2: number) => {
          return Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
     }

    // 20 Random points polyline Random on a line
    const randomPolyline = (x1: number, y1: number, x2: number, y2: number, n: number) => {
        console.log(distance(x1, y1, x2, y2) / 20);
        const points = [];
        const dx = x2 - x1;
        const dy = y2 - y1;
        const delta = 20;
        for (let i = 0; i < n; i++) {

            const x = x1 + dx * i / n + Math.random() * delta;
            const y = y1 + dy * i / n + Math.random() * delta

            points.push( x , y );
        }
        return points;
    }

     const randomLine = (points: number[]) => {

        const newPoints: number[] = [];
        for (let i = 0; i < points.length - 2; i += 2) {
            const x1 = points[i];
            const y1 = points[i + 1];
            const x2 = points[i + 2];
            const y2 = points[i + 3];
            const d = distance(x1, y1, x2, y2);
            const n = Math.floor(d / 30);
            const p = randomPolyline(x1, y1, x2, y2, n);
            p.forEach((p) => {
                newPoints.push(p);
            });
        }
        return newPoints;


     }






</script>

<canvas bind:this={canvas} />

<style>
	canvas {
		background-color: #006994;
		position: absolute;
		top: 0px;
		left: 0px;
		/* height: 100%;
		width: 100%; */
	}
</style>
