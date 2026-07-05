/* =============================================================================
   projects.js  —  Single source of truth for all portfolio content.

   HOW TO EDIT (no coding required):
   - Each object in PROJECTS is one card in the carousel + one detail window.
   - To swap a placeholder for your real render, drop the file into assets/img
     (or assets/video) and update the `poster` / `video` path below.
   - `video` loops in the card once the intro + guidance demo finish; projects
     with `posterHold` dissolve to their cover between passes. Set to null if
     the project has no video yet.
   - `sections` render as the Apple-style stacked blocks in the detail window.
   - `model` (optional) is a path to a .glb file shown in the interactive
     3D viewer. Leave it out (or null) to hide the viewer for that project.
   ========================================================================== */

// ALL_PROJECTS holds every project (incl. ones parked with `hidden: true` until
// they have a real render). The carousel/modal only ever see PROJECTS below —
// the visible set, in order — so parked projects are stored but not shown.
const ALL_PROJECTS = [
  {
    // Public stand-in for the master thesis: the 7-DOF thesis footage can't be
    // published, so this card shows the Cooka SCARA robot — same control
    // architecture, different kinematics.
    id: "robotic-arm",
    title: "Cooka — A SCARA Robot",
    tagline: "A low-backlash SCARA with a 2 kg payload and absolute position encoders",
    category: "Robotics / Mechatronics",
    year: "2026",
    aboutLabel: "System architecture", // replaces the default "About the project"
    accent: "#4da3ff",
    // Real photo of the built robot — the intro video shrinks onto this cover,
    // and the card loop dissolves back to it between passes.
    poster: "assets/img/robotic-arm-photo.jpg",
    // Same render as the startup video. Plays to the end, then the cover
    // holds for ~0.5 s (posterHold) before the loop restarts.
    video: "assets/video/intro-scara.mp4",
    posterHold: 500,
    model: "assets/models/Cooka.glb", // real GLB — shows in the modal's 3D viewer
    // starting camera (azimuth polar radius) — 3/4 hero angle; 80% radius sits
    // the camera closer than auto-framing, so the model reads ~25% larger
    cameraOrbit: "25deg 74deg 80%",
    hero:
      "A custom SCARA manipulator engineered end to end — mechanical " +
      "design, hardware integration, simulation and deterministic " +
      "multi-axis control — with one ROS 2 software stack driving both " +
      "the Gazebo digital twin and the physical robot.",
    specs: [
      { label: "Configuration", value: "2R + Linear Y + EE" },
      { label: "Control stack", value: "ROS 2 · ros2_control" },
      { label: "Motion network", value: "CANopen CiA 402 daisy chain" },
      { label: "Simulation", value: "Gazebo · RViz · Isaac Sim" },
      { label: "Hardware", value: "Nanotec PD4-C · Waveshare ST3215" },
    ],
    tags: ["ROS 2", "ros2_control", "CANopen", "Gazebo", "Isaac Sim", "Fusion 360"],
    sections: [
      {
        title: "Modular control architecture",
        body:
          "Layered like an industrial controller: each joint drive runs as " +
          "an independent CANopen fieldbus node, and ros2_control exposes " +
          "them through a standard hardware interface — axes scale and " +
          "controllers swap without touching the rest of the stack.",
        image: null,
      },
      {
        title: "Deterministic multi-axis motion control",
        body:
          "Axes synchronise over CANopen in interpolated position (IP) and " +
          "cyclic synchronous position (CSP) modes, with trajectory " +
          "generation, hardware abstraction and actuator communication kept " +
          "as cleanly separated layers.",
        image: null,
      },
      {
        title: "Custom mechanical design",
        body:
          "The complete assembly — structural links, actuator integration " +
          "and transmission layout — designed in Fusion 360, with a passive " +
          "mechanical end-effector that retains the payload through " +
          "geometry rather than friction.",
        image: null,
      },
      {
        title: "One bringup, sim to hardware",
        body:
          "URDF/Xacro description, TF tree, launch system and controller " +
          "configuration — the same bringup runs the Gazebo digital twin " +
          "and the real robot through ros2_control.",
        image: null,
      },
    ],
  },

  {
    id: "generative-design",
    title: "Generative Design",
    tagline: "Constraint-driven lightweight design for robotics and functional mechanical parts",
    category: "Design Optimization / DfAM",
    year: "2025",
    accent: "#37d6a7",
    poster: "assets/img/generative-design-cover.jpg",
    // no `model` field -> the card window plays this video instead of a 3D viewer
    video: "assets/video/generative-design.mp4",
    hero:
      "A repeatable optimization workflow — engineering load cases and " +
      "constraints in, structurally efficient candidates out — validated " +
      "with FEA and refined into manufacturable CAD.",
    specs: [
      { label: "Workflow", value: "Generative Design + Static FEA" },
      { label: "Design inputs", value: "Loads · Constraints · Preserve geometry" },
      { label: "Manufacturing", value: "DfAM for FDM printing" },
      { label: "Validation", value: "Stress & safety-factor review" },
      { label: "Application", value: "Robot structural components" },
    ],
    tags: ["Fusion 360", "Generative Design", "Topology Optimization", "DfAM", "Static FEA"],
    sections: [
      {
        title: "Constraint-driven optimization",
        body:
          "Functional requirements go in — load cases, constraints, preserve " +
          "regions, obstacle geometry and manufacturing limits — instead of " +
          "hand-carved material. The solver explores structurally efficient " +
          "candidates from those constraints, not from predefined geometry.",
        image: null,
      },
      {
        title: "Engineering decision process",
        body:
          "Candidates are judged on mass reduction, stress distribution, " +
          "displacement, safety factor and manufacturability before one is " +
          "selected — then refined into production-ready CAD where needed.",
        image: null,
      },
      {
        title: "Design for additive manufacturing",
        body:
          "Studies are configured with additive constraints from the start: " +
          "minimal support material, deliberate print orientation, and " +
          "self-supporting geometry suited to FDM fabrication.",
        image: "assets/img/generative-design-print.jpg",
      },
      {
        title: "Lightweight robotics components",
        body:
          "Applied across the mechanical parts in my robotics projects to cut " +
          "moving mass while keeping stiffness and functional interfaces — " +
          "better dynamic performance without sacrificing strength.",
        image: null,
      },
    ],
  },

  {
    id: "spot",
    title: "Reference-Based Quadruped Modeling",
    tagline: "Reference-based CAD reconstruction from orthographic views",
    category: "CAD / Reverse Engineering",
    year: "2024",
    accent: "#9aa3b2",
    poster: "assets/img/spot-cover.jpg",
    video: "assets/video/quadruped.mp4",
    model: "assets/models/Spot.glb",
    cameraOrbit: "30deg 78deg 80%", // 80% radius -> model ~25% larger than auto
    hero:
      "A complete quadruped robot — inspired by Boston Dynamics' Spot — " +
      "reverse-engineered into CAD purely from orthographic references: " +
      "parametric and surface modeling, a mechanism-level assembly, and " +
      "engineering-grade visualization.",
    specs: [
      { label: "Modeling method", value: "Orthographic reference modeling" },
      { label: "CAD workflow", value: "Parametric + surface modeling" },
      { label: "Assembly", value: "Multi-part mechanical assembly" },
      { label: "Visualization", value: "Blender & KeyShot" },
      { label: "Focus", value: "Reference-based reverse engineering" },
    ],
    tags: ["Fusion 360", "Reverse Engineering", "Surface Modeling", "Assembly Design", "Visualization"],
    sections: [
      {
        title: "Orthographic reference modeling",
        body:
          "The full model was reconstructed from front, side and top-view " +
          "references — translating 2D geometry into fully defined solids by " +
          "interpreting spatial relationships and proportions, not by " +
          "importing existing CAD data.",
        image: "assets/img/spot-front.png",
      },
      {
        title: "Assembly-driven design",
        body:
          "Built as a functional assembly rather than independent parts: " +
          "joint locations, mating interfaces, clearances and mechanical " +
          "relationships were defined throughout the design process.",
        image: "assets/img/spot-2.png",
      },
      {
        title: "Surface & form development",
        body:
          "Fusion 360's surface and sculpting tools shaped the complex " +
          "external geometry while keeping smooth transitions, manufacturable " +
          "topology and clean parametric features.",
        image: null,
      },
      {
        title: "Engineering visualization",
        body:
          "The finished assembly was prepared for technical communication — " +
          "animated in Blender and rendered photorealistically in KeyShot.",
        image: null,
      },
    ],
  },

  {
    id: "poultry-farm",
    title: "Poultry Farm Design",
    tagline: "Internship · 41-ft Pratt truss for a 40,000 sq-ft poultry shed",
    category: "Structural Design / FEA",
    year: "2022",
    accent: "#d0584a",
    poster: "assets/img/poultry-farm-cover.jpg",
    // no `model` field -> the card window plays this render walkthrough in the
    // centre viewer instead of a 3D model.
    video: "assets/video/poultry-truss.mp4",
    // Card loop: play to the end, dissolve to the cover photo, hold ~1s, replay.
    posterHold: 1000,
    hero:
      "A 41-foot Pratt roof truss I designed and helped fabricate as a design " +
      "engineer at ISOLogic — sized in FEA, then cut, welded and machined with " +
      "the team into the steel frame of a 40,000 sq-ft poultry-farm shed.",
    specs: [
      { label: "Structure", value: "41-ft Pratt roof truss" },
      { label: "Material", value: "Mild steel · fy ≈ 207 MPa" },
      { label: "Max von Mises", value: "11.85 MPa" },
      { label: "Min safety factor", value: "≥ 15" },
      { label: "Peak deflection", value: "0.32 mm" },
      { label: "Analysis", value: "Autodesk Inventor FEA" },
    ],
    tags: ["Autodesk Inventor", "FEA", "Steel structures", "Welding", "GD&T"],
    sections: [
      {
        title: "Sized in FEA, then welded into place",
        body:
          "Static stress analysis under the full roof load held peak stress at " +
          "11.85 MPa — a safety factor above 15 with just 0.32 mm of deflection " +
          "across the span — before the frame was cut, welded and machined on site.",
        image: "assets/img/poultry-truss-cad.jpg",
      },
      {
        // RESERVED slot for the FEA stress-animation clip. When it's ready, drop
        // the file in assets/video and swap `placeholder` for:
        //   video: "assets/video/poultry-sim.mp4",
        title: "Structural FEA simulation",
        body:
          "An animated stress and displacement study of the truss under load — " +
          "showing where the frame carries, and sheds, the roof forces.",
        placeholder: "FEA simulation clip — coming soon",
      },
    ],
  },

  {
    id: "racking-machine",
    title: "Racking Machine",
    tagline: "A low-cost litter raking machine for poultry sheds",
    category: "Machine Design",
    year: "2022",
    accent: "#c96a4f",
    poster: "assets/img/racking-machine-cover.jpg",
    // no `model` field -> the card window plays this chassis walkaround in the
    // centre viewer. The clip ends on the cover frame, so the card loops clean.
    video: "assets/video/racking-machine.mp4",
    hero:
      "A hand-pushed floor-raking machine for poultry sheds: a spinning " +
      "rear rotavator breaks up caked litter to keep the bedding dry and " +
      "friable — built from aluminium square pipe and sheet so a small " +
      "farm can actually afford one.",
    specs: [
      { label: "Function", value: "Litter de-caking & aeration" },
      { label: "Mechanism", value: "Rear rotavator with raking tines" },
      { label: "Construction", value: "Aluminium square pipe + sheet" },
      { label: "Design driver", value: "Low-cost, small-farm build" },
      { label: "Tool", value: "Fusion 360" },
    ],
    tags: ["Fusion 360", "Machine Design", "Sheet Metal", "Cost-Driven Design", "Farm Equipment"],
    sections: [
      {
        title: "The problem: caked litter",
        body:
          "In a poultry shed, droppings and moisture compact the bedding " +
          "into a hard cake. Trapped moisture releases ammonia, which burns " +
          "footpads and stresses the birds, while pathogens thrive in the " +
          "damp layer. Tractor-drawn de-caking machines exist — but they're " +
          "priced for industrial farms, so small sheds rake by hand.",
        image: null,
      },
      {
        title: "A rotavator does the raking",
        body:
          "As the cart is pushed, the tined rotavator at the rear spins " +
          "through the bedding — breaking the cake and turning the litter " +
          "so trapped moisture can evaporate and the floor returns to a " +
          "dry, friable state between flocks.",
        image: null,
      },
      {
        title: "Built to cost",
        body:
          "The chassis is aluminium square pipe with sheet guards: light " +
          "enough to push all day, corrosion-resistant in the humid, " +
          "ammonia-laden shed air, and cheap to fabricate with basic " +
          "cutting and welding.",
        image: null,
      },
    ],
  },

  {
    id: "excavator",
    title: "Excavator — Mechanism Design",
    tagline: "Excavator with ROPS & OPG",
    category: "Mechanism Design / Kinematics",
    year: "2024",
    accent: "#ffb347",
    poster: "assets/img/excavator-cover.jpg",
    video: "assets/video/excavator-render.mp4",
    model: "assets/models/Escavator.glb",
    cameraOrbit: "-30deg 76deg 80%", // 80% radius -> model ~25% larger than auto
    exposure: 0.3, // lighter (yellow) model — dim the viewer so it reads naturally
    hero:
      "A complete excavator developed as a mechanism-design exercise: an " +
      "articulated digging linkage with realistic pivots and cylinder " +
      "placement, organised as a large multi-part assembly, validated in " +
      "motion and documented in dimensioned engineering drawings.",
    specs: [
      { label: "Modeling method", value: "Reference-based CAD modeling" },
      { label: "Assembly", value: "Large multi-part assembly" },
      { label: "Mechanisms", value: "Hydraulic linkage design" },
      { label: "Documentation", value: "Engineering drawings" },
      { label: "Validation", value: "Motion & interference study" },
    ],
    tags: ["Fusion 360", "Mechanism Design", "Assembly Modeling", "Engineering Drawings", "Motion Study"],
    sections: [
      {
        title: "Reference-based assembly modeling",
        body:
          "Chassis, crawler tracks, upper structure, ROPS, boom, stick and " +
          "bucket were each reconstructed from orthographic references and " +
          "organised into a structured assembly — defined part hierarchy, " +
          "subassemblies, mating relationships and clearances.",
        image: null,
      },
      {
        title: "Mechanism & kinematic design",
        body:
          "The boom, stick and bucket form an articulated linkage with " +
          "realistic pivot locations and hydraulic cylinder placement, so the " +
          "complete digging mechanism sweeps its operating range while " +
          "keeping correct joint relationships.",
        image: "assets/img/excavator-2.jpg",
      },
      {
        title: "Motion & interference validation",
        body:
          "Motion studies verified linkage movement, articulation limits and " +
          "potential interferences before the design was signed off for " +
          "documentation.",
        image: null,
      },
      {
        title: "Engineering documentation",
        body:
          "The finished model was taken through to dimensioned engineering " +
          "drawings — tolerancing, views and annotations aimed at clear " +
          "design communication.",
        image: "assets/img/excavator-blueprint.jpg",
      },
    ],
  },

  {
    id: "foot-gesture-hmi",
    hidden: true, // no real render yet — stored for later, not shown in the carousel
    title: "Foot-Gesture HMI",
    tagline: "Hands-free robot control through computer vision",
    category: "Computer Vision / Controls",
    year: "2025",
    accent: "#37d6a7",
    poster: "assets/img/foot-gesture-hmi.svg",
    video: null,
    hero:
      "A hands-free human–machine interface for a medical robot that turns " +
      "foot gestures into real-time control commands — so a surgeon's hands " +
      "never have to leave the task.",
    specs: [
      { label: "Input", value: "Foot gestures (vision)" },
      { label: "Logic", value: "Finite state machine" },
      { label: "Stack", value: "Python · OpenCV · ROS 2" },
      { label: "Comms", value: "UDP" },
    ],
    tags: ["OpenCV", "Python", "ROS 2", "FSM", "Real-time CV"],
    sections: [
      {
        title: "Reliable under fast motion and occlusion",
        body:
          "The recognition pipeline is a finite state machine with temporal " +
          "filtering, baseline calibration and tracking-loss tolerance. That " +
          "combination keeps gesture recognition dependable even when the foot " +
          "moves quickly or is partially hidden — the difference between a demo " +
          "and something usable in an operating room.",
        image: null,
      },
      {
        title: "Designed as a control interface, not a toy",
        body:
          "Gestures map to discrete robot commands over UDP, with calibration " +
          "that adapts to each user's neutral pose so the system feels " +
          "predictable rather than twitchy.",
        image: null,
      },
    ],
  },

  {
    id: "robot-hand",
    title: "Anthropomorphic Hand",
    tagline: "Under-actuated fingers that grasp like a human hand",
    category: "Mechanism Design",
    year: "2024",
    accent: "#ff8a5b",
    poster: "assets/img/hand-cover.jpg",
    video: "assets/video/hand.mp4",
    model: "assets/models/humanoid-hand.glb",
    cameraOrbit: "15deg 78deg auto",
    exposure: 0.3,
    hero:
      "An anthropomorphic hand whose fingers trace a human-like grasp — one " +
      "motor driving an under-actuated linkage.",
    specs: [
      { label: "Mechanism", value: "Dual four-bar linkage" },
      { label: "Actuation", value: "Under-actuated · 1 linear motor" },
      { label: "Coupling", value: "MCP → PIP → DIP" },
      { label: "Tool", value: "Fusion 360" },
    ],
    tags: ["Fusion 360", "Under-actuation", "Four-bar linkage", "Biomechanics"],
    sections: [
      {
        title: "One input, human-like motion",
        body:
          "Each finger is a pair of four-bars: driving the MCP curls PIP and " +
          "DIP dependently, so a single motor traces a natural, compliant " +
          "grasp — no motor per joint.",
        image: null,
      },
    ],
  },

  {
    id: "traction-motor",
    hidden: true, // no real render yet — stored for later, not shown in the carousel
    title: "E-Traction Motor",
    tagline: "Modular electric motor housing — parametric CAD + FEA",
    category: "Electromobility / FEA",
    year: "2024",
    accent: "#c07bff",
    poster: "assets/img/traction-motor.svg",
    video: null,
    hero:
      "A modular electric traction-motor housing, built parametrically so one " +
      "model scales across motor sizes, then validated and lightened with " +
      "structural FEA.",
    specs: [
      { label: "Tools", value: "Creo · ANSYS Mechanical" },
      { label: "Approach", value: "Parametric modelling" },
      { label: "Mass saved", value: "≈ 10–15%" },
      { label: "Domain", value: "Electromobility" },
    ],
    tags: ["Creo", "ANSYS", "FEA", "Parametric CAD", "Lightweighting"],
    sections: [
      {
        title: "One model, many motor sizes",
        body:
          "The housing, stator support and mounting fixtures are fully " +
          "parametric, so a change in motor size ripples through the geometry " +
          "automatically. That makes design iteration a matter of numbers, not " +
          "remodelling.",
        image: null,
      },
      {
        title: "Lighter, without losing the safety factor",
        body:
          "Static strength analysis under torque-induced loads pinpointed the " +
          "stress-critical regions. Targeted geometry optimisation cut roughly " +
          "10–15% of the mass while keeping the safety factors intact and " +
          "improving manufacturability.",
        image: null,
      },
    ],
  },

  {
    id: "lockheed",
    title: "Lockheed L-1011 TriStar",
    tagline: "Structural surface model of a wide-body airframe",
    category: "Surface Modelling",
    year: "2024",
    accent: "#5fb0d8",
    poster: "assets/img/lockheed-cover.jpg",
    video: "assets/video/lockheed-tristar.mp4",
    model: "assets/models/Lockheed.glb", // Draco-compressed (62MB -> 3MB) for web
    cameraOrbit: "35deg 68deg 80%", // 80% radius -> model ~25% larger than auto
    exposure: 0.3,
    hero:
      "A structural surface model of the Lockheed L-1011 TriStar — " +
      "constraint-based modelling of the real wing / fuselage / tail joinery.",
    specs: [
      { label: "Method", value: "Surface modelling" },
      { label: "Reference", value: "L-1011 TriStar (trijet)" },
      { label: "Span · length", value: "47 m · 54 m" },
      { label: "Powerplant", value: "3 × Rolls-Royce RB211" },
    ],
    tags: ["Surface modelling", "Assembly design", "Aerostructures"],
    sections: [
      {
        title: "Where the surfaces meet",
        body:
          "Constraint-based modelling of the real joinery — how the wing roots " +
          "into the fuselage and the empennage attaches — not one approximated skin.",
        image: "assets/img/lockheed-2.png",
      },
      {
        title: "Documented as drawings",
        body: "Taken through to dimensioned engineering drawings.",
        image: "assets/img/lockheed-drawing.jpg",
      },
    ],
  },

  {
    id: "beverage-machine",
    hidden: true, // no real render yet — stored for later, not shown in the carousel
    title: "Beverage Automation",
    tagline: "Project Thesis · Mechatronic subsystems, built and validated",
    category: "Mechatronics",
    year: "2025",
    accent: "#ffd24d",
    poster: "assets/img/beverage-machine.svg",
    video: null,
    hero:
      "An automated beverage-mixing machine where I designed, built and " +
      "validated the mechatronic subsystems end to end — and halved both the " +
      "cost and the debug time along the way.",
    specs: [
      { label: "Cost", value: "5000€ → 3000€ (−40%)" },
      { label: "Print time", value: "13 h → 6 h" },
      { label: "Actuator speed", value: "30 → 72 mm/s" },
      { label: "Dispensing force", value: "10 N sustained" },
      { label: "Control", value: "Raspberry Pi · Python" },
    ],
    tags: ["Mechatronics", "Raspberry Pi", "DFM/DFA", "Sheet metal", "Perfboard"],
    sections: [
      {
        title: "A linkage that multiplies speed",
        body:
          "A grasshopper-linkage speed multiplier raised the actuator's output " +
          "speed from 30 to 72 mm/s while still sustaining the 10 N force needed " +
          "to dispense — buying speed from geometry instead of a bigger, " +
          "costlier motor.",
        image: null,
      },
      {
        title: "Modular, Lego-style parts",
        body:
          "Designing components with Lego-style fitment enabled rapid part " +
          "swaps and design iteration. Optimised geometry removed the need for " +
          "print supports, cutting print time from 13 to 6 hours and slashing " +
          "material waste.",
        image: null,
      },
      {
        title: "Half the wiring headaches",
        body:
          "A custom perfboard control circuit streamlined the wiring and cut " +
          "testing and debugging time by 50%. Drawing the full electrical " +
          "schematic before procurement kept sourcing efficient and the project " +
          "on schedule.",
        image: null,
      },
    ],
  },
];

