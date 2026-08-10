import React, { useEffect, useRef } from "react";

/**
 * Hero visual: a slowly rotating 3D node lattice with data pulses travelling
 * along its edges — a neural-network / distributed-system motif rendered on a
 * plain 2D canvas.
 *
 * Written by hand rather than pulled from a library so it costs 0 KB of
 * dependencies, matches the palette exactly, and can be throttled:
 *   - geometry and edges are computed once, then only rotated (rigid body)
 *   - the loop pauses when the tab is hidden or the canvas scrolls off screen
 *   - prefers-reduced-motion renders a single static frame and never starts rAF
 */

const GOLD = "245, 197, 66";
const GOLD_BRIGHT = "255, 217, 90";
const COOL = "167, 173, 181";

const TILT = -0.42;
const FOV = 3.1;
const LINK_DISTANCE = 0.58;
const MAX_LINKS_PER_NODE = 3;

function buildNodes(count) {
  const nodes = [];
  const golden = Math.PI * (3 - Math.sqrt(5));

  for (let i = 0; i < count; i += 1) {
    const y = 1 - (i / (count - 1)) * 2;
    const ring = Math.sqrt(Math.max(0, 1 - y * y));
    const theta = golden * i;
    // Jittered radius so the lattice reads as a volume, not a hollow globe.
    const r = 0.74 + ((Math.sin(i * 12.9898) * 43758.5453) % 1) * 0.26;

    nodes.push({
      x: Math.cos(theta) * ring * r,
      y: y * r,
      z: Math.sin(theta) * ring * r,
      // Deterministic per-node phase for the brightness shimmer.
      phase: (i * 0.618) % 1,
      hub: i % 9 === 0,
    });
  }

  return nodes;
}

function buildEdges(nodes) {
  const edges = [];
  const degree = new Array(nodes.length).fill(0);

  for (let i = 0; i < nodes.length; i += 1) {
    for (let j = i + 1; j < nodes.length; j += 1) {
      if (degree[i] >= MAX_LINKS_PER_NODE || degree[j] >= MAX_LINKS_PER_NODE) {
        continue;
      }

      const dx = nodes[i].x - nodes[j].x;
      const dy = nodes[i].y - nodes[j].y;
      const dz = nodes[i].z - nodes[j].z;
      const dist = Math.sqrt(dx * dx + dy * dy + dz * dz);

      if (dist < LINK_DISTANCE) {
        edges.push({ a: i, b: j, strength: 1 - dist / LINK_DISTANCE });
        degree[i] += 1;
        degree[j] += 1;
      }
    }
  }

  return edges;
}

