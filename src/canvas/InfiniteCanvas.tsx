import { useEffect, useRef, useState } from "react";
import "./InfiniteCanvas.css";

interface Camera {
  x: number;
  y: number;
  zoom: number;
}

export default function InfiniteCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const [camera, setCamera] = useState<Camera>({
    x: 0,
    y: 0,
    zoom: 1,
  });

  const [isPanning, setIsPanning] = useState(false);

  const lastMouse = useRef({
    x: 0,
    y: 0,
  });

  // Draw canvas
  useEffect(() => {
    const canvas = canvasRef.current;

    if (!canvas) return;

    const ctx = canvas.getContext("2d");

    if (!ctx) return;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    drawGrid(ctx, canvas, camera);
  }, [camera]);

  function handleMouseDown(
    event: React.MouseEvent<HTMLCanvasElement>
  ) {
    setIsPanning(true);

    lastMouse.current = {
      x: event.clientX,
      y: event.clientY,
    };
  }

  function handleMouseMove(
    event: React.MouseEvent<HTMLCanvasElement>
  ) {
    if (!isPanning) return;

    const dx = event.clientX - lastMouse.current.x;
    const dy = event.clientY - lastMouse.current.y;

    setCamera((prev) => ({
      ...prev,
      x: prev.x + dx,
      y: prev.y + dy,
    }));

    lastMouse.current = {
      x: event.clientX,
      y: event.clientY,
    };
  }

  function handleMouseUp() {
    setIsPanning(false);
  }

  function handleWheel(
    event: React.WheelEvent<HTMLCanvasElement>
  ) {
    event.preventDefault();

    const zoomSpeed = 0.001;

    setCamera((prev) => {
      const newZoom = Math.min(
        Math.max(prev.zoom - event.deltaY * zoomSpeed, 0.2),
        5
      );

      return {
        ...prev,
        zoom: newZoom,
      };
    });
  }

  return (
    <canvas
      ref={canvasRef}
      className="infinite-canvas"
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
      onWheel={handleWheel}
    />
  );
}

function drawGrid(
  ctx: CanvasRenderingContext2D,
  canvas: HTMLCanvasElement,
  camera: Camera
) {
  const gridSize = 40 * camera.zoom;

  ctx.strokeStyle = "#e5e5e5";
  ctx.lineWidth = 1;

  const offsetX = camera.x % gridSize;
  const offsetY = camera.y % gridSize;

  for (let x = offsetX; x < canvas.width; x += gridSize) {
    ctx.beginPath();

    ctx.moveTo(x, 0);
    ctx.lineTo(x, canvas.height);

    ctx.stroke();
  }

  for (let y = offsetY; y < canvas.height; y += gridSize) {
    ctx.beginPath();

    ctx.moveTo(0, y);
    ctx.lineTo(canvas.width, y);

    ctx.stroke();
  }
}