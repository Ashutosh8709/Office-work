import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'

type Phase = 'swing' | 'impact' | 'shatter' | 'reveal'

const TIMELINE: { phase: Phase; at: number }[] = [
  { phase: 'swing', at: 0 },
  { phase: 'impact', at: 2500 },
  { phase: 'shatter', at: 2780 },
  { phase: 'reveal', at: 3450 },
]

const DONE_AT = 5400

/** Half the cube edge, in px. */
const HALF = 150

/** Glacial ice: near-white where the light enters, deep cyan through the body. */
const ICE_FACE =
  'linear-gradient(158deg, rgba(244,254,255,0.97) 0%, rgba(178,235,252,0.94) 30%, rgba(72,187,232,0.92) 66%, rgba(14,116,182,0.94) 100%)'

/** Frost speckle + internal bubbles + crystalline patterns, layered over every face. */
const ICE_FROST =
  'radial-gradient(circle at 26% 22%, rgba(255,255,255,0.95), transparent 34%), radial-gradient(circle at 74% 68%, rgba(255,255,255,0.6), transparent 30%), radial-gradient(circle at 58% 34%, rgba(255,255,255,0.5), transparent 16%), radial-gradient(circle at 34% 74%, rgba(255,255,255,0.45), transparent 14%), radial-gradient(circle at 45% 55%, rgba(186,240,255,0.35), transparent 25%), radial-gradient(circle at 68% 32%, rgba(255,255,255,0.4), transparent 18%)'

/** Surface scratches, imperfections, and micro-cracks. */
const ICE_SCRATCHES =
  'linear-gradient(42deg, transparent 45%, rgba(255,255,255,0.7) 46%, transparent 47%), linear-gradient(142deg, transparent 72%, rgba(255,255,255,0.5) 73%, transparent 74%), linear-gradient(82deg, transparent 18%, rgba(255,255,255,0.6) 19%, transparent 20%), linear-gradient(112deg, transparent 55%, rgba(255,255,255,0.4) 56%, transparent 57%), linear-gradient(28deg, transparent 38%, rgba(255,255,255,0.35) 39%, transparent 40%)'

type Face = { transform: string; tint: string; gloss: number }

const CUBE_FACES: Face[] = [
  // front — brightest, catches the key light
  { transform: `translateZ(${HALF}px)`, tint: 'rgba(186,240,255,0.2)', gloss: 0.95 },
  // back — seen through the ice, cooler and dimmer
  { transform: `rotateY(180deg) translateZ(${HALF}px)`, tint: 'rgba(4,58,102,0.45)', gloss: 0.3 },
  // right — light falls off
  { transform: `rotateY(90deg) translateZ(${HALF}px)`, tint: 'rgba(5,80,130,0.3)', gloss: 0.55 },
  // left — shadow side
  { transform: `rotateY(-90deg) translateZ(${HALF}px)`, tint: 'rgba(4,62,108,0.42)', gloss: 0.4 },
  // top — sky light, almost white
  { transform: `rotateX(90deg) translateZ(${HALF}px)`, tint: 'rgba(255,255,255,0.55)', gloss: 1 },
  // bottom — deepest blue, bounces off the floor
  { transform: `rotateX(-90deg) translateZ(${HALF}px)`, tint: 'rgba(2,38,76,0.6)', gloss: 0.2 },
]

const SHARDS = Array.from({ length: 16 }, (_, i) => {
  const angle = (i / 16) * Math.PI * 2 + (i % 3) * 0.22
  const spread = 260 + (i % 4) * 90
  return {
    x: Math.cos(angle) * spread,
    y: Math.sin(angle) * spread * 0.72 - 40,
    z: 180 + (i % 5) * 120,
    rotateX: (i % 2 ? 1 : -1) * (120 + i * 18),
    rotateY: (i % 3 ? -1 : 1) * (140 + i * 12),
    rotateZ: (i % 2 ? -1 : 1) * (90 + i * 22),
    size: 46 + (i % 4) * 26,
    clip:
      i % 3 === 0
        ? 'polygon(50% 0%, 100% 72%, 8% 100%)'
        : i % 3 === 1
          ? 'polygon(0% 0%, 100% 22%, 74% 100%, 12% 78%)'
          : 'polygon(18% 0%, 100% 40%, 60% 100%, 0% 62%)',
    delay: (i % 6) * 0.02,
  }
})

