document.addEventListener('DOMContentLoaded', load, false);

function load() {

  const slider = document.querySelector('.slider');
  let isDown = false;
  let startX;
  let scrollLeft;
  let isDragging = false;
  let startingPos = [];
  let childLinks;

  slider.addEventListener('mousedown', function(e) {
    isDown = true;
    slider.classList.add('active');
    startX = e.pageX - slider.offsetLeft;
    scrollLeft = slider.scrollLeft;
    isDragging = false;
    startingPos = [e.pageX, e.pageY];
  });
  slider.addEventListener('mouseleave', function(e) {
    isDown = false;
    slider.classList.remove('active');
  });
  slider.addEventListener('mouseup', function(e) {
    isDown = false;
    slider.classList.remove('active');
    for (var i = 0, element; element = childLinks[i]; i++) {
      setTimeout(removeBlocking, 250, element);
    }
  });
  slider.addEventListener('mousemove', function(e) {
    if(!isDown) return;

    if (!(e.pageX === startingPos[0] && e.pageY === startingPos[1])) {
      isDragging = true;
    }
    if (isDragging) {
      childLinks = document.querySelectorAll('.slider a');
      for (var i = 0, element; element = childLinks[i]; i++) {
        element.addEventListener('click', addBlocking);
      }
    }

    e.preventDefault();
    const x = e.pageX - slider.offsetLeft;
    const walk = (x - startX) * 1.2;
    slider.scrollLeft = scrollLeft - walk;
  });

  function addBlocking(e) {
    e.preventDefault();
  }

  function removeBlocking(element) {
    element.removeEventListener('click', addBlocking);
  }
}
