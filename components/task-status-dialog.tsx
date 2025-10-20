"use client"

import { useState, useEffect, useCallback } from "react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { CheckCircle2, XCircle, Clock, Loader2, AlertCircle } from "lucide-react"
import { Spinner } from "@/components/ui/spinner"

interface TaskStatusDialogProps {
  contractorId: number;
  onStatusChange?: (status: string | null) => void;
}

export function TaskStatusDialog({ 
  contractorId, 
  onStatusChange
}: TaskStatusDialogProps) {
  const [open, setOpen] = useState(false);
  const [task, setTask] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  
  const fetchTaskStatus = useCallback(async () => {
    setLoading(true);
    try {
      const response = await fetch(`/api/tasks/status?contractorId=${contractorId}&t=${Date.now()}`);
      
      if (response.ok) {
        const data = await response.json();
        
        if (data.task) {
          setTask(data.task);
          
          // Call the status change handler if status changed
          if (onStatusChange) {
            onStatusChange(data.task.status);
          }
        } else {
          setTask(null);
          if (onStatusChange) {
            onStatusChange(null);
          }
        }
      }
    } catch (error) {
      console.error("Error checking task status:", error);
    } finally {
      setLoading(false);
    }
  }, [contractorId, onStatusChange]);
  
  useEffect(() => {
    if (open) {
      fetchTaskStatus();
    }
  }, [open, fetchTaskStatus]);
  
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">مشاهده وضعیت درخواست</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-center gap-2">
            فعال کردن حساب کاربری
          </DialogTitle>
        </DialogHeader>
        
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <Spinner className="h-8 w-8" />
          </div>
        ) : !task ? (
          <div className="py-12 text-center">
            <AlertCircle className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
            <p className="text-sm text-muted-foreground">
              هیچ درخواستی ثبت نشده است
            </p>
          </div>
        ) : (
          <div className="flex justify-center py-8">
            {task.status === 'COMPLETED' ? (
              <div className="text-center">
                <CheckCircle2 className="h-20 w-20 text-green-500 mx-auto mb-4" />
                <p className="text-lg font-medium text-green-700">
                  درخواست شما با موفقیت تایید شد
                </p>
              </div>
            ) : task.status === 'REJECTED' ? (
              <div className="text-center">
                <XCircle className="h-20 w-20 text-red-500 mx-auto mb-4" />
                <p className="text-lg font-medium text-red-700">
                  درخواست شما رد شد
                </p>
              </div>
            ) : task.status === 'IN_PROGRESS' ? (
              <div className="text-center">
                <Loader2 className="h-20 w-20 text-blue-500 mx-auto mb-4 animate-spin" />
                <p className="text-lg font-medium text-blue-700">
                  در حال بررسی
                </p>
              </div>
            ) : (
              <div className="text-center">
                <Clock className="h-20 w-20 text-yellow-500 mx-auto mb-4" />
                <p className="text-lg font-medium text-yellow-700">
                  در انتظار بررسی
                </p>
              </div>
            )}
          </div>
        )}
        
        <DialogFooter className="mt-4">

          <Button className="bg-primary text-white flex-1" variant="default" onClick={() => setOpen(false)}>
            بستن
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}