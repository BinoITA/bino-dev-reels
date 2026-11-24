// © 2026 BinoITA (bino.dev, @bino.devs) — CC BY 4.0: se lo riusi, cita "@bino.devs — github.com/BinoITA/bino-dev-reels"
// Il mondo 3D del reel 04, fatto solo con le forme base di Three.js (niente Blender, niente modelli scaricati):
// - Bino, robottino-TV: testa = cubo arrotondato, corpo = cilindro, lampadina = sfera;
// - "La piazzetta di Bino": un isolato-diorama su una zolla, con palazzi (cubi), alberi (coni), fontana, panchina, lampione, auto.
// Ogni pezzo ha una direzione di "esploso": con esploso > 0 la scena si smonta nelle sue forme.
import React, { useMemo } from "react";
import * as THREE from "three";
import { RoundedBoxGeometry } from "three/examples/jsm/geometries/RoundedBoxGeometry.js";

export const COLORI = {
  carta: "#F2EEE3",
  cartaScura: "#E3DCC8",
  strada: "#45434A",
  riga: "#F7F3E8",
  verde: "#3FE08F",
  verdeScuro: "#1FA864",
  giallo: "#FFD93D",
  rosso: "#FF5A4E",
  nero: "#1B1A1F",
  crema: "#FFF6E0",
  azzurro: "#8FD3FF",
  rosa: "#FFB8C6",
  marrone: "#8A5A3C",
  bianco: "#FFFDF7",
  luce: "#FFF1C9",
};

type Vec = [number, number, number];

// ---------------------------------------------------------------- materiali e geometrie condivise

const Opaco: React.FC<{ readonly colore: string; readonly ruvido?: number }> = ({ colore, ruvido = 0.75 }) => (
  <meshStandardMaterial color={colore} roughness={ruvido} metalness={0} />
);
const Luminoso: React.FC<{ readonly colore: string; readonly forza?: number }> = ({ colore, forza = 1 }) => (
  <meshStandardMaterial color={colore} emissive={colore} emissiveIntensity={forza} roughness={0.4} toneMapped={false} />
);

const useCuboTondo = (w: number, h: number, d: number, r: number) =>
  useMemo(() => new RoundedBoxGeometry(w, h, d, 4, r), [w, h, d, r]);

/** Contorno da fumetto per l'eroe: la stessa forma, un po' più grande, vista dall'interno, in nero. */
const Contorno: React.FC<{ readonly geometria: THREE.BufferGeometry; readonly spessore?: number }> = ({ geometria, spessore = 1.05 }) => (
  <mesh geometry={geometria} scale={spessore}>
    <meshBasicMaterial color={COLORI.nero} side={THREE.BackSide} />
  </mesh>
);

/** Gruppo che si sposta lungo "via" quando la scena è esplosa (k 0..1), con un po' di rotazione e galleggiamento. */
const Pezzo: React.FC<{
  readonly pos?: Vec;
  readonly via?: Vec;
  readonly k?: number;
  readonly giro?: number;
  readonly children: React.ReactNode;
}> = ({ pos = [0, 0, 0], via = [0, 0, 0], k = 0, giro = 0, children }) => (
  <group position={[pos[0] + via[0] * k, pos[1] + via[1] * k, pos[2] + via[2] * k]} rotation={[giro * k * 0.3, giro * k, giro * k * 0.2]}>
    {children}
  </group>
);

// ---------------------------------------------------------------- Bino

export type PosaBino = {
  /** spostamento del corpo intero */
  y?: number;
  scala?: { x: number; y: number; z: number };
  rollio?: number;
  avanti?: number;
  girata?: number;
  /** braccia: rotazione in avanti (x) e laterale (z, positiva = alza) */
  braccioSx?: [number, number];
  braccioDx?: [number, number];
  gambaSx?: number;
  gambaDx?: number;
  alzaSx?: number;
  alzaDx?: number;
  testa?: number;
  antenna?: number;
  /** 0 neutro, 1 felice, 2 sospettoso (si può sfumare tra 0 e 1, 0 e 2) */
  felice?: number;
  sospetto?: number;
  ciglia?: number;
  bocca?: number;
  lampadina?: number;
  /** esploso dei pezzi di Bino (0..1) */
  k?: number;
};

