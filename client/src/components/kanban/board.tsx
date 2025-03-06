import { useState, useEffect } from "react";
import { DragDropContext, Droppable } from "react-beautiful-dnd";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { nanoid } from "nanoid";
import { motion, AnimatePresence } from "framer-motion";
import { Task, Column } from "@shared/schema";
import { getTasks, saveTasks, getColumns, saveColumns } from "@/lib/storage";
import KanbanColumn from "./column";

export default function KanbanBoard() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [columns, setColumns] = useState<Column[]>([]);

  useEffect(() => {
    setTasks(getTasks());
    setColumns(getColumns());

    // Initialize default columns if none exist
    if (getColumns().length === 0) {
      const defaultColumns: Column[] = [
        { id: nanoid(), title: "To Do", taskIds: [] },
        { id: nanoid(), title: "In Progress", taskIds: [] },
        { id: nanoid(), title: "Done", taskIds: [] }
      ];
      setColumns(defaultColumns);
      saveColumns(defaultColumns);
    }
  }, []);

  const onDragEnd = (result: any) => {
    const { destination, source, draggableId } = result;

    if (!destination) return;

    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    ) {
      return;
    }

    const sourceColumn = columns.find(col => col.id === source.droppableId);
    const destColumn = columns.find(col => col.id === destination.droppableId);

    if (!sourceColumn || !destColumn) return;

    const newSourceTaskIds = Array.from(sourceColumn.taskIds);
    newSourceTaskIds.splice(source.index, 1);

    const newDestTaskIds = Array.from(destColumn.taskIds);
    newDestTaskIds.splice(destination.index, 0, draggableId);

    const newColumns = columns.map(col => {
      if (col.id === sourceColumn.id) {
        return { ...col, taskIds: newSourceTaskIds };
      }
      if (col.id === destColumn.id) {
        return { ...col, taskIds: newDestTaskIds };
      }
      return col;
    });

    setColumns(newColumns);
    saveColumns(newColumns);
  };

  const addColumn = () => {
    const newColumn: Column = {
      id: nanoid(),
      title: "New Column",
      taskIds: []
    };
    const newColumns = [...columns, newColumn];
    setColumns(newColumns);
    saveColumns(newColumns);
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <Button onClick={addColumn}>
          <Plus className="h-4 w-4 mr-2" />
          Add Column
        </Button>
      </div>

      <DragDropContext onDragEnd={onDragEnd}>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <AnimatePresence>
            {columns.map(column => (
              <motion.div
                key={column.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.2 }}
              >
                <Droppable droppableId={column.id}>
                  {(provided) => (
                    <KanbanColumn
                      column={column}
                      tasks={tasks.filter(task => column.taskIds.includes(task.id))}
                      provided={provided}
                      setTasks={setTasks}
                      setColumns={setColumns}
                    />
                  )}
                </Droppable>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </DragDropContext>
    </div>
  );
}