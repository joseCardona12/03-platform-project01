import DashboardTopNavBar from "@/ui/organisms/common/DashboardTopNavBar";
import DashboardCards from "@/ui/organisms/common/DashboardCards"; // Importa tu componente de tarjetas
import TableDashboardClient from "@/ui/organisms/common/TableDashboard";
import { ProjectsService } from "@/app/infrastructure/services/projectService";
import React from "react";

const projectsService = new ProjectsService();

export default async function page() {
  const { data, metadata } = await projectsService.findAll({page:1,size:6});

  return (
    <>
      <div className="w-full bg-gray-300">
        <DashboardTopNavBar />
        <DashboardCards />
        <div className="p-6 max-h-min">
          <TableDashboardClient initialData={data} initialMetadata={metadata} />
        </div>
      </div>
    </>
  );
}
