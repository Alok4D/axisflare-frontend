"use client";
import { useState, useRef } from "react";
import { useForm, Resolver } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import Image from "next/image";
import { InputGroup } from "@/components/profile/InputGroup";
import { toast } from "sonner";
import { useGetMeQuery, useUpdateProfileMutation } from "@/lib/features/user/userApi";
import { Loader2 } from "lucide-react";
import { useEffect } from "react";

// --- Validation Schema ---
const profileSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  email: z.string().email("Please enter a valid email"),
  country: z.string().min(1, "Country field cannot be empty"),
  currentPassword: z.string().optional(),
  newPassword: z.string().min(8, "Min 8 characters").optional().or(z.literal("")),
  confirmPassword: z.string().optional().or(z.literal("")),
}).refine((data) => {
  if (data.newPassword && data.newPassword !== data.confirmPassword) return false;
  return true;
}, {
  message: "Passwords do not match",
  path: ["confirmPassword"],
});

type ProfileFormValues = z.infer<typeof profileSchema>;

export default function UserProfilePage() {
  const [isEditing, setIsEditing] = useState(true);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const { data: userData, isLoading: isUserLoading } = useGetMeQuery();
  const [updateProfile, { isLoading: isUpdating }] = useUpdateProfileMutation();

  const { register, handleSubmit, reset, formState: { errors } } = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema) as Resolver<ProfileFormValues>,
    mode: "onChange",
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      country: "",
    }
  });

  useEffect(() => {
    if (userData?.data) {
      const parts = (userData.data.name || "").split(" ");
      reset({
        firstName: parts[0] || "",
        lastName: parts.slice(1).join(" ") || "",
        email: userData.data.email || "",
        country: userData.data.country || "United States",
      });
      if (userData.data.profilePicture) {
        setPreviewImage(userData.data.profilePicture);
      }
    }
  }, [userData, reset]);

  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      setPreviewImage(URL.createObjectURL(file));
    }
  };

  const onSubmit = async (values: ProfileFormValues) => {
    try {
      const formData = new FormData();
      if (selectedFile) {
        formData.append("file", selectedFile);
      }

      const dataPayload: any = {
        name: `${values.firstName} ${values.lastName}`.trim(),
        email: values.email,
        country: values.country,
        role: userData?.data?.role || "USER",
      };

      if (values.newPassword) {
        dataPayload.password = values.newPassword;
      }

      formData.append("data", JSON.stringify(dataPayload));

      const res = await updateProfile(formData).unwrap();
      if (res.success) {
        toast.success(res.message || "Profile updated successfully!");
        setSelectedFile(null);
      }
    } catch (error: any) {
      toast.error(error?.data?.message || "Failed to update profile");
    }
  };

  if (isUserLoading) {
    return (
      <div className="flex h-[60vh] items-center justify-center">
        <Loader2 className="h-10 w-10 animate-spin text-[#7CB1E6]" />
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="p-6 min-h-screen">
      <div className="space-y-8">

        {/* Header */}
        <div className="flex justify-between items-end">
          <div className="space-y-1">
            <h2 className="text-2xl font-bold text-slate-900">Manage your profile</h2>
            <p className="text-sm text-slate-500">Manage your personal account information.</p>
          </div>
        </div>

        {/* Profile Card */}
        <div className="rounded-xl p-8 lg:p-10 border border-slate-100 shadow-sm space-y-8">
          <h3 className="text-lg font-semibold text-slate-800">Profile Information</h3>

          <div className="flex items-center gap-6">
            <div className="h-24 w-24 rounded-full overflow-hidden border-2 border-slate-100 relative bg-slate-50">
              <Image
                src={previewImage || "https://media.istockphoto.com/id/1682296067/photo/happy-studio-portrait-or-professional-man-real-estate-agent-or-asian-businessman-smile-for.jpg?s=612x612&w=0&k=20&c=9zbG2-9fl741fbTWw5fNgcEEe4ll-JegrGlQQ6m54rg="}
                alt="Profile" fill className="object-cover"
              />
            </div>
            {isEditing && (
              <button disabled={isUpdating} type="button" onClick={() => fileInputRef.current?.click()} className="px-5 py-2 border border-slate-300 rounded-xl text-sm font-semibold hover:bg-slate-50 transition-all disabled:opacity-50">
                Change Photo
              </button>
            )}
            <input type="file" ref={fileInputRef} className="hidden" onChange={onFileChange} />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
            <InputGroup label="First Name" disabled={false} error={errors.firstName?.message} {...register("firstName")} />
            <InputGroup label="Last Name" disabled={false} error={errors.lastName?.message} {...register("lastName")} />
            <InputGroup label="Email Address" disabled={true} error={errors.email?.message} {...register("email")} />
            {/* <InputGroup label="Country" disabled={false} error={errors.country?.message} {...register("country")} /> */}
          </div>
        </div>

        {/* Password Card */}
        <div className="rounded-xl p-6 border border-slate-100 shadow-sm space-y-8">
          <h3 className="text-lg font-semibold text-slate-800">Change Password</h3>
          <div className="space-y-6">
            <InputGroup label="Current Password" type="password" disabled={false} error={errors.currentPassword?.message} {...register("currentPassword")} />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <InputGroup label="New Password" type="password" disabled={false} error={errors.newPassword?.message} {...register("newPassword")} />
              <InputGroup label="Confirm Password" type="password" disabled={false} error={errors.confirmPassword?.message} {...register("confirmPassword")} />
            </div>
          </div>

          <div className="flex items-center justify-end gap-4 pt-6 border-t border-slate-50">
            <button disabled={isUpdating} type="button" onClick={() => reset()} className="px-8 py-2.5 rounded-xl border border-slate-900 text-slate-900 font-semibold hover:bg-slate-50 text-sm transition-all disabled:opacity-50">Cancel</button>
            <button disabled={isUpdating} type="submit" className="px-8 py-2.5 rounded-xl bg-[#7CB1E6] text-white font-semibold hover:bg-[#6FA3D8] text-sm shadow-sm transition-all disabled:opacity-70 flex items-center gap-2">
              {isUpdating && <Loader2 className="h-4 w-4 animate-spin" />}
              {isUpdating ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </div>
      </div>
    </form>
  );
}