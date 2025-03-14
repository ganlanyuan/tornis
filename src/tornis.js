// Check if the module is initialised during server-side rendering
const isSSR = typeof window === 'undefined';

/**
 * Simple throttling helper that limits a 
 * function to only run once every {delay}ms
 * @param {Number} delay The delay in ms
 * @param {Function} fn the function to throttle
 */
function throttled(delay, fn) {
  let lastCall = 0;
  return function(...args) {
    const now = new Date().getTime();
    if (now - lastCall < delay) {
      return;
    }
    lastCall = now;
    return fn(...args);
  };
}

/**
 * Calculates the mean value in an array
 * @param {Array} arr The array to average
 */
function getMean(arr) {
  return Math.floor(arr.reduce((acc, curr) => {
    return acc + curr;
  }, 0) / arr.length);
}

/**
 * Main Tornis singleton class
 */
class Tornis {
  // set a whole load of initial values
  constructor() {

    // Exit out if this is running server-side
    if (isSSR) return;

    this.lastX = 0;
    this.lastY = 0;
    this.lastWidth = window.innerWidth;
    this.lastHeight = window.innerHeight;
    this.lastMouseX = 0;
    this.lastMouseY = 0;

    this.scrollHeight = document.body.scrollHeight;

    this.scrollChange = false;
    this.sizeChange = false;
    this.mouseChange = false;

    this.currX = 0;
    this.currY = 0;
    this.currWidth = window.innerWidth;
    this.currHeight = window.innerHeight;
    this.currMouseX = 0;
    this.currMouseY = 0;
    
    // initialise array buffers for mouse velocity
    this.mouseXVelocity = [];
    this.mouseYVelocity = [];
    this.lastMouseXVelocity = 0;
    this.lastMouseYVelocity = 0;

    // flag to limit rAF renders
    this.updating = false;

    // initialise the watched function queue
    this.callbacks = [];

    // bind this to ease class methods
    this.update = this.update.bind(this);
    this.handleResize = this.handleResize.bind(this);
    this.handleMouse = this.handleMouse.bind(this);
    this.formatData = this.formatData.bind(this);
    this.watch = this.watch.bind(this);
    this.unwatch = this.unwatch.bind(this);

    // throttled event handlers
    this.handleResize = throttled(110, this.handleResize); // resize is brutal, so throttle it more
    this.handleMouse = throttled(75, this.handleMouse);

    // bind event handlers to the window
    window.addEventListener('resize', this.handleResize);
    window.addEventListener('mousemove', this.handleMouse);

    // begin the update loop
    requestAnimationFrame(this.update);
  }

  /**
   * Event handler to capture screen size
   */
  handleResize(e) {
    this.currWidth = window.innerWidth;
    this.currHeight = window.innerHeight;
  }

  /**
   * Event handler to capture mouse position
   */
  handleMouse(e) {
    this.currMouseX = e.clientX;
    this.currMouseY = e.clientY;
  }

  /**
   * Returns a copy of the store data, formatted for public use
   */
  formatData() {
    return {
      scroll: {
        changed: this.scrollChange,
        left: Math.floor(this.lastX),
        right: Math.floor(this.lastX + this.lastWidth),
        top: Math.floor(this.lastY),
        bottom: Math.floor(this.lastY + this.lastHeight),
        velocity: {
          x: Math.floor(this.scrollXVelocity) || 0,
          y: Math.floor(this.scrollYVelocity) || 0
        }
      },
      size: {
        changed: this.sizeChange,
        x: Math.floor(this.lastWidth),
        y: Math.floor(this.lastHeight),
        docY: Math.floor(this.scrollHeight)
      },
      mouse: {
        changed: this.mouseChange,
        x: Math.floor(this.lastMouseX),
        y: Math.floor(this.lastMouseY),
        velocity: {
          x: Math.floor(this.lastMouseXVelocity) || 0,
          y: Math.floor(this.lastMouseYVelocity) || 0
        }
      }
    };
  }

