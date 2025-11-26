class Fetchify {
  config = {
    timeout: 1000,
    headers: {
      "Content-Type": "application/json",
    },
  };
  constructor(config) {
    this.config = this.mergeConfig(config);
  }

  async dispatchRequest({ url, config }) {
    const finalConfig = this.mergeConfig(config);

    const abortController = new AbortController();
    const timeout = finalConfig.timeout || 0;

    let timeoutId;
    if (timeout) {
      timeoutId = setTimeout(() => abortController.abort(), timeout);
    }

    try {
      const response = await fetch(`${this.config.baseURL}${url}`, {
        ...finalConfig,
        signal: abortController.signal,
      });
      return response;
    } finally {
      if (timeoutId) clearTimeout(timeoutId);
    }
  }

  async get(url, config) {
    return this.dispatchRequest({ url, config: { ...config, method: "GET" } });
  }

  async post(url, data, config) {
    return this.dispatchRequest({ url, config: { ...config, method: "POST" } });
  }

  mergeConfig(config) {
    return {
      ...this.config, //
      ...config,
      headers: {
        ...(this.config.headers || {}),
        ...(config?.headers || {}),
      },
    };
  }
}

function create(config) {
  return new Fetchify(config);
}

export default {
  create,
};
