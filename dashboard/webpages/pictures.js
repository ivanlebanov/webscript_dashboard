'use strict';
window.addEventListener('load', loadPictures);
window.searchnow.addEventListener('click', loadPicturesWithSearch);
window.searchform.addEventListener('submit', loadPicturesWithSearch);
window.sort.addEventListener('change', loadPictures);

var currentSearch = '';

function loadPicturesWithSearch(e) {
  e.preventDefault();
  currentSearch = window.search.value;
  loadPictures();
}

function loadPictures() {
  var url = '/api/pictures';
  url += '?order=' + window.sort.selectedOptions[0].value;
  if (currentSearch) url += '&title=' + encodeURIComponent(currentSearch);

  var xhr = new XMLHttpRequest();
  xhr.open('GET', url, true);
  xhr.onload = function() {
    if (xhr.status === 200) {
      putPicturesInPage(JSON.parse(xhr.responseText));
    } else {
      console.error('error getting pictures', xhr);
      window.main.innerHTML = 'sorry, something went wrong...';
    }
  }
  xhr.send();
}

function putPicturesInPage(pics) {
  // clear out old pictures
  window.main.innerHTML = '';

  // install new ones in the order they came
  pics.forEach(function (pic) {
    var container = document.createElement('section');
    container.classList.add('picture');
    window.main.appendChild(container);

    var a = document.createElement('a');
    a.classList.add('img');
    a.href = pic.file;
    container.appendChild(a);

    var el = document.createElement('img');
    el.src = pic.file;
    el.alt = pic.title;
    a.appendChild(el);

    el = document.createElement('p');
    el.classList.add('title');
    el.textContent = pic.title;
    container.appendChild(el);

    el = document.createElement('div');
    el.classList.add('delete');
    el.textContent = 'X';
    el.dataset.id = pic.id;
    el.onclick = requestDelete;
    container.appendChild(el);
  });

  var container = document.createElement('section');
  container.classList.add('picture');
  container.classList.add('upload');
  window.main.appendChild(container);

  var el = document.createElement('a');
  el.href = '/upload';
  el.textContent = 'upload a new picture';
  container.appendChild(el);
}

function requestDelete(e) {
  if (e.target.dataset.id && window.confirm('Realy delete this image?')) {
    var xhr = new XMLHttpRequest();
    xhr.open('DELETE', '/api/pictures/' + e.target.dataset.id, false); // synchronous request
    xhr.send();
    loadPictures();
  }
}
