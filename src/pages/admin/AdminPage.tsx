import { useAuth } from "../../contexts/AuthContext";
import { useNavigate } from "react-router-dom";

function AdminPage() {
  const { logout } = useAuth();
  const navigate = useNavigate();

  return (
    <div className="flex-grow flex flex-col items-center justify-center px-4 sm:px-0">
      <div className="mb-4">AdminPage</div>
    
      <button
        onClick={() => {
          navigate("/admin/field-creation");
        }}
        className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-700 mb-4"
      >
        Go to Field Creation
      </button>
    
      <button
        onClick={logout}
        className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-700"
      >
        Logout
      </button>
    </div>
  );
}

export default AdminPage;
