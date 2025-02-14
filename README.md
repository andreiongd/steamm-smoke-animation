# Three.js Smoke Particle System

This project demonstrates a smoke particle system using Three.js. It creates animated smoke particles rendered as textured points with custom shaders, along with a sample scene that includes a 3D rocket model and a skybox. The particles are controlled by various splines to interpolate attributes like size, color, and transparency over their lifetime.

## Table of Contents

- [Features](#features)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Usage](#usage)
- [Code Overview](#code-overview)
- [Customizing the Particle Animation](#customizing-the-particle-animation)
- [Embedding into a Website](#embedding-into-a-website)
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
   git clone https://github.com/yourusername/threejs-smoke-particles.git
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

## Embedding into a Website

To integrate this particle system into an existing website, follow these steps:

1. **Include Three.js and the Particle System in Your Project**
   Add the following script references in your HTML file:

   ```html
   <script type="module" src="https://cdn.jsdelivr.net/npm/three@0.118/build/three.module.js"></script>
   <script type="module" src="main.js"></script>
   ```

2. **Create a Container for the Particle System**
   Inside your `index.html`, add a container for the Three.js canvas:

   ```html
   <body>
       <div id="threejs-container"></div>
   </body>
   ```

3. **Modify `main.js` to Attach Three.js to Your Website**
   Ensure your Three.js scene is rendered inside the specified container:

   ```javascript
   const container = document.getElementById("threejs-container");
   const renderer = new THREE.WebGLRenderer({ antialias: true });
   renderer.setSize(window.innerWidth, window.innerHeight);
   container.appendChild(renderer.domElement);
   ```

4. **Customize Styles to Ensure Fullscreen Display**
   Add the following CSS to your `style.css` file or inside a `<style>` tag:

   ```css
   #threejs-container {
       position: absolute;
       top: 0;
       left: 0;
       width: 100%;
       height: 100%;
       overflow: hidden;
   }
   ```

Now, when you load your webpage, the Three.js smoke particle system will appear inside the `#threejs-container` div and be fully integrated into your website.

## License

This project is licensed under the **MIT License**.

