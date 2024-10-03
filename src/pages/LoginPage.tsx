import { useForm } from "react-hook-form";
import { Navigate } from "react-router-dom";

import { useAuth } from "../contexts/AuthContext";

interface LoginFormProps {
  token: string;
}

function LoginPage() {
  const { isLoggedIn, loading, login } = useAuth();
  const loginForm = useForm<LoginFormProps>({
    defaultValues: {
      token: "",
    },
  });

  const onSubmit = async (data: LoginFormProps) => {
    login(data.token);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center text-2xl font-bold text-blue-500">
        Loading...
      </div>
    );
  }

  if (isLoggedIn) {
    return <Navigate to="/admin" />;
  }

  return (
    <div className="flex-grow flex items-center justify-center px-4 sm:px-0">
      <div className="p-8 space-y-4 bg-white rounded shadow-lg w-full sm:w-80">
        <h1 className="text-2xl sm:text-3xl font-bold text-center">
          Admin Login
        </h1>

        <form className="space-y-4" onSubmit={loginForm.handleSubmit(onSubmit)}>
          <label className="block">
            <span className="text-gray-700">Token:</span>
            <input
              {...loginForm.register("token")}
              type="password"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
            />
          </label>
          <button
            type="submit"
            className="w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Login
          </button>
        </form>
      </div>
    </div>
  );
}

export default LoginPage;
