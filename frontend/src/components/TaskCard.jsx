import React, { useState } from "react";
import { Card } from "./ui/card";
import { cn } from "@/lib/utils";
import { Button } from "./ui/button";
import { Calendar, CheckCircle2, Circle, SquarePen, Trash2 } from "lucide-react";
import { Input } from "./ui/input";
import { toast } from "sonner";
import api from "@/lib/axios";



const TaskCard = ({ task, index, handleTaskChanged }) => {
const [isEditting, setIsEditting] = useState(false);
const [updateTaskTitle, setUpdateTaskTitle] = useState(task.title || "");
const deleleteTask = async (taskId) => {
  try {
    await api.delete(`/tasks/${taskId}`);
    toast.success("Task deleted successfully!");
    handleTaskChanged();
  } catch (error) {
    toast.error("Failed to delete task. Please try again later.");
    console.error("Error deleting task:", error);
  }
}
const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      updateTask();
  }
}
const updateTask = async () => {
  try {
    setIsEditting(false);
    await api.put(`/tasks/${task._id}`,{title: updateTaskTitle});
    toast.success("Task updated successfully!");
    handleTaskChanged();

  } catch (error) {
    console.error("Error updating task:", error);
    toast.error("Failed to update task. Please try again later.");
  }
}
const toggleTaskComplete = async () => {
  try {
    await api.put(`/tasks/${task._id}`, {
      title: task.title,
      status: task.status === "active" ? "completed" : "active",
      completeAt: task.status === "active" ? new Date() : null,
    });
    handleTaskChanged();
    toast.success(`Task marked as ${task.status === "active" ? "completed" : "active"}!`);
  } catch (error) {
    console.error("Error updating task:", error);
    toast.error("Failed to update task. Please try again later.");
  }
}
  return (
    <Card
      className={cn(
        "p-4 bg-gradient-card border-0 shadow-custom-md hover:shadow-custom-lg transition-all duration-200 animate-fade-in group",
        task.status === "completed" && "opacity-75"
      )}
      style={{ animationDelay: `${index * 50}ms` }}
    >
      <div className="flex items-center gap-4">
        {/* nút tròn */}
        <Button
          variant="ghost"
          size="icon"
          className={cn(
            "shrink-0 size-8 rounded-full transition-all duration-200",
            task.status === "complete"
              ? "text-success hover:text-success/80"
              : "text-muted-foreground hover:text-primary"
          )}
          onClick={toggleTaskComplete}
        >
          {task.status === "complete" ? (
            <CheckCircle2 className="size-5" />
          ) : (
            <Circle className="size-5" />
          )}
        </Button>

        {/* hiển thị hoặc chỉnh sửa tiêu đề */}
        <div className="flex-1 min-w-0">
          {isEditting ? (
            <Input
              placeholder="Cần phải làm gì?"
              className="flex-1 h-12 text-base border-border/50 focus:border-primary/50 focus:ring-primary/20"
              type="text"
              value={updateTaskTitle}
              onChange={(e) => setUpdateTaskTitle(e.target.value)}
              onKeyPress={handleKeyPress}
              onBlur={() => {
                setIsEditting(false)
                setUpdateTaskTitle(task.title || "")
              }}
              
              
            />
          ) : (
            <p
              className={cn(
                "text-base transition-all duration-200",
                task.status === "complete"
                  ? "line-through text-muted-foreground"
                  : "text-foreground"
              )}
            >
              {task.title}
            </p>
          )}

          {/* ngày tạo & ngày hoàn thành */}
          <div className="flex items-center gap-2 mt-1">
            <Calendar className="size-3 text-muted-foreground" />
            <span className="text-xs text-muted-foreground">
              {new Date(task.createdAt).toLocaleString()}
            </span>
            {task.completedAt && (
              <>
                <span className="text-xs text-muted-foreground"> - </span>
                <Calendar className="size-3 text-muted-foreground" />
                <span className="text-xs text-muted-foreground">
                  {new Date(task.completedAt).toLocaleString()}
                </span>
              </>
            )}
          </div>
        </div>

        {/* nút chỉnh và xoá */}
        <div className="hidden gap-2 group-hover:inline-flex animate-slide-up">
          {/* nút edit */}
          <Button
            variant="ghost"
            size="icon"
            className="shrink-0 transition-colors size-8 text-muted-foreground hover:text-info"
            onClick={() => {
              setIsEditting(true);
              setUpdateTaskTitle(task.title || "");
            }
          }
          >
            <SquarePen className="size-4" />
          </Button>

          {/* nút xoá */}
          <Button
            variant="ghost"
            size="icon"
            className="shrink-0 transition-colors size-8 text-muted-foreground hover:text-destructive"
            onClick={() => deleleteTask(task._id)}
         
         >
            <Trash2 className="size-4" />
          </Button>
        </div>
      </div>
    </Card>
  );
};

export default TaskCard;