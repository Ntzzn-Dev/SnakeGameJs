var btnClose = document.querySelector('.js-close');
var modal = document.querySelector('.js-modal');
var modalStart = document.querySelector('.js-modalStart');
var modalChildren = modal.children
let midY = modal.clientWidth/2;
let midX = modal.clientHeight/2;


function hideModalStart() {
  dynamics.animate(modalStart, {
    opacity: 0,
    translateX: -320, translateY: -100 
  }, {
    type: dynamics.spring,
    frequency: 50,
    friction: 600,
    duration: 1500
  });
}

function hideModal() {
  dynamics.animate(modal, {
    opacity: 0,
    translateX: -320, translateY: -100 
  }, {
    type: dynamics.spring,
    frequency: 50,
    friction: 600,
    duration: 1500
  });
}

function showModalStart() {
    midY = modal.clientWidth/2;
    midX = modal.clientHeight/2;

  dynamics.css(modal, { opacity: 0, scale: .5 });
  dynamics.animate(modal, { opacity: 1, scale: 1, translateX: -midY, translateY: -midX }, {
    type: dynamics.spring,
    frequency: 300,
    friction: 400,
    duration: 1000
  });
}

function showModal() {
    midY = modal.clientWidth/2;
    midX = modal.clientHeight/2;

  dynamics.css(modal, { opacity: 0, scale: .5 });
  dynamics.animate(modal, { opacity: 1, scale: 1, translateX: -midY, translateY: -midX }, {
    type: dynamics.spring,
    frequency: 300,
    friction: 400,
    duration: 1000
  });
}

function showModalChildren() {
  for (var i = 0; i < modalChildren.length; i++) {
    var item = modalChildren[i];
    dynamics.css(item, { opacity: 0, translateY: 30 });
    dynamics.animate(item, { opacity: 1, translateY: 0 }, {
      type: dynamics.spring,
      frequency: 300,
      friction: 400,
      duration: 1000,
      delay: 100 + i * 40
    });
  }
}

function toggleClasses() {
  modal.classList.toggle('is-active');
}

function gameOverModal(){
  toggleClasses();
  showModal();
  showModalChildren();
}

btnClose.addEventListener('click', function() {
  hideModal();
  setTimeout(toggleClasses, 500);
});
