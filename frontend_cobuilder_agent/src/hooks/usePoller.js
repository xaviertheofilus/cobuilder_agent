import { useEffect, useRef } from 'react';
import { useProjectStore } from '../stores/useProjectStore';
import { pollStatus, getMockPreview } from '../services/pollStatus';
import { projectsAPI } from '../services/api';

export function usePoller(projectId) {
  const stopRef = useRef(null);
  const {
    isGenerating,
    setGenerationStatus,
    setGenerationProgress,
    setIsGenerating,
    setPreviewUrl,
    setCodeFiles,
  } = useProjectStore();

  useEffect(() => {
    if (!isGenerating || !projectId) return;

    stopRef.current = pollStatus(
      projectId,
      (status, progress) => {
        setGenerationStatus(status);
        setGenerationProgress(progress);
      },
      async (status, data) => {
        setIsGenerating(false);
        setGenerationStatus(status);
        if (status !== 'completed') return;

        if (data?.previewUrl && data?.files) {
          setPreviewUrl(data.previewUrl);
          setCodeFiles(data.files);
          return;
        }

        try {
          const res = await projectsAPI.preview(projectId);
          setPreviewUrl(res.data?.url || null);
          setCodeFiles(res.data?.files || []);
        } catch {
          const mock = getMockPreview(projectId);
          setPreviewUrl(mock.previewUrl);
          setCodeFiles(mock.files);
        }
      },
      () => {
        setIsGenerating(false);
        setGenerationStatus('failed');
      }
    );

    return () => {
      if (stopRef.current) stopRef.current();
    };
  }, [isGenerating, projectId, setCodeFiles, setGenerationProgress, setGenerationStatus, setIsGenerating, setPreviewUrl]);
}

