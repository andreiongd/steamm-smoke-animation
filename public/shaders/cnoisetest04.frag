precision highp float;

#define PI 3.14159265359

uniform vec2 u_resolution;
uniform vec2 u_mouse;
uniform float u_time;
uniform sampler2D u_tex0;

float random (in vec2 st) {
   	highp float a = 12.9898;
    highp float b = 78.233;
    highp float c = 43758.5453;
    highp float dt= dot(st.xy ,vec2(a,b));
    highp float sn= mod(dt,3.14);
    return fract(sin(sn) * c);
}

vec3 permute(vec3 x) { return mod(((x*34.0)+1.0)*x, 289.0); }

float snoise(vec2 v){
  const vec4 C = vec4(0.211324865405187, 0.366025403784439,
           -0.577350269189626, 0.024390243902439);
  vec2 i  = floor(v + dot(v, C.yy) );
  vec2 x0 = v -   i + dot(i, C.xx);
  vec2 i1;
  i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
  vec4 x12 = x0.xyxy + C.xxzz;
  x12.xy -= i1;
  i = mod(i, 289.0);
  vec3 p = permute( permute( i.y + vec3(0.0, i1.y, 1.0 ))
  + i.x + vec3(0.0, i1.x, 1.0 ));
  vec3 m = max(0.5 - vec3(dot(x0,x0), dot(x12.xy,x12.xy),
    dot(x12.zw,x12.zw)), 0.0);
  m = m*m ;
  m = m*m ;
  vec3 x = 2.0 * fract(p * C.www) - 1.0;
  vec3 h = abs(x) - 0.5;
  vec3 ox = floor(x + 0.5);
  vec3 a0 = x - ox;
  m *= 1.79284291400159 - 0.85373472095314 * ( a0*a0 + h*h );
  vec3 g;
  g.x  = a0.x  * x0.x  + h.x  * x0.y;
  g.yz = a0.yz * x12.xz + h.yz * x12.yw;
  return 130.0 * dot(m, g);
}

const mat2 myt = mat2(.12121212, .13131313, -.13131313, .12121212);
const vec2 mys = vec2(1e4, 1e6);

vec2 rhash(vec2 uv) {
  uv *= myt;
  uv *= mys;
  return fract(fract(uv / mys) * uv);
}

vec3 hash(vec3 p) {
  return fract(sin(vec3(dot(p, vec3(1.0, 57.0, 113.0)),
                        dot(p, vec3(57.0, 113.0, 1.0)),
                        dot(p, vec3(113.0, 1.0, 57.0)))) *
               43758.5453);
}

float voronoi2d(const in vec2 point) {
  vec2 p = floor(point);
  vec2 f = fract(point);
  float res = 0.0;
  for (int j = -1; j <= 1; j++) {
    for (int i = -1; i <= 1; i++) {
      vec2 b = vec2(i, j);
      vec2 r = vec2(b) - f + rhash(p + b);
      res += 1. / pow(dot(r, r), 8.);
    }
  }
  return pow(1. / res, 0.0625);
}

#pragma glslify: export(voronoi2d)

#define NUM_OCTAVES 5

float rand(vec2 n) { 
	return fract(sin(dot(n, vec2(12.9898, 4.1414))) * 43758.5453);
}

float noise(vec2 p){
	vec2 ip = floor(p);
	vec2 u = fract(p);
	u = u*u*(3.0-2.0*u);
	
	float res = mix(
		mix(rand(ip),rand(ip+vec2(1.0,0.0)),u.x),
		mix(rand(ip+vec2(0.0,1.0)),rand(ip+vec2(1.0,1.0)),u.x),u.y);
	return res*res;
}

float fbm(vec2 x) {
	float v = 0.0;
	float a = 0.5;
	vec2 shift = vec2(100);
	// Rotate to reduce axial bias
    mat2 rot = mat2(cos(0.5), sin(0.5), -sin(0.5), cos(0.50));
	for (int i = 0; i < NUM_OCTAVES; ++i) {
		v += a * noise(x);
		x = rot * x * 2.0 + shift;
		a *= 0.5;
	}
	return v;
}

#pragma glslify: export(fbm)


float grid(vec2 uv){
    vec2 guv = fract(uv * 10.0);
    float line = guv.x > 0.4 && guv.x < 0.6  || guv.y > 0.45 && guv.y < 0.55 ? 1.0 : 0.0;
    return line;
}

float remap(float i, float cMin, float cMax, float nMin, float nMax, bool clamp){
    float ni = nMin + (cMax - i) * (nMax - nMin) / (cMax - cMin);
    ni = clamp == true ? max(min(nMax, ni), nMin) : ni;
    return ni;
}

