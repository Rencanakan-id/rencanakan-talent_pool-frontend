import * as React from "react"
import { cn } from "@/lib/utils"
import { Typography } from '../atoms/typography';

interface ImageUploadProps extends Omit<React.HTMLAttributes<HTMLDivElement>, "value" | "onChange"> {
  onImageChange?: (file: File | null) => void
  label?: string
  previewClassName?: string
  defaultImage?: File | null
  maxSize?: number
}

const ImageUpload = React.forwardRef<HTMLInputElement, ImageUploadProps>(
  ({ label, className, previewClassName, onImageChange, defaultImage = null, maxSize = 2 * 1024 * 1024, ...props }) => {
    const [selectedFile, setSelectedFile] = React.useState<File | null>(defaultImage)
    const [preview, setPreview] = React.useState<string | null>(null)
    const fileInputRef = React.useRef<HTMLInputElement>(null)
    
    React.useEffect(() => {
      if (!selectedFile) {
        setPreview(null)
        return
      }
      
      const objectUrl = URL.createObjectURL(selectedFile)
      setPreview(objectUrl)
      
      return () => URL.revokeObjectURL(objectUrl)
    }, [selectedFile])
    
    const handleClick = () => {
      fileInputRef.current?.click()
    }
    
    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0] || null
      
      if (file && file.size > maxSize) {
        alert(`File size exceeds the maximum limit of ${maxSize / (1024 * 1024)}MB.`)
        return
      }
      
      setSelectedFile(file)
      if (onImageChange) {
        onImageChange(file)
      }
    }
    
    return (
      <div className="flex flex-col gap-2">
        {label && <Typography variant={'p5'} className="text-rencanakan-dark-gray font-bold">{label}</Typography>}
        <div
          className={cn(
            "relative flex w-[250px] h-[250px] rounded-md border-2 border-dashed border-rencanakan-gray bg-rencanakan-light-gray cursor-pointer",
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
              <label className="text-rencanakan-dark-gray font-bold">
                <Typography variant={'p5'}>Klik di sini untuk upload</Typography>
              </label>
            </div>
          )}
        </div>
      </div>
    )
  }
)

ImageUpload.displayName = "ImageUpload"

export { ImageUpload }