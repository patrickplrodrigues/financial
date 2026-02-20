import { supabase } from "@/lib/supabase"

export async function getCoupleId(email: string) {
  const { data, error } = await supabase
    .from("couples")
    .select("id")
    .or(`email1.eq.${email},email2.eq.${email}`)
    .single()

  if (error) throw error

  return data.id
}