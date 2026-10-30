'use client';

import { useMemo, useState } from 'react';
import {
  Atom,
  ExternalLink,
  Eye,
  Gauge,
  GraduationCap,
  Magnet,
  Radiation,
  Search,
  Thermometer,
  Waves,
  Weight,
  Zap,
  type LucideIcon,
} from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

type Simulation = {
  title: string;
  slug: string;
  description: string;
  category: string;
  alsoIn?: string[];
  tags: string[];
  accent: string;
  preview?: string;
};

const buyMeACoffeeEmbed = `<!doctype html>
<html lang="en">
  <head><meta charset="utf-8"></head>
  <body style="margin:0;overflow:hidden;background:transparent">
    <script type="text/javascript" src="https://cdnjs.buymeacoffee.com/1.0.0/button.prod.min.js" data-name="bmc-button" data-slug="awmPhysics" data-color="#FFDD00" data-emoji="" data-font="Lato" data-text="Buy me a coffee" data-outline-color="#000000" data-font-color="#000000" data-coffee-color="#ffffff"></script>
  </body>
</html>`;

// One icon per category, so every card in a topic shares the same symbol.
const categoryIcons: Record<string, LucideIcon> = {
  Electricity: Zap,
  Energy: Gauge,
  Forces: Weight,
  Magnetism: Magnet,
  Nuclear: Radiation,
  Optics: Eye,
  Thermal: Thermometer,
  Waves: Waves,
  'A Level': GraduationCap,
};

const searchAliases: Record<string, string> = {
  'terminal-velocity': 'terminal velocity',
  pulleys: 'terminal velocity',
};

const normaliseSearchTerm = (value: string) =>
  value.toLowerCase().replace(/[-_]/g, ' ').replace(/\s+/g, ' ').trim();