export const Bino: React.FC<{ readonly posa: PosaBino }> = ({ posa }) => {
  const {
    y = 0,
    scala = { x: 1, y: 1, z: 1 },
    rollio = 0,
    avanti = 0,
    girata = 0,
    braccioSx = [0, 0],
    braccioDx = [0, 0],
    gambaSx = 0,
    gambaDx = 0,
    alzaSx = 0,
    alzaDx = 0,
    testa = 0,
    antenna = 0,
    felice = 0,
    sospetto = 0,
    ciglia = 1,
    bocca = 0,
    lampadina = 0.4,
    k = 0,
  } = posa;
  const gTesta = useCuboTondo(1.3, 1.0, 1.0, 0.2);
  const gSchermo = useCuboTondo(1.04, 0.74, 0.1, 0.08);
  const gScarpa = useCuboTondo(0.3, 0.16, 0.4, 0.07);
  const gCorpo = useMemo(() => new THREE.CylinderGeometry(0.36, 0.42, 0.62, 28), []);
  const gBraccio = useMemo(() => new THREE.CapsuleGeometry(0.085, 0.36, 4, 12), []);
  const gGamba = useMemo(() => new THREE.CapsuleGeometry(0.11, 0.22, 4, 12), []);
  const gMano = useMemo(() => new THREE.SphereGeometry(0.13, 20, 14), []);
  const gBulbo = useMemo(() => new THREE.SphereGeometry(0.15, 24, 16), []);
  const occhio = Math.max(0.08, ciglia);
  const occhioDx = occhio * (1 - 0.5 * sospetto);
  // occhi felici "^ ^": archi che compaiono quando felice > 0.5
  const archi = felice > 0.5;
  return (
    <group position={[0, y, 0]} rotation={[avanti, girata, rollio]} scale={[scala.x, scala.y, scala.z]}>
      {/* gambe */}
      {(
        [
          [-1, gambaSx, alzaSx],
          [1, gambaDx, alzaDx],
        ] as const
      ).map(([lato, oscilla, alza]) => (
        <Pezzo key={`g${lato}`} pos={[lato * 0.19, 0.42 + alza, 0]} via={[lato * 0.9, 0.05, 0.9]} k={k} giro={lato * 0.6}>
          <group rotation={[oscilla, 0, 0]}>
            <mesh geometry={gGamba} position={[0, -0.16, 0]} castShadow>
              <Opaco colore={COLORI.nero} />
            </mesh>
            <mesh geometry={gScarpa} position={[0, -0.37, 0.06]} castShadow>
              <Opaco colore={COLORI.verde} />
            </mesh>
          </group>
        </Pezzo>
      ))}
      {/* corpo: un cilindro giallo */}
      <Pezzo pos={[0, 0.78, 0]} via={[0, 0.35, 0.9]} k={k} giro={0.4}>
        <mesh geometry={gCorpo} castShadow>
          <Opaco colore={COLORI.giallo} ruvido={0.6} />
        </mesh>
        <Contorno geometria={gCorpo} spessore={1.04} />
        {/* placchetta sul petto */}
        <mesh position={[0, 0.02, 0.4]} rotation={[-0.1, 0, 0]}>
          <boxGeometry args={[0.32, 0.14, 0.03]} />
          <Opaco colore={COLORI.nero} />
        </mesh>
        <mesh position={[-0.06, 0.02, 0.418]} rotation={[-0.1, 0, 0]}>
          <boxGeometry args={[0.08, 0.05, 0.01]} />
          <Luminoso colore={COLORI.verde} forza={0.8} />
        </mesh>
        <mesh position={[0.07, 0.02, 0.418]} rotation={[-0.1, 0, 0]}>
          <boxGeometry args={[0.08, 0.05, 0.01]} />
          <Luminoso colore={COLORI.crema} forza={0.5} />
        </mesh>
      </Pezzo>
      {/* braccia */}
      {(
        [
          [-1, braccioSx],
          [1, braccioDx],
        ] as const
      ).map(([lato, [fx, fz]]) => (
        <Pezzo key={`b${lato}`} pos={[lato * 0.42, 0.98, 0]} via={[lato * 1.5, 0.5, 0.7]} k={k} giro={lato}>
          <group rotation={[fx, 0, lato * (0.25 + fz)]}>
            <mesh geometry={gBraccio} position={[0, -0.24, 0]} castShadow>
              <Opaco colore={COLORI.nero} />
            </mesh>
            <mesh geometry={gMano} position={[0, -0.5, 0]} castShadow>
              <Opaco colore={COLORI.verde} />
            </mesh>
          </group>
        </Pezzo>
      ))}
      {/* testa: un cubo arrotondato verde con lo schermo */}
      <Pezzo pos={[0, 1.58, 0]} via={[0, 1.2, 0.8]} k={k} giro={-0.5}>
        <group rotation={[testa * 0.5, testa, testa * 0.3]}>
          <mesh geometry={gTesta} castShadow>
            <Opaco colore={COLORI.verde} ruvido={0.55} />
          </mesh>
          <Contorno geometria={gTesta} spessore={1.035} />
          <mesh geometry={gSchermo} position={[0, -0.02, 0.47]}>
            <meshStandardMaterial color={COLORI.nero} roughness={0.25} metalness={0.1} />
          </mesh>
          {/* faccia sullo schermo */}
          <group position={[0, -0.02, 0.53]}>
            {archi ? (
              [-0.22, 0.22].map((x) => (
                <mesh key={x} position={[x, 0.05, 0]} rotation={[0, 0, 0]}>
                  <torusGeometry args={[0.1, 0.03, 8, 20, Math.PI]} />
                  <Luminoso colore={COLORI.crema} forza={1.1} />
                </mesh>
              ))
            ) : (
              <>
                <mesh position={[-0.22, 0.05, 0]} scale={[1, occhio, 1]}>
                  <capsuleGeometry args={[0.06, 0.14, 4, 12]} />
                  <Luminoso colore={COLORI.crema} forza={1.1} />
                </mesh>
                <mesh position={[0.22, 0.05 - (1 - occhioDx / Math.max(occhio, 0.01)) * 0.05, 0]} scale={[1, occhioDx, 1]}>
                  <capsuleGeometry args={[0.06, 0.14, 4, 12]} />
                  <Luminoso colore={COLORI.crema} forza={1.1} />
                </mesh>
              </>
            )}
            {/* sopracciglio sospettoso */}
            {sospetto > 0.01 ? (
              <mesh position={[0.22, 0.24 - 0.06 * sospetto, 0]} rotation={[0, 0, 0.22 * sospetto]} scale={[sospetto, 1, 1]}>
                <boxGeometry args={[0.2, 0.035, 0.01]} />
                <Luminoso colore={COLORI.crema} forza={1.1} />
              </mesh>
            ) : null}
            {/* bocca: arco (sorriso) che si allarga con felice, o si apre parlando */}
            <mesh position={[0, -0.15, 0]} rotation={[0, 0, Math.PI + sospetto * 0.12]} scale={[1 + felice * 0.5, 1 + bocca * 1.4, 1]}>
              <torusGeometry args={[0.09, 0.025, 8, 20, Math.PI]} />
              <Luminoso colore={COLORI.crema} forza={1.1} />
            </mesh>
            {/* guance */}
            {[-0.38, 0.38].map((x) => (
              <mesh key={x} position={[x, -0.12, 0]}>
                <circleGeometry args={[0.055, 16]} />
                <Luminoso colore={COLORI.rosso} forza={0.35 + felice * 0.5} />
              </mesh>
            ))}
          </group>
          {/* lampadina-antenna: stelo (cilindro) + bulbo (sfera) */}
          <Pezzo pos={[0, 0.5, 0]} via={[0, 0.8, 0.3]} k={k} giro={0.8}>
            <group rotation={[antenna * 0.6, 0, antenna]}>
              <mesh position={[0, 0.14, 0]}>
                <cylinderGeometry args={[0.03, 0.03, 0.28, 10]} />
                <Opaco colore={COLORI.nero} />
              </mesh>
              <mesh geometry={gBulbo} position={[0, 0.36, 0]}>
                <Luminoso colore={COLORI.giallo} forza={0.35 + lampadina * 1.1} />
              </mesh>
              <Contorno geometria={gBulbo} spessore={1.12} />
            </group>
          </Pezzo>
        </group>
      </Pezzo>
      {/* ombra morbida finta sotto i piedi */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.012 - y, 0]} scale={[1 - y * 0.4, 1 - y * 0.4, 1]}>
        <circleGeometry args={[0.6, 32]} />
        <meshBasicMaterial color="#000000" transparent opacity={0.16} depthWrite={false} />
      </mesh>
    </group>
  );
};

