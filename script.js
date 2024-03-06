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

  function deleteCircle(event) {
    const x = event.clientX - canvas.getBoundingClientRect().left;
    const y = event.clientY - canvas.getBoundingClientRect().top;

    circles = circles.filter((circle) => !hitTest(x, y, circle));
    redrawCanvas();
  }

  function redrawCanvas() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    circles.forEach((circle) => {
      drawCircle(circle.x, circle.y, circle.radius, circle.color);
    });
  }

  function displayOverlay(message, color, x, y) {
    const overlay = document.createElement("div");
    overlay.className = "hit-overlay";
    overlay.textContent = message;
    overlay.style.left = `${x}px`;
    overlay.style.top = `${y}px`;
    overlay.style.color = color;
    document.body.appendChild(overlay);

    setTimeout(() => {
      overlay.remove();
    }, 1000);
  }

  function updateHitStatus(event) {
    const x = event.clientX - canvas.getBoundingClientRect().left;
    const y = event.clientY - canvas.getBoundingClientRect().top;

    let hit = false;

    // Check hit status for circles (excluding the first one)
    for (let i = circles.length - 1; i > 0; i--) {
      if (hitTest(x, y, circles[i])) {
        hit = true;
        break;
      }
    }

    const resultText = hit ? "Hit!" : "Miss!";
    const resultColor = hit ? "green" : "red";

    // Display hit or miss overlay at the center of the canvas
    displayOverlay(
      resultText,
      resultColor,
      canvas.width / 2,
      canvas.height / 2
    );
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
