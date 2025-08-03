import React from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { type ModelType } from "@/lib/api";

interface ModelSelectorProps {
  value: ModelType;
  onValueChange: (value: ModelType) => void;
  disabled?: boolean;
}

const ModelSelector: React.FC<ModelSelectorProps> = ({
  value,
  onValueChange,
  disabled = false,
}) => {
  return (
    <Select value={value} onValueChange={onValueChange} disabled={disabled}>
      <SelectTrigger className="w-[200px]">
        <SelectValue placeholder="Select model" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="MISTRAL">Mistral 7B (Free)</SelectItem>
        <SelectItem value="LLAMA">Llama 3.1 8B (Free)</SelectItem>
        <SelectItem value="GPT_3_5">GPT-3.5 Turbo (Free)</SelectItem>
        <SelectItem value="QWEN_CODER">Qwen 3 Coder (Free)</SelectItem>
        <SelectItem value="QWEN">Qwen 2.5 7B (Free)</SelectItem>
        <SelectItem value="QWEN_32K">Qwen 2.5 32B (Free)</SelectItem>
        <SelectItem value="QWEN_72B">Qwen 2.5 72B (Free)</SelectItem>
      </SelectContent>
    </Select>
  );
};

export default ModelSelector;
