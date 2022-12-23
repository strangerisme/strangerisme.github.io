"use strict";

const {
    vec3, vec4, mat4
} = glMatrix;

var canvas;
var gl;

var points = [];
var colors = [];

var vBuffer = null;
var vPosition = null;
var vColor = null;
var cBuffer = null;

var modelViewMatrix, projectionMatrix;
var modelViewMatrixLoc, projectionMatrixLoc;

var near = -10;
var far = 10;
var radius = 6.0;
var theta = 0.0;
var phi = 0.0;
var stept = 5.0 * Math.PI / 180.0;//转动角度


var left = -2.0;
var right = 2.0;
var ytop = 2.0;
var bottom = -2.0;


var dxt = 0.0;
var dyt = 0.0;
var dzt = 0.0;
var stepm = 0.2;//移动距离

var dxm = 0.0;
var dym = 0.0;
var dzm = 0.0;

var eye;
var at = vec3.fromValues(0.0, 0.0, 0.0);
var up = vec3.fromValues(0.0, 1.0, 0.0);

var currentKey = [];
// move object
function handleKeyDown() {
    var key = event.keyCode;
    currentKey[key] = true;
    switch (key) {
        case 65: //left//a
            dxt -= stept;
            break;
        case 68: // right//d
            dxt += stept;
            break;
        case 87: // up//w
            dyt += stept;
            break;
        case 83: // down//s
            dyt -= stept;
            break;
        case 90: // a//z
            dzt += stept;
            break;
        case 88: // d//x
            dzt -= stept;
            break;
        case 72: // h//ytheta-
            dxm -= stepm;
            break;
        case 75: // k//ytheta+
            dxm += stepm;
            break;
        case 85: // u//xtheta+
            dym += stepm;
            break;
        case 74: // j//xtheta-
            dym -= stepm;
            break;
        case 78: // n//ztheta+
            dzm -= stepm;
            break;
        case 77: // m//ztheta-
            dzm += stepm;
            break;
        case 82: // r//reset
            dxm = 0;
            dym = 0;
            dzm = 0;
            dxt = 0;
            dyt = 0;
            dzt = 0;
        case 37: // left // theta--
            theta += stept;
            break;
        case 39: // right // theta++
            theta -= stept;
            break;
        case 38: // up // phi++
            phi += stept;
            break;
        case 40: // down // phi--
            phi -= stept;
            break;
    }
    requestAnimFrame(render);
}

function handleKeyUp() {
    currentKey[event.keyCode] = false;
}

function initSphere() {
    canvas = document.getElementById("gl-canvas");

    gl = WebGLUtils.setupWebGL(canvas);
    if (!gl) {
        alert("WebGL isn't available");
    }
	makeCube();
	
    gl.viewport(0, 0, canvas.width, canvas.height);
    gl.clearColor(0.0, 0.0, 0.0, 0.0);
	
	gl.enable(gl.DEPTH_TEST);
	
	//
    var program = initShaders(gl, "vertex-shader", "fragment-shader");
    gl.useProgram(program);

	//顶点
	vBuffer = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, vBuffer);
	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(points), gl.STATIC_DRAW);
	
	vPosition = gl.getAttribLocation(program, "vPosition");
	gl.vertexAttribPointer(vPosition, 3, gl.FLOAT, false, 0, 0);
	gl.enableVertexAttribArray(vPosition);
	
	//颜色
	cBuffer = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, cBuffer);
	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(colors), gl.STATIC_DRAW);
	
	vColor = gl.getAttribLocation(program, "vColor");
	gl.vertexAttribPointer(vColor, 4, gl.FLOAT, false, 0, 0);
	gl.enableVertexAttribArray(vColor);
	
	//设置视角矩阵
    modelViewMatrixLoc = gl.getUniformLocation(program, "modelViewMatrix");
    projectionMatrixLoc = gl.getUniformLocation(program, "projectionMatrix");

    modelViewMatrix = mat4.create();
    projectionMatrix = mat4.create();

    document.onkeydown = handleKeyDown;
    document.onkeyup = handleKeyUp;

    render();
}

