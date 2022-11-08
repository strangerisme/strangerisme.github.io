"use strict";

var canvas;
var gl;

var maxNumVertices = 500;
var index = 0;
var cIndex = 0;

var first = true;

var colors = [
	0.0, 0.0, 0.0, 1.0, // black
	1.0, 0.0, 0.0, 1.0 , // red
	1.0, 1.0, 0.0, 1.0 , // yellow
	0.0, 1.0, 0.0, 1.0 , // green
	0.0, 0.0, 1.0, 1.0 , // blue
	1.0, 0.0, 1.0, 1.0 , // magenta
	0.0, 1.0, 1.0, 1.0  // cyan
];
   
var t,p;
var k=0;//用于判断 画布 传感的 点的  数 是奇数还是 偶数 ，来传导 t1 t2
var t1,t2,t3,t4;
var numPolygons = 0;//多边形个数
var numIndices = [];//索引数目
numIndices[0] = 0;
var start = [0];

function empty(){
	index = 0;
	cIndex = 0;
	first = true;
	k=0;//用于判断 画布 传感的 点的  数 是奇数还是 偶数 ，来传导 t1 t2
	var numPolygons = 0;//多边形个数
	var numIndices = [];//索引数目
	numIndices[0] = 0;
	var start = [0];
	
	initPolygonCanvas();
}

function initPolygonCanvas(){
	
	canvas = document.getElementById( "ply-canvas" );
	gl = WebGLUtils.setupWebGL( canvas );
	if( !gl ){
		alert( "WebGL isn't available" ); 
	}

	gl.viewport( 0, 0, canvas.width, canvas.height );
	gl.clearColor( 0.5, 0.5, 0.5, 1.0 );

	var m = document.getElementById( "cmenu" );
	m.addEventListener( "click", function(){
		cIndex = m.selectedIndex;//返回下拉列表中被选选项的索引号;0为第一个选项。-1设置为空选项
	});

	//多少个多边形
	var but = document.getElementById( "closepoly" );
	but.addEventListener( "click", function(){
		numPolygons++;//多边形的数量   //第一个多边形的numPolygons=0
		numIndices[numPolygons] = 0;//索引数目？  第n+1个多边形的索引数，下一个的点数 归零一下 进行累加计算
		start[numPolygons] = index;//第n+1个多边形的第一个点的位置存储    
		renderPolygons();
	});
	//算出来的点的位置有问题，对应的点色也有问题，错在公式和点
	//所以去找中心，然后用法向量，去得到另外两个点，
	//先点俩点   如何去选择画什么图形    然后去判断  计算其他的点     
	//去画正方形  //怎么把算出来的点 插进去 画出来？？？？？？去学一下 如何插点，，，和动画里面的 学
	var zfx = document.getElementById( "squ" );
	zfx.addEventListener( "click", function(){
		gl.bindBuffer( gl.ARRAY_BUFFER, vBuffer );//如果没有这个，则前面的三角形颜色会混起来
		
		t3 = glMatrix.vec2.fromValues( t2[0]-(t2[1]-t1[1]), t2[1]-(t1[0]-t2[0]) );
		
		gl.bindBuffer( gl.ARRAY_BUFFER, vBuffer );
		
		t4 = glMatrix.vec2.fromValues( t1[0]-(t2[1]-t1[1]), t1[1]-(t1[0]-t2[0]) );
		
		gl.bufferSubData( gl.ARRAY_BUFFER, 8 * (index+1), new Float32Array( t3 ) );
		gl.bufferSubData( gl.ARRAY_BUFFER, 8 * (index+2), new Float32Array( t4 ) );
		
		gl.bindBuffer( gl.ARRAY_BUFFER, cBuffer );
		var c = cIndex;
		c = c * 4;
		p = glMatrix.vec4.fromValues( colors[c], colors[c+1], colors[c+2], colors[c+3] );
		
		gl.bufferSubData( gl.ARRAY_BUFFER, 16 * (index + 1), new Float32Array( p ) );
		gl.bufferSubData( gl.ARRAY_BUFFER, 16 * (index + 2), new Float32Array( p ) );
		
		
		numIndices[numPolygons] = numIndices[numPolygons] + 2;
		index = index +2;
		
		numPolygons++;//多边形的数量
		numIndices[numPolygons] = 0;//索引数目？  第几个多边形的索引数，归零一下？
		start[numPolygons] = index;//第几个多边形的第一个点的顺序存储    
		renderPolygons();
	});

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
			t = glMatrix.vec2.fromValues( 2 * cx / canvas.width - 1, 2 * ( canvas.height - cy ) / canvas.height - 1 );
			t1=t;
			
			
		}else{
			first = true;
			gl.bindBuffer( gl.ARRAY_BUFFER, vBuffer );
			var rect = canvas.getBoundingClientRect();
			var cx = event.clientX - rect.left;
			var cy = event.clientY - rect.top; // offset
			t = glMatrix.vec2.fromValues( 2 * cx / canvas.width - 1, 2 * ( canvas.height - cy ) / canvas.height - 1 );
			t2=t;
		}
		gl.bufferSubData( gl.ARRAY_BUFFER, 8 * index, new Float32Array( t ) );

		gl.bindBuffer( gl.ARRAY_BUFFER, cBuffer );
		//var c = Math.floor(Math.random() * 1024) % 7;
		var c = cIndex;
		c = c * 4;
		t = glMatrix.vec4.fromValues( colors[c], colors[c+1], colors[c+2], colors[c+3] );
		gl.bufferSubData( gl.ARRAY_BUFFER, 16 * index, new Float32Array( t ) );
		
		numIndices[numPolygons]++;//第几个多边形的索引数++//第几个多边形的点数++
		index++;//所有索引数++
	} );

	var program = initShaders( gl, "vertex-shader", "fragment-shader" );
	gl.useProgram( program );

	var vBuffer = gl.createBuffer(); //position
	gl.bindBuffer( gl.ARRAY_BUFFER, vBuffer );
	gl.bufferData( gl.ARRAY_BUFFER, 8 * maxNumVertices, gl.STATIC_DRAW );

	var vPosition = gl.getAttribLocation( program, "vPosition" );
	gl.vertexAttribPointer( vPosition, 2, gl.FLOAT, false, 0, 0 );
	gl.enableVertexAttribArray( vPosition );

	var cBuffer = gl.createBuffer(); // color
	gl.bindBuffer( gl.ARRAY_BUFFER, cBuffer );
	gl.bufferData( gl.ARRAY_BUFFER, 16 * maxNumVertices, gl.STATIC_DRAW );

	var vColor = gl.getAttribLocation( program, "vColor" );
	gl.vertexAttribPointer( vColor, 4, gl.FLOAT, false, 0, 0 );
	gl.enableVertexAttribArray( vColor );

	renderPolygons();
	
}

function renderPolygons(){
	gl.clear( gl.COLOR_BUFFER_BIT );
	for( var i = 0; i < numPolygons; i++ )
		gl.drawArrays( gl.TRIANGLE_FAN, start[i], numIndices[i] );//start 数组存放 各多边形的起点（上一个的尾巴（索引数）是下一个的起点）
		  //numIndices 数组存放多边形的点数
	window.requestAnimationFrame(renderPolygons);
	//浏览器其实一直在刷新，当给window.requestAnimationFrame传入一个回调函数的时候，那么就是告诉浏览器在渲染前执行一下这个回调函数。
	//希望执行一个动画，并且要求浏览器在下次重绘之前调用指定的回调函数更新动画。该方法需要传入一个回调函数作为参数，该回调函数会在浏览器下一次重绘之前执行
}
