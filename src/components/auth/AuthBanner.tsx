import { ShieldCheck, LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface Feature {
  icon: LucideIcon;
  title: string;
  desc: string;
}

interface Testimonial {
  quote: string;
  author: string;
  role: string;
  stars: number;
}

interface AuthBannerProps {
  title: React.ReactNode;
  description: string;
  features?: Feature[];
  testimonial?: Testimonial;
  className?: string;
  order?: "first" | "last";
}

export function AuthBanner({
  title,
  description,
  features,
  testimonial,
  className,
  order = "first",
}: AuthBannerProps) {
  return (
    <div
      className={cn(
        "hidden lg:flex lg:w-1/2 relative bg-gradient-to-br from-primary/5 via-background to-purple-500/5 items-center justify-center p-12 overflow-hidden",
        order === "last" ? "order-last" : "",
        className
      )}
    >
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0">
        <div className="absolute -top-24 -left-24 w-96 h-96 bg-primary/10 rounded-full blur-[100px] animate-pulse" />
        <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-purple-500/10 rounded-full blur-[100px] animate-pulse delay-1000" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-gradient-to-r from-primary/5 to-purple-500/5 rounded-full blur-[120px]" />
      </div>

      <div className="relative z-10 max-w-lg w-full">
        <div className="mb-12 flex items-center gap-4">
          <div className="w-16 h-16 rounded-3xl bg-gradient-to-r from-primary to-purple-500 flex items-center justify-center shadow-2xl shadow-primary/30">
            <ShieldCheck className="w-8 h-8 text-primary-foreground" />
          </div>
          <div className="flex flex-col -space-y-1">
            <span className="text-3xl font-black tracking-tight text-foreground">
              Shop
            </span>
            <span className="text-[10px] font-bold tracking-[0.2em] text-primary uppercase">
              Premium Store
            </span>
          </div>
        </div>

        <div className="space-y-10">
          <h2 className="text-6xl font-black tracking-tighter leading-[0.9] uppercase">
            {title}
          </h2>
          <p className="text-xl text-muted-foreground font-medium leading-relaxed max-w-md">
            {description}
          </p>

          {features && (
            <div className="grid grid-cols-1 gap-4 pt-6">
              {features.map((feature, idx) => (
                <div
                  key={idx}
                  className="flex items-center gap-5 p-5 rounded-2xl bg-card/60 border border-border/40 backdrop-blur-sm shadow-lg group hover:border-primary/20 hover:bg-card/80 transition-all duration-300"
                >
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-r from-primary/10 to-purple-500/10 flex items-center justify-center group-hover:scale-110 transition-transform">
                    <feature.icon className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <h4 className="font-bold text-sm text-foreground mb-0.5">{feature.title}</h4>
                    <p className="text-xs text-muted-foreground">
                      {feature.desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}

          {testimonial && (
            <div className="pt-8 border-t border-border/50">
              <div className="flex items-center gap-2 mb-4">
                {[...Array(testimonial.stars)].map((_, s) => (
                  <svg
                    key={s}
                    className="w-4 h-4 fill-yellow-500 text-yellow-500"
                    viewBox="0 0 20 20"
                  >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>
              <blockquote className="text-base font-medium text-foreground/80 leading-relaxed">
                &ldquo;{testimonial.quote}&rdquo;
              </blockquote>
              <div className="mt-4 flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-r from-primary to-purple-500 flex items-center justify-center text-white font-bold text-sm">
                  {testimonial.author.charAt(0)}
                </div>
                <div>
                  <p className="font-bold text-sm">{testimonial.author}</p>
                  <p className="text-xs text-muted-foreground">
                    {testimonial.role}
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
