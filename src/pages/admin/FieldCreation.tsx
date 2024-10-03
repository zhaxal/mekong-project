import { useState } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { excelToJson, extractShapes } from "../../utils";
import { addDoc, collection } from "firebase/firestore";
import { db } from "../../firebaseConfig";

interface FieldCreationFormProps {
  title: string;
  shapeFile: FileList;
  tableFile: FileList;
}

function FieldCreation() {
  const { register, handleSubmit } = useForm<FieldCreationFormProps>({
    defaultValues: {
      title: "",
      shapeFile: undefined,
      tableFile: undefined,
    },
  });

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [redirecting, setRedirecting] = useState(false);
  const navigate = useNavigate();

  const onSubmit: SubmitHandler<FieldCreationFormProps> = async (data) => {
    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      const shp = await extractShapes(data.shapeFile);
      const table = await excelToJson(data.tableFile[0]);
      const shpJson = JSON.stringify(shp);
      const tableJson = JSON.stringify(table);

      const field = {
        title: data.title,
        shape: shpJson,
        table: tableJson,
      };

      await addDoc(collection(db, "fields"), field);
      setSuccess(true);
      setRedirecting(true);
      setTimeout(() => {
        navigate("/admin");
      }, 2000); // Redirect after 2 seconds
    } catch (err) {
      setError(
        "An error occurred while submitting the form. Please try again."
      );
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex-grow flex flex-col items-center justify-center px-4 sm:px-0">
      <div className="mb-4">Field Creation</div>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex flex-col items-center w-full max-w-md"
      >
        <div className="mb-4 w-full">
          <label
            htmlFor="title"
            className="block text-sm font-medium text-gray-700"
          >
            Title
          </label>
          <input
            {...register("title")}
            type="text"
            id="title"
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          />
        </div>
        <div className="mb-4 w-full">
          <label
            htmlFor="shapeFile"
            className="block text-sm font-medium text-gray-700"
          >
            Shape File
          </label>
          <input
            {...register("shapeFile")}
            type="file"
            id="shapeFile"
            accept=".zip,.rar,.7z,.tar.gz"
            className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100"
          />
        </div>
        <div className="mb-4 w-full">
          <label
            htmlFor="tableFile"
            className="block text-sm font-medium text-gray-700"
          >
            Table File
          </label>
          <input
            {...register("tableFile")}
            type="file"
            id="tableFile"
            accept=".xls,.xlsx"
            className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100"
          />
        </div>
        <button
          type="submit"
          className="px-4 py-2 rounded w-full text-white bg-blue-500 hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
          disabled={loading || redirecting}
        >
          {loading ? "Submitting..." : "Submit"}
        </button>
      </form>
      {success && (
        <div className="mt-4 text-green-500">
          Form submitted successfully! Redirecting...
        </div>
      )}
      {error && <div className="mt-4 text-red-500">{error}</div>}
    </div>
  );
}

export default FieldCreation;
