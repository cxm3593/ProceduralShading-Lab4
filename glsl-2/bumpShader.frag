#version 150

//
// Bump fragment shader for Lab 4.
//
// @author  RIT CS Department
// @author  YOUR_NAME_HERE
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

void main()
{
    // basic object color
    vec3 c = noise3( pos );
    vec4 basicColor = vec4( c, 1.0 );  // noise4(pos)

    // calculate lighting vectors
    vec3 L = normalize( lPos - vPos );
    vec3 N = normalize( vNorm );
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