vec2 bend(vec2 uv){

    float ny = remap(uv.y, 1.0, 1.0, 1.0, 1.0, true);
    // float ny = remap(uv.y, .0, 1.0, -0.3  - .3*cos(u_time), 1.0, false);

    ny = clamp(ny, 0.0, 1.0);
    float nx = pow((gl_FragCoord.x*2.0 - u_resolution.x)/u_resolution.x, 2.0);
    float bendRatio = pow(ny, 1.0) ;
    bendRatio *=  (1.0-nx);

    float vx = .0*(0.1+ fbm(sin(uv.xx*52.0+uv.xy*50.0 - u_time)))*bendRatio*0.01; 
    float vy = .0*(0.1+ fbm(cos(uv.yy*50.0+uv.yx*58.0 - u_time)))*bendRatio*0.01;
    
    float vorX = 5.0*(0.1+ voronoi2d(sin(uv.xx*20.0+uv.xy*24.0 - u_time)))*bendRatio*0.01; 
    float vorY = 4.0*(0.1+ voronoi2d(cos(uv.yy*23.0+uv.yx*28.0 - u_time)))*bendRatio*0.01;

    float dx = clamp(vx,-8.0,8.0);
    float dy = clamp(vy,-8.0,8.0);

    float bendX = 10.0*(sin(uv.x*5.0+uv.y*0.0-u_time))*.01*bendRatio;
    float bendY = 10.0*(cos(uv.y*5.0+uv.x*0.0+u_time))*.01*bendRatio;
    vec2 bendUv =vec2((uv.x), (uv.y));
    return bendUv;
}

vec3 palette(float t) {

vec3 a = vec3(0.5,0.5,0.5);
vec3 b = vec3(0.5,0.5,0.5);
vec3 c = vec3(1.0,1.0,1.0);
vec3 d = vec3(0.26,0.41,0.57);

return a + b*cos(3.2*(c*t+d));
}

	vec4 permute(vec4 x){return mod(((x*34.0)+1.0)*x, 289.0);}
	vec4 taylorInvSqrt(vec4 r){return 1.79284291400159 - 0.85373472095314 * r;}
	vec3 fade(vec3 t) {return t*t*t*(t*(t*6.0-15.0)+10.0);}

	float cnoise(vec3 P){
		vec3 Pi0 = floor(P); // Integer part for indexing
		vec3 Pi1 = Pi0 + vec3(1.0); // Integer part + 1
		Pi0 = mod(Pi0, 289.0);
		Pi1 = mod(Pi1, 289.0);
		vec3 Pf0 = fract(P); // Fractional part for interpolation
		vec3 Pf1 = Pf0 - vec3(1.0); // Fractional part - 1.0
		vec4 ix = vec4(Pi0.x, Pi1.x, Pi0.x, Pi1.x);
		vec4 iy = vec4(Pi0.yy, Pi1.yy);
		vec4 iz0 = Pi0.zzzz;
		vec4 iz1 = Pi1.zzzz;

		vec4 ixy = permute(permute(ix) + iy);
		vec4 ixy0 = permute(ixy + iz0);
		vec4 ixy1 = permute(ixy + iz1);

		vec4 gx0 = ixy0 / 7.0;
		vec4 gy0 = fract(floor(gx0) / 7.0) - 0.5;
		gx0 = fract(gx0);
		vec4 gz0 = vec4(0.5) - abs(gx0) - abs(gy0);
		vec4 sz0 = step(gz0, vec4(0.0));
		gx0 -= sz0 * (step(0.0, gx0) - 0.5);
		gy0 -= sz0 * (step(0.0, gy0) - 0.5);

		vec4 gx1 = ixy1 / 7.0;
		vec4 gy1 = fract(floor(gx1) / 7.0) - 0.5;
		gx1 = fract(gx1);
		vec4 gz1 = vec4(0.5) - abs(gx1) - abs(gy1);
		vec4 sz1 = step(gz1, vec4(0.0));
		gx1 -= sz1 * (step(0.0, gx1) - 0.5);
		gy1 -= sz1 * (step(0.0, gy1) - 0.5);

		vec3 g000 = vec3(gx0.x,gy0.x,gz0.x);
		vec3 g100 = vec3(gx0.y,gy0.y,gz0.y);
		vec3 g010 = vec3(gx0.z,gy0.z,gz0.z);
		vec3 g110 = vec3(gx0.w,gy0.w,gz0.w);
		vec3 g001 = vec3(gx1.x,gy1.x,gz1.x);
		vec3 g101 = vec3(gx1.y,gy1.y,gz1.y);
		vec3 g011 = vec3(gx1.z,gy1.z,gz1.z);
		vec3 g111 = vec3(gx1.w,gy1.w,gz1.w);

		vec4 norm0 = taylorInvSqrt(vec4(dot(g000, g000), dot(g010, g010), dot(g100, g100), dot(g110, g110)));
		g000 *= norm0.x;
		g010 *= norm0.y;
		g100 *= norm0.z;
		g110 *= norm0.w;
		vec4 norm1 = taylorInvSqrt(vec4(dot(g001, g001), dot(g011, g011), dot(g101, g101), dot(g111, g111)));
		g001 *= norm1.x;
		g011 *= norm1.y;
		g101 *= norm1.z;
		g111 *= norm1.w;

		float n000 = dot(g000, Pf0);
		float n100 = dot(g100, vec3(Pf1.x, Pf0.yz));
		float n010 = dot(g010, vec3(Pf0.x, Pf1.y, Pf0.z));
		float n110 = dot(g110, vec3(Pf1.xy, Pf0.z));
		float n001 = dot(g001, vec3(Pf0.xy, Pf1.z));
		float n101 = dot(g101, vec3(Pf1.x, Pf0.y, Pf1.z));
		float n011 = dot(g011, vec3(Pf0.x, Pf1.yz));
		float n111 = dot(g111, Pf1);

		vec3 fade_xyz = fade(Pf0);
		vec4 n_z = mix(vec4(n000, n100, n010, n110), vec4(n001, n101, n011, n111), fade_xyz.z);
		vec2 n_yz = mix(n_z.xy, n_z.zw, fade_xyz.y);
		float n_xyz = mix(n_yz.x, n_yz.y, fade_xyz.x); 
		return 2.2 * n_xyz;
	}

	vec2 random2( vec2 p ) {
			return fract(sin(vec2(dot(p,vec2(127.1,311.7)),dot(p,vec2(269.5,183.3))))*43758.5453);
	}


