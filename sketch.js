//intended to represent finite solids

//takes in vector, computes boolean--put your solid equations here
//if the result is true, the pixel is colored
//due to the nature of the ray tracer, inequalities work best
//for reference, (increasing) x is to the right, y is down, and z is forward
function f(r) {
  let equation = (2 - ((r[0] + (-10*(mouseX-width/2)/width))**2 + (r[1] + (-10*(mouseY-width/2)/width))**2)**(1/2))**2 + (r[2]-20)**2;
  return [equation <= 1, equation];
}

//Difference of two arrays(vector difference)
function difference(a, b) {
  let output = [];
  if (a.length == b.length) {
    for (let i = 0; i < a.length; i++) {
      output.push(a[i] - b[i]);
    }
  }
  return output;
}

//Dot product of two arrays
function Dot(a, b) {
  let output = 0;
  if (a.length == b.length) {
    for (let i = 0; i < a.length; i++) {
      output += a[i] * b[i];
    }
  }
  return output;
}

//Norm of one array
function Norm(a) {
  let output = 0;
  for (let i = 0; i < a.length; i++) {
    output += a[i] ** 2;
  }
  output = output ** (1 / 2);
  return output;
}

//Ray Tracer--increase t limit if you want to trace farther, at the cost of extra loading time
//Also calculates nabla for normal vector
function ray(f, V, O) {
  let D = 0.00000001;
  for (let t = 1; t < 100; t += 1) {
    let r = [
      (V[0] - O[0]) * t + O[0],
      (V[1] - O[1]) * t + O[1],
      (V[2] - O[2]) * t + O[2],
    ];
    if (f(r)[0]) {
      return [true, [(f([r[0]+D, r[1], r[2]])[1] - f(r)[1])/D,
      (f([r[0], r[1]+D, r[2]])[1] - f(r)[1])/D,
      (f([r[0], r[1], r[2]+D])[1] - f(r)[1])/D], r];
    }
  }
  return false;
}

function setup() {
  createCanvas(800, 800);
}

//p5 stuff -- checks ray tracer, and colors to color if "true"
function draw() {
  background(0);
  loadPixels();
  pixelDensity(1);
  maximum = 4 * width * height; //Pixel index maximum
  let O = [1 / 2, 1 / 2, 0]; //Position of the camera
  let distance = 1; //Distance from camera to canvas
  let light1 = [1/2, 1/2, 0];
  for (let i = 0; i < maximum; i += 4) {
    canvasX = ((i / 4) % width); //Calculate x position on the canvas, using the canvas size
    canvasY = i / 4 / parseFloat(width); //Calculate y position on the canvas, using the canvas size
    x0to1 = canvasX / parseFloat(width); //Bound the x from 0 to 1, with 0 at the left side of the canvas
    y0to1 = canvasY / parseFloat(height); //Bound the y from 0 to 1, with 0 at the top of the canvas
    let V = [
      x0to1,
      y0to1,
      distance,
    ];
    let temp = ray(f, V, O);
    let condition = temp[0];
    if(condition) {
      let N = temp[1];
      let r = temp[2];
      let intensity1 = Dot(N, difference(light1, r))/Norm(N)/Norm(difference(light1, r));
      let ambience = 100;
      if (intensity1 < 0) {
        intensity1 = 0;
      }
      let c = color(255*intensity1 + ambience, 255*intensity1 + ambience, 0); //Color
      pixels[i] = red(c);
      pixels[i + 1] = green(c);
      pixels[i + 2] = blue(c);
      pixels[i + 3] = alpha(c);
    }
  }
  updatePixels();
}