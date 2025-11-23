class Fetchify{
    config = {
        headers: {
            'Content-Type': 'application/json',
        }
    }
    constructor(config) {
        this.config = config;
    }

    async get(url) {
        return "working"
    }
}

function create(config) {
    return new Fetchify(config)
}

export default {
    create,
}