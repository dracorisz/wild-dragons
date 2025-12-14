#!/usr/bin/env python3
"""
Wild Dragons Automation Orchestrator
Integrates automation scripts with unified task management system.
"""

import os
import json
import argparse
import subprocess
import re
import time
from datetime import datetime
from pathlib import Path

class AutomationOrchestrator:
    """
    Orchestrates automation integration with unified task management.
    """

    def __init__(self, base_dir=None):
        """Initialize the orchestrator with project base directory."""
        self.base_dir = Path(base_dir or os.path.dirname(os.path.abspath(__file__)))
        self.task_list_file = self.base_dir / "unified-task-list.md"
        self.crawler_log = self.base_dir / "crawler_execution.log"
        self.orchestrator_log = self.base_dir / "automation_orchestrator.log"

    def log(self, message, level="INFO"):
        """Log a message with timestamp and level."""
        timestamp = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
        log_message = f"[{timestamp}] [{level}] {message}"
        print(log_message)

        with open(self.orchestrator_log, "a", encoding='utf-8') as f:
            f.write(log_message + "\n")

    def parse_task_list(self):
        """Parse the unified-task-list.md file and extract tasks."""
        if not self.task_list_file.exists():
            self.log(f"Task list file not found: {self.task_list_file}", "ERROR")
            return None

        self.log("Parsing unified task list...")

        with open(self.task_list_file, "r", encoding='utf-8') as f:
            content = f.read()

        # Extract phases and tasks
        phases = {}
        current_phase = None

        lines = content.split('\n')
        for i, line in enumerate(lines):
            # Match phase headers (### Phase X: Title)
            phase_match = re.match(r'### Phase (\d+): (.+)', line)
            if phase_match:
                phase_num = int(phase_match.group(1))
                phase_title = phase_match.group(2)
                current_phase = phase_num
                phases[phase_num] = {
                    'title': phase_title,
                    'tasks': {},
                    'status': 'pending'
                }
                continue

            # Match task items (- [ ] `X.Y` Task description)
            if current_phase and line.strip().startswith('- ['):
                task_match = re.match(r'- \[([ x])\] `(\d+(?:\.\d+)?)` (.+)', line)
                if task_match:
                    status = 'completed' if task_match.group(1) == 'x' else 'pending'
                    task_id = task_match.group(2)
                    task_desc = task_match.group(3)

                    phases[current_phase]['tasks'][task_id] = {
                        'description': task_desc,
                        'status': status,
                        'phase': current_phase
                    }

        self.log(f"Parsed {len(phases)} phases with tasks")
        return phases

    def update_task_status(self, task_id, status, phases):
        """Update task status in the unified-task-list.md file."""
        if not self.task_list_file.exists():
            self.log("Task list file not found for update", "ERROR")
            return False

        self.log(f"Updating task {task_id} to status: {status}")

        with open(self.task_list_file, "r", encoding='utf-8') as f:
            content = f.read()

        # Find and update the task line
        lines = content.split('\n')
        updated = False

        for i, line in enumerate(lines):
            task_match = re.match(r'- \[([ x])\] `(' + re.escape(task_id) + r')` (.+)', line)
            if task_match:
                current_status = task_match.group(1)
                new_status = 'x' if status == 'completed' else ' '
                lines[i] = line.replace(f'- [{current_status}]', f'- [{new_status}]')
                updated = True
                break

        if updated:
            with open(self.task_list_file, "w", encoding='utf-8') as f:
                f.write('\n'.join(lines))
            self.log(f"Successfully updated task {task_id}")
            return True
        else:
            self.log(f"Task {task_id} not found for update", "WARNING")
            return False

    def run_crawler_script(self, phase=None, skip_tokentrove=False, skip_pinterest=True, skip_processing=False):
        """Run the execute_crawler.py script and monitor completion."""
        crawler_script = self.base_dir / "execute_crawler.py"

        if not crawler_script.exists():
            self.log(f"Crawler script not found: {crawler_script}", "ERROR")
            return False

        self.log("Starting crawler execution...")

        # Build command arguments
        cmd = ["python", str(crawler_script)]

        if skip_tokentrove:
            cmd.append("--skip-tokentrove")
        if skip_pinterest:
            cmd.append("--skip-pinterest")
        if skip_processing:
            cmd.append("--skip-processing")

        try:
            self.log(f"Executing: {' '.join(cmd)}")

            # Run the process and capture output
            process = subprocess.run(
                cmd,
                cwd=self.base_dir,
                text=True,
                capture_output=True,
                timeout=3600  # 1 hour timeout
            )

            success = process.returncode == 0

            if success:
                self.log("Crawler execution completed successfully")
                # Update relevant tasks based on what was run
                if not skip_tokentrove:
                    self.update_task_status("6.1", "completed", self.parse_task_list())
                if not skip_pinterest:
                    self.update_task_status("6.2", "completed", self.parse_task_list())
                if not skip_processing:
                    self.update_task_status("6.3", "completed", self.parse_task_list())
            else:
                self.log(f"Crawler execution failed with return code: {process.returncode}", "ERROR")
                self.log(f"Error output: {process.stderr}", "ERROR")

            return success

        except subprocess.TimeoutExpired:
            self.log("Crawler execution timed out", "ERROR")
            return False
        except Exception as e:
            self.log(f"Error running crawler: {e}", "ERROR")
            return False

    def generate_progress_report(self):
        """Generate progress report from crawler logs."""
        report_file = self.base_dir / "automation_progress_report.md"

        self.log("Generating progress report...")

        # Read crawler log if it exists
        crawler_log_content = ""
        if self.crawler_log.exists():
            with open(self.crawler_log, "r", encoding='utf-8') as f:
                crawler_log_content = f.read()

        # Parse current task status
        phases = self.parse_task_list()

        # Generate report
        report = f"""# Automation Progress Report
Generated: {datetime.now().strftime("%Y-%m-%d %H:%M:%S")}

## Task Status Summary

"""

        if phases:
            total_tasks = 0
            completed_tasks = 0

            for phase_num, phase_data in phases.items():
                report += f"### Phase {phase_num}: {phase_data['title']}\n\n"

                for task_id, task_data in phase_data['tasks'].items():
                    status_icon = "✅" if task_data['status'] == 'completed' else "⏳"
                    report += f"- {status_icon} `{task_id}` {task_data['description']}\n"

                    total_tasks += 1
                    if task_data['status'] == 'completed':
                        completed_tasks += 1

                report += "\n"

            completion_rate = (completed_tasks / total_tasks * 100) if total_tasks > 0 else 0
            report += f"## Overall Progress\n\n"
            report += f"- **Completed Tasks**: {completed_tasks}/{total_tasks}\n"
            report += f"- **Completion Rate**: {completion_rate:.1f}%\n\n"

        # Add recent crawler activity
        if crawler_log_content:
            report += "## Recent Crawler Activity\n\n"
            # Get last 20 lines of crawler log
            lines = crawler_log_content.strip().split('\n')[-20:]
            report += "```\n" + "\n".join(lines) + "\n```\n\n"

        # Save report
        with open(report_file, "w", encoding='utf-8') as f:
            f.write(report)

        self.log(f"Progress report generated: {report_file}")
        return str(report_file)

    def run_phase(self, phase_num):
        """Run automation for a specific phase."""
        self.log(f"Running automation for Phase {phase_num}")

        phases = self.parse_task_list()
        if not phases or phase_num not in phases:
            self.log(f"Phase {phase_num} not found", "ERROR")
            return False

        phase_data = phases[phase_num]

        if phase_num == 6:  # Automation Integration phase
            # Run crawler script
            success = self.run_crawler_script()
            if success:
                self.log(f"Phase {phase_num} automation completed successfully")
                return True
            else:
                self.log(f"Phase {phase_num} automation failed", "ERROR")
                return False
        else:
            self.log(f"No automation defined for Phase {phase_num}", "WARNING")
            return False

    def run(self, command=None, phase=None, **kwargs):
        """Main orchestrator execution method."""
        self.log("=== Wild Dragons Automation Orchestrator Started ===")

        if command == "run-crawler":
            success = self.run_crawler_script(**kwargs)
        elif command == "run-phase" and phase:
            success = self.run_phase(phase)
        elif command == "generate-report":
            report_file = self.generate_progress_report()
            self.log(f"Report generated: {report_file}")
            success = True
        elif command == "status":
            phases = self.parse_task_list()
            if phases:
                for phase_num, phase_data in phases.items():
                    completed = sum(1 for t in phase_data['tasks'].values() if t['status'] == 'completed')
                    total = len(phase_data['tasks'])
                    self.log(f"Phase {phase_num}: {completed}/{total} tasks completed")
            success = True
        else:
            self.log("No valid command specified", "ERROR")
            success = False

        self.log("=== Automation Orchestrator Completed ===")
        return success

def main():
    """Command-line interface for the automation orchestrator."""
    parser = argparse.ArgumentParser(description='Wild Dragons Automation Orchestrator')
    parser.add_argument('command', choices=['run-crawler', 'run-phase', 'generate-report', 'status'],
                       help='Command to execute')
    parser.add_argument('--phase', type=int, help='Phase number for run-phase command')
    parser.add_argument('--skip-tokentrove', action='store_true', help='Skip TokenTrove crawler')
    parser.add_argument('--skip-pinterest', action='store_true', help='Skip Pinterest scraper')
    parser.add_argument('--skip-processing', action='store_true', help='Skip image processing')

    args = parser.parse_args()

    orchestrator = AutomationOrchestrator()

    # Convert args to kwargs for run method
    kwargs = {
        'skip_tokentrove': args.skip_tokentrove,
        'skip_pinterest': args.skip_pinterest,
        'skip_processing': args.skip_processing
    }

    success = orchestrator.run(command=args.command, phase=args.phase, **kwargs)

    exit(0 if success else 1)

if __name__ == "__main__":
    main()