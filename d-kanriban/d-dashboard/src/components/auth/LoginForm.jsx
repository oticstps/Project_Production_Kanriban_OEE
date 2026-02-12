import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import oiImage from '../../assets/oi.jpg';
import Layout from '../layout/Layout';


const InputField = ({ id, type, name, value, onChange, placeholder, error, required, className, ...props }) => {
  return (
    <input
      id={id}
      type={type}
      name={name}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      required={required}
      className={`w-full px-5 py-3.5 text-sm rounded-lg border focus:outline-none focus:ring-2 focus:ring-blue-400/40 focus:border-blue-500 transition ${
        error ? 'border-red-400 bg-red-50' : 'border-gray-300 bg-white'
      } ${className}`}
      {...props}
    />
  );
};

const Button = ({ type, disabled, className, children, ...props }) => {
  return (
    <button
      type={type}
      disabled={disabled}
      className={`w-full py-3.5 px-4 text-sm font-medium rounded-lg shadow-sm transition duration-200 ${
        disabled
          ? 'bg-gray-400 cursor-not-allowed text-gray-200'
          : 'bg-blue-600 hover:bg-blue-700 text-white'
      } ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};

const LoginForm = () => {
  const [formData, setFormData] = useState({ username: '', pin: '' });
  const [errors, setErrors] = useState({});
  const [showPin, setShowPin] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const { login, error: authError } = useAuth();
  const navigate = useNavigate();
  const usernameRef = useRef(null);

  useEffect(() => {
    const savedUsername = localStorage.getItem('username');
    const savedRememberMe = localStorage.getItem('rememberMe') === 'true';
    if (savedUsername) {
      setFormData((prev) => ({ ...prev, username: savedUsername }));
      setRememberMe(savedRememberMe);
    }
    if (usernameRef.current) usernameRef.current.focus();
  }, []);

  useEffect(() => {
    if (Object.keys(errors).length > 0) {
      const firstErrorField = Object.keys(errors)[0];
      const element = document.getElementById(firstErrorField);
      if (element) {
        element.focus();
        element.select();
      }
    }
  }, [errors]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const handleRememberMeChange = (e) => setRememberMe(e.target.checked);

  const validateForm = () => {
    const newErrors = {};
    if (!formData.username.trim()) newErrors.username = 'Username is required';
    if (!formData.pin) {
      newErrors.pin = 'PIN is required';
    } else if (formData.pin.length < 4 || formData.pin.length > 6) {
      newErrors.pin = 'PIN must be 4–6 digits';
    } else if (!/^\d+$/.test(formData.pin)) {
      newErrors.pin = 'PIN must contain only numbers';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    setIsLoading(true);
    try {
      await login(formData);
      if (rememberMe && formData.username) {
        localStorage.setItem('username', formData.username);
        localStorage.setItem('rememberMe', 'true');
      } else {
        localStorage.removeItem('username');
        localStorage.removeItem('rememberMe');
      }
      navigate('/manhour');
    } catch (err) {
      // Handled by useAuth
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !isLoading) handleSubmit(e);
  };

  return (

    <Layout>
      <div className="h-[500px] flex items-center justify-center bg-green-50 p-4">

        
        <div className="w-[950px] max-w-7xl flex flex-col md:flex-row rounded-xl shadow-xl overflow-hidden bg-white h-[450px]">
          


          {/* Branding / Info (30%) — sekarang di kiri */}
          <div className="hidden md:flex w-3/10 bg-gradient-to-b from-blue-500 to-blue-600 text-white flex-col items-center justify-center p-8 text-center">
            <img
              src={oiImage}
              alt="Company Logo"
              className="mx-auto h-24 w-24 rounded-full object-cover mb-6 border-2 border-white/30 shadow-md"
            />
            <h2 className="text-xl font-semibold mb-3">Otics Indonesia Monitoring System</h2>
            <p className="text-blue-100 text-sm max-w-[90%] leading-relaxed">
              Untuk mengakses sistem dapat menggunakan NIK terdaftar
            </p>
          </div>

          {/* Form Login (70%) — sekarang di kanan */}
          <div className="w-full md:w-7/10 p-10 flex items-center justify-center">
            <div className="w-full max-w-md">
              <div className="text-center mb-8">
                <h1 className="text-2xl font-bold text-gray-800">Portal System</h1>
                {/* <p className="text-gray-600 mt-1 text-sm">Please sign in to continue</p> */}
              </div>

              <form className="space-y-6" onSubmit={handleSubmit}>
                {authError && (
                  <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm text-center">
                    Invalid username or PIN
                  </div>
                )}

                <div>
                  <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-1.5">
                    Username (NIK)
                  </label>
                  <InputField
                    ref={usernameRef}
                    id="username"
                    type="text"
                    name="username"
                    value={formData.username}
                    onChange={handleChange}
                    placeholder="Enter your NIK"
                    onKeyPress={handleKeyPress}
                  />
                  {errors.username && <p className="mt-1 text-xs text-red-600">{errors.username}</p>}
                </div>

                <div>
                  <label htmlFor="pin" className="block text-sm font-medium text-gray-700 mb-1.5">
                    PIN
                  </label>
                  <div className="relative">
                    <InputField
                      id="pin"
                      type={showPin ? 'text' : 'password'}
                      name="pin"
                      value={formData.pin}
                      onChange={handleChange}
                      placeholder="4–6 digit PIN"
                      error={!!errors.pin}
                      onKeyPress={handleKeyPress}
                      className="pr-12"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPin(!showPin)}
                      className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500 hover:text-gray-700 text-xs"
                      aria-label={showPin ? 'Hide PIN' : 'Show PIN'}
                    >
                      {showPin ? 'Hide' : 'Show'}
                    </button>
                  </div>
                  {errors.pin && <p className="mt-1 text-xs text-red-600">{errors.pin}</p>}
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <input
                      id="remember-me"
                      name="remember-me"
                      type="checkbox"
                      checked={rememberMe}
                      onChange={handleRememberMeChange}
                      className="h-4 w-4 text-blue-600 rounded focus:ring-blue-500 border-gray-300"
                    />
                    <label htmlFor="remember-me" className="ml-2 text-sm text-gray-700">
                      Remember me
                    </label>
                  </div>
                  {/* <Link to="/forgot-pin" className="text-sm font-medium text-blue-600 hover:text-blue-800">Forgot PIN?</Link> */}
                </div>

                <div className="pt-3">
                  <Button type="submit" disabled={isLoading}>
                    {isLoading ? (
                      <span className="flex items-center justify-center">
                        <svg
                          className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                        >
                          <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                          ></circle>
                          <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                          ></path>
                        </svg>
                        Signing in...
                      </span>
                    ) : (
                      'Sign in'
                    )}
                  </Button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </Layout>


  );
};

export default LoginForm;