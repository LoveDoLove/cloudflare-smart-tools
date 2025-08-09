import clsx from "clsx";
import Link from "@docusaurus/Link";
import useDocusaurusContext from "@docusaurus/useDocusaurusContext";
import Layout from "@theme/Layout";

import styles from "./index.module.css";

export default function Home() {
  return (
    <Layout
      title="Cloudflare Smart Tools"
      description="Documentation and tools for Cloudflare cache management, rules, and plugins."
    >
      <header className={clsx("hero hero--primary", styles.heroBanner)}>
        <div className="container">
          <h1 className="hero__title">Cloudflare Smart Tools</h1>
          <p className="hero__subtitle">
            Open-source tools and documentation for advanced Cloudflare cache
            management, rules, and plugins.
          </p>
          <div className={styles.buttons}>
            <Link
              className="button button--secondary button--lg"
              to="/docs/cf-bypass-cache"
            >
              Cloudflare Bypass Cache Rules
            </Link>
            <Link
              className="button button--secondary button--lg"
              to="/docs/cf-smart-cache"
            >
              Cloudflare Smart Cache (WordPress)
            </Link>
            <Link
              className="button button--secondary button--lg"
              to="/docs/cf-smart-cache-workers"
            >
              Cloudflare Smart Cache Workers
            </Link>
          </div>
        </div>
      </header>
      <main>
        <section className={styles.features} style={{ padding: "2rem 0" }}>
          <div className="container">
            <div className="row">
              <div className="col col--4">
                <h2>Bypass Cache Rules</h2>
                <p>
                  Copy-paste friendly Cloudflare cache bypass rules for
                  WordPress, Laravel, ASP.NET, and generic web apps. <br />
                  <Link to="/docs/cf-bypass-cache">Read more &rarr;</Link>
                </p>
              </div>
              <div className="col col--4">
                <h2>Smart Cache (WordPress)</h2>
                <p>
                  Advanced WordPress plugin for edge HTML caching, automatic
                  purging, admin controls, and logging.
                  <br />
                  <Link to="/docs/cf-smart-cache">Read more &rarr;</Link>
                </p>
              </div>
              <div className="col col--4">
                <h2>Smart Cache Workers</h2>
                <p>
                  Legacy Cloudflare Worker scripts for smart cache.{" "}
                  <b>Deprecated</b> in favor of modular, maintainable solutions.
                  <br />
                  <Link to="/docs/cf-smart-cache-workers">
                    Read more &rarr;
                  </Link>
                </p>
              </div>
            </div>
          </div>
        </section>
        <section style={{ background: "#f9f9f9", padding: "2rem 0" }}>
          <div className="container">
            <h2>Community & Support</h2>
            <ul>
              <li>
                <a
                  href="https://discord.com/invite/FyYEmtRCRE"
                  target="_blank"
                  rel="noopener"
                >
                  Discord
                </a>
              </li>
              <li>
                <a
                  href="https://github.com/LoveDoLove/"
                  target="_blank"
                  rel="noopener"
                >
                  GitHub
                </a>
              </li>
              <li>
                <a
                  href="https://t.me/lovedoloveofficialchannel"
                  target="_blank"
                  rel="noopener"
                >
                  Telegram Channel
                </a>
              </li>
            </ul>
          </div>
        </section>
      </main>
    </Layout>
  );
}