void main() {

    vec2 st = gl_FragCoord.xy/u_resolution.xy;
   
    float pct = 0.0;
    vec3 finalColor = vec3(0.0);
    vec2 st0 = st;

    vec2 tC = vec2(1.0)+st;
    pct = sqrt(tC.x*tC.x+tC.y*tC.y);

	st.y = 1.0 - st.y;
    
    //noise
    float n = snoise(st);
    n *= max(st.y -0.3, 0.0);
	n = 1.0 - n;
	n = smoothstep(0.1, 1.0, n);
    
    st = bend(st);
		// vec3 col = vec3(texture2D(u_tex0, pos+vec2(pos.x / u_resolution.x * .0 ,0.0)).xz , texture2D(u_tex0, pos-vec2(-pos.y / u_resolution.y * 12.0 ,0.0)).yz);
   vec3 col = vec3(texture2D(u_tex0, st).x , texture2D(u_tex0, st+vec2(st.y / u_resolution.y * 0.0 ,0.0)).yz);
		//col *= n;

    // gl_FragColor = vec4(vec3(col), 1.0);
	

        // st.x+=cnoise(vec3(st*3.0,0))/8.;
		// st.y+=cnoise(vec3(st*3.0,0))/8.;

		// vec2 ct = vec2(1.0)-st;
		// vec2 dv = st-ct;
		// float d = length(dv);
		
		// float ang = sin(dv.y);
		
		// // st+=random2(st)/30.;
		// st.x+=cnoise(vec3(st*60.+ang*60.,0))/30.;
		// st.y+=cnoise(vec3(st*60.+ang*60.,0))/30.;
		
		st.x+=cnoise(vec3(st*300.,0))/80.;
		st.y+=cnoise(vec3(st*300.,0))/80.;
		
		// // d+=log(d/0.46)/32.+sin(0)/10.;
		
		// // d+=random2(st)[0]*0.01;
		// float mask = d<0.86?1.:0.;
		
		// // d+=log(d/0.46)/64.0;
		
		st.x+=cnoise(vec3(st*300,0))/50.;
		st.y+=cnoise(vec3(st*300,0))/50.;
		
		// st.x+=cnoise(vec3(st*5.+ang*10.0,0))/3.;
		// st.y+=cnoise(vec3(st*5.0,0))/3.;
		// st.x+= sin(st.x+20.+0)/5.;
		// st.y+= sin(st.y+20.+0)/5.;
		
		// col.r *= sin(st.x/2.0+10.0*st.y)+ 1.0*(0.1+ fbm(sin(st*8.5- u_time )));
		// col.g *= sin(st.x/2.0*3.0+2.*st.y)/1.5 + 1.0*(0.1+ fbm(sin(st*7.5- u_time)));
		// col.b *= sin(st.x/2.+3.0*st.y)+ 1.0*(0.1+ fbm(sin(st*9.5- u_time )));
		

         for(float i = 0.0; i < 2.0; i++) {
            
            
        float ang = atan(st.y/2,st.x/2);

        st = fract(st*4.0)-0.5;



        float d = length(ang);

         col *= palette(length(st.y+ang)+i*.1*ang+cos(u_time*.5));

        d = sin(d*12. + (u_time*1.0))/50.;
        d = abs(d);
 
        d = pow(0.01 / d, 1.2);

        // col.r *= cos(d*0.5);
		// col.g *= cos(d*0.2);
		// col.b *= sin(d*0.8);

        finalColor += col*d;


    }

    gl_FragColor = vec4(vec3(finalColor), 1.0);
}