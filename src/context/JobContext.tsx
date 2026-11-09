import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import { JobVacancy, AutomatedSourceFeed, AngolanProvince, JobCategory } from '../types';
import { StorageService } from '../utils/storage';
import { FRESH_COLLECTED_OPPORTUNITIES } from '../data/automatedFeeds';

interface SyncResult {
  addedCount: number;
  expiredCount: number;
  totalActive: number;
  message: string;
}

interface JobContextType {
  jobs: JobVacancy[];
  feeds: AutomatedSourceFeed[];
  isSyncing: boolean;
  selectedProvinces: AngolanProvince[];
  setSelectedProvinces: React.Dispatch<React.SetStateAction<AngolanProvince[]>>;
  selectedMunicipality: string;
  setSelectedMunicipality: React.Dispatch<React.SetStateAction<string>>;
  selectedCategory: string;
  setSelectedCategory: React.Dispatch<React.SetStateAction<string>>;
  selectedSector: string;
  setSelectedSector: React.Dispatch<React.SetStateAction<string>>;
  searchQuery: string;
  setSearchQuery: React.Dispatch<React.SetStateAction<string>>;
  syncFeeds: () => Promise<SyncResult>;
  addJob: (job: Omit<JobVacancy, 'id' | 'publishedAt' | 'isExpired'>) => { success: boolean; message: string };
  updateJob: (id: string, job: Partial<JobVacancy>) => { success: boolean; message: string };
  deleteJob: (id: string) => { success: boolean; message: string };
  filteredJobs: JobVacancy[];
  featuredJobs: JobVacancy[];
  recentJobs: JobVacancy[];
  resetFilters: () => void;
}

const JobContext = createContext<JobContextType | undefined>(undefined);