const simulations: Simulation[] = [
  {
    title: 'Wave Interference Explorer',
    slug: 'wave-interference-explorer',
    description:
      'Explore double slits, diffraction gratings, Huygens’ wavelets and standing waves.',
    category: 'Waves',
    alsoIn: ['A Level'],
    tags: ['interference', 'diffraction', 'wavelets', 'standing waves'],
    accent: '#55d6e8',
  },
  {
    title: 'Gravitational Fields',
    slug: 'gravity-fields',
    description:
      'Visualise how mass creates gravitational fields and how field strength changes with distance.',
    category: 'Forces',
    alsoIn: ['A Level'],
    tags: ['gravity', 'field strength', 'mass', 'orbits', 'terminal velocity'],
    accent: '#7cd0ff',
  },
  {
    title: 'Pulleys',
    slug: 'pulleys',
    description:
      'Lift a load with 1–4 pulleys, compare effort and distance, and explore how mechanical advantage changes the force needed.',
    category: 'Forces',
    tags: ['pulleys', 'force', 'work', 'mechanical advantage'],
    accent: '#62caa0',
    preview: '/previews/pulleys.webp',
  },
  {
    title: 'Energy Rider',
    slug: 'energy-rider',
    description:
      'Draw a track, send Bob down it, and compare gravitational potential energy and kinetic energy frame by frame.',
    category: 'Energy',
    tags: ['gravitational potential energy', 'kinetic energy', 'line rider', 'energy transfer'],
    accent: '#9ec8ff',
    preview: '/previews/energy-rider.webp',
  },
  {
    title: 'Terminal Velocity',
    slug: 'terminal-velocity',
    description:
      'See a skydiver accelerate, reach terminal velocity, and slow safely after opening a parachute.',
    category: 'Forces',
    tags: ['terminal velocity', 'drag', 'air resistance', 'parachute'],
    accent: '#7aa9ff',
    preview: '/previews/terminal-velocity.webp',
  },
  {
    title: 'Reflection and Refraction',
    slug: 'plane-wave-refraction',
    description:
      'Compare wave reflection at a surface with refraction as waves enter a medium at a different speed.',
    category: 'Waves',
    tags: ['reflection', 'refraction', 'wave speed', 'boundaries'],
    accent: '#e47b59',
    preview: '/previews/plane-wave-refraction.svg',
  },
  {
    title: 'Nuclear Reactor',
    slug: 'nuclear-reactor',
    description:
      'Control rods, neutron capture and chain reactions in a live U-235 reactor sandbox.',
    category: 'Nuclear',
    tags: ['fission', 'chain reaction', 'control rods', 'neutrons'],
    accent: '#b89cff',
  },
  {
    title: 'Solenoid',
    slug: 'solenoid',
    description:
      'Watch a straight wire form a coil, then explore the magnetic field produced by a solenoid in 3D.',
    category: 'Magnetism',
    tags: ['magnetic fields', 'current', 'coil', 'electromagnetism'],
    accent: '#4a9b83',
  },
  {
    title: 'Electricity Overlap',
    slug: 'electricity-overlap',
    description:
      'Build circuits at particle level and watch current, resistance and potential difference emerge.',
    category: 'Electricity',
    tags: ['circuits', 'electrons', 'resistance', 'potential difference'],
    accent: '#ffca5f',
  },
  {
    title: 'Ultrasound',
    slug: 'ultrasound',
    description:
      'Investigate pulse-echo imaging, reflections and how distance is inferred from time of flight.',
    category: 'Waves',
    tags: ['ultrasound', 'echoes', 'imaging', 'time of flight'],
    accent: '#61d7b5',
  },
  {
    title: 'Filament Lamp I–V Curve',
    slug: 'filament-lamp-IV-curve',
    description:
      'See how heating the filament produces the lamp’s distinctive non-linear I–V characteristic.',
    category: 'Electricity',
    tags: ['current', 'voltage', 'resistance', 'filament lamp'],
    accent: '#ff8e69',
  },
  {
    title: 'Circuit Sketcher',
    slug: 'circuit-sketcher',
    description:
      'Sketch clean circuit diagrams quickly with familiar components and connections.',
    category: 'Electricity',
    tags: ['circuits', 'diagrams', 'components', 'sketching'],
    accent: '#69a7ff',
  },
  {
    title: 'Pinhole Camera',
    slug: 'pinhole-camera',
    description:
      'Move the object, aperture and screen to explore image inversion, size and sharpness.',
    category: 'Optics',
    tags: ['light', 'images', 'rays', 'pinhole'],
    accent: '#f39ac7',
  },
  {
    title: 'Why does salt make ice colder?',
    slug: 'ice-latent-heat',
    description:
      'Explore how salt lowers ice’s melting point and how melting and freezing transfer latent heat.',
    category: 'Thermal',
    alsoIn: ['Energy'],
    tags: ['salt', 'ice', 'latent heat', 'phase change'],
    accent: '#7fc9e8',
  },
  {
    title: 'Electromagnetic Devices',
    slug: 'uses-of-electromagnets',
    description:
      'Explore how electromagnets power devices such as relays, speakers and electric motors.',
    category: 'Magnetism',
    alsoIn: ['Electricity'],
    tags: ['electromagnets', 'motors', 'relays', 'speakers'],
    accent: '#d49a68',
  },
  {
    title: 'LDRs and Thermistors',
    slug: 'ldr-thermistor',
    description:
      'Change the light level or temperature in a potential divider and watch the resistance and the voltmeter reading respond.',
    category: 'Electricity',
    tags: ['LDR', 'thermistor', 'potential divider', 'resistance'],
    accent: '#e8d66a',
  },
  {
    title: 'Van de Graaff Generator',
    slug: 'van-de-graaff',
    description:
      'Charge the dome with the belt, draw sparks to an earthed sphere and make a person’s hair stand on end.',
    category: 'Electricity',
    tags: ['static electricity', 'charge', 'sparks', 'earthing'],
    accent: '#9fb4ff',
  },
  {
    title: 'The Flame Probe',
    slug: 'flame-probe',
    description:
      'Map electric potential between parallel plates, around a candle and near a charged sphere with an ionising flame probe.',
    category: 'Electricity',
    alsoIn: ['A Level'],
    tags: ['electric potential', 'equipotentials', 'field strength', 'parallel plates'],
    accent: '#ff9f6e',
  },
  {
    title: 'Thermal Conduction in Metals',
    slug: 'thermal-conduction',
    description:
      'Heat one end of a metal bar and watch vibrating ions and free electrons carry the energy along to the cold end.',
    category: 'Thermal',
    alsoIn: ['Energy'],
    tags: ['conduction', 'free electrons', 'lattice vibrations', 'temperature gradient'],
    accent: '#f0a35e',
  },
  {
    title: 'Sound Waves and the Bell Jar',
    slug: 'bell-jar',
    description:
      'See how a vibrating loudspeaker makes a sound wave in air, then pump the air out of a bell jar and watch the sound fade away.',
    category: 'Waves',
    tags: ['sound', 'compression and rarefaction', 'vacuum', 'medium'],
    accent: '#7fc9e8',
  },
  {
    title: "Newton's Laws of Motion",
    slug: 'newtons-laws',
    description:
      'Fly a spaceship with thrusters to explore inertia, F = ma and force pairs, then take on docking and formation challenges.',
    category: 'Forces',
    tags: ['inertia', 'resultant force', 'F = ma', 'action and reaction'],
    accent: '#f2b34a',
  },
  {
    title: 'Video Tracker',
    slug: 'video-tracker',
    description:
      'Film an experiment, set the scale and click the object in each frame to plot position, velocity and acceleration graphs with best-fit lines.',
    category: 'Forces',
    alsoIn: ['A Level'],
    tags: ['video analysis', 'motion graphs', 'practical', 'data logging'],
    accent: '#5fb3d9',
  },
  {
    title: 'TEMPORA Escape Room',
    slug: 'escape-room/resources',
    description:
      'A 40-minute physics escape room: crews time a pendulum to test the gravity and use a red filter to restart the engines. Teacher guide, set-up and printables.',
    category: 'Forces',
    alsoIn: ['Optics'],
    tags: ['escape room', 'pendulum', 'colour filters', 'group activity'],
    accent: '#5ee27a',
    preview: '/previews/escape-room.webp',
  },
];

