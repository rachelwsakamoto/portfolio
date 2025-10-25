console.log('IT’S ALIVE!');

function $$(selector, context = document) {
	return Array.from(context.querySelectorAll(selector));
}

let pages = [
	{ url: '', title: 'Home' },
	{ url: 'projects/', title: 'Projects' },
	{ url: 'resume/', title: 'CV' },
	{ url: 'contact/', title: 'Contact' },
	{ url: 'https://github.com/rachelwsakamoto', title: 'GitHub' }
];

const BASE_PATH = (location.hostname === "localhost" || location.hostname === "127.0.0.1")
	? "/"
	: "/portfolio/";

let nav = document.createElement('nav');
document.body.prepend(nav);

for (let p of pages) {
	let url = p.url;
	let title = p.title;

	if (!url.startsWith('http')) {
		url = BASE_PATH + url;
	}

	let a = document.createElement('a');
	a.href = url;
	a.textContent = title;

	if (a.host === location.host && a.pathname === location.pathname) {
		a.classList.add('current');
	}

	if (a.host !== location.host) {
		a.target = "_blank";
	}

	nav.append(a);
}

document.body.insertAdjacentHTML(
	'afterbegin',
	`
	<label class="color-scheme">
		Theme:
		<select>
		<option value="light dark">Automatic</option>
		<option value="light">Light</option>
		<option value="dark">Dark</option>
		</select>
	</label>
	`
);

const select = document.querySelector('.color-scheme select');

if ("colorScheme" in localStorage) {
	const savedScheme = localStorage.colorScheme;
	document.documentElement.style.setProperty('color-scheme', savedScheme);
	select.value = savedScheme;
}
else {
	document.documentElement.style.setProperty('color-scheme', 'light');
	select.value = 'light';
}

select.addEventListener('input', function (event) {
	const newScheme = event.target.value;
	document.documentElement.style.setProperty('color-scheme', newScheme);
	localStorage.colorScheme = newScheme;
});

export async function fetchJSON(url) {
	try {
		const response = await fetch(url);
		
		if (!response.ok) {
			throw new Error(`Failed to fetch projects: ${response.statusText}`);
		}
		
		const data = await response.json();
		return data;
	} catch (error) {
		console.error('Error fetching or parsing JSON data:', error);
	}
}

export function renderProjects(projects, containerElement, headingLevel = 'h2') {
	containerElement.innerHTML = '';
	
	for (let project of projects) {
		const article = document.createElement('article');
		
		const heading = document.createElement(headingLevel);
		heading.textContent = project.title;
		
		const img = document.createElement('img');
		img.src = project.image;
		img.alt = project.title;
		
		const description = document.createElement('p');
		description.textContent = project.description;
		
		article.append(heading, img, description);
		containerElement.append(article);
	}
}

export async function fetchGitHubData(username) {
	return fetchJSON(`https://api.github.com/users/${username}`);
}