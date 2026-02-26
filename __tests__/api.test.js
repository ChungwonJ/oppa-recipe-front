import axios from 'axios';
import { responseErrorInterceptor } from '../lib/api/interceptors';

process.env.NEXT_PUBLIC_API_URL = 'https://api.test.com';
const mockStorage = {};
global.localStorage = {
  getItem: (key) => mockStorage[key] || null,
  setItem: (key, value) => { mockStorage[key] = value; },
  removeItem: (key) => { delete mockStorage[key]; },
};

delete window.location;
window.location = { href: '' };

describe('Auth Interceptor Test', () => {
  let mockApiInstance;

  beforeEach(() => {
    jest.clearAllMocks();
    mockApiInstance = jest.fn(); 
  });

  test('401 에러 발생 시 토큰 재발급 후 원래 요청을 다시 보낸다', async () => {
    const failedRequestConfig = {
      headers: {},
      _retry: false,
    };
    const error401 = {
      response: { status: 401 },
      config: failedRequestConfig,
    };

    jest.spyOn(axios, 'post').mockResolvedValueOnce({
      data: {
        data: { accessToken: 'new-access-token' }
      }
    });

    mockApiInstance.mockResolvedValueOnce({ data: 'success-after-refresh' });

    const result = await responseErrorInterceptor(error401, mockApiInstance);

    expect(axios.post).toHaveBeenCalledWith(
      'https://api.test.com/api/auth/refresh',
      {},
      { withCredentials: true }
    );

    expect(localStorage.getItem('accessToken')).toBe('new-access-token');
    expect(mockApiInstance).toHaveBeenCalled();
    expect(result.data).toBe('success-after-refresh');
  });
});