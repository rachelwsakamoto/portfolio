import { fetchJSON, renderProjects } from '../global.js';
import * as d3 from 'https://cdn.jsdelivr.net/npm/d3@7.9.0/+esm';

const projects = await fetchJSON('../lib/projects.json');
const projectsContainer = document.querySelector('.projects');
const searchInput = document.querySelector('.searchBar');

let query = '';
let selectedIndex = -1;
let arcGenerator = d3.arc().innerRadius(0).outerRadius(50);
let colors = d3.scaleOrdinal(d3.schemeTableau10);

function setQuery(newQuery) {
  query = newQuery;
  const filteredProjects = projects.filter((project) =>
    project.title.toLowerCase().includes(query.toLowerCase()));
  return filteredProjects;
}

function renderPieChart(projectsGiven) {
  // Clear SVG and legend
  d3.select('svg').selectAll('*').remove();
  d3.select('.legend').selectAll('*').remove();

  // Re-calculate rolled data
  let rolledData = d3.rollups(
    projectsGiven,
    (v) => v.length,
    (d) => d.year,
  );

  // Re-calculate data
  let data = rolledData.map(([year, count]) => {
    return { value: count, label: year };
  });

  // Re-calculate slice generator, arc data, arcs, etc.
  let sliceGenerator = d3.pie().value((d) => d.value);
  let arcData = sliceGenerator(data);
  let arcs = arcData.map((d) => arcGenerator(d));

  let svg = d3.select('svg');
  
  // Update paths with click handlers
  arcs.forEach((arc, i) => {
    svg
      .append('path')
      .attr('d', arc)
      .attr('fill', colors(i))
      .on('click', () => {
        selectedIndex = selectedIndex === i ? -1 : i;

        // Filter projects based on selection
        if (selectedIndex === -1) {
          renderProjects(projectsGiven, projectsContainer, 'h2');
          renderPieChart(projectsGiven); // Show full pie chart again
        } else {
          let selectedYear = data[selectedIndex].label;
          let filteredProjects = projectsGiven.filter(project => project.year === selectedYear);
          renderProjects(filteredProjects, projectsContainer, 'h2');
          renderPieChart(filteredProjects); // Show pie chart for only selected year
        }
      });
  });

  // Update legend with click handlers
  let legend = d3.select('.legend');
  data.forEach((d, idx) => {
    legend
      .append('li')
      .attr('style', `--color:${colors(idx)}`)
      .html(`<span class="swatch"></span> ${d.label} <em>(${d.value})</em>`)
      .on('click', () => {
        selectedIndex = selectedIndex === idx ? -1 : idx;

        // Filter projects based on selection
        if (selectedIndex === -1) {
          renderProjects(projectsGiven, projectsContainer, 'h2');
          renderPieChart(projectsGiven); // Show full pie chart again
        } else {
          let selectedYear = data[selectedIndex].label;
          let filteredProjects = projectsGiven.filter(project => project.year === selectedYear);
          renderProjects(filteredProjects, projectsContainer, 'h2');
          renderPieChart(filteredProjects); // Show pie chart for only selected year
        }
      });
  });
}

// Call this function on page load
renderProjects(projects, projectsContainer, 'h2');
renderPieChart(projects);

// Search functionality
searchInput.addEventListener('input', (event) => {
  let filteredProjects = setQuery(event.target.value);
  renderProjects(filteredProjects, projectsContainer, 'h2');
  renderPieChart(filteredProjects);
});