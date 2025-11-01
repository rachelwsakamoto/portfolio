import { fetchJSON, renderProjects } from '../global.js';
import * as d3 from 'https://cdn.jsdelivr.net/npm/d3@7.9.0/+esm';

const projects = await fetchJSON('../lib/projects.json');
const projectsContainer = document.querySelector('.projects');
const searchInput = document.querySelector('.searchBar');

// Step 4.1: Add search query variable
let query = '';

function setQuery(newQuery) {
  query = newQuery;
  const filteredProjects = projects.filter((project) =>
    project.title.toLowerCase().includes(query.toLowerCase())
  );
  return filteredProjects;
}

// Refactor all plotting into one function
function renderPieChart(projectsGiven) {
  // Clear SVG and legend
  d3.select('svg').selectAll('*').remove();
  d3.select('.legend').selectAll('*').remove();

  // Re-calculate rolled data
  let newRolledData = d3.rollups(
    projectsGiven,
    (v) => v.length,
    (d) => d.year,
  );

  // Re-calculate data
  let newData = newRolledData.map(([year, count]) => {
    return { value: count, label: year };
  });

  // Re-calculate slice generator, arc data, arcs, etc.
  let arcGenerator = d3.arc().innerRadius(0).outerRadius(50);
  let newSliceGenerator = d3.pie().value((d) => d.value);
  let newArcData = newSliceGenerator(newData);
  let newArcs = newArcData.map((d) => arcGenerator(d));

  let colors = d3.scaleOrdinal(d3.schemeTableau10);

  // Update paths
  newArcs.forEach((arc, idx) => {
    d3.select('svg')
      .append('path')
      .attr('d', arc)
      .attr('fill', colors(idx))
  });

  // Update legend
  let legend = d3.select('.legend');
  newData.forEach((d, idx) => {
    legend
      .append('li')
      .attr('style', `--color:${colors(idx)}`)
      .html(`<span class="swatch"></span> ${d.label} <em>(${d.value})</em>`);
  });
}

// Call this function on page load
renderProjects(projects, projectsContainer, 'h2');
renderPieChart(projects);

searchInput.addEventListener('input', (event) => {
  let filteredProjects = setQuery(event.target.value);
  // Re-render legends and pie chart when event triggers
  renderProjects(filteredProjects, projectsContainer, 'h2');
  renderPieChart(filteredProjects);
});


// import { fetchJSON, renderProjects } from '../global.js';
// import * as d3 from 'https://cdn.jsdelivr.net/npm/d3@7.9.0/+esm';

// const projects = await fetchJSON('../lib/projects.json');
// const projectsContainer = document.querySelector('.projects');
// const searchInput = document.querySelector('.searchBar');

// let query = '';

// function setQuery(newQuery) {
//   query = newQuery;
//   const filteredProjects = projects.filter((project) =>
//     project.title.toLowerCase().includes(query.toLowerCase())
//   );
//   return filteredProjects;
// }

// function renderPieChart(projectsGiven) {
//   let rolledData = d3.rollups(
//     projectsGiven,
//     (v) => v.length,
//     (d) => d.year,
//   );

//   let data = rolledData.map(([year, count]) => {
//     return { value: count, label: year };
//   });

//   let sliceGenerator = d3.pie().value((d) => d.value);
//   let arcData = sliceGenerator(data);
//   let arcs = arcData.map((d) => arcGenerator(d));

//   d3.select('svg').selectAll('*').remove();
//   d3.select('.legend').selectAll('*').remove();

//   arcs.forEach((arc, idx) => {
//     d3.select('svg')
//       .append('path')
//       .attr('d', arc)
//       .attr('fill', colors(idx))
//   });

//   let legend = d3.select('.legend');
//   data.forEach((d, idx) => {
//     legend
//       .append('li')
//       .attr('style', `--color:${colors(idx)}`)
//       .html(`<span class="swatch"></span> ${d.label} <em>(${d.value})</em>`);
//   });
// }

// let arcGenerator = d3.arc().innerRadius(0).outerRadius(50);
// let colors = d3.scaleOrdinal(d3.schemeTableau10);

// renderPieChart(projects);

// searchInput.addEventListener('change', (event) => {
//   let filteredProjects = setQuery(event.target.value);
//   renderProjects(filteredProjects, projectsContainer, 'h2');
//   renderPieChart(filteredProjects);
// });