// ---------------------------------------------------------------- la piazzetta

const Palazzo: React.FC<{
  readonly pos: Vec;
  readonly dim: Vec;
  readonly colore: string;
  readonly k: number;
  readonly via: Vec;
  readonly tenda?: boolean;
}> = ({ pos, dim, colore, k, via, tenda = false }) => {
  const [w, h, d] = dim;
  const g = useCuboTondo(w, h, d, 0.08);
  const piani = Math.max(1, Math.floor((h - 0.4) / 0.95));
  return (
    <Pezzo pos={pos} via={via} k={k} giro={via[0] > 0 ? 0.4 : -0.4}>
      <mesh geometry={g} position={[0, h / 2, 0]} castShadow receiveShadow>
        <Opaco colore={colore} />
      </mesh>
      <mesh position={[0, h + 0.06, 0]} castShadow>
        <boxGeometry args={[w + 0.12, 0.14, d + 0.12]} />
        <Opaco colore={COLORI.nero} />
      </mesh>
      {new Array(piani).fill(0).map((_, p) =>
        [-0.26, 0.26].map((x) => (
          <group key={`${p}${x}`} position={[x * w, 0.75 + p * 0.95 + (tenda ? 0.5 : 0), d / 2 + 0.01]}>
            <mesh>
              <boxGeometry args={[w * 0.26, 0.42, 0.04]} />
              <Opaco colore={COLORI.nero} />
            </mesh>
            <mesh position={[0, 0, 0.02]}>
              <boxGeometry args={[w * 0.22, 0.36, 0.02]} />
              <Luminoso colore={COLORI.azzurro} forza={0.18} />
            </mesh>
          </group>
        )),
      ).filter((_, p) => !tenda || p < piani - 1)}
      {tenda ? (
        <group position={[0, 1.05, d / 2 + 0.2]}>
          {new Array(6).fill(0).map((_, i) => (
            <mesh key={i} position={[-w / 2 + (w / 6) * (i + 0.5), 0, 0]} rotation={[0.5, 0, 0]} castShadow>
              <boxGeometry args={[w / 6, 0.06, 0.5]} />
              <Opaco colore={i % 2 ? COLORI.bianco : COLORI.rosso} />
            </mesh>
          ))}
          <mesh position={[0, -0.55, -0.18]}>
            <boxGeometry args={[w * 0.5, 0.7, 0.04]} />
            <Luminoso colore={COLORI.luce} forza={0.25} />
          </mesh>
        </group>
      ) : null}
    </Pezzo>
  );
};