const categories = [
  'All',
  ...Array.from(
    new Set(simulations.flatMap((item) => [item.category, ...(item.alsoIn ?? [])])),
  ),
];

export default function Home() {
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState('All');

  const visibleSimulations = useMemo(() => {
    const term = normaliseSearchTerm(query);

    return simulations.filter((simulation) => {
      const matchesCategory =
          category === 'All' ||
          simulation.category === category ||
          simulation.alsoIn?.includes(category);
      const searchable = [
        simulation.title,
        simulation.description,
        simulation.category,
          ...(simulation.alsoIn ?? []),
        ...simulation.tags,
      ]
        .map((value) => normaliseSearchTerm(value))
        .join(' ');

      const canonicalTerm = searchAliases[term] ?? term;
      const matchesSearch =
        !term ||
        searchable.includes(term) ||
        searchable.includes(canonicalTerm) ||
        Object.entries(searchAliases).some(
          ([alias, canonical]) =>
            term === normaliseSearchTerm(alias) && searchable.includes(normaliseSearchTerm(canonical)),
        );

      return matchesCategory && matchesSearch;
    });
  }, [category, query]);

  return (
    <main>
      <section className="intro" id="top">
        <div className="intro-title">
          <img className="intro-logo" src="/favicon-a.svg" alt="" />
          <h1>alexmoorephysics.com</h1>
          <nav className="site-nav" aria-label="Site">
            <a href="/" aria-current="page">Simulations</a>
            <a href="/resources/">Resources</a>
          </nav>
        </div>
        <p className="intro-copy">
          Interactive physics simulations for teachers and students.
        </p>
        <a className="resources-link" href="/resources/">
          Plus excellent videos, simulations and articles from elsewhere that I
          use in my teaching <span aria-hidden="true">→</span>
        </a>
      </section>

      <section
        className="collection"
        id="simulations"
        aria-labelledby="collection-title"
      >
        <div className="collection-heading">
          <div>
            <p className="section-kicker">Browse</p>
            <h2 id="collection-title">All simulations</h2>
          </div>
          <p className="result-count" aria-live="polite">
            {visibleSimulations.length}{' '}
            {visibleSimulations.length === 1 ? 'simulation' : 'simulations'}
          </p>
        </div>

        <div className="filters" role="search">
          <label className="search-box">
            <Search size={18} aria-hidden="true" />
            <span className="sr-only">Search simulations</span>
            <Input
              type="search"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search topics, e.g. waves or resistance"
              aria-label="Search simulations"
            />
          </label>

          <div className="category-list" aria-label="Filter by topic">
            {categories.map((item) => (
              <Button
                key={item}
                type="button"
                variant={category === item ? 'default' : 'outline'}
                aria-pressed={category === item}
                onClick={() => setCategory(item)}
                className="category-button"
              >
                {item}
              </Button>
            ))}
          </div>
        </div>

        {visibleSimulations.length > 0 ? (
          <div className="simulation-grid">
            {visibleSimulations.map((simulation) => {
              const launchUrl = `/${simulation.slug}/`;

              return (
                <article
                  className="simulation-card"
                  key={simulation.slug}
                  style={
                    { '--card-accent': simulation.accent } as React.CSSProperties
                  }
                >
                  <a
                    className="preview-link"
                    href={launchUrl}
                    target="_blank"
                    rel="noreferrer"
                    aria-label={`Launch ${simulation.title}`}
                  >
                    <img
                      src={
                        simulation.preview ??
                        `/previews/${simulation.slug}.webp`
                      }
                      alt={`Preview of ${simulation.title}`}
                      loading="lazy"
                      decoding="async"
                    />
                    <span className="launch-badge">
                      Launch <ExternalLink size={14} aria-hidden="true" />
                    </span>
                  </a>

                  <div className="card-body">
                    <div className="card-meta">
                      <span className="category-label">
                        {[simulation.category, ...(simulation.alsoIn ?? [])].map(
                          (name, index) => {
                            const Icon = categoryIcons[name] ?? Atom;

                            return (
                              <span className="category-item" key={name}>
                                {index > 0 && (
                                  <span className="category-separator" aria-hidden="true">
                                    ·
                                  </span>
                                )}
                                <Icon size={14} aria-hidden="true" />
                                {name}
                              </span>
                            );
                          },
                        )}
                      </span>
                      <span className="card-number">
                        {String(simulations.indexOf(simulation) + 1).padStart(
                          2,
                          '0',
                        )}
                      </span>
                    </div>
                    <h3>{simulation.title}</h3>
                    <p>{simulation.description}</p>
                    <div className="card-footer">
                      <div className="tag-list" aria-label="Topics">
                        {simulation.tags.slice(0, 2).map((tag) => (
                          <span key={tag}>{tag}</span>
                        ))}
                      </div>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        ) : (
          <div className="empty-state">
            <Search size={24} aria-hidden="true" />
            <h3>No experiments found</h3>
            <p>Try another keyword or show all topics.</p>
            <Button
              type="button"
              onClick={() => {
                setQuery('');
                setCategory('All');
              }}
            >
              Clear filters
            </Button>
          </div>
        )}
      </section>

      <footer>
        <div className="footer-banner">
          <p>
            Enjoying the simulations? Support the project by buying me a coffee.
            Contact: <a href="mailto:hello@alexmoorephysics.com">hello@alexmoorephysics.com</a>
          </p>
          <iframe
            className="coffee-button"
            title="Buy me a coffee"
            srcDoc={buyMeACoffeeEmbed}
            loading="lazy"
          />
        </div>
        <div className="footer-actions">
          <a href="#top">Back to top ↑</a>
        </div>
      </footer>
    </main>
  );
}
