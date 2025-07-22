import { Quote, Star, TreesIcon as Tree, Shield } from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";

export function CommunityTestimonials() {
  const testimonials = [
    {
      name: "Maria Santos",
      location: "São Paulo, Brazil",
      avatar: "/placeholder.svg?height=40&width=40",
      role: "Tree Planter",
      trees: 127,
      quote:
        "Mitimara has transformed how I contribute to reforestation. The points system motivates me to plant more trees, and knowing that each one is verified by the community gives me confidence that we're making real impact.",
      badge: "Forest Guardian",
      badgeColor:
        "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400",
    },
    {
      name: "James Chen",
      location: "Vancouver, Canada",
      avatar: "/placeholder.svg?height=40&width=40",
      role: "Verifier",
      verifications: 89,
      quote:
        "As someone who cares about environmental integrity, I love that Mitimara has a robust verification system. The policing points reward me for ensuring only real trees get verified, maintaining the quality of our global forest.",
      badge: "Eco Champion",
      badgeColor:
        "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400",
    },
    {
      name: "Amara Okafor",
      location: "Lagos, Nigeria",
      avatar: "/placeholder.svg?height=40&width=40",
      role: "Community Leader",
      community: "45 members",
      quote:
        "Our local community has planted over 300 trees through Mitimara. The transparent reward system and blockchain verification give us trust that our environmental work is valued and properly documented.",
      badge: "Community Leader",
      badgeColor:
        "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400",
    },
  ];

  return (
    <section className="py-20 bg-gradient-to-b from-gray-50/50 to-white/50 dark:from-muted/20 dark:to-background/50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Voices from Our Global Community
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Hear from tree planters, verifiers, and community leaders who are
            creating real environmental impact through MitiMara&apos;s
            decentralized reforestation network.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {testimonials.map((testimonial, index) => (
            <Card
              key={index}
              className="bg-white/80 dark:bg-background/80 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-shadow"
            >
              <CardContent className="p-6">
                {/* Quote Icon */}
                <Quote className="w-8 h-8 text-muted-foreground/30 mb-4" />

                {/* Testimonial Text */}
                <p className="text-muted-foreground mb-6 leading-relaxed">
                  &quot;{testimonial.quote}&quot;
                </p>

                {/* Rating */}
                <div className="flex items-center gap-1 mb-6">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                      key={star}
                      className="w-4 h-4 fill-amber-400 text-amber-400"
                    />
                  ))}
                </div>

                {/* User Info */}
                <div className="flex items-center gap-3 mb-4">
                  <Avatar className="w-12 h-12">
                    <AvatarImage
                      src={testimonial.avatar || "/placeholder.svg"}
                      alt={testimonial.name}
                    />
                    <AvatarFallback>
                      {testimonial.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <div className="font-semibold">{testimonial.name}</div>
                    <div className="text-sm text-muted-foreground">
                      {testimonial.location}
                    </div>
                  </div>
                </div>

                {/* Stats and Badge */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">
                      {testimonial.role}
                    </span>
                    <div className="flex items-center gap-2">
                      {testimonial.trees && (
                        <>
                          <Tree className="w-4 h-4 text-green-600" />
                          <span className="font-medium">
                            {testimonial.trees} trees
                          </span>
                        </>
                      )}
                      {testimonial.verifications && (
                        <>
                          <Shield className="w-4 h-4 text-blue-600" />
                          <span className="font-medium">
                            {testimonial.verifications} verified
                          </span>
                        </>
                      )}
                      {testimonial.community && (
                        <>
                          <span className="font-medium">
                            {testimonial.community}
                          </span>
                        </>
                      )}
                    </div>
                  </div>

                  <Badge className={`${testimonial.badgeColor} border-0`}>
                    {testimonial.badge}
                  </Badge>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="text-center mt-12">
          <p className="text-muted-foreground mb-4">
            Join thousands of environmental champions making a difference
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Badge
              variant="outline"
              className="bg-white/80 dark:bg-background/80 backdrop-blur-sm px-4 py-2"
            >
              <Tree className="w-4 h-4 mr-2 text-green-600" />
              3,421+ Active Planters
            </Badge>
            <Badge
              variant="outline"
              className="bg-white/80 dark:bg-background/80 backdrop-blur-sm px-4 py-2"
            >
              <Shield className="w-4 h-4 mr-2 text-blue-600" />
              1,847+ Verifiers
            </Badge>
          </div>
        </div>
      </div>
    </section>
  );
}
