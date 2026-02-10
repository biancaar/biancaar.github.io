import { useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import projects from "../data/projects";
import ThreeScrollScene from "../components/ThreeScrollScene";
import { Link } from "react-router-dom";

gsap.registerPlugin(ScrollTrigger);

export default function HomePage() {
  useEffect(() => {
    const ctx = gsap.context(() => {
      // HERO parallax (muovili insieme, elegante, niente sovrapposizioni strane)
      gsap.to([".hero-title", ".hero-subtitle-container"], {
        y: 30,
        ease: "none",
        scrollTrigger: {
          trigger: ".hero",
          start: "top top",
          end: "bottom top",
          scrub: true,
          invalidateOnRefresh: true
        }
      });

      // Skills card entry
      gsap.from(".skills-card", {
        y: 40,
        opacity: 0,
        duration: 1.1,
        ease: "power3.out",
        scrollTrigger: {
          trigger: ".skills-card",
          start: "top 75%",
          toggleActions: "play none none reverse",
          invalidateOnRefresh: true
        }
      });

      // Project cards: parallax image + fade in
      gsap.utils.toArray(".project-card").forEach((card) => {
        const image = card.querySelector(".project-image");

        if (image) {
          gsap.to(image, {
            y: -50,
            ease: "none",
            scrollTrigger: {
              trigger: card,
              start: "top bottom",
              end: "bottom top",
              scrub: true,
              invalidateOnRefresh: true
            }
          });
        }

        gsap.from(card, {
          opacity: 0,
          y: 40,
          duration: 0.9,
          ease: "power2.out",
          scrollTrigger: {
            trigger: card,
            start: "top 85%",
            toggleActions: "play none none reverse",
            invalidateOnRefresh: true
          }
        });
      });

      // Menu hide/show on scroll (come prima)
      let last = window.scrollY;
      const menu = document.querySelector(".site-menu");

      const onScroll = () => {
        const st = window.scrollY;
        if (!menu) return;

        if (st > last && st > 100) {
          menu.style.transform = "translateY(-120%)";
          menu.style.opacity = "0";
        } else {
          menu.style.transform = "translateY(0)";
          menu.style.opacity = "1";
        }
        last = st <= 0 ? 0 : st;
      };

      window.addEventListener("scroll", onScroll);

      // cleanup listener quando smonti pagina
      return () => window.removeEventListener("scroll", onScroll);
    });

    // IMPORTANTISSIMO: refresh dopo mount + immagini
    const t = setTimeout(() => ScrollTrigger.refresh(), 150);

    // refresh anche quando tutte le risorse sono caricate
    const onLoad = () => ScrollTrigger.refresh();
    window.addEventListener("load", onLoad);

    return () => {
      clearTimeout(t);
      window.removeEventListener("load", onLoad);
      ctx.revert();
    };
  }, []);

  return (
    <>
      <ThreeScrollScene />

      {/* HERO */}
      <section className="panel hero">
        <h1 className="hero-title">ROTARU BIANCA</h1>

        <div className="hero-subtitle-container">
          <p className="hero-subtitle">
            CREATIVE DEVELOPER<br />
            3D & INTERACTIVE EXPERIENCES
          </p>
        </div>
      </section>

      {/* ABOUT + SKILLS */}
      <section id="about" className="panel panel-skills">
        <div className="about-content">
          <h2>About Me</h2>
          <p>
            La mia passione per la programmazione è nata a 14 anni, iniziando con il <strong>design web</strong> e la
            creazione di siti semplici. Fin dai primi progetti, il mio obiettivo principale è stato <strong>applicare le
              conoscenze acquisite al web development</strong>, anche quando il percorso scolastico mi portava su altri
            insegnamenti.
          </p>
          <br />
          <p>
            Durante gli anni scolastici ho imparato linguaggi come <strong>C++, C# e Java</strong>, sviluppando un
            <strong>metodo di problem solving</strong> e un approccio strutturato al ragionamento.
          </p>
          <br />
          <p>
            Ho approfondito <strong>SQL, JavaScript e PHP</strong>, utilizzandoli principalmente per costruire la
            <strong>parte amministrativa e gestionale dei siti web</strong>. Pur prestando attenzione all'esperienza
            dell'utente, la mia esplorazione si concentrava soprattutto nel <strong>mondo nascosto del web</strong>.
          </p>
          <br />
          <p>
            Durante la mia esperienza lavorativa ho sviluppato progetti di <strong>software development per la realtà
              virtuale</strong>, coltivando una passione per il <strong>mondo 3D</strong>.
          </p>
          <br />
          <p>
            Oggi desidero <strong>unire le competenze web e immersive</strong> per creare esperienze digitali innovative,
            combinando <strong>web, 3D e realtà virtuale</strong>.
          </p>
        </div>

        <div className="skills-card">
          <h3>Skills</h3>
          <ul className="skills-list">
            <li><strong>Web Development</strong><span>React, JS, CSS, PHP</span></li>
            <li><strong>3D & VR</strong><span>Unity, Blender, XR</span></li>
            <li><strong>Software</strong><span>C#, Java, C++</span></li>
          </ul>
        </div>
      </section>

      {/* PROJECTS */}
      <section id="projects" className="panel">
        <h2>Projects</h2>
        <br />
        <div className="projects-container">
          {projects.map((p) => (
            <Link key={p.id} to={`/projects/${p.id}`} className="project-link">
              <div className="project-card">
                <div className="project-image" style={{ backgroundImage: `url(${p.cover})` }} />
                <div className="project-text">
                  <h3>{p.title}</h3>
                  <p>{p.subtitle}</p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* CONTACT */}
      <section id="contact" className="panel panel-contact">
        <div className="contact-content">
          <h2>Contact Me</h2>
          <p>
            Sono attualmente alla ricerca di nuove opportunità nel <strong>web development</strong>,
            con particolare interesse per progetti che uniscano <strong>design, interazione e tecnologia</strong>.
          </p>

          <p>
            Se pensi che il mio profilo possa essere adatto al tuo team o a un progetto,
            sarò felice di parlarne.
          </p>
          <p>
            <strong>Cellulare: +39 345 242 1558
              <br />
                E-mail: bianca.rotaru.a@gmail.com
            </strong>
          </p>
        </div>

        <div className="contact-form-card">
          <form action="https://formspree.io/f/mnjjjqov" method="POST">
            <label>
              Name
              <input name="name" type="text" placeholder="Your name" required />
            </label>

            <label>
              Email
              <input name="email" type="email" placeholder="Your email" required />
            </label>

            <label>
              Message
              <textarea name="message" placeholder="Tell me about your project" rows="4" required />
            </label>

            <button type="submit">Send Message</button>
          </form>
        </div>
      </section>
    </>
  );
}
