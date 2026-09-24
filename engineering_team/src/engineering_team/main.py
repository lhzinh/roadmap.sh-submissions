from pydantic import BaseModel
from crewai.flow import Flow, listen, start
from engineering_team.crews.engineer_crew.engineer_crew import kickoff_content_crew


class EngineerFlowState(BaseModel):
    project_requirement: str = ""
    report: str = ""


class EngineerAiFlow(Flow[EngineerFlowState]):
    @start()
    def prepare_topic(self, crewai_trigger_payload: dict | None = None):
        if crewai_trigger_payload:
            self.state.project_requirement = crewai_trigger_payload.get(
                "project_requirement",
                crewai_trigger_payload.get(
                    "topic",
                    "Build a Fullstack E-commerce Application with FastAPI and React",
                ),
            )
        else:
            self.state.project_requirement = (
                "Build a Fullstack E-commerce Application with FastAPI and React"
            )
        print(f"\n🚀 Project Requirement: {self.state.project_requirement}\n")

    @listen(prepare_topic)
    def run_research(self):
        print(
            "⚙️ Executing Engineer Crew (Architect -> Backend/Frontend -> QA/Security -> DevOps -> Tech Writer)..."
        )
        result = kickoff_content_crew(
            inputs={"project_requirement": self.state.project_requirement}
        )
        self.state.report = result.raw
        print("✅ Engineer Crew finished execution successfully.")

    @listen(run_research)
    def summarize(self):
        print("Report path: output/report.md")


def kickoff():
    EngineerAiFlow().kickoff()


def plot():
    EngineerAiFlow().plot()


if __name__ == "__main__":
    kickoff()
