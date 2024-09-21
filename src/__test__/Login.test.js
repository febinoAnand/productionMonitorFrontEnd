import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter, Link as RouterLink,useNavigate } from 'react-router-dom';
import Login from'../views/pages/login/Login';
import { CRow, CCol } from '@coreui/react';

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: jest.fn(),
}));

const mockNavigate = jest.fn();

beforeEach(() => {
  jest.clearAllMocks();
  useNavigate.mockReturnValue(mockNavigate);
});
describe('Login component', () => {
  let originalLocation;

  beforeAll(() => {
    originalLocation = window.location;

    delete window.location;
    window.location = { 
      pathname: '/', 
      reload: jest.fn()
    };
  });

  afterAll(() => {
    window.location = originalLocation;
  });

    it('renders with correct styles', () => {
        const { container } = render(
          <BrowserRouter>
            <Login />
          </BrowserRouter>
        );
        const bgLightElement = container.querySelector('.bg-light');
        expect(bgLightElement).toHaveStyle({
          minHeight: '100vh',
          width: '100%',
          overflow: 'hidden',
        });
      });
      it('has username and password input fields', () => {
        const { getByPlaceholderText } = render(
          <BrowserRouter>
            <Login />
          </BrowserRouter>
        );
        const usernameInput = getByPlaceholderText('Login ID');
        const passwordInput = getByPlaceholderText('Password');
        expect(usernameInput).toBeInTheDocument();
        expect(passwordInput).toBeInTheDocument();
      });
      it('renders login name within container', () => {
        const { getByText } = render(
          <BrowserRouter>
            <Login />
          </BrowserRouter>
        );
        const loginName = getByText('Login');
        expect(loginName).toBeInTheDocument();
      });

      test('renders signin button', () => {
        const { getByRole } = render(
          <BrowserRouter>
            <Login />
          </BrowserRouter>
        );
        expect(getByRole('button')).toBeInTheDocument();
      });

      test('renders demo user links with correct text', () => {
        const { getByText } = render(
          <BrowserRouter>
            <CRow className="mt-3 text-center">
              <CCol>
                <RouterLink to="/users/Logindemo" style={{ fontSize: '0.8rem', color: '#FFFFFF' }}>
                  Demo User OTP
                </RouterLink>
              </CCol>
              <CCol>
                <RouterLink to="/users/Activatedemo" style={{ fontSize: '0.8rem', color: '#FFFFFF' }}>
                  To Activate Demo User
                </RouterLink>
              </CCol>
            </CRow>
          </BrowserRouter>
        );
      
        expect(getByText('Demo User OTP')).toBeInTheDocument();
        expect(getByText('To Activate Demo User')).toBeInTheDocument();
      });
      it('should not login with incorrect credentials', async () => {
    const fetchMock = jest.fn(() =>
      Promise.resolve({
        ok: false,
        json: () => Promise.resolve({ message: 'Invalid credentials' }),
      })
    );

    global.fetch = fetchMock;

    const localStorageMock = {
      getItem: jest.fn(() => null), 
      setItem: jest.fn(),
      removeItem: jest.fn(),
      clear: jest.fn(),
    };
    global.localStorage = localStorageMock;

    const { getByPlaceholderText, getByText } = render(
      <BrowserRouter>
        <Login />
      </BrowserRouter>
    );

    
    fireEvent.change(getByPlaceholderText('Login ID'), { target: { value: 'invalid-username' } });
    fireEvent.change(getByPlaceholderText('Password'), { target: { value: 'invalid-password' } });
    fireEvent.click(getByText('Sign In'));

  
    await waitFor(() => expect(fetchMock).toHaveBeenCalledTimes(1));

    expect(localStorageMock.setItem).not.toHaveBeenCalled();
    expect(localStorageMock.getItem('token')).toBeNull();
    expect(localStorageMock.getItem('username')).toBeNull();
    expect(localStorageMock.getItem('password')).toBeNull();

    expect(window.location.pathname).not.toBe('/HLMando/dashboard');
  });
  test('should login with correct credentials and navigate to /HLMando/dashboard', async () => {
    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve({ token: 'fake-jwt-token' }),
      })
    );
  
    const { getByPlaceholderText, getByText } = render(
      <BrowserRouter>
        <Login />
      </BrowserRouter>
    );
  
  
    fireEvent.change(getByPlaceholderText('Login ID'), { target: { value: 'valid.email@example.com' } });
    fireEvent.change(getByPlaceholderText('Password'), { target: { value: 'valid-password' } });
    fireEvent.click(getByText('Sign In'));
  
  
    await waitFor(() => expect(fetch).toHaveBeenCalledTimes(1));
  
    
    expect(localStorage.getItem('username')).toBe('valid.email@example.com');
    
   
    expect(mockNavigate).toHaveBeenCalledWith('/HLMando/dashboard');
  }); 
});

