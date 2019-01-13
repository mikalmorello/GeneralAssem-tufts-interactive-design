// VARIABLES
const xhr = new XMLHttpRequest(),
      baseUrl = 'http://dev-tufts-interactive-design.pantheonsite.io/api/projects?_format=json',
      banner = document.getElementById('banner'),
      searchInput = document.getElementById('searchInput'),
      searchButton = document.getElementById('searchButton'),
      resultContainer = document.getElementById('projects'), 
      noResultsContainer = document.getElementById('noResults'),
      filterContainer = document.getElementById('apiResultsFilter'),
      countContainer = document.getElementById('apiResultsCount'),
      articleLoad = document.getElementsByClassName('project-card__expand'),
      menu = document.getElementsByClassName('menu')[0];
      
let searchInputValue = '',
    searchCount = 0,
    isSearchNew = '',
    teamList = [], 
    teamListUnique = [],
    platformList = [], 
    platformListUnique = [];


// FUNCTIONS

// API Call
function callThatAPI(searchParams, isSearchNew) {
  xhr.open('GET', `${baseUrl}`)
  xhr.send();
  xhr.onload = handleSuccess;
  xhr.onerror = handleError;
}

// API Success
function handleSuccess() {
  searchCount = searchCount + 1;
  var response = JSON.parse(xhr.responseText);
  loadResults(response);
  if (searchCount === 1) {
    banner.classList.remove('banner--full-screen');
  }
  projectFilterList(response);
}

// API Error
function handleError() {
  resetResults();
}

// Load Results

function loadResults(response){
  var projects = response;
  for(let i = 0; i < projects.length; i++) { 
    let project = projects[i];
    let projectCount = projects.length;
    resultContainer.innerHTML += 
     `<article class="project-card">
        <div class="project-card__media">
          <a class="project-card__expand">
            <div class="project-card__media-browser">
              <img src="${project.field_project_banner}">
            </div>
          </a>
        </div>
        <div class="project-card__content">
          <h2 class="project-card__title">
            <a class="project-card__expand">${project.title}</a>
          </h2>
          <div class="project-card__introduction">
            ${project.field_project_introduction}
          </div>
          <a class="project-card__url" href="${project.field_project_link}">${project.field_project_link_1}</a>
          <!--<div class="project-card__team">
            ${project.title_1}
          </div>-->
        </div>
      </article>`;
      searchFilter();
      projectLoadClick(projects);
      projectResultCount(projectCount);
      resultContainer.classList.add('projects--active');
      filterContainer.classList.add('projects-filter--active');
      countContainer.classList.add('projects-count--active'); 
   }
}


// Find Parent of Class
function findParent(element, parentClass){
  while ((element = element.parentElement) && !element.classList.contains(parentClass));
  return element;
}


// Remove loader icon
function hideLoader (){
}

// Reset results

function resetResults() {
  resultContainer.innerHTML = '';
}


// Check if new search term

function checkSearchTerm (newSearchInput){
  if(searchInputValue === newSearchInput){
    return isSearchNew = false;
  } else {
    return isSearchNew = true;
  }
}


// Search Filter

function searchFilter() {
  // Declare variables
  let filter, 
      article, 
      articleLink, 
      articleContent;
  
  filter = searchInput.value.toUpperCase();
  article = resultContainer.getElementsByTagName('article');
  // Loop through all list items, and hide those who don't match the search query
  let articleMatch = 0;
  for (i = 0; i < article.length; i++) {
    articleTitle = article[i].getElementsByClassName("project-card__title")[0].innerText;
    articleUrl = article[i].getElementsByClassName("project-card__url")[0].innerText;
    if ((articleTitle.toUpperCase().indexOf(filter) > -1) || (articleUrl.toUpperCase().indexOf(filter) > -1)) {
      article[i].style.display = "";
      articleMatch++;
    } else {
      article[i].style.display = "none";
    }
    // If no matches
    if (articleMatch === 0) {
      noResultsContainer.classList.remove('section--hide');
    } else {
      noResultsContainer.classList.add('section--hide');
    }
  }
  projectResultCount(articleMatch);
}

// Article Load In Overlay

function projectLoadClick(projects){
  // Load Project on title and image click
  for (let i = 0; i < articleLoad.length; i++) {
    articleLoad[i].addEventListener('click', function(){
      event.preventDefault();
      let projectParent = findParent(articleLoad[i], 'project-card');
      projectParent.classList.add('project-card--active');
      banner.classList.add('banner--hidden');
      closeProject();
    });
  }
}

// Close Project

function closeProject() {
  menu.addEventListener('click', function(){
    let activeProject = document.getElementsByClassName('project-card--active')[0];
    if(activeProject){
      activeProject.classList.remove('project-card--active');
      banner.classList.remove('banner--hidden');
    }
    
  });
}


// Project Filter

function projectFilter(projects, teamListResults, platformListResults){
  // Load Project on title and image click
  filterContainer.innerHTML =  
  `
    <div class="projects-filter__container">
      <h2 class="projects-filter__title">
        Filters
      </h2>
      <div id="apiResultsFilterTeam">
        <h3>Development Team</h3>
        <ul>
          ${teamListResults}  
        </ul?>
      </div>
      <div id="apiResultsFilterPlatform">
        <h3>Platform</h3>
        <ul>
          ${platformListResults}  
        </ul>
      </div>
    </div>
  `;
}

// Unique Array

Array.prototype.unique = function() {
  return this.filter(function (value, index, self) { 
    return self.indexOf(value) === index;
  });
}


// Function Filter Team

function projectFilterList(projects){
  // Reset team list
  teamList = [];
  platformList = [];
  // Loop through project to generate team list
  for(let i = 0; i < projects.length; i++) {
    let project = projects[i];
    if(project.title_1){
      teamList.push(project.title_1);
    }
    if(project.field_project_platform){
      platformList.push(project.field_project_platform);
    }
  }
  teamListUnique = teamList.unique();
  platformListUnique = platformList.unique();
  let teamListResults = '';
  let platformListResults = '';
  // Loop throught unique items for teams
  for(let i = 0; i < teamListUnique.length; i++) {
    teamListResults += `<li>${teamListUnique[i]}</li>`;
  }
  // Loop throught unique items for platforms
  for(let i = 0; i < platformListUnique.length; i++) {
    platformListResults += `<li>${platformListUnique[i]}</li>`;
  }
  projectFilter(projects, teamListResults, platformListResults);
}


// Project Result Count

function projectResultCount(projectCount){
  countContainer.innerHTML =  
  `
    <div class="projects-count__container">
      <span class="projects-count__number">${projectCount}</span> Results
    </div>
  `;
}
 
 
// Autorun testing if you don't want to render a search
/*function autoRun(searchValue) {
  callThatAPI(searchValue);
}

autoRun('tufts');*/


// EVENT LISTENER

// Submit message if user hits enter on input
searchInput.addEventListener('keyup', function(event) {
  if (event.keyCode === 13) {
    event.preventDefault();
    searchButton.click(); 
  } else {
    searchFilter();
  }
});


// Search Button Click
searchButton.addEventListener('click', function() {
  event.preventDefault();
  checkSearchTerm(searchInput.value);
  resetResults();
  callThatAPI(searchInput.value, isSearchNew);
  searchInputValue = searchInput.value;
  return searchInputValue;
});

