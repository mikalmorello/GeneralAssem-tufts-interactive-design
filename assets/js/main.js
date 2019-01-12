// VARIABLES
const xhr = new XMLHttpRequest(),
      baseUrl = 'http://dev-tufts-interactive-design.pantheonsite.io/api/projects?_format=json',
      header = document.getElementById('header'),
      searchInput = document.getElementById('searchInput'),
      searchButton = document.getElementById('searchButton'),
      resultContainer = document.getElementById('projects'), 
      noResultsContainer = document.getElementById('noResults'),
      articleLoad = document.getElementsByClassName('project-card__expand'),
      menu = document.getElementsByClassName('menu')[0];
      
let searchInputValue = '',
    searchCount = 0,
    isSearchNew = '';


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
    header.classList.remove('header--full-screen');
  }
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
    resultContainer.innerHTML += 
     `<article class="project-card">
        <div class="project-card__media">
          <img src="${project.field_project_banner}">
        </div>
        <div class="project-card__content">
          <h2 class="project-card__title"><a class="project-card__expand">${project.title}</a></h2>
          <h3 class="project-card__subtitle">${project.field_project_subtitle}</h3>
          <a class="project-card__url" href=">${project.field_project_link}">${project.field_project_link}</a>
          <div>${project.field_project_description}</div>
          <div>${project.title_1}</div>
          <div>${project.field_team_location}</div>
        </div>
      </article>`;
      searchFilter();
      projectLoadClick(projects);
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
    console.log('article Title ' + articleTitle);
    articleUrl = article[i].getElementsByClassName("project-card__url")[0].innerText;
    console.log('article Url ' + articleUrl);
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
    console.log(articleMatch);
  }
}

// Article Load In Overlay
function projectLoadClick(projects){
  for (let i = 0; i < articleLoad.length; i++) {
    articleLoad[i].addEventListener('click', function(){
      event.preventDefault();
      console.log(articleLoad[i]);
      let projectParent = findParent(articleLoad[i], 'project-card');
      projectParent.classList.add('project-card--active');
      header.classList.add('header--hidden');
      closeProject();
    });
  }
}


// close Project

function closeProject() {
  menu.addEventListener('click', function(){
    let activeProject = document.getElementsByClassName('project-card--active')[0];
    if(activeProject){
      activeProject.classList.remove('project-card--active');
      header.classList.remove('header--hidden');
    }
    
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

