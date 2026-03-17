class TimeTracker {
    constructor() {
        this.startTime = 0;
        this.endTime = 0;
        this.running = false;
    }

    start() {
        this.startTime = performance.now();
        this.running = true;
    }

    stop() {
        this.reset();
        this.endTime = performance.now();
        this.running = false;
        return this.duration;
    }

    reset() {
        this.startTime = performance.now();
        this.running = true;
    }

    get duration() {
        return this.running
            ? performance.now() - this.startTime
            : this.endTime - this.startTime;
    }
}

export default new TimeTracker();