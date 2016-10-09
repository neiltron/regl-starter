import glslify from 'glslify';
import Regl from 'regl';

import Loader from './_loader';

let regl = new Regl(document.getElementById('renderer_container'));

let width = document.documentElement.clientWidth,
    height = document.documentElement.clientHeight,
    canvas = document.querySelector('canvas'),
    mouseX = 0.0,
    mouseY = 0.0,
    isMouseDown = false,
    progressBar,
    isMobile = ('ontouchstart' in window);


var handleMouseDown = (e) => {
  e.preventDefault();

  isMouseDown = true;

  mouseX = e.pageX - e.target.getBoundingClientRect().left;
  mouseY = canvas.height - (e.pageY - e.target.getBoundingClientRect().top) - canvas.height / 2;

  requestAnimationFrame(adjustIntensity);
};

var handleMouseUp = () => {
  isMouseDown = false;

  requestAnimationFrame(adjustIntensity);
};

var handleMouseMove = (e) => {
  e.preventDefault();

  mouseX = e.pageX - e.target.getBoundingClientRect().left;
  mouseY = canvas.height - (e.pageY - e.target.getBoundingClientRect().top) - canvas.height / 2;
};

var resize = () => {
  var width = window.innerWidth,
      height = window.innerHeight,
      dp = window.devicePixelRatio,
      ratio = 16 / 9;

  if (width / height >= ratio) {
    width = height * ratio;
    height = height;
  } else {
    height = width / ratio;
    width = width;
  }

  canvas.width = width * dp;
  canvas.height = height * dp;

  canvas.style.width = width + 'px';
  canvas.style.height = height + 'px';
};

const drawCanvas = regl({
  frag: glslify('./shader.frag'),
  vert: glslify('./shader.vert'),
  count: 3,

  attributes: {
    position: [
      -2, 0,
      0, -2,
      2, 2
    ]
  },

  uniforms: {
    time: regl.context('time'),
    u_resolution: [canvas.width, canvas.height],
    u_mousepos: regl.prop('mousepos'),
    u_ismobile: isMobile
  }
})

// loader's self-calling. it calls itself.
var loader = new Loader({
  complete: () => {
    document.getElementById('load_progress').classList.add('done');
    document.querySelector('section').style.opacity = 1;

    window.addEventListener('resize', resize, false);

    resize();

    regl.frame(() => {
      drawCanvas({
        mousepos: [mouseX, mouseY]
      });
    })
  }
});