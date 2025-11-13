"use client"

import * as React from "react"
import { Upload, File, X, Download } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"

interface FileUploadProps {
  id: string
  onFileChange: (file: File | null) => void
  accept?: string
  disabled?: boolean
  maxSize?: number
  file?: File | null
  uploadProgress?: number
  onUpload?: () => void
  onDelete?: () => void
  fileId?: number // Add fileId for preview
}

export function FileUpload({
  id,
  onFileChange,
  accept = ".pdf,.jpg,.jpeg,.png",
  disabled = false,
  maxSize = 5,
  file,
  uploadProgress = 0,
  onUpload,
  onDelete,
  fileId
}: FileUploadProps) {
  const [isDragging, setIsDragging] = React.useState(false)
  const inputRef = React.useRef<HTMLInputElement>(null)

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    if (!disabled) {
      setIsDragging(true)
    }
  }

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)

    if (disabled) return

    const droppedFile = e.dataTransfer.files[0]
    if (droppedFile) {
      handleFileSelection(droppedFile)
    }
  }

  const handleFileSelection = (selectedFile: File) => {
    const fileSizeMB = selectedFile.size / (1024 * 1024)
    if (fileSizeMB > maxSize) {
      alert(`حجم فایل نباید بیشتر از ${maxSize} مگابایت باشد`)
      return
    }

    const fileExtension = selectedFile.name.split('.').pop()?.toLowerCase()
    const allowedExtensions = accept.split(',').map(ext => ext.trim().replace('.', ''))

    if (!fileExtension || !allowedExtensions.includes(fileExtension)) {
      alert(`فرمت فایل باید ${accept} باشد`)
      return
    }

    // First update the file state
    onFileChange(selectedFile)
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0]
    if (selectedFile) {
      handleFileSelection(selectedFile)
    }
  }

  const handleRemove = () => {
    onFileChange(null)
    if (inputRef.current) {
      inputRef.current.value = ''
    }
  }

  const handleClick = (e: React.MouseEvent) => {
    if (!disabled && inputRef.current) {
      inputRef.current.click()
    }
  }

  const handleDeleteClick = (e: React.MouseEvent) => {
    e.stopPropagation()
    // Just call the onDelete callback, don't remove the file yet
    // The parent component will handle showing the dialog and actual deletion
    if (onDelete) {
      onDelete()
    }
  }

  const handleDownload = () => {
    if (file) {
      const blob = new Blob([file], { type: file.type });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = file.name;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } else if (fileId) {
      window.open(`/api/files/download/${fileId}`, '_blank');
    }
  };

  return (
    <div className="w-full">
      <input
        ref={inputRef}
        id={id}
        type="file"
        accept={accept}
        onChange={handleInputChange}
        disabled={disabled}
        className="hidden"
      />

      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={handleClick}
        className={cn(
          "bg-[#F6F6F6] rounded-lg p-8 text-center cursor-pointer transition-colors",
          isDragging && "bg-primary/5",
          !isDragging && "border-gray-300 hover:border-primary hover:bg-gray-150",
          disabled && "opacity-50 cursor-not-allowed"
        )}
      >
        <div className="flex flex-col items-center justify-center">
          <div className="mb-4 px-4 py-3 flex gap-2 items-center bg-white text-primary rounded-md">
            <Upload className="size-4" />
            <span className="text-sm">اسناد و مستندات</span>
          </div>
          {file && (
            <div className="mb-6 py-1 px-2 flex items-center gap-x-2 border rounded-md bg-transparent text-green-500">
              <X onClick={(e) => {
                    e.stopPropagation()
                    handleDeleteClick(e)
                  }} className="size-4 text-muted-foreground cursor-pointer hover:text-red-500"  />
              <span onClick={(e) => {handleDownload(); e.stopPropagation()}} className="cursor-pointer">{file.name}</span>
            </div>
          )}
          <div className="font-medium text-muted-foreground text-sm space-y-2">
            <p>
              حداکثر حجم بارگذارى: {maxSize} مگابایت
            </p>
            <p>
              فایل‌های مجاز: {accept.replaceAll('.', '').replaceAll(',', ' ،')}
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