const Albero: React.FC<{ readonly pos: Vec; readonly k: number; readonly via: Vec; readonly s?: number }> = ({ pos, k, via, s = 1 }) => (
  <Pezzo pos={pos} via={via} k={k} giro={0.7}>
    <group scale={s}>
      <mesh position={[0, 0.3, 0]} castShadow>
        <cylinderGeometry args={[0.08, 0.1, 0.6, 10]} />
        <Opaco colore={COLORI.marrone} />
      </mesh>
      <mesh position={[0, 0.9, 0]} castShadow>
        <coneGeometry args={[0.5, 0.9, 20]} />
        <Opaco colore={COLORI.verdeScuro} />
      </mesh>
      <mesh position={[0, 1.35, 0]} castShadow>
        <coneGeometry args={[0.38, 0.75, 20]} />
        <Opaco colore={COLORI.verde} />
      </mesh>
    </group>
  </Pezzo>
);

const Panchina: React.FC<{ readonly pos: Vec; readonly k: number }> = ({ pos, k }) => (
  <Pezzo pos={pos} via={[0.8, 1.6, 0.5]} k={k} giro={0.5}>
    <mesh position={[0, 0.32, 0]} castShadow>
      <boxGeometry args={[1.1, 0.08, 0.36]} />
      <Opaco colore={COLORI.marrone} />
    </mesh>
    <mesh position={[0, 0.55, -0.16]} castShadow>
      <boxGeometry args={[1.1, 0.28, 0.06]} />
      <Opaco colore={COLORI.marrone} />
    </mesh>
    {[-0.45, 0.45].map((x) => (
      <mesh key={x} position={[x, 0.16, 0]} castShadow>
        <boxGeometry args={[0.07, 0.32, 0.3]} />
        <Opaco colore={COLORI.nero} />
      </mesh>
    ))}
  </Pezzo>
);