function HeroVisual() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return undefined;

    const ctx = canvas.getContext("2d");
    if (!ctx) return undefined;

    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    const isCompact = window.matchMedia("(max-width: 767px)").matches;
    const nodes = buildNodes(isCompact ? 58 : 92);
    const edges = buildEdges(nodes);

    const pulses = Array.from({ length: isCompact ? 4 : 7 }, (_, i) => ({
      edge: Math.floor((i / 7) * edges.length) % Math.max(1, edges.length),
      t: (i * 0.17) % 1,
      speed: 0.0035 + (i % 4) * 0.0012,
    }));

    const projected = nodes.map(() => ({ x: 0, y: 0, scale: 0, depth: 0 }));

    let width = 0;
    let height = 0;
    let radius = 0;
    let angle = 0;
    let frame = 0;
    let running = true;

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);

      width = rect.width;
      height = rect.height;
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      radius = Math.min(width, height) * 0.36;
    };

    const project = () => {
      const cx = width / 2;
      const cy = height / 2;
      const cosA = Math.cos(angle);
      const sinA = Math.sin(angle);
      const cosT = Math.cos(TILT);
      const sinT = Math.sin(TILT);

      for (let i = 0; i < nodes.length; i += 1) {
        const n = nodes[i];
        const rx = n.x * cosA + n.z * sinA;
        const rz = -n.x * sinA + n.z * cosA;
        const ry = n.y * cosT - rz * sinT;
        const rzz = n.y * sinT + rz * cosT;

        const scale = FOV / (FOV + rzz);
        const p = projected[i];
        p.x = cx + rx * radius * scale;
        p.y = cy + ry * radius * scale;
        p.scale = scale;
        // 0 = far, 1 = near.
        p.depth = (rzz + 1) / 2;
      }
    };

    const drawRings = () => {
      const cx = width / 2;
      const cy = height / 2;

      ctx.save();
      ctx.translate(cx, cy);

      // Static outer boundary.
      ctx.beginPath();
      ctx.ellipse(0, 0, radius * 1.32, radius * 1.32, 0, 0, Math.PI * 2);
      ctx.strokeStyle = `rgba(${GOLD}, 0.22)`;
      ctx.lineWidth = 1.1;
      ctx.stroke();

      // Two tilted orbits that counter-rotate against the lattice.
      for (let i = 0; i < 2; i += 1) {
        const orbitAngle = angle * (i === 0 ? -0.5 : 0.32) + i * 1.1;
        ctx.save();
        ctx.rotate(orbitAngle);
        ctx.beginPath();
        ctx.ellipse(
          0,
          0,
          radius * (1.14 + i * 0.1),
          radius * (0.3 + i * 0.16),
          0,
          0,
          Math.PI * 2
        );
        ctx.strokeStyle = `rgba(${COOL}, ${0.17 - i * 0.05})`;
        ctx.lineWidth = 1.1;
        ctx.stroke();
        ctx.restore();
      }

      // Short bright arc sweeping the boundary, like an instrument readout.
      ctx.beginPath();
      ctx.arc(0, 0, radius * 1.32, angle * 1.6, angle * 1.6 + 0.55);
      ctx.strokeStyle = `rgba(${GOLD_BRIGHT}, 0.85)`;
      ctx.lineWidth = 2.1;
      ctx.lineCap = "round";
      ctx.stroke();

      ctx.restore();
    };

    const draw = () => {
      ctx.clearRect(0, 0, width, height);

      // Ambient core glow.
      const glow = ctx.createRadialGradient(
        width / 2,
        height / 2,
        0,
        width / 2,
        height / 2,
        radius * 1.6
      );
      // Kept low: the CSS lens behind the canvas already darkens this area, and
      // any extra gold haze here would eat into the nodes' contrast.
      glow.addColorStop(0, `rgba(${GOLD}, 0.05)`);
      glow.addColorStop(0.55, `rgba(${GOLD}, 0.015)`);
      glow.addColorStop(1, "rgba(245, 197, 66, 0)");
      ctx.fillStyle = glow;
      ctx.fillRect(0, 0, width, height);

      project();
      drawRings();

      // Edges, back to front.
      for (let i = 0; i < edges.length; i += 1) {
        const edge = edges[i];
        const a = projected[edge.a];
        const b = projected[edge.b];
        const depth = (a.depth + b.depth) / 2;
        const alpha = (0.13 + depth * 0.45) * edge.strength;

        ctx.beginPath();
        ctx.moveTo(a.x, a.y);
        ctx.lineTo(b.x, b.y);
        ctx.strokeStyle = `rgba(${depth > 0.62 ? GOLD : COOL}, ${alpha})`;
        ctx.lineWidth = depth > 0.62 ? 1.25 : 0.95;
        ctx.stroke();
      }

      // Data pulses travelling along edges.
      for (let i = 0; i < pulses.length; i += 1) {
        const pulse = pulses[i];
        const edge = edges[pulse.edge];
        if (!edge) continue;

        const a = projected[edge.a];
        const b = projected[edge.b];
        const x = a.x + (b.x - a.x) * pulse.t;
        const y = a.y + (b.y - a.y) * pulse.t;
        const depth = a.depth + (b.depth - a.depth) * pulse.t;
        // Fade in and out at the ends so pulses never pop.
        const travel = Math.sin(pulse.t * Math.PI);

        ctx.beginPath();
        ctx.arc(x, y, 1.7 + depth * 1.1, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${GOLD_BRIGHT}, ${0.85 * travel * (0.4 + depth * 0.6)})`;
        ctx.fill();

        ctx.beginPath();
        ctx.arc(x, y, 5 + depth * 3, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${GOLD}, ${0.12 * travel})`;
        ctx.fill();
      }

      // Nodes.
      for (let i = 0; i < nodes.length; i += 1) {
        const p = projected[i];
        const node = nodes[i];
        const shimmer = 0.78 + 0.22 * Math.sin(frame * 0.02 + node.phase * 6.28);
        const size = (node.hub ? 3.1 : 1.75) * p.scale * shimmer;
        const alpha = Math.min(1, (node.hub ? 0.88 : 0.52) + p.depth * 0.48);

        ctx.beginPath();
        ctx.arc(p.x, p.y, size, 0, Math.PI * 2);
        ctx.fillStyle = node.hub
          ? `rgba(${GOLD_BRIGHT}, ${alpha})`
          : `rgba(${p.depth > 0.55 ? GOLD : COOL}, ${alpha})`;
        ctx.fill();

        if (node.hub && p.depth > 0.5) {
          ctx.beginPath();
          ctx.arc(p.x, p.y, size * 3.2, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(${GOLD}, ${0.14 * p.depth})`;
          ctx.fill();
        }
      }
    };

    const tick = () => {
      if (!running) return;

      angle += 0.0022;
      frame += 1;

      for (let i = 0; i < pulses.length; i += 1) {
        const pulse = pulses[i];
        pulse.t += pulse.speed;
        if (pulse.t >= 1) {
          pulse.t = 0;
          pulse.edge = Math.floor(Math.random() * edges.length);
        }
      }

      draw();
      animationId = window.requestAnimationFrame(tick);
    };

    let animationId = 0;

    const start = () => {
      if (running || reduceMotion) return;
      running = true;
      animationId = window.requestAnimationFrame(tick);
    };

    const stop = () => {
      running = false;
      window.cancelAnimationFrame(animationId);
    };

    resize();

    if (reduceMotion) {
      running = false;
      draw();
    } else {
      animationId = window.requestAnimationFrame(tick);
    }

    let resizeTimer = 0;
    const onResize = () => {
      window.clearTimeout(resizeTimer);
      resizeTimer = window.setTimeout(() => {
        resize();
        if (!running) draw();
      }, 150);
    };

    const onVisibility = () => {
      if (document.hidden) stop();
      else start();
    };

    // Stop burning frames once the hero is scrolled past.
    const observer =
      typeof IntersectionObserver !== "undefined"
        ? new IntersectionObserver(
            ([entry]) => {
              if (entry.isIntersecting) start();
              else stop();
            },
            { threshold: 0 }
          )
        : null;

    if (observer) observer.observe(canvas);
    window.addEventListener("resize", onResize);
    document.addEventListener("visibilitychange", onVisibility);

    return () => {
      stop();
      window.clearTimeout(resizeTimer);
      window.removeEventListener("resize", onResize);
      document.removeEventListener("visibilitychange", onVisibility);
      if (observer) observer.disconnect();
    };
  }, []);

  return (
    <div className="hero__visual">
      <canvas ref={canvasRef} aria-hidden="true" />
    </div>
  );
}

export default HeroVisual;
