import React from "react";
import { cn } from "../../lib/utils";
import { Check } from "lucide-react";

export function ProgressStepper({ steps, currentStep }) {
  const currentIndex = steps.findIndex(s => s.id === currentStep);

  return (
    <div className="w-full">
      <div className="hidden sm:flex justify-between items-center w-full relative">
        <div className="absolute top-1/2 left-0 w-full h-1 bg-slate-100 -z-10 -translate-y-1/2 rounded-full"></div>
        <div 
          className="absolute top-1/2 left-0 h-1 bg-indigo-500 -z-10 -translate-y-1/2 rounded-full transition-all duration-500"
          style={{ width: `${(currentIndex / (steps.length - 1)) * 100}%` }}
        ></div>
        
        {steps.map((step, index) => {
          const isCompleted = index < currentIndex;
          const isCurrent = index === currentIndex;
          
          return (
            <div key={step.id} className="flex flex-col items-center gap-2">
              <div 
                className={cn(
                  "w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold border-2 transition-colors bg-white",
                  isCompleted ? "border-indigo-500 text-indigo-500" : 
                  isCurrent ? "border-indigo-600 bg-indigo-600 text-white shadow-md shadow-indigo-200" : 
                  "border-slate-200 text-slate-400"
                )}
              >
                {isCompleted ? <Check className="w-4 h-4" /> : index + 1}
              </div>
              <span className={cn(
                "text-xs font-medium px-2 py-1 rounded-md",
                isCurrent ? "text-indigo-700 bg-indigo-50" : 
                isCompleted ? "text-slate-600" : "text-slate-400"
              )}>
                {step.label}
              </span>
            </div>
          );
        })}
      </div>

      {/* Mobile view */}
      <div className="sm:hidden flex flex-col gap-2">
         <div className="flex justify-between items-center text-sm font-medium">
            <span className="text-indigo-700">{steps[currentIndex]?.label}</span>
            <span className="text-slate-400">Step {currentIndex + 1} of {steps.length}</span>
         </div>
         <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
            <div 
              className="h-full bg-indigo-500 transition-all duration-500 rounded-full"
              style={{ width: `${((currentIndex + 1) / steps.length) * 100}%` }}
            ></div>
         </div>
      </div>
    </div>
  );
}
