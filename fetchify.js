class Fetchify {
  config = {
    timeout: 1000,
    headers: {
      "Content-Type": "application/json",
    },
  };

  requestInterceptors = [];
  responseInterceptors = [];

  constructor(config) {
    this.config = this.mergeConfig(config);
  }

  async request(url, config) {
    const finalConfig = this.mergeConfig(config);

    const chain = [
      ...this.requestInterceptors,
      { successFn: this.dispatchRequest.bind(this) },
      ...this.responseInterceptors,
    ];

    let promise = Promise.resolve({ url, config: finalConfig });
    for (const { successFn, failFn } of chain) {
      promise = promise.then(
        (res) => {
          try {
            return successFn(res);
          } catch (error) {
            if (failFn) {
              return failFn(error);
            }
            return Promise.reject(error);
          }
        },
        (err) => {
          if(failFn) {
            return failFn(err);
          }
          return Promise.reject(err)
        }
      );
    }
    return promise;
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
      const response = await fetch(`${this.config.baseURL}${url.url}`, {
        ...finalConfig,
        signal: abortController.signal,
      });
      return response;
    } finally {
      if (timeoutId) clearTimeout(timeoutId);
    }
  }

  async get(url, config) {
    return this.request({ url, config: { ...config, method: "GET" } })
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

  addRequestInterceptor(successFn, failFn) {
    this.requestInterceptors.push({ successFn, failFn });
  }
  addResponseInterceptor(successFn, failFn) {
    this.responseInterceptors.push({ successFn, failFn });
  }
}

function create(config) {
  return new Fetchify(config);
}

export default {
  create,
};
