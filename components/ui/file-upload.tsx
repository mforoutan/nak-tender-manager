"use client"

import * as React from "react"
import { Upload, File, X, RefreshCw } from "lucide-react"
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
  onDelete
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

  const handleReplace = () => {
    if (inputRef.current) {
      inputRef.current.click()
    }
  }

  const handleDelete = () => {
    if (onDelete) {
      onDelete()
    }
    handleRemove()
  }

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

      {!file ? (
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={() => !disabled && inputRef.current?.click()}
          className={cn(
            "bg-gray-50 rounded-lg p-8 text-center cursor-pointer transition-colors",
            isDragging && "bg-primary/5",
            !isDragging && "border-gray-300 hover:border-primary hover:bg-gray-150",
            disabled && "opacity-50 cursor-not-allowed"
          )}
        >
          <div className="flex flex-col items-center justify-center space-y-3">
            <div className="p-3 bg-gray-100 rounded-full">
              <Upload className="h-6 w-6 text-gray-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-700">
                فایل را اینجا بکشید یا کلیک کنید
              </p>
              <p className="text-xs text-gray-500 mt-1">
                حداکثر حجم: {maxSize} مگابایت
              </p>
            </div>
          </div>
        </div>
      ) : (
        <div className="border rounded-lg p-4 bg-gray-50">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3 flex-1 min-w-0">
              <div className="p-2 bg-white rounded border">
                <File className="h-5 w-5 text-primary" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">{file.name}</p>
                <p className="text-xs text-gray-500">
                  {(file.size / 1024).toFixed(2)} کیلوبایت
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              {uploadProgress === 100 ? (
                <>
                  <span className="text-xs text-green-600 font-medium whitespace-nowrap">بارگذاری شده ✓</span>
                  <Button
                    onClick={(e) => {
                      e.stopPropagation()
                      handleReplace()
                    }}
                    variant="outline"
                    size="sm"
                    className="h-8"
                    disabled={disabled}
                    title="جایگزینی فایل"
                  >
                    <RefreshCw className="h-3.5 w-3.5 ml-1" />
                    جایگزینی
                  </Button>
                  <Button
                    onClick={(e) => {
                      e.stopPropagation()
                      handleDelete()
                    }}
                    variant="destructive"
                    size="icon"
                    className="h-8 w-8"
                    disabled={disabled}
                    title="حذف فایل"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </>
              ) : uploadProgress > 0 ? (
                <span className="text-xs text-blue-600">{uploadProgress}%</span>
              ) : (
                <>
                  <Button
                    onClick={(e) => {
                      e.stopPropagation()
                      onUpload?.()
                    }}
                    size="sm"
                    disabled={disabled}
                  >
                    بارگذاری
                  </Button>
                  <Button
                    onClick={(e) => {
                      e.stopPropagation()
                      handleRemove()
                    }}
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8"
                    disabled={disabled}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </>
              )}
            </div>
          </div>
          {uploadProgress > 0 && uploadProgress < 100 && (
            <div className="mt-3">
              <div className="h-1.5 bg-gray-200 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-primary transition-all duration-300"
                  style={{ width: `${uploadProgress}%` }}
                />
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
