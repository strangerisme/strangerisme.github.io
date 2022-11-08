"use strict";

var canvas;
var gl;

var maxNumTriangles = 200;
var maxNumVertices = 3 * maxNumTriangles;
var index = 0;
var first = true;

//后面4个t用于存放矩形四个点的向量表示？
var t, t1, t2, t3, t4;

var cIndex = 0;

//7个颜色
var colors = [
	0.0, 0.0, 0.0, 1.0, // black
	1.0, 0.0, 0.0, 1.0 , // red
	1.0, 1.0, 0.0, 1.0 , // yellow
	0.0, 1.0, 0.0, 1.0 , // green
	0.0, 0.0, 1.0, 1.0 , // blue
	1.0, 0.0, 1.0, 1.0 , // magenta
	0.0, 1.0, 1.0, 1.0  // cyan
];

function initRectCanvas(){
	canvas = document.getElementById( "rect-canvas" );
	gl = WebGLUtils.setupWebGL( canvas );
	if( !gl ){
		alert( "WebGL isn't available" );
	}
	//设置视口大小
	gl.viewport( 0, 0, canvas.width, canvas.height );
	gl.clearColor( 0.5, 0.5, 0.5, 1.0 );//清除canvas

	canvas.addEventListener( "mousedown", function( event ){
		//将缓冲区对象绑定到目标
		gl.bindBuffer( gl.ARRAY_BUFFER, vBuffer );
		
		if( first ){
			first = false;
			gl.bindBuffer( gl.ARRAY_BUFFER, vBuffer );
			var rect = canvas.getBoundingClientRect();
			// 这个cx   是你鼠标点击的位置   距离你的canvas左边框的距离
			var cx = event.clientX - rect.left;
			// 这个cy   是你鼠标点击的位置   距离你的canvas上边框的距离
			var cy = event.clientY - rect.top; // offset
			//t1类似于 将相对位置转换为 页面尺寸的坐标显示，——200（长）*300 鼠标像素位置 30，20 ，然后t1是glMatrix.vec2.fromValues(2,0.866),然后转换成向量？
			t1 = glMatrix.vec2.fromValues( 2 * cx / canvas.width - 1, 2 * ( canvas.height - cy ) / canvas.height - 1 );
		}else{
			first = true;
			var rect = canvas.getBoundingClientRect();
			var cx = event.clientX - rect.left;
			var cy = event.clientY - rect.top; // offset
			t2 = glMatrix.vec2.fromValues( 2 * cx / canvas.width - 1, 2 * ( canvas.height - cy ) / canvas.height - 1 );
			
			//已知正方形两点坐标，得其他两点坐标
			//	x3=x2-(y2-y1);
			//	y3=y2-(x1-x2);
			//	x4=x1-(y2-y1);
			//	y4=y1-(x1-x2);
			
			t3 = glMatrix.vec2.fromValues( t2[0]-(t2[1]-t1[1]), t2[1]-(t1[0]-t2[0]) );
			t4 = glMatrix.vec2.fromValues( t1[0]-(t2[1]-t1[1]), t1[1]-(t1[0]-t2[0]) );

			gl.bufferSubData( gl.ARRAY_BUFFER, 8 * index, new Float32Array( t1 ) );
			gl.bufferSubData( gl.ARRAY_BUFFER, 8 * (index+1), new Float32Array( t2 ) );
			gl.bufferSubData( gl.ARRAY_BUFFER, 8 * (index+2), new Float32Array( t3 ) );
			gl.bufferSubData( gl.ARRAY_BUFFER, 8 * (index+3), new Float32Array( t4 ) );
			
			gl.bindBuffer( gl.ARRAY_BUFFER, cBuffer );
			//获得 >=0   <1024  然后floor取整，最后取余7，，，意思是在0-7中随机，，，为了得到color里7个预置的随机颜色
			var c = Math.floor(Math.random() * 1024) % 7;
			//var c = 0;
			//c为什么要乘以4？
			c = c * 4;
			t = glMatrix.vec4.fromValues( colors[c], colors[c+1], colors[c+2], colors[c+3] );
			
			gl.bufferSubData( gl.ARRAY_BUFFER, 16 * index, new Float32Array( t ) );
			gl.bufferSubData( gl.ARRAY_BUFFER, 16 * (index + 1), new Float32Array( t ) );
			gl.bufferSubData( gl.ARRAY_BUFFER, 16 * (index + 2), new Float32Array( t ) );
			gl.bufferSubData( gl.ARRAY_BUFFER, 16 * (index + 3), new Float32Array( t ) );
			
			index += 4;
		}
	} );
	//初始化着色器
	var program = initShaders( gl, "vertex-shader", "fragment-shader" );
	gl.useProgram( program );//将着色器程序设置为有效

	var vBuffer = gl.createBuffer(); //position
	gl.bindBuffer( gl.ARRAY_BUFFER, vBuffer );
	gl.bufferData( gl.ARRAY_BUFFER, 8 * maxNumVertices, gl.STATIC_DRAW );//参数1：目标（指定目标缓冲区对象，符号常量必须为
	//GL_ARRAY_BUFFER 或 GL_ELEMENT_ARRAY_BUFFER）；参数2：大小（在指定的缓冲区对象的新的数据存储的字节大小）；（中间少了一个参数
	//代表常量指针数据，//指定一个或指针的数据，将数据复制到存储初始化，，空，如果没有数据要被复制）；参数3：使用（指定数据存储的预期使用格局。
	//符号常量必须为GL_STREAM_DRAW ，//GL_STATIC_DRAW ，或 GL_DYNAMIC_DRAW）

	var vPosition = gl.getAttribLocation( program, "vPosition" );
	gl.vertexAttribPointer( vPosition, 2, gl.FLOAT, false, 0, 0 );
	gl.enableVertexAttribArray( vPosition );
	
	//颜色数据
	var cBuffer = gl.createBuffer(); // color//创建缓冲区对象
	gl.bindBuffer( gl.ARRAY_BUFFER, cBuffer );//绑定对象
	gl.bufferData( gl.ARRAY_BUFFER, 16 * maxNumVertices, gl.STATIC_DRAW );//向缓冲区对象写入数据

	var vColor = gl.getAttribLocation( program, "vColor" );//获取着色器中的Attribute变量
	gl.vertexAttribPointer( vColor, 4, gl.FLOAT, false, 0, 0 );//将缓冲区对象分配给attribute变量
	gl.enableVertexAttribArray( vColor );//建立attribute变量与缓冲区之间的连接

	renderTriangles();
}

function renderTriangles(){
	gl.clear( gl.COLOR_BUFFER_BIT );//清空颜色缓冲区
	for( var i = 0; i < index; i+=4 )//意思是：每四个够了就跳到下一个//第几个正方形
		gl.drawArrays( gl.TRIANGLE_FAN, i, 4 );//四个点画一个四边形（正方形）
	window.requestAnimationFrame( renderTriangles );
	//浏览器其实一直在刷新，当给window.requestAnimationFrame传入一个回调函数的时候，那么就是告诉浏览器在渲染前执行一下这个回调函数。
}