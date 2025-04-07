export const setupMemoryMonitor = () => {
  // Check if we're in development mode using Vite's env
  if (import.meta.env.DEV) {
    // Rest of the memory monitor code...
    const memoryMonitorInterval = setInterval(() => {
      if (window.performance && window.performance.memory) {
        const memoryInfo = window.performance.memory;
        const mbUsed = Math.round(memoryInfo.usedJSHeapSize / (1024 * 1024));

        console.log(
          `Memory usage: ${mbUsed}MB / ${Math.round(
            memoryInfo.jsHeapSizeLimit / (1024 * 1024)
          )}MB`
        );

        if (mbUsed > 500) {
          console.warn("High memory usage detected!");
        }
      }
    }, 30000);

    // Clean up
    window.addEventListener("beforeunload", () => {
      clearInterval(memoryMonitorInterval);
    });
  }
};
