document.addEventListener("DOMContentLoaded", function () {
  const canvas = document.getElementById("canvas");
  const ctx = canvas.getContext("2d");
  const resetBtn = document.getElementById("resetBtn");

  let circles = [];
  let isDrawing = false;

  function drawCircle(x, y, radius, color) {
    ctx.beginPath();
    ctx.arc(x, y, radius, 0, 2 * Math.PI);
    ctx.fillStyle = color;
    ctx.fill();
    ctx.closePath();
  }

  function hitTest(x, y, circle) {
    const dx = x - circle.x;
    const dy = y - circle.y;
    const distance = Math.sqrt(dx * dx + dy * dy);

    return distance <= circle.radius;
  }

  function updateHitStatus(event) {
    const x = event.clientX - canvas.getBoundingClientRect().left;
    const y = event.clientY - canvas.getBoundingClientRect().top;

    let hit = false;
    for (let i = circles.length - 1; i >= 0; i--) {
      if (hitTest(x, y, circles[i])) {
        hit = true;
        break;
      }
    }

    console.log(hit ? "Hit" : "Miss");
  }

  function deleteCircle(event) {
    const x = event.clientX - canvas.getBoundingClientRect().left;
    const y = event.clientY - canvas.getBoundingClientRect().top;

    for (let i = circles.length - 1; i >= 0; i--) {
      if (hitTest(x, y, circles[i])) {
        circles.splice(i, 1);
        redrawCanvas();
        break; // Exit loop after deleting one circle
      }
    }
  }

  function redrawCanvas() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    circles.forEach((circle) => {
      drawCircle(circle.x, circle.y, circle.radius, circle.color);
    });
  }

  canvas.addEventListener("mousedown", (event) => {
    isDrawing = true;
    const x = event.clientX - canvas.getBoundingClientRect().left;
    const y = event.clientY - canvas.getBoundingClientRect().top;
    const color = "#" + ((Math.random() * 0xffffff) << 0).toString(16);
    circles.push({ x, y, radius: 0, color });
  });

  canvas.addEventListener("mousemove", (event) => {
    if (!isDrawing) return;

    const x = event.clientX - canvas.getBoundingClientRect().left;
    const y = event.clientY - canvas.getBoundingClientRect().top;
    const currentCircle = circles[circles.length - 1];

    const dx = x - currentCircle.x;
    const dy = y - currentCircle.y;
    currentCircle.radius = Math.sqrt(dx * dx + dy * dy);

    redrawCanvas();
  });

  canvas.addEventListener("mouseup", () => {
    isDrawing = false;
  });

  canvas.addEventListener("dblclick", deleteCircle);

  canvas.addEventListener("click", updateHitStatus);

  resetBtn.addEventListener("click", () => {
    circles = [];
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  });
});
