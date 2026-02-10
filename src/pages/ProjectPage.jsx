import React from "react";
import { useParams } from "react-router-dom";
import projects from "../data/projects";
import ProjectNavigation from "../components/ProjectNavigation";
import ProjectBlocks from "../components/ProjectBlocks";
import ProjectIntroCard from "../components/ProjectIntroCard";





const ProjectPage = () => {
  const { id } = useParams();
  const projectId = parseInt(id, 10);
  const project = projects.find((p) => p.id === projectId);

  if (!project) return <div style={{ color: "#fff", padding: "5rem" }}>Project not found</div>;

  return (
    <div className="project-page">
      <section className="projects" style={{ padding: "10rem 5vw" }}>
        <ProjectNavigation />

        {/* HERO (cover + testo) */}
        <section className="projects" style={{ padding: "10rem 5vw" }}>
  

  <ProjectIntroCard
    title={project.title}
    subtitle={project.subtitle}
    cover={project.cover}
  />

  <ProjectBlocks blocks={project.blocks} />
</section>

        {/* CONTENUTO VARIABILE */}
        <ProjectBlocks blocks={project.blocks} />
      </section>
    </div>
  );
};

export default ProjectPage;