  /**
   * Update function to be looped by requestAnimationFrame
   */
  update() {
    const {
      currWidth,
      currHeight,
      currMouseX,
      currMouseY
    } = this;
    if (this.updating) return false;

    // reset the flags
    this.scrollChange = this.sizeChange = this.mouseChange = false;
    
    // reset scroll X velocity
    if (window.pageXOffset == this.lastX && this.scrollXVelocity != 0) {
      this.scrollXVelocity = 0;
      this.scrollChange = true;
    }

    // reset scroll Y velocity
    if (window.pageYOffset == this.lastY && this.scrollYVelocity != 0) {
      this.scrollYVelocity = 0;
      this.scrollChange = true;
    }
    
    // check scroll X
    if (window.pageXOffset != this.lastX) {
      this.scrollChange = true;
      this.scrollXVelocity = Math.floor(window.pageXOffset - this.lastX);
      this.lastX = window.pageXOffset;
    }
    
    // check scroll Y
    if (window.pageYOffset != this.lastY) {
      this.scrollChange = true;
      this.scrollYVelocity = Math.floor(window.pageYOffset - this.lastY);
      this.lastY = window.pageYOffset;
    }

    // check width
    if (currWidth != this.lastWidth) {
      this.lastWidth = currWidth;
      this.scrollHeight = document.body.scrollHeight;
      this.sizeChange = true;
    }

    // check height
    if (currHeight != this.lastHeight) {
      this.lastHeight = currHeight;
      this.sizeChange = true;
    }

    // Mouse input is throttled so in order to capture the velocity
    // we need to grab a buffer of the last five values and average them
    if (this.mouseXVelocity.length > 5) { this.mouseXVelocity.shift(); }
    this.mouseXVelocity.push(currMouseX - this.lastMouseX);

    // see if the average velocity changed
    if (getMean(this.mouseXVelocity) != this.lastMouseXVelocity) {
      this.lastMouseXVelocity = getMean(this.mouseXVelocity);
      this.mouseChange = true;
    }
  
    // check mouse X
    if (currMouseX != this.lastMouseX) {
      this.lastMouseX = currMouseX;
      this.mouseChange = true;
    }

    // grab the mouse Y velocity
    if (this.mouseYVelocity.length > 5) { this.mouseYVelocity.shift(); }
    this.mouseYVelocity.push(currMouseY - this.lastMouseY);

    // see if the average velocity changed
    if (getMean(this.mouseYVelocity) != this.lastMouseYVelocity) {
      this.lastMouseYVelocity = getMean(this.mouseYVelocity);
      this.mouseChange = true;
    }
  
    // check mouse y
    if (currMouseY != this.lastMouseY || getMean(this.mouseYVelocity) != 0) {
      this.lastMouseY = currMouseY;
      this.mouseChange = true;
    }

    // Finally, we can invoke the callbacks, but if something has changed
    if (
      this.scrollChange ||
      this.sizeChange ||
      this.mouseChange 
    ) {
      // pass the formatted data into each watched function
      this.callbacks.forEach(cb => cb(this.formatData()));
    }

    // reset and loop this method
    this.updating = false;
    requestAnimationFrame(this.update);
  }

  /**
   * Subscribes a function to the 'watched functions' list.
   * Watched functions will be automatically called on update
   * @param {Function} callback The function to call on update
   * @param {Boolean} callOnWatch Call the function on subscribe? defaults to true
   */
  watch(callback, callOnWatch = true) {
    if (typeof callback !== 'function') {
      throw new Error('Value passed to Watch is not a function');
    }

    // Exit out if this is running server-side
    if (isSSR) return;

    if (callOnWatch) {
      // get a copy of the store
      const firstRunData = this.formatData();

      // Most watch functions will have guard clauses that check for change
      // To cicumvent this, we simulate that all values have changed on first run
      firstRunData.scroll.changed = true;
      firstRunData.mouse.changed = true;
      firstRunData.size.changed = true;
  
      // run the callback using the simulated data
      callback(firstRunData);
    }

    // push the callback to the queue to ensure it runs on future updates
    this.callbacks.push(callback);
  }

  /**
   * Unsubscribe a function from the 'watched functions' list
   * @param {Function} callback The function to be removed
   */
  unwatch(callback) {
    if (typeof callback !== 'function') {
      throw new Error('The value passed to unwatch is not a function');
    }

    // Exit out if this is running server-side
    if (isSSR) return;

    // remove the callback from the list
    this.callbacks = this.callbacks.filter(cb => cb !== callback);
  }

}


// Create a singleton instance of Tornis
const TORNIS = new Tornis();

if (!isSSR) {
  // Expose a limited set of functions to a global, in order to allow access for basic script usage with <script>
  window.__TORNIS = {
    watchViewport: TORNIS.watch,
    unwatchViewport: TORNIS.unwatch,
    getViewportState: TORNIS.formatData
  };
}

// Export the Tornis API functions for ES6
export const watchViewport = TORNIS.watch;
export const unwatchViewport = TORNIS.unwatch;
export const getViewportState = TORNIS.formatData;