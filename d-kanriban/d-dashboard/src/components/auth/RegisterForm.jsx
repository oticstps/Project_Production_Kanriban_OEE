import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import InputField from '../common/InputField';
import Button from '../common/Button';
import oiImage from '../../assets/oi.jpg'; // Sesuaikan path jika perlu

const RegisterForm = () => {
  const [formData, setFormData] = useState({
    username: '', // NIK
    name: '',     // Nama Lengkap
    pin: '',
    confirmPin: '',
  });
  const [errors, setErrors] = useState({});
  const { register, error: authError } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Clear error when user types
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: '',
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.username.trim()) {
      newErrors.username = 'Username is required';
    }

    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    } else if (formData.name.length < 2 || formData.name.length > 100) {
      newErrors.name = 'Name must be 2-100 characters';
    }

    if (!formData.pin) {
      newErrors.pin = 'PIN is required';
    } else if (formData.pin.length < 4 || formData.pin.length > 6) {
      newErrors.pin = 'PIN must be 4-6 digits';
    } else if (!/^\d+$/.test(formData.pin)) {
      newErrors.pin = 'PIN must contain only numbers';
    }

    if (formData.pin !== formData.confirmPin) {
      newErrors.confirmPin = 'PINs do not match';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    try {
      await register({
        username: formData.username,
        name: formData.name,
        pin: formData.pin,
      });
      navigate('/manhour'); // Sesuaikan route tujuan setelah register
    } catch (err) {
      // Error already handled by useAuth
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      {/* Container utama dengan rasio 30:70 */}
      <div className="w-full max-w-6xl flex flex-col md:flex-row rounded-lg shadow-lg overflow-hidden bg-white">
        
        {/* Kolom Kiri (30%) - Branding */}
        <div className="w-full md:w-3/10 bg-blue-700 text-white flex flex-col items-center justify-center p-8 text-center">
          <img
            src={oiImage}
            alt="Logo"
            className="mx-auto h-20 w-20 rounded-full object-cover mb-6"
          />
          <h2 className="text-2xl font-bold mb-2">Kanriban Produksi Manhour</h2>
          <p className="text-blue-100 text-sm">
            Register with your NIK to get started
          </p>
        </div>

        {/* Kolom Kanan (70%) - Form Register */}
        <div className="w-full md:w-7/10 p-8">
          <div className="max-w-md mx-auto">
            <h3 className="text-2xl font-semibold text-gray-800 mb-6 text-center">
              Create Your Account
            </h3>

            <form className="space-y-6" onSubmit={handleSubmit}>
              {authError && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md text-sm">
                  {authError}
                </div>
              )}

              <InputField
                label="Username (e.g., NIK)"
                type="text"
                name="username"
                value={formData.username}
                onChange={handleChange}
                placeholder="Enter your NIK"
                error={errors.username}
                required
              />

              <InputField
                label="Full Name"
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Enter your full name"
                error={errors.name}
                required
              />

              <InputField
                label="PIN"
                type="password"
                name="pin"
                value={formData.pin}
                onChange={handleChange}
                placeholder="Create 4-6 digit PIN"
                error={errors.pin}
                required
              />

              <InputField
                label="Confirm PIN"
                type="password"
                name="confirmPin"
                value={formData.confirmPin}
                onChange={handleChange}
                placeholder="Confirm your PIN"
                error={errors.confirmPin}
                required
              />

              <div>
                <Button type="submit" className="w-full">
                  Register
                </Button>
              </div>
            </form>

            <div className="mt-6 text-center">
              <p className="text-sm text-gray-600">
                Already have an account?{' '}
                <Link to="/login" className="font-medium text-blue-600 hover:text-blue-800">
                  Sign in
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterForm;