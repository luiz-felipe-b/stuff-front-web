import { Calendar, CheckSquare, File, FileText, Hash, ListChecks, Package, Radio, Tag, Timer, ToggleLeft } from "lucide-react";

export const getAttributeIcon = (type: string) => {
    // All icons: white color, circular stuff-mid background
    const iconProps = { size: 20, className: "text-stuff-white" };
    const bgClass = "flex items-center justify-center w-7 h-7 rounded-full bg-stuff-mid";
    switch (type) {
        case "text":
            return (
                <span className={bgClass}><FileText {...iconProps} /></span>
            );
        case "number":
            return (
                <span className={bgClass}><Hash {...iconProps} /></span>
            );
        case "boolean":
            return (
                <span className={bgClass}><ToggleLeft {...iconProps} /></span>
            );
        case "date":
            return (
                <span className={bgClass}><Calendar {...iconProps} /></span>
            );
        case "metric":
            return (
                <span className={bgClass}><Tag {...iconProps} /></span>
            );
        case "select":
            return (
                <span className={bgClass}><CheckSquare {...iconProps} /></span>
            );
        case "multiselection":
            return (
                <span className={bgClass}><ListChecks {...iconProps} /></span>
            );
        case "timemetric":
            return (
                <span className={bgClass}><Timer {...iconProps} /></span>
            );
        case "file":
            return (
                <span className={bgClass}><File {...iconProps} /></span>
            );
        case "rfid":
            return (
                <span className={bgClass}><Radio {...iconProps} /></span>
            );
        default:
            return (
                <span className={bgClass}><Package {...iconProps} /></span>
            );
    }
};