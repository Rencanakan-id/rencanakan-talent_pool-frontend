import * as React from "react"
import { cn } from "@/lib/utils"

interface ImageUploadProps extends Omit<React.HTMLAttributes<HTMLDivElement>, "value" | "onChange"> {
  onImageChange?: (file: File | null) => void
  previewClassName?: string
  defaultImage?: File | null
}

const ImageUpload = React.forwardRef<HTMLInputElement, ImageUploadProps>(
  ({ className, previewClassName, onImageChange, defaultImage = null, ...props }, ref) => {
    // Internal state to manage the selected file
    const [selectedFile, setSelectedFile] = React.useState<File | null>(defaultImage)
    const [preview, setPreview] = React.useState<string | null>(null)
    const fileInputRef = React.useRef<HTMLInputElement>(null)
    
    // Create preview when file changes
    React.useEffect(() => {
      if (!selectedFile) {
        setPreview(null)
        return
      }
      
      const objectUrl = URL.createObjectURL(selectedFile)
      setPreview(objectUrl)
      
      // Free memory when component unmounts
      return () => URL.revokeObjectURL(objectUrl)
    }, [selectedFile])
    
    const handleClick = () => {
      fileInputRef.current?.click()
    }
    
    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0] || null
      
      setSelectedFile(file)
      if (onImageChange) {
        onImageChange(file)
      }
    }
    
    return (
      <div
        className={cn(
          "relative flex w-[250px] h-[250px] rounded-md border-2 border-dashed border-gray-300 bg-gray-100 cursor-pointer",
          "flex-col justify-center items-center gap-4 overflow-hidden",
          className
        )}
        onClick={handleClick}
        {...props}
      >
        <input
          type="file"
          accept="image/*"
          className="hidden"
          ref={fileInputRef}
          onChange={handleFileChange}
        />
        
        {preview ? (
          <div className={cn("absolute inset-0", previewClassName)}>
            <img 
              src={preview} 
              alt="Preview" 
              className="w-full h-full object-cover" 
            />
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center h-full w-full">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 5V19M5 12H19" stroke="#666666" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            <p className="text-sm text-gray-500 m-0">
              Click here to upload
            </p>
          </div>
        )}
      </div>
    )
  }
)

ImageUpload.displayName = "ImageUpload"

export { ImageUpload }