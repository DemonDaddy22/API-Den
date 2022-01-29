class GitHubError extends Error {
    constructor(args) {
        super(args);
        this.name = 'GitHubError';
    }
}

module.exports = GitHubError;
