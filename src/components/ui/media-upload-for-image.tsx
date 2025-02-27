import * as React from "react"
import { cn } from "@/lib/utils"

interface ImageUploadProps extends Omit<React.InputHTMLAttributes<HTMLDivElement>, "value" | "onChange"> {
  value?: File | null
  onChange?: (file: File | null) => void
  previewClassName?: string
}

const ImageUpload = React.forwardRef<HTMLInputElement, ImageUploadProps>(
  ({ className, previewClassName, value, onChange, ...props }, ref) => {
    const [preview, setPreview] = React.useState<string | null>(null)
    const fileInputRef = React.useRef<HTMLInputElement>(null)
    
    // Create preview when file changes
    React.useEffect(() => {
      if (!value) {
        setPreview(null)
        return
      }
      
      const objectUrl = URL.createObjectURL(value)
      setPreview(objectUrl)
      
      // Free memory when component unmounts
      return () => URL.revokeObjectURL(objectUrl)
    }, [value])
    
    const handleClick = () => {
      fileInputRef.current?.click()
    }
    
    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0] || null
      if (onChange) {
        onChange(file)
      }
    }
    
    return (
      <div
        className={cn(
          "flex w-250 h-250 rounded-md border-2 border-dashed border-gray-300 bg-gray-100 cursor-pointer",
          "flex-col justify-center items-center gap-4",
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
          <div className={cn("flex items-center justify-center w-full h-full p-4", previewClassName)}>
            <img 
              src={preview} 
              alt="Preview" 
              className="max-w-full max-h-full object-contain rounded" 
            />
          </div>
        ) : (
          <>
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 5V19M5 12H19" stroke="#666666" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            <p className="text-sm text-gray-500 m-0">
              Klik di sini untuk upload
            </p>
          </>
        )}
      </div>
    )
  }
)

ImageUpload.displayName = "ImageUpload"

export { ImageUpload };