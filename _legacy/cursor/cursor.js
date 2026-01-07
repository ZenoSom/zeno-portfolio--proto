import TubesCursor from "https://cdn.jsdelivr.net/npm/threejs-components@0.0.30/build/cursors/tubes1.min.js";

document.addEventListener("DOMContentLoaded", () => {
  const canvas = document.getElementById("cursor-canvas");

  if (!canvas) {
    console.error("❌ Cursor canvas not found");
    return;
  }

  // Ensure full screen size
  function resize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }
  resize();
  window.addEventListener("resize", resize);

  // Init cursor
  const app = TubesCursor(canvas, {
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

  // Start the animation if needed
  if (app && app.start) {
    app.start();
  }

  // Track mouse position
  document.addEventListener("mousemove", (e) => {
    if (app && app.tubes && app.tubes.setPosition) {
      app.tubes.setPosition(e.clientX, e.clientY);
    }
  });

  // Optional color change on click
  document.addEventListener("click", () => {
    app.tubes.setColors(randomColors(3));
    app.tubes.setLightsColors(randomColors(4));
  });
});

function randomColors(count) {
  return Array.from({ length: count }, () =>
    "#" +
    Math.floor(Math.random() * 16777215)
      .toString(16)
      .padStart(6, "0")
  );
}
