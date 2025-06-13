import { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { data } = await axios.post(
        console.log(import.meta.env.VITE_API_URL)
        
        `${import.meta.env.VITE_API_URL}/api/auth/forgot-password`, // Dynamic URL
        { email }
      );

      if (data?.success) {
        toast.success(data.message);
        setTimeout(() => navigate("/login"), 2000); // Wait 2s before redirecting
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Something went wrong, try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center min-h-screen bg-gray-100">
      <h2 className="text-2xl font-semibold mb-4">Forgot Password</h2>
      <form
        onSubmit={handleSubmit}
        className="w-96 p-6 bg-white shadow-lg rounded-md"
      >
        <input
          type="email"
          placeholder="Enter your email"
          className="w-full p-2 border border-gray-300 rounded mb-4"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <button
          type="submit"
          className={`w-full py-2 rounded ${
            loading ? "bg-gray-500" : "bg-blue-600 hover:bg-blue-700"
          } text-white`}
          disabled={loading}
        >
          {loading ? "Sending..." : "Send Reset Link"}
        </button>
      </form>
    </div>
  );
};

export default ForgotPassword;
