import { PageShell } from "@/components/layout/page-shell";
import { PageHero } from "@/components/layout/page-hero";

export default function GlossaryHelpPage() {
  const terms: { letter: string; items: { term: string; definition: string }[] }[] = [
    {
      letter: "A",
      items: [
        {
          term: "Ad-hoc email",
          definition:
            "An email sent by someone with authority that is not an incident, news item, or event.",
        },
        {
          term: "Administrator",
          definition: "A person who has access to the setup functionality on the website.",
        },
        {
          term: "Area Map",
          definition:
            "A map on the contacts page where a user may find their street and zone.",
        },
        {
          term: "Author",
          definition:
            "A person who may add and edit content on the website. There are many types of authors managing different types of content.",
        },
      ],
    },
    {
      letter: "B",
      items: [
        { term: "Browser", definition: "See Web Browser." },
      ],
    },
    {
      letter: "C",
      items: [
        {
          term: "Cookie",
          definition:
            "A small piece of information a website sends to your computer while you are viewing it. It allows the site to remember useful information.",
        },
      ],
    },
    {
      letter: "D",
      items: [
        {
          term: "Documents",
          definition:
            "Information in the form of electronic files contained within the document section of the website.",
        },
      ],
    },
    {
      letter: "E",
      items: [
        {
          term: "Email",
          definition:
            "Written electronic information read on a personal computer or other electronic device.",
        },
        {
          term: "Events",
          definition:
            "Notices placed by your committee to inform you of happenings of interest within your area.",
        },
      ],
    },
    {
      letter: "F",
      items: [
        {
          term: "Forum",
          definition:
            "An area on the website where registered users may add their views and reply to posts made by other members.",
        },
      ],
    },
    {
      letter: "G",
      items: [
        {
          term: "Guest",
          definition:
            "A person who does not reside in the area but would like to be kept informed of activities of the organisation and who has registered on the website.",
        },
      ],
    },
    {
      letter: "H",
      items: [
        {
          term: "Home Page Widget",
          definition:
            "Items on the home page beneath the menu. These present information from elsewhere on the website or an alternate website.",
        },
      ],
    },
    {
      letter: "I",
      items: [
        {
          term: "Incident",
          definition:
            "An act, either criminal or deemed by your committee to be undesirable, perpetrated on another individual or their property.",
        },
        {
          term: "Incident Report",
          definition:
            "A notice on the website of such an act.",
        },
      ],
    },
    {
      letter: "L",
      items: [
        {
          term: "Login",
          definition:
            "Entering your username and password into the website to access content.",
        },
      ],
    },
    {
      letter: "M",
      items: [
        {
          term: "Member",
          definition:
            "A person residing in the area covered by the organisation who has registered on the website.",
        },
        { term: "My Profile", definition: "See Profile." },
      ],
    },
    {
      letter: "N",
      items: [
        {
          term: "Neighbour(s)",
          definition:
            "Persons residing in the same street as defined by your registration address.",
        },
        {
          term: "News Items",
          definition:
            "Pieces of information your committee wish to share with you.",
        },
      ],
    },
    {
      letter: "P",
      items: [
        {
          term: "Password",
          definition:
            "A word known only to you that enables you to log on securely.",
        },
        {
          term: "Patrol",
          definition:
            "The act of a resident travelling the area to identify and report suspicious activity.",
        },
        {
          term: "Patroller",
          definition:
            "A resident travelling the area to identify and report suspicious activity. An eyes and ears resource only.",
        },
        {
          term: "Patrol Manager",
          definition:
            "A person that manages patrollers in their area on the website.",
        },
        {
          term: "Patrol Administrator",
          definition:
            "A person that may manage patrollers in any area on the website.",
        },
        {
          term: "Periodic Communication",
          definition:
            "An email sent weekly or monthly to those who have requested it, based on their profile settings.",
        },
        {
          term: "Profile",
          definition:
            "Your profile determines how you interact with the website (via roles) and the preferences you set in My Profile.",
        },
        {
          term: "Poll",
          definition:
            "A question on the website with possible answers that your committee would like your opinion on.",
        },
      ],
    },
    {
      letter: "S",
      items: [
        {
          term: "Secondary Contact",
          definition:
            "A person your neighbours or the organisation may contact if they cannot reach you in an emergency.",
        },
        {
          term: "Street Coordinator",
          definition:
            "The organisation representative in your street who assists members and may pass along communications.",
        },
      ],
    },
    {
      letter: "U",
      items: [
        {
          term: "Username",
          definition:
            "The name you use to log in. It cannot be changed once you have registered.",
        },
      ],
    },
    {
      letter: "W",
      items: [
        {
          term: "Web Browser",
          definition:
            "A program that allows a person to view pages on a website.",
        },
        {
          term: "Web Server",
          definition:
            "A computer that hosts one or more websites and is connected to the internet.",
        },
        {
          term: "Website",
          definition:
            "A set of formatted pages hosted on a web server used to convey information.",
        },
        { term: "Widget", definition: "See Home Page Widget." },
      ],
    },
    {
      letter: "Z",
      items: [
        {
          term: "Zone",
          definition:
            "A logical grouping of streets for membership administration. Ideally 250–300 houses, though this varies.",
        },
        {
          term: "Zone Coordinator",
          definition:
            "The organisation representative in your zone who assists street coordinators. Usually a committee member.",
        },
      ],
    },
  ];

  return (
    <PageShell>
      <PageHero eyebrow="Help" title="Glossary of terms" description="A–Z reference for terms used on the PNW platform." />
      <div className="mt-section space-y-8">
          {terms.map(({ letter, items }) => (
            <section key={letter} id={letter}>
              <h2 className="font-display text-2xl font-semibold text-foreground">{letter}</h2>
              <dl className="mt-4 space-y-4">
                {items.map(({ term, definition }) => (
                  <div key={term}>
                    <dt className="font-semibold text-foreground">{term}</dt>
                    <dd className="mt-1 text-muted-foreground">{definition}</dd>
                  </div>
                ))}
              </dl>
            </section>
          ))}
      </div>
    </PageShell>
  );
}
