class Fetchify{
    config = {
        headers: {
            'Content-Type': 'application/json',
        }
    }
    constructor(config) {
        this.config = this.mergeConfig(config);
    }

    async get(url, config) {
        const finalConfig = this.mergeConfig(config)
        return fetch(`${this.config.baseURL}${url}`, finalConfig);     
    }

    mergeConfig(config) {
       return {
        ...this.config, //
        ...config,
        headers: {
            ...(this.config.headers || {}),
            ...(config?.headers || {}),
        }
       }
    }
}

function create(config) {
    return new Fetchify(config)
}

export default {
    create,
}