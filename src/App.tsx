import { BrowserRouter, Routes, Route, NavLink } from "react-router-dom";
import AdminGuard from "./admin/components/AdminGuard";
import AdminLogin from "./admin/pages/AdminLogin";
import AdminDashboard from "./admin/pages/AdminDashboard";
import {
  HeartPulse,
  Menu,
  X,
  MessageCircle,
  ArrowRight,
  ShieldCheck,
  Activity,
  Stethoscope,
  Apple,
  Baby,
  Brain,
  Siren,
  Play,
} from "lucide-react";
import { useState } from "react";
import "./index.css";

const categories = [
  { name: "Malaria Prevention", icon: ShieldCheck },
  { name: "Nutrition & Diet", icon: Apple },
  { name: "Diabetes", icon: Activity },
  { name: "Hypertension", icon: HeartPulse },
  { name: "Child Health", icon: Baby },
  { name: "Mental Health", icon: Brain },
  { name: "First Aid", icon: Siren },
  { name: "Community Health", icon: Stethoscope },
];

function Header() {
  const [open, setOpen] = useState(false);

  const links = [
    ["Home", "/"],
    ["Health Talks", "/talks"],
    ["Videos", "/videos"],
    ["Audio Talks", "/audio"],
    ["Articles", "/articles"],
    ["About", "/about"],
    ["Contact", "/contact"],
  ];

  return (
    <header className="site-header">
      <div className="container nav-container">
        <NavLink to="/" className="brand" onClick={() => setOpen(false)}>
          <span className="brand-icon">
            <HeartPulse size={24} />
          </span>
          <span>
            <strong>PUNUTIE</strong>
            <small>HEALTH TEACHER</small>
          </span>
        </NavLink>

        <button
          className="mobile-menu"
          onClick={() => setOpen(!open)}
          aria-label="Toggle menu"
        >
          {open ? <X /> : <Menu />}
        </button>

        <nav className={open ? "main-nav open" : "main-nav"}>
          {links.map(([label, path]) => (
            <NavLink
              key={path}
              to={path}
              onClick={() => setOpen(false)}
              className={({ isActive }) => (isActive ? "active" : "")}
            >
              {label}
            </NavLink>
          ))}
        </nav>

        <a
          className="header-whatsapp"
          href="https://wa.me/"
          target="_blank"
          rel="noreferrer"
        >
          <MessageCircle size={18} />
          WhatsApp
        </a>
      </div>
    </header>
  );
}

function Home() {
  return (
    <>
      <section className="hero">
        <div className="container hero-grid">
          <div className="hero-copy">
            <div className="eyebrow">
              <HeartPulse size={17} />
              Community Health Education
            </div>

            <h1>
              Better health begins with{" "}
              <span>better knowledge.</span>
            </h1>

            <p>
              Welcome to PUNUTIE HEALTH TEACHER — a community-focused
              platform sharing practical health education, prevention tips,
              wellness guidance and trusted health information.
            </p>

            <div className="hero-actions">
              <NavLink to="/talks" className="btn btn-primary">
                Explore Health Talks
                <ArrowRight size={18} />
              </NavLink>

              <NavLink to="/about" className="btn btn-secondary">
                Meet the Health Teacher
              </NavLink>
            </div>

            <div className="hero-trust">
              <div>
                <ShieldCheck size={20} />
                <span>Education-focused</span>
              </div>
              <div>
                <Activity size={20} />
                <span>Prevention-focused</span>
              </div>
            </div>
          </div>

          <div className="hero-profile">
            <div className="profile-ring">
              <div className="profile-placeholder">
                <HeartPulse size={90} />
                <span>Punutie</span>
                <small>Health Teacher</small>
              </div>
            </div>

            <div className="floating-card floating-card-one">
              <HeartPulse size={20} />
              <span>
                <strong>Today's Health Tip</strong>
                Stay informed. Stay prepared.
              </span>
            </div>

            <div className="floating-card floating-card-two">
              <ShieldCheck size={20} />
              Trusted Health Education
            </div>
          </div>
        </div>
      </section>

      <section className="stats-section">
        <div className="container stats-grid">
          <div>
            <strong>Daily</strong>
            <span>Health Education</span>
          </div>
          <div>
            <strong>8+</strong>
            <span>Health Categories</span>
          </div>
          <div>
            <strong>Text</strong>
            <span>Audio & Video</span>
          </div>
          <div>
            <strong>Community</strong>
            <span>Focused Care</span>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="section-heading">
            <div>
              <span className="section-label">Explore</span>
              <h2>Health topics that matter</h2>
            </div>
            <p>
              Simple educational resources designed to help you understand
              important health topics.
            </p>
          </div>

          <div className="category-grid">
            {categories.map((category) => {
              const Icon = category.icon;

              return (
                <NavLink
                  to="/talks"
                  className="category-card"
                  key={category.name}
                >
                  <span className="category-icon">
                    <Icon size={23} />
                  </span>
                  <span>{category.name}</span>
                  <ArrowRight size={17} />
                </NavLink>
              );
            })}
          </div>
        </div>
      </section>

      <section className="section featured-section">
        <div className="container">
          <div className="section-heading">
            <div>
              <span className="section-label">Featured</span>
              <h2>Today's health talk</h2>
            </div>
            <NavLink to="/talks" className="text-link">
              View all talks <ArrowRight size={16} />
            </NavLink>
          </div>

          <article className="featured-card">
            <div className="featured-image">
              <HeartPulse size={65} />
            </div>

            <div className="featured-content">
              <span className="tag">Community Health</span>
              <h3>Small health habits can make a big difference</h3>
              <p>
                Learn practical ways to make healthier choices part of your
                everyday routine.
              </p>

              <NavLink to="/talks" className="btn btn-primary small">
                Read Health Talk
                <ArrowRight size={17} />
              </NavLink>
            </div>
          </article>
        </div>
      </section>

      <section className="section video-section">
        <div className="container">
          <div className="section-heading">
            <div>
              <span className="section-label">Watch & Learn</span>
              <h2>Health videos</h2>
            </div>
            <NavLink to="/videos" className="text-link">
              View videos <ArrowRight size={16} />
            </NavLink>
          </div>

          <div className="video-card">
            <div className="video-placeholder">
              <button aria-label="Play video">
                <Play size={30} fill="currentColor" />
              </button>
              <span>Health education video</span>
            </div>

            <div className="video-info">
              <span className="tag">Health Education</span>
              <h3>Learn, understand and take action</h3>
              <p>
                Watch educational health content from PUNUTIE HEALTH TEACHER.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="tip-section">
        <div className="container tip-box">
          <div className="tip-icon">
            <HeartPulse size={30} />
          </div>
          <div>
            <span>Today's Health Tip</span>
            <h2>Don't ignore changes in your health.</h2>
            <p>
              If something concerns you, seek advice from a qualified
              healthcare professional.
            </p>
          </div>
        </div>
      </section>

      <section className="cta-section">
        <div className="container cta-box">
          <div>
            <span className="section-label">Have a question?</span>
            <h2>Ask the Health Teacher</h2>
            <p>
              Send your health education question privately through our
              question form.
            </p>
          </div>
          <NavLink to="/contact" className="btn btn-light">
            Ask a Question
            <ArrowRight size={18} />
          </NavLink>
        </div>
      </section>
    </>
  );
}

