var CANVAS = document.querySelector("#canvas");

var CTX = CANVAS.getContext('2d');

var WIDTH = CTX.canvas.width;
var HEIGHT = CTX.canvas.height;

const THETA_SPACING = 0.07;
const PHI_SPACING = 0.02;

const R1 = 1;
const R2 = 2;
const K2 = 5;

const K1 = WIDTH * K2 * 3 / (8 * (R1 + R2));

var A=0, B=0;

const PI = Math.PI;


function render(A, B){
  colorBackground();
  let cosA = Math.cos(A), sinA = Math.sin(A), cosB = Math.cos(B), sinB = Math.sin(B);

  let zbuffer = fillOutput();

  for(let theta = 0; theta < 2 * PI; theta += THETA_SPACING){
    let costheta = Math.cos(theta), sintheta = Math.sin(theta);

    for(let phi = 0; phi < 2 * PI; phi += PHI_SPACING){
      let cosphi = Math.cos(phi), sinphi = Math.sin(phi);
      
      let circlex = R2 + R1 * costheta;
      let circley = R1 * sintheta;

      let x = circlex * (cosB * cosphi + sinA * sinB * sinphi) - circley * cosA  *sinB;
      let y = circlex * (sinB * cosphi - sinA * cosB * sinphi) + circley * cosA * cosB;
      let z = K2 + cosA * circlex * sinphi + circley * sinA;

      let ooz = 1/z;

      let xp = Math.floor(WIDTH/2 + K1 * ooz * x);
      let yp = Math.floor(HEIGHT/2 - K1 * ooz * y);

      let l = cosphi * costheta * sinB - cosA * costheta * sinphi - sinA * sintheta + cosB * (cosA * sintheta - costheta * sinA * sinphi);
      if (l > 0) {     
        if(ooz > zbuffer[yp][xp]) {
          zbuffer[yp][xp] = ooz;
          let li = l * 8;
          CTX.fillStyle=`rgba(255, 255, 255, ${l})`;
          CTX.fillRect(xp, yp, 2, 2);
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

render(A, B);