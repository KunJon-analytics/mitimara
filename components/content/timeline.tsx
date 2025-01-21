import Image from "next/image";
import Link from "next/link";

import { formatDate } from "@/lib/content/utils";

interface TimelineProps {
  title: string;
  description: string;
  children?: React.ReactNode;
  actions?: React.ReactNode;
}

export function Timeline({
  title,
  description,
  children,
  actions,
}: TimelineProps) {
  return (
    <div className="grid gap-8">
      <div className="grid gap-4 md:grid-cols-5 md:gap-8">
        <div className="md:col-span-1" />
        <div className="flex items-end justify-between gap-3 md:col-span-4">
          <div className="grid gap-4">
            <h1 className="font-cal text-4xl text-foreground">{title}</h1>
            <p className="text-muted-foreground">{description}</p>
          </div>
          <div>{actions}</div>
        </div>
      </div>
      {children}
    </div>
  );
}

interface ArticleProps {
  href: string;
  priority?: boolean;
  publishedAt: Date;
  imageSrc: string;
  title: string;
  children?: React.ReactNode;
}

function Article({
  publishedAt,
  imageSrc,
  priority,
  title,
  children,
  href,
}: ArticleProps) {
  return (
    <article className="grid grid-cols-1 gap-4 md:grid-cols-5 md:gap-6">
      <div className="relative row-span-2">
        <div className="sticky top-20">
          <time className="order-2 font-mono text-muted-foreground text-sm md:order-1 md:col-span-1">
            {formatDate(publishedAt.toDateString())}
          </time>
        </div>
      </div>
      <div className="relative order-1 aspect-video w-full overflow-hidden rounded-md border border-border md:order-2 md:col-span-4">
        <Link href={href}>
          <Image
            src={imageSrc}
            fill={true}
            alt={title}
            placeholder="blur"
            blurDataURL="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg=="
            className="object-cover"
            quality={40}
            priority={priority}
          />
        </Link>
      </div>
      <div className="order-3 grid grid-cols-1 gap-4 md:col-span-4 md:col-start-2">
        <h2 className="font-cal text-2xl text-foreground">{title}</h2>
        {children}
      </div>
    </article>
  );
}

Timeline.Article = Article;
