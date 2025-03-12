import { Plus, X } from 'lucide-react';
import { useState } from 'react';

export interface AccordionItem {
  header: string;
  content: string;
}

interface AccordionProps {
  items: AccordionItem[];
}

function Accordion({ items }: AccordionProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <div className="w-full">
      {items.map((item, index) => (
        <div key={index} className="bg-muted rounded-lg my-2">
          {/* Header button */}
          <button
            className="p-4 text-primary font-semibold flex justify-between items-center w-full focus:outline-none"
            onClick={() => setOpenIndex(openIndex === index ? null : index)}
          >
            <span>{item.header}</span>
            <span>{openIndex === index ? <X /> : <Plus />}</span>
          </button>
          {/* Content area with smooth transition */}
          <div
            className={`text-gray-700 overflow-hidden transition-all duration-300 ease-in-out ${
              openIndex === index ? 'max-h-[1000px]' : 'max-h-0'
            }`}
          >
            <div
              className={`px-4 pb-4 transition-transform duration-300 ease-in-out ${
                openIndex === index ? 'translate-y-0' : '-translate-y-full'
              }`}
            >
              {item.content}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

export default Accordion;
