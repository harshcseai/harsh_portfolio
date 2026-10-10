const toggle = document.querySelector('.menu-toggle');
const nav = document.querySelector('nav');
if (toggle && nav) {
  toggle.addEventListener('click', () => {
    const open = nav.classList.toggle('open');
    toggle.setAttribute('aria-expanded', open);
    toggle.setAttribute('aria-label', open ? 'Close navigation' : 'Open navigation');
    document.body.style.overflow = open ? 'hidden' : '';
  });
  document.querySelectorAll('nav a').forEach(link => link.addEventListener('click', () => {
    nav.classList.remove('open'); toggle.setAttribute('aria-expanded', 'false'); document.body.style.overflow = '';
  }));
}
const themeToggle = document.querySelector('.theme-toggle');
const setTheme = theme => {
  document.documentElement.dataset.theme = theme;
  localStorage.setItem('harsh-portfolio-theme', theme);
  if (themeToggle) {
    const isDark = theme === 'dark';
    themeToggle.setAttribute('aria-pressed', String(isDark));
    themeToggle.setAttribute('aria-label', `Switch to ${isDark ? 'light' : 'dark'} theme`);
    themeToggle.querySelector('.theme-label').textContent = isDark ? 'Light' : 'Dark';
  }
};
setTheme(document.documentElement.dataset.theme || 'light');
themeToggle?.addEventListener('click', () => setTheme(document.documentElement.dataset.theme === 'dark' ? 'light' : 'dark'));
const observer = new IntersectionObserver(entries => entries.forEach(entry => {
  if (entry.isIntersecting) { entry.target.classList.add('visible'); observer.unobserve(entry.target); }
}), { threshold: 0.12 });
document.querySelectorAll('.reveal').forEach(el => observer.observe(el));
document.getElementById('year').textContent = new Date().getFullYear();

// Keep technology marks available after deployment: local assets avoid third-party CDN failures.
const localIcons = {
  amazonwebservices: 'assets/icons/aws.png',
  microsoftazure: 'assets/icons/azure.svg',
  docker: 'assets/icons/docker.svg',
  kubernetes: 'assets/icons/kubernetes.svg',
  nginx: 'assets/icons/nginx.svg',
  githubactions: 'assets/icons/githubactions.svg',
  jenkins: 'assets/icons/jenkins.svg',
  git: 'assets/icons/git.svg',
  python: 'assets/icons/python.svg',
  mysql: 'assets/icons/mysql.svg',
  linux: 'assets/icons/linux.svg',
  cisco: 'assets/icons/cisco.svg',
  terraform: 'assets/icons/terraform.svg',
  ansible: 'assets/icons/ansible.svg',
  prometheus: 'assets/icons/prometheus.svg',
  grafana: 'assets/icons/grafana.svg',
  cloudflare: 'assets/icons/nptel.svg'
};
document.querySelectorAll('img[src*="cdn.simpleicons.org"]').forEach(image => {
  const match = image.src.match(/simpleicons\.org\/([^/]+)/);
  const icon = match && localIcons[match[1]];
  if (icon) image.src = icon;
});

// Give the projects terminal a lightweight, deterministic command cycle.
const typingLine = document.querySelector('.project-terminal .terminal-body p:last-child');
if (typingLine) {
  const commands = ['docker ps --format "table {{.Names}}"', 'kubectl get pods --all-namespaces', 'git status --short'];
  let commandIndex = 0;
  let characterIndex = 0;
  let erasing = false;
  const renderTerminalLine = () => {
    const command = commands[commandIndex];
    const visible = command.slice(0, characterIndex);
    typingLine.innerHTML = `<small>05</small><span class="prompt">$</span> ${visible}<b class="terminal-cursor" aria-label="typing cursor"></b>`;
    if (!erasing && characterIndex < command.length) {
      characterIndex += 1;
      setTimeout(renderTerminalLine, 52);
    } else if (!erasing) {
      erasing = true;
      setTimeout(renderTerminalLine, 1200);
    } else if (characterIndex > 0) {
      characterIndex -= 1;
      setTimeout(renderTerminalLine, 24);
    } else {
      erasing = false;
      commandIndex = (commandIndex + 1) % commands.length;
      setTimeout(renderTerminalLine, 250);
    }
  };
  renderTerminalLine();
}
