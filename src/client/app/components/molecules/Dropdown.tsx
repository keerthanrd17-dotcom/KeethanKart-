"use client";
import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, Loader2, X } from "lucide-react";
import useClickOutside from "@/app/hooks/dom/useClickOutside";

interface DropdownOption {
  label: string;
  value: string;
}

interface DropdownProps {
  label?: string;
  options: DropdownOption[];
  value: string | null;
  onChange: (value: string | null) => void;
  className?: string;
  disabled?: boolean;
  isLoading?: boolean;
}

const Dropdown: React.FC<DropdownProps> = ({
  label,
  options,
  value,
  onChange,
  className,
  disabled,
  isLoading,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [dropdownWidth, setDropdownWidth] = useState<number | null>(null);

  const dropdownRef = useRef<HTMLDivElement | null>(null);
  const buttonRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (buttonRef.current) {
      setDropdownWidth(buttonRef.current.offsetWidth);
    }
  }, [isOpen]);

  useClickOutside(dropdownRef, () => setIsOpen(false));

  const handleSelect = (selectedValue: string) => {
    onChange(selectedValue);
    setIsOpen(false);
  };

  const selectedLabel =
    options.find((opt) => opt.value === value)?.label || label || "Select...";

  return (
    <div className="relative" ref={dropdownRef}>
      <div
        ref={buttonRef}
        className={`flex items-center justify-between px-3.5 py-2.5 
          rounded-xl bg-slate-900/80 backdrop-blur-xl border border-white/10
          transition-all duration-200 cursor-pointer 
          hover:border-amber-500/40 text-slate-200 shadow-md ${className}`}
        onClick={() => setIsOpen((prev) => !prev)}
        aria-disabled={disabled}
      >
        <span className="text-xs sm:text-sm font-semibold text-slate-200 truncate">
          {isLoading ? "Loading..." : selectedLabel}
        </span>

        <div className="flex items-center">
          {isLoading ? (
            <Loader2 size={15} className="animate-spin text-amber-400 ml-2" />
          ) : value ? (
            <X
              size={15}
              className="text-slate-400 hover:text-amber-400 transition-colors duration-200 ml-2"
              onClick={(e) => {
                e.stopPropagation();
                onChange(null);
              }}
            />
          ) : (
            <motion.div
              animate={{ rotate: isOpen ? 180 : 0 }}
              transition={{ duration: 0.2, ease: "easeInOut" }}
            >
              <ChevronDown size={15} className="text-slate-400 ml-2" />
            </motion.div>
          )}
        </div>
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -5 }}
            transition={{ duration: 0.15 }}
            className="absolute mt-1.5 bg-[#0d0d21]/95 backdrop-blur-2xl border border-white/10 rounded-xl shadow-2xl z-30 overflow-hidden"
            style={{ width: dropdownWidth || "auto", minWidth: "160px" }}
          >
            <ul className="max-h-60 overflow-auto py-1 divide-y divide-white/5">
              {options.map((option) => (
                <li
                  key={option.value}
                  className={`px-3.5 py-2.5 text-xs sm:text-sm transition-colors duration-150
                    cursor-pointer hover:bg-white/5 
                    ${
                      value === option.value
                        ? "bg-amber-500/10 text-amber-400 font-bold border-l-2 border-amber-500"
                        : "text-slate-300"
                    }`}
                  onClick={() => handleSelect(option.value)}
                >
                  {option.label}
                </li>
              ))}
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Dropdown;
