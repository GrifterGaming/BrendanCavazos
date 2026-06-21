// Static content pulled from the original design. Kept in one place so copy is easy to edit.

export type Testimonial = {
  id: number;
  name: string;
  role: string;
  quote: string;
};

export const DEFAULT_TESTIMONIALS: Testimonial[] = [
  {
    id: 1,
    name: "Jake Mitchell",
    role: "Content Director · Professional Bull Riders",
    quote:
      "Brendan’s editing transformed our social content. His understanding of pacing and storytelling is exceptional — every cut feels intentional.",
  },
  {
    id: 2,
    name: "Sarah Chen",
    role: "Digital Producer · Sports Media",
    quote:
      "Fast turnaround, clean edits, and always hits the brief. Brendan is the most reliable editor I’ve worked with on any project.",
  },
  {
    id: 3,
    name: "Marcus Davis",
    role: "YouTube Creator · Motorsports",
    quote:
      "His work on our podcast episodes doubled our watch time. Brendan knows exactly when to cut and when to let it breathe.",
  },
  {
    id: 4,
    name: "Tyler Brooks",
    role: "Sports Media Director · Independent",
    quote:
      "Brought broadcast-quality production values to our digital content. An excellent creative collaborator with outstanding attention to detail.",
  },
];

export const SERVICES = [
  {
    n: "01",
    titleLines: ["SOCIAL", "MEDIA"],
    flatTitle: "Social Media Editing",
    body: "Edit and optimize high-engagement video content tailored for social media platforms to maximize viewer retention and audience growth.",
  },
  {
    n: "02",
    titleLines: ["LONG", "FORM"],
    flatTitle: "Long Form Editing",
    body: "Structure, pace, and polish comprehensive long-form videos to maintain deep viewer engagement and maximize watch time on YouTube and educational platforms.",
  },
  {
    n: "03",
    titleLines: ["PODCAST", "EDITING"],
    flatTitle: "Podcast Editing",
    body: "Edit, clean up, and optimize audio and video podcast episodes for seamless conversational flow and maximum audience engagement across all platforms.",
  },
];

export const PROCESS = [
  { n: "01", title: "Discovery", body: "Align on goals, audience, platform, and style." },
  { n: "02", title: "Edit", body: "Build the cut, pacing, and narrative flow." },
  { n: "03", title: "Revisions", body: "Feedback rounds until it’s exactly right." },
  { n: "04", title: "Deliver", body: "Final export in your required formats and specs." },
];

export const TIMELINE = [
  { year: "2026", title: "Video Editor", org: "Professional Bull Riders", current: true },
  { year: "2024", title: "Production & Editing", org: "Professional Bull Riders", current: false },
  { year: "2022", title: "Production Assistant — NASCAR Race Hub", org: "Fox Sports", current: false },
  { year: "ECU", title: "B.S. Communications", org: "East Carolina University", current: false },
];

export const MARQUEE_SERVICES = [
  "Social Media",
  "Long Form",
  "Podcast",
  "Broadcast",
  "Sports",
];

// Hero reel video id
export const YT_HERO_ID = "WaSreKSwPrw";

// Work page playlists — add a new line here to add a new playlist to the site
export type Playlist = { id: string; label: string };
export const PLAYLISTS: Playlist[] = [
  { id: "PLN5Go0LQnrbo3WBNlZeEdj9KH3yBLJnYS", label: "PBR Projects" },
  { id: "PLN5Go0LQnrboNBRlTwlUOdWX_CdqSvmHN", label: "NASCAR Race Hub Projects" },
];

export const CONTACT = {
  email: "brendancavazos3@gmail.com",
  phone: "(980) 875-0858",
  phoneHref: "+19808750858",
};
