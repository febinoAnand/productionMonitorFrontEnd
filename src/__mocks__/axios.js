const mockAxios = {
    get: jest.fn(() => Promise.resolve({ data: {} })),
    post: jest.fn(() => Promise.resolve({ data: {} })),
    delete: jest.fn(() => Promise.resolve({})), // Mock delete if needed
    put: jest.fn(() => Promise.resolve({ data: {} })), // Mock put if needed
};

export default mockAxios;
