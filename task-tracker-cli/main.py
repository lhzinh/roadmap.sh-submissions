import sys
import json
import os
from datetime import datetime

file_dir = os.path.join('data', 'tasks.json')
status = {"todo", "in-progress", "done"}


def show_help():
    usage = """
Usage: python main.py [action] [options]

Actions:
  -h, --help                 Show this help message
  add "[description]"        Adding a new task
  list                       Show all tasks
  list [status]              Show tasks by status (todo, in-progress, done)
  update [id] "[new desc]"   Update a task's description
  delete [id]                Delete a task
  mark-in-progress [id]      Mark a task as in progress
  mark-done [id]             Mark a task as done
"""
    print(usage, file=sys.stderr)


def init_file():
    dir_name = os.path.dirname(file_dir)
    if dir_name and not os.path.exists(dir_name):
        os.makedirs(dir_name)
    if not os.path.exists(file_dir):
        with open(file_dir, "w", encoding="utf-8") as file:
            json.dump([], file, ensure_ascii=False, indent=4)


def write_data(data):
    init_file()
    with open(file_dir, "w", encoding="utf-8") as file:
            json.dump(data, file, ensure_ascii=False, indent=4)


def read_data():
    init_file()
    try:
        with open(file_dir, 'r', encoding="utf-8") as file:
            return json.load(file)
    except json.JSONDecodeError:
        return []


def add_task(description):
    data = read_data()
    id = data[-1]['id'] + 1 if data else 1
    new_data = {
        "id": id,
        "description": description,
        "status": "todo",
        "createdAt": datetime.now().strftime("%Y-%m-%d %H:%M:%S"),
        "updatedAt": datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    }
    data.append(new_data)
    write_data(data)
    print(f"Task added successfully (ID: {id})")


def show_tasks(filters):
    data = read_data()
    if not data:
        print("No tasks found.")
        return
    
    if filters in status:
        filtered = [task for task in data if task['status'] == filters]
        print(json.dumps(filtered, indent=4, ensure_ascii=False))
    elif filters is None:
        print(json.dumps(data, indent=4, ensure_ascii=False))
    else:
        print(f"Error: Invalid status 'filters'. Choose from: todo, in-progress, done")


def update_task(id, new_description):
    data = read_data()
    for task in data:
        if task["id"] == id:
            task["description"] = new_description
            task["updatedAt"] = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
            write_data(data)
            print(f"Task {id} updated successfully!")
            return
    print(f"Error: Task with ID {id} not found.")


def change_status(id, new_status):
    data = read_data()
    for task in data:
        if task["id"] == id:
            task["status"] = new_status
            task["updatedAt"] = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
            write_data(data)
            print(f"Task {id} marked as {new_status}!")
            return
    print(f"Error: Task with ID {id} not found.")


def delete_task(id):
    data = read_data()
    updated_data = [task for task in data if task["id"] != id]
    
    if len(data) == len(updated_data):
        print(f"Error: Task with ID {id} not found.")
    else:
        write_data(updated_data)
        print(f"Task {id} deleted successfully!")


def main():
    arguments = sys.argv[1:]

    if "-h" in arguments or "--help" in arguments:
        show_help()
        sys.exit(0)
        
    action = arguments[0]

    if action == "add" and len(arguments) >= 2:
        add_task(arguments[1])
    elif action == "list":
        status_filter = arguments[1] if len(arguments) >= 2 else None
        show_tasks(status_filter)
    elif action == "update" and len(arguments) >= 3:
        try:
            update_task(int(arguments[1]), arguments[2])
        except ValueError:
            print("Error: ID must be an integer.")
    elif action == "delete" and len(arguments) >= 2:
        try:
            delete_task(int(arguments[1]))
        except ValueError:
            print("Error: ID must be an integer.")
    elif action == "mark-in-progress" and len(arguments) >= 2:
        try:
            change_status(int(arguments[1]), "in-progress")
        except ValueError:
            print("Error: ID must be an integer.")
    elif action == "mark-done" and len(arguments) >= 2:
        try:
            change_status(int(arguments[1]), "done")
        except ValueError:
            print("Error: ID must be an integer.")
    else:
        print("Error: Invalid command or missing arguments.")


if '__main__' == __name__:
    main()