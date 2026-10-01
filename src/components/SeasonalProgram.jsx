import {
  GlobeIcon,
  Pencil2Icon,
  PersonIcon,
  ReaderIcon,
} from '@radix-ui/react-icons';
import './SeasonalProgram.css';

const PROGRAM_STEPS = [
  { number: '01', title: 'Kickoff', date: 'Oct 9 · 7 PM', detail: 'Prompt and business goals reveal! Meet the Roblox stakeholders, your team, and faculty professors' },
  { number: '02', title: 'Open Sessions', date: 'Every Monday · Oct 12 – Nov 30 · TBA', detail: 'Open work sessions with your UCI mentor. Roblox office hours for questions.' },
  { number: '03', title: 'Stakeholder Meetings', date: 'Every Friday · Oct 16 – Nov 20 · 10 AM', detail: 'Stakeholder meetings to show progress. Get professional, industry feedback.' },
  { number: '04', title: 'Demo Day', date: 'Dec 4 · 7 PM', detail: 'Present your final case study. Your proposal should convince stakeholders that key metrics will be met.' },
];

const TEAMS = [
  { name: 'Team 01', lead: 'Design Lead', designers: '3 Designers' },
  { name: 'Team 02', lead: 'Design Lead', designers: '3 Designers' },
  { name: 'Team 03', lead: 'Design Lead', designers: '3 Designers' },
];

// Add each person's display name and URL here when the final links are ready.
const PROGRAM_DIRECTORS = [
  { name: 'Allison Huang', href: 'https://www.linkedin.com/in/allisonlyhuang/', role: 'Operations Director' },
  { name: 'Evie Ngo', href: 'https://www.linkedin.com/in/eviebngo/', role: 'Projects Director'},
  { name: 'Queena Liu', href: 'https://www.linkedin.com/in/queena-liu/', role: 'Program Director'},
];

const FACULTY = [
  { name: 'Andre van der Hoek', href: 'https://www.linkedin.com/in/andr%C3%A9-van-der-hoek-1591423/', role: 'Associate Dean of Academic Affairs' },
  { name: 'Matthew J Bietz', href: 'https://www.linkedin.com/in/mbietz/', role: 'MHCID Associate Director of Capstone' },
];

const STAKEHOLDERS = [
  { name: 'Executive Business Partner to CDO', role: 'Roblox Stakeholder' },
  { name: 'Sr. Product Design Program Manager', role: 'Roblox Stakeholder' },
  { name: 'Product Design Manager, Safety Experience', role: 'Roblox Stakeholder' }
];

function PeopleList({ people, defaultRole, columns = 1 }) {
  return (
    <div className={`seasonal-program-people${columns > 1 ? ` seasonal-program-people--${columns}-columns` : ''}`}>
      {people.map((person) => (
        <div className="seasonal-program-person" key={person.name}>
          <strong>
            {person.href ? (
              <a href={person.href} target="_blank" rel="noopener noreferrer">
                {person.name}
              </a>
            ) : (
              person.name
            )}
          </strong>
          <span>{person.role || defaultRole}</span>
        </div>
      ))}
    </div>
  );
}

export default function SeasonalProgram() {
  return (
    <section id="seasonal-program" className="seasonal-program" aria-labelledby="seasonal-program-title">
      <div className="seasonal-program-inner">
        <div className="seasonal-program-copy">
          <p className="seasonal-program-eyebrow">Fall 2026 · MockUp x Roblox</p>
          <h2 id="seasonal-program-title">Design for what comes next.</h2>
          <p className="seasonal-program-description">
            A nine-week UI/UX design program where UCI students work with real stakeholders
            to turn a meaningful problem into a polished product.
          </p>
          <span className="seasonal-program-cta closed" aria-disabled="true">
            Apps Closed
          </span>
        </div>

        <img
          className="seasonal-program-image"
          src="https://i.ytimg.com/vi/zowmaH7hc5Q/maxresdefault.jpg"
          alt="Roblox"
        />
      </div>

      <div className="seasonal-program-timeline" aria-label="Fall 2026 program timeline">
        {PROGRAM_STEPS.map((step) => (
          <div className="seasonal-program-step" key={step.number}>
            <span className="seasonal-program-step-number">{step.number}</span>
            <h3>{step.title}</h3>
            <p className="seasonal-program-step-date">{step.date}</p>
            <p>{step.detail}</p>
          </div>
        ))}
      </div>

      <div className="seasonal-program-structure" aria-labelledby="seasonal-program-structure-title">
        <p className="seasonal-program-structure-eyebrow">How the program is structured</p>
        <h3 id="seasonal-program-structure-title">Three teams. Twelve designers.</h3>

        <div className="seasonal-program-structure-grid">
          <div className="seasonal-program-structure-group seasonal-program-structure-group--directors">
            <h4><PersonIcon aria-hidden="true" /> Program Directors</h4>
            <p className="seasonal-program-team-note">Leading the program and supporting every team.</p>
            <PeopleList people={PROGRAM_DIRECTORS} defaultRole="Program Director" columns={3} />
          </div>

          <div className="seasonal-program-structure-group seasonal-program-structure-group--teams">
            <h4><Pencil2Icon aria-hidden="true" /> Design Teams</h4>
            <p className="seasonal-program-team-note">
              Applying for Design Lead automatically considers you for both Design Lead and Designer roles.
            </p>
            <div className="seasonal-program-teams">
              {TEAMS.map((team) => (
                <div className="seasonal-program-team" key={team.name}>
                  <strong>{team.name}</strong>
                  <span>{team.lead} + {team.designers}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="seasonal-program-structure-group">
            <h4><ReaderIcon aria-hidden="true" /> UCI Faculty Mentors</h4>
            <p className="seasonal-program-team-note">Providing mentorship and guidance throughout the program.</p>
            <PeopleList people={FACULTY} defaultRole="Faculty Advisor" columns={2} />
          </div>

          <div className="seasonal-program-structure-group">
            <h4><GlobeIcon aria-hidden="true" /> Roblox Stakeholders</h4>
            <p className="seasonal-program-team-note">Bringing real-world context and project feedback.</p>
            <PeopleList people={STAKEHOLDERS} columns={3} />
          </div>
        </div>
      </div>
    </section>
  );
}
