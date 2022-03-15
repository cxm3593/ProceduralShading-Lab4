#version 150

//
// Bump fragment shader for Lab 4.
//
// @author  RIT CS Department
// @author  Chengyi Ma
//

// INCOMING DATA

// Data from the application

// Light color
uniform vec4 lightColor;
uniform vec4 ambientLight;

// Material properties
uniform float specExp;
uniform vec3 kCoeff;

// Data from the vertex shader

// Light position
in vec3 lPos;

// Vertex position (in clip space)
in vec3 vPos;

// Vertex normal
in vec3 vNorm;

// Original vertex position (sort of)
in vec3 pos;

// ADD ANY OTHER INCOMING VARIABLES (FROM THE APPLICATION
// OR FROM THE VERTEX SHADER) HERE
vec4 tileColor = vec4(1.0, 0.3, 0.3, 1.0);
vec4 edgeColor = vec4(0.2, 0.2, 0.2, 1.0);
vec3 modified_Normal = vec3(0.0, 0.0, 1.0);
const float edge_width = 0.1;

uniform int grid_index[25] = int[25](
	1,	1,	2,	3,	3,
	4,	5,	2,	6,	6,
	4,	7,	7,	8,	9,
	10,	10,	11,	8,	12,
	10,	10,	13,	13,	12
);

// OUTGOING DATA

// The final fragment color
out vec4 fragColor;

//
// Noise functions based on code from Patricio Gonzalo Vivo
// https://gist.github.com/patriciogonzalezvivo/670c22f3966e662d2f83
//
float rand( float n ) { return fract(sin(n) * 43758.5453123); }

float noise( float p ) {
    float fl = floor(p);
    float fc = fract(p);
    return mix(rand(fl), rand(fl + 1.0), fc);
}

float rand( vec2 n ) { 
    return fract(sin(dot(n, vec2(12.9898, 4.1414))) * 43758.5453);
}

float mod289( float x ) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
vec4  mod289( vec4 x )  { return x - floor(x * (1.0 / 289.0)) * 289.0; }
vec4  perm( vec4 x )    { return mod289(((x * 34.0) + 1.0) * x); }

float noise( vec3 p ) {
    vec3 a = floor(p);
    vec3 d = p - a;
    d = d * d * (3.0 - 2.0 * d);

    vec4 b = a.xxyy + vec4(0.0, 1.0, 0.0, 1.0);
    vec4 k1 = perm(b.xyxy);
    vec4 k2 = perm(k1.xyxy + b.zzww);

    vec4 c = k2 + a.zzzz;
    vec4 k3 = perm(c);
    vec4 k4 = perm(c + 1.0);

    vec4 o1 = fract(k3 * (1.0 / 41.0));
    vec4 o2 = fract(k4 * (1.0 / 41.0));

    vec4 o3 = o2 * d.z + o1 * (1.0 - d.z);
    vec2 o4 = o3.yw * d.x + o3.xz * (1.0 - d.x);

    return o4.y * d.y + o4.x * (1.0 - d.y);
}

// simple noise3() replacement
vec3 noise3( vec3 p ) {
    return vec3(noise(p.x),noise(p.y),noise(p.z));
}

