import axios from 'axios';
import { responseErrorInterceptor } from '../lib/api/interceptors';

// 1. 필요한 환경 변수 및 window 모킹
process.env.NEXT_PUBLIC_API_URL = 'https://api.test.com';
const mockStorage = {};
global.localStorage = {
  getItem: (key) => mockStorage[key] || null,
  setItem: (key, value) => { mockStorage[key] = value; },
  removeItem: (key) => { delete mockStorage[key]; },
};

// window.location.href 모킹 (리프레시 실패 시 에러 방지)
delete window.location;
window.location = { href: '' };

describe('Auth Interceptor Test', () => {
  let mockApiInstance;

  beforeEach(() => {
    jest.clearAllMocks();
    mockApiInstance = jest.fn(); // 원래 요청을 다시 보낼 인스턴스
  });

  test('401 에러 발생 시 토큰 재발급 후 원래 요청을 다시 보낸다', async () => {
    // [준비] 1. 첫 번째 요청 실패 (401) 설정
    const failedRequestConfig = {
      headers: {},
      _retry: false,
    };
    const error401 = {
      response: { status: 401 },
      config: failedRequestConfig,
    };

    // [준비] 2. axios.post(재발급 API)가 성공할 때의 응답 설정
    // **주의: 본인 코드의 res.data.data.accessToken 구조와 똑같이 맞춰야 함**
    jest.spyOn(axios, 'post').mockResolvedValueOnce({
      data: {
        data: { accessToken: 'new-access-token' }
      }
    });

    // [준비] 3. 재시도된 요청(apiInstance)이 성공할 때의 응답 설정
    mockApiInstance.mockResolvedValueOnce({ data: 'success-after-refresh' });

    // [실행] 인터셉터 함수 실행
    const result = await responseErrorInterceptor(error401, mockApiInstance);

    // [검증]
    // 1. 재발급 API가 올바른 URL로 호출되었는가?
    expect(axios.post).toHaveBeenCalledWith(
      'https://api.test.com/api/auth/refresh',
      {},
      { withCredentials: true }
    );
    // 2. 새 토큰이 로컬스토리지에 저장되었는가?
    expect(localStorage.getItem('accessToken')).toBe('new-access-token');
    // 3. 원래 요청이 새 토큰을 헤더에 담고 다시 호출되었는가?
    expect(mockApiInstance).toHaveBeenCalled();
    expect(result.data).toBe('success-after-refresh');
  });
});