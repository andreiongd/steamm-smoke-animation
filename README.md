# Three.js Smoke Particle System

This project demonstrates a smoke particle system using Three.js. It creates animated smoke particles rendered as textured points with custom shaders, along with a sample scene that includes a 3D rocket model and a skybox. The particles are controlled by various splines to interpolate attributes like size, color, and transparency over their lifetime.

## Table of Contents

- [Features](#features)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Usage](#usage)
- [Code Overview](#code-overview)
- [Customizing the Particle Animation](#customizing-the-particle-animation)
- [License](#license)

## Features

- **Custom Shaders:** Uses GLSL vertex and fragment shaders for dynamic particle effects.
- **Spline-Based Animation:** Controls particle alpha, size, and color over their lifetime using linear splines.
- **3D Scene Integration:** Includes a skybox, lighting, and a 3D rocket model loaded via GLTF.
- **Interactive Controls:** Press the SPACE key to emit new smoke particles.
- **Real-Time Rendering:** Rendered using Three.js.

## Prerequisites

- A modern web browser with WebGL support.
- [Three.js](https://threejs.org/) (this example uses version `0.118`).
- A local or remote web server (for loading models and textures).

## Installation

1. **Clone or Download the Repository:**

   ```bash
   git clone https://github.com/andreiongd/steamm-smoke-animation.git
   cd threejs-smoke-particles
   ```

2. **Directory Structure:**

   Ensure your project directory includes:
   - `index.html` – the main HTML file that includes the JavaScript.
   - `main.js` – the code file containing the particle system.
   - `resources/` – a folder with necessary assets:
     - `Smoke-ElementWhite02.png` – the particle texture.
     - `rocket/` – folder containing the GLTF model (`Rocket_Ship_01.gltf` and its associated files).
     - `posx.jpg`, `negx.jpg`, `posy.jpg`, `negy.jpg`, `posz.jpg`, `negz.jpg` – skybox images.

3. **Run the Project:**

   Use any web server to serve your files. For example, using Python’s built-in server:

   ```bash
   python3 -m http.server
   ```

   Then open your browser and navigate to `http://localhost:8000`.

## Usage

- **Start the Scene:** Open the project in your browser. The scene will render with a skybox background and a rocket model.
- **Emit Particles:** Press the SPACE key to emit smoke particles. The particles animate over their lifetime, changing in size, color, and transparency.

## Code Overview

### Shader Code

#### Vertex Shader (`_VS`)
- Calculates the point size based on the particle’s size attribute.
- Adjusts the orientation using a rotation attribute.

#### Fragment Shader (`_FS`)
- Samples from a texture (`Smoke-ElementWhite02.png`).
- Applies the particle’s color and transparency.

### Particle System

#### Particle Attributes
- Each particle has properties such as **position**, **velocity**, **size**, **color**, **alpha** (transparency), **life**, and **rotation**.

#### Splines
- **Alpha Spline:** Controls particle transparency over its lifetime.
- **Colour Spline:** Interpolates between two colors.
- **Size Spline:** Changes the particle’s size over its lifetime.

#### Updating Particles
- Particles update each frame for movement, drag, and fading based on boundaries.
- Sorting by distance to the camera ensures correct rendering.

### Scene Setup

#### Renderer and Camera
- A WebGL renderer with shadow mapping enabled, and a perspective camera are set up.

#### Lighting
- Directional and ambient lights illuminate the scene.

#### Skybox
- A cube texture loader creates a skybox background.

#### Model Loading
- A GLTF loader adds a rocket model to the scene.

## Customizing the Particle Animation

This project uses several variables and spline settings to control the animation and appearance of the smoke particles. Here are the key parts you can modify:

### Particle Emission Rate and Lifespan

#### Emission Rate
In the `_AddParticles` method, the number of particles emitted per frame is controlled by:

```javascript
const n = Math.floor(this.gdfsghk * 100.0);
```

Adjust the multiplier (`100.0`) to increase or decrease the rate at which particles spawn.

#### Lifespan
Each particle’s lifespan is set by:

```javascript
const life = (Math.random() * 1.0 + 0.25) * 5.0;
```

Modify these numbers to change the range and scale of the particle lifetimes. For example, increasing the multiplier (`5.0`) makes particles live longer.

### Particle Movement

#### Initial Velocity
When a particle is created, its initial velocity is defined by:

```javascript
velocity: new THREE.Vector3(
  Math.random() * -18.0 + 4.0, // Horizontal movement
  Math.random() * 5.0 - 0.5,    // Vertical movement
  Math.random() * 5.0 - 0.5     // Depth movement
),
```

Adjust these values to control the direction and speed of the particles. For example, modifying the horizontal component (`-18.0 + 4.0`) will change the horizontal motion.

#### Drag
Particles slow down over time with drag applied in the `_UpdateParticles` method:

```javascript
const drag = p.velocity.clone();
drag.multiplyScalar(timeElapsed * 0.1);
```

Changing the multiplier (`0.1`) alters how quickly the particles slow down—a larger value increases the drag effect.

### Particle Appearance Over Time

The particle’s **alpha** (transparency), **size**, and **color** are interpolated over their lifetime using splines. To customize these effects, modify the spline control points in the `ParticleSystem` constructor.

#### Alpha Spline
Controls the transparency of particles.

```javascript
this._alphaSpline.AddPoint(0.0, 0.0);
this._alphaSpline.AddPoint(0.1, 0.8);
this._alphaSpline.AddPoint(0.6, 0.8);
this._alphaSpline.AddPoint(1.0, 0.0);
```

Change these values to affect when and how particles fade in and out.

#### Size Spline
Adjusts the size of particles over time.

```javascript
this._sizeSpline.AddPoint(0.0, 1.0);
this._sizeSpline.AddPoint(0.5, 5.0);
this._sizeSpline.AddPoint(1.0, 1.0);
```

Modify these numbers to change how large the particles get at their peak.

#### Color Spline
Interpolates the particle color.

```javascript
this._colourSpline.AddPoint(0.0, new THREE.Color(0xedefff));
this._colourSpline.AddPoint(1.0, new THREE.Color(0x3745ad));
```

Setting different colors at the beginning and end of the particle’s life will create various visual effects.

## License

This project is licensed under the **MIT License**.

