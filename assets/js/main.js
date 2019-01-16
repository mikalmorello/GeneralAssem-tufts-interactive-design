// VARIABLES
const xhr = new XMLHttpRequest(),
      baseUrl = 'http://dev-tufts-interactive-design.pantheonsite.io/api/projects?_format=json',
      main = document.getElementById('main'),
      banner = document.getElementById('banner'),
      aside = document.getElementById('aside'),
      content = document.getElementById('content'),
      activeProject =  document.getElementById('activeProject'),
      searchInput = document.getElementById('searchInput'),
      searchButton = document.getElementById('searchButton'),
      searchContainer = document.getElementById('searchContainer'),
      resultContainer = document.getElementById('projects'), 
      noResultsContainer = document.getElementById('noResults'),
      filterContainer = document.getElementById('apiResultsFilter'),
      filterTeam = document.getElementsByClassName('projects-filter__team'),
      filterPlatform = document.getElementsByClassName('projects-filter__platform'),
      countContainer = document.getElementById('apiResultsCount'),
      articleLoad = document.getElementsByClassName('project-card__expand'),
      activeFilterContainer = document.getElementById('activeFilters'),
      menuButton = document.getElementById('menuButton');
      menuIcon = document.getElementById('menuIcon');
      
let searchInputValue = '',
    searchCount = 0,
    isSearchNew = '',
    teamList = [], 
    teamListUnique = [],
    platformList = [], 
    platformListUnique = [],
    activeTeam = '', 
    activePlatform = '',
    filterButtonList = [],
    filterButtonListUnique = [];


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
  projectFilterEvent(response);
}

// API Error
function handleError() {
  resetResults();
}

// Load Results

function loadResults(response){
  var projects = response;
  console.log(projects);
  for(let i = 0; i < projects.length; i++) { 
    let project = projects[i];
    let projectCount = projects.length;
    resultContainer.innerHTML += 
     `<article id="${i}" class="project-card">
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
          <div class="project-card__team">
            ${project.title_1}
          </div>
          <div class="project-card__platform">${project.field_project_platform}</div>
        </div>
      </article>`;
      searchFilter();
      projectLoadClick(projects);
      projectResultCount(projectCount);
      resultContainer.classList.add('projects--active');
      filterContainer.classList.add('projects-filter--active');
      countContainer.classList.add('projects-count--active'); 
      activeFilterContainer.classList.add('active-filters--active'); 
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
      articleContent,
      articleTeam;
  
  filter = searchInput.value.toUpperCase();
  article = resultContainer.getElementsByTagName('article');
  // Loop through all list items, and hide those who don't match the search query
  let articleMatch = 0;
  for (i = 0; i < article.length; i++) {
    articleTitle = article[i].getElementsByClassName("project-card__title")[0].innerText;
    articleUrl = article[i].getElementsByClassName("project-card__url")[0].innerText;
    if ((articleTitle.toUpperCase().indexOf(filter) > -1) || (articleUrl.toUpperCase().indexOf(filter) > -1)) {
      //article[i].style.display = "";
      article[i].classList.remove('project-card--search-hide');
      articleMatch++;
    } else {
      //article[i].style.display = "none";
      article[i].classList.add('project-card--search-hide');
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
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
      //banner.classList.add('banner--hidden');
      //aside.classList.add('aside--hidden');
      //content.classList.add('content--active-project');
      banner.classList.add('banner--full-screen');
      menuIcon.classList.add('is-active');
      setTimeout(function(){ 
        main.classList.add('main--hidden');
      }, 2000);
      setTimeout(function(){
        main.classList.add('slideOutDown');
        searchContainer.classList.add('fadeOut');
        activeProject.classList.remove('slideOutDown');
        loadProject(projects, projectParent);
      }, 400);
    });
  }
}

// Load Project
function loadProject(project, projectParent){
  projectId = projectParent.id;
  project = project[projectId];
  setTimeout(function(){ 
    activeProject.classList.remove('project--hidden');
    activeProject.classList.add('slideInUp');
  }, 800);
  activeProject.innerHTML = 
  `
    <article class="project">
      <section class="project__header">
        <h2 class="project__title">${project.title}</h2>
        <a class="project__url" href="${project.field_project_link}">${project.field_project_link_1}</a>
        <div class="project__media">
          <div class="project__media-browser">
            <img src="${project.field_project_banner}">
          </div>
        </div>
      </section>
      <section class="project__introduction">
        <div class="project__introduction-text">
          ${project.field_project_introduction}
        </div>
      </section>
      <section class="project__content">
        <div class="project__main">
          <div class="project__body">
            ${project.body}
          </div>
        </div>
        <div class="project__sidebar">
          <div class="project__team">
            <div class="project__subtitle">Project Team:</div>
            <div class="project__item">
              ${project.title_1}
            </div>
          </div>
          <div class="project__platform">
            <div class="project__subtitle">Project Platform:</div>
            <div class="project__item">
              ${project.field_project_platform}
            </div>
          </div>
        </div>
      </section>
    </article>
  `;
   closeProject();
}

// Close Project