const Lampione: React.FC<{ readonly pos: Vec; readonly k: number }> = ({ pos, k }) => (
  <Pezzo pos={pos} via={[-0.8, 2.2, 0.4]} k={k} giro={-0.6}>
    <mesh position={[0, 1, 0]} castShadow>
      <cylinderGeometry args={[0.05, 0.07, 2, 10]} />
      <Opaco colore={COLORI.nero} />
    </mesh>
    <mesh position={[0, 2.08, 0]}>
      <sphereGeometry args={[0.17, 20, 14]} />
      <Luminoso colore={COLORI.luce} forza={0.9} />
    </mesh>
  </Pezzo>
);

const Fontana: React.FC<{ readonly pos: Vec; readonly k: number; readonly f: number }> = ({ pos, k, f }) => (
  <Pezzo pos={pos} via={[-0.6, 1.4, -0.4]} k={k} giro={-0.4}>
    <mesh position={[0, 0.16, 0]} castShadow receiveShadow>
      <cylinderGeometry args={[0.85, 0.9, 0.32, 32]} />
      <Opaco colore={COLORI.crema} />
    </mesh>
    <mesh position={[0, 0.33, 0]} rotation={[-Math.PI / 2, 0, 0]}>
      <circleGeometry args={[0.72, 32]} />
      <meshStandardMaterial color={COLORI.azzurro} roughness={0.15} metalness={0.1} />
    </mesh>
    <mesh position={[0, 0.33, 0]} rotation={[Math.PI / 2, 0, 0]}>
      <torusGeometry args={[0.85, 0.06, 10, 36]} />
      <Opaco colore={COLORI.bianco} />
    </mesh>
    <mesh position={[0, 0.65, 0]}>
      <cylinderGeometry args={[0.08, 0.12, 0.65, 12]} />
      <Opaco colore={COLORI.crema} />
    </mesh>
    <mesh position={[0, 1.02 + Math.sin(f / 6) * 0.03, 0]}>
      <sphereGeometry args={[0.12, 16, 12]} />
      <meshStandardMaterial color={COLORI.azzurro} roughness={0.1} transparent opacity={0.85} />
    </mesh>
  </Pezzo>
);

const Auto: React.FC<{ readonly x: number; readonly z: number; readonly f: number; readonly k: number }> = ({ x, z, f, k }) => {
  const gScocca = useCuboTondo(1.2, 0.42, 0.66, 0.14);
  const gTetto = useCuboTondo(0.66, 0.34, 0.6, 0.12);
  const sobbalzo = Math.abs(Math.sin(f / 3)) * 0.02;
  return (
    <Pezzo pos={[x, 0, z]} via={[0, 1.8, 0.6]} k={k} giro={0.5}>
      <group position={[0, sobbalzo, 0]}>
        <mesh geometry={gScocca} position={[0, 0.38, 0]} castShadow>
          <Opaco colore={COLORI.rosso} ruvido={0.4} />
        </mesh>
        <mesh geometry={gTetto} position={[-0.08, 0.72, 0]} castShadow>
          <Opaco colore={COLORI.bianco} ruvido={0.4} />
        </mesh>
        {[-0.38, 0.38].map((wx) =>
          [-0.34, 0.34].map((wz) => (
            <mesh key={`${wx}${wz}`} position={[wx, 0.17, wz]} rotation={[Math.PI / 2, 0, 0]} castShadow>
              <cylinderGeometry args={[0.15, 0.15, 0.1, 16]} />
              <Opaco colore={COLORI.nero} />
            </mesh>
          )),
        )}
      </group>
    </Pezzo>
  );
};

/** Posizioni utili per telecamera ed etichette. */
export const PUNTI = {
  bino: [0.6, 0, 0.9] as Vec,
  palazzo: [-1.6, 0, -4.2] as Vec,
  albero: [3.8, 0, 0.2] as Vec,
};

const PALAZZI: { pos: Vec; dim: Vec; colore: string; tenda?: boolean }[] = [
  { pos: [-4.3, 0, -4.3], dim: [2.1, 3.0, 2.2], colore: COLORI.azzurro },
  { pos: [-1.6, 0, -4.2], dim: [2.3, 4.8, 2.4], colore: COLORI.crema },
  { pos: [1.1, 0, -4.3], dim: [2.2, 2.6, 2.2], colore: COLORI.giallo, tenda: true },
  { pos: [4.0, 0, -4.2], dim: [2.2, 3.7, 2.4], colore: COLORI.rosa },
  { pos: [4.6, 0, -1.3], dim: [1.6, 2.4, 1.8], colore: COLORI.bianco },
];

