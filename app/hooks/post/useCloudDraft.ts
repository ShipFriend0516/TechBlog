import axios from 'axios';
import { useEffect, useRef, useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { CloudDraft } from '@/app/types/Draft';

const useCloudDraft = () => {
  const [cloudDrafts, setCloudDrafts] = useState<CloudDraft[]>([]);
  const [loading, setLoading] = useState(false);
  const [autoSyncEnabled, setAutoSyncEnabled] = useState(false);
  const draftIdRef = useRef<string | null>(null);

  useEffect(() => {
    if (!draftIdRef.current) {
      draftIdRef.current = uuidv4();
    }
  }, []);

  useEffect(() => {
    const savedSetting = localStorage.getItem('cloudDraftAutoSync');
    setAutoSyncEnabled(savedSetting === 'true');
  }, []);

  const fetchCloudDrafts = async () => {
    try {
      setLoading(true);
      const response = await axios.get('/api/drafts');
      if (response.data.success) {
        setCloudDrafts(response.data.drafts);
      }
    } catch (error) {
      console.error('Failed to fetch cloud drafts:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const saveToCloud = async (draftData: {
    title: string;
    subTitle: string;
    content: string;
    tags: string[];
    imageUrls: string[];
    seriesId?: string;
    isPrivate: boolean;
  }) => {
    if (!draftIdRef.current) {
      throw new Error('Draft ID not initialized');
    }

    try {
      const response = await axios.post('/api/drafts', {
        draftId: draftIdRef.current,
        ...draftData,
      });
      return response.data;
    } catch (error) {
      console.error('Failed to save draft to cloud:', error);
      throw error;
    }
  };

  const deleteCloudDraft = async (draftId: string) => {
    try {
      await axios.delete(`/api/drafts?draftId=${draftId}`);
      setCloudDrafts((prev) => prev.filter((d) => d.draftId !== draftId));
    } catch (error) {
      console.error('Failed to delete cloud draft:', error);
      throw error;
    }
  };

  const toggleAutoSync = (enabled: boolean) => {
    setAutoSyncEnabled(enabled);
    localStorage.setItem('cloudDraftAutoSync', enabled.toString());
  };

  const getCurrentDraftId = () => draftIdRef.current;

  return {
    cloudDrafts,
    loading,
    autoSyncEnabled,
    fetchCloudDrafts,
    saveToCloud,
    deleteCloudDraft,
    toggleAutoSync,
    getCurrentDraftId,
  };
};

export default useCloudDraft;
