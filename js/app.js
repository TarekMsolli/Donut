var CANVAS = document.querySelector("#canvas");


var CTX = CANVAS.getContext('2d');

var WIDTH = CTX.canvas.width;
var HEIGHT = CTX.canvas.height;

const THETA_SPACING = 0.07;
const PHI_SPACING = 0.02;


var ZROTATION = document.querySelector("#z-rotation");

var YROTATION = document.querySelector("#y-rotation");

const PI = Math.PI;


function render(A, B, COLOR){
  colorBackground();
  var LUM = document.querySelector("#lum").value;
  
  var R1 = 0.75;
  var R2 = 2;
  var K2 = 5;

  var K1 = WIDTH * K2 * 3 / (8 * (R1 + R2 ));
  var DOTSIZE = document.querySelector("#size").value;
  var THETALIMIT = document.querySelector("#thetalimit").value;
  var PHILIMIT = document.querySelector("#philimit").value;

  let cosA = Math.cos(A), sinA = Math.sin(A), cosB = Math.cos(B), sinB = Math.sin(B);

  let zbuffer = fillOutput();

  for(let theta = 0; theta < THETALIMIT * PI; theta += THETA_SPACING){
    let costheta = Math.cos(theta), sintheta = Math.sin(theta);

    for(let phi = 0; phi < PHILIMIT * PI; phi += PHI_SPACING){
      let cosphi = Math.cos(phi), sinphi = Math.sin(phi);
      
      let circlex = R2 + R1 * costheta;
      let circley = R1 * sintheta;

      let x = circlex * (cosB * cosphi + sinA * sinB * sinphi) - circley * cosA  *sinB;
      let y = circlex * (sinB * cosphi - sinA * cosB * sinphi) + circley * cosA * cosB;
      let z = (K2 + cosA * circlex * sinphi + circley * sinA) - 0.75 ;

      let ooz = 0.5/z;

      let xp = Math.floor(WIDTH/2 + K1 * ooz * x);
      let yp = Math.floor(HEIGHT/2 - K1 * ooz * y);

      let l = cosphi * costheta * sinB - cosA * costheta * sinphi - sinA * sintheta + cosB * (cosA * sintheta - costheta * sinA * sinphi);
      if (l > 0) {     
        if(ooz > zbuffer[yp][xp]) {
          zbuffer[yp][xp] = ooz;
          let li = l * LUM;
          CTX.fillStyle=`rgba(${hexToRgb(COLOR).r},${hexToRgb(COLOR).g},${hexToRgb(COLOR).b},${li})`;
          CTX.fillRect(xp, yp, DOTSIZE, DOTSIZE);
        }
      }
    }
  }


}

function colorBackground(){
  CTX.fillStyle='#000';
  CTX.fillRect(0, 0, WIDTH, HEIGHT);
}

function fillOutput(){
  let arr = [];
  for(let i = 0; i < HEIGHT; i++) {
    arr.push([]);
    for(let j = 0; j < WIDTH; j++) {
      arr[i].push(0);
    }
  }
  return arr;
}

function showArr(T){
  let x=document.querySelector("#trash");
  x.innerText+=`\n`;
  for(let i=0; i<HEIGHT; i++){
    for(let j=0; j<WIDTH; j++){
      x.innerText+=T[i][j];
    }
  }
}

function hexToRgb(hex) {
  var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16)
  } : null;
}



setInterval(()=>{
  render(YROTATION.value, ZROTATION.value, document.querySelector("#color").value);
},5);