// The visible carousel = only projects that have real media (not `hidden`).
const PROJECTS = ALL_PROJECTS.filter((p) => !p.hidden);

/* ---- Timeline: education + experience (newest first) --------------------- */
const TIMELINE = [
  {
    period: "03/2026 — Present",
    title: "Master Thesis — 7-DOF Robotic Arm",
    org: "Factory Automation & Production Systems, Nürnberg",
    kind: "work",
    note:
      "Building a custom 7-DOF, 10 kg-payload robotic system (< 20 arcmin " +
      "backlash) — CANopen CiA 402 control, Gazebo torque sizing, ROS 2 " +
      "workflow automated with Claude Code.",
  },
  {
    period: "06/2025 — 01/2026",
    title: "Project Thesis — Beverage Automation",
    org: "Factory Automation & Production Systems, Nürnberg",
    kind: "work",
    note:
      "Designed and validated mechatronic subsystems; −40% cost, −50% debug " +
      "time, grasshopper speed-multiplier linkage.",
  },
  {
    period: "10/2023 — Present",
    title: "M.Sc. Electromobility",
    org: "FAU Erlangen, Germany",
    kind: "edu",
    note: "Focus on robotics, product design and electric drivetrains.",
  },
  {
    period: "08/2022 — 12/2022",
    title: "Design Engineer",
    org: "ISOLogic Automation, Tiruppur",
    kind: "work",
    note:
      "Designed and manufactured a 41-ft Pratt truss for a 40,000 sq-ft " +
      "industrial shed — cutting, welding, machining, post-processing.",
  },
  {
    period: "02/2022 — 07/2022",
    title: "Programmer Analyst Trainee",
    org: "Cognizant Technology Solutions, Chennai",
    kind: "work",
    note:
      "Automated testing with Selenium & TestNG; cut post-release defects " +
      "by 15%.",
  },
  {
    period: "07/2018 — 06/2022",
    title: "B.Tech. Mechanical Engineering",
    org: "VIT, Vellore",
    kind: "edu",
    note:
      "Bachelor thesis: autonomous navigation retrofit for medical " +
      "wheelchairs (ROS, Gazebo, SLAM).",
  },
];