/** Tiny ice chips for secondary debris. */
const CHIPS = Array.from({ length: 32 }, (_, i) => {
  const angle = (i / 32) * Math.PI * 2
  const dist = 80 + (i % 5) * 40
  return {
    x: Math.cos(angle) * dist,
    y: Math.sin(angle) * dist * 0.6,
    z: 60 + (i % 4) * 50,
    size: 6 + (i % 4) * 8,
    delay: 0.04 + (i % 8) * 0.012,
  }
})

/** Fine ice dust particles for atmospheric effect. */
const DUST = Array.from({ length: 48 }, (_, i) => {
  const angle = (i / 48) * Math.PI * 2 + Math.random() * 0.5
  const dist = 120 + Math.random() * 180
  return {
    x: Math.cos(angle) * dist,
    y: Math.sin(angle) * dist * 0.5 - 20,
    z: 30 + Math.random() * 90,
    size: 2 + Math.random() * 4,
    delay: 0.06 + Math.random() * 0.08,
  }
})

/** Mist/fog particles that linger after impact. */
const MIST = Array.from({ length: 20 }, (_, i) => {
  const angle = (i / 20) * Math.PI * 2
  return {
    x: Math.cos(angle) * (60 + Math.random() * 40),
    y: Math.sin(angle) * (40 + Math.random() * 30) - 10,
    size: 20 + Math.random() * 30,
    delay: 0.1 + Math.random() * 0.15,
  }
})

const SPARKS = Array.from({ length: 18 }, (_, i) => {
  const angle = (i / 18) * Math.PI * 2
  return {
    x: Math.cos(angle) * (180 + (i % 4) * 55),
    y: Math.sin(angle) * (140 + (i % 3) * 60),
    size: 8 + (i % 4) * 5,
    delay: (i % 5) * 0.02,
  }
})

