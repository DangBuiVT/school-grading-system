export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.5"
  }
  public: {
    Tables: {
      academic_years: {
        Row: {
          end_year: number
          id: number
          start_year: number
        }
        Insert: {
          end_year: number
          id: number
          start_year: number
        }
        Update: {
          end_year?: number
          id?: number
          start_year?: number
        }
        Relationships: []
      }
      attendance: {
        Row: {
          class_id: number
          created_at: string | null
          id: number
          status: Database["public"]["Enums"]["attendance_status"]
          student_id: number
          study_date: string
        }
        Insert: {
          class_id: number
          created_at?: string | null
          id: number
          status: Database["public"]["Enums"]["attendance_status"]
          student_id: number
          study_date: string
        }
        Update: {
          class_id?: number
          created_at?: string | null
          id?: number
          status?: Database["public"]["Enums"]["attendance_status"]
          student_id?: number
          study_date?: string
        }
        Relationships: [
          {
            foreignKeyName: "attendance_class_id_fkey"
            columns: ["class_id"]
            isOneToOne: false
            referencedRelation: "classes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "attendance_student_id_fkey"
            columns: ["student_id"]
            isOneToOne: false
            referencedRelation: "students"
            referencedColumns: ["id"]
          },
        ]
      }
      classes: {
        Row: {
          academic_year_id: number
          advisor_id: number | null
          class_name: string
          id: number
          school_id: number | null
        }
        Insert: {
          academic_year_id: number
          advisor_id?: number | null
          class_name: string
          id: number
          school_id?: number | null
        }
        Update: {
          academic_year_id?: number
          advisor_id?: number | null
          class_name?: string
          id?: number
          school_id?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "classes_academic_year_id_fkey"
            columns: ["academic_year_id"]
            isOneToOne: false
            referencedRelation: "academic_years"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "classes_advisor_id_fkey"
            columns: ["advisor_id"]
            isOneToOne: true
            referencedRelation: "teachers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "classes_school_id_fkey"
            columns: ["school_id"]
            isOneToOne: false
            referencedRelation: "schools"
            referencedColumns: ["id"]
          },
        ]
      }
      grade_audit_logs: {
        Row: {
          action_type: string | null
          changed_at: string | null
          changed_by: number | null
          grade_id: number | null
          id: string
          new_score: number | null
          old_score: number | null
        }
        Insert: {
          action_type?: string | null
          changed_at?: string | null
          changed_by?: number | null
          grade_id?: number | null
          id?: string
          new_score?: number | null
          old_score?: number | null
        }
        Update: {
          action_type?: string | null
          changed_at?: string | null
          changed_by?: number | null
          grade_id?: number | null
          id?: string
          new_score?: number | null
          old_score?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "grade_audit_logs_changed_by_fkey"
            columns: ["changed_by"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "grade_audit_logs_grade_id_fkey"
            columns: ["grade_id"]
            isOneToOne: false
            referencedRelation: "grades"
            referencedColumns: ["id"]
          },
        ]
      }
      grades: {
        Row: {
          class_id: number
          created_at: string | null
          grade_type: Database["public"]["Enums"]["grade_type"]
          id: number
          ordinal: number | null
          score: number
          semester_id: number
          student_id: number
          subject_id: number
          teacher_id: number
          updated_at: string | null
        }
        Insert: {
          class_id: number
          created_at?: string | null
          grade_type: Database["public"]["Enums"]["grade_type"]
          id: number
          ordinal?: number | null
          score: number
          semester_id: number
          student_id: number
          subject_id: number
          teacher_id: number
          updated_at?: string | null
        }
        Update: {
          class_id?: number
          created_at?: string | null
          grade_type?: Database["public"]["Enums"]["grade_type"]
          id?: number
          ordinal?: number | null
          score?: number
          semester_id?: number
          student_id?: number
          subject_id?: number
          teacher_id?: number
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "grades_class_id_fkey"
            columns: ["class_id"]
            isOneToOne: false
            referencedRelation: "classes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "grades_semester_id_fkey"
            columns: ["semester_id"]
            isOneToOne: false
            referencedRelation: "semesters"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "grades_student_id_fkey"
            columns: ["student_id"]
            isOneToOne: false
            referencedRelation: "students"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "grades_subject_id_fkey"
            columns: ["subject_id"]
            isOneToOne: false
            referencedRelation: "subjects"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "grades_teacher_id_fkey"
            columns: ["teacher_id"]
            isOneToOne: false
            referencedRelation: "teachers"
            referencedColumns: ["id"]
          },
        ]
      }
      roles: {
        Row: {
          id: number
          parent_role_id: number | null
          role_name: string
        }
        Insert: {
          id: number
          parent_role_id?: number | null
          role_name: string
        }
        Update: {
          id?: number
          parent_role_id?: number | null
          role_name?: string
        }
        Relationships: [
          {
            foreignKeyName: "roles_parent_role_id_fkey"
            columns: ["parent_role_id"]
            isOneToOne: false
            referencedRelation: "roles"
            referencedColumns: ["id"]
          },
        ]
      }
      schools: {
        Row: {
          id: number
          school_name: string
        }
        Insert: {
          id: number
          school_name: string
        }
        Update: {
          id?: number
          school_name?: string
        }
        Relationships: []
      }
      semesters: {
        Row: {
          id: number
          semester_name: string
          year_id: number
        }
        Insert: {
          id: number
          semester_name: string
          year_id: number
        }
        Update: {
          id?: number
          semester_name?: string
          year_id?: number
        }
        Relationships: [
          {
            foreignKeyName: "semesters_year_id_fkey"
            columns: ["year_id"]
            isOneToOne: false
            referencedRelation: "academic_years"
            referencedColumns: ["id"]
          },
        ]
      }
      students: {
        Row: {
          id: number
        }
        Insert: {
          id: number
        }
        Update: {
          id?: number
        }
        Relationships: [
          {
            foreignKeyName: "students_id_fkey"
            columns: ["id"]
            isOneToOne: true
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      studies: {
        Row: {
          class_id: number
          student_id: number
        }
        Insert: {
          class_id: number
          student_id: number
        }
        Update: {
          class_id?: number
          student_id?: number
        }
        Relationships: [
          {
            foreignKeyName: "studies_class_id_fkey"
            columns: ["class_id"]
            isOneToOne: false
            referencedRelation: "classes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "studies_student_id_fkey"
            columns: ["student_id"]
            isOneToOne: false
            referencedRelation: "students"
            referencedColumns: ["id"]
          },
        ]
      }
      subjects: {
        Row: {
          coefficient: number
          id: number
          subject_code: string
          subject_name: string
        }
        Insert: {
          coefficient?: number
          id: number
          subject_code: string
          subject_name: string
        }
        Update: {
          coefficient?: number
          id?: number
          subject_code?: string
          subject_name?: string
        }
        Relationships: []
      }
      teachers: {
        Row: {
          id: number
        }
        Insert: {
          id: number
        }
        Update: {
          id?: number
        }
        Relationships: [
          {
            foreignKeyName: "teachers_id_fkey"
            columns: ["id"]
            isOneToOne: true
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      teaches: {
        Row: {
          class_id: number
          subject_id: number
          teacher_id: number
        }
        Insert: {
          class_id: number
          subject_id: number
          teacher_id: number
        }
        Update: {
          class_id?: number
          subject_id?: number
          teacher_id?: number
        }
        Relationships: [
          {
            foreignKeyName: "teaches_class_id_fkey"
            columns: ["class_id"]
            isOneToOne: false
            referencedRelation: "classes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "teaches_subject_id_fkey"
            columns: ["subject_id"]
            isOneToOne: false
            referencedRelation: "subjects"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "teaches_teacher_id_fkey"
            columns: ["teacher_id"]
            isOneToOne: false
            referencedRelation: "teachers"
            referencedColumns: ["id"]
          },
        ]
      }
      users: {
        Row: {
          created_at: string | null
          email: string | null
          id: number
          password_hash: string | null
          role_id: number | null
          school_id: number | null
          updated_at: string | null
          username: string | null
        }
        Insert: {
          created_at?: string | null
          email?: string | null
          id: number
          password_hash?: string | null
          role_id?: number | null
          school_id?: number | null
          updated_at?: string | null
          username?: string | null
        }
        Update: {
          created_at?: string | null
          email?: string | null
          id?: number
          password_hash?: string | null
          role_id?: number | null
          school_id?: number | null
          updated_at?: string | null
          username?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "users_role_id_fkey"
            columns: ["role_id"]
            isOneToOne: false
            referencedRelation: "roles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "users_school_id_fkey"
            columns: ["school_id"]
            isOneToOne: false
            referencedRelation: "schools"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      attendance_status:
        | "Có mặt đúng giờ"
        | "Có mặt muộn giờ"
        | "Vắng mặt có phép"
        | "Vắng mặt không phép"
      grade_type: "Miệng" | "15 phút" | "1 tiết" | "Giữa kỳ" | "Cuối kỳ"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      attendance_status: [
        "Có mặt đúng giờ",
        "Có mặt muộn giờ",
        "Vắng mặt có phép",
        "Vắng mặt không phép",
      ],
      grade_type: ["Miệng", "15 phút", "1 tiết", "Giữa kỳ", "Cuối kỳ"],
    },
  },
} as const
