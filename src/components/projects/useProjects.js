import { useEffect, useState } from 'react';
import { collection, getDocs, orderBy, query } from 'firebase/firestore';
import { db } from '../../admin/firebaseconfig';

const useProjects = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    getDocs(query(collection(db, 'projects'), orderBy('createdAt', 'desc')))
      .then((snapshot) => {
        if (cancelled) return;
        setProjects(
          snapshot.docs
            .map((doc) => ({ id: doc.id, ...doc.data() }))
            .filter((project) => project.status === 'published' && project.image)
        );
      })
      .catch((error) => console.error('Error loading projects:', error))
      .finally(() => { if (!cancelled) setLoading(false); });
    return () => { cancelled = true; };
  }, []);

  return { projects, loading };
};

export default useProjects;
