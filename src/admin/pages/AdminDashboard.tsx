import { useEffect, useState } from "react";
import {
  LayoutDashboard,
  FileText,
  Video,
  Headphones,
  Lightbulb,
  FolderOpen,
  UserRound,
  MessageSquare,
  BarChart3,
  Settings,
  LogOut,
  Menu,
  X,
  ExternalLink,
} from "lucide-react";
import { supabase } from "../../lib/supabase";

type MenuItem = {
  label: string;
  icon: typeof LayoutDashboard;
};

const menuItems: MenuItem[] = [
  { label: "Dashboard", icon: LayoutDashboard },
  { label: "Health Talks", icon: FileText },
  { label: "Videos", icon: Video },
  { label: "Audio Talks", icon: Headphones },
  { label: "Health Tips", icon: Lightbulb },
  { label: "Categories", icon: FolderOpen },
  { label: "Health Profile", icon: UserRound },
  { label: "Questions", icon: MessageSquare },
  { label: "Analytics", icon: BarChart3 },
  { label: "Settings", icon: Settings },
];

export default function AdminDashboard() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [active, setActive] = useState("Dashboard");
  const [stats, setStats] = useState({
    posts: 0,
    videos: 0,
    audio: 0,
    questions: 0,
  });

  useEffect(() => {
    async function loadStats() {
      const [posts, videos, audio, questions] = await Promise.all([
        supabase
          .from("posts")
          .select("id", { count: "exact", head: true }),
        supabase
          .from("videos")
          .select("id", { count: "exact", head: true }),
        supabase
          .from("audio_talks")
          .select("id", { count: "exact", head: true }),
        supabase
          .from("health_questions")
          .select("id", { count: "exact", head: true }),
      ]);

      setStats({
        posts: posts.count ?? 0,
        videos: videos.count ?? 0,
        audio: audio.count ?? 0,
        questions: questions.count ?? 0,
      });
    }

    loadStats();
  }, []);

  async function signOut() {
    await supabase.auth.signOut();
    window.location.href = "/admin/login";
  }

  return (
    <div className="admin-shell">
      <aside className={`admin-sidebar ${sidebarOpen ? "open" : ""}`}>
        <div className="admin-brand">
          <div className="admin-brand-mark">P</div>
          <div>
            <strong>PUNUTIE</strong>
            <span>HEALTH TEACHER</span>
          </div>

          <button
            className="admin-mobile-close"
            onClick={() => setSidebarOpen(false)}
            aria-label="Close menu"
          >
            <X size={22} />
          </button>
        </div>

        <nav className="admin-nav">
          {menuItems.map((item) => {
            const Icon = item.icon;

            return (
              <button
                key={item.label}
                className={`admin-nav-item ${
                  active === item.label ? "active" : ""
                }`}
                onClick={() => {
                  setActive(item.label);
                  setSidebarOpen(false);
                }}
              >
                <Icon size={19} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>

        <div className="admin-sidebar-bottom">
          <a href="/" className="admin-public-link">
            <ExternalLink size={17} />
            View public website
          </a>

          <button className="admin-signout" onClick={signOut}>
            <LogOut size={17} />
            Sign out
          </button>
        </div>
      </aside>

      {sidebarOpen && (
        <button
          className="admin-overlay"
          onClick={() => setSidebarOpen(false)}
          aria-label="Close sidebar"
        />
      )}

      <main className="admin-main">
        <header className="admin-topbar">
          <button
            className="admin-menu-button"
            onClick={() => setSidebarOpen(true)}
            aria-label="Open menu"
          >
            <Menu size={22} />
          </button>

          <div>
            <p className="admin-topbar-label">ADMINISTRATION</p>
            <h1>{active}</h1>
          </div>

          <div className="admin-topbar-profile">
            <div className="admin-avatar">P</div>
            <div>
              <strong>Punutie</strong>
              <span>Administrator</span>
            </div>
          </div>
        </header>

        <div className="admin-content">
          {active === "Dashboard" ? (
            <>
              <section className="admin-welcome">
                <div>
                  <span className="admin-welcome-label">
                    HEALTH EDUCATION CONTROL CENTER
                  </span>
                  <h2>Welcome back, Punutie 👋</h2>
                  <p>
                    Manage your health education content, media, visitor
                    questions and website information from one place.
                  </p>
                </div>

                <a href="/" className="admin-view-site">
                  View website
                  <ExternalLink size={16} />
                </a>
              </section>

              <section className="admin-stat-grid">
                <StatCard
                  icon={<FileText />}
                  label="Health Talks"
                  value={stats.posts}
                  description="Total posts"
                />

                <StatCard
                  icon={<Video />}
                  label="Videos"
                  value={stats.videos}
                  description="Uploaded videos"
                />

                <StatCard
                  icon={<Headphones />}
                  label="Audio Talks"
                  value={stats.audio}
                  description="Audio resources"
                />

                <StatCard
                  icon={<MessageSquare />}
                  label="Questions"
                  value={stats.questions}
                  description="Visitor questions"
                />
              </section>

              <section className="admin-dashboard-columns">
                <div className="admin-panel">
                  <div className="admin-panel-heading">
                    <div>
                      <span>CONTENT MANAGEMENT</span>
                      <h3>Quick actions</h3>
                    </div>
                  </div>

                  <div className="admin-quick-grid">
                    <QuickAction
                      icon={<FileText />}
                      title="New Health Talk"
                      onClick={() => setActive("Health Talks")}
                    />

                    <QuickAction
                      icon={<Video />}
                      title="Add Video"
                      onClick={() => setActive("Videos")}
                    />

                    <QuickAction
                      icon={<Headphones />}
                      title="Add Audio"
                      onClick={() => setActive("Audio Talks")}
                    />

                    <QuickAction
                      icon={<Lightbulb />}
                      title="Health Tip"
                      onClick={() => setActive("Health Tips")}
                    />
                  </div>
                </div>

                <div className="admin-panel">
                  <div className="admin-panel-heading">
                    <div>
                      <span>WEBSITE</span>
                      <h3>Management areas</h3>
                    </div>
                  </div>

                  <div className="admin-management-list">
                    <ManagementItem
                      icon={<UserRound />}
                      title="Health Profile"
                      description="Update your public profile"
                      onClick={() => setActive("Health Profile")}
                    />

                    <ManagementItem
                      icon={<MessageSquare />}
                      title="Visitor Questions"
                      description="Review questions from visitors"
                      onClick={() => setActive("Questions")}
                    />

                    <ManagementItem
                      icon={<Settings />}
                      title="Website Settings"
                      description="Contact and social information"
                      onClick={() => setActive("Settings")}
                    />
                  </div>
                </div>
              </section>

              <section className="admin-panel admin-security-panel">
                <div className="admin-security-icon">
                  <BarChart3 size={22} />
                </div>
                <div>
                  <span>CONNECTED TO SUPABASE</span>
                  <h3>Secure administration is active</h3>
                  <p>
                    Your admin account is protected by Supabase
                    authentication and database row-level security.
                  </p>
                </div>
              </section>
            </>
          ) : (
            <section className="admin-empty-module">
              <div className="admin-empty-icon">
                {(() => {
                  const item = menuItems.find((x) => x.label === active);
                  const Icon = item?.icon ?? LayoutDashboard;
                  return <Icon size={30} />;
                })()}
              </div>

              <h2>{active}</h2>
              <p>
                The {active.toLowerCase()} management module will be connected
                to Supabase in the next build step.
              </p>
            </section>
          )}
        </div>
      </main>
    </div>
  );
}

function StatCard({
  icon,
  label,
  value,
  description,
}: {
  icon: React.ReactNode;
  label: string;
  value: number;
  description: string;
}) {
  return (
    <div className="admin-stat-card">
      <div className="admin-stat-icon">{icon}</div>
      <div>
        <span>{label}</span>
        <strong>{value}</strong>
        <small>{description}</small>
      </div>
    </div>
  );
}

function QuickAction({
  icon,
  title,
  onClick,
}: {
  icon: React.ReactNode;
  title: string;
  onClick: () => void;
}) {
  return (
    <button className="admin-quick-action" onClick={onClick}>
      <span>{icon}</span>
      <strong>{title}</strong>
    </button>
  );
}

function ManagementItem({
  icon,
  title,
  description,
  onClick,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
  onClick: () => void;
}) {
  return (
    <button className="admin-management-item" onClick={onClick}>
      <span>{icon}</span>
      <div>
        <strong>{title}</strong>
        <small>{description}</small>
      </div>
    </button>
  );
}
