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

interface Props {
  schools: School[];
  roles: Role[];
  years: AcademicYear[];
}

export default function ProfileForm({ schools, roles, years }: Props) {
  return (
    <form action={saveProfile} className="space-y-4">
      {/* 1. School Selection */}
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
