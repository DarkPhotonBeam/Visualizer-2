#ifdef GL_ES
precision highp float;
#endif

uniform vec2 u_resolution; // This is passed in as a uniform from the sketch.js file
uniform vec2 u_mouse; // This is passed in as a uniform from the sketch.js file
uniform vec2 u_offset; // This is passed in as a uniform from the sketch.js file
uniform float u_zoom; // This is passed in as a uniform from the sketch.js file
uniform int u_iter; // This is passed in as a uniform from the sketch.js file
uniform float u_level; // This is passed in as a uniform from the sketch.js file

float zoom = 1.0;
const float scrZoom = 1.0;

const float scaleX = 0.001724138;
const float scaleY = -0.001724138;

float transX = u_resolution.x/2.0;

float transY = u_resolution.y/2.0;

//float ltransX = 0.0;

//float ltransY = 0.0;

vec2 offset;

float cx(float x) {
  return (x-transX)*scaleX/zoom + offset.x;
}

float cx(float x, float zm) {
  return (x-transX)*scaleX/zm + offset.x;
}

float cy(float y) {
  return (y-transY)*scaleY/zoom + offset.y;
}

float cy(float y, float zm) {
  return (y-transY)*scaleY/zm + offset.y;
}

vec2 squareVec(vec2 dpVect) {
    return vec2(dpVect.x * dpVect.x - dpVect.y * dpVect.y, dpVect.x * dpVect.y + dpVect.y * dpVect.x);
}

const int checkingIterations = 750;

int Mandelbrot(vec2 coor, vec2 zOld) {


  ////zOld.square();
  //vec2 zOldSquared = squareVec(zOld);

  //vec2 newZ = vec2(zOldSquared.x + coor.x, zOldSquared.y + coor.y);
  ////ComplexNumber z = addZs(zOld, coor);

  /*if (sqrt(newZ.x * newZ.x + newZ.y * newZ.y) > 2.0 || iter >= checkIter) {
    return iter;
  }*/

  //iter = iter + 1;
  //return Mandelbrot(coor, newZ, iter);
  //return 1;

  vec2 z0 = zOld;

const int citer = 100;

  for (int i = 0; i < checkingIterations; i++) {
    vec2 zOldSquared = squareVec(z0);
    vec2 z1 = vec2(zOldSquared.x + coor.x, zOldSquared.y + coor.y);

    if (sqrt(z1.x * z1.x + z1.y * z1.y) > 2.0) {
        return i;
    }

    z0 = z1;
  }
  return checkingIterations;
}

void main() {

    zoom = pow(u_zoom, u_zoom*0.01);
    if (zoom < 1.0) zoom = 1.0;

    offset = u_offset;

  // position of the pixel divided by resolution, to get normalized positions on the canvas
  vec2 st = gl_FragCoord.xy/u_resolution.xy;

  vec2 mouseRat = u_mouse.xy / u_resolution.xy;

    // Mandelbrot ATTEMPT

    //checkingIterations = 100;

    int iterations = Mandelbrot(vec2(cx(gl_FragCoord.x), cy(gl_FragCoord.y)), vec2(0.0, 0.0));

    float mandelColor = float(iterations) / float(checkingIterations);

    float opacity = u_level;

    vec4 pcolor = vec4(pow(mandelColor, 0.5),pow(u_level, 1.2),pow(mandelColor, 0.5)*0.5,opacity);

    if (iterations == checkingIterations) pcolor = vec4(0.0, 0.0, 0.0, opacity);

  gl_FragColor = pcolor; // R,G,B,A

  // you can only have one gl_FragColor active at a time, but try commenting the others out
  // try the green component

  //gl_FragColor = vec4(0.0,st.x,0.0,0.1);

  // try both the x position and the y position

  //gl_FragColor = vec4(st.x,st.y,0.0,1.0);
}