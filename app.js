const themeButton = document.querySelector('.theme-toggle');
function applyTheme(theme) {
  document.documentElement.dataset.theme = theme;
  themeButton.setAttribute('aria-label', theme === 'dark' ? '切换到浅色主题' : '切换到深色主题');
  themeButton.setAttribute('title', themeButton.getAttribute('aria-label'));
  document.querySelector('meta[name="theme-color"]').content = theme === 'dark' ? '#111410' : '#f4f5ed';
}
try {
  const savedTheme = localStorage.getItem('yunlin-theme');
  if (savedTheme === 'light' || savedTheme === 'dark') applyTheme(savedTheme);
} catch {}
themeButton.addEventListener('click', () => {
  const theme = document.documentElement.dataset.theme === 'dark' ? 'light' : 'dark';
  applyTheme(theme);
  try { localStorage.setItem('yunlin-theme', theme); } catch {}
});
const projects = [...document.querySelectorAll('.project')];
const filterButtons = [...document.querySelectorAll('[data-filter]')];
filterButtons.forEach(button => button.addEventListener('click', () => {
  const filter = button.dataset.filter;
  filterButtons.forEach(item => item.setAttribute('aria-pressed', String(item === button)));
  projects.forEach(project => { project.hidden = filter !== 'all' && project.dataset.category !== filter; });
  const count = projects.filter(project => !project.hidden).length;
  document.getElementById('filter-status').textContent = `显示${filter === 'all' ? '全部' : button.textContent.trim()} ${count} 个项目`;
}));
document.getElementById('year').textContent = new Date().getFullYear();

document.documentElement.classList.add('js');
const menuButton = document.querySelector('.menu-toggle');
const navigation = document.querySelector('#main-nav');
function closeMenu() {
  menuButton.setAttribute('aria-expanded', 'false');
  menuButton.setAttribute('aria-label', '打开导航');
  navigation.classList.remove('is-open');
}
menuButton.addEventListener('click', () => {
  const open = menuButton.getAttribute('aria-expanded') !== 'true';
  menuButton.setAttribute('aria-expanded', String(open));
  menuButton.setAttribute('aria-label', open ? '关闭导航' : '打开导航');
  navigation.classList.toggle('is-open', open);
});
navigation.querySelectorAll('a').forEach(link => link.addEventListener('click', closeMenu));
document.addEventListener('keydown', event => {
  if (event.key === 'Escape' && menuButton.getAttribute('aria-expanded') === 'true') {
    closeMenu();
    menuButton.focus();
  }
});
const papers = [...document.querySelectorAll('.paper')];
const paperFilters = [...document.querySelectorAll('[data-paper-filter]')];
paperFilters.forEach(button => button.addEventListener('click', () => {
  const filter = button.dataset.paperFilter;
  paperFilters.forEach(item => item.setAttribute('aria-pressed', String(item === button)));
  papers.forEach(paper => { paper.hidden = filter !== 'all' && paper.dataset.publicationType !== filter; });
  const count = papers.filter(paper => !paper.hidden).length;
  document.querySelector('#paper-status').textContent = `显示 ${count} 条学术记录`;
}));
