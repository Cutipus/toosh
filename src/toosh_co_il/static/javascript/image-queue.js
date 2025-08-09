/*
startImmediately
queueFirst
start
*/
// image-queue.js
class ImageQueue {
  constructor() {
    this.queue = []; // FIFO queue of URLs
    this.currentController = null;
    this.currentUrl = null; // URL we're currently fetching
    this.isProcessing = false;
    this.loaded = new Set();
    this.pending = new Map(); // url -> { promise, resolve, reject }
  }

  // create-or-return the promise for a URL
  #ensurePending(url) {
    if (this.pending.has(url)) {
      return this.pending.get(url).promise;
    }
    let resolve, reject;
    const promise = new Promise((res, rej) => {
      resolve = res;
      reject = rej;
    });
    this.pending.set(url, { promise, resolve, reject });
    return promise;
  }

  add(url) {
    if (this.loaded.has(url)) return Promise.resolve();
    const promise = this.#ensurePending(url);
    if (!this.queue.includes(url)) {
      this.queue.push(url);
      // console.log(`Added to queue: ${url}`);
    }
    return promise;
  }

  addToFront(url) {
    if (this.loaded.has(url)) return Promise.resolve();
    const promise = this.#ensurePending(url);

    // If it's already being fetched, just return the promise (don't abort)
    if (this.currentUrl === url) {
      // console.log(`Already fetching: ${url}`);
      return promise;
    }

    // If already at front, nothing to do
    if (this.queue[0] === url) {
      // console.log(`Already at front: ${url}`);
      return promise;
    }

    // If it's in the queue somewhere, remove it
    const idx = this.queue.indexOf(url);
    if (idx !== -1) this.queue.splice(idx, 1);

    // Abort current only if it's a different URL
    if (this.currentController) {
      this.currentController.abort();
      this.currentController = null;
    }

    // Put requested URL at the very front
    this.queue.unshift(url);
    // console.log(`Added to front: ${url}`);

    return promise;
  }

  async processNext() {
    if (this.queue.length === 0) return;
    const url = this.queue.shift();

    // if already loaded, resolve and continue
    if (this.loaded.has(url)) {
      this.pending.get(url)?.resolve();
      this.pending.delete(url);
      return;
    }

    this.currentController = new AbortController();
    this.currentUrl = url;
    const signal = this.currentController.signal;

    try {
      // fetch and fully consume the body
      const response = await fetch(url, { signal });
      if (!response.ok) throw new Error(`Failed to load: ${response.status}`);
      await response.blob();

      // mark loaded and resolve pending
      this.loaded.add(url);
      this.pending.get(url)?.resolve();
    } catch (error) {
      if (error && error.name === "AbortError") {
        // aborted by higher-priority request -> requeue at end if still needed
        if (!this.queue.includes(url) && !this.loaded.has(url)) {
          this.queue.push(url);
        }
      } else {
        this.pending.get(url)?.reject(error);
      }
    } finally {
      this.pending.delete(url);
      this.currentController = null;
      this.currentUrl = null;
    }
  }

  async start() {
    if (this.isProcessing) return;
    this.isProcessing = true;
    while (this.queue.length > 0) {
      await this.processNext();
    }
    this.isProcessing = false;
  }

  async startOnce() {
    if (this.isProcessing) return;
    this.isProcessing = true;
    await this.processNext();
    this.isProcessing = false;
  }
}
