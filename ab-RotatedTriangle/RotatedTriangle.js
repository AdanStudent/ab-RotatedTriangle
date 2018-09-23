//Rotated Triangle.js
//Vertexshader program
var VSHADER_SOURCE =
    //x' = x cos b - y sin b
    //y' = x sin b + y cos b
    //z' = z
    'attribute vec4 a_Position;\n' +
    'uniform float u_CosB, u_SinB;\n' +
    'void main() {\n' +
    ' gl_Position.x = a_Position.x * u_CosB - a_Position.y * u_SinB;\n' +
    ' gl_Position.y = a_Position.x * u_SinB + a_Position.y * u_CosB;\n' +
    ' gl_Position.z = a_Position.z;\n' +
    ' gl_Position.w = 1.0;\n' +
    '}\n';

// Fragment Shader program
var FSHADER_SOURCE =
    'void main() {\n' +
    ' gl_FragColor = vec4(1.0, 0.0, 0.0, 1.0);\n' +
    '}\n';

//Rotation Angle
var ANGLE = 90;

function main() {
    //Retreive <canvas>
    var canvas = document.getElementById('webgl');

    //get rendering context
    var gl = getWebGLContext(canvas);
    if (!gl) {
        console.log('Failed to get the rendering context for WebGL');
        return;
    }

    //Initialize shaders
    if (!initShaders(gl, VSHADER_SOURCE, FSHADER_SOURCE)) {
        console.log('Failed to initalize shaders');
        return;
    }

    //write the positions of vertices to a vertex shader
    var n = initVertexBuffers(gl);
    if (n < 0) {
        console.log('failed to set the positions of the vertices');
        return;
    }

    //Pass the data required to rotate the shape to the vertex shader
    var radian = Math.PI * ANGLE / 180.0; //convert to radians
    var cosB = Math.cos(radian);
    var sinB = Math.sin(radian);

    var u_CosB = gl.getUniformLocation(gl.program, 'u_CosB');
    var u_SinB = gl.getUniformLocation(gl.program, 'u_SinB');

    gl.uniform1f(u_CosB, cosB);
    gl.uniform1f(u_SinB, sinB);

    //specify the color for clearing <canvas>
    gl.clearColor(0, 0, 0, 1);

    //Clear <canvas>
    gl.clear(gl.COLOR_BUFFER_BIT);

    //draw the rectangle
    gl.drawArrays(gl.TRIANGLES, 0, n);
}//end of main

function initVertexBuffers(gl) {
    var vertices = new Float32Array([
        0.0, 0.5, -0.5, -0.5, 0.5, -0.5]);

    var n = 3;

    //create Buffer object
    var vertexBuffer = gl.createBuffer();
    if (!vertexBuffer) {
        console.log('failed to create the buffer object');
        return -1;
    }

    //bind the buffer object to target
    gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
    //write data into the buffer object
    gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);

    var a_Position = gl.getAttribLocation(gl.program, 'a_Position');
    if (a_Position < 0) {
        console.log('failed to get the storage location of a_Position');
        return -1;
    }
    //assign the buffer object to a_Position variable
    gl.vertexAttribPointer(a_Position, 2, gl.FLOAT, false, 0, 0);

    //enable the assignment to a_Position variable
    gl.enableVertexAttribArray(a_Position);

    return n;
}