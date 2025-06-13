import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import { IoMdEye, IoIosEyeOff } from "react-icons/io"; // Import eye icons

const ResetPassword = () => {
  const { token } = useParams(); // Get token from URL
  const [newPassword, setNewPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (newPassword.length < 6) {
      toast.error("Password must be at least 6 characters long.");
      return;
    }

    try {
      const { data } = await axios.post(
        `http://localhost:5000/api/auth/reset-password/${token}`,
        { newPassword }
      );

      if (data.success) {
        toast.success(data.message);
        setTimeout(() => navigate("/login"), 2000); // Delay redirection
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Invalid or expired link.");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <h2 className="text-2xl font-semibold mb-4">Reset Password</h2>
      <form
        onSubmit={handleSubmit}
        className="w-96 p-6 bg-white shadow-md rounded-md relative"
      >
        <div className="relative w-full">
          <input
            type={showPassword ? "text" : "password"}
            placeholder="Enter new password"
            className="w-full p-2 border border-gray-300 rounded mb-4 pr-10"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            required
          />
          <button
            type="button"
            className="absolute right-3 top-2 text-gray-600"
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? <IoIosEyeOff size={20} /> : <IoMdEye size={20} />}
          </button>
        </div>

        <button
          type="submit"
          className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700"
        >
          Reset Password
        </button>
      </form>
    </div>
  );
};

export default ResetPassword;
