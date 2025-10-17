document.addEventListener('DOMContentLoaded', function() {
    const BASE_PATH = (location.hostname === "localhost" || location.hostname === "127.0.0.1")
    ? "/"             
    : "/portfolio/"; 
    
    document.body.insertAdjacentHTML(
    'afterbegin',
    `
        <label class="color-scheme">
            Theme:
            <select id="theme-select" name="theme">
                <option value = "light dark"> Automatic</option>
                <option value="light">Light</option>
                <option value="dark">Dark</option>
            </select>
        </label>`
    );

    let pages = [
    { url: '', title: 'Home' },
    { url: 'projects/', title: 'Projects' },
    { url: 'contact/', title: 'Contact' },
    { url: 'resume/', title: 'Resume' },
    // add the rest of your pages here
    ];

    let nav = document.createElement('nav');
    document.body.prepend(nav);

    for (let p of pages) {
    let url = p.url;
    let title = p.title;
    
    url = !url.startsWith('http') ? BASE_PATH + url : url;
    
    // Create link and add it to nav
    let a = document.createElement('a');
    a.href = url;
    a.textContent = title;
    a.classList.toggle(
    'current',
    a.host === location.host && a.pathname === location.pathname,
        );
    nav.append(a);

    }
    const select = document.querySelector('.color-scheme select');
    if ("colorScheme" in localStorage) {
        const savedScheme = localStorage.colorScheme;
        document.documentElement.style.setProperty('color-scheme', savedScheme);
        select.value = savedScheme;
}
    select.addEventListener('input', function (event) {
    console.log('color scheme changed to', event.target.value);
    document.documentElement.style.setProperty('color-scheme', event.target.value);
    localStorage.colorScheme = event.target.value;
    });
});

