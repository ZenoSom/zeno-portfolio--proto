import { useEffect, useRef } from 'react';
// We need to import the tubes script. Since it's a module, we can try to import it dynamically or assume it works if we fix the import.
// However, the downloaded file is a minified JS that might not export default easily if it was designed for CDN.
// Let's use a workaround: we copied it to src/lib/tubes.js. We will import it.
// If it fails, we might need to load it via script tag or adjust the file.
// Checking the original file content: `import TubesCursor from ...`.
// The user code imported it from CDN. We downloaded it to src/lib/tubes.js.
// We will try importing it directly.
import TubesCursor from '../lib/tubes.js';

export default function Cursor() {
    const canvasRef = useRef(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        function resize() {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        }
        resize();
        window.addEventListener("resize", resize);

        let app;
        try {
            app = TubesCursor(canvas, {
                transparent: true,
                alpha: true,
                tubes: {
                    colors: ["#ff78f7", "#78c6ff", "#00ff9c"],
                    lights: {
                        intensity: 160,
                        colors: ["#ff78f7", "#78c6ff", "#ffffff"]
                    }
                }
            });
            // The library handles the animation loop automatically.
        } catch (e) {
            console.error("Cursor init failed", e);
        }

        const onClick = () => {
            if (app && app.tubes) {
                app.tubes.setColors(randomColors(3));
                app.tubes.setLightsColors(randomColors(4));
            }
        };
        document.addEventListener("click", onClick);

        return () => {
            window.removeEventListener("resize", resize);
            document.removeEventListener("click", onClick);
            if (app && typeof app.dispose === 'function') {
                app.dispose();
            }
        };
    }, []);

    return (
        <div id="webgl-cursor">
            <canvas ref={canvasRef} id="cursor-canvas"></canvas>
        </div>
    );
}

function randomColors(count) {
    return Array.from({ length: count }, () =>
        "#" +
        Math.floor(Math.random() * 16777215)
            .toString(16)
            .padStart(6, "0")
    );
}
