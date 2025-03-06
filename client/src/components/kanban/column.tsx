import { useState } from "react";
import { Draggable } from "react-beautiful-dnd";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, X } from "lucide-react";
import { nanoid } from "nanoid";
import { Task, Column } from "@shared/schema";
import { saveTasks, saveColumns } from "@/lib/storage";
import KanbanTask from "./task";

interface KanbanColumnProps {
  column: Column;
  tasks: Task[];
  provided: any;
  setTasks: (tasks: Task[]) => void;
  setColumns: (columns: Column[]) => void;
}

export default function KanbanColumn({
  column,
  tasks,
  provided,
  setTasks,
  setColumns
}: KanbanColumnProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [title, setTitle] = useState(column.title);

  const handleTitleSave = () => {
    setColumns(cols => {
      const newCols = cols.map(col => 
        col.id === column.id ? { ...col, title } : col
      );
      saveColumns(newCols);
      return newCols;
    });
    setIsEditing(false);
  };

  const addTask = () => {
    const newTask: Task = {
      id: nanoid(),
      title: "New Task",
      priority: "Medium",
      estimatedTime: "1:00",
      completed: false,
      columnId: column.id
    };

    setTasks(tasks => {
      const newTasks = [...tasks, newTask];
      saveTasks(newTasks);
      return newTasks;
    });

    setColumns(cols => {
      const newCols = cols.map(col =>
        col.id === column.id
          ? { ...col, taskIds: [...col.taskIds, newTask.id] }
          : col
      );
      saveColumns(newCols);
      return newCols;
    });
  };

  return (
    <Card className="h-full">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        {isEditing ? (
          <Input
            value={title}
            onChange={e => setTitle(e.target.value)}
            onBlur={handleTitleSave}
            onKeyDown={e => e.key === "Enter" && handleTitleSave()}
            autoFocus
          />
        ) : (
          <CardTitle
            className="cursor-pointer"
            onClick={() => setIsEditing(true)}
          >
            {title}
          </CardTitle>
        )}
        <Button variant="ghost" size="sm" onClick={addTask}>
          <Plus className="h-4 w-4" />
        </Button>
      </CardHeader>

      <CardContent
        {...provided.droppableProps}
        ref={provided.innerRef}
        className="space-y-2"
      >
        {tasks.map((task, index) => (
          <Draggable key={task.id} draggableId={task.id} index={index}>
            {(provided) => (
              <KanbanTask
                task={task}
                provided={provided}
                setTasks={setTasks}
                setColumns={setColumns}
              />
            )}
          </Draggable>
        ))}
        {provided.placeholder}
      </CardContent>
    </Card>
  );
}
