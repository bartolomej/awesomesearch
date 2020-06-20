import React, { useEffect } from "react";

function Animation ({ spacing, color, style, width, height }) {
  const containerRef = React.useRef();
  const animationRef = React.useRef();

  useEffect(() => {
    if (containerRef.current) {
      animationRef.current = new AnimationImpl({
        parent: containerRef.current,
        spacing, color
      });
    }
    return () => animationRef.current.destroy();
  }, [containerRef]);

  return (
    <div
      ref={containerRef}
      style={{ ...style, height: '100%', width: '100%' }}
    />
  )
}

class AnimationImpl {

  constructor ({ parent, spacing = 50, color = 'white', speed = 0 }) {
    this.container = parent;
    this.spacing = spacing;
    this.radius = 2;
    this.color = color;
    this.speed = speed;
    this.init();
  }

  get height () {
    return this.canvas.height;
  }

  get width () {
    return this.canvas.width;
  }

  init () {
    this.canvas = document.createElement('canvas');
    this.canvas.height = this.container.clientHeight;
    this.canvas.width = this.container.clientWidth;
    this.ctx = this.canvas.getContext('2d');
    this.container.appendChild(this.canvas);
    window.addEventListener('resize', this.onResize.bind(this));
    if (Math.abs(this.speed) > 0) {
      this.animation = requestAnimationFrame(this.render.bind(this));
    } else {
      this.render();
    }
  }

  onResize () {
    this.canvas.height = this.container.clientHeight;
    this.canvas.width = this.container.clientWidth;
    if (this.speed === 0) {
      this.render();
    }
  }

  render () {
    this.ctx.clearRect(0, 0, this.width, this.height);

    const firstXStep = (this.width % this.spacing) / 2;
    const firstYStep = (this.height % this.spacing) / 2;
    for (let y = firstYStep; y < this.height; y += this.spacing) {
      for (let x = firstXStep; x < this.width; x += this.spacing) {
        this.ctx.fillStyle = this.color;
        this.ctx.beginPath();
        this.ctx.arc(x, y, this.radius, 0, 2 * Math.PI);
        this.ctx.fill();
      }
    }

    if (Math.abs(this.speed) > 0) {
      this.time += this.speed;
      requestAnimationFrame(this.render.bind(this));
    }
  }

  destroy () {
    cancelAnimationFrame(this.animation);
    window.removeEventListener('resize', this.onResize.bind(this));
    this.container.removeChild(this.canvas);
  }

}

export default Animation;
