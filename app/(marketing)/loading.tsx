import { Leaf, TreePine, Settings } from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header Skeleton */}
      <header className="border-b border-border">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                <TreePine className="w-5 h-5 text-primary animate-pulse-gentle" />
              </div>
              <Skeleton className="w-20 h-6" />
            </div>

            <nav className="hidden md:flex items-center space-x-8">
              <Skeleton className="w-16 h-4" />
              <Skeleton className="w-12 h-4" />
              <Skeleton className="w-8 h-4" />
              <Skeleton className="w-10 h-4" />
            </nav>

            <Skeleton className="w-24 h-9 bg-primary/20" />
          </div>
        </div>
      </header>

      {/* Notification Banner Skeleton */}
      <div className="bg-accent border-b border-accent-foreground/10">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center justify-center">
            <div className="w-4 h-4 bg-primary/30 rounded-full animate-pulse-gentle mr-2" />
            <Skeleton className="w-96 h-4 bg-primary/20" />
          </div>
        </div>
      </div>

      {/* Hero Section Skeleton */}
      <main className="container mx-auto px-4 py-16">
        <div className="text-center">
          {/* Animated Tree Icon */}
          <div className="flex justify-center mb-8">
            <div className="relative">
              <TreePine className="w-16 h-16 text-primary animate-bounce-gentle" />
              <div className="absolute -top-2 -right-2">
                <Leaf className="w-6 h-6 text-primary/70 animate-pulse-gentle" />
              </div>
              <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2">
                <div className="w-8 h-2 bg-primary/20 rounded-full blur-sm" />
              </div>
            </div>
          </div>

          {/* Main Heading Skeleton */}
          <div className="space-y-4 mb-6">
            <Skeleton className="w-80 h-12 mx-auto" />
            <Skeleton className="w-64 h-12 mx-auto" />
            <Skeleton className="w-48 h-12 mx-auto" />
          </div>

          {/* Subtitle Skeleton */}
          <div className="space-y-2 mb-8">
            <Skeleton className="w-96 h-5 mx-auto" />
            <Skeleton className="w-80 h-5 mx-auto" />
          </div>

          {/* CTA Buttons Skeleton */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Skeleton className="w-32 h-12 bg-primary/20" />
            <Skeleton className="w-32 h-12" />
          </div>
        </div>

        {/* How It Works Section Skeleton */}
        <div className="mt-24">
          <div className="text-center mb-12">
            <div className="w-12 h-12 bg-muted rounded-full mx-auto mb-4 flex items-center justify-center">
              <Settings
                className="w-6 h-6 text-muted-foreground animate-spin"
                style={{ animationDuration: "3s" }}
              />
            </div>
            <Skeleton className="w-48 h-8 mx-auto mb-4" />
            <div className="space-y-2">
              <Skeleton className="w-80 h-5 mx-auto" />
              <Skeleton className="w-64 h-5 mx-auto" />
            </div>
          </div>

          {/* Steps Cards Skeleton */}
          <div className="grid md:grid-cols-3 gap-8">
            {[1, 2, 3].map((step) => (
              <Card key={step} className="border-border/50">
                <CardContent className="p-6 text-center">
                  <div className="w-12 h-12 bg-primary/10 rounded-full mx-auto mb-4 flex items-center justify-center">
                    <div className="w-6 h-6 bg-primary/30 rounded animate-pulse-gentle" />
                  </div>
                  <Skeleton className="w-32 h-6 mx-auto mb-3" />
                  <div className="space-y-2">
                    <Skeleton className="w-full h-4" />
                    <Skeleton className="w-5/6 h-4 mx-auto" />
                    <Skeleton className="w-4/5 h-4 mx-auto" />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </main>

      {/* Loading Indicator */}
      <div className="fixed bottom-8 left-1/2 transform -translate-x-1/2 z-50">
        <Card className="shadow-lg border-primary/20">
          <CardContent className="px-6 py-3 flex items-center space-x-3">
            <div className="flex space-x-1">
              <div className="w-2 h-2 bg-primary rounded-full animate-bounce" />
              <div
                className="w-2 h-2 bg-primary rounded-full animate-bounce"
                style={{ animationDelay: "0.1s" }}
              />
              <div
                className="w-2 h-2 bg-primary rounded-full animate-bounce"
                style={{ animationDelay: "0.2s" }}
              />
            </div>
            <span className="text-sm text-muted-foreground font-medium">
              Growing your experience...
            </span>
          </CardContent>
        </Card>
      </div>

      {/* Floating Elements for Visual Interest */}
      <div className="fixed top-1/4 left-8 opacity-20 pointer-events-none">
        <Leaf
          className="w-8 h-8 text-primary animate-bounce-gentle"
          style={{ animationDelay: "1s" }}
        />
      </div>
      <div className="fixed top-1/3 right-12 opacity-20 pointer-events-none">
        <TreePine
          className="w-6 h-6 text-primary animate-pulse-gentle"
          style={{ animationDelay: "2s" }}
        />
      </div>
      <div className="fixed bottom-1/4 left-16 opacity-20 pointer-events-none">
        <Leaf
          className="w-4 h-4 text-primary animate-bounce-gentle"
          style={{ animationDelay: "0.5s" }}
        />
      </div>
    </div>
  );
}
