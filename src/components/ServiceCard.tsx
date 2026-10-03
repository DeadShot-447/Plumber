import { Link } from 'react-router-dom';
import { 
  Flame, 
  Droplets, 
  Search, 
  Sparkles, 
  Thermometer, 
  Wrench, 
  ShieldAlert, 
  CheckCircle, 
  Home, 
  Building2,
  ArrowRight
} from 'lucide-react';
import { PlumbingService } from '../data/business';

interface ServiceCardProps {
  service: PlumbingService;
}

const ICON_MAP: Record<string, React.ElementType> = {
  Flame,
  Droplets,
  Search,
  Sparkles,
  Thermometer,
  Wrench,
  ShieldAlert,
  CheckCircle,
  Home,
  Building2,
};

export default function ServiceCard({ service }: ServiceCardProps) {
  const IconComponent = ICON_MAP[service.iconName] || Wrench;

  return (
    <div className="group relative flex flex-col justify-between bg-white rounded-xl border border-slate-200/90 p-6 sm:p-7 shadow-xs hover:shadow-md hover:border-sky-300 transition-all duration-200">
      <div>
        <div className="w-12 h-12 rounded-lg bg-sky-50 text-sky-700 flex items-center justify-center mb-5 group-hover:bg-sky-600 group-hover:text-white transition-colors duration-200">
          <IconComponent className="w-6 h-6" />
        </div>

        <h3 className="text-xl font-bold text-slate-900 group-hover:text-sky-700 transition-colors">
          {service.title}
        </h3>

        <p className="mt-2.5 text-sm text-slate-600 leading-relaxed">
          {service.shortDescription}
        </p>

        {service.benefits && service.benefits.length > 0 && (
          <ul className="mt-4 space-y-1.5 text-xs text-slate-500 border-t border-slate-100 pt-3">
            {service.benefits.slice(0, 2).map((benefit, i) => (
              <li key={i} className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-sky-500 shrink-0" />
                <span className="truncate">{benefit}</span>
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between">
        <Link
          to={`/services/${service.slug}`}
          className="inline-flex items-center gap-1.5 text-sm font-bold text-sky-700 hover:text-sky-800 transition-colors group-hover:translate-x-0.5 duration-150"
          aria-label={`Learn more about ${service.title}`}
        >
          <span>Learn More</span>
          <ArrowRight className="w-4 h-4" />
        </Link>

        <span className="text-xs text-slate-400 font-medium">
          Sebring, FL
        </span>
      </div>
    </div>
  );
}