function SimplePage({ title, description }: { title: string; description: string }) {
  return (
    <main className="simple-page">
      <div className="container">
        <span className="section-label">PUNUTIE HEALTH TEACHER</span>
        <h1>{title}</h1>
        <p>{description}</p>
        <NavLink to="/" className="btn btn-primary">
          Back Home <ArrowRight size={18} />
        </NavLink>
      </div>
    </main>
  );
}

function Footer() {
  return (
    <footer className="footer">
      <div className="container footer-grid">
        <div>
          <div className="brand footer-brand">
            <span className="brand-icon">
              <HeartPulse size={22} />
            </span>
            <span>
              <strong>PUNUTIE</strong>
              <small>HEALTH TEACHER</small>
            </span>
          </div>
          <p>
            Community health education and consultancy focused on helping
            people make informed health decisions.
          </p>
        </div>

        <div>
          <h3>Explore</h3>
          <NavLink to="/talks">Health Talks</NavLink>
          <NavLink to="/videos">Videos</NavLink>
          <NavLink to="/audio">Audio Talks</NavLink>
          <NavLink to="/articles">Articles</NavLink>
        </div>

        <div>
          <h3>Important</h3>
          <NavLink to="/about">About</NavLink>
          <NavLink to="/contact">Contact</NavLink>
        </div>
      </div>

      <div className="container footer-bottom">
        <p>
          Information provided on this website is for educational purposes
          only and should not replace professional medical diagnosis,
          treatment, or emergency care.
        </p>
        <span>© {new Date().getFullYear()} PUNUTIE HEALTH TEACHER</span>
      </div>
    </footer>
  );
}

function App() {
  return (
    <BrowserRouter>
      <Header />

      <Routes>
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route element={<AdminGuard />}>
          <Route path="/admin" element={<AdminDashboard />} />
        </Route>
        <Route path="/" element={<Home />} />
        <Route
          path="/talks"
          element={
            <SimplePage
              title="Health Talks"
              description="Practical health education talks will appear here."
            />
          }
        />
        <Route
          path="/videos"
          element={
            <SimplePage
              title="Health Videos"
              description="Watch health education videos and professional health discussions."
            />
          }
        />
        <Route
          path="/audio"
          element={
            <SimplePage
              title="Audio Talks"
              description="Listen to health education talks and voice messages."
            />
          }
        />
        <Route
          path="/articles"
          element={
            <SimplePage
              title="Health Articles"
              description="Read educational articles covering important community health topics."
            />
          }
        />
        <Route
          path="/about"
          element={
            <SimplePage
              title="About the Health Teacher"
              description="Learn more about PUNUTIE HEALTH TEACHER and its mission."
            />
          }
        />
        <Route
          path="/contact"
          element={
            <SimplePage
              title="Contact"
              description="Contact PUNUTIE HEALTH TEACHER or submit a private health question."
            />
          }
        />
      </Routes>

      <a
        className="floating-whatsapp"
        href="https://wa.me/"
        target="_blank"
        rel="noreferrer"
        aria-label="Chat on WhatsApp"
      >
        <MessageCircle size={25} />
      </a>

      <Footer />
    </BrowserRouter>
  );
}

export default App;
