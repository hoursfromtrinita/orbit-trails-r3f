# React Three Fiber Project: Orbit Trails

This project showcases a dynamic 3D animation of multiple rotating icosahedron point clouds using **React Three Fiber** and **Three.js**. Creating a mesmerizing visual effect with bloom post-processing.

![Project Preview](./public/screenshot.jpg)

Watch the tutorial on [YouTube](https://youtu.be/M4DlpXWv_eo)

## Features

- **React Three Fiber**: Utilizes React's declarative style to build 3D scenes with Three.js.
- **Rotating Icosahedron Point Clouds**: Renders multiple icosahedrons composed of points that rotate over time.
- **Dynamic Coloring**: Each point's color is calculated based on its position and index, creating a gradient effect.
- **Post-Processing Effects**: Implements bloom effects using `@react-three/postprocessing` for enhanced visuals.


## Installation

1. **Clone the repository**

   ```bash
   git clone https://github.com/bobbyroe/orbit-trails-r3f.git
   cd orbit-trails-r3f
   ```

2. **Install dependencies**

   ```bash
    yarn
    yarn dev

   ```

## Usage

This project can serve as a starting point for creating complex 3D animations and visualizations using React Three Fiber. You can modify the `IcoSpherePoints` and `PointsGroup` components to experiment with different geometries, materials, and animations.

## License

This project is open-source and available under the [MIT License](LICENSE).