export function IceBreaker({ onDone }: { onDone: () => void }) {
  const [phase, setPhase] = useState<Phase>('swing')

  useEffect(() => {
    const timers = TIMELINE.slice(1).map((step) =>
      window.setTimeout(() => setPhase(step.phase), step.at),
    )
    timers.push(window.setTimeout(onDone, DONE_AT))
    return () => timers.forEach(window.clearTimeout)
  }, [onDone])

  useEffect(() => {
    const skip = (event: KeyboardEvent) => {
      if (event.key === ' ' || event.key === 'Enter' || event.key === 'Escape') {
        event.preventDefault()
        onDone()
      }
    }
    window.addEventListener('keydown', skip)
    return () => window.removeEventListener('keydown', skip)
  }, [onDone])

  const broken = phase === 'shatter' || phase === 'reveal'

  return (
    <div
      className="relative flex h-full w-full cursor-pointer items-center justify-center overflow-hidden"
      onClick={onDone}
    >
      <motion.div
        className="relative flex flex-col items-center"
        animate={
          phase === 'impact'
            ? { x: [0, -18, 15, -8, 0], y: [0, 10, -7, 3, 0] }
            : { x: 0, y: 0 }
        }
        transition={{ duration: 0.35 }}
      >
        {/* 3D stage */}
        <div
          className="relative flex h-[420px] w-[560px] items-center justify-center 3xl:h-[520px] 3xl:w-[720px]"
          style={{ perspective: 1400, perspectiveOrigin: '50% 45%' }}
        >
          {/* Cold ambient pool — gives the translucent ice something to read against */}
          <motion.div
            className="absolute h-[640px] w-[640px] rounded-full blur-3xl"
            style={{
              background:
                'radial-gradient(circle, rgba(186,240,255,0.65) 0%, rgba(125,211,252,0.45) 35%, rgba(56,189,248,0.25) 55%, transparent 72%)',
            }}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={
              broken
                ? { opacity: 0, scale: 1.6 }
                : phase === 'impact'
                  ? { opacity: 1, scale: 1.2, background: 'radial-gradient(circle, rgba(255,255,255,0.8) 0%, rgba(186,240,255,0.6) 30%, rgba(125,211,252,0.35) 50%, transparent 70%)' }
                  : { opacity: 0.9, scale: 1 }
            }
            transition={{ duration: broken ? 0.7 : 0.9, ease: 'easeOut' }}
          />

          {/* Floor reflection of the ice */}
          <motion.div
            className="absolute bottom-4 h-[140px] w-[260px] rounded-full blur-2xl"
            style={{
              background:
                'radial-gradient(ellipse at center, rgba(186,240,255,0.5) 0%, rgba(56,189,248,0.25) 50%, transparent 70%)',
            }}
            initial={{ opacity: 0, scale: 0.6 }}
            animate={
              broken
                ? { opacity: 0, scale: 0.3 }
                : phase === 'impact'
                  ? { opacity: 0.7, scale: 1.2 }
                  : { opacity: 0.5, scale: 1 }
            }
            transition={{ duration: broken ? 0.5 : 0.8, ease: 'easeOut' }}
          />

          {/* Floor shadow */}
          <motion.div
            className="absolute bottom-10 h-16 w-72 rounded-[50%] blur-2xl"
            style={{ background: 'rgba(7,58,92,0.55)' }}
            animate={
              broken
                ? { scaleX: 1.7, scaleY: 0.5, opacity: 0 }
                : phase === 'impact'
                  ? { scaleX: [1, 1.35, 1], scaleY: [1, 0.7, 1], opacity: 0.5 }
                  : { scaleX: [1, 1.08, 1], scaleY: 1, opacity: 0.4 }
            }
            transition={{
              duration: broken ? 0.6 : phase === 'impact' ? 0.35 : 2.4,
              repeat: phase === 'swing' ? Infinity : 0,
              ease: 'easeInOut',
            }}
          />

          {/* The cube — entrance/jolt on the outer node, endless 3D orbit on the inner node,
              so the fade-in is never restarted by the looping rotation. */}
          <AnimatePresence>
            {!broken && (
              <motion.div
                className="absolute"
                style={{ transformStyle: 'preserve-3d' }}
                initial={{ opacity: 0, scale: 0.62, y: -110 }}
                animate={
                  phase === 'impact'
                    ? { opacity: 1, scale: [1, 0.9, 1.03], y: [0, 26, 12] }
                    : { opacity: 1, scale: 1, y: 0 }
                }
                exit={{ opacity: 0, transition: { duration: 0.14 } }}
                transition={
                  phase === 'impact'
                    ? { duration: 0.3, ease: 'easeOut' }
                    : { duration: 0.85, ease: [0.22, 1, 0.36, 1] }
                }
              >
                <motion.div
                  style={{
                    width: HALF * 2,
                    height: HALF * 2,
                    transformStyle: 'preserve-3d',
                  }}
                  animate={{
                    rotateX: [-18, -26, -18],
                    rotateY: [-34, 38, -34],
                    y: [0, -18, 0],
                  }}
                  transition={{ duration: 9, repeat: Infinity, ease: 'easeInOut' }}
                >
                  {CUBE_FACES.map((face) => (
                    <div
                      key={face.transform}
                      className="absolute inset-0 rounded-[22px]"
                      style={{
                        transform: face.transform,
                        backgroundImage: ICE_FACE,
                        border: '2px solid rgba(255,255,255,0.95)',
                        boxShadow:
                          'inset 0 0 0 4px rgba(233,252,255,0.7), inset 0 46px 80px rgba(255,255,255,0.6), inset 0 -50px 80px rgba(3,105,161,0.6), 0 0 60px rgba(14,116,182,0.45), inset 0 0 20px rgba(186,240,255,0.3)',
                      }}
                    >
                      {/* Beveled edge highlight */}
                      <div
                        className="absolute inset-0 rounded-[22px]"
                        style={{
                          border: '1px solid rgba(255,255,255,0.8)',
                          boxShadow: 'inset 0 0 8px rgba(255,255,255,0.5)',
                        }}
                      />
                      {/* light falloff per face */}
                      <div
                        className="absolute inset-0 rounded-[22px]"
                        style={{ background: face.tint }}
                      />
                      {/* frozen bubbles + frost */}
                      <div
                        className="absolute inset-0 rounded-[22px] opacity-70 blur-[2px]"
                        style={{ backgroundImage: ICE_FROST }}
                      />
                      {/* surface scratches */}
                      <div
                        className="absolute inset-0 rounded-[22px] opacity-45"
                        style={{ backgroundImage: ICE_SCRATCHES }}
                      />
                      {/* specular streaks */}
                      <div
                        className="absolute inset-0 rounded-[22px]"
                        style={{
                          opacity: face.gloss,
                          backgroundImage:
                            'linear-gradient(118deg, transparent 26%, rgba(255,255,255,0.92) 38%, transparent 47%), linear-gradient(64deg, transparent 60%, rgba(255,255,255,0.5) 70%, transparent 78%)',
                        }}
                      />
                    </div>
                  ))}

                  {/* Internal fracture planes — the thing that sells real ice */}
                  <div
                    className="absolute inset-4 rounded-2xl blur-[3px]"
                    style={{
                      transform: 'rotateY(38deg) rotateX(-18deg) translateZ(8px)',
                      background:
                        'linear-gradient(140deg, rgba(255,255,255,0.75), rgba(255,255,255,0.05) 60%)',
                      opacity: 0.55,
                    }}
                  />
                  <div
                    className="absolute inset-8 rounded-2xl blur-[3px]"
                    style={{
                      transform: 'rotateY(-52deg) rotateX(26deg) translateZ(-15px)',
                      background:
                        'linear-gradient(200deg, rgba(255,255,255,0.6), rgba(125,211,252,0.1) 65%)',
                      opacity: 0.5,
                    }}
                  />
                  <div
                    className="absolute inset-12 rounded-2xl blur-[2px]"
                    style={{
                      transform: 'rotateY(22deg) rotateX(-12deg) translateZ(25px)',
                      background:
                        'linear-gradient(160deg, rgba(255,255,255,0.5), rgba(186,240,255,0.2) 70%)',
                      opacity: 0.4,
                    }}
                  />
                  <div
                    className="absolute inset-16 rounded-2xl blur-[2px]"
                    style={{
                      transform: 'rotateY(-18deg) rotateX(34deg) translateZ(-8px)',
                      background:
                        'linear-gradient(110deg, rgba(255,255,255,0.45), rgba(147,197,253,0.15) 60%)',
                      opacity: 0.35,
                    }}
                  />
                  <div
                    className="absolute inset-20 rounded-2xl blur-[1.5px]"
                    style={{
                      transform: 'rotateY(48deg) rotateX(-8deg) translateZ(18px)',
                      background:
                        'linear-gradient(175deg, rgba(255,255,255,0.4), rgba(125,211,252,0.12) 55%)',
                      opacity: 0.3,
                    }}
                  />

                  {/* Frozen core glow — subsurface scattering effect */}
                  <div
                    className="absolute left-1/2 top-1/2 h-52 w-52 rounded-full blur-2xl"
                    style={{
                      transform: 'translate(-50%,-50%)',
                      background:
                        'radial-gradient(circle, rgba(255,255,255,0.95), rgba(186,240,255,0.7) 40%, rgba(125,211,252,0.45) 60%, transparent 78%)',
                      opacity: 0.8,
                    }}
                  />
                  <div
                    className="absolute left-1/2 top-1/2 h-36 w-36 rounded-full blur-xl"
                    style={{
                      transform: 'translate(-50%,-50%)',
                      background:
                        'radial-gradient(circle, rgba(255,255,255,0.9), rgba(224,242,254,0.6) 50%, transparent 72%)',
                      opacity: 0.6,
                    }}
                  />

                  {/* Cracks, floated just off the front face */}
                  <div
                    className="absolute inset-0"
                    style={{ transform: `translateZ(${HALF + 2}px)` }}
                  >
                    <svg
                      viewBox="0 0 300 300"
                      className="h-full w-full"
                      fill="none"
                      stroke="rgba(255,255,255,0.98)"
                      strokeLinecap="round"
                    >
                      {[
                        { d: 'M150 150 L110 62 L82 26', w: 5 },
                        { d: 'M150 150 L222 80 L268 44', w: 4 },
                        { d: 'M150 150 L56 176 L16 160', w: 5 },
                        { d: 'M150 150 L204 232 L246 276', w: 4 },
                        { d: 'M150 150 L120 246 L98 288', w: 3 },
                        { d: 'M150 150 L280 174', w: 3 },
                        { d: 'M110 62 L146 96', w: 2 },
                        { d: 'M56 176 L96 196', w: 2 },
                      ].map((crack) => (
                        <motion.path
                          key={crack.d}
                          d={crack.d}
                          strokeWidth={crack.w}
                          initial={{ pathLength: 0, opacity: 0 }}
                          animate={
                            phase === 'impact'
                              ? { pathLength: 1, opacity: 1 }
                              : { pathLength: 0, opacity: 0 }
                          }
                          transition={{ duration: 0.2, ease: 'easeOut' }}
                        />
                      ))}
                    </svg>
                  </div>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Shards explode in 3D, some flying past the camera */}
          {broken && (
            <div
              className="absolute inset-0 flex items-center justify-center"
              style={{ transformStyle: 'preserve-3d' }}
            >
              {SHARDS.map((shard, i) => (
                <motion.div
                  key={i}
                  className="absolute border border-white/70"
                  style={{
                    width: shard.size,
                    height: shard.size,
                    clipPath: shard.clip,
                    backgroundImage: ICE_FACE,
                    boxShadow: 'inset 0 0 22px rgba(255,255,255,0.9)',
                    transformStyle: 'preserve-3d',
                  }}
                  initial={{ x: 0, y: 0, z: 0, opacity: 1, scale: 0.6 }}
                  animate={{
                    x: shard.x,
                    y: shard.y,
                    z: shard.z,
                    rotateX: shard.rotateX,
                    rotateY: shard.rotateY,
                    rotateZ: shard.rotateZ,
                    opacity: 0,
                    scale: 1.1,
                  }}
                  transition={{
                    duration: 1.25,
                    ease: [0.16, 0.8, 0.3, 1],
                    delay: shard.delay,
                  }}
                />
              ))}
              {/* Secondary ice chips */}
              {CHIPS.map((chip, i) => (
                <motion.div
                  key={`chip-${i}`}
                  className="absolute rounded-full"
                  style={{
                    width: chip.size,
                    height: chip.size,
                    background: ICE_FACE,
                    boxShadow: '0 0 12px rgba(255,255,255,0.8)',
                  }}
                  initial={{ x: 0, y: 0, z: 0, opacity: 1 }}
                  animate={{
                    x: chip.x,
                    y: chip.y,
                    z: chip.z,
                    opacity: 0,
                    scale: 0.6,
                  }}
                  transition={{
                    duration: 0.9,
                    ease: 'easeOut',
                    delay: chip.delay,
                  }}
                />
              ))}
              {/* Fine ice dust */}
              {DUST.map((particle, i) => (
                <motion.div
                  key={`dust-${i}`}
                  className="absolute rounded-full"
                  style={{
                    width: particle.size,
                    height: particle.size,
                    background: 'rgba(255,255,255,0.9)',
                    boxShadow: '0 0 8px rgba(186,240,255,0.7)',
                  }}
                  initial={{ x: 0, y: 0, z: 0, opacity: 1 }}
                  animate={{
                    x: particle.x,
                    y: particle.y,
                    z: particle.z,
                    opacity: 0,
                    scale: 0.3,
                  }}
                  transition={{
                    duration: 1.1,
                    ease: 'easeOut',
                    delay: particle.delay,
                  }}
                />
              ))}
              {/* Lingering mist/fog */}
              {MIST.map((cloud, i) => (
                <motion.div
                  key={`mist-${i}`}
                  className="absolute rounded-full blur-xl"
                  style={{
                    width: cloud.size,
                    height: cloud.size,
                    background: 'radial-gradient(circle, rgba(186,240,255,0.4), transparent 70%)',
                  }}
                  initial={{ x: 0, y: 0, opacity: 0, scale: 0.5 }}
                  animate={{
                    x: cloud.x,
                    y: cloud.y,
                    opacity: [0, 0.6, 0],
                    scale: [0.5, 1.2, 1.5],
                  }}
                  transition={{
                    duration: 1.8,
                    ease: 'easeOut',
                    delay: cloud.delay,
                  }}
                />
              ))}
            </div>
          )}

          {/* Impact flash + frost sparks */}
          {phase === 'impact' && (
            <>
              {/* Multi-ring shockwave */}
              <motion.div
                initial={{ opacity: 0.9, scale: 0.25, borderWidth: 14 }}
                animate={{ opacity: 0, scale: 2.8, borderWidth: 0 }}
                transition={{ duration: 0.8, ease: 'easeOut' }}
                className="absolute h-96 w-96 rounded-full border-white/90"
                style={{ boxShadow: '0 0 50px rgba(255,255,255,0.7), 0 0 100px rgba(186,240,255,0.4)' }}
              />
              <motion.div
                initial={{ opacity: 0.7, scale: 0.35, borderWidth: 10 }}
                animate={{ opacity: 0, scale: 2.2, borderWidth: 0 }}
                transition={{ duration: 0.65, ease: 'easeOut', delay: 0.05 }}
                className="absolute h-80 w-80 rounded-full border-white/70"
                style={{ boxShadow: '0 0 35px rgba(255,255,255,0.5)' }}
              />
              <motion.div
                initial={{ opacity: 0.5, scale: 0.4, borderWidth: 8 }}
                animate={{ opacity: 0, scale: 1.8, borderWidth: 0 }}
                transition={{ duration: 0.5, ease: 'easeOut', delay: 0.1 }}
                className="absolute h-64 w-64 rounded-full border-white/50"
                style={{ boxShadow: '0 0 25px rgba(255,255,255,0.35)' }}
              />
              <motion.div
                initial={{ opacity: 0.95, scale: 0.2 }}
                animate={{ opacity: 0, scale: 2.8 }}
                transition={{ duration: 0.55, ease: 'easeOut' }}
                className="absolute h-60 w-60 rounded-full"
                style={{
                  background:
                    'radial-gradient(circle, rgba(255,255,255,1) 0%, rgba(186,230,253,0.75) 45%, transparent 70%)',
                }}
              />
              {SPARKS.map((spark, i) => (
                <motion.span
                  key={i}
                  initial={{ x: 0, y: 0, opacity: 1, scale: 1 }}
                  animate={{ x: spark.x, y: spark.y, opacity: 0, scale: 0.3 }}
                  transition={{ duration: 0.9, ease: 'easeOut', delay: spark.delay }}
                  className="absolute rounded-sm bg-white shadow-[0_0_18px_rgba(125,211,252,0.9)]"
                  style={{ width: spark.size, height: spark.size }}
                />
              ))}
            </>
          )}

          {/* Hammer — a real modelled mallet, pivoting at the base of the handle */}
          <AnimatePresence>
            {!broken && (
              <motion.div
                className="absolute"
                style={{
                  width: 60,
                  height: 300,
                  right: 20,
                  top: -20,
                  transformOrigin: '50% 96%',
                  transformStyle: 'preserve-3d',
                  filter: 'drop-shadow(0 24px 30px rgba(0,0,0,0.35))',
                }}
                initial={{ opacity: 0, rotateZ: 18, z: -220 }}
                animate={
                  phase === 'impact'
                    ? { opacity: 1, rotateZ: -98, rotateY: 0, z: 150 }
                    : {
                        opacity: 1,
                        rotateZ: [-28, -6, -28],
                        rotateY: [-18, -6, -18],
                        z: [40, 10, 40],
                      }
                }
                exit={{ opacity: 0, rotateZ: -120, transition: { duration: 0.2 } }}
                transition={
                  phase === 'impact'
                    ? { duration: 0.17, ease: 'easeIn' }
                    : {
                        duration: 1.1,
                        repeat: Infinity,
                        ease: 'easeInOut',
                        opacity: { duration: 0.5, repeat: 0 },
                      }
                }
                aria-hidden
              >
                {/* handle with wood grain */}
                <div
                  className="absolute bottom-0 left-1/2 w-[22px] -translate-x-1/2 rounded-full"
                  style={{
                    height: 232,
                    backgroundImage:
                      'linear-gradient(90deg,#5b3312 0%,#a4682f 26%,#e2b587 50%,#a4682f 74%,#5b3312 100%), repeating-linear-gradient(90deg, transparent, transparent 8px, rgba(0,0,0,0.06) 8px, rgba(0,0,0,0.06) 9px)',
                    boxShadow: 'inset 0 -20px 30px rgba(0,0,0,0.35)',
                  }}
                >
                  <div
                    className="absolute bottom-3 left-0 right-0 h-16 rounded-full"
                    style={{
                      backgroundImage:
                        'linear-gradient(90deg,#1f2937 0%,#4b5563 45%,#111827 100%)',
                      boxShadow: 'inset 0 0 12px rgba(0,0,0,0.6)',
                    }}
                  />
                </div>

                {/* steel head with wear marks */}
                <div
                  className="absolute left-1/2 top-0 h-[62px] w-[150px] -translate-x-1/2 rounded-[10px]"
                  style={{
                    backgroundImage:
                      'linear-gradient(180deg,#ffffff 0%,#dbe2ea 22%,#98a4b3 58%,#495867 88%,#2b3644 100%), repeating-linear-gradient(180deg, transparent, transparent 12px, rgba(0,0,0,0.04) 12px, rgba(0,0,0,0.04) 13px)',
                    boxShadow:
                      'inset 0 5px 10px rgba(255,255,255,0.95), inset 0 -10px 18px rgba(0,0,0,0.5), 0 16px 30px rgba(0,0,0,0.35)',
                  }}
                >
                  {/* striking face */}
                  <div
                    className="absolute inset-y-0 left-0 w-[26px] rounded-l-[10px]"
                    style={{
                      backgroundImage: 'linear-gradient(180deg,#f8fafc,#7c8896 70%,#3b4756)',
                      boxShadow: 'inset -6px 0 10px rgba(0,0,0,0.28)',
                    }}
                  />
                  {/* claw end */}
                  <div
                    className="absolute -right-4 top-1/2 h-[34px] w-[34px] -translate-y-1/2 rounded-r-[14px]"
                    style={{
                      backgroundImage: 'linear-gradient(180deg,#c8d2dd,#43505f)',
                      clipPath: 'polygon(0% 0%, 100% 22%, 100% 78%, 0% 100%)',
                    }}
                  />
                  {/* highlight band */}
                  <div
                    className="absolute left-8 right-8 top-2 h-[6px] rounded-full"
                    style={{ background: 'rgba(255,255,255,0.75)', filter: 'blur(1px)' }}
                  />
                  {/* Enhanced motion blur during swing */}
                  {phase === 'impact' && (
                    <>
                      <div
                        className="absolute inset-0 rounded-[10px]"
                        style={{
                          background:
                            'linear-gradient(90deg, transparent 20%, rgba(255,255,255,0.5) 45%, rgba(255,255,255,0.7) 50%, rgba(255,255,255,0.5) 55%, transparent 80%)',
                          filter: 'blur(4px)',
                        }}
                      />
                      <div
                        className="absolute inset-0 rounded-[10px]"
                        style={{
                          background:
                            'linear-gradient(90deg, transparent 25%, rgba(186,240,255,0.4) 50%, transparent 75%)',
                          filter: 'blur(6px)',
                        }}
                      />
                    </>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Captions */}
        <div className="mt-14 flex h-24 items-center justify-center">
          <AnimatePresence mode="wait">
            {phase === 'reveal' ? (
              <motion.div
                key="reveal"
                initial={{ opacity: 0, scale: 0.7, y: 30, rotateX: 75 }}
                animate={{ opacity: 1, scale: 1, y: 0, rotateX: 0 }}
                exit={{ opacity: 0, scale: 1.12, rotateX: -35 }}
                transition={{ type: 'spring', stiffness: 240, damping: 15 }}
                style={{ transformPerspective: 900 }}
                className="text-center font-display text-4xl font-extrabold uppercase tracking-tight text-slate-900 md:text-6xl 3xl:text-7xl"
              >
                Ice broken. Let’s go! 🎉
              </motion.div>
            ) : (
              <motion.div
                key="pre"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="text-center font-display text-2xl font-extrabold uppercase tracking-[0.3em] text-slate-900/70 md:text-4xl"
              >
                Breaking the ice
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>

      <p className="absolute bottom-8 font-body text-[11px] uppercase tracking-[0.28em] text-slate-900/35">
        Click or press Space to skip
      </p>
    </div>
  )
}
