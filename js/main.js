async function loadData() {
  const res = await fetch("data.json");
  if (!res.ok) throw new Error("Failed to load data.json");
  return res.json();
}

function el(tag, opts = {}) {
  const node = document.createElement(tag);
  if (opts.class) node.className = opts.class;
  if (opts.text) node.textContent = opts.text;
  if (opts.html) node.innerHTML = opts.html;
  if (opts.href) node.href = opts.href;
  if (opts.attrs) {
    for (const [k, v] of Object.entries(opts.attrs)) node.setAttribute(k, v);
  }
  return node;
}

function renderImageOrPlaceholder(container, src, alt, placeholderText) {
  if (src) {
    const img = el("img", { attrs: { src, alt } });
    img.addEventListener("error", () => {
      img.remove();
      container.appendChild(el("span", { class: "about-photo-placeholder project-thumb-placeholder", text: placeholderText }));
    });
    container.appendChild(img);
  } else {
    container.appendChild(el("span", { class: "about-photo-placeholder project-thumb-placeholder", text: placeholderText }));
  }
}

function renderNav(data) {
  document.getElementById("nav-name").textContent = data.nav.name;
  const links = document.getElementById("nav-links");
  data.nav.links.forEach((link) => {
    links.appendChild(el("a", { href: link.href, text: link.label }));
  });
}

function renderHero(data) {
  const hero = data.hero;
  const section = document.getElementById("hero");
  section.appendChild(el("span", { class: "label", text: hero.label }));
  section.appendChild(el("h1", { class: "hero-name", text: hero.name }));
  section.appendChild(el("p", { class: "hero-role", text: hero.role }));
  section.appendChild(el("p", { class: "hero-statement", text: hero.statement }));

  const actions = el("div", { class: "hero-actions" });
  actions.appendChild(el("a", { class: "btn btn-primary", href: hero.primaryCta.href, text: hero.primaryCta.label }));
  actions.appendChild(el("a", { class: "btn btn-secondary", href: hero.secondaryCta.href, text: hero.secondaryCta.label }));
  section.appendChild(actions);

  section.appendChild(el("p", { class: "hero-meta", text: `${hero.location}` }));
}

function renderAbout(data) {
  const about = data.about;
  const section = document.getElementById("about");
  section.appendChild(el("span", { class: "label", text: about.label }));

  const grid = el("div", { class: "about-grid" });

  const photoBox = el("div", { class: "about-photo" });
  renderImageOrPlaceholder(photoBox, about.photo, `${data.hero.name} photo`, "photo");
  grid.appendChild(photoBox);

  const textBox = el("div", { class: "about-text" });
  about.paragraphs.forEach((p) => textBox.appendChild(el("p", { text: p })));
  grid.appendChild(textBox);

  section.appendChild(grid);
}

function renderSkills(data) {
  const skills = data.skills;
  const section = document.getElementById("skills");
  section.appendChild(el("span", { class: "label", text: skills.label }));

  skills.categories.forEach((cat) => {
    const row = el("div", { class: "skills-row" });
    row.appendChild(el("span", { class: "skills-category", text: cat.name }));
    row.appendChild(el("span", { class: "skills-items", text: cat.items.join(" · ") }));
    section.appendChild(row);
  });
}

function renderProjects(data) {
  const projects = data.projects;
  const section = document.getElementById("projects");
  section.appendChild(el("span", { class: "label", text: projects.label }));

  projects.items.forEach((proj) => {
    const row = el("div", { class: "project-row" });

    const thumb = el("div", { class: "project-thumb" });
    renderImageOrPlaceholder(thumb, proj.photo, `${proj.name} screenshot`, "img");
    row.appendChild(thumb);

    const body = el("div", { class: "project-body" });

    const header = el("div", { class: "project-header" });
    const nameHeading = el("h3", { class: "project-name" });
    nameHeading.appendChild(el("a", { class: "project-name-link", href: proj.link, text: proj.name }));
    header.appendChild(nameHeading);
    const meta = el("div", { class: "project-meta" });
    meta.appendChild(el("span", { text: proj.year }));
    meta.appendChild(el("a", { class: "project-link", href: proj.link, text: "→" }));
    header.appendChild(meta);
    body.appendChild(header);

    body.appendChild(el("p", { class: "project-description", text: proj.description }));

    const outcomes = el("ul", { class: "project-outcomes" });
    proj.outcomes.forEach((o) => outcomes.appendChild(el("li", { text: o })));
    body.appendChild(outcomes);

    body.appendChild(el("p", { class: "project-tech", text: proj.tech.join(" · ") }));

    row.appendChild(body);
    section.appendChild(row);
  });
}