function render() {
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    eye = vec3.fromValues(radius * Math.sin(theta) * Math.cos(phi),
        radius * Math.sin(theta) * Math.sin(phi),
        radius * Math.cos(theta));

    mat4.lookAt(modelViewMatrix, eye, at, up);
    mat4.translate(modelViewMatrix, modelViewMatrix, vec3.fromValues(dxm, dym, dzm));//移动位置
    mat4.rotateX(modelViewMatrix, modelViewMatrix, dxt);//旋转角度
    mat4.rotateY(modelViewMatrix, modelViewMatrix, dyt);
    mat4.rotateZ(modelViewMatrix, modelViewMatrix, dzt);

    mat4.ortho(projectionMatrix, left, right, bottom, ytop, near, far);

    gl.uniformMatrix4fv(modelViewMatrixLoc, false, new Float32Array(modelViewMatrix));
    gl.uniformMatrix4fv(projectionMatrixLoc, false, new Float32Array(projectionMatrix));

	gl.drawArrays(gl.TRIANGLES, 0, points.length / 3);
	
    requestAnimFrame(render);
}

function makeCube() {
    var vertices = [
		//头和身体
        glMatrix.vec4.fromValues(0,0.30,0.15, 1.0),//0
        glMatrix.vec4.fromValues(-0.125,0.32,-0.065, 1.0),//1
        glMatrix.vec4.fromValues(0.125,0.32,-0.065, 1.0),//2
        glMatrix.vec4.fromValues(0.1,0.45,-0.065, 1.0),//3
        glMatrix.vec4.fromValues(-0.1,0.45,-0.065, 1.0),//4
      
		glMatrix.vec4.fromValues(-0.05,0.3,0.085, 1.0),//5
		glMatrix.vec4.fromValues(0.05,0.3,0.085, 1.0),//6
		glMatrix.vec4.fromValues(0.1,0.3,0.0, 1.0),//7
		glMatrix.vec4.fromValues(0.05,0.3,-0.085, 1.0),//8
		glMatrix.vec4.fromValues(-0.05,0.3,-0.085, 1.0),//9
		glMatrix.vec4.fromValues(-0.1,0.3,0.0, 1.0),//10
		
		glMatrix.vec4.fromValues(-0.05,0.0,0.085, 1.0),//11
		glMatrix.vec4.fromValues(0.05,0.0,0.085, 1.0),//12
		glMatrix.vec4.fromValues(0.1,0.0,0.0, 1.0),//13
		glMatrix.vec4.fromValues(0.05,0.0,-0.085, 1.0),//14
		glMatrix.vec4.fromValues(-0.05,0.0,-0.085, 1.0),//15
		glMatrix.vec4.fromValues(-0.1,0.0,0.0, 1.0),//16
		
		//右胳膊
		glMatrix.vec4.fromValues(0.1,0.2,0.025, 1.0),//17
		glMatrix.vec4.fromValues(0.1,0.25,0.025, 1.0),//18
		glMatrix.vec4.fromValues(0.1,0.25,-0.025, 1.0),//19
		glMatrix.vec4.fromValues(0.1,0.2,-0.025, 1.0),//20
		glMatrix.vec4.fromValues(0.28,0.2,0.025, 1.0),//21
		glMatrix.vec4.fromValues(0.28,0.25,0.025, 1.0),//22
		glMatrix.vec4.fromValues(0.28,0.25,-0.025, 1.0),//23
		glMatrix.vec4.fromValues(0.28,0.2,-0.025, 1.0),//24
		
		glMatrix.vec4.fromValues(0.23,0.2,0.205, 1.0),//25
		glMatrix.vec4.fromValues(0.28,0.2,0.205, 1.0),//26
		glMatrix.vec4.fromValues(0.28,0.25,0.205, 1.0),//27
		glMatrix.vec4.fromValues(0.23,0.25,0.205, 1.0),//28
		glMatrix.vec4.fromValues(0.23,0.2,0.025, 1.0),//29
		glMatrix.vec4.fromValues(0.28,0.2,0.025, 1.0),//30
		glMatrix.vec4.fromValues(0.28,0.25,0.025, 1.0),//31
		glMatrix.vec4.fromValues(0.23,0.25,0.025, 1.0),//32
		
		//左胳膊
		glMatrix.vec4.fromValues(-0.1,0.2,0.025, 1.0),//33
		glMatrix.vec4.fromValues(-0.1,0.2,-0.025, 1.0),//34
		glMatrix.vec4.fromValues(-0.1,0.25,-0.025, 1.0),//35
		glMatrix.vec4.fromValues(-0.1,0.25,0.025, 1.0),//36
		glMatrix.vec4.fromValues(-0.28,0.2,0.025, 1.0),//37
		glMatrix.vec4.fromValues(-0.28,0.2,-0.025, 1.0),//38
		glMatrix.vec4.fromValues(-0.28,0.25,-0.025, 1.0),//39
		glMatrix.vec4.fromValues(-0.28,0.25,0.025, 1.0),//40
		
		glMatrix.vec4.fromValues(-0.28,0.2,0.205, 1.0),//41
		glMatrix.vec4.fromValues(-0.23,0.2,0.205, 1.0),//42
		glMatrix.vec4.fromValues(-0.23,0.25,0.205, 1.0),//43
		glMatrix.vec4.fromValues(-0.28,0.25,0.205, 1.0),//44
		glMatrix.vec4.fromValues(-0.28,0.2,0.025, 1.0),//45
		glMatrix.vec4.fromValues(-0.23,0.2,0.025, 1.0),//46
		glMatrix.vec4.fromValues(-0.23,0.25,0.025, 1.0),//47
		glMatrix.vec4.fromValues(-0.28,0.25,0.025, 1.0),//48
		
		//眼睛
		glMatrix.vec4.fromValues(-0.05,0.36,0.095, 1.0),//49
		glMatrix.vec4.fromValues(-0.02,0.33,0.023, 1.0),//50
		glMatrix.vec4.fromValues(-0.08,0.33,0.023, 1.0),//51
		glMatrix.vec4.fromValues(-0.01,0.4,0.023, 1.0),//52
		glMatrix.vec4.fromValues(-0.09,0.4,0.023, 1.0),//53
		
		glMatrix.vec4.fromValues(0.05,0.36,0.095, 1.0),//54
		glMatrix.vec4.fromValues(0.02,0.33,0.023, 1.0),//55
		glMatrix.vec4.fromValues(0.08,0.33,0.023, 1.0),//56
		glMatrix.vec4.fromValues(0.01,0.4,0.023, 1.0),//57
		glMatrix.vec4.fromValues(0.09,0.4,0.023, 1.0),//58
		
		//左脚
		glMatrix.vec4.fromValues(-0.08,-0.15,0.09, 1.0),//59
		glMatrix.vec4.fromValues(-0.03,-0.15,-0.065, 1.0),//60,,
		glMatrix.vec4.fromValues(-0.175,-0.15,-0.065, 1.0),//61//
		glMatrix.vec4.fromValues(-0.08,0,0, 1.0),//62
		//右脚
		glMatrix.vec4.fromValues(0.08,-0.15,0.09, 1.0),//63
		glMatrix.vec4.fromValues(0.175,-0.15,-0.065, 1.0),//64//
		glMatrix.vec4.fromValues(0.03,-0.15,-0.065, 1.0),//65,,
		glMatrix.vec4.fromValues(0.08,0,0, 1.0),//66
    ];

    var vertexColors = [
		//后脑勺
        glMatrix.vec4.fromValues(0.57, 0.8, 0.918, 1.0),
        glMatrix.vec4.fromValues(0.57, 0.8, 0.918, 1.0),
		
		//四个侧脸
       glMatrix.vec4.fromValues(0.86, 0.86, 0.86, 1.0),
       glMatrix.vec4.fromValues(0.86, 0.86, 0.86, 1.0),
	   glMatrix.vec4.fromValues(0.57, 0.8, 0.918, 1.0),
	   glMatrix.vec4.fromValues(0.57, 0.8, 0.918, 1.0),
        
		//身体  20个
		
		
		//前2个一样颜色
		glMatrix.vec4.fromValues(0.86, 0.86, 0.86, 1.0),
		glMatrix.vec4.fromValues(0.86, 0.86, 0.86, 1.0),
		
		//后2个一样颜色
		glMatrix.vec4.fromValues(0.57, 0.8, 0.918, 1.0),
		glMatrix.vec4.fromValues(0.57, 0.8, 0.918, 1.0),
		
		//上
		glMatrix.vec4.fromValues(0.86, 0.86, 0.86, 1.0),
		glMatrix.vec4.fromValues(0.86, 0.86, 0.86, 1.0),
		glMatrix.vec4.fromValues(0.86, 0.86, 0.86, 1.0),
		glMatrix.vec4.fromValues(0.86, 0.86, 0.86, 1.0),
		
		//底4个
		glMatrix.vec4.fromValues(0.86, 0.86, 0.86, 1.0),
		glMatrix.vec4.fromValues(0.86, 0.86, 0.86, 1.0),
		glMatrix.vec4.fromValues(0.86, 0.86, 0.86, 1.0),
		glMatrix.vec4.fromValues(0.86, 0.86, 0.86, 1.0),
		
		//左前+右前
		glMatrix.vec4.fromValues(0.57, 0.8, 0.918, 1.0),
		glMatrix.vec4.fromValues(0.57, 0.8, 0.918, 1.0),
		glMatrix.vec4.fromValues(0.57, 0.8, 0.918, 1.0),
		glMatrix.vec4.fromValues(0.57, 0.8, 0.918, 1.0),
		
		//左后+右后
		glMatrix.vec4.fromValues(0.86, 0.86, 0.86, 1.0),
		glMatrix.vec4.fromValues(0.86, 0.86, 0.86, 1.0),
		glMatrix.vec4.fromValues(0.86, 0.86, 0.86, 1.0),
		glMatrix.vec4.fromValues(0.86, 0.86, 0.86, 1.0),
		
		//右胳膊
		//前后
		glMatrix.vec4.fromValues(0.75, 0.75, 0.75, 1.0),
		glMatrix.vec4.fromValues(0.75, 0.75, 0.75, 1.0),
		glMatrix.vec4.fromValues(0.75, 0.75, 0.75, 1.0),
		glMatrix.vec4.fromValues(0.75, 0.75, 0.75, 1.0),
		//上下
		glMatrix.vec4.fromValues(0.75, 0.75, 0.75, 1.0),
		glMatrix.vec4.fromValues(0.75, 0.75, 0.75, 1.0),
		glMatrix.vec4.fromValues(0.75, 0.75, 0.75, 1.0),
		glMatrix.vec4.fromValues(0.75, 0.75, 0.75, 1.0),
		//左右
		glMatrix.vec4.fromValues(0.75, 0.75, 0.75, 1.0),
		glMatrix.vec4.fromValues(0.75, 0.75, 0.75, 1.0),
		glMatrix.vec4.fromValues(0.75, 0.75, 0.75, 1.0),
		glMatrix.vec4.fromValues(0.75, 0.75, 0.75, 1.0),
		//前后
		glMatrix.vec4.fromValues(0.86, 0.86, 0.86, 1.0),
		glMatrix.vec4.fromValues(0.86, 0.86, 0.86, 1.0),
		glMatrix.vec4.fromValues(0.86, 0.86, 0.86, 1.0),
		glMatrix.vec4.fromValues(0.86, 0.86, 0.86, 1.0),
		//左右
		glMatrix.vec4.fromValues(0.86, 0.86, 0.86, 1.0),
		glMatrix.vec4.fromValues(0.86, 0.86, 0.86, 1.0),
		glMatrix.vec4.fromValues(0.86, 0.86, 0.86, 1.0),
		glMatrix.vec4.fromValues(0.86, 0.86, 0.86, 1.0),
		//上下
		glMatrix.vec4.fromValues(0.86, 0.86, 0.86, 1.0),
		glMatrix.vec4.fromValues(0.86, 0.86, 0.86, 1.0),
		glMatrix.vec4.fromValues(0.86, 0.86, 0.86, 1.0),
		glMatrix.vec4.fromValues(0.86, 0.86, 0.86, 1.0),
		
		//左胳膊
		//前后
		glMatrix.vec4.fromValues(0.75, 0.75, 0.75, 1.0),
		glMatrix.vec4.fromValues(0.75, 0.75, 0.75, 1.0),
		glMatrix.vec4.fromValues(0.75, 0.75, 0.75, 1.0),
		glMatrix.vec4.fromValues(0.75, 0.75, 0.75, 1.0),
		//上下
		glMatrix.vec4.fromValues(0.75, 0.75, 0.75, 1.0),
		glMatrix.vec4.fromValues(0.75, 0.75, 0.75, 1.0),
		glMatrix.vec4.fromValues(0.75, 0.75, 0.75, 1.0),
		glMatrix.vec4.fromValues(0.75, 0.75, 0.75, 1.0),
		//左右
		glMatrix.vec4.fromValues(0.75, 0.75, 0.75, 1.0),
		glMatrix.vec4.fromValues(0.75, 0.75, 0.75, 1.0),
		glMatrix.vec4.fromValues(0.75, 0.75, 0.75, 1.0),
		glMatrix.vec4.fromValues(0.75, 0.75, 0.75, 1.0),
		//前后
		glMatrix.vec4.fromValues(0.86, 0.86, 0.86, 1.0),
		glMatrix.vec4.fromValues(0.86, 0.86, 0.86, 1.0),
		glMatrix.vec4.fromValues(0.86, 0.86, 0.86, 1.0),
		glMatrix.vec4.fromValues(0.86, 0.86, 0.86, 1.0),
		//左右
		glMatrix.vec4.fromValues(0.86, 0.86, 0.86, 1.0),
		glMatrix.vec4.fromValues(0.86, 0.86, 0.86, 1.0),
		glMatrix.vec4.fromValues(0.86, 0.86, 0.86, 1.0),
		glMatrix.vec4.fromValues(0.86, 0.86, 0.86, 1.0),
		//上下
		glMatrix.vec4.fromValues(0.86, 0.86, 0.86, 1.0),
		glMatrix.vec4.fromValues(0.86, 0.86, 0.86, 1.0),
		glMatrix.vec4.fromValues(0.86, 0.86, 0.86, 1.0),
		glMatrix.vec4.fromValues(0.86, 0.86, 0.86, 1.0),
		
		//左眼睛
		//后
		glMatrix.vec4.fromValues(0.0, 0.0, 0.0, 1.0),
		glMatrix.vec4.fromValues(0.0, 0.0, 0.0, 1.0),
		//左
		glMatrix.vec4.fromValues(0.0, 0.0, 0.0, 1.0),
		//右
		glMatrix.vec4.fromValues(0.0, 0.0, 0.0, 1.0),
		//上下
		glMatrix.vec4.fromValues(0.0, 0.0,0.0, 1.0),
		glMatrix.vec4.fromValues(0.0, 0.0,0.0, 1.0),
		
		//右眼睛
		//后
		glMatrix.vec4.fromValues(0.0, 0.0,0.0, 1.0),
		glMatrix.vec4.fromValues(0.0, 0.0,0.0, 1.0),
		//左
		glMatrix.vec4.fromValues(0.0, 0.0, 0.0, 1.0),
		//右
		glMatrix.vec4.fromValues(0.0, 0.0, 0.0, 1.0),
		//上下
		glMatrix.vec4.fromValues(0.0, 0.0,0.0, 1.0),
		glMatrix.vec4.fromValues(0.0, 0.0,0.0, 1.0),
		
		//左脚
		glMatrix.vec4.fromValues(0.57, 0.8, 0.918, 1.0),
		glMatrix.vec4.fromValues(0.57, 0.8, 0.918, 1.0),
		glMatrix.vec4.fromValues(0.57, 0.8, 0.918, 1.0),
		glMatrix.vec4.fromValues(0.57, 0.8, 0.918, 1.0),
		
		//右脚
		glMatrix.vec4.fromValues(0.57, 0.8, 0.918, 1.0),
		glMatrix.vec4.fromValues(0.57, 0.8, 0.918, 1.0),
		glMatrix.vec4.fromValues(0.57, 0.8, 0.918, 1.0),
		glMatrix.vec4.fromValues(0.57, 0.8, 0.918, 1.0),
    ];

    var faces = [
		//脑袋
		1,4,3,1,2,3, //背
        3,4,0,//上
        1,2,0, //底
        1,0,4, //左
        0,2,3,//右
        
		//身体
		5,6,11,11,12,6,//前
		9,8,15,14,15,8,//后
		10,5,9,6,8,7,5,6,9,8,9,6,//上
		15,16,11,12,13,14,15,11,12,15,14,12,//底
		10,5,11,11,16,10,//左前
		6,7,12,12,13,7,//右前
		9,10,15,16,15,10,//左后
		7,8,14,13,14,7,//右后
		
		//胳膊1右胳膊
		17,21,18,18,22,21,//前
		20,24,23,19,23,20,//后
		18,19,22,19,23,22,//上
		20,24,17,17,21,24,//下
		18,19,20,17,20,18,//左
		22,23,24,21,24,22,//右
		
		28,27,25,25,26,27,//前
		32,31,29,29,30,31,//后
		25,29,32,32,28,25,//左
		27,26,30,27,31,30,//右
		28,27,31,32,31,28,//上
		29,30,25,25,26,30,//下
		
		
		//胳膊2左胳膊
		37,33,36,36,40,37,//前
		38,34,35,35,39,38,//后
		38,37,40,39,40,38,//左
		33,34,35,36,35,33,//右
		39,35,36,36,40,39,//上
		37,33,34,34,38,37,//下
		
		41,42,43,44,43,41,//前
		45,46,47,48,47,45,//后
		44,41,45,44,48,45,//左
		42,46,47,47,43,42,//右
		48,47,43,44,43,48,//上
		41,42,46,45,46,41,//下
		
		//眼睛
		//左眼
		50,51,52,52,51,53,//后
		49,51,53,//左
		52,50,49,//右
		49,52,53,//上
		49,50,51,//下
		//右眼
		55,56,57,57,56,58,//后
		54,56,58,//左
		54,55,57,//右
		54,57,58,//上
		54,55,56,//下
		
		
		//左脚
		59,60,62,//左内侧
		61,60,62,//后
		59,60,61,//底
		61,62,59,//左外
		
		//右脚
		63,65,66,//右内侧
		64,65,66,//后
		63,64,65,//底
		63,64,66,//右外
    ];

    for (var i = 0; i < faces.length ;i++) {
        points.push(vertices[faces[i]][0], vertices[faces[i]][1], vertices[faces[i]][2]);
		
		colors.push(vertexColors[Math.floor(i / 3)][0], vertexColors[Math.floor(i / 3)][1], vertexColors[Math.floor(i / 3)][2], vertexColors[Math.floor(i / 3)][3]);
		}
	
}