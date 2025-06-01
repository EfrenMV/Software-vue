<<<<<<< Updated upstream
=======
// src/supabase.js
>>>>>>> Stashed changes
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://tocfyjdjpqwikzhsrupu.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRvY2Z5amRqcHF3aWt6aHNydXB1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDU4NjA5NTYsImV4cCI6MjA2MTQzNjk1Nn0.diGdgSqc2oOMOdeQhkwmBJHltAQ9l1qCHwO1uCA5wcQ'

export const supabase = createClient(supabaseUrl, supabaseKey)
