import { Link } from "react-router-dom";
import { RiLeafLine } from "react-icons/ri";
import { FiArrowRight, FiShield, FiFileText, FiActivity, FiSettings } from "react-icons/fi";
import heroImg from "../assets/carbon_hero_illustration.png";

function LandingPage() {
  const containerStyle = {
    minHeight: "100vh",
    backgroundColor: "var(--bg-app)",
    fontFamily: "var(--font-sans)",
    display: "flex",
    flexDirection: "column",
  };

  const headerStyle = {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "20px 8%",
    backgroundColor: "rgba(255, 255, 255, 0.8)",
    backdropFilter: "blur(12px)",
    position: "sticky",
    top: 0,
    zIndex: 100,
    borderBottom: "1px solid var(--border-color)",
  };

  const logoStyle = {
    display: "flex",
    alignItems: "center",
    gap: "10px",
    textDecoration: "none",
    color: "var(--text-main)",
    fontSize: "1.3rem",
    fontWeight: "700",
  };

  const navLinksStyle = {
    display: "flex",
    gap: "30px",
    alignItems: "center",
  };

  const navLinkItemStyle = {
    textDecoration: "none",
    color: "var(--text-muted)",
    fontWeight: "550",
    fontSize: "0.95rem",
    transition: "color 0.2s ease",
    cursor: "pointer",
  };

  const actionButtonsStyle = {
    display: "flex",
    gap: "15px",
    alignItems: "center",
  };

  const heroSectionStyle = {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "80px 8%",
    gap: "50px",
    flexWrap: "wrap",
  };

  const heroTextStyle = {
    flex: 1,
    minWidth: "300px",
    display: "flex",
    flexDirection: "column",
    gap: "24px",
  };

  const heroHeadingStyle = {
    fontSize: "3.2rem",
    fontWeight: "800",
    lineHeight: 1.15,
    color: "var(--text-main)",
    letterSpacing: "-0.03em",
  };

  const heroSubStyle = {
    fontSize: "1.15rem",
    color: "var(--text-muted)",
    lineHeight: "1.7",
    maxWidth: "540px",
  };

  const heroImgContainerStyle = {
    flex: 1,
    minWidth: "300px",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  };

  const heroImageStyle = {
    maxWidth: "100%",
    maxHeight: "450px",
    borderRadius: "20px",
    boxShadow: "var(--shadow-lg)",
  };

  const sectionStyle = {
    padding: "100px 8%",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: "50px",
  };

  const sectionHeaderStyle = {
    textAlign: "center",
    display: "flex",
    flexDirection: "column",
    gap: "12px",
    maxWidth: "600px",
  };

  const featuresGridStyle = {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
    gap: "30px",
    width: "100%",
  };

  const featureCardStyle = {
    backgroundColor: "white",
    border: "1px solid var(--border-color)",
    borderRadius: "16px",
    padding: "32px",
    display: "flex",
    flexDirection: "column",
    gap: "16px",
    transition: "transform 0.2s ease, box-shadow 0.2s ease",
    boxShadow: "var(--shadow-sm)",
  };

  const featureIconWrapperStyle = {
    width: "48px",
    height: "48px",
    borderRadius: "12px",
    backgroundColor: "var(--accent-light)",
    color: "var(--accent-color)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  };

  const advantageCardStyle = {
    backgroundColor: "white",
    border: "1px solid var(--border-color)",
    borderRadius: "16px",
    padding: "32px",
    display: "flex",
    alignItems: "flex-start",
    gap: "20px",
    boxShadow: "var(--shadow-sm)",
    width: "100%",
    maxWidth: "800px",
  };

  const ctaSectionStyle = {
    backgroundColor: "var(--bg-sidebar)",
    color: "white",
    padding: "80px 8%",
    textAlign: "center",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: "30px",
    position: "relative",
    overflow: "hidden",
  };

  return (
    <div style={containerStyle}>
      {/* Navigation Header */}
      <header style={headerStyle}>
        <Link to="/" style={logoStyle}>
          <RiLeafLine size={26} color="var(--accent-color)" />
          <span>Carbon Audit</span>
        </Link>

        <nav style={navLinksStyle}>
          <a href="#features" style={navLinkItemStyle}>Features</a>
          <a href="#advantages" style={navLinkItemStyle}>Advantages</a>
          <a href="#about" style={navLinkItemStyle}>About</a>
        </nav>

        <div style={actionButtonsStyle}>
          <Link to="/login" className="btn-secondary" style={{ height: "42px", padding: "0 22px" }}>
            Sign In
          </Link>
          <Link to="/register" className="btn-primary" style={{ height: "42px", padding: "0 22px" }}>
            Get Started
          </Link>
        </div>
      </header>

      {/* Hero Section */}
      <section style={heroSectionStyle}>
        <div style={heroTextStyle}>
          <h1 style={heroHeadingStyle}>
            Decarbonize Your Organization with <span style={{ color: "var(--accent-color)" }}>Intelligence</span>
          </h1>
          <p style={heroSubStyle}>
            A fully-automated auditing and verification platform to track emissions, manage compliance, and build environmental accountability.
          </p>
          <div style={{ display: "flex", gap: "15px", flexWrap: "wrap", marginTop: "10px" }}>
            <Link to="/register" className="btn-primary" style={{ height: "48px", padding: "0 28px", fontSize: "1rem" }}>
              Start Free Trial <FiArrowRight style={{ marginLeft: "6px" }} />
            </Link>
            <a href="#features" className="btn-secondary" style={{ height: "48px", padding: "0 28px", fontSize: "1rem" }}>
              Explore Features
            </a>
          </div>
        </div>
        <div style={heroImgContainerStyle}>
          <img src={heroImg} alt="Carbon Audit Platform Hero" style={heroImageStyle} />
        </div>
      </section>

      {/* Features Section */}
      <section id="features" style={{ ...sectionStyle, backgroundColor: "white" }}>
        <div style={sectionHeaderStyle}>
          <span style={{ color: "var(--accent-color)", fontWeight: "700", textTransform: "uppercase", fontSize: "0.85rem", letterSpacing: "0.08em" }}>
            Platform Features
          </span>
          <h2 style={{ fontSize: "2.2rem", fontWeight: "700" }}>Advanced Carbon Accounting Tools</h2>
          <p style={{ color: "var(--text-muted)", fontSize: "1.05rem" }}>
            Everything you need to audit, verify, and document environmental footprint disclosures in one modern dashboard.
          </p>
        </div>

        <div style={featuresGridStyle}>
          <div style={featureCardStyle} className="premium-card">
            <div style={featureIconWrapperStyle}>
              <FiSettings size={22} />
            </div>
            <h3 style={{ fontSize: "1.25rem", fontWeight: "600" }}>Automated Data Tracking</h3>
            <p style={{ color: "var(--text-muted)", fontSize: "0.92rem", lineHeight: "1.6" }}>
              Log activity data, define specific emission categories, and apply calculated emission factors automatically.
            </p>
          </div>

          <div style={featureCardStyle} className="premium-card">
            <div style={featureIconWrapperStyle}>
              <FiShield size={22} />
            </div>
            <h3 style={{ fontSize: "1.25rem", fontWeight: "600" }}>Independent Auditing</h3>
            <p style={{ color: "var(--text-muted)", fontSize: "0.92rem", lineHeight: "1.6" }}>
              Seamless verification flow where certified auditors review, comment on, and approve or reject submissions.
            </p>
          </div>

          <div style={featureCardStyle} className="premium-card">
            <div style={featureIconWrapperStyle}>
              <FiFileText size={22} />
            </div>
            <h3 style={{ fontSize: "1.25rem", fontWeight: "600" }}>Monthly Automated Reports</h3>
            <p style={{ color: "var(--text-muted)", fontSize: "0.92rem", lineHeight: "1.6" }}>
              No manual report compiling needed. Reports are automatically structured, certified, and ready to download on the 1st of every month.
            </p>
          </div>

          <div style={featureCardStyle} className="premium-card">
            <div style={featureIconWrapperStyle}>
              <FiActivity size={22} />
            </div>
            <h3 style={{ fontSize: "1.25rem", fontWeight: "600" }}>Visual Analytics</h3>
            <p style={{ color: "var(--text-muted)", fontSize: "0.92rem", lineHeight: "1.6" }}>
              Gain clear insights into emission spikes and trends with detailed, interactive analytics and dashboards.
            </p>
          </div>
        </div>
      </section>

      {/* Advantages Section */}
      <section id="advantages" style={sectionStyle}>
        <div style={sectionHeaderStyle}>
          <span style={{ color: "var(--accent-color)", fontWeight: "700", textTransform: "uppercase", fontSize: "0.85rem", letterSpacing: "0.08em" }}>
            The Carbon Audit Edge
          </span>
          <h2 style={{ fontSize: "2.2rem", fontWeight: "700" }}>Key Platform Advantages</h2>
          <p style={{ color: "var(--text-muted)", fontSize: "1.05rem" }}>
            Why leading companies and environmental auditors prefer our automated ledger system.
          </p>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "25px", width: "100%", alignItems: "center" }}>
          <div style={advantageCardStyle} className="premium-card">
            <div style={{ ...featureIconWrapperStyle, borderRadius: "50%" }}>
              <span style={{ fontWeight: "700" }}>01</span>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
              <h3 style={{ fontSize: "1.2rem", fontWeight: "600" }}>100% Fully Automated Schedules</h3>
              <p style={{ color: "var(--text-muted)", fontSize: "0.95rem", lineHeight: "1.6" }}>
                Say goodbye to manually formatting files. Our background scheduler processes all vendor submissions, compiles carbon math, and creates PDF statements instantly on a monthly cycle.
              </p>
            </div>
          </div>

          <div style={advantageCardStyle} className="premium-card">
            <div style={{ ...featureIconWrapperStyle, borderRadius: "50%" }}>
              <span style={{ fontWeight: "700" }}>02</span>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
              <h3 style={{ fontSize: "1.2rem", fontWeight: "600" }}>Verified Chain of Custody</h3>
              <p style={{ color: "var(--text-muted)", fontSize: "0.95rem", lineHeight: "1.6" }}>
                Reports contain verified independent audit outcomes. Submissions receive digital approval stamps from licensed auditor users, guaranteeing public credibility and compliance assurance.
              </p>
            </div>
          </div>

          <div style={advantageCardStyle} className="premium-card">
            <div style={{ ...featureIconWrapperStyle, borderRadius: "50%" }}>
              <span style={{ fontWeight: "700" }}>03</span>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
              <h3 style={{ fontSize: "1.2rem", fontWeight: "600" }}>Enhanced Search & Filtering</h3>
              <p style={{ color: "var(--text-muted)", fontSize: "0.95rem", lineHeight: "1.6" }}>
                Retrieve historical logs in milliseconds. Dynamic month selectors allow sorting reports instantly, keeping your compliance records completely organized for internal or regulatory reviews.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA / Signup Callout */}
      <section style={ctaSectionStyle}>
        <div style={{ zIndex: 2 }}>
          <h2 style={{ fontSize: "2.8rem", fontWeight: "800", color: "white", marginBottom: "16px", letterSpacing: "-0.02em" }}>
            Ready to Automate Your Carbon Audit?
          </h2>
          <p style={{ color: "rgba(255,255,255,0.7)", fontSize: "1.1rem", marginBottom: "35px", maxWidth: "600px", marginInline: "auto" }}>
            Sign up now and transform how your company processes environmental disclosures and auditor certifications.
          </p>
          <div style={{ display: "flex", gap: "20px", justifyContent: "center", flexWrap: "wrap" }}>
            <Link to="/register" className="btn-primary" style={{ backgroundColor: "#10b981", height: "52px", padding: "0 36px", fontSize: "1.05rem" }}>
              Create Account
            </Link>
            <Link to="/login" className="btn-secondary" style={{ backgroundColor: "transparent", color: "white", borderColor: "rgba(255,255,255,0.3)", height: "52px", padding: "0 36px", fontSize: "1.05rem" }}>
              Sign In Now
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer style={{ backgroundColor: "var(--bg-sidebar)", borderTop: "1px solid rgba(255,255,255,0.06)", padding: "30px 8%", display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: "20px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "10px", color: "white", fontWeight: "600" }}>
          <RiLeafLine size={20} color="#10b981" />
          <span>Carbon Audit Platform</span>
        </div>
        <p style={{ color: "rgba(255,255,255,0.4)", fontSize: "0.85rem" }}>
          &copy; {new Date().getFullYear()} Carbon Audit. All rights reserved.
        </p>
      </footer>
    </div>
  );
}

export default LandingPage;
