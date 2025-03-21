import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { motion } from "framer-motion";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Calendar, Trash2, Pencil } from "lucide-react";
import { Task, Column } from "@shared/schema";
import { saveTasks, saveColumns } from "@/lib/storage";

interface KanbanTaskProps {
  task: Task;
  provided: any;
  setTasks: (tasks: Task[]) => void;
  setColumns: (columns: Column[]) => void;
}

export default function KanbanTask({
  task,
  provided,
  setTasks,
  setColumns
}: KanbanTaskProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editedTask, setEditedTask] = useState(task);

  const handleSave = () => {
    setTasks(tasks => {
      const newTasks = tasks.map(t =>
        t.id === task.id ? editedTask : t
      );
      saveTasks(newTasks);
      return newTasks;
    });
    setIsEditing(false);
  };

  const handleDelete = () => {
    setTasks(tasks => {
      const newTasks = tasks.filter(t => t.id !== task.id);
      saveTasks(newTasks);
      return newTasks;
    });

    setColumns(cols => {
      const newCols = cols.map(col => ({
        ...col,
        taskIds: col.taskIds.filter(id => id !== task.id)
      }));
      saveColumns(newCols);
      return newCols;
    });
  };

  const priorityColors = {
    Low: "bg-blue-100 text-blue-800",
    Medium: "bg-yellow-100 text-yellow-800",
    High: "bg-red-100 text-red-800"
  };

  if (isEditing) {
    return (
      <motion.div
        initial={{ scale: 0.95 }}
        animate={{ scale: 1 }}
        transition={{ duration: 0.2 }}
      >
        <Card
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          className="p-4 space-y-2"
        >
          <Input
            value={editedTask.title}
            onChange={e => setEditedTask({ ...editedTask, title: e.target.value })}
            placeholder="Task title"
          />

          <div className="flex gap-2">
            <Select
              value={editedTask.priority}
              onValueChange={value => setEditedTask({ ...editedTask, priority: value as Task["priority"] })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Priority" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Low">Low</SelectItem>
                <SelectItem value="Medium">Medium</SelectItem>
                <SelectItem value="High">High</SelectItem>
              </SelectContent>
            </Select>

            <Input
              type="time"
              value={editedTask.estimatedTime}
              onChange={e => setEditedTask({ ...editedTask, estimatedTime: e.target.value })}
            />
          </div>

          <Input
            type="date"
            value={editedTask.dueDate}
            onChange={e => setEditedTask({ ...editedTask, dueDate: e.target.value })}
          />

          <div className="flex justify-end gap-2">
            <Button variant="outline" size="sm" onClick={() => setIsEditing(false)}>
              Cancel
            </Button>
            <Button size="sm" onClick={handleSave}>
              Save
            </Button>
          </div>
        </Card>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.2 }}
    >
      <Card
        ref={provided.innerRef}
        {...provided.draggableProps}
        {...provided.dragHandleProps}
        className="cursor-move"
      >
        <CardContent className="p-4">
          <div className="flex items-start justify-between">
            <div 
              className="space-y-1 flex-1 cursor-pointer" 
              onClick={() => setIsEditing(true)}
            >
              <h3 className="font-medium">{task.title}</h3>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                {task.dueDate && (
                  <div className="flex items-center gap-1">
                    <Calendar className="h-4 w-4" />
                    {new Date(task.dueDate).toLocaleDateString()}
                  </div>
                )}
                <span>{task.estimatedTime}</span>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className={`px-2 py-1 rounded-full text-xs ${priorityColors[task.priority]}`}>
                {task.priority}
              </span>
              <Button
                variant="ghost"
                size="sm"
                className="h-8 w-8 p-0"
                onClick={() => setIsEditing(true)}
              >
                <Pencil className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="h-8 w-8 p-0"
                onClick={(e) => {
                  e.stopPropagation();
                  handleDelete();
                }}
              >
                <Trash2 className="h-4 w-4 text-red-500" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}