function renderExperience(data) {
  const experience = data.experience;
  const section = document.getElementById("experience");
  section.appendChild(el("span", { class: "label", text: experience.label }));

  experience.items.forEach((job) => {
    const row = el("div", { class: "experience-row" });
    row.appendChild(el("span", { class: "experience-range", text: job.range }));

    const body = el("div");
    const role = el("p", { class: "experience-role" });
    role.appendChild(document.createTextNode(`${job.role}, `));
    role.appendChild(el("span", { class: "company", text: job.company }));
    body.appendChild(role);

    const impact = el("ul", { class: "experience-impact" });
    job.impact.forEach((i) => impact.appendChild(el("li", { text: i })));
    body.appendChild(impact);

    row.appendChild(body);
    section.appendChild(row);
  });
}

function renderEducation(data) {
  const education = data.education;
  const section = document.getElementById("education");
  section.appendChild(el("span", { class: "label", text: education.label }));

  education.items.forEach((item) => {
    const row = el("div", { class: "education-row" });
    row.appendChild(el("span", { class: "education-range", text: item.range }));

    const body = el("div");
    body.appendChild(el("p", { class: "education-degree", text: item.degree }));
    body.appendChild(el("p", { class: "education-school", text: item.school }));

    row.appendChild(body);
    section.appendChild(row);
  });
}

function renderContact(data) {
  const contact = data.contact;
  const section = document.getElementById("contact");
  section.appendChild(el("span", { class: "label", text: contact.label }));
  section.appendChild(el("p", { class: "contact-statement", text: contact.statement }));
  section.appendChild(el("a", { class: "contact-email", href: `mailto:${contact.email}`, text: contact.email }));

  const links = el("div", { class: "contact-links" });
  contact.links.forEach((link) => {
    links.appendChild(el("a", { href: link.href, text: link.label }));
  });
  section.appendChild(links);
}

function renderFooter(data) {
  const footer = document.getElementById("site-footer");
  const year = new Date().getFullYear();
  footer.textContent = `© ${year} ${data.footer.name}`;
}

function setupNavScroll() {
  const nav = document.getElementById("site-nav");
  window.addEventListener("scroll", () => {
    nav.classList.toggle("scrolled", window.scrollY > 12);
  });
}

function wait(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function typeText(target, text, speed) {
  return new Promise((resolve) => {
    let i = 0;
    const interval = setInterval(() => {
      i++;
      target.textContent = text.slice(0, i);
      if (i >= text.length) {
        clearInterval(interval);
        resolve();
      }
    }, speed);
  });
}

function runPreloader() {
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  document.body.classList.add("preloading");
  if (reduceMotion) return Promise.resolve();
  const textEl = document.getElementById("preloader-text");
  return typeText(textEl, "// hello, world", 55).then(() => wait(350));
}

function hidePreloader() {
  const preloader = document.getElementById("preloader");
  const hero = document.getElementById("hero");
  document.body.classList.remove("preloading");
  hero.classList.add("reveal");
  preloader.classList.add("hide");
  preloader.addEventListener("transitionend", () => preloader.remove(), { once: true });
  setTimeout(() => preloader.remove(), 800);
}

async function init() {
  const [data] = await Promise.all([loadData(), runPreloader()]);
  renderNav(data);
  renderHero(data);
  renderAbout(data);
  renderSkills(data);
  renderProjects(data);
  renderExperience(data);
  renderEducation(data);
  renderContact(data);
  renderFooter(data);
  setupNavScroll();
  hidePreloader();
}

init().catch((err) => {
  document.body.innerHTML = `<pre style="padding:24px;font-family:monospace;">${err.message}\n\nMake sure you are serving this site over http:// (e.g. "python3 -m http.server"), not opening index.html directly via file://.</pre>`;
});