vec4 tile_color(vec2 tex_coord){
	int grid_x = int(tex_coord.x / 0.2);
	int grid_y = int(tex_coord.y / 0.2);

	int grid_key = grid_y * 5 + grid_x;
	int tile_index = grid_index[grid_key]; // indicate which tile this one is on, show connectivity

	float onGrid_x = mod(tex_coord.x, 0.2) / 0.2;
	float onGrid_y = mod(tex_coord.y, 0.2) / 0.2;


	// Check the connectivities.
	int left_neighbor_index = 0;
	if(grid_x > 0){ // if this grid has a left one
		left_neighbor_index = grid_index[grid_key - 1];
	}
	bool connect_left = (left_neighbor_index == tile_index);
	int right_neighbor_index = 0;
	if(grid_x < 5){ // if this grid has a right neighbor
		right_neighbor_index = grid_index[grid_key+1];
	}
	bool connect_right = (right_neighbor_index == tile_index);
	int top_neighbor_index = 0;
	if(grid_y > 0){
		top_neighbor_index = grid_index[grid_key - 5];
	}
	bool connect_up = (top_neighbor_index == tile_index);
	int bottom_neighbor_index = 0;
	if(grid_y < 5){
		bottom_neighbor_index = grid_index[grid_key + 5];
	}
	bool connect_down = (bottom_neighbor_index == tile_index);

	float random_color = noise(tile_index * 10); // Control color randomness
	tileColor.r = tileColor.r * random_color;




	if (onGrid_x < edge_width){ // if the fragment is on the left edge of the grid
		int left_neighbor_index = 0;
		if(grid_x > 0){ // if this grid has a left one
			left_neighbor_index = grid_index[grid_key - 1];
		}
		if (connect_left && onGrid_y > edge_width && onGrid_y < (1-edge_width)){ // when it connects and not in corner
			return tileColor;
		}
		else{
			if (onGrid_y < edge_width && connect_up && connect_left) {
				return tileColor;
			}
			else if(onGrid_y > (1-edge_width) && connect_down && connect_left){
				return tileColor;
			}
			else{
				return edgeColor;
			}
		}
	}
	else if(onGrid_x > (1-edge_width)){ // if the fragment is on the right edge of the grid
		int right_neighbor_index = 0;
		if(grid_x < 5){ // if this grid has a right neighbor
			right_neighbor_index = grid_index[grid_key+1];
		}
		if (connect_right && onGrid_y > edge_width && onGrid_y < (1-edge_width)){
			return tileColor;
		}
		else{
			if (onGrid_y < edge_width && connect_up && connect_right) {
				return tileColor;
			}
			else if(onGrid_y > (1-edge_width) && connect_down && connect_right){
				return tileColor;
			}
			else{
				return edgeColor;
			}
		}
	}
	else if(onGrid_y < edge_width){ // if the fragment is on the top edge of the grid
		int top_neighbor_index = 0;
		if(grid_y > 0){
			top_neighbor_index = grid_index[grid_key - 5];
		}
		if(connect_up && onGrid_x > edge_width && onGrid_y < (1-edge_width)){
			return tileColor;
		}
		else{
			if (onGrid_x < edge_width && connect_left && connect_up) {
				return tileColor;
			}
			else if(onGrid_x > (1-edge_width) && connect_right && connect_up){
				return tileColor;
			}
			else{
				return edgeColor;
			}
			return edgeColor;
		}
	}
	else if(onGrid_y > (1 - edge_width)){ // if the fragment is on the bottom edge of the grid
		int bottom_neighbor_index = 0;
		if(grid_y < 5){
			bottom_neighbor_index = grid_index[grid_key+5];
		}
		if(connect_down && onGrid_x > edge_width && onGrid_x < (1-edge_width)){
			return tileColor;
		}
		else{
			if (onGrid_x < edge_width && connect_left && connect_down) {
				return tileColor;
			}
			else if(onGrid_x > (1-edge_width) && connect_right && connect_down){
				return tileColor;
			}
			else{
				return edgeColor;
			}
			return edgeColor;
		}
	}
	else{
		return tileColor;
	}
	// Works but need a better solution

	
}

void main()
{
    // basic object color
    vec3 c = noise3( pos );
    //vec4 basicColor = vec4( c, 1.0 );  // noise4(pos)
	vec2 tex_coord = vec2(pos.x+0.5, pos.y+0.5); // a temporary solution
	vec4 basicColor = tile_color(tex_coord);

    // calculate lighting vectors
    vec3 L = normalize( lPos - vPos );
    vec3 N = normalize( vNorm );
	//vec3 N = vec3(noise(vPos.x * 10), noise(vPos.y * 10), noise(vPos.z * 10));
    vec3 R = normalize( reflect(-L, N) );
    vec3 V = normalize( -(vPos) );

    vec4 ambient  = vec4(0.0);  // ambient color component
    vec4 diffuse  = vec4(0.0);  // diffuse color component
    vec4 specular = vec4(0.0);  // specular color component
    float specDot;  // specular dot(R,V) ^ specExp value

    //
    // The following code implements Phong shading.  It must be
    // modified to perform texture mapping using Phong.
    //

    ambient  = ambientLight * basicColor;
    diffuse  = lightColor * basicColor * max(dot(N,L),0.0);
    specDot  = pow( max(dot(R,V),0.0), specExp );
    specular = lightColor * basicColor * specDot;

    // calculate the final color
    vec4 color = (kCoeff.x * ambient) +
                 (kCoeff.y * diffuse) +
                 (kCoeff.z * specular);

    fragColor = color;
}
