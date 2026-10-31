import { useEffect, useState } from 'react';
import { getExperiences } from '../lib/supabase';
import { sortExperiences } from '../lib/experience';
import { FALLBACK_EXPERIENCES } from '../data/experiences';

// Deneyimleri kronolojik sırayla döndürür. Tablo yoksa veya boşsa yedek veriyi kullanır.
// İlk yüklemede `null` döner (yükleniyor).
const useExperiences = () => {
  const [rows, setRows] = useState(null);

  useEffect(() => {
    let cancelled = false;
    getExperiences()
      .then(({ data, error }) => {
        if (cancelled) return;
        setRows(sortExperiences(!error && data?.length ? data : FALLBACK_EXPERIENCES));
      })
      .catch(() => { if (!cancelled) setRows(sortExperiences(FALLBACK_EXPERIENCES)); });
    return () => { cancelled = true; };
  }, []);

  return rows;
};

export default useExperiences;
