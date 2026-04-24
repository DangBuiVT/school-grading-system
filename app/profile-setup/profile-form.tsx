"use client";

import { saveProfile } from "./actions";

type School = {
  id: string;
  school_name: string;
};

type Role = {
  id: string;
  parent_role_id: string | null;
  role_name: string;
};

type AcademicYear = {
  id: number;
  start_year: number;
  end_year: number;
  display_name: string | null;
};

type Gender = "male" | "female";

interface Props {
  schools: School[];
  roles: Role[];
  years: AcademicYear[];
}

export default function ProfileForm({ schools, roles, years }: Props) {
  return (
    <form
      action={saveProfile}
      className="space-y-4 font-montserrat text-gray-900"
    >
      <div className="flex flex-col gap-4">
        <input
          name="lname"
          placeholder="Surname & Middle name"
          required
          className="p-3 flex-2 border rounded-md"
        />
        <input
          name="fname"
          placeholder="Given name"
          required
          className="p-3 flex-1 border rounded-md"
        />
      </div>
      <div className="flex gap-5">
        <h4>Choose your gender:</h4>
        <div className="flex items-center gap-2">
          <input type="radio" name="gender" value="male" />
          <label className="">Male</label>
        </div>
        <div className="flex items-center gap-2">
          <input type="radio" name="gender" value="female" />
          <label className="">Female</label>
        </div>
      </div>
      <div className="flex gap-4 items-center">
        <label className="">Date of Birth: </label>
        <input
          type="date"
          name="dob"
          required
          className="border py-2 px-3 rounded-md"
        />
      </div>
      <div>
        <label className="block text-sm font-medium">Select Your School</label>
        <select
          name="school_id"
          className="w-full p-2 border rounded-md bg-white"
        >
          <option value="">-- Choose a School --</option>
          {schools.map((school) => (
            <option key={school.id} value={school.id}>
              {school.school_name}
            </option>
          ))}
        </select>
      </div>
      {/* 2. Role Selection */}
      <div>
        <label className="block text-sm font-medium">Select Your Role</label>
        <select
          name="role_id"
          className="w-full p-2 border rounded-md bg-white"
        >
          <option value="">-- Choose a Role --</option>
          {roles.map((role) => (
            <option key={role.id} value={role.id}>
              {role.role_name}
            </option>
          ))}
        </select>
      </div>
      <button
        type="submit"
        className="w-full bg-primary text-white p-2 rounded-md font-bold"
      >
        Save Profile
      </button>
    </form>
  );
}