/* ---- About ---------------------------------------------------------------- */
const ABOUT = {
  name: "Praveen Vighnesh S T",
  role: "Mechatronics & Robotics Engineer",
  location: "Nuremberg, Germany",
  email: "praveenthamilarasu@gmail.com",
  linkedin: "https://www.linkedin.com/", // TODO: replace with your LinkedIn URL
  blurb:
    "I design actuated robotic hardware and bring it up in ROS 2 and Gazebo — " +
    "hands-on across the full stack: mechanical design, motion control, " +
    "embedded integration and real-time computer vision. I'm finishing an " +
    "M.Sc. in Electromobility at FAU Erlangen, and I'm drawn to the place " +
    "where robotics and electromobility meet.",
  skills: [
    { group: "Robotics", items: "ROS 2 (Jazzy) · ros2_control · MoveIt 2 · Gazebo · Isaac Sim · OpenCV" },
    { group: "Electronics", items: "KiCad · Altium · Arduino · Raspberry Pi 5 · UART · PID/PLC" },
    { group: "CAD & Sim", items: "Fusion 360 · SolidWorks · Siemens NX · CREO · CATIA · Ansys · Simulink" },
    { group: "Fabrication", items: "3D printing · sheet metal · laser cutting · CNC · welding · soldering" },
    { group: "Code", items: "Python · C++ · PyTorch · Claude Code · Git" },
  ],
  languages: "German (B1) · English (C1) · Tamil (C2, native)",
  resumes: [
    { label: "Résumé", href: "assets/resume/Praveen-Vighnesh-Robotics-CV.pdf" },
  ],
  // shown after the Résumé button, in this order
  socials: [
    { label: "LinkedIn", href: "https://www.linkedin.com/in/praveen-vighnesh-s-t-5497421aa/", icon: "linkedin" },
    { label: "GitHub", href: "https://github.com/PraveenVighnesh-ST", icon: "github" },
    { label: "GrabCAD", href: "https://grabcad.com/praveen.vighnesh.s.t-1", icon: "grabcad" },
    { label: "YouTube", href: "https://www.youtube.com/@praveenvigheshst", icon: "youtube" },
    { label: "Instagram", href: "https://www.instagram.com/graphite_with_life/", icon: "instagram" },
  ],
};
