import './Projects.css';
import PhaseSlider from "../components/PhaseSlider";

import doodle1 from "../assets/projects/phase1.svg?raw";
import doodle2 from "../assets/projects/phase2.svg?raw";
import doodle3 from "../assets/projects/phase3.svg?raw";
import doodle4 from "../assets/projects/phase4.svg?raw";
import doodle5 from "../assets/projects/phase5.svg?raw";
import frameSvg from "../assets/projects/frame.svg?raw";

const phases = [
  {
    id: 1,
    title: "Phase 1",
    subtitle: "Discovery + Planning",
    body: "Establish a clear project direction, scope, requirements, and workflow to align the team for execution.",
    doodle: doodle1,
    layout: "bl",
    doodleSize: "80%",
  },
  {
    id: 2,
    title: "Phase 2",
    subtitle: "Research + Strategy",
    body: "Build a strong understanding of the users, market, and core problem to define a focused design strategy.",
    doodle: doodle2,
    layout: "tr",
    doodleSize: "65%",
  },
  {
    id: 3,
    title: "Phase 3",
    subtitle: "Structure + Ideation",
    body: "Translate research insights into a clear product structure, user flows, and initial design concepts.",
    doodle: doodle3,
    layout: "br",
    doodleSize: "80%",
  },
  {
    id: 4,
    title: "Phase 4",
    subtitle: "Design + Validation",
    body: "Develop and test high-fidelity solutions to validate key design decisions and improve the user experience.",
    doodle: doodle4,
    layout: "tl",
  },
  {
    id: 5,
    title: "Phase 5",
    subtitle: "Finalization + Handoff",
    body: "Refine the final solution and deliver a polished, presentation-ready product with complete handoff documentation.",
    doodle: doodle5,
    layout: "bl",
    doodleSize: "68%",
  },
];

export default function Projects() {
  return (
    <section id="projects" className="projects-section">
      <h1 className="page-heading projects-heading">our projects</h1>
      <p className="projects-subtitle">
        Every MockUp engagement follows a structured five-phase process, from
        research to launch, so students build real skills and companies get
        work they can ship.
      </p>
      <PhaseSlider phases={phases} frame={frameSvg} />
    </section>
  );
}
