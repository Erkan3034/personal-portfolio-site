import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.REACT_APP_SUPABASE_URL
const supabaseAnonKey = process.env.REACT_APP_SUPABASE_ANON_KEY

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Auth helper functions
export const signIn = async(email, password) => {
    const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
    })
    return { data, error }
}

export const signOut = async() => {
    const { error } = await supabase.auth.signOut()
    return { error }
}

export const getCurrentUser = async() => {
    const { data: { user } } = await supabase.auth.getUser()
    return user
}

// Database helper functions
export const getProjects = async() => {
    const { data, error } = await supabase
        .from('projects')
        .select('*')
        .order('created_at', { ascending: false })
    return { data, error }
}

export const getCertificates = async() => {
    const { data, error } = await supabase
        .from('certificates')
        .select('*')
        .order('created_at', { ascending: false })
    return { data, error }
}

export const addProject = async(projectData) => {
    const { data, error } = await supabase
        .from('projects')
        .insert([projectData])
        .select()
    return { data, error }
}

export const addCertificate = async(certificateData) => {
    const { data, error } = await supabase
        .from('certificates')
        .insert([certificateData])
        .select()
    return { data, error }
}

export const deleteProject = async(id) => {
    const { error } = await supabase
        .from('projects')
        .delete()
        .eq('id', id)
    return { error }
}

export const deleteCertificate = async(id) => {
    const { error } = await supabase
        .from('certificates')
        .delete()
        .eq('id', id)
    return { error }
}

export const updateProject = async(id, updates) => {
    const { data, error } = await supabase
        .from('projects')
        .update(updates)
        .eq('id', id)
        .select()
    return { data, error }
}

export const updateCertificate = async(id, updates) => {
    const { data, error } = await supabase
        .from('certificates')
        .update(updates)
        .eq('id', id)
        .select()
    return { data, error }
}

// Contact form submission
export const submitContactForm = async(formData) => {
    const { data, error } = await supabase
        .from('contact_messages')
        .insert([formData])
        .select()
    return { data, error }
}