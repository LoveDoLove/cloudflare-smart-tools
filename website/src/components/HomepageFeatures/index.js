import clsx from "clsx";
import Heading from "@theme/Heading";
import styles from "./styles.module.css";

const FeatureList = [
  {
    title: "Bypass Cache Rules",
    Svg: require("@site/static/img/undraw_docusaurus_mountain.svg").default,
    description: (
      <>
        Copy-paste friendly Cloudflare cache bypass rules for WordPress,
        Laravel, ASP.NET, and generic web apps.
        <br />
        <a href="/docs/cf-bypass-cache">Learn more &rarr;</a>
      </>
    ),
  },
  {
    title: "Smart Cache (WordPress)",
    Svg: require("@site/static/img/undraw_docusaurus_tree.svg").default,
    description: (
      <>
        Advanced WordPress plugin for edge HTML caching, automatic purging,
        admin controls, and logging.
        <br />
        <a href="/docs/cf-smart-cache">Learn more &rarr;</a>
      </>
    ),
  },
  {
    title: "Smart Cache Workers",
    Svg: require("@site/static/img/undraw_docusaurus_react.svg").default,
    description: (
      <>
        Legacy Cloudflare Worker scripts for smart cache. <b>Deprecated</b> in
        favor of modular, maintainable solutions.
        <br />
        <a href="/docs/cf-smart-cache-workers">Learn more &rarr;</a>
      </>
    ),
  },
];

function Feature({ Svg, title, description }) {
  return (
    <div className={clsx("col col--4")}>
      <div className="text--center">
        <Svg className={styles.featureSvg} role="img" />
      </div>
      <div className="text--center padding-horiz--md">
        <Heading as="h3">{title}</Heading>
        <p>{description}</p>
      </div>
    </div>
  );
}

export default function HomepageFeatures() {
  return (
    <section className={styles.features}>
      <div className="container">
        <div className="row">
          {FeatureList.map((props, idx) => (
            <Feature key={idx} {...props} />
          ))}
        </div>
      </div>
    </section>
  );
}
