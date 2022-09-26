"use strict";

var gl;
var points;

window.onload = function init(){
	var canvas = document.getElementById( "triangle-canvas" );
	gl = WebGLUtils.setupWebGL( canvas );
	if( !gl ){
		alert( "WebGL isn't available" );
	}

 // Three Vertices//房顶
    var vertices = [
        -0.5, 0.25,
        -1,  -0.25,
        0.0,  -0.25
    ];
	//房子体
    var vertices2 = [
        -0.8, -0.25,
        -0.8,  -0.8, 
        -0.2, -0.8, 
        -0.2, -0.25,
        -0.8, -0.25,
        -0.2, -0.8
    ];
	//门
	var vertices3 = [
	    -0.5, -0.41,
	    -0.5,  -0.8, 
	    -0.3, -0.41, 
	    -0.3, -0.41,
	    -0.5,  -0.8,
	    -0.3, -0.8
	];
	//窗
	var vertices4 = [
	    -0.7, -0.35,
	    -0.7,  -0.5, 
	    -0.55, -0.35, 
	    -0.55, -0.35,
	    -0.7,  -0.5,
	    -0.55, -0.5
	];
	//树干
	var vertices5 = [
	    0.45, -0.5,
	    0.55,  -0.5, 
	    0.45, -0.8, 
	    0.55,  -0.5,
	    0.45, -0.8,
	    0.55, -0.8
	];
	//树层
	var vertices6 = [
	     0.5, 0.5,
	    0.25,  0.25, 
	    0.75, 0.25, 
	     0.5,  0.25,
	    0.2, 0.0,
	    0.8, 0.0,
	      0.5,  0.0,
	    0.15, -0.25,
	     0.85,-0.25,
	       0.5,-0.25,
	     0.1,-0.5,
	     0.9,-0.5
	];
	//太阳
	var vertices7 = [
	     -0.75,0.5,
		   -0.625,0.53,
		   -0.53,0.625,
		-0.5,0.75,
		   -0.53,0.875,
		   -0.625,0.97,
		-0.75,1,
		   -0.875,0.97,
		   -0.97,0.875,
		-1,0.75,
		   -0.97,0.625,
		   -0.875,0.53,
		-0.75,0.5
	];
    // Configure WebGL
    	gl.viewport( 0, 0, canvas.width, canvas.height );
    	gl.clearColor( 1.0, 1.0, 1.0, 1.0 );
    
	//房顶
    	// Load shaders and initialize attribute buffers
    	var program = initShaders( gl, "vertex-shader", "fragment-shader" );
    	gl.useProgram( program );
    
    	// Load the data into the GPU
    	var bufferId = gl.createBuffer();
    	gl.bindBuffer( gl.ARRAY_BUFFER, bufferId );
    	gl.bufferData( gl.ARRAY_BUFFER, new Float32Array( vertices ), gl.STATIC_DRAW );
    
    	// Associate external shader variables with data buffer
    	var vPosition = gl.getAttribLocation( program, "vPosition" );
    	gl.vertexAttribPointer( vPosition, 2, gl.FLOAT, false, 0, 0 );
    	gl.enableVertexAttribArray( vPosition );
    
    	render();
    //房子体	
    	//2
    	var program2 = initShaders( gl, "vertex-shader", "fragment2-shader" );
    	gl.useProgram( program2 );
    	
    	// Load the data into the GPU
    	var bufferId2 = gl.createBuffer();
    	gl.bindBuffer( gl.ARRAY_BUFFER, bufferId2 );
    	gl.bufferData( gl.ARRAY_BUFFER, new Float32Array( vertices2 ), gl.STATIC_DRAW );
    	
    	// Associate external shader variables with data buffer
    	var vPosition2 = gl.getAttribLocation( program2, "vPosition" );
    	gl.vertexAttribPointer( vPosition2, 2, gl.FLOAT, false, 0, 0 );
    	gl.enableVertexAttribArray( vPosition2 );
    	
    	render2();
	//房子门
		//3
		var program3 = initShaders( gl, "vertex-shader", "fragment3-shader" );
		gl.useProgram( program3 );
		
		// Load the data into the GPU
		var bufferId3 = gl.createBuffer();
		gl.bindBuffer( gl.ARRAY_BUFFER, bufferId3 );
		gl.bufferData( gl.ARRAY_BUFFER, new Float32Array( vertices3 ), gl.STATIC_DRAW );
		
		// Associate external shader variables with data buffer
		var vPosition3 = gl.getAttribLocation( program3, "vPosition" );
		gl.vertexAttribPointer( vPosition3, 2, gl.FLOAT, false, 0, 0 );
		gl.enableVertexAttribArray( vPosition3 );
		
		render2();//同房子体一样的四边形
    
	//窗
		//4
		var program4 = initShaders( gl, "vertex-shader", "fragment4-shader" );
		gl.useProgram( program4 );
		
		// Load the data into the GPU
		var bufferId4 = gl.createBuffer();
		gl.bindBuffer( gl.ARRAY_BUFFER, bufferId4 );
		gl.bufferData( gl.ARRAY_BUFFER, new Float32Array( vertices4 ), gl.STATIC_DRAW );
		
		// Associate external shader variables with data buffer
		var vPosition4 = gl.getAttribLocation( program4, "vPosition" );
		gl.vertexAttribPointer( vPosition4, 2, gl.FLOAT, false, 0, 0 );
		gl.enableVertexAttribArray( vPosition4 );
		
		render2();//同房子体一样的四边形
	//树干
		//5
		var program5 = initShaders( gl, "vertex-shader", "fragment5-shader" );
		gl.useProgram( program5 );
		
		// Load the data into the GPU
		var bufferId5 = gl.createBuffer();
		gl.bindBuffer( gl.ARRAY_BUFFER, bufferId5 );
		gl.bufferData( gl.ARRAY_BUFFER, new Float32Array( vertices5 ), gl.STATIC_DRAW );
		
		// Associate external shader variables with data buffer
		var vPosition5 = gl.getAttribLocation( program5, "vPosition" );
		gl.vertexAttribPointer( vPosition5, 2, gl.FLOAT, false, 0, 0 );
		gl.enableVertexAttribArray( vPosition5 );
		
		render2();//同房子体一样的四边形
	//树层
		//6
		var program6 = initShaders( gl, "vertex-shader", "fragment6-shader" );
		gl.useProgram( program6 );
		
		// Load the data into the GPU
		var bufferId6 = gl.createBuffer();
		gl.bindBuffer( gl.ARRAY_BUFFER, bufferId6 );
		gl.bufferData( gl.ARRAY_BUFFER, new Float32Array( vertices6 ), gl.STATIC_DRAW );
		
		// Associate external shader variables with data buffer
		var vPosition6 = gl.getAttribLocation( program6, "vPosition" );
		gl.vertexAttribPointer( vPosition6, 2, gl.FLOAT, false, 0, 0 );
		gl.enableVertexAttribArray( vPosition6 );
		
		render3();
	
	//太阳
		//7
		var program7 = initShaders( gl, "vertex-shader", "fragment7-shader" );
		gl.useProgram( program7 );
		
		// Load the data into the GPU
		var bufferId7 = gl.createBuffer();
		gl.bindBuffer( gl.ARRAY_BUFFER, bufferId7 );
		gl.bufferData( gl.ARRAY_BUFFER, new Float32Array( vertices7 ), gl.STATIC_DRAW );
		
		// Associate external shader variables with data buffer
		var vPosition7 = gl.getAttribLocation( program7, "vPosition" );
		gl.vertexAttribPointer( vPosition7, 2, gl.FLOAT, false, 0, 0 );
		gl.enableVertexAttribArray( vPosition7 );
		
		render4();
		
		
	}
    
	
	
    function render(){
    	gl.clear( gl.COLOR_BUFFER_BIT );
    	//gl.drawArrays( gl.TRIANGLE_FAN, 0, 4 );
    	gl.drawArrays( gl.TRIANGLES, 0, 3 );
    	//gl.drawArrays( gl.TRIANGLE_FANS, 3, 6 );
    }
    function render2(){
    	//gl.clear( gl.COLOR_BUFFER_BIT );
    	//gl.drawArrays( gl.TRIANGLE_FAN, 0, 4 );
    	gl.drawArrays( gl.TRIANGLES, 0, 6 );
    	//gl.drawArrays( gl.TRIANGLE_FANS, 3, 6 );
    }
	function render3(){
		//gl.clear( gl.COLOR_BUFFER_BIT );
		//gl.drawArrays( gl.TRIANGLE_FAN, 0, 4 );
		gl.drawArrays( gl.TRIANGLES, 0, 12 );
		//gl.drawArrays( gl.TRIANGLE_FANS, 3, 6 );
	}
	function render4(){
		//gl.clear( gl.COLOR_BUFFER_BIT );
		gl.drawArrays( gl.TRIANGLE_FAN, 0, 12 );
		//gl.drawArrays( gl.LINE_LOOP, 0, 12 );
	}