export const JobProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [jobs, setJobs] = useState<JobVacancy[]>([]);
  const [feeds, setFeeds] = useState<AutomatedSourceFeed[]>([]);
  const [isSyncing, setIsSyncing] = useState<boolean>(false);

  // Filters
  const [selectedProvinces, setSelectedProvinces] = useState<AngolanProvince[]>([]);
  const [selectedMunicipality, setSelectedMunicipality] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [selectedSector, setSelectedSector] = useState<string>('');
  const [searchQuery, setSearchQuery] = useState<string>('');

  useEffect(() => {
    const loadedJobs = StorageService.getJobs();
    const loadedFeeds = StorageService.getFeeds();

    // Check expiration on boot
    const today = new Date().toISOString().substring(0, 10);
    const checkedJobs = loadedJobs.map((job) => {
      const isPast = job.deadline < today;
      return { ...job, isExpired: isPast };
    });

    setJobs(checkedJobs);
    setFeeds(loadedFeeds);
    StorageService.saveJobs(checkedJobs);
  }, []);

  // Automatic Harvesting & Deduplication Engine
  const syncFeeds = async (): Promise<SyncResult> => {
    setIsSyncing(true);

    // Realistic processing delay for network fetch simulation from official Angolan recruitment APIs
    await new Promise((resolve) => setTimeout(resolve, 1400));

    const today = new Date().toISOString().substring(0, 10);
    const nowTime = new Date().toISOString().replace('T', ' ').substring(0, 16);

    let expiredCount = 0;
    const existingSignatures = new Set(
      jobs.map((j) => `${j.company.toLowerCase().trim()}__${j.title.toLowerCase().trim()}__${j.province}`)
    );

    // Update expiration
    let updatedJobs = jobs.map((j) => {
      if (j.deadline < today && !j.isExpired) {
        expiredCount++;
        return { ...j, isExpired: true };
      }
      return j;
    });

    // Check newly available feed items and avoid duplicates
    let addedCount = 0;
    const newItemsToAdd: JobVacancy[] = [];

    FRESH_COLLECTED_OPPORTUNITIES.forEach((freshJob) => {
      const sig = `${freshJob.company.toLowerCase().trim()}__${freshJob.title.toLowerCase().trim()}__${freshJob.province}`;
      if (!existingSignatures.has(sig)) {
        existingSignatures.add(sig);
        newItemsToAdd.push(freshJob);
        addedCount++;
      }
    });

    updatedJobs = [...newItemsToAdd, ...updatedJobs];
    setJobs(updatedJobs);
    StorageService.saveJobs(updatedJobs);

    // Update feeds lastSyncAt & status
    const updatedFeeds = feeds.map((f) => ({
      ...f,
      lastSyncAt: nowTime,
      status: 'SINCRONIZADO' as const,
      jobsCount: f.jobsCount + (addedCount > 0 ? 1 : 0),
    }));
    setFeeds(updatedFeeds);
    StorageService.saveFeeds(updatedFeeds);

    setIsSyncing(false);

    const activeCount = updatedJobs.filter((j) => !j.isExpired).length;
    return {
      addedCount,
      expiredCount,
      totalActive: activeCount,
      message: `Sincronização concluída com sucesso! ${addedCount} novas oportunidades verificadas incorporadas. ${expiredCount} anúncios marcados como expirados. Total de ${activeCount} vagas activas em Angola.`,
    };
  };

  const addJob = (jobData: Omit<JobVacancy, 'id' | 'publishedAt' | 'isExpired'>): { success: boolean; message: string } => {
    // Check duplicate
    const sig = `${jobData.company.toLowerCase().trim()}__${jobData.title.toLowerCase().trim()}__${jobData.province}`;
    const exists = jobs.some(
      (j) => `${j.company.toLowerCase().trim()}__${j.title.toLowerCase().trim()}__${j.province}` === sig
    );

    if (exists) {
      return { success: false, message: 'Já existe uma vaga cadastrada com este cargo e empresa nesta província.' };
    }

    const today = new Date().toISOString().substring(0, 10);
    const newJob: JobVacancy = {
      ...jobData,
      id: `vaga-manual-${Date.now()}`,
      publishedAt: today,
      isExpired: jobData.deadline < today,
      isAutoCollected: false,
    };

    const updated = [newJob, ...jobs];
    setJobs(updated);
    StorageService.saveJobs(updated);

    return { success: true, message: 'Vaga publicada com sucesso na plataforma nacional!' };
  };

  const updateJob = (id: string, updates: Partial<JobVacancy>): { success: boolean; message: string } => {
    const updated = jobs.map((j) => (j.id === id ? { ...j, ...updates } : j));
    setJobs(updated);
    StorageService.saveJobs(updated);
    return { success: true, message: 'Vaga actualizada com sucesso.' };
  };

  const deleteJob = (id: string): { success: boolean; message: string } => {
    const updated = jobs.filter((j) => j.id !== id);
    setJobs(updated);
    StorageService.saveJobs(updated);
    return { success: true, message: 'Vaga removida da plataforma.' };
  };

  const resetFilters = () => {
    setSelectedProvinces([]);
    setSelectedMunicipality('');
    setSelectedCategory('');
    setSelectedSector('');
    setSearchQuery('');
  };

  // Filtered Jobs memo
  const filteredJobs = useMemo(() => {
    return jobs.filter((job) => {
      // Province filter (if selectedProvinces has items, match any)
      if (selectedProvinces.length > 0 && !selectedProvinces.includes(job.province)) {
        return false;
      }

      // Municipality filter
      if (selectedMunicipality && job.municipality.toLowerCase() !== selectedMunicipality.toLowerCase()) {
        return false;
      }

      // Category filter
      if (selectedCategory && job.category !== selectedCategory) {
        return false;
      }

      // Sector filter
      if (selectedSector && job.sector !== selectedSector) {
        return false;
      }

      // Keyword search
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase().trim();
        const matchTitle = job.title.toLowerCase().includes(query);
        const matchCompany = job.company.toLowerCase().includes(query);
        const matchDesc = job.description.toLowerCase().includes(query);
        const matchProvince = job.province.toLowerCase().includes(query);
        const matchMuni = job.municipality.toLowerCase().includes(query);
        const matchCat = job.category.toLowerCase().includes(query);
        const matchReq = job.requirements.some((r) => r.toLowerCase().includes(query));

        if (!matchTitle && !matchCompany && !matchDesc && !matchProvince && !matchMuni && !matchCat && !matchReq) {
          return false;
        }
      }

      return true;
    });
  }, [jobs, selectedProvinces, selectedMunicipality, selectedCategory, selectedSector, searchQuery]);

  const featuredJobs = useMemo(() => {
    return jobs.filter((j) => j.isFeatured && !j.isExpired);
  }, [jobs]);

  const recentJobs = useMemo(() => {
    return jobs.filter((j) => !j.isExpired).slice(0, 6);
  }, [jobs]);

  return (
    <JobContext.Provider
      value={{
        jobs,
        feeds,
        isSyncing,
        selectedProvinces,
        setSelectedProvinces,
        selectedMunicipality,
        setSelectedMunicipality,
        selectedCategory,
        setSelectedCategory,
        selectedSector,
        setSelectedSector,
        searchQuery,
        setSearchQuery,
        syncFeeds,
        addJob,
        updateJob,
        deleteJob,
        filteredJobs,
        featuredJobs,
        recentJobs,
        resetFilters,
      }}
    >
      {children}
    </JobContext.Provider>
  );
};

export const useJobs = () => {
  const context = useContext(JobContext);
  if (!context) {
    throw new Error('useJobs must be used within a JobProvider');
  }
  return context;
};
