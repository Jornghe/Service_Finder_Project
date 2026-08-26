import { createClient } from "@supabase/supabase-js";


const supabaseUrl = 'https://vncwjaregnzjzmpnuabt.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZuY3dqYXJlZ256anptcG51YWJ0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODQ1NTMwNTMsImV4cCI6MjEwMDEyOTA1M30.n05oRRd1C-PoKTTdeR3hoYVx07IIf9zmUu331vhUKZE'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
