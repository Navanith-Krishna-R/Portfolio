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
 *
 * Layers, back to front: ambient glow -> orbit rings -> ambient particles ->
 * edges -> signal burst overlay -> data pulses -> nodes.
 *
 * Depth: near/far nodes are separated by more than the raw perspective
 * projection gives (size and alpha ranges are deliberately widened), and on
 * desktop the whole scene parallaxes a few degrees toward the pointer —
 * eased, not snapped, and layered so nearer elements (particles, rings) shift
 * a little more than the lattice itself for a genuine sense of depth rather
 * than the whole canvas panning as one flat image.
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

/** node index -> [{ edgeIndex, otherNode }] — used to walk a signal burst path. */
function buildAdjacency(nodes, edges) {
  const adjacency = nodes.map(() => []);
  edges.forEach((edge, edgeIndex) => {
    adjacency[edge.a].push({ edgeIndex, otherNode: edge.b });
    adjacency[edge.b].push({ edgeIndex, otherNode: edge.a });
  });
  return adjacency;
}

/** Random walk of 3-5 nodes along real edges, for the "signal burst" effect. */
function pickBurstPath(adjacency) {
  const length = 3 + Math.floor(Math.random() * 3); // 3..5 nodes
  let start = Math.floor(Math.random() * adjacency.length);
  // Prefer a start node that actually has neighbours.
  for (let tries = 0; tries < adjacency.length && adjacency[start].length === 0; tries += 1) {
    start = (start + 1) % adjacency.length;
  }

  const nodePath = [start];
  const edgePath = [];
  let current = start;

  for (let step = 0; step < length - 1; step += 1) {
    const options = adjacency[current].filter(
      (o) => !nodePath.includes(o.otherNode)
    );
    const pick = options.length
      ? options[Math.floor(Math.random() * options.length)]
      : adjacency[current][Math.floor(Math.random() * adjacency[current].length)];
    if (!pick) break;

    edgePath.push(pick.edgeIndex);
    nodePath.push(pick.otherNode);
    current = pick.otherNode;
  }

  return { nodePath, edgePath };
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
    // Trims the glow a little further on small screens, where the canvas is
    // physically closer to the copy above it and any haze is more noticeable.
    const glowMul = isCompact ? 0.7 : 1;
    const nodeCount = isCompact ? 58 : 92;
    const nodes = buildNodes(nodeCount);
    const edges = buildEdges(nodes);
    const adjacency = buildAdjacency(nodes, edges);

    const pulses = Array.from({ length: isCompact ? 4 : 7 }, (_, i) => ({
      edge: Math.floor((i / 7) * edges.length) % Math.max(1, edges.length),
      t: (i * 0.17) % 1,
      speed: 0.0035 + (i % 4) * 0.0012,
    }));

    // --- Ambient data particles: sparse gold motes drifting past the lattice,
    // independent of the node geometry. Each has its own lifespan and fades in
    // and out at the ends so none of them pop in or out abruptly.
    const PARTICLE_COUNT = isCompact ? 7 : 16;
    const makeParticle = () => {
      const a = Math.random() * Math.PI * 2;
      const r = 0.25 + Math.random() * 1.05;
      return {
        x: Math.cos(a) * r,
        y: Math.sin(a) * r,
        vx: (Math.random() - 0.5) * 0.00016,
        vy: (Math.random() - 0.5) * 0.00016,
        size: 0.6 + Math.random() * 1.1,
        age: Math.random() * 8000,
        life: 9000 + Math.random() * 8000,
        depth: Math.random(),
      };
    };
    const particles = Array.from({ length: PARTICLE_COUNT }, makeParticle);

    // --- Signal bursts: an occasional bright pulse walking node -> node -> node
    // across a short random path, on top of the constant edge pulses.
    let burst = null;
    let nextBurstAt = 3200 + Math.random() * 2600;
    let burstClock = 0;

    // --- Third orbit ring with its own travelling marker. Skipped on mobile
    // to keep the compact canvas from feeling crowded.
    const showThirdOrbit = !isCompact;

    // --- Mouse parallax: desktop + motion-allowed only. Target values follow
    // the pointer instantly; the actual values used for rendering ease toward
    // them each frame so the scene never snaps.
    const enableParallax = !isCompact && !reduceMotion;
    let targetPX = 0;
    let targetPY = 0;
    let parallaxX = 0;
    let parallaxY = 0;

    const projected = nodes.map(() => ({ x: 0, y: 0, scale: 0, depth: 0 }));

    let width = 0;
    let height = 0;
    let radius = 0;
    let angle = 0;
    let frame = 0;
    let running = true;
    let lastTimestamp = 0;

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
      // Rotational parallax: a few degrees of extra spin/tilt eased toward the
      // pointer, layered on top of the constant auto-rotation rather than
      // replacing it.
      const cosA = Math.cos(angle + parallaxX * 0.18);
      const sinA = Math.sin(angle + parallaxX * 0.18);
      const cosT = Math.cos(TILT + parallaxY * 0.12);
      const sinT = Math.sin(TILT + parallaxY * 0.12);

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
      // Background layer: shifts the least of the three parallax layers, so
      // it reads as sitting further back than the lattice and particles.
      const cx = width / 2 + parallaxX * radius * 0.035;
      const cy = height / 2 + parallaxY * radius * 0.035;

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

      // Third orbit: a shallower ellipse on its own slow rotation, carrying a
      // single bright marker around its path — reads as a satellite / telemetry
      // sweep rather than another static ring.
      if (showThirdOrbit) {
        const orbitAngle = angle * 0.22 + 0.6;
        const rx = radius * 1.24;
        const ry = radius * 0.46;

        ctx.save();
        ctx.rotate(orbitAngle);

        ctx.beginPath();
        ctx.ellipse(0, 0, rx, ry, 0, 0, Math.PI * 2);
        ctx.strokeStyle = `rgba(${GOLD}, 0.1)`;
        ctx.lineWidth = 1;
        ctx.stroke();

        const markerAngle = frame * 0.017 + 2.4;
        const mx = Math.cos(markerAngle) * rx;
        const my = Math.sin(markerAngle) * ry;
        // Marker is nearer the viewer on the lower half of its loop; fade and
        // shrink it slightly on the far half so it reads as travelling in depth.
        const markerDepth = 0.65 + 0.35 * Math.sin(markerAngle);

        ctx.beginPath();
        ctx.arc(mx, my, 5.5 * markerDepth, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${GOLD}, ${0.16 * markerDepth})`;
        ctx.fill();

        ctx.beginPath();
        ctx.arc(mx, my, 2 * markerDepth, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${GOLD_BRIGHT}, ${0.55 + 0.35 * markerDepth})`;
        ctx.fill();

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

    const drawParticles = () => {
      const cx = width / 2;
      const cy = height / 2;

      for (let i = 0; i < particles.length; i += 1) {
        const particle = particles[i];
        const lifeRatio = particle.age / particle.life;
        // Fade in over the first 18%, hold, fade out over the last 25%.
        const envelope =
          lifeRatio < 0.18
            ? lifeRatio / 0.18
            : lifeRatio > 0.75
            ? Math.max(0, (1 - lifeRatio) / 0.25)
            : 1;

        // Foreground layer: shifts the most of the three parallax layers,
        // and nearer individual particles (higher depth) shift a little more
        // than farther ones — the same near-moves-more cue applied per-dot.
        const parallaxAmount = radius * (0.05 + particle.depth * 0.09);
        const px = cx + particle.x * radius + parallaxX * parallaxAmount;
        const py = cy + particle.y * radius + parallaxY * parallaxAmount;
        const alpha = envelope * (0.1 + particle.depth * 0.22);

        ctx.beginPath();
        ctx.arc(px, py, particle.size * (0.7 + particle.depth * 0.6), 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${GOLD_BRIGHT}, ${alpha})`;
        ctx.fill();
      }
    };

    const drawSignalBurst = () => {
      if (!burst) return;

      const { edgePath, t, duration } = burst;
      const overall = burstClock - burst.startedAt;
      const progress = Math.min(1, overall / duration);
      // Fade the whole burst in over its first 12% and out over its last 20%.
      const overallFade =
        progress < 0.12
          ? progress / 0.12
          : progress > 0.8
          ? Math.max(0, (1 - progress) / 0.2)
          : 1;
      if (overallFade <= 0) return;

      const segments = edgePath.length;
      const totalT = t * segments;

      // Highlight each segment by how close the travelling point currently is
      // to it — a soft Gaussian-ish falloff gives a natural travelling glow
      // without hand-rolling per-segment state machines.
      for (let s = 0; s < segments; s += 1) {
        const edge = edges[edgePath[s]];
        if (!edge) continue;
        const a = projected[edge.a];
        const b = projected[edge.b];
        const center = s + 0.5;
        const dist = Math.abs(totalT - center);
        const influence = Math.max(0, 1 - dist / 1.15);
        if (influence <= 0) continue;

        ctx.beginPath();
        ctx.moveTo(a.x, a.y);
        ctx.lineTo(b.x, b.y);
        ctx.strokeStyle = `rgba(${GOLD_BRIGHT}, ${influence * overallFade * 0.8})`;
        ctx.lineWidth = 1.8;
        ctx.stroke();
      }

      // Travelling marker at the current point along the path.
      const segIndex = Math.min(segments - 1, Math.floor(totalT));
      const localT = Math.min(1, totalT - segIndex);
      const edge = edges[edgePath[segIndex]];
      if (edge) {
        const a = projected[edge.a];
        const b = projected[edge.b];
        const x = a.x + (b.x - a.x) * localT;
        const y = a.y + (b.y - a.y) * localT;

        ctx.beginPath();
        ctx.arc(x, y, 2.3, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${GOLD_BRIGHT}, ${overallFade})`;
        ctx.fill();

        ctx.beginPath();
        ctx.arc(x, y, 7, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${GOLD}, ${0.2 * overallFade})`;
        ctx.fill();
      }
    };

    const draw = () => {
      ctx.clearRect(0, 0, width, height);

      // Ambient core glow — kept deliberately faint. The CSS lens behind the
      // canvas already darkens this area, and any brighter haze here would
      // eat into the nodes' contrast against the backdrop's light shafts.
      const glow = ctx.createRadialGradient(
        width / 2,
        height / 2,
        0,
        width / 2,
        height / 2,
        radius * 1.6
      );
      glow.addColorStop(0, `rgba(${GOLD}, ${0.05 * glowMul})`);
      glow.addColorStop(0.55, `rgba(${GOLD}, ${0.015 * glowMul})`);
      glow.addColorStop(1, "rgba(245, 197, 66, 0)");
      ctx.fillStyle = glow;
      ctx.fillRect(0, 0, width, height);

      project();
      drawRings();
      drawParticles();

      // Edges, back to front.
      for (let i = 0; i < edges.length; i += 1) {
        const edge = edges[i];
        const a = projected[edge.a];
        const b = projected[edge.b];
        const depth = (a.depth + b.depth) / 2;
        // Widened from the original 0.13-0.58 range so far edges recede
        // further into the background instead of holding a flat mid-alpha.
        const alpha = (0.07 + depth * 0.58) * edge.strength;

        ctx.beginPath();
        ctx.moveTo(a.x, a.y);
        ctx.lineTo(b.x, b.y);
        ctx.strokeStyle = `rgba(${depth > 0.62 ? GOLD : COOL}, ${alpha})`;
        ctx.lineWidth = depth > 0.62 ? 1.3 : 0.85;
        ctx.stroke();
      }

      drawSignalBurst();

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

      // Nodes. Depth contrast is sharpened a little beyond what the raw
      // perspective projection gives, so near nodes read distinctly brighter
      // and larger than far ones instead of blending into a flat cluster.
      for (let i = 0; i < nodes.length; i += 1) {
        const p = projected[i];
        const node = nodes[i];
        const shimmer = 0.78 + 0.22 * Math.sin(frame * 0.02 + node.phase * 6.28);
        // Widened from 0.82-1.18 so the nearest nodes read distinctly larger
        // than the farthest, instead of the cluster blending into one size.
        const depthSize = 0.7 + p.depth * 0.58;
        const size = (node.hub ? 3.1 : 1.75) * p.scale * depthSize * shimmer;
        const alpha = Math.min(1, (node.hub ? 0.74 : 0.36) + p.depth * 0.64);

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

    const updateParticles = (dt) => {
      for (let i = 0; i < particles.length; i += 1) {
        const particle = particles[i];
        particle.age += dt;
        particle.x += particle.vx * dt;
        particle.y += particle.vy * dt;

        const dist = Math.hypot(particle.x, particle.y);
        if (particle.age >= particle.life || dist > 1.4) {
          particles[i] = makeParticle();
          particles[i].age = 0;
        }
      }
    };

    const updateBurst = (dt) => {
      burstClock += dt;

      if (burst) {
        const overall = burstClock - burst.startedAt;
        burst.t = Math.min(1, overall / burst.duration);
        if (overall >= burst.duration) burst = null;
      }

      if (!burst && burstClock >= nextBurstAt && edges.length > 0) {
        const { edgePath } = pickBurstPath(adjacency);
        if (edgePath.length >= 2) {
          burst = {
            edgePath,
            startedAt: burstClock,
            duration: 1100 + edgePath.length * 320,
            t: 0,
          };
        }
        // Next burst 4.5-9s later on desktop; a little less often on mobile,
        // where the smaller canvas makes frequent bursts feel busy.
        const gap = isCompact ? [6000, 11000] : [4500, 9000];
        nextBurstAt = burstClock + gap[0] + Math.random() * (gap[1] - gap[0]);
      }
    };

    const tick = (timestamp) => {
      if (!running) return;

      const dt = lastTimestamp
        ? Math.min(64, timestamp - lastTimestamp)
        : 16.7;
      lastTimestamp = timestamp;

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

      updateParticles(dt);
      updateBurst(dt);

      // Ease the rendered parallax value toward the pointer's target each
      // frame — never snaps, and settles back to centre on its own once the
      // pointer leaves (targetPX/Y are reset to 0 on pointerleave).
      if (enableParallax) {
        parallaxX += (targetPX - parallaxX) * 0.06;
        parallaxY += (targetPY - parallaxY) * 0.06;
      }

      draw();
      animationId = window.requestAnimationFrame(tick);
    };

    let animationId = 0;

    const start = () => {
      if (running || reduceMotion) return;
      running = true;
      lastTimestamp = 0;
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

    // Pointer parallax target — updated instantly on move, but only ever
    // consumed through the eased parallaxX/Y above, and only registered at
    // all when parallax is enabled (desktop, motion allowed).
    const container = canvas.parentElement;
    const onPointerMove = (event) => {
      const rect = container.getBoundingClientRect();
      const nx = ((event.clientX - rect.left) / rect.width) * 2 - 1;
      const ny = ((event.clientY - rect.top) / rect.height) * 2 - 1;
      targetPX = Math.max(-1, Math.min(1, nx));
      targetPY = Math.max(-1, Math.min(1, ny));
    };
    const onPointerLeave = () => {
      targetPX = 0;
      targetPY = 0;
    };

    if (enableParallax && container) {
      container.addEventListener("pointermove", onPointerMove);
      container.addEventListener("pointerleave", onPointerLeave);
    }

    return () => {
      stop();
      window.clearTimeout(resizeTimer);
      window.removeEventListener("resize", onResize);
      document.removeEventListener("visibilitychange", onVisibility);
      if (observer) observer.disconnect();
      if (enableParallax && container) {
        container.removeEventListener("pointermove", onPointerMove);
        container.removeEventListener("pointerleave", onPointerLeave);
      }
    };
  }, []);

  return (
    <div className="hero__visual">
      <canvas ref={canvasRef} aria-hidden="true" />
    </div>
  );
}

export default HeroVisual;
