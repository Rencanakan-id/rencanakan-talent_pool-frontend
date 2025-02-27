import * as React from "react";
import { cn } from "@/lib/utils";
import { VariantProps, cva } from "class-variance-authority";
import { IoClose } from "react-icons/io5";

const fileInputVariants = cva(
    [
        "w-full rounded-lg border border-solid font-bold relative file:text-white",
        "file:min-h-[2.5rem] file:py-2 file:px-4 file:justify-center file:items-center file:gap-2 file:rounded-l-lg file:rounded-r-none file:border-t-[2px] file:border-b-[2px] file:border-l-[2px] file:border-dashed file:border-[var(--color-rencanakan-base-gray)] file:bg-[var(--color-rencanakan-sea-blue-300)] file:mr-4",
    ],
    {
        variants: {
            state: {
                empty: "border-[var(--color-rencanakan-base-gray)] bg-[var(--color-rencanakan-light-gray)] text-[var(--color-rencanakan-main-black)]",
                filled: "border-[var(--color-rencanakan-base-gray)] text-[#3E884F] bg-[#CEE1D3]",
                error: "border-[var(--color-rencanakan-base-gray)] text-[#942929] bg-[#E1CECE]",
            },
        },
        defaultVariants: {
            state: "empty",
        },
    }
);

interface FileInputProps
    extends Omit<React.ComponentProps<"input">, "type">,
        VariantProps<typeof fileInputVariants> {
    onClear?: () => void;
    textLabel?: string;
}

export const FileInput: React.FC<FileInputProps> = ({ className, state, onClear, textLabel, ...props }) => {
    const [fileState, setFileState] = React.useState<"empty" | "filled" | "error">("empty");
    const inputRef = React.useRef<HTMLInputElement>(null);

    React.useEffect(() => {
        if (state) {
            setFileState(state);
        }
    }, [state]);

    const handleClear = () => {
        if (inputRef.current) {
            inputRef.current.value = '';
        }
        setFileState("empty");
        onClear?.();
    };

    return (
        <div className="relative">
            {textLabel && (
            <div className="mb-3">
                <label className="text-lg text-[var(--color-rencanakan-main-black)] font-bold">{textLabel}</label>
            </div>
            )}
            <input
            ref={inputRef}
            type="file"
            data-slot="input"
            className={cn(fileInputVariants({ state: fileState }), className)}
            onChange={(e) => {
                const files = e.target.files;
                if (files && files.length > 0) {
                const file = files[0];
                if (file.type === "application/pdf" || file.type.startsWith("image/")) {
                    setFileState("filled");
                } else {
                    setFileState("error");
                }
                } else {
                setFileState("empty");
                }
                props.onChange?.(e);
            }}
            {...props}
            />
            {(fileState === "filled" || fileState === "error") && (
            <button
                type="button"
                onClick={handleClear}
                className="absolute right-4 top-[62px] -translate-y-1/2 p-1 hover:bg-black/10 rounded-lg"
            >
                <IoClose size={18} />
            </button>
            )}
        </div>
    );
};