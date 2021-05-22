class MinCountError extends Error {
    constructor(args) {
        super(args);
        this.name = 'MinCountError';
    }
}

module.exports = MinCountError;