/** L'isolato-diorama: zolla, strada davanti, piazza, palazzi, alberi e arredi. f = frame, k = esploso (0..1). */
export const Piazzetta: React.FC<{ readonly f: number; readonly k?: number; readonly autoX?: number }> = ({ f, k = 0, autoX = 99 }) => {
  const gZolla = useCuboTondo(12, 1, 12, 0.2);
  return (
    <group>
      {/* zolla del diorama */}
      <mesh geometry={gZolla} position={[0, -0.5, 0]} receiveShadow>
        <Opaco colore={COLORI.cartaScura} />
      </mesh>
      <mesh position={[0, -0.62, 0]}>
        <boxGeometry args={[12.04, 0.5, 12.04]} />
        <Opaco colore={COLORI.nero} />
      </mesh>
      {/* piazza chiara */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.005, -0.6]} receiveShadow>
        <planeGeometry args={[11.6, 8.4]} />
        <Opaco colore={COLORI.carta} />
      </mesh>
      {/* strada davanti con le righe */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.01, 4.4]} receiveShadow>
        <planeGeometry args={[11.6, 2.2]} />
        <Opaco colore={COLORI.strada} ruvido={0.9} />
      </mesh>
      {new Array(7).fill(0).map((_, i) => (
        <mesh key={i} rotation={[-Math.PI / 2, 0, 0]} position={[-5 + i * 1.7, 0.02, 4.4]}>
          <planeGeometry args={[0.8, 0.12]} />
          <Opaco colore={COLORI.riga} />
        </mesh>
      ))}
      {/* cordolo */}
      <mesh position={[0, 0.06, 3.27]} receiveShadow castShadow>
        <boxGeometry args={[11.6, 0.12, 0.14]} />
        <Opaco colore={COLORI.bianco} />
      </mesh>
      {PALAZZI.map((p, i) => (
        <Palazzo key={i} pos={p.pos} dim={p.dim} colore={p.colore} tenda={p.tenda} k={k} via={[p.pos[0] * 0.35, 2.6 + (i % 3) * 0.8, 0]} />
      ))}
      <Albero pos={[-4.6, 0, 0.4]} k={k} via={[-1.2, 2.4, 0]} />
      <Albero pos={[-4.0, 0, 2.3]} k={k} via={[-1, 2, 0.4]} s={0.85} />
      <Albero pos={[3.8, 0, 0.2]} k={k} via={[1.2, 2.6, 0]} />
      <Albero pos={[4.7, 0, 2.2]} k={k} via={[1, 2, 0.5]} s={0.8} />
      {[
        [-2.8, 2.6],
        [2.6, 2.7],
      ].map(([x, z]) => (
        <Pezzo key={x} pos={[x, 0, z]} via={[x * 0.2, 1.8, 0.3]} k={k}>
          <mesh position={[0, 0.28, 0]} castShadow>
            <sphereGeometry args={[0.34, 20, 14]} />
            <Opaco colore={COLORI.verdeScuro} />
          </mesh>
        </Pezzo>
      ))}
      <Fontana pos={[-2.0, 0, -0.9]} k={k} f={f} />
      <Panchina pos={[2.4, 0, -1.6]} k={k} />
      <Lampione pos={[-3.3, 0, 2.9]} k={k} />
      <Lampione pos={[3.4, 0, 2.9]} k={k} />
      <Auto x={autoX} z={4.4} f={f} k={k} />
    </group>
  );
};

/** Luci "diorama al tramonto": sole caldo con ombre morbide, luce fredda di contorno, cielo/terra. */
export const Luci: React.FC = () => (
  <>
    <hemisphereLight args={["#DCEBFF", "#E8C9A8", 0.9]} />
    <directionalLight
      position={[-7, 11, 9]}
      intensity={2.6}
      color="#FFE6BF"
      castShadow
      shadow-mapSize-width={2048}
      shadow-mapSize-height={2048}
      shadow-bias={-0.0004}
      shadow-normalBias={0.03}
      shadow-camera-left={-9}
      shadow-camera-right={9}
      shadow-camera-top={9}
      shadow-camera-bottom={-9}
      shadow-camera-near={1}
      shadow-camera-far={40}
    />
    <directionalLight position={[8, 5, -8]} intensity={0.9} color="#A9CFFF" />
  </>
);
