'use client';

import { useMemo, useState } from 'react';
import {
  Atom,
  Camera,
  CircuitBoard,
  Code2,
  ExternalLink,
  Radio,
  Search,
  Waves,
} from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

type Simulation = {
  title: string;
  slug: string;
  description: string;
  category: string;
  tags: string[];
  accent: string;
  icon: typeof Atom;
};

const buyMeACoffeeEmbed = `<!doctype html>
<html lang="en">
  <head><meta charset="utf-8"></head>
  <body style="margin:0;overflow:hidden;background:transparent">
    <script type="text/javascript" src="https://cdnjs.buymeacoffee.com/1.0.0/button.prod.min.js" data-name="bmc-button" data-slug="awmPhysics" data-color="#FFDD00" data-emoji="" data-font="Lato" data-text="Buy me a coffee" data-outline-color="#000000" data-font-color="#000000" data-coffee-color="#ffffff"></script>
  </body>
</html>`;

const simulations: Simulation[] = [
  {
    title: 'Wave Interference Explorer',
    slug: 'wave-interference-explorer',
    description:
      'Explore double slits, diffraction gratings, Huygens’ wavelets and standing waves.',
    category: 'Waves',
    tags: ['interference', 'diffraction', 'wavelets', 'standing waves'],
    accent: '#55d6e8',
    icon: Waves,
  },
  {
    title: 'Nuclear Reactor',
    slug: 'nuclear-reactor',
    description:
      'Control rods, neutron capture and chain reactions in a live U-235 reactor sandbox.',
    category: 'Nuclear',
    tags: ['fission', 'chain reaction', 'control rods', 'neutrons'],
    accent: '#b89cff',
    icon: Atom,
  },
  {
    title: 'Electricity Overlap',
    slug: 'electricity-overlap',
    description:
      'Build circuits at particle level and watch current, resistance and potential difference emerge.',
    category: 'Electricity',
    tags: ['circuits', 'electrons', 'resistance', 'potential difference'],
    accent: '#ffca5f',
    icon: CircuitBoard,
  },
  {
    title: 'Ultrasound',
    slug: 'ultrasound',
    description:
      'Investigate pulse-echo imaging, reflections and how distance is inferred from time of flight.',
    category: 'Waves',
    tags: ['ultrasound', 'echoes', 'imaging', 'time of flight'],
    accent: '#61d7b5',
    icon: Radio,
  },
  {
    title: 'Filament Lamp I–V Curve',
    slug: 'filament-lamp-IV-curve',
    description:
      'See how heating the filament produces the lamp’s distinctive non-linear I–V characteristic.',
    category: 'Electricity',
    tags: ['current', 'voltage', 'resistance', 'filament lamp'],
    accent: '#ff8e69',
    icon: CircuitBoard,
  },
  {
    title: 'Circuit Sketcher',
    slug: 'circuit-sketcher',
    description:
      'Sketch clean circuit diagrams quickly with familiar components and connections.',
    category: 'Electricity',
    tags: ['circuits', 'diagrams', 'components', 'sketching'],
    accent: '#69a7ff',
    icon: CircuitBoard,
  },
  {
    title: 'Pinhole Camera',
    slug: 'pinhole-camera',
    description:
      'Move the object, aperture and screen to explore image inversion, size and sharpness.',
    category: 'Optics',
    tags: ['light', 'images', 'rays', 'pinhole'],
    accent: '#f39ac7',
    icon: Camera,
  },
  {
    title: 'Sampling Analogue Signals',
    slug: 'sampling-analogue',
    description:
      'Change the sample rate, reconstruct a signal and watch aliasing happen in real time.',
    category: 'Signals',
    tags: ['sampling', 'aliasing', 'analogue', 'digital'],
    accent: '#8ddc74',
    icon: Radio,
  },
  {
    title: 'Hot-Air Balloon Lab',
    slug: 'hot-air-balloon',
    description:
      'Connect particle collisions, pressure, density and buoyancy—then make a balloon fly.',
    category: 'Thermal',
    tags: ['pressure', 'buoyancy', 'particles', 'density'],
    accent: '#f1b95b',
    icon: Atom,
  },
];

const categories = [
  'All',
  ...Array.from(new Set(simulations.map((item) => item.category))),
];

export default function Home() {
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState('All');

  const visibleSimulations = useMemo(() => {
    const term = query.trim().toLowerCase();

    return simulations.filter((simulation) => {
      const matchesCategory =
        category === 'All' || simulation.category === category;
      const searchable = [
        simulation.title,
        simulation.description,
        simulation.category,
        ...simulation.tags,
      ]
        .join(' ')
        .toLowerCase();

      return matchesCategory && (!term || searchable.includes(term));
    });
  }, [category, query]);

  return (
    <main>
      <section className="intro" id="top">
        <p className="section-kicker">awm physics</p>
        <div className="intro-title">
          <img className="intro-logo" src="/favicon.svg" alt="" />
          <h1>Simulations</h1>
        </div>
        <p className="intro-copy">
          Interactive physics simulations for teachers and students.
        </p>
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
              const Icon = simulation.icon;
              const launchUrl = `https://awm11.github.io/${simulation.slug}/`;
              const sourceUrl = `https://github.com/awm11/${simulation.slug}`;

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
                      src={`/previews/${simulation.slug}.png`}
                      alt={`Preview of ${simulation.title}`}
                    />
                    <span className="launch-badge">
                      Launch <ExternalLink size={14} aria-hidden="true" />
                    </span>
                  </a>

                  <div className="card-body">
                    <div className="card-meta">
                      <span className="category-label">
                        <Icon size={14} aria-hidden="true" />
                        {simulation.category}
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
                      <a
                        className="source-link"
                        href={sourceUrl}
                        target="_blank"
                        rel="noreferrer"
                        aria-label={`View source code for ${simulation.title}`}
                      >
                        <Code2 size={16} aria-hidden="true" />
                        Source
                      </a>
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
        <p>awm physics</p>
        <div className="footer-actions">
          <iframe
            className="coffee-button"
            title="Buy me a coffee"
            srcDoc={buyMeACoffeeEmbed}
            loading="lazy"
          />
          <a href="#top">Back to top ↑</a>
        </div>
      </footer>
    </main>
  );
}
