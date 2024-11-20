'use client';

import React, { useEffect, useState } from 'react';
import CardDashboard from "@/ui/organisms/common/CardDashboard";
import { ProjectsService } from "@/app/infrastructure/services/projectService";
import { Calendar, FolderOpen, SignalMedium, Users } from "lucide-react";

const projectsService = new ProjectsService();

const DashboardCards: React.FC = () => {
  const [totalProjects, setTotalProjects] = useState<number>(0);
  const [activeProjects, setActiveProjects] = useState<number>(0);
  const [nextProjectDate, setNextProjectDate] = useState<string>("No disponible");
  const [organizersCount, setOrganizersCount] = useState<number>(0);

  useEffect(() => {
    const fetchAllProjects = async () => {
      let allData: any[] = [];
      let currentPage = 1;
      let totalPages = 1;

      try {
        while (currentPage <= totalPages) {
          const response = await fetch(`/api/projects?page=${currentPage}`);
          const { data, metadata } = await response.json();

          allData = [...allData, ...data];
          totalPages = metadata.totalPages;
          currentPage++;
        }

        setTotalProjects(allData.length);
        setActiveProjects(allData.filter(project => project.isActive).length);

        const upcomingProject = allData
          .filter(project => new Date(project.startDate) > new Date())
          .sort((a, b) => new Date(a.startDate).getTime() - new Date(b.startDate).getTime())[0];

        setNextProjectDate(
          upcomingProject ? new Date(upcomingProject.startDate).toLocaleDateString() : "No disponible"
        );

        const uniqueOrganizers = new Set(allData.map(project => project.organizer?.name)).size;
        setOrganizersCount(uniqueOrganizers);
      } catch (error) {
        console.error("Error fetching all project data:", error);
      }
    };

    fetchAllProjects();
  }, []);

  return (
    <div className="grid grid-cols-4 pt-6 pr-6 pl-6 gap-5">
      <CardDashboard title="Total Proyectos" icon={<FolderOpen size={20} />} number={totalProjects} />
      <CardDashboard title="Proyectos Activos" icon={<SignalMedium size={20}  />} number={activeProjects} />
      <CardDashboard title="Organizadores" icon={<Users size={20}  />} number={organizersCount} />
      <CardDashboard title="Próximo Proyecto" icon={<Calendar size={20} />} number={nextProjectDate} />
    </div>
  );
};

export default DashboardCards;
