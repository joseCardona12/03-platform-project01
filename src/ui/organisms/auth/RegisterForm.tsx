"use client";
import { FormField } from "@/ui/molecules/common/FormField";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useRouter } from "next/navigation";
import { ToastContainer, toast } from "react-toastify";
import { AuthService } from "@/app/infrastructure/services/authService";
import "react-toastify/dist/ReactToastify.css";

interface IRegisterRequest {
  email: string;
  password: string;
  name: string;
  role: "volunteer" | "organizer";
  photo?: File;
}

const registerSchema = yup.object().shape({
  email: yup
    .string()
    .email("El correo es inválido")
    .required("El correo es obligatorio"),
  password: yup
    .string()
    .min(8, "La contraseña debe tener al menos 8 caracteres")
    .required("La contraseña es obligatoria"),
  name: yup.string().required("El nombre es obligatorio"),
  role: yup
    .string()
    .oneOf(["volunteer", "organizer"], "El rol debe ser volunteer u organizer")
    .required("El rol es obligatorio"),
  photo: yup
    .mixed<File>()
    .optional()
    .test("fileSize", "El archivo es demasiado grande", (value) =>
      value ? value.size <= 5 * 1024 * 1024 : true
    )
    .test(
      "fileType",
      "Solo se permiten formatos JPG o PNG",
      (value) => value && ["image/jpeg", "image/png"].includes(value.type)
    ),
});

export const RegisterForm = () => {
  const router = useRouter();
  const {
    control,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<IRegisterRequest>({
    mode: "onChange",
    reValidateMode: "onChange",
    resolver: yupResolver(registerSchema),
  });

  const handleRegister = async (data: IRegisterRequest) => {
    try {
      const formData = new FormData();
  
      formData.append("email", data.email);
      formData.append("password", data.password);
      formData.append("name", data.name);
      formData.append("role", data.role);
  
      if (data.photo) {
        formData.append("photo", data.photo);
      }
  
      const response = await fetch("/api/register", {
        method: "POST",
        body: formData,
      });
  
      if (!response.ok) {
        const errorData = await response.json();
        toast.error(errorData.message || "Error al registrar el usuario", {
          position: "top-right",
          autoClose: 3000,
        });
        return;
      }
  
      toast.success("Usuario registrado exitosamente", {
        position: "top-right",
        autoClose: 3000,
        onClose: () => router.push("/login"), // Redirigir después de la notificación
      });
  
      return await response.json();
    } catch (error) {
      console.error("Error en el POST:", error);
      toast.error("Error inesperado. Por favor, intenta de nuevo.", {
        position: "top-right",
        autoClose: 3000,
      });
    }
  };
  
  

  return (
    <>
      <ToastContainer />
      <form
        className="w-full max-w-sm mx-auto p-4 space-y-4 text-black"
        onSubmit={handleSubmit(handleRegister)}
      >
        <h2 className="text-2xl font-bold text-center text-black">
          Registrarse
        </h2>
        <p className="text-sm text-center text-gray-500">
          Ingresa tus datos para crear una cuenta
        </p>

        <FormField<IRegisterRequest>
          control={control}
          type="email"
          label="Correo Electrónico"
          name="email"
          error={errors.email}
          placeholder="Ingresa tu correo"
        />

        <FormField<IRegisterRequest>
          control={control}
          type="password"
          label="Contraseña"
          name="password"
          error={errors.password}
          placeholder="Ingresa tu contraseña"
        />

        <FormField<IRegisterRequest>
          control={control}
          type="text"
          label="Nombre"
          name="name"
          error={errors.name}
          placeholder="Ingresa tu nombre"
        />

        <div className="space-y-2">
          <label htmlFor="role" className="block text-sm font-medium">
            Rol
          </label>
          <select
            {...control.register("role")}
            className="block w-full px-3 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring focus:border-blue-500"
          >
            <option value="volunteer">Volunteer</option>
            <option value="organizer">Organizer</option>
          </select>
          {errors.role && (
            <p className="text-sm text-red-500">{errors.role.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <label htmlFor="photo" className="block text-sm font-medium">
            Foto de Perfil
          </label>
          <input
            type="file"
            accept="image/jpeg, image/png"
            onChange={(e) => {
              const file = e.target.files?.[0];
              setValue("photo", file);
            }}
            className="block w-full text-sm text-gray-500 file:py-2 file:px-4 file:border-0 file:text-sm file:font-semibold file:bg-gray-200 hover:file:bg-gray-300"
          />
          {errors.photo && (
            <p className="text-sm text-red-500">{errors.photo.message}</p>
          )}
        </div>

        <button
          type="submit"
          className="w-full py-2 px-4 bg-black text-white rounded-lg font-medium hover:bg-gray-600"
        >
          Registrarse
        </button>
      </form>
    </>
  );
};
