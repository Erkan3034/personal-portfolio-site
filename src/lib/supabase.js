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

// react-snap prerender sırasında üçüncü taraf istekleri engelliyor; Supabase yerine
// build'de scripts/generate-seo.js'in yazdığı aynı-kaynak kopyayı (/data/*.json) okuruz.
const isPrerender = typeof navigator !== 'undefined' && navigator.userAgent === 'ReactSnap';

const readSnapshot = async(name) => {
    try {
        const res = await fetch(`/data/${name}.json`);
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return { data: await res.json(), error: null };
    } catch (error) {
        return { data: null, error };
    }
}

// Database helper functions
export const getProjects = async() => {
    if (isPrerender) return readSnapshot('projects');
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

export const getProjectById = async(id) => {
    if (isPrerender) {
        const { data, error } = await readSnapshot('projects');
        const project = data?.find((p) => p.id === id);
        return project ? { data: project, error: null } : { data: null, error: error || new Error('not found') };
    }
    const { data, error } = await supabase
        .from('projects')
        .select('*')
        .eq('id', id)
        .single()
    return { data, error }
}

export const getBlogById = async (id) => {
    if (isPrerender) {
        const { data, error } = await readSnapshot('blogs');
        const blog = data?.find((b) => b.slug === id || b.id === id);
        return blog ? { data: blog, error: null } : { data: null, error: error || new Error('not found') };
    }
    const isUUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id);
    
    let query = supabase.from('blogs').select('*');
    
    if (isUUID) {
        query = query.or(`id.eq.${id},slug.eq.${id}`);
    } else {
        query = query.eq('slug', id);
    }

    const { data, error } = await query.single();
    return { data, error }
}

export const getBlogs = async() => {
    if (isPrerender) return readSnapshot('blogs');
    const { data, error } = await supabase
        .from('blogs')
        .select('*')
        .order('published_at', { ascending: false })
    return { data, error }
}

// Sıralama istemcide yapılır (src/lib/experience.js → sortExperiences).
export const getExperiences = async() => {
    if (isPrerender) return readSnapshot('experiences');
    const { data, error } = await supabase
        .from('experiences')
        .select('*')
    return { data, error }
}

export const addExperience = async(experienceData) => {
    const { data, error } = await supabase
        .from('experiences')
        .insert([experienceData])
        .select()
    return { data, error }
}

export const updateExperience = async(id, updates) => {
    const { data, error } = await supabase
        .from('experiences')
        .update(updates)
        .eq('id', id)
        .select()
    return { data, error }
}

export const deleteExperience = async(id) => {
    const { error } = await supabase
        .from('experiences')
        .delete()
        .eq('id', id)
    return { error }
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

export const addBlog = async(blogData) => {
    const { data, error } = await supabase
        .from('blogs')
        .insert([blogData])
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

export const deleteBlog = async(id) => {
    const { error } = await supabase
        .from('blogs')
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

export const updateBlog = async(id, updates) => {
    const { data, error } = await supabase
        .from('blogs')
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

export const uploadProjectImage = async(file) => {
    const fileExt = file.name.split('.').pop();
    const fileName = `${Date.now()}.${fileExt}`;
    const { error } = await supabase.storage.from('projects').upload(fileName, file, {
        cacheControl: '3600',
        upsert: false,
    });
    if (error) return { data: null, error };
    const { publicUrl } = supabase.storage.from('projects').getPublicUrl(fileName).data;
    return { data: { publicUrl }, error: null };
};

// Sertifika görseli yükleme
export const uploadCertificateImage = async(file) => {
    const fileExt = file.name.split('.').pop();
    const fileName = `${Date.now()}.${fileExt}`;
    const { error } = await supabase.storage.from('certificates').upload(fileName, file, {
        cacheControl: '3600',
        upsert: false,
    });
    if (error) return { data: null, error };
    const { publicUrl } = supabase.storage.from('certificates').getPublicUrl(fileName).data;
    return { data: { publicUrl }, error: null };
};

export const uploadBlogImage = async(file) => {
    const fileExt = file.name.split('.').pop();
    const fileName = `${Date.now()}.${fileExt}`;
    // 'blogs' adında bir bucket bekleniyor (public olmalı).
    const { error } = await supabase.storage.from('blogs').upload(fileName, file, {
        cacheControl: '3600',
        upsert: false,
    });
    if (error) return { data: null, error };
    const { publicUrl } = supabase.storage.from('blogs').getPublicUrl(fileName).data;
    return { data: { publicUrl }, error: null };
};