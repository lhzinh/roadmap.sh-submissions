from pathlib import Path
from crewai import Agent, Crew, Process, Task
from crewai.project import CrewBase, agent, crew, task
from crewai_tools import (
    FileWriterTool,
    FileReadTool,
    DirectoryReadTool,
    SerperDevTool,
    ScrapeWebsiteTool,
)

@CrewBase
class EngineerCrew:
    agents_config = "crew.jsonc"
    tasks_config = "crew.jsonc"

    @agent
    def qa_reviewer(self) -> Agent:
        return Agent(
            config=self.agents_config["agents"]["qa_reviewer"],
            tools=[FileReadTool(), FileWriterTool()],
            verbose=True,
        )

    @crew
    def crew(self) -> Crew:
        return Crew(
            agents=self.agents,
            tasks=self.tasks,
            process=Process.sequential,
            verbose=True,
        )


def kickoff_content_crew(inputs: dict):
    return EngineerCrew().crew().kickoff(inputs=inputs)