function closeProject() {
  menuButton.addEventListener('click', function(){
    activeProject.classList.remove('slideInUp');
    activeProject.classList.add('slideOutDown');
    main.classList.add('slideInUp');
    main.classList.remove('slideOutDown', 'main--hidden');
    setTimeout(function(){ 
      searchContainer.classList.remove('fadeOut');
      searchContainer.classList.add('fadeIn');
    }, 500);
    banner.classList.remove('banner--full-screen');
    menuIcon.classList.remove('is-active');
    setTimeout(function(){ 
      activeProject.classList.add('project--hidden');
    }, 300);
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
        <h3 class="projects-filter__subtitle">Development Team</h3>
        <ul id="team" class="projects-filter__list ">
          ${teamListResults}  
        </ul?>
      </div>
      <div id="apiResultsFilterPlatform">
        <h3 class="projects-filter__subtitle">Platform</h3>
        <ul id="platform" class="projects-filter__list">
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
    teamListResults += `<li class="projects-filter__item"><a class="projects-filter__team">${teamListUnique[i]}</a></li>`;
  }
  // Loop throught unique items for platforms
  for(let i = 0; i < platformListUnique.length; i++) {
    platformListResults += `<li class="projects-filter__item"><a class="projects-filter__platform">${platformListUnique[i]}</a></li>`;
  }
  projectFilter(projects, teamListResults, platformListResults);
}


// Project Filter Click
// Create a click event for each Team
function projectFilterEvent(projects){
  // Create a click event for each Team
  Array.prototype.forEach.call(filterTeam, function(element) {
    //element.classList.remove('projects-filter__team--active');
    element.addEventListener('click', function(){
      event.preventDefault();
      // Remove classes from siblings
      let parent = document.getElementById('team');
      parent.querySelectorAll( ".projects-filter__team" ).forEach(function(element) {
        element.classList.remove('projects-filter__team--active');
      });
      // Add active class
      element.classList.add('projects-filter__team--active');
      activeTeam = element.innerText.toUpperCase();
      article = resultContainer.getElementsByTagName('article');
      // Loop through articles
      for (i = 0; i < article.length; i++) {
        // Reset
        article[i].classList.remove('project-card--team-hide');
        articleTeam = article[i].getElementsByClassName("project-card__team")[0].innerText.toUpperCase();
        // Loop through articles to see if team matches what was clicked
        if (articleTeam == activeTeam) { 
          article[i].classList.remove('project-card--team-hide');
        } else {
          article[i].classList.add('project-card--team-hide');
        }
      }
      // Add / Remove filter buttons
      filterButtonsAdd(element);
    });
  });
  // Create a click event for each Platform
  Array.prototype.forEach.call(filterPlatform, function(element) {
    //element.classList.remove('projects-filter__platform--active');
    element.addEventListener('click', function(){
      event.preventDefault();
      // Remove classes from siblings
      let parent = document.getElementById('platform');
      parent.querySelectorAll( ".projects-filter__platform" ).forEach(function(element) {
        element.classList.remove('projects-filter__platform--active');
      });
      // Add active class
      element.classList.add('projects-filter__platform--active');
      activePlatform = element.innerText.toUpperCase();
      article = resultContainer.getElementsByTagName('article');
      for (i = 0; i < article.length; i++) {
        // Reset
        article[i].classList.remove('project-card--platform-hide');
        articlePlatform = article[i].getElementsByClassName("project-card__platform")[0].innerText.toUpperCase();
        // Loop through articles to see if team matches what was clicked
        if (articlePlatform == activePlatform) { 
          article[i].classList.remove('project-card--platform-hide');
        } else {
          article[i].classList.add('project-card--platform-hide');
        } 
      }
      // Add / Remove filter buttons
      filterButtonsAdd(element);
      
    });
  });
  
}

// Project Result Count

function projectResultCount(projectCount){
  let resultText = 'Results'; 
  if(projectCount === 1){
    resultText = 'Result';
  }
  countContainer.innerHTML =  
  `
    <div class="projects-count__container">
      <span class="projects-count__number">${projectCount}</span> ${resultText}
    </div>
  `;
}


// Active Filter Labels
function filterButtonsAdd(element) {
  /*Array.prototype.forEach.call(filterTeam, function(element) {
    if(element.)
  }*/
  if(element.classList.contains('projects-filter__platform--active')){
    filterButtonList.push('platform');
  } else if(element.classList.contains('projects-filter__team--active')){
    filterButtonList.push('team');
  } 
  filterButtonListUnique = filterButtonList.unique();
  activeFilterContainer.innerHTML = '';
  filterButtonListUnique.forEach(function(filterButton) {
     activeFilterContainer.innerHTML += `<button id="${filterButton}" class="active-filters__button">${filterButton}<img class="active-filters__img" src="assets/images/close.svg"></button>`; 
  });
  filterButtonsClick();
} 
 
function filterButtonsClick() {
  let filterButtons = document.getElementsByClassName('active-filters__button');
  Array.prototype.forEach.call(filterButtons, function(element) {
    let buttonType =  element.id;
    element.addEventListener('click', function() {
      filterButtonsRemove(buttonType);
      filterRemove(buttonType);
    });
  });
}


function filterButtonsRemove(buttonType) {
  filterButtonListUnique = filterButtonListUnique.filter(function(e) { 
    return e !== buttonType;
  })
  activeFilterContainer.innerHTML = '';
  filterButtonListUnique.forEach(function(filterButton) {
     activeFilterContainer.innerHTML += `<button id="${filterButton}" class="active-filters__button">${filterButton}<img class="active-filters__img" src="assets/images/close.svg"></button>`; 
    filterButtonsClick();
  });
}



// Remove filters for selected button type when removed

function filterRemove(buttonType){
  article = resultContainer.getElementsByTagName('article');
  // Unhide related articles
  for (i = 0; i < article.length; i++) {
    article[i].classList.remove(`project-card--${buttonType}-hide`);
  }
  // Remove active state from sidebar filter
  let parent = document.getElementById(buttonType);
    parent.querySelectorAll(`.projects-filter__${buttonType}`).forEach(function(element) {
      element.classList.remove(`projects-filter__${buttonType}--active`);
  